import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { EASE, fadeUp, sectionHeading } from "./HomeRevampSections";

const GPU_DATA = [
  {
    id: "gb300",
    clusterId: "gb300",
    eyebrow: "Rack-scale system",
    name: "NVIDIA GB300 NVL72",
    availability: "Q3 capacity",
    description: "72 Blackwell Ultra GPUs and 36 Grace CPUs in one liquid-cooled, rack-scale system. Built for frontier training and large-scale reasoning inference.",
    specs: ["72x Blackwell Ultra", "Direct liquid, water-free", "Frontier training"],
    image: "/gpus/dgx-b200.jpg",
    cta: "Join Waitlist",
    theme: "white"
  },
  {
    id: "b300",
    clusterId: "b300",
    eyebrow: "Flagship GPU",
    name: "NVIDIA B300",
    availability: "Q3 capacity",
    description: "Blackwell Ultra with massive HBM3e memory and a major bandwidth jump over B200. Built for multi-modal training and high-throughput inference clusters.",
    specs: ["288 GB HBM3e", "InfiniBand, non-blocking", "Training & inference"],
    image: "/gpus/dgx-b300.jpg",
    cta: "Join Waitlist",
    theme: "white"
  },
  {
    id: "rtx6000",
    clusterId: "rtx-6000-pro", // matches ContactPage ClusterType
    eyebrow: "Workhorse GPU",
    name: "NVIDIA RTX PRO 6000",
    availability: "Available now",
    description: "Blackwell server edition with 96 GB GDDR7. The price-performance pick for fine-tuning, image and video generation, and production inference.",
    specs: ["96 GB GDDR7", "Air or liquid cooled", "Fine-tuning & inference"],
    image: "/gpus/NVIDIA-RTX-PRO-6000-BLACKWELL-SERVER-HERO.jpg",
    cta: "Join Waitlist",
    theme: "white"
  }
];

export const GpuSovereigntySection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="bg-black py-20 lg:py-28 px-4 lg:px-6 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="mb-14 lg:mb-20 max-w-4xl">
          <h2 className={sectionHeading}>
            The newest NVIDIA hardware. Not last year's.
          </h2>
          <p className="mt-6 text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-2xl">
            We deploy the current Blackwell Ultra generation, as a service or as colo-ready racks.
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-px bg-white/10 border border-white/10 lg:h-[600px]">
          {GPU_DATA.map((gpu) => {
            const isHovered = hoveredId === gpu.id;
            const isOtherHovered = hoveredId !== null && hoveredId !== gpu.id;

            return (
              <motion.div
                key={gpu.id}
                onMouseEnter={() => setHoveredId(gpu.id)}
                onMouseLeave={() => setHoveredId(null)}
                animate={{
                  flex: isHovered ? 2 : isOtherHovered ? 0.5 : 1,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative group cursor-pointer overflow-hidden bg-black flex flex-col min-h-[400px] lg:min-h-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={gpu.image}
                    alt={gpu.name}
                    className="w-full h-full object-cover opacity-40 lg:opacity-60 lg:group-hover:opacity-20 lg:group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full p-6 lg:p-10 flex flex-col justify-between">
                  <div className="space-y-4 lg:space-y-8">
                    <div className="space-y-2">
                      <p className="text-white/75 text-[11px] font-mono uppercase tracking-[0.4em]">{gpu.eyebrow}</p>
                      <h3 className="text-2xl lg:text-4xl font-bold text-white tracking-tight">
                        {gpu.name}
                      </h3>
                    </div>

                    {/* Description - always visible on mobile, hover on desktop */}
                    <div className="max-w-md lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-white/80 lg:text-white/85 text-base lg:text-lg font-light leading-relaxed">
                        {gpu.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:gap-8 mt-6 lg:mt-0">
                    <div className="space-y-1">
                      <p className="text-white/75 text-[11px] font-mono uppercase tracking-[0.2em]">Specs</p>
                      <div className="space-y-2 pt-2">
                        {gpu.specs.map((spec) => (
                          <div key={spec} className="text-white text-sm lg:text-base font-light border-b border-white/10 pb-2">
                            {spec}
                          </div>
                        ))}
                      </div>
                      <p className="text-primary text-[10px] font-mono uppercase tracking-[0.18em] pt-3">{gpu.availability}</p>
                    </div>

                    {/* CTA - always visible on mobile */}
                    <div className="lg:opacity-0 lg:group-hover:opacity-100 lg:-translate-x-4 lg:group-hover:translate-x-0 transition-all duration-500">
                      <Link to={`/contact?service=clusters&cluster=${gpu.clusterId}`}>
                        <Button
                          size="lg"
                          className="rounded-full bg-white text-black hover:bg-white/90 px-6 lg:px-8 text-xs font-bold uppercase tracking-widest group/btn w-full lg:w-auto"
                        >
                          {gpu.cta}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
