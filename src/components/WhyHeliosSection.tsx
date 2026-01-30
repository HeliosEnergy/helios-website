import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useSanityQuery } from "@/hooks/useSanityData";

const defaultAudiences = [
  {
    title: "AI Natives",
    subtitle: "Built for Velocity",
    points: [
      "Day 0 support for latest models",
      "Lowest cost-per-token in production",
      "Full API compatibility with legacy stacks",
    ],
    description: "For teams where speed is the only currency. Helios provides the raw power and flexibility to iterate faster."
  },
  {
    title: "Enterprise",
    subtitle: "Built for Sovereignty",
    points: [
      "SOC2, HIPAA, and GDPR compliant",
      "Bring your own cloud (BYOC) support",
      "Zero data retention guarantees",
    ],
    description: "For organizations where security is a prerequisite. Helios offers mission-critical stability and control."
  },
];

export const WhyHeliosSection = () => {
  const { data: sectionData } = useSanityQuery<any>('why-helios-section', `*[_type == "whyHeliosSection"][0]`);
  const audiences = sectionData?.audiences || defaultAudiences;

  return (
    <section className="py-24 lg:py-32 bg-black border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-24 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.6em] text-white/60 block mb-8 italic">
              {sectionData?.sectionLabel || 'Strategic Advantage'}
            </span>
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tightest leading-[0.95]">
              {sectionData?.heading || 'Startup velocity. Enterprise stability.'}
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-1 border-t border-white/[0.06]">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`py-16 lg:py-24 ${index === 0 ? 'lg:pr-24 border-b lg:border-b-0 lg:border-r border-white/[0.06]' : 'lg:pl-24'}`}
            >
              <div className="space-y-12">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35] font-bold">
                    {audience.subtitle || "The Profile"}
                  </span>
                  <h3 className="text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight">
                    {audience.title}
                  </h3>
                  <p className="text-lg text-white/70 leading-relaxed max-w-md">
                    {audience.description}
                  </p>
                </div>

                <ul className="space-y-6">
                  {audience.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center mt-1 group-hover:bg-white group-hover:border-white transition-colors duration-300">
                        <Check className="w-3 h-3 text-white/70 group-hover:text-black transition-colors" />
                      </div>
                      <span className="text-base text-white/70 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>

                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white hover:gap-4 transition-all pt-8">
                  Examine Architecture
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};