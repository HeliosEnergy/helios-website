import { ArrowRight } from "lucide-react";
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
                  className="text-5xl sm:text-6xl lg:text-7xl font-heading font-medium text-white tracking-tight leading-[1.02] max-w-5xl text-balance"
                >
                  {heroContent.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-2xl"
                >
                  {heroContent.subtitle}
                </motion.p>
              </div>

              <div className="pt-4">
                <a
                  href="/contact?service=coloc"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:border-primary/50 hover:bg-white/10"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  Reserve capacity
                </a>
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
