# Infrastructure & Security Setup Guide (Synapse)

**Role:** This document serves as the immutable record of the manual cloud infrastructure configured by the Developer (`horizonwebcorp@gmail.com`).
**Agent Directive:** The AI Agent MUST assume these steps are completed and verified before executing Step 1 of `agent-instructions.md`. Do not attempt to script or automate the creation of these resources.

## 1. Firebase Core & Authentication Setup
*Status: COMPLETED*

1. **Project Creation:** A Firebase project named `Synapse` was created at `console.firebase.google.com`. Google Analytics is disabled.
2. **Web App Registration:** A web app named `synapse-web` was registered to generate the core `firebaseConfig` object containing the `apiKey`, `authDomain`, `projectId`, etc.
3. **Authentication:** The Google Sign-In provider was enabled under `Build > Authentication`.
   * **CRITICAL PRODUCTION STEP:** For production deployments (e.g., Vercel), you MUST manually add your live domain (e.g., `synapse-xxx.vercel.app`) to the **Authorized domains** list under `Authentication > Settings > Authorized domains`. Otherwise, Google will silently block the login popup on the live site.
4. **Database:** Firestore was initialized under `Build > Firestore Database` and set to **Test Mode** to allow unrestricted reads/writes during the initial 30-day development sprint.

## 2. Google Cloud APIs & OAuth Verification
*Status: COMPLETED*

Because the app requires broad access to Workspace data (Restricted Scopes), the underlying Google Cloud Project (GCP) was manually configured.

1. **Test User Whitelisting (New UI):** * Navigated to `APIs & Services > Google Auth Platform > Audience`.
   * The app type is set to **External**.
   * Under the "Test users" section, the following emails were explicitly added to prevent "App not verified" login blocks:
     * `horizonwebcorp@gmail.com` (Developer)
     * `kshitiz.abudyog@gmail.com` (Client)
2. **API Library Activation:** * Navigated to `APIs & Services > Library`.
   * The following three APIs were manually enabled:
     * **Google Sheets API** (For Phase 1 Dashboards)
     * **Google Drive API** (For Phase 2 AI Context)
     * **Gmail API** (For Phase 2 AI Context)

## 3. Local Environment Variables (`.env.local`)
*Status: PENDING AGENT INITIALIZATION (Step 0)*

The agent will prompt the developer for the `firebaseConfig` block and generate a `.env.local` file in the Next.js root directory. It must map exactly to Next.js public variables:
* `NEXT_PUBLIC_FIREBASE_API_KEY`
* `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
* `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
* `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
* `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
* `NEXT_PUBLIC_FIREBASE_APP_ID`

## 4. The Google Sheets Webhook Bridge
*Status: DEFERRED TO PHASE 1 (Step 3)*

This step cannot be completed until the AI agent writes the backend logic. During Step 3 of development, the following manual action will be taken:
1. The AI Agent will generate a customized `onEdit` Google Apps Script snippet.
2. The Developer/Client will open the target Rice Bran Oil spreadsheet.
3. Navigate to **Extensions > Apps Script**, paste the agent's code, and click Save.
4. The Developer will run the script once manually to accept Google's permission prompt, allowing the spreadsheet to send real-time POST webhooks to the Firebase Cloud Function.