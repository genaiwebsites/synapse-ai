# Centralized Schema Dashboard Architecture

This file documents the centralized, schema-driven dashboard configuration structure for Synapse AI. To eliminate latency and API costs while maintaining flexibility, all column mappings, KPI metrics, chart aggregates, and filters are defined in a single root-level JSON file.

## 1. The Central Schema File
**Location:** `backend/dashboard_schema.json`

This file is the **Single Source of Truth** for both the Next.js React frontend and the FastAPI Python backend.

```json
{
  "spreadsheetId": "1nqTsRsYg0_iye9OblBoneGFfM4bqRBZ6kdG-tzYHfpE",
  "sheetRange": "'RRBO Sales Report'!A:E",
  "columns": [
    { "index": 0, "key": "OIL TYPE", "headerName": "OIL TYPE", "type": "string" },
    { "index": 1, "key": "ITEM NAME", "headerName": "ITEM NAME", "type": "string" },
    { "index": 2, "key": "DELIVERY SALE (QTY)", "headerName": "DELIVERY SALE (QTY)", "type": "number" },
    { "index": 3, "key": "CONVERSION (LITRES)", "headerName": "CONVERSION (LITRES)", "type": "number" },
    { "index": 4, "key": "MONTH", "headerName": "MONTH", "type": "string" }
  ],
  "kpis": [
    {
      "id": "kpi_total_volume",
      "title": "Total Volume (Litres)",
      "description": "Total Rice Bran Oil conversion",
      "operation": "sum",
      "targetKey": "CONVERSION (LITRES)",
      "format": "volume"
    }
  ],
  "charts": [
    {
      "id": "chart_monthly_trend",
      "title": "Monthly Volume Trend",
      "type": "bar",
      "groupByKey": "MONTH",
      "targetKey": "CONVERSION (LITRES)",
      "operation": "sum"
    }
  ],
  "filters": ["MONTH", "ITEM NAME"]
}
```

---

## 2. Backend Processing (`backend/main.py`)
The Python server reads `dashboard_schema.json` at startup. When parsing Google Sheets rows from the configured `sheetRange`:
1. It validates that the row has enough columns matching `columns`.
2. It strips and skips rows containing headers or "Total" labels.
3. For each configured column, it extracts the cell value by `index`.
4. It casts numeric values to floats (replacing commas) if configured as `type: "number"`.
5. It outputs a standardized JSON payload mapping cell values to `key`.

---

## 3. Frontend Rendering (`src/app/dashboard/page.tsx`)
The React application loads `dashboard_schema.json` directly. The frontend is fully dynamic:

* **Global Filters:** Dynamically builds dropdowns and filters data matching the keys specified in the `filters` array.
* **KPI Calculations:** Iterates through `kpis` and dynamically runs calculations (`sum`, `count`, or `average`) on the `targetKey` column across the filtered data.
* **ECharts Aggregation:** Iterates through `charts`, grouping and aggregating row values matching the configured `groupByKey` and `targetKey` using the specified `operation`, then supplies the data directly to Apache ECharts.

---

## 4. How to Extend the Dashboard

### Adding a New Column
1. Ensure the backend sheet range fetches the column. Update `sheetRange` in `dashboard_schema.json` if necessary (e.g. `'RRBO Sales Report'!A:F`).
2. Add a new item to the `columns` array in `dashboard_schema.json`. Define its `index`, standard `key` name, `headerName`, and `type`.

### Adding a New Filter
1. Just add the exact standardized column key name to the `filters` array in `dashboard_schema.json`. The React UI will automatically build the dropdown and handle multi-filter combinations.

### Adding a New KPI
1. Add an entry to the `kpis` array in `dashboard_schema.json`.
2. Specify the `title`, `description`, `operation` (`sum`/`count`/`average`), `targetKey`, and `format` (`volume`/`units`). The dashboard will dynamically compute and display it.

### Adding a New Chart
1. Add an entry to the `charts` array in `dashboard_schema.json`.
2. Specify the `title`, `type` (`bar`/`pie`), `groupByKey`, `targetKey`, and `operation` (`sum`/`count`). The grid will dynamically compute values, select appropriate styling/colors, and render the new EChart component.
