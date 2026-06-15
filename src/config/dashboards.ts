export const jeevanRekhaDashboardConfig = {
  id: "jeevan_rekha_sales",
  spreadsheetId: "1nqTsRsYg0_iye9OblBoneGFfM4bqRBZ6kdG-tzYHfpE",
  schema: {
    kpis: [
      { id: "kpi_total_volume", title: "Total Volume (Litres)", description: "Total Rice Bran Oil conversion", calculation: "Sum of CONVERSION (LITRES)" },
      { id: "kpi_total_qty", title: "Total Delivery (Qty)", description: "Total units delivered across all packaging", calculation: "Sum of DELIVERY SALE (QTY)" }
    ],
    charts: [
      { id: "chart_monthly_trend", title: "Monthly Volume Trend", type: "bar", xAxis: "MONTH", yAxis: "CONVERSION (LITRES)" },
      { id: "chart_packaging", title: "Volume by Packaging", type: "pie", xAxis: "ITEM NAME", yAxis: "CONVERSION (LITRES)" }
    ],
    filters: ["MONTH", "ITEM NAME"]
  }
};
