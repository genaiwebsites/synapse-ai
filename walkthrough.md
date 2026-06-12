# Project Implementation Walkthrough

This document serves as the comprehensive log of all architectural changes, UI updates, features, bug fixes, and manual setup configurations implemented throughout the project lifecycle.

## Phase 1: Foundation & Dynamic UI Skeleton
- **Project Initialization:** Bootstrapped Next.js 15 (App Router) with TypeScript, Tailwind CSS v4, and Shadcn UI components.
- **Firebase Auth Context:** Built a global authentication context listening to Firebase `onAuthStateChanged`.
- **Dynamic Landing Page Integration:** Integrated the custom landing page code and successfully hooked the existing "Sign in with Google Workspace" button to the Firebase `signInWithPopup` method. 
- **Premium Collapsible Sidebar:** Rebuilt the `DashboardLayout` side menu. Implemented a collapsible state with smooth transition animations. When collapsed, it elegantly shows only perfectly aligned icons. Added hover micro-interactions, active states, and a clear toggle button, strictly adhering to the "Modern Enterprise Glassmorphism" aesthetic.

## Phase 2: Autonomous Dashboard Analytics Pipeline
- **Monorepo Architecture (Vercel):** Transitioned the app from a frontend-only Vercel deployment to a full-stack monorepo. Added a FastAPI Python backend. Created a `vercel.json` file configuring rewrites so that frontend Next.js traffic routes to `/` and API traffic routes to `/_/backend`.
- **Server-Side Data Engine:** Built a Python endpoint using `pandas` to securely fetch raw data from the Jeevan Rekha Rice Bran Oil Google Spreadsheet.
- **Generative AI Orchestration:** Integrated the new `google-genai` SDK for Gemini 1.5 Flash. Built the `/api/orchestrate` endpoint where Gemini acts as a Chief Data Officer, autonomously reading the spreadsheet metadata and outputting a strict JSON schema dictating KPI metrics and EChart configurations.

## Phase 3: The Live Data Engine & Real-Time Sync
- **Dynamic ECharts Rendering:** Implemented React logic to parse the Gemini JSON schema and dynamically render interactive Apache ECharts (Bar, Line, Pie) and KPI summary cards directly from the live spreadsheet data.
- **Automated Fallback Polling (1-Hour Interval):** Built a foolproof `setInterval` mechanism into `page.tsx` that silently queries the backend every 1 hour (3600000ms) to pull the newest data without user intervention or excessive API rate consumption.
- **Live Sync UI Indicators:**
  - Added a pulsing "Live Sync Active" badge.
  - Built a manual Refresh button with a spinning loading state.
  - Built an accurate "Last Synced" timestamp tracker that records the exact local time the client successfully downloaded data.
- **Webhook Readiness:** Wired the React frontend to silently listen to a Firestore `onSnapshot` stream (`dashboards/jeevan_rekha/sync_metadata/latest`). When the Google Sheets webhook successfully updates the database, React detects the timestamp change and instantly triggers a background data refresh without a page reload.

## Manual Configurations & Critical Bug Fixes
- **[Fix] `auth/cancelled-popup-request` Crash:** Added a React state (`isLoggingIn`) to the `AuthPortal` login button. It now immediately disables itself upon click, preventing users from double-clicking and crashing the Firebase authentication flow.
- **[Fix] Vercel API 404 Network Errors:** Created a `getApiBaseUrl()` utility in React. It dynamically routes `fetch()` requests to `http://localhost:8080` during local development, but swaps to the `/_/backend` prefix when deployed to Vercel.
- **[Fix] React Stale Closure on Webhooks:** Patched a bug in `page.tsx` where the `onSnapshot` listener lost track of the dashboard state. Moved `generatedSchema` tracking to a React `useRef` to prevent infinite re-render loops and guarantee webhook triggers are fired accurately.
- **[Manual Setup] Firebase Vercel Domain Whitelisting:** *CRITICAL ISSUE RESOLVED.* Updated `setup.md` to permanently document that Vercel domains (`xxx.vercel.app`) MUST be manually added to the Firebase **Authorized domains** list (`Authentication > Settings > Authorized domains`). This fixed the issue where the login popup instantly closed on the live site but worked locally.
- **[Manual Setup] Webhook Infrastructure Guide:** Created a dedicated `webhook-setup.md` file. It completely documents the 3 exact manual steps required for a developer to deploy the Firebase Cloud Function, configure the Google Apps Script (`webhook.gs`), and create the Google Sheet "On Edit" trigger.
- **[Manual Setup] Firebase Blaze Pricing Plan:** Updated `webhook-setup.md` to explicitly clarify that deploying Cloud Functions requires upgrading the Firebase project to the "Blaze" pay-as-you-go plan (which has a 2 million invocation free tier) and that this is completely separate from consumer Google AI Pro subscriptions.
