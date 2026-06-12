"use client";

import { useEffect, useRef } from "react";
import { PlayCircle } from "@phosphor-icons/react";

export default function HeroSection({ onOpenPortal }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeDuration = 0.5;
    let animationFrameId;

    const updateOpacity = () => {
      if (!video.duration) {
        animationFrameId = requestAnimationFrame(updateOpacity);
        return;
      }
      
      const time = video.currentTime;
      const duration = video.duration;
      
      if (time < fadeDuration) {
        video.style.opacity = (time / fadeDuration).toString();
      } else if (duration - time < fadeDuration) {
        video.style.opacity = ((duration - time) / fadeDuration).toString();
      } else {
        video.style.opacity = "1";
      }
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const onPlay = () => {
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(e => console.warn("Auto-play prevented by browser."));
      }, 100);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("ended", onEnded);
    
    // Auto play initial
    video.play().catch(e => console.warn("Auto-play prevented by browser."));

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("ended", onEnded);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="hero-section" className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden z-10">
      
      {/* Looping Background Video with Full Richness */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none video-mask">
        <video 
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4" 
          className="w-full h-full object-cover transition-opacity duration-1000" 
          style={{ opacity: 0 }} 
          muted 
          playsInline
        />
        {/* Subtle vignette rather than heavy overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030305_100%)] opacity-80"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 w-full h-full mt-24">
        
        {/* Gemini Engine Badge */}
        <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-[11px] font-mono text-purple-200 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden transition-colors hover:bg-purple-500/10">
          <span className="flex h-1.5 w-1.5 rounded-full bg-purple-400 mr-2 shadow-[0_0_8px_rgba(192,132,252,1)] animate-pulse"></span>
          Gemini 3.1 Pro Engine Active
        </div>
        
        {/* Main Heading */}
        <h1 className="font-space text-[80px] sm:text-[100px] md:text-[130px] lg:text-[160px] font-bold leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 mb-6 pb-2 drop-shadow-2xl select-none">
          Synapse
        </h1>
        
        {/* Subheading with precise text wrap */}
        <p className="text-zinc-300 font-sans text-base sm:text-lg md:text-[21px] leading-relaxed max-w-[700px] font-light mt-0 mix-blend-plus-lighter px-4 [text-wrap:balance]">
          Your company's private intelligence vault. <br className="hidden md:block" />
          Zero-scrape grounding, multimodal reasoning, and absolute business memory seamlessly blended.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full sm:w-auto px-6">
          <button 
            onClick={onOpenPortal}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-[15px] font-semibold transition-all bg-white text-black hover:bg-zinc-200 h-14 px-8 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
          >
            Deploy Private Vault
          </button>
          <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-[15px] font-semibold transition-all border border-white/5 bg-[#18181B]/80 text-white hover:bg-[#27272A]/90 h-14 px-8 backdrop-blur-xl hover:border-white/10 group">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 mr-3">
              <PlayCircle weight="fill" className="text-white text-base transition-transform group-hover:scale-110" /> 
            </div>
            Watch Architecture
          </button>
        </div>
      </div>
    </div>
  );
}
