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
    <section className="bg-black py-24 px-6 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
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
                className="relative group cursor-pointer overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/5 flex flex-col"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <motion.img
                    src={gpu.image}
                    alt={gpu.name}
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      opacity: isHovered ? 0.2 : 0.6,
                    }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-contain p-12 lg:p-24"
                  />
                  <motion.div 
                    animate={{
                      opacity: isHovered ? 0.8 : 0
                    }}
                    className="absolute inset-0 bg-black z-10" 
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-white/70 text-[10px] font-mono uppercase tracking-[0.4em]">Infrastructure</p>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {gpu.name}
                      </h3>
                    </div>

                    <motion.div 
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                      className="max-w-md"
                    >
                      <p className="text-white/80 text-lg font-light leading-relaxed">
                        {gpu.description}
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-1">
                      <p className="text-white/70 text-[10px] font-mono uppercase tracking-[0.2em]">Starting at</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-white tracking-tighter">${gpu.price}</span>
                        <span className="text-white/60 text-sm font-light">/ hour</span>
                      </div>
                      <p className="text-white/50 text-[10px] font-mono uppercase tracking-[0.1em] pt-2">36 Month Reserved</p>
                    </div>

                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                    >
                      <Link to={`/contact?service=clusters&cluster=${gpu.clusterId}`}>
                        <Button
                          size="lg"
                          className="rounded-full bg-white text-black hover:bg-white/90 px-8 text-xs font-bold uppercase tracking-widest group/btn"
                        >
                          {gpu.cta}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </motion.div>
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
