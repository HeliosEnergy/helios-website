import { motion } from "framer-motion";
import { PaperTexture, SimplexNoise, MeshGradient } from "@paper-design/shaders-react";
import { useHeavyGfx } from "@/hooks/use-heavy-gfx";
import { InViewGate } from "@/components/ui/InViewGate";
import { ArrowCTA } from "@/components/ui/ArrowCTA";

// Cap each decorative shader to ~0.9MP instead of the library default of
// ~8.3MP, and drop its 2x pixel-ratio floor to 1 — far less GPU work, and
// invisible on these soft background layers.
const SHADER_MAX_PX = 1280 * 720;

const heroContent = {
  titlePrefix: 'Frontier compute,',
  titleHighlight: 'live in ~3 months.',
  subtitle: 'Thousands of NVIDIA Blackwell GPUs or tens of megawatts of colocation, deployed in about three months. Not years. Water-free cooling, power-efficient sites, always backed by renewable energy.',
};

export const HeroSection = () => {
  const heavyGfx = useHeavyGfx();

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

      {/* Alchemy Background Stack — capable devices only; unmounts off-screen.
          (Heavy WebGL crashes iOS Safari and weak GPUs.) */}
      {heavyGfx && (
        <InViewGate className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <SimplexNoise opacity={0.1} minPixelRatio={1} maxPixelCount={SHADER_MAX_PX} />
          <PaperTexture opacity={0.15} minPixelRatio={1} maxPixelCount={SHADER_MAX_PX} />
        </InViewGate>
      )}

      {/* Celestial Aura — animated on capable devices, static gradient otherwise */}
      {heavyGfx ? (
        <InViewGate
          className="absolute top-0 right-0 w-[1200px] h-[1200px] -translate-y-1/2 translate-x-1/4 pointer-events-none z-0"
          fallback={
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,184,0,0.12) 0%, rgba(255,107,53,0.06) 50%, transparent 70%)' }}
            />
          }
        >
          <MeshGradient
            speed={0.2}
            color1="#FFB800"
            color2="#FF6B35"
            color3="#000000"
            color4="#000000"
            opacity={0.15}
            minPixelRatio={1}
            maxPixelCount={SHADER_MAX_PX}
          />
        </InViewGate>
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
                  {heroContent.titlePrefix}{" "}
                  <span className="text-primary">{heroContent.titleHighlight}</span>
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
                <ArrowCTA to="/contact?service=clusters" tone="dark" accent="primary">
                  Reserve capacity
                </ArrowCTA>
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
