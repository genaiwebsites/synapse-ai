from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import google.generativeai as genai
import os
import json
import logging
import asyncio
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_schema():
    schema_path = os.path.join(os.path.dirname(__file__), '..', 'dashboard_schema.json')
    with open(schema_path, 'r', encoding='utf-8') as f:
        return json.load(f)

app = FastAPI(title="Synapse AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

def get_google_credentials(authorization: str = Header(None)) -> Credentials:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    try:
        return Credentials(token=parts[1])
    except Exception as e:
        logger.error(f"Failed to create credentials: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

def search_workspace(query: str, creds: Credentials) -> str:
    """Uses the delegated credentials to search Gmail and Drive for context."""
    context = ""
    
    # 1. Search Gmail
    try:
        gmail_service = build('gmail', 'v1', credentials=creds, static_discovery=False)
        results = gmail_service.users().messages().list(userId='me', q=query, maxResults=3).execute()
        messages = results.get('messages', [])
        if messages:
            context += "--- RECENT GMAIL MESSAGES ---\n"
            for msg in messages:
                msg_data = gmail_service.users().messages().get(userId='me', id=msg['id'], format='snippet').execute()
                context += f"Snippet: {msg_data.get('snippet', '')}\n"
    except Exception as e:
        logger.warning(f"Gmail search failed: {e}")

    # 2. Search Drive
    try:
        drive_service = build('drive', 'v3', credentials=creds, static_discovery=False)
        results = drive_service.files().list(q=f"fullText contains '{query}'", spaces='drive', fields='files(id, name)', pageSize=3).execute()
        files = results.get('files', [])
        if files:
            context += "--- RECENT GOOGLE DRIVE FILES ---\n"
            for file in files:
                context += f"Filename: {file.get('name')}\n"
    except Exception as e:
        logger.warning(f"Drive search failed: {e}")
        
    return context or "No relevant emails or documents found in Google Workspace."

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, creds: Credentials = Depends(get_google_credentials)):
    logger.info(f"Received query: {request.query}")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured on the server.")

    # 1. Extract context from Workspace (offloaded to thread to prevent blocking event loop)
    workspace_context = await asyncio.to_thread(search_workspace, request.query, creds)
    
    # 2. Construct prompt
    prompt = f"""
You are Synapse AI, an intelligent manufacturing assistant.
Answer the user's query based on the following context retrieved securely from their Google Workspace (Gmail/Drive).
If the context doesn't contain the answer, say so politely.

Context:
{workspace_context}

User Query:
{request.query}
"""

    # 3. Call Gemini API asynchronously and stream
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-3.5-flash')
    
    async def generate():
        try:
            response = await model.generate_content_async(prompt, stream=True)
            async for chunk in response:
                try:
                    if chunk.text:
                        yield chunk.text
                except ValueError:
                    yield "\n[Content blocked by safety settings]"
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            yield f"\n\nError generating response: {str(e)}"
            
    return StreamingResponse(generate(), media_type="text/plain")

@app.get("/api/sheets/{spreadsheet_id}/metadata")
async def get_sheet_metadata(spreadsheet_id: str, creds: Credentials = Depends(get_google_credentials)):
    logger.info(f"Fetching metadata for spreadsheet: {spreadsheet_id}")
    try:
        # Offload blocking network calls
        def fetch_metadata():
            sheets_service = build('sheets', 'v4', credentials=creds, static_discovery=False)
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            
            metadata = {
                "title": spreadsheet.get("properties", {}).get("title"),
                "tabs": []
            }
            
            for sheet in spreadsheet.get('sheets', []):
                title = sheet.get("properties", {}).get("title")
                
                # Fetch first row (headers)
                try:
                    result = sheets_service.spreadsheets().values().get(
                        spreadsheetId=spreadsheet_id, 
                        range=f"'{title}'!1:1"
                    ).execute()
                    headers = result.get('values', [[]])[0] if result.get('values') else []
                except Exception as e:
                    logger.warning(f"Failed to fetch headers for tab '{title}': {e}")
                    headers = []
                    
                tab_data = {
                    "name": title,
                    "headers": headers
                }
                metadata["tabs"].append(tab_data)
                
            return metadata

        metadata = await asyncio.to_thread(fetch_metadata)
        logger.info(f"--- RAW SPREADSHEET STRUCTURAL PAYLOAD ---")
        logger.info(metadata)
        return metadata
    except Exception as e:
        logger.error(f"Failed to fetch spreadsheet metadata: {e}")
        err_msg = str(e)
        if any(term in err_msg.lower() for term in ["credential", "token", "refresh", "401"]):
            raise HTTPException(status_code=401, detail="Google OAuth session expired. Please sign out and sign in again.")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sheets/{spreadsheet_id}/data")
async def get_sheet_data(spreadsheet_id: str, creds: Credentials = Depends(get_google_credentials)):
    logger.info(f"Fetching actual data for spreadsheet {spreadsheet_id}")
    def fetch_data():
        sheets_service = build('sheets', 'v4', credentials=creds, static_discovery=False)
        schema = load_schema()
        sheet_range = schema.get("sheetRange", "'RRBO Sales Report'!A:E")
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id, 
            range=sheet_range
        ).execute()
        
        rows = result.get('values', [])
        parsed_data = []
        columns_config = schema.get("columns", [])
        
        for row in rows:
            if len(row) < len(columns_config):
                continue
                
            # Skip the header rows and total rows
            val_0 = str(row[0]).strip()
            if not val_0 or val_0.lower() == "oil type" or val_0.lower().startswith("total"):
                continue
                
            record = {}
            for col in columns_config:
                idx = col["index"]
                key = col["key"]
                col_type = col.get("type", "string")
                
                raw_val = row[idx].strip() if idx < len(row) else ""
                
                if col_type == "number":
                    try:
                        clean_val = raw_val.replace(',', '').strip()
                        record[key] = float(clean_val) if clean_val else 0.0
                    except ValueError:
                        record[key] = 0.0
                else:
                    record[key] = raw_val
                    
            parsed_data.append(record)
            
        return parsed_data

    try:
        data = await asyncio.to_thread(fetch_data)
        return data
    except Exception as e:
        logger.error(f"Failed to fetch sheet data: {e}")
        err_msg = str(e)
        if any(term in err_msg.lower() for term in ["credential", "token", "refresh", "401"]):
            raise HTTPException(status_code=401, detail="Google OAuth session expired. Please sign out and sign in again.")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/health")
def health_check():
    return {"status": "ok"}
