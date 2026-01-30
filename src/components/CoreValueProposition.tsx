import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import type { CoreValueProposition as CoreValuePropositionData } from "@/types/sanity";

const defaultCards = [
  {
    title: "Predictable costs",
    description: "No surprise charges or hidden complexity. Designed for teams that are budget-conscious and serious about scale.",
  },
  {
    title: "Inference-first by design",
    description: "Optimized for production inference workloads today, with a clear path to training as your needs grow.",
  },
  {
    title: "Simple by default",
    description: "Deploy and manage GPUs through a clean, intuitive interface built for engineers who want to move fast.",
  },
];

export const CoreValueProposition = () => {
  const { data: sectionData } = useSanityQuery<CoreValuePropositionData>('core-value-proposition', QUERIES.coreValueProposition);

  const heading = sectionData?.heading || "Why teams choose Helios.";
  const cards = sectionData?.cards || defaultCards;

  return (
    <section className="py-24 bg-black border-y border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* The Monolithic Header */}
        <div className="mb-20">

          <h2 className="text-5xl lg:text-7xl font-heading font-bold text-white tracking-tightest leading-none">
            {heading}
          </h2>
        </div>

        {/* The Precision Row: 3-Column Instrumental Layout */}
        <div className="grid md:grid-cols-3 gap-0 border border-white/[0.08] rounded-[40px] overflow-hidden bg-white/[0.02]">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`p-10 lg:p-14 group transition-all duration-700 hover:bg-white/[0.03] ${
                i !== cards.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/[0.08]' : ''
              }`}
            >
              <div className="space-y-8">
                <span className="font-mono text-[11px] text-white/20 group-hover:text-[#FF6B35] transition-colors duration-500 font-bold">
                  0{i + 1}
                </span>
                
                <div className="space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm lg:text-base text-white/50 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};