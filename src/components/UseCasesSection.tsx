import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { StaticMeshGradient } from '@paper-design/shaders-react';
import { urlFor } from "@/lib/sanity";

// Helios Theme Palette (Solar, Ember, Warmth, Black)
const HELIOS_PALETTE = ["#FFB800", "#FF6B35", "#FF9500", "#000000"];

const cardConfigs = [
  { colors: HELIOS_PALETTE, waveX: 1.0, waveY: 0.8, rotation: 0.5 },
  { colors: HELIOS_PALETTE, waveX: 0.95, waveY: 0.85, rotation: 0.55 },
  { colors: HELIOS_PALETTE, waveX: 1.05, waveY: 0.75, rotation: 0.45 }
];

export const UseCasesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { data: section, isLoading } = useSanityQuery<any>('use-cases-section', QUERIES.useCasesSection);

  if (isLoading || !section) return null;

  // Filter out "Semantic Search" and limit to 3-4 tabs
  const filteredUseCases = section.useCases
    ?.filter((uc: any) => uc.title.toLowerCase() !== "semantic search")
    ?.slice(0, 4);

  if (!filteredUseCases || filteredUseCases.length === 0) return null;

  const activeUseCase = filteredUseCases[activeTab];
  const config = cardConfigs[activeTab % cardConfigs.length];

  return (
    <section id="use-cases" className="py-24 bg-black">
      <div className="max-w-[95vw] mx-auto px-4">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[24px] p-4 sm:p-8 overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Centered Header: Pure Typography - COMMENTED OUT AS REQUESTED */}
          {/* 
          <div className="text-center mb-12 space-y-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-heading font-bold text-white tracking-tightest leading-tight max-w-4xl mx-auto"
            >
              {section.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed"
            >
              {section.description}
            </motion.p>
          </div>
          */}

          {/* Pill-shaped Tab Switcher */}
          <div className="flex justify-center mb-12 mt-8 relative z-10">
            <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 relative">
              {filteredUseCases.map((useCase: any, index: number) => (
                <button
                  key={useCase.title}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-6 py-2.5 text-sm font-medium transition-colors duration-300 z-10 ${activeTab === index ? "text-black" : "text-white/60 hover:text-white"
                    }`}
                >
                  {activeTab === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {useCase.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content Block: Asymmetric 3/5 Split */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-start relative z-10">
            {/* Left Column: Large Image (3/5ths = 60%, approx Golden Ratio) */}
            <motion.div
              key={`image-${activeTab}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-square lg:aspect-[4/3] rounded-[24px] overflow-hidden border border-white/10 group lg:col-span-3"
            >
              <div className="absolute inset-0 z-0 opacity-40">
                <StaticMeshGradient
                  colors={config.colors}
                  waveX={config.waveX}
                  waveY={config.waveY}
                  rotation={config.rotation}
                />
              </div>

              {activeUseCase.image && (
                <img
                  src={urlFor(activeUseCase.image).url()}
                  alt={activeUseCase.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              )}

              {/* Dark overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-60" />
            </motion.div>

            {/* Right Column: Descriptive Text (2/5ths) - Top Aligned */}
            <div className="space-y-8 p-4 lg:p-0 lg:pt-8 lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <h3 className="text-4xl sm:text-5xl font-heading font-bold tracking-tightest text-white leading-tight">
                    {activeUseCase.title}
                  </h3>
                  <p className="text-lg sm:text-xl leading-relaxed text-white/40 font-light max-w-lg">
                    {activeUseCase.description}
                  </p>
                  <div className="pt-4">
                    <button className="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform duration-300">
                      Learn more
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};