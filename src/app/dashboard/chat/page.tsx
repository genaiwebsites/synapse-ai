"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-space text-white tracking-tight">Intelligence</h1>
          <p className="text-zinc-400 mt-1 font-sans">Query your manufacturing data and insights.</p>
        </div>
        
        <div className="mt-8">
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}
