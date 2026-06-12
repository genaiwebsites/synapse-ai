"use client";

import { Brain } from "@phosphor-icons/react";

export default function Navbar({ onOpenPortal }) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="flex items-center justify-between bg-[#0B0B12]/80 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-[#030305] rounded-full flex items-center justify-center">
              <Brain weight="fill" className="text-white text-sm" />
            </div>
          </div>
          <span className="font-space font-bold text-lg tracking-tight text-white">
            Synapse
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#stack" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">
            Tech Stack
          </a>
          <a href="#capabilities" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#security" className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors">
            Security
          </a>
        </div>
        <div>
          <button 
            onClick={onOpenPortal}
            className="inline-flex items-center justify-center rounded-full text-[13px] font-bold transition-all bg-white text-black hover:bg-zinc-200 h-9 px-6 hover:scale-105 active:scale-95"
          >
            Initialize Vault
          </button>
        </div>
      </div>
    </nav>
  );
}
