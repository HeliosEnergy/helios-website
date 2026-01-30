import React from 'react';
import { motion } from 'framer-motion';

interface PricingHeroProps {
    title: string;
    subtitle?: string;
}

const PricingHero: React.FC<PricingHeroProps> = ({
    title,
    subtitle,
}) => {
    return (
        <section className="w-full bg-white pt-32 lg:pt-48 pb-24 border-b border-black/5">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="font-mono text-[11px] uppercase tracking-[0.6em] text-black/40 block mb-12 font-bold">
                            Commercial Infrastructure
                        </span>
                        
                        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tightest leading-[0.95] text-black">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="mt-12 text-2xl text-black/60 leading-relaxed max-w-3xl font-light">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PricingHero;