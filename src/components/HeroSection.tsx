import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { PaperTexture, SimplexNoise, MeshGradient } from "@paper-design/shaders-react";
import { useIsMobile } from "@/hooks/use-mobile";

const heroContent = {
  title: 'Frontier compute, live in ~3 months.',
  subtitle: 'Thousands of NVIDIA Blackwell GPUs or tens of megawatts of colocation, deployed in about three months. Not years. Water-free cooling, power-efficient sites, always backed by renewable energy.',
};

export const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-black min-h-[540px] md:min-h-[900px] flex items-start justify-center pt-24 lg:pt-32">
      {/* Background Image Layer - Capped at 2048px to prevent pixelation */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/helios_no_star_v2.png')",
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'min(100%, 1257px) auto',
          opacity: 0.8
        }}
      />

      {/* Alchemy Background Stack — desktop only (WebGL crashes iOS Safari) */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <SimplexNoise opacity={0.1} />
          <PaperTexture opacity={0.15} />
        </div>
      )}

      {/* Celestial Aura — desktop only */}
      {!isMobile ? (
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] -translate-y-1/2 translate-x-1/4 pointer-events-none z-0">
          <MeshGradient
            speed={0.2}
            color1="#FFB800"
            color2="#FF6B35"
            color3="#000000"
            color4="#000000"
            opacity={0.15}
          />
        </div>
      ) : (
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 pointer-events-none z-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,184,0,0.12) 0%, rgba(255,107,53,0.06) 50%, transparent 70%)' }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* The Text Spine */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-10 lg:space-y-12"
            >
              <div className="space-y-6 lg:space-y-8 max-w-6xl">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-6xl sm:text-7xl lg:text-[92px] xl:text-[116px] font-heading font-bold text-white tracking-tightest leading-[0.9] max-w-6xl text-balance"
                >
                  {heroContent.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-lg sm:text-xl lg:text-2xl text-white/80 font-light leading-relaxed max-w-3xl"
                >
                  {heroContent.subtitle}
                </motion.p>
              </div>

              <div className="pt-4">
                <Button
                  variant="default"
                  size="xl"
                  asChild
                  className="h-16 px-12 rounded-full bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 group"
                >
                  <a href="/contact?service=coloc" className="flex items-center gap-4 font-mono uppercase tracking-widest text-xs font-bold">
                    Reserve capacity
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* The Plinth */}
          {/* TODO: Clean up this section if the static image replacement is permanent.
          <div className="lg:col-span-12 xl:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square w-full flex items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[100px] rounded-full border border-white/5 scale-90" />

              <div className="w-full h-full scale-110 lg:scale-125">
                <IsometricGPUAnimation onPhaseChange={setCurrentPhase} />
              </div>
            </motion.div>
          </div>
          */}

        </div>
      </div>
    </section>
  );
};
