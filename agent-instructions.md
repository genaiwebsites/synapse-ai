# Antigravity Agent Build Sequence

**CRITICAL DIRECTIVE:** You are a senior software architect. You understand that code cannot run without infrastructure. You are strictly forbidden from writing code or creating folders until Step 0 is fully satisfied. You must interactively guide the human user through the cloud configuration.

## Step 0: Cloud Infrastructure & Environment Setup (Interactive)
1. **Stop and Ask:** Ask the user if they have created their Firebase project and enabled Google SSO in the Firebase Auth console.
2. **Verify APIs:** Ask the user if they have manually enabled the **Google Sheets API** in their Google Cloud Console.
3. **Verify OAuth Scopes:** Remind the user to add `kshitiz.abudyog@gmail.com` to the "Test Users" section of their OAuth Consent Screen.
4. **Collect Configuration:** Ask the user to paste their Firebase configuration object (`firebaseConfig`).
5. **Environment Creation:** Once provided, create a `.env.local` file in the root directory and populate it with the Firebase environment variables using the exact conventions required by Next.js (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.).
*DO NOT MOVE TO STEP 1 UNTIL THE .ENV.LOCAL FILE IS SUCCESSFULLY CREATED AND VALIDATED.*

## Step 1: Frontend Scaffolding & Auth
1. Initialize the Next.js App Router project with Tailwind CSS.
2. Integrate Shadcn UI for basic components (buttons, inputs, cards).
3. Set up Firebase Auth and build a modern Google SSO Login page that references the keys stored in `.env.local`.
4. Create a protected layout for the dashboard. If a user is not authenticated, redirect them to login.
*STOP and wait for user review.*

## Step 2: The ECharts Framework
1. Create a dashboard view with a modern layout following `ui-ux.md`.
2. Implement 3 distinct Apache ECharts (Sales Bar Chart, Purchase Line Chart, Lab Quality Pie Chart) using hardcoded dummy data reflecting a Rice Bran Oil manufacturing business.
3. Implement the `html2canvas` and `file-saver` pixel-perfect image export button.
*STOP and wait for user review.*

## Step 3: Google Sheets & Webhook Integration
1. **Generate Script:** Write a high-performance Google Apps Script (`.gs`) snippet. This script must use an `onEdit(e)` trigger to send a lightweight JSON POST payload containing the spreadsheet ID to your Firebase Cloud Function URL whenever a cell changes. Present this script cleanly to the user and instruct them exactly how to paste it into their Google Sheet.
2. **Write Cloud Function:** Create the Firebase Cloud Function backend endpoint to receive the Apps Script POST request. On receipt, write a new timestamp to a Firestore collection (`dashboards/jeevan_rekha/sync_metadata`).
3. **Connect Frontend:** Update the Next.js frontend to use Firestore's real-time listener (`onSnapshot`) targeting that metadata document. When a change is detected, trigger an API fetch using the user's OAuth token to pull raw data from the client's Google Sheet API, parse it, update the ECharts state dynamically, and refresh the "Last Synced at [Timestamp]" text.
*STOP and wait for user review (End of Phase 1).*

## Step 4: Conversational AI Backend Setup
1. Scaffold the Python FastAPI backend optimized for Google Cloud Run deployment.
2. Write the OAuth 2.0 token propagation logic so the backend can securely pass the user's Google session credentials to the Google Drive and Gmail API clients.
3. Expose a secure POST endpoint (`/api/chat`) to receive natural language questions from the Next.js UI.
*STOP and wait for user review.*

## Step 5: Gemini Orchestration
1. Integrate the Gemini 3.5 Flash API into the Python environment.
2. Build the data gathering loop: Query received -> Scan Google Drive/Gmail indices -> Pull matching text/document chunks -> Inject chunks as context alongside the prompt to Gemini -> Stream the structured Markdown response back to the client UI.
3. Build the Next.js chat interface to render the streamed response using beautiful, responsive Markdown wrappers.
*STOP and wait for final enterprise review.*