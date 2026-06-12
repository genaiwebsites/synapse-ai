import { Brain } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 md:py-12 px-4 sm:px-6 mt-12 border-t border-white/5 backdrop-blur-md bg-black/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm font-sans gap-6 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
            <Brain weight="fill" className="text-black text-xs" />
          </div>
          <span className="font-space font-semibold text-zinc-300 tracking-tight text-base">Synapse AI</span>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">v2026.1</span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 font-medium">
          <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Architecture</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
