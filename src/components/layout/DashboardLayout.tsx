"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Beaker, Bot, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen bg-[#030305] text-[#fafafa] overflow-hidden font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      {/* Sidebar with Dark Enterprise Glassmorphism */}
      <aside 
        className={`flex-shrink-0 bg-[#0C0C12]/80 backdrop-blur-xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col z-20 relative transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`p-6 flex items-center transition-all duration-300 h-[88px] ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            {isCollapsed ? (
              <h2 className="text-3xl font-bold font-space text-[#00F0FF] tracking-tighter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">S</h2>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                <h2 className="text-2xl font-bold font-space text-white tracking-tight">Synapse</h2>
                <p className="text-[10px] text-[#00F0FF] mt-1 uppercase tracking-[0.2em] font-bold">Data Control</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden no-scrollbar">
          {mounted && (
            <>
              <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Sales" isCollapsed={isCollapsed} active={pathname === '/dashboard'} />
              <NavItem href="/dashboard/purchases" icon={<ShoppingCart />} label="Purchases" isCollapsed={isCollapsed} active={pathname === '/dashboard/purchases'} />
              <NavItem href="/dashboard/labs" icon={<Beaker />} label="Lab Reports" isCollapsed={isCollapsed} active={pathname === '/dashboard/labs'} />
              
              <div className="pt-6 pb-2 transition-all duration-300">
                {isCollapsed ? (
                  <div className="w-full flex justify-center animate-in fade-in duration-300"><div className="w-6 h-[1px] bg-white/10" /></div>
                ) : (
                  <div className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-space animate-in fade-in duration-300">Intelligence</div>
                )}
              </div>
              
              <NavItem href="/dashboard/chat" icon={<Bot />} label="Synapse AI Chat" isCollapsed={isCollapsed} active={pathname === '/dashboard/chat'} highlight />
            </>
          )}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center text-zinc-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {!isCollapsed && <span className="text-sm font-medium tracking-wide">Collapse</span>}
            <div className={`transition-transform duration-300 ease-out group-hover:scale-110 ${isCollapsed ? 'text-[#00F0FF] group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : ''}`}>
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-[#030305] to-[#0A0A10]">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, isCollapsed, active, highlight = false }: any) {
  // Styling rules for different states
  const baseClasses = "flex items-center py-3 rounded-xl border transition-all duration-300 ease-out group relative cursor-pointer";
  const layoutClasses = isCollapsed ? 'justify-center px-0 mx-auto w-12' : 'justify-start px-4 w-full';
  
  let stateClasses = "";
  if (active) {
    if (highlight) {
      stateClasses = "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]";
    } else {
      stateClasses = "bg-white/10 text-white border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)]";
    }
  } else {
    if (highlight) {
      stateClasses = "text-[#00F0FF] hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/30 border-transparent";
    } else {
      stateClasses = "text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/10 border-transparent";
    }
  }

  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${layoutClasses} ${stateClasses}`}
      title={isCollapsed ? label : ""}
    >
      <div className={`flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        <span className="w-5 h-5 flex items-center justify-center">
            {icon}
        </span>
      </div>
      
      {!isCollapsed && (
        <span className="ml-3.5 font-medium whitespace-nowrap overflow-hidden animate-in fade-in duration-300 tracking-wide text-sm">
          {label}
        </span>
      )}
    </Link>
  );
}
