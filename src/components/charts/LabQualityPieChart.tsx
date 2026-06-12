"use client";

import ReactECharts from "echarts-for-react";

export function LabQualityPieChart({ data }: { data: any[] }) {
  const options = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center" },
    series: [
      {
        name: "FFA Distribution",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false, position: "center" },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: "bold" },
        },
        labelLine: { show: false },
        data: data,
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: "300px", width: "100%" }} />;
}
