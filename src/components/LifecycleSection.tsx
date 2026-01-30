import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSanityQuery } from "@/hooks/useSanityData";

const defaultFeatures = [
  {
    title: "Build",
    number: "01",
    description: "Serverless inference with < 60ms cold starts.",
  },
  {
    title: "Tune",
    number: "02",
    description: "Fine-tune with RLHF and adaptive speculation.",
  },
  {
    title: "Scale",
    number: "03",
    description: "Global orchestration on dedicated H100 clusters.",
  },
];

export const LifecycleSection = () => {
  const { data: sectionData } = useSanityQuery<any>('lifecycle-section', `*[_type == "lifecycleSection"][0]`);
  const features = sectionData?.features || defaultFeatures;

  return (
    <section className="py-24 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Compact Header */}
        <div className="mb-16 text-center lg:text-left">

          <h2 className="text-4xl lg:text-6xl font-heading font-bold text-white tracking-tightest leading-none">
            {sectionData?.heading || 'The Lifecycle.'}
          </h2>
        </div>

        {/* Horizontal Instrument Track */}
        <div className="grid md:grid-cols-3 gap-1 relative">
          {/* Connector Line */}
          <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-white/[0.06] hidden md:block" />
          
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative pt-12 group"
            >
              {/* Dot on the track */}
              <div className="absolute top-[37px] left-0 w-2 h-2 bg-white/20 rounded-full group-hover:bg-white group-hover:scale-150 transition-all duration-500 z-10 hidden md:block" />
              
              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all duration-700 h-full">
                <span className="font-mono text-[11px] text-white/20 block mb-6">{feature.number || `0${i + 1}`}</span>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 group-hover:text-[#FF6B35] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
                
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};