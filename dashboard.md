# Dashboard Configuration Architecture

This file documents how the static dashboard schema works for Synapse AI. To eliminate LLM latency, save costs, and guarantee reliability, the dashboard layout is managed through a central TypeScript configuration file instead of dynamic AI generation.

## 1. Central Config File
**Location:** `src/config/dashboards.ts`

This file is the Single Source of Truth for how dashboards render. It defines exactly what filters to show, what KPIs to calculate, and what charts to render based on the raw spreadsheet data.

### Example Schema
```typescript
export const jeevanRekhaDashboardConfig = {
  id: "jeevan_rekha_sales",
  spreadsheetId: "1nqTsRsYg0_iye9OblBoneGFfM4bqRBZ6kdG-tzYHfpE",
  schema: {
    kpis: [ ... ],
    charts: [ ... ],
    filters: [ ... ]
  }
};
```

## 2. Component Logic (`src/app/dashboard/page.tsx`)

The React component purely consumes this configuration. It performs standard `.reduce()` and `.map()` calculations on the raw `rawSheetData` matching against the `schema` IDs.

### Adding a New KPI
1. Add an entry to the `kpis` array in `dashboards.ts`.
2. Give it a unique `id` (e.g., `kpi_total_revenue`).
3. In `page.tsx`, within the `kpis.map` render logic, add an `else if (kpi.id === 'kpi_total_revenue')` condition to handle the calculation logic (e.g., `reduce` on the Revenue column).

### Adding a New Chart
1. Add an entry to the `charts` array in `dashboards.ts`. Specify the `type` (`bar`, `pie`, `line`).
2. Set the `xAxis` and `yAxis` titles matching the Spreadsheet Column names.
3. In `page.tsx`, within the `charts.map` render logic, process the array of `filteredData` into the `xAxisData` and `seriesData` required by ECharts based on your chart's `id`.

### Adding a New Filter
1. Simply add the EXACT column name to the `filters` array in `dashboards.ts` (e.g., `"REGION"`).
2. The UI will automatically render a dropdown for it and perform AND-based filtering across all active filters.

## 3. Vibe Coding Guidelines
If you are an AI Agent tasked with modifying the dashboard in the future:
- **Do not use the Gemini LLM for layout generation.** Rely entirely on `dashboards.ts`.
- **Modifying Data:** If the user adds a new sheet column, update the calculation logic in `page.tsx` and add the metadata to `dashboards.ts`.
- **New Dashboards:** If the user wants to add an entirely new Google Sheet, create a new config object in `dashboards.ts` and set up routing to switch between configurations.
