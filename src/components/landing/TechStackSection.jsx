"use client";

import { Brain, MagnifyingGlass, TreeStructure, TerminalWindow, RocketLaunch } from "@phosphor-icons/react";

function PremiumCard({ children, delay = "0ms", colSpan = 1 }) {
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
      className={`premium-card p-6 md:p-8 reveal-up group ${colSpan === 2 ? 'lg:col-span-2' : ''}`}
      style={{ transitionDelay: delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="premium-card-content">
        {children}
      </div>
    </div>
  );
}

export default function TechStackSection() {
  return (
    <section id="stack" className="relative py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full z-10">
      <div className="mb-12 md:mb-16 reveal-up text-center md:text-left">
        <h2 className="font-space text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4">The 2026 Native Suite.</h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl font-sans font-light leading-relaxed mx-auto md:mx-0">
          Engineered from the ground up for massive context and absolute security. No compromises, no external dependencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        <PremiumCard delay="0ms">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Brain weight="fill" className="text-2xl text-indigo-400 transition-transform duration-500 group-hover:scale-125" />
          </div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2 block font-bold">Intelligence</span>
          <h3 className="text-xl md:text-2xl font-space font-bold text-white mb-3 group-hover:text-indigo-100 transition-colors">Gemini 3.1 Pro</h3>
          <p className="text-zinc-400 font-light font-sans leading-relaxed text-sm md:text-base">Native multimodal reasoning and an unprecedented 1M+ context window. It understands the entirety of your business at a glance.</p>
        </PremiumCard>

        <PremiumCard delay="100ms">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <MagnifyingGlass weight="fill" className="text-2xl text-purple-400 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
          </div>
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2 block font-bold">Search</span>
          <h3 className="text-xl md:text-2xl font-space font-bold text-white mb-3 group-hover:text-purple-100 transition-colors">Vertex AI</h3>
          <p className="text-zinc-400 font-light font-sans leading-relaxed text-sm md:text-base">No-Code RAG layer. Automatically indexes Drive & Gmail instantly with zero lag, turning chaos into structured data.</p>
        </PremiumCard>

        <PremiumCard delay="200ms">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-amber-500/20 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <TreeStructure weight="fill" className="text-2xl text-amber-400 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12" />
          </div>
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 block font-bold">Orchestration</span>
          <h3 className="text-xl md:text-2xl font-space font-bold text-white mb-3 group-hover:text-amber-100 transition-colors">Google ADK</h3>
          <p className="text-zinc-400 font-light font-sans leading-relaxed text-sm md:text-base">Python-based Agent Skills coordination bridging complex logic, APIs, and massive enterprise actions.</p>
        </PremiumCard>

        <PremiumCard colSpan={2}>
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <TerminalWindow weight="fill" className="text-2xl text-cyan-400 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full group-hover:bg-cyan-500/20 transition-colors">Infrastructure</span>
          </div>
          <h3 className="text-xl md:text-2xl font-space font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">FastAPI & Next.js 15</h3>
          <p className="text-zinc-400 font-light font-sans leading-relaxed max-w-xl text-sm md:text-base">A high-speed Python API bridging the AI to a modern, clinical frontend dashboard with interactive SVG rendering capabilities.</p>
        </PremiumCard>

        <PremiumCard delay="0ms">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <RocketLaunch weight="fill" className="text-2xl text-emerald-400 transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-widest mb-2 block">Environment</span>
          <h3 className="text-xl md:text-2xl font-space font-bold text-white mb-3 group-hover:text-emerald-100 transition-colors">Antigravity</h3>
          <p className="text-zinc-400 font-light font-sans leading-relaxed text-sm md:text-base">The Agentic workspace where the intelligence is built, verified, and securely deployed.</p>
        </PremiumCard>

      </div>
    </section>
  );
}
