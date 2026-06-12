# Synapse Project: Strict Recovery & Debugging Protocol

**CRITICAL AGENT DIRECTIVE:** Your previous execution failed to meet the enterprise standards defined in `prd.md` and `ui-ux.md`. You hardcoded data, failed API connections, and generated generic, non-compliant UI. 
You are now operating under **Strict Micro-Management Mode**. You will execute the following steps ONE AT A TIME. 
* **RULE 1:** Do NOT execute the next step until the Developer explicitly types "APPROVED".
* **RULE 2:** If you are missing environment variables, IDs, or context to complete a step, STOP and ask the Developer. Do not fake or hardcode the data.
* **RULE 3:** All UI must strictly follow the "Modern Enterprise Glassmorphism" rules in `ui-ux.md`.

---

## Phase 1: Foundation & Dynamic UI Skeleton Recovery

### Step 1.1: Clean Slate & Unified Layout
1. Delete or comment out any broken, generic dashboard UI components.
2. Build a unified `DashboardLayout` component (`src/components/layout/DashboardLayout.tsx`).
3. **Sidebar:** Create a fixed, left-side navigation panel featuring links for "Sales", "Purchases", "Lab Reports", and "Synapse AI Chat". 
4. **Styling:** Use premium Tailwind classes matching `ui-ux.md` (e.g., `bg-white/40 backdrop-blur-md border-r border-white/20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`). 
5. Render a blank main content area next to the sidebar.
*WAIT FOR USER APPROVAL. Do not build charts yet.*

### Step 1.2: Existing Landing Page Integration
1. Ask the Developer for the code/structure of their existing landing page.
2. Integrate the existing landing page into `app/page.tsx`.
3. Hook the existing login button to the `signInWithPopup` Firebase Auth function. Set the successful redirect to `/dashboard/sales`.
*WAIT FOR USER APPROVAL.*

---

## Phase 2: Autonomous Dashboard Analytics Pipeline

### Step 2.1: Secure API Data Fetching (Backend Test)
1. Write a server-side utility or API route to fetch raw rows and metadata from the Developer's Google Sheet using the verified OAuth token.
2. **Ask the Developer:** "Please provide the exact Google Sheet ID you want to use." (The backend should dynamically query *all* visible tab names inside this sheet).
3. Execute the fetch and console log the raw structural payload (Tab names and Header rows) to prove the API connection works.
*WAIT FOR USER TO CONFIRM THEY SEE THE JSON STRUCTURE.*

### Step 2.2: Generative Dashboard Orchestration (The Intelligence Layer)
1. Integrate Gemini 3.5 Flash into this dashboard data pipeline.
2. Write a prompt that sends the spreadsheet schema (Tab names, columns, and data samples) to Gemini.
3. Instruct Gemini to act as a **Chief Data Officer** and autonomously respond with a strict JSON schema that dictates:
   * **KPI Cards:** What high-level metrics should be calculated and displayed at the top (e.g., Total Sales, Average Margin, Total Volume) based on modern industry standards.
   * **Chart Inventory:** Exactly how many charts are needed to represent this data effectively, what types they should be (e.g., Stacked Bar, Area Trend, Scatter Plot), and what columns