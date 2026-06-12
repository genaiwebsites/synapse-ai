# Tech Stack & Architecture

## 1. Core Frameworks
* **Frontend Framework:** Next.js (App Router, React 18+)
* **Language:** TypeScript (Strict mode enabled)
* **Styling:** Tailwind CSS + Shadcn UI (for accessible, modern base components)

## 2. Phase 1 Infrastructure (Google/Firebase Ecosystem)
* **Auth:** Firebase Authentication (Google Auth Provider)
* **Database:** Firebase Firestore (NoSQL, utilized for real-time sync timestamps and user metadata)
* **Backend (Lightweight):** Firebase Cloud Functions (Node.js) to handle Google Apps Script webhooks.
* **Data Visualization:** Apache ECharts (via `echarts-for-react`)
* **Export Utility:** `html2canvas` and `file-saver`

## 3. Phase 2 Infrastructure (AI & Heavy Processing)
* **Backend (Heavy):** Google Cloud Run deployed via Docker (Python 3.11+, FastAPI)
* **AI Orchestration:** Google Gemini 3.5 Flash API (via native Google SDKs)
* **Vector Database:** Firestore Vector Search
* **File Storage:** Google Cloud Storage (GCS)
* **Workspace Connectors:** Google Drive API v3, Gmail API (Python Client Libraries)

## 4. Deployment
* **Frontend:** Vercel or Firebase Hosting
* **Backend:** Firebase Functions & Google Cloud Run