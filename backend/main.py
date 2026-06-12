from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import google.generativeai as genai
import os
import logging
import asyncio
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sheets/{spreadsheet_id}/data")
async def get_sheet_data(spreadsheet_id: str, creds: Credentials = Depends(get_google_credentials)):
    logger.info(f"Fetching actual data for spreadsheet {spreadsheet_id}")
    def fetch_data():
        sheets_service = build('sheets', 'v4', credentials=creds, static_discovery=False)
        # Assuming the tab name is 'RRBO Sales Report' based on previous metadata fetch
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id, 
            range="'RRBO Sales Report'!A:E"
        ).execute()
        
        rows = result.get('values', [])
        parsed_data = []
        
        for row in rows:
            # Skip empty rows or sub-headers (like "APRIL 2026")
            if len(row) < 5:
                continue
                
            oil_type = row[0].strip()
            # Skip the header rows and total rows
            if oil_type.upper() == "OIL TYPE" or oil_type.lower().startswith("total") or not oil_type:
                continue
                
            item_name = row[1].strip()
            
            # Parse numbers robustly (handling commas)
            try:
                qty_str = row[2].replace(',', '').strip()
                qty = float(qty_str) if qty_str else 0.0
            except ValueError:
                qty = 0.0
                
            try:
                litres_str = row[3].replace(',', '').strip()
                litres = float(litres_str) if litres_str else 0.0
            except ValueError:
                litres = 0.0
                
            month = row[4].strip()
            
            parsed_data.append({
                "OIL TYPE": oil_type,
                "ITEM NAME": item_name,
                "DELIVERY SALE (QTY)": qty,
                "CONVERSION (LITRES)": litres,
                "MONTH": month
            })
            
        return parsed_data

    try:
        data = await asyncio.to_thread(fetch_data)
        return data
    except Exception as e:
        logger.error(f"Failed to fetch sheet data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class OrchestrateRequest(BaseModel):
    spreadsheet_id: str

@app.post("/api/orchestrate")
async def orchestrate_dashboard(request: OrchestrateRequest, creds: Credentials = Depends(get_google_credentials)):
    logger.info(f"Orchestrating dashboard for {request.spreadsheet_id}")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    def fetch_samples():
        sheets_service = build('sheets', 'v4', credentials=creds, static_discovery=False)
        spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=request.spreadsheet_id).execute()
        
        samples = {}
        for sheet in spreadsheet.get('sheets', []):
            title = sheet.get("properties", {}).get("title")
            try:
                # Fetch first 15 rows to give Gemini enough context to find the true headers
                result = sheets_service.spreadsheets().values().get(
                    spreadsheetId=request.spreadsheet_id, 
                    range=f"'{title}'!1:15"
                ).execute()
                samples[title] = result.get('values', [])
            except Exception as e:
                logger.warning(f"Failed to fetch sample for tab '{title}': {e}")
                
        return samples

    try:
        samples = await asyncio.to_thread(fetch_samples)
    except Exception as e:
        logger.error(f"Failed to fetch samples: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    prompt = f"""
You are the Chief Data Officer for a modern enterprise dashboard.
I am providing you with a raw data sample from a Google Spreadsheet.
Note that the first row might just be a title. You need to inspect the data to figure out the actual column headers and the data types.

DATA SAMPLES:
{samples}

Based on this data, construct a highly effective dashboard layout.
Respond with a STRICT JSON payload matching this exact schema:
{{
  "kpis": [
    {{ "id": "kpi_1", "title": "Total Sales", "description": "Overall sales volume", "calculation": "Sum of Column X" }}
  ],
  "charts": [
    {{ "id": "chart_1", "title": "Sales by Month", "type": "bar", "xAxis": "Month Column", "yAxis": "Sales Column" }}
  ],
  "filters": [
    "Month", "Region"
  ]
}}

Output ONLY valid JSON. Do not use markdown wrapping like ```json.
"""
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-3.5-flash')
    
    try:
        # TODO: Remove this mock once the 24-hour Gemini quota resets or billing is upgraded.
        # response = await model.generate_content_async(prompt)
        # text = response.text.strip()
        # if text.startswith("```json"):
        #     text = text[7:-3]
        # elif text.startswith("```"):
        #     text = text[3:-3]
        
        # MOCKED RESPONSE FOR OPTION A
        text = """
        {
          "kpis": [
            { "id": "kpi_total_volume", "title": "Total Volume (Litres)", "description": "Total Rice Bran Oil conversion", "calculation": "Sum of CONVERSION (LITRES)" },
            { "id": "kpi_total_qty", "title": "Total Delivery (Qty)", "description": "Total units delivered across all packaging", "calculation": "Sum of DELIVERY SALE (QTY)" }
          ],
          "charts": [
            { "id": "chart_monthly_trend", "title": "Monthly Volume Trend", "type": "bar", "xAxis": "MONTH", "yAxis": "CONVERSION (LITRES)" },
            { "id": "chart_packaging", "title": "Volume by Packaging", "type": "pie", "xAxis": "ITEM NAME", "yAxis": "CONVERSION (LITRES)" }
          ],
          "filters": [
            "MONTH", "ITEM NAME"
          ]
        }
        """
            
        import json
        json_data = json.loads(text)
        return json_data
    except Exception as e:
        logger.error(f"Gemini generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}
