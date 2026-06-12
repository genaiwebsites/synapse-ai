import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Beaker, Bot } from "lucide-react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030305] text-[#fafafa] overflow-hidden font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      {/* Sidebar with Dark Enterprise Glassmorphism */}
      <aside className="w-64 flex-shrink-0 bg-[#0C0C12]/80 backdrop-blur-xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col z-10 relative">
        <div className="p-6">
          <h2 className="text-2xl font-bold font-space text-white tracking-tight">Synapse</h2>
          <p className="text-xs text-[#00F0FF] mt-1 uppercase tracking-wider font-semibold">Data Control</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 rounded-xl hover:bg-white/5 hover:text-[#00F0FF] hover:border-[#00F0FF]/20 border border-transparent transition-all font-medium">
            <LayoutDashboard className="w-4 h-4" />
            <span>Sales</span>
          </Link>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 rounded-xl hover:bg-white/5 hover:text-[#00F0FF] hover:border-[#00F0FF]/20 border border-transparent transition-all font-medium">
            <ShoppingCart className="w-4 h-4" />
            <span>Purchases</span>
          </Link>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 rounded-xl hover:bg-white/5 hover:text-[#00F0FF] hover:border-[#00F0FF]/20 border border-transparent transition-all font-medium">
            <Beaker className="w-4 h-4" />
            <span>Lab Reports</span>
          </Link>
          
          <div className="pt-4 pb-1">
            <div className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider font-space">Intelligence</div>
          </div>
          
          <Link href="/dashboard/chat" className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 rounded-xl hover:bg-[#00F0FF]/10 hover:text-[#00F0FF] border border-transparent hover:border-[#00F0FF]/30 transition-all font-medium">
            <Bot className="w-4 h-4" />
            <span>Synapse AI Chat</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
