import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeshGradient, SimplexNoise } from "@paper-design/shaders-react";
import { PRIMARY_ORIGIN } from "@/lib/site";

const TARGET_DOMAIN = PRIMARY_ORIGIN;
const REDIRECT_DELAY = 45000; // 45 seconds for a deliberate brand moment

const BrandTransition = () => {
  const [phase, setPhase] = useState<"initial" | "shedding" | "final">("initial");
  const [countdown, setCountdown] = useState(Math.floor(REDIRECT_DELAY / 1000));
  const controls = useAnimation();

  const energyChars = useMemo(() => "ENERGY".split(""), []);

  useEffect(() => {
    // Phase Orchestration
    const timers = [
      setTimeout(() => setPhase("shedding"), 2500),
      setTimeout(() => setPhase("final"), 5500)
    ];

    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      window.location.href = TARGET_DOMAIN;
    }, REDIRECT_DELAY);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirectTimer);
      clearInterval(interval);
    };
  }, []);

  const handleManualRedirect = () => {
    window.location.href = TARGET_DOMAIN;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative selection:bg-primary/30">
      {/* 1. ATMospheric Depth - Simplex Grain */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SimplexNoise 
          opacity={phase === "final" ? 0.08 : 0.03} 
          className="transition-opacity duration-[3000ms]"
        />
      </div>

      {/* 2. THE EVENT HORIZON - Refined Mesh Gradient (Overlapping Emergence) */}
      <AnimatePresence>
        {phase !== "initial" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(100px)" }}
            animate={{ 
              opacity: phase === "final" ? 1 : 0.4, 
              scale: phase === "final" ? 1 : 0.9, 
              filter: phase === "final" ? "blur(0px)" : "blur(40px)" 
            }}
            transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            {/* Core Glow */}
            <div className="w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[180px] animate-pulse duration-[10s]" />
            
            <div className="absolute inset-0 opacity-20">
              <MeshGradient
                speed={0.05}
                color1="#FFB800"
                color2="#FF6B35"
                color3="#000000"
                color4="#000000"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl w-full px-6 text-center">
        
        {/* 3. THE MARK - Logo + Shedding Typography */}
        <div className="relative h-48 flex items-center justify-center mb-16">
          <motion.div
            className="flex items-center justify-center"
            layout
          >
            {/* HELIOS LOGO - Inevitable Deceleration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: "brightness(0.8) contrast(1)" }}
              animate={{ 
                opacity: 1,
                scale: phase === "final" ? 1.15 : 1,
                filter: phase === "final" 
                  ? "brightness(1.15) contrast(1.1)" 
                  : "brightness(0.9) contrast(1)",
              }}
              transition={{ 
                duration: 4, 
                ease: [0.16, 1, 0.3, 1] // The 'Inevitable Deceleration' ease
              }}
              className="relative"
            >
              <img 
                src="/favicon-192.png" 
                className="h-20 md:h-32 w-auto object-contain" 
                alt="Helios" 
              />
              
              {/* Chromatic Aberration Layer (Smooth Expansion Pulse) */}
              <AnimatePresence>
                {phase === "shedding" && (
                  <motion.img
                    src="/favicon-192.png"
                    initial={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
                    animate={{ 
                      opacity: [0, 0.5, 0], 
                      scale: [1, 1.1, 1],
                      filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 2, 
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 h-20 md:h-32 w-auto object-contain mix-blend-screen pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* ENERGY - Character-level Particle Shedding */}
            <div className="flex ml-6 overflow-visible">
              <AnimatePresence mode="popLayout">
                {phase !== "final" && (
                  <div className="flex">
                    {energyChars.map((char, i) => (
                      <motion.span
                        key={`char-${i}`}
                        initial={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                        animate={{ 
                          opacity: phase === "shedding" ? 0 : 0.4,
                          x: phase === "shedding" ? 120 + (i * 45) : 0,
                          y: phase === "shedding" ? -30 + (Math.random() * 60) : 0,
                          rotate: phase === "shedding" ? 25 : 0,
                          filter: phase === "shedding" ? "blur(15px)" : "blur(0px)",
                          scale: phase === "shedding" ? 0.7 : 1
                        }}
                        transition={{ 
                          duration: 2.2, 
                          delay: phase === "shedding" ? i * 0.1 : 0,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className="text-white text-6xl md:text-[110px] font-heading font-bold tracking-tighter inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* 4. THE MESSAGE - Emergent Clarity */}
        <div className="space-y-10 max-w-3xl mx-auto h-64">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: phase === "final" ? 1 : 0,
              y: phase === "final" ? 0 : 30 
            }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div 
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="px-5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <span className="text-[11px] font-mono uppercase tracking-[0.4em] text-white/70 font-bold">
                  Evolution Complete
                </span>
              </motion.div>
            </div>

            <h2 className="text-3xl md:text-4xl text-white font-heading font-light tracking-tight leading-tight">
              The high-performance GPU cloud. <br/>
              <span className="text-white/40 italic font-serif">Distilled.</span>
            </h2>

            <div className="pt-4 flex flex-col items-center gap-8">
              <Button
                onClick={handleManualRedirect}
                size="xl"
	                className="rounded-full bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-700 h-16 px-14 group relative overflow-hidden"
	              >
	                <span className="relative z-10 flex items-center gap-4 font-mono uppercase tracking-widest text-xs font-black">
	                  Enter Helios.co
	                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
	                </span>
                <motion.div 
                  className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"
                />
              </Button>

              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
                  Transferring to new domain in {countdown}s
                </p>
                <div className="w-64 h-[2px] bg-white/10 mx-auto relative overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: REDIRECT_DELAY / 1000, ease: "linear" }}
                    className="absolute inset-0 bg-primary origin-left shadow-[0_0_10px_rgba(255,184,0,0.5)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5. THE SIGNATURE */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "final" ? 0.4 : 0 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 grayscale"
      >
        <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/50">
          Amsterdam
        </span>
        <div className="w-1 h-1 rounded-full bg-primary" />
        <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/50">
          San Francisco
        </span>
        <div className="w-1 h-1 rounded-full bg-primary" />
        <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/50">
          London
        </span>
      </motion.div>
    </div>
  );
};

export default BrandTransition;
