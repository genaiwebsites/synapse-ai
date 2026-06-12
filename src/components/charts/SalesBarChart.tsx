"use client";

import ReactECharts from "echarts-for-react";

export function SalesBarChart({ data }: { data: number[] }) {
  const options = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "Sales (MT)",
      splitLine: { lineStyle: { type: "dashed", color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Refined Oil Sales",
        type: "bar",
        data: data,
        itemStyle: { color: "#4F46E5", borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: "300px", width: "100%" }} />;
}
