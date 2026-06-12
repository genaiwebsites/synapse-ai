"use client";

import { useState, useEffect } from "react";
import AmbientBackground from "@/components/landing/AmbientBackground";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TechStackSection from "@/components/landing/TechStackSection";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import SecuritySection from "@/components/landing/SecuritySection";
import Footer from "@/components/landing/Footer";
import AuthPortal from "@/components/landing/AuthPortal";

export default function Home() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    // Scroll Reveal Logic
    const revealElements = document.querySelectorAll(".reveal-up");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    const timeoutId = setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add("active");
      });
    }, 100);

    return () => {
      revealElements.forEach(el => revealObserver.unobserve(el));
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="bg-[#030305] text-[#fafafa] min-h-screen font-space selection:bg-indigo-500/30 selection:text-indigo-100 relative overflow-x-hidden">
      <AmbientBackground />
      <Navbar onOpenPortal={() => setIsPortalOpen(true)} />
      
      <main className="relative w-full flex flex-col items-center">
        <HeroSection onOpenPortal={() => setIsPortalOpen(true)} />
        <TechStackSection />
        <CapabilitiesSection />
        <SecuritySection onOpenPortal={() => setIsPortalOpen(true)} />
      </main>

      <Footer />
      <AuthPortal isOpen={isPortalOpen} onClose={() => setIsPortalOpen(false)} />
    </div>
  );
}
