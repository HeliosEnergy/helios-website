import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import type { HeroSection as HeroSectionData } from "@/types/sanity";
import { IsometricGPUAnimation, AnimationPhase } from "./hero/IsometricGPUAnimation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperTexture, SimplexNoise, MeshGradient } from "@paper-design/shaders-react";

const phaseContent: Record<AnimationPhase, { title: string; subtitle: string }> = {
  'containers-drop': {
    title: 'Scale as you need',
    subtitle: 'Deploy GPU containers instantly. Add capacity on demand.',
  },
  'containers-hold': {
    title: 'Scale as you need',
    subtitle: 'Deploy GPU containers instantly. Add capacity on demand.',
  },
  'containers-fall': {
    title: 'Scale as you need',
    subtitle: 'Deploy GPU containers instantly. Add capacity on demand.',
  },
  'maxima': {
    title: 'Fine-tune at scale',
    subtitle: 'Train and optimize models with enterprise-grade infrastructure.',
  },
  'inference': {
    title: 'Inference at scale',
    subtitle: 'Serve millions of requests with low latency across the globe.',
  },
};

// Helper to fix legacy URLs from Sanity
const fixUrl = (url: string) => {
  if (!url) return "#";
  if (url === 'https://helios.ai/contact') return '/contact';
  if (url === 'https://helios.ai/signup') return 'https://console.heliosenergy.io/login?tab=signup';
  if (url.includes('helios.ai/docs')) return 'https://heliosenergy.io/docs';
  return url;
};

export const HeroSection = () => {
  const { data: hero, isLoading } = useSanityQuery<HeroSectionData>('hero-section', QUERIES.heroSection);
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('containers-drop');
  const [displayContent, setDisplayContent] = useState(phaseContent['containers-drop']);

  useEffect(() => {
    const newContent = phaseContent[currentPhase];
    setDisplayContent(newContent);
  }, [currentPhase]);

  return (
    <section className="relative overflow-hidden bg-black min-h-[900px] flex items-start justify-center pt-24 lg:pt-32">
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

      {/* Alchemy Background Stack */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <SimplexNoise
          animate={true}
          opacity={0.1}
        />
        <PaperTexture
          animate={true}
          opacity={0.15}
        />
      </div>

      {/* celestial Aura Refined */}
      <div className="absolute top-0 right-0 w-[1200px] h-[1200px] -translate-y-1/2 translate-x-1/4 pointer-events-none z-0">
        <MeshGradient
          animate={true}
          speed={0.2}
          color1="#FFB800"
          color2="#FF6B35"
          color3="#000000"
          color4="#000000"
          opacity={0.15}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 lg:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* The Text Spine */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12 lg:space-y-16"
            >
              <div className="space-y-6 lg:space-y-8">
                <motion.h2
                  key={displayContent.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-6xl sm:text-7xl lg:text-[88px] font-heading font-bold text-white tracking-tightest leading-[0.85]"
                >
                  {displayContent.title}
                </motion.h2>
                <motion.p
                  key={displayContent.subtitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl text-white/70 font-light leading-relaxed max-w-md"
                >
                  {displayContent.subtitle}
                </motion.p>
              </div>

              <div className="pt-4">
                <Button
                  variant="default"
                  size="xl"
                  asChild
                  className="h-16 px-12 rounded-full bg-white text-black hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 group"
                >
                  <a href={fixUrl(hero?.primaryCtaLink)} className="flex items-center gap-4 font-mono uppercase tracking-widest text-xs font-bold">
                    Initialize Cluster
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
