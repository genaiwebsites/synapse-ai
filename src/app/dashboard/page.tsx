"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart2, Filter, LogOut } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ReactECharts from "echarts-for-react";
import generatedSchema from "../../../backend/dashboard_schema.json";

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/_/backend';
  }
  return 'http://localhost:8080';
};

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [lastSynced, setLastSynced] = useState<string>("Never");
  const [rawSheetData, setRawSheetData] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchLiveData = async (isBackground = false) => {
    if (!accessToken) return;
    if (!isBackground) setIsLoadingData(true);
    try {
      const dataRes = await fetch(`${getApiBaseUrl()}/api/sheets/${generatedSchema.spreadsheetId}/data`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      if (!dataRes.ok) {
        if (dataRes.status === 401) {
          console.warn("Google OAuth session expired. Redirecting to logout...");
          handleLogout();
          return;
        }
        const errText = await dataRes.text();
        throw new Error(`Server returned ${dataRes.status}: ${errText}`);
      }
      const sheetData = await dataRes.json();
      if (Array.isArray(sheetData)) {
        setRawSheetData(sheetData);
        setLastSynced(new Date().toLocaleString());
      } else {
        console.error("Expected array from sheet data API, but got:", sheetData);
      }
    } catch (err) {
      console.error("Live data fetch failed:", err);
    } finally {
      if (!isBackground) setIsLoadingData(false);
    }
  };

  // Fetch data on initial mount once accessToken is available
  useEffect(() => {
    if (accessToken) {
      fetchLiveData(false);
    }
  }, [accessToken]);

  useEffect(() => {
    let initialLoad = true;
    const unsub = onSnapshot(
      doc(db, "dashboards", "jeevan_rekha", "sync_metadata", "latest"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.lastUpdated) {
            // Only trigger background fetch if it's not the initial mount subscription
            if (!initialLoad) {
              console.log("Webhook triggered Firestore update! Fetching new data...");
              fetchLiveData(true);
            }
          }
        }
        initialLoad = false;
      }
    );
    return () => unsub();
  }, [accessToken]);

  // Foolproof Fallback: Auto-poll the spreadsheet every 1 hour (3600000 ms)
  // Guarantees data stays fresh even if the Webhook / Cloud Function fails to trigger
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-polling spreadsheet data...");
      fetchLiveData(true);
    }, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [accessToken]);

  const filteredData = Array.isArray(rawSheetData) 
    ? rawSheetData.filter(row => {
        return Object.entries(activeFilters).every(([key, value]) => {
          if (!value) return true; // 'All' selected
          return row[key] === value;
        });
      })
    : [];

  async function handleLogout() {
    try {
      await signOut(auth);
      sessionStorage.removeItem("googleAccessToken");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-space text-white tracking-tight">Analytics Overview</h1>
            <p className="text-zinc-400 mt-1">Jeevan Rekha Rice Bran Oil Manufacturing</p>
            <div className="flex items-center text-xs text-zinc-500 mt-2 gap-2">
              <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
                Live Sync Active
              </span>
              <span>Last Synced: <span className="text-zinc-300">{lastSynced}</span></span>
              {generatedSchema && (
                <button 
                  onClick={() => fetchLiveData(false)} 
                  disabled={isLoadingData}
                  className="ml-2 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 p-1 rounded-md transition-colors disabled:opacity-50"
                  title="Manual Refresh"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingData ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleLogout} variant="outline" className="text-zinc-300 flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="mt-8 w-full animate-in fade-in zoom-in duration-500">
            {/* Filters Bar */}
            {generatedSchema.filters && (
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] items-center">
                <div className="flex items-center gap-2 text-[#00F0FF] font-space text-sm">
                  <Filter className="w-4 h-4" /> Global Filters:
                </div>
                {generatedSchema.filters.map((filter: string) => {
                   const uniqueValues = Array.isArray(rawSheetData)
                     ? Array.from(new Set(rawSheetData.map(row => row[filter]))).filter(Boolean)
                     : [];
                   return (
                     <div key={filter} className="flex items-center gap-2">
                       <span className="text-zinc-500 text-sm font-sans">{filter}:</span>
                       <select 
                         className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-zinc-300 text-sm font-sans focus:outline-none focus:border-[#00F0FF]/50 transition-colors cursor-pointer appearance-none min-w-[120px]"
                         value={activeFilters[filter] || ""}
                         onChange={(e) => setActiveFilters({...activeFilters, [filter]: e.target.value})}
                       >
                         <option value="">All</option>
                         {uniqueValues.map((val: any) => (
                           <option key={val} value={val}>{val}</option>
                         ))}
                       </select>
                     </div>
                   );
                })}
                {isLoadingData && <span className="text-xs text-zinc-500 ml-auto animate-pulse">Live data loading...</span>}
              </div>
            )}

            {/* KPI Cards */}
            {generatedSchema.kpis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
                {generatedSchema.kpis.map((kpi: any) => {
                  let kpiValue = 0;
                  const targetKey = kpi.targetKey;
                  const operation = kpi.operation || "sum";
                  
                  if (operation === "sum") {
                    kpiValue = filteredData.reduce((sum, row) => sum + (Number(row[targetKey]) || 0), 0);
                  } else if (operation === "count") {
                    kpiValue = filteredData.length;
                  } else if (operation === "average") {
                    const sum = filteredData.reduce((s, row) => s + (Number(row[targetKey]) || 0), 0);
                    kpiValue = filteredData.length ? sum / filteredData.length : 0;
                  }
                  
                  const displayValue = kpi.format === 'volume' 
                    ? `${kpiValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} L`
                    : `${kpiValue.toLocaleString()} Units`;

                  return (
                    <div key={kpi.id} className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#00F0FF]/50 transition-all rounded-xl p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)] group">
                      <div>
                        <h4 className="text-zinc-400 text-sm font-sans mb-2 group-hover:text-zinc-300 transition-colors">{kpi.title}</h4>
                        <p className="text-[#00F0FF] text-3xl font-space font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                          {displayValue}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-zinc-500 text-xs flex items-center gap-2">
                          <BarChart2 className="w-3 h-3" />
                          {kpi.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ECharts Grid */}
            {generatedSchema.charts && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {generatedSchema.charts.map((chart: any) => {
                  const isPie = chart.type === 'pie';
                  
                  // Dynamic Chart Data Aggregation
                  let xAxisData: string[] = [];
                  let seriesData: any[] = [];
                  
                  const groupByKey = chart.groupByKey;
                  const targetKey = chart.targetKey;
                  const operation = chart.operation || "sum";
                  
                  if (groupByKey && targetKey) {
                    const dataMap: Record<string, number> = {};
                    
                    filteredData.forEach(row => {
                      const groupVal = row[groupByKey];
                      const numericVal = Number(row[targetKey]) || 0;
                      
                      if (groupVal) {
                        if (operation === "sum") {
                          dataMap[groupVal] = (dataMap[groupVal] || 0) + numericVal;
                        } else if (operation === "count") {
                          dataMap[groupVal] = (dataMap[groupVal] || 0) + 1;
                        }
                      }
                    });
                    
                    if (isPie) {
                      const colors = ['#00F0FF', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
                      seriesData = Object.entries(dataMap)
                        .map(([name, value], i) => ({ 
                          name, 
                          value: Number(value.toFixed(2)),
                          itemStyle: { color: colors[i % colors.length] } 
                        }))
                        .sort((a, b) => b.value - a.value);
                    } else {
                      xAxisData = Object.keys(dataMap);
                      seriesData = xAxisData.map(key => Number(dataMap[key].toFixed(2)));
                    }
                  }
                  
                  const option = {
                    backgroundColor: 'transparent',
                    title: {
                      text: chart.title,
                      textStyle: { color: '#f4f4f5', fontSize: 16, fontFamily: 'Outfit, sans-serif', fontWeight: 500 },
                      left: 'center',
                      top: 15
                    },
                    tooltip: {
                      trigger: isPie ? 'item' : 'axis',
                      backgroundColor: 'rgba(12, 12, 18, 0.8)',
                      borderColor: 'rgba(0, 240, 255, 0.3)',
                      textStyle: { color: '#fff', fontFamily: 'Outfit' },
                      borderWidth: 1,
                      padding: 12,
                      borderRadius: 8
                    },
                    grid: isPie ? undefined : { top: 70, right: 30, bottom: 40, left: 60 },
                    xAxis: isPie ? undefined : {
                      type: 'category',
                      data: xAxisData,
                      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                      axisLabel: { color: '#a1a1aa', fontFamily: 'Outfit' }
                    },
                    yAxis: isPie ? undefined : {
                      type: 'value',
                      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
                      axisLabel: { color: '#a1a1aa', fontFamily: 'Outfit' }
                    },
                    series: isPie ? [
                      {
                        name: chart.yAxis,
                        type: 'pie',
                        radius: ['45%', '75%'],
                        center: ['50%', '55%'],
                        itemStyle: {
                          borderRadius: 8,
                          borderColor: '#030305',
                          borderWidth: 3
                        },
                        data: seriesData,
                        label: { color: '#d4d4d8', fontFamily: 'Outfit' }
                      }
                    ] : [
                      {
                        data: seriesData,
                        type: 'bar',
                        itemStyle: {
                          color: '#00F0FF',
                          borderRadius: [4, 4, 0, 0]
                        },
                        barWidth: '40%'
                      }
                    ]
                  };

                  return (
                    <div key={chart.id} className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                      <ReactECharts option={option} style={{ height: '380px', width: '100%' }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </div>
    </DashboardLayout>
  );
}
