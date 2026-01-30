import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: section, isLoading } = useSanityQuery<any>('testimonials-section', QUERIES.testimonialsSection);

  if (isLoading || !section?.testimonials?.length) return null;

  return (
    <section className="py-24 lg:py-48 bg-black overflow-hidden relative">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-12 relative z-10">
        
        {/* Section Label */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="mb-16 lg:mb-24 px-4"
        >
          <span className="font-mono text-xs uppercase tracking-[0.6em] text-white/70 font-semibold italic">
            {section.sectionLabel || "The Consensus"}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-center">
          
          {/* Quote Area - Refined & Lighter */}
          <div className="lg:col-span-8 relative min-h-[400px] flex items-center px-4">
            <AnimatePresence mode="popLayout">
              {section.testimonials.map((t: any, i: number) => (
                i === activeIndex && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 15, filter: "blur(8px)", position: "absolute" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <blockquote className="relative">
                      <span className="absolute -top-16 -left-10 text-[180px] font-heading font-medium text-white/[0.03] select-none pointer-events-none">
                        “
                      </span>
                      <p className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium tracking-tightest leading-[1.1] text-white selection:bg-white selection:text-black relative z-10">
                        {t.quote}
                      </p>
                    </blockquote>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Tactical Signature Sidebar */}
          <div className="lg:col-span-4 flex flex-col space-y-0 border-l border-white/[0.08] pl-12 relative h-full justify-center">
            
            {section.testimonials.map((t: any, i: number) => (
              <button
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                className="group relative py-6 text-left transition-all duration-300 outline-none"
              >
                {/* Active Indicator: Refined vertical bar */}
                <div className="absolute -left-[50px] top-0 bottom-0 flex items-center">
                  {i === activeIndex && (
                    <motion.div 
                      layoutId="activeNeedle"
                      className="w-[3px] h-8 bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] z-20 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 35 }}
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <p className={`font-mono text-sm md:text-base uppercase tracking-[0.3em] font-medium transition-all duration-300 ${
                    i === activeIndex ? "text-white translate-x-3" : "text-white/50 group-hover:text-white/70"
                  }`}>
                    {t.author}
                  </p>
                  <p className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
                    i === activeIndex ? "text-white/70 translate-x-3" : "text-white/50 group-hover:text-white/70"
                  }`}>
                    {t.role} <span className="opacity-30">/</span> {t.company}
                  </p>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Background Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/[0.01] to-transparent" />
    </section>
  );
};
