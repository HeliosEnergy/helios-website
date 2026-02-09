import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";
import { useSanityQuery } from "@/hooks/useSanityData";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/lib/sanity";
import { StaticMeshGradient } from '@paper-design/shaders-react';

export const ModelsSection = () => {
  const { data: sectionData } = useSanityQuery<any>(
    'models-section',
    `*[_type == "modelsSection"][0] {
      sectionLabel,
      heading,
      description,
      viewAllLink,
       models[]-> {
        _id,
        name,
        slug,
        provider,
        pricingDisplay,
        inputPrice,
        outputPrice,
        imagePrice,
        contextWindow,
        modelType,
        iconFilename,
        icon,
        color,
        initial
      }
    }`
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const models = sectionData?.models || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      return () => ref.removeEventListener("scroll", checkScroll);
    }
  }, [models]);

  // Autoscroll logic
  useEffect(() => {
    if (isHovered || !canScrollRight && !canScrollLeft) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, canScrollRight, canScrollLeft]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth; // Scroll by a full view for precision
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
const shaderConfigs = [
  {
    // Industrial Ember + Burgundy bridge
    colors: ["#333333", "#000000", "#FF7A45", "#6B1D2A"],
    waveX: 0.18,
    rotation: 245
  },
  {
    // Warm Orange Titanium
    colors: ["#666666", "#FFFFFF", "#FF9F0A", "#111111"],
    waveX: 0.20,
    rotation: 280
  },
  {
    // Obsidian Forge + Deep Maroon
    colors: ["#000000", "#6B1D2A", "#FF7A45", "#A0A0A0"],
    waveX: 0.17,
    rotation: 260
  },
  {
    // Ghost Pulse
    colors: ["#FFFFFF", "#A0A0A0", "#FF9F0A", "#000000"],
    waveX: 0.19,
    rotation: 270
  }
];
return (
    <section className="py-16 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-6">
        {/* Jony's Header: Pure & Monolithic */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-3xl space-y-6">

            <h2 className="text-7xl sm:text-8xl font-heading font-bold text-white tracking-tightest leading-[0.85]">
              {sectionData?.heading ? sectionData.heading : 'All Models.\nOne Platform.'}
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:items-end">
            <p className="text-2xl text-white/70 max-w-sm font-light leading-relaxed lg:text-right">
              {sectionData?.description || 'The fastest AI cloud.'}
            </p>
            <Link to="/model-library" className="text-xs font-mono uppercase tracking-[0.4em] text-white/80 hover:text-primary transition-colors flex items-center gap-4 group">
              View Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>
        </div>

        {/* The Carousel of Identity */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory px-2"
          >
            {models.map((model: any, i: number) => {
              const getPricing = () => {
                if (model.pricingDisplay) return model.pricingDisplay;
                if (model.imagePrice) return `$${model.imagePrice}/Img`;
                if (model.inputPrice && model.outputPrice) {
                  return `$${model.inputPrice}/M · $${model.outputPrice}/M`;
                }
                return 'Contact';
              };

              const iconUrl = model.icon ? urlFor(model.icon).width(200).height(200).url() : model.iconFilename ? `/model-lib/${model.iconFilename}` : null;
              const shader = shaderConfigs[i % shaderConfigs.length];

              return (
                <Link
                  key={model._id || i}
                  to={`/model-library/${model.slug?.current}`}
                  className="block flex-shrink-0 w-full md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700 ease-out group snap-start relative h-[500px]"
                >
                  {/* The Background: Paper Shader */}
                  <div className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity duration-1000">
<StaticMeshGradient
  width={1280}
  height={720}
  colors={shader.colors}
  positions={42}
  mixing={0.38}
  waveX={0.49}
  waveXShift={0}
  waveY={1}
  waveYShift={0}
  scale={0.68}
  rotation={shader.rotation}
  grainMixer={0}
  grainOverlay={0.78}
  offsetX={-0.28}
/>
                  </div>

                  <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                    {/* Top Left: Small Icon (No bounding box) */}
                    <div className="w-12 h-12 flex items-start justify-start group-hover:scale-110 transition-transform duration-500">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={`${model.provider} logo`}
                          className="w-10 h-10 object-contain filter brightness-100"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-10 h-10 flex items-center justify-center text-lg font-heading font-bold text-white/80 bg-white/10 rounded-md ${iconUrl ? 'hidden' : ''}`}>
                        {model.initial || model.name?.charAt(0)}
                      </div>
                    </div>

                    {/* Bottom Left: Identity */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-[0.4em] text-white block mb-2">{model.provider}</span>
                        <h3 className="text-5xl font-heading font-bold text-white tracking-tight leading-none">
                          {model.name}
                        </h3>
                      </div>

                      <div className="pt-4">
                        <p className="text-sm font-mono tracking-[0.2em] text-white uppercase leading-relaxed">
                          {model.modelType} • {model.contextWindow ? `${parseInt(model.contextWindow).toLocaleString()} Context` : 'Standard'}
                          <br />
                          <span className="font-bold">{getPricing()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-12 justify-end">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll models left"
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${canScrollLeft ? 'bg-white/5 border-white/20 text-white hover:bg-white hover:text-black hover:border-white' : 'bg-white/[0.02] border-white/10 text-white/30'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll models right"
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${canScrollRight ? 'bg-white/5 border-white/20 text-white hover:bg-white hover:text-black hover:border-white' : 'bg-white/[0.02] border-white/10 text-white/30'}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
