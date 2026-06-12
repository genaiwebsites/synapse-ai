"use client";

import { 
  HardDrives, 
  GoogleDriveLogo, 
  VideoCamera, 
  FileText, 
  ClockCounterClockwise, 
  ChartLineUp, 
  GoogleLogo // Used as a substitute for gmail logo, actually let's use EnvelopeSimple or Envelope if gmail isn't in phosphor core, but Phosphor does have Envelope
} from "@phosphor-icons/react";
import { Envelope } from "@phosphor-icons/react";

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
      {children}
    </div>
  );
}

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="relative py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full z-10">
      <div className="mb-12 md:mb-16 text-center reveal-up">
        <h2 className="font-space text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4 md:mb-6">Total Recall. Infinite Context.</h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto font-sans font-light px-4">
          The bot maintains perfect memory. It doesn't just search; it reasons across your entire enterprise graph instantly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        
        {/* Hero Feature: Zero Scrape */}
        <PremiumCard className="p-6 md:p-12 md:col-span-7 flex flex-col justify-between overflow-hidden">
          <div className="premium-card-content">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 md:mb-8 transition-colors group-hover:bg-white/10">
              <HardDrives weight="fill" className="text-2xl md:text-3xl transition-transform duration-500 group-hover:scale-110" />
            </div>
            <h3 className="font-space text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">Zero-Scrape Grounding</h3>
            <p className="text-zinc-400 font-sans text-base md:text-lg leading-relaxed font-light mb-8 md:mb-12 max-w-md">Files stay exactly where they are in Google Drive. No complex database management, no manual uploading, no vectorization lag. Synapse connects directly to the source of truth.</p>
            
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 w-fit px-4 py-2 rounded-full mt-auto">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-mono text-[10px] md:text-xs text-emerald-400 font-bold uppercase tracking-wider">Live Workspace Sync Enabled</span>
            </div>
          </div>
          {/* Abstract BG Art */}
          <GoogleDriveLogo weight="light" className="text-[180px] md:text-[240px] text-white/5 absolute -right-10 -bottom-10 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-white/10 transition-all duration-700 pointer-events-none" />
        </PremiumCard>

        {/* Feature Stack Right */}
        <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
          {/* Multimodal */}
          <PremiumCard className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <div className="premium-card-content">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500/20">
                  <VideoCamera weight="fill" className="text-xl transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 transition-all duration-300 group-hover:bg-amber-500/20">
                  <FileText weight="fill" className="text-xl transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <h3 className="font-space text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-indigo-200 transition-colors">Multimodal Reasoning</h3>
              <p className="text-zinc-400 font-sans leading-relaxed font-light text-sm md:text-base">It doesn't just read text. It "watches" training videos to find specific timestamps and "sees" handwritten invoices in milliseconds.</p>
            </div>
          </PremiumCard>

          {/* Persistence */}
          <PremiumCard className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <div className="premium-card-content">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <ClockCounterClockwise weight="fill" className="text-xl transition-transform duration-500 group-hover:-rotate-45" />
              </div>
              <h3 className="font-space text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">30-Day Session Memory</h3>
              <p className="text-zinc-400 font-sans leading-relaxed font-light text-sm md:text-base">The bot remembers the last 30 days of conversation for perfect, uninterrupted "memory" of ongoing enterprise tasks.</p>
            </div>
          </PremiumCard>
        </div>

        {/* Full Width Analytics */}
        <PremiumCard className="p-6 md:p-12 md:col-span-12 flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="premium-card-content flex-1 text-center md:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 mx-auto md:mx-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 transition-colors group-hover:bg-white/10 group-hover:text-cyan-400">
              <ChartLineUp weight="fill" className="text-2xl md:text-3xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <h3 className="font-space text-2xl sm:text-3xl font-bold mb-4 text-white group-hover:text-cyan-200 transition-colors">Email Context & Visual Analytics</h3>
            <p className="text-zinc-400 font-sans text-base md:text-lg leading-relaxed font-light">Ask "How are my sales trending?" and receive a rich, animated SVG chart. Automatically cross-reference Drive invoices with Gmail threads to verify reality without switching tabs.</p>
          </div>
          {/* Premium Impeccable Mock UI snippet inside card */}
          <div className="flex-1 w-full relative z-10 mt-8 md:mt-0">
            {/* Floating Notification */}
            <div className="absolute -top-8 -left-2 md:-left-8 z-20 animate-[orb-float_6s_ease-in-out_infinite_alternate]">
              <div className="flex items-center gap-3 md:gap-4 bg-zinc-950/80 backdrop-blur-xl border border-white/10 p-3 md:p-4 pr-6 md:pr-8 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Envelope weight="fill" className="text-emerald-400 text-lg md:text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-xs font-mono font-bold text-zinc-400 mb-0.5">Invoice #INV-2026-X</span>
                  <span className="text-xs md:text-sm font-sans font-medium text-emerald-400">Matched: "Payment Confirmed"</span>
                </div>
              </div>
            </div>

            {/* Premium Chart Container */}
            <div className="bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 md:p-8 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_40px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:border-cyan-500/20 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_40px_100px_-20px_rgba(6,182,212,0.15)] relative">
              {/* Subtle grid background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

              {/* Header */}
              <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-5 relative z-10">
                <div>
                  <h4 className="text-[10px] md:text-xs font-mono tracking-widest text-zinc-500 mb-2 uppercase">Revenue Trend</h4>
                  <div className="text-3xl md:text-4xl font-space font-bold text-white flex items-center gap-3 md:gap-4">
                    $124.5k
                    <span className="text-[10px] md:text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">+14.2%</span>
                  </div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="relative h-32 md:h-44 flex items-end justify-between gap-1.5 md:gap-3 mt-6 z-10">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full border-t border-white/5 border-dashed"></div>
                  ))}
                </div>

                {/* Bars */}
                {[
                  { h: '35%', val: '42k' },
                  { h: '55%', val: '68k' },
                  { h: '40%', val: '48k' },
                  { h: '80%', val: '96k' },
                  { h: '60%', val: '72k' },
                  { active: true, h: '100%', val: '124.5k' },
                  { h: '75%', val: '90k' }
                ].map((bar, i) => (
                  <div key={i} className="relative w-full group/bar h-full flex flex-col justify-end z-10">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform group-hover/bar:-translate-y-2 bg-white text-black text-[10px] md:text-xs font-bold py-1 md:py-1.5 px-2 md:px-3 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl">
                      ${bar.val}
                    </div>
                    {/* Bar Fill */}
                    <div 
                      className={`w-full rounded-t-lg md:rounded-t-xl transition-all duration-1000 ease-out transform origin-bottom ${
                        bar.active 
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                          : 'bg-white/5 hover:bg-white/15'
                      }`}
                      style={{ height: bar.h }}
                    >
                      {bar.active && (
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-t-lg md:rounded-t-xl"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PremiumCard>

      </div>
    </section>
  );
}
