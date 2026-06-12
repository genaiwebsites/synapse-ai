"use client";

import ReactECharts from "echarts-for-react";

export function PurchaseLineChart({ data }: { data: number[] }) {
  const options = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "Price (INR/MT)",
      splitLine: { lineStyle: { type: "dashed", color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Raw Bran Price",
        type: "line",
        smooth: true,
        data: data,
        itemStyle: { color: "#06B6D4" },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0)' }
            ]
          }
        }
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: "300px", width: "100%" }} />;
}
