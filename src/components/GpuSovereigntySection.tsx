import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const GPU_DATA = [
  {
    id: "b200",
    clusterId: "b200", // matches ContactPage ClusterType
    name: "NVIDIA Blackwell B200",
    price: "3.10",
    description: "Optimized for large-scale foundation models and high-throughput inference clusters.",
    specs: ["20 PFLOPS", "900GB/s NVLink", "192GB HBM3e"],
    image: "/gpus/dgx-b200.jpg",
    cta: "Reserve Cluster",
    theme: "white"
  },
  {
    id: "rtx6000",
    clusterId: "rtx-6000-pro", // matches ContactPage ClusterType
    name: "NVIDIA RTX 6000 Pro",
    price: "1.10",
    description: "Dedicated performance for model fine-tuning, image generation, and professional visualization.",
    specs: ["48GB GDDR6", "142 TFLOPS", "Pro Series"],
    image: "/gpus/NVIDIA-RTX-PRO-6000-BLACKWELL-SERVER-HERO.jpg",
    cta: "Start Instance",
    theme: "white"
  }
];

export const GpuSovereigntySection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="bg-black py-12 lg:py-24 px-4 lg:px-6 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:h-[600px]">
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
                className="relative group cursor-pointer overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/5 flex flex-col min-h-[400px] lg:min-h-0"
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
                      <p className="text-white/70 text-[10px] font-mono uppercase tracking-[0.4em]">Infrastructure</p>
                      <h3 className="text-2xl lg:text-4xl font-bold text-white tracking-tight">
                        {gpu.name}
                      </h3>
                    </div>

                    {/* Description - always visible on mobile, hover on desktop */}
                    <div className="max-w-md lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-white/70 lg:text-white/80 text-sm lg:text-lg font-light leading-relaxed">
                        {gpu.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:gap-8 mt-6 lg:mt-0">
                    <div className="space-y-1">
                      <p className="text-white/70 text-[10px] font-mono uppercase tracking-[0.2em]">Starting at</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">${gpu.price}</span>
                        <span className="text-white/70 text-sm font-light">/ hour</span>
                      </div>
                      <p className="text-white/70 text-[10px] font-mono uppercase tracking-[0.1em] pt-1">36 Month Reserved</p>
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
