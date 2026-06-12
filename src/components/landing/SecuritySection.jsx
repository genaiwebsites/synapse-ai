"use client";

import { ShieldCheck } from "@phosphor-icons/react";

function PremiumCard({ children, delay = "0ms", className = "" }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--mouse-x', `-1000px`);
    card.style.setProperty('--mouse-y', `-1000px`);
  };

  return (
    <div 
      className={`premium-card reveal-up group ${className}`}
      style={{ transitionDelay: delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="premium-card-content items-center">
        {children}
      </div>
    </div>
  );
}

export default function SecuritySection({ onOpenPortal }) {
  return (
    <section id="security" className="relative py-24 md:py-32 px-4 sm:px-6 max-w-5xl mx-auto w-full z-10">
      <PremiumCard className="p-8 md:p-20 text-center">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[10px] md:text-xs font-mono font-bold text-emerald-300 mb-6 md:mb-8 transition-all group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <ShieldCheck weight="fill" className="mr-2 text-sm" /> Enterprise Grade Security
        </div>
        
        <h2 className="font-space text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 md:mb-8">
          Replicable. Secure.<br/><span className="text-zinc-500 group-hover:text-emerald-500/80 transition-colors duration-700">Yours.</span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-sans font-light leading-relaxed mb-10 md:mb-12 px-2">
          We don't "own" your data. Synapse runs entirely on your Gemini API subscription. Secured by Firebase Auth for Gmail SSO, keeping your business secrets mathematically tenant-isolated.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-6 w-full px-4 mt-8">
          <button 
            onClick={onOpenPortal}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-base md:text-[15px] font-semibold transition-all bg-white text-black hover:bg-zinc-200 h-12 md:h-14 px-8 md:px-10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
          >
            Initialize One-Click Setup
          </button>
          <p className="text-zinc-500 text-[11px] md:text-xs font-mono font-bold tracking-widest uppercase">Engineered to clone for new departments in &lt; 15 minutes.</p>
        </div>
      </PremiumCard>
    </section>
  );
}
