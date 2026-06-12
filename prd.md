# Product Requirements Document (PRD) - Synapse

## 1. Product Vision
Synapse is an enterprise-grade, B2B data orchestration and visualization platform. It connects directly to a client's Google Workspace to transform scattered, unstructured data (Google Sheets, PDFs, Gmail) into actionable dashboards and a conversational AI interface.

## 2. Target Audience
Traditional manufacturing executives (e.g., Jeevan Rekha brand - rice bran oil manufacturing) who need immediate insights without navigating complex ERP software. 

## 3. Phased Implementation

### Phase 1: Dashboard Analytics (Real-Time Reactive UI)
* **Authentication:** Google SSO restricted to read-only Workspace scopes.
* **Data Source:** Client's Google Sheets.
* **Sync Mechanism:** Google Apps Script webhook triggers on cell edit -> updates Firestore timestamp -> Next.js frontend auto-refreshes data.
* **UI/UX:** Interactive, deep drill-down Apache ECharts with robust filtering.
* **Export:** High-definition image export of active charts with complete UI framing.

### Phase 2: Conversational Analytics (GenAI Brain)
* **Data Scavenging:** Broad Google Workspace scanning (Drive, Gmail).
* **Processing:** Unstructured document parsing (PDFs, docs) into vectorized formats.
* **Interface:** Chatbot UI that returns answers in rich markdown (tables, lists) with clickable citations to source files.
* **Memory:** Contextual conversation history per session.

## 4. Acceptance Criteria for Vibe Coding
* No mock data allowed in final commits; all components must connect to Firebase/Google APIs.
* Strict adherence to the `ui-ux.md` guidelines for a modern, enterprise look.
* Zero console errors on deployment.

## 5. Infrastructure & Security Governance (Human-Managed)
Because this app relies heavily on the Google/Firebase cross-domain ecosystem, the following manual prerequisites must be maintained by the Developer (`horizonwebcorp@gmail.com`) prior to code execution:
* **Firebase Core:** Active Firebase project with Firestore initialized in test mode.
* **Google Developer Console:** Verified OAuth Consent Screen set to "External" with developer and client (`kshitiz.abudyog@gmail.com`) emails explicitly whitelisted as "Test Users".
* **API Whitelisting:** Manual activation of Google Sheets, Google Drive, and Gmail APIs within the Google Cloud Platform (GCP) project dashboard.
* **Workspace Webhook Bridge:** Manual deployment of the agent-generated Apps Script into the client's target Google Sheet.