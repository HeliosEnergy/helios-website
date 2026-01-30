import React, { useState } from 'react';
import { usePricingData, PricingTier } from '@/hooks/usePricingData';
import PricingHero from '@/components/pricing/PricingHero';
import PricingCalculator from '@/components/pricing/PricingCalculator';
import PricingComparison from '@/components/pricing/PricingComparison';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

const PricingPage: React.FC = () => {
    const { gpuModels, pricingTiers, pageConfig, loading, error } = usePricingData();
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

    React.useEffect(() => {
        if (pricingTiers.length > 0 && !selectedTier) {
            setSelectedTier(pricingTiers[0]);
        }
    }, [pricingTiers, selectedTier]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
                    <p className="font-mono text-xs uppercase tracking-widest text-black/40">Synchronizing Market Data...</p>
                </div>
            </div>
        );
    }

    if (error || !pageConfig || gpuModels.length === 0 || pricingTiers.length === 0 || !selectedTier) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md px-6">
                    <h2 className="text-3xl font-heading font-bold text-black tracking-tightest">Connection Interrupted</h2>
                    <p className="text-black/60 text-sm leading-relaxed">
                        The secure pricing engine is currently unreachable. Please refresh to re-establish the connection.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9FB] text-black selection:bg-black selection:text-white">
            {/* The Navbar will need to handle the light background - I'll adjust it in the component later if needed, but for now we'll keep it as is or assume it adapts. */}
            <Navbar />

            <main>
                <PricingHero
                    title={pageConfig.heroTitle}
                    subtitle={pageConfig.heroSubtitle}
                />

                {/* Plan Selection - The Professional Choice */}
                <section className="py-24">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                        <div className="mb-16">
                            <h2 className="text-4xl font-heading font-bold text-black mb-4">Choose your deployment model.</h2>
                            <p className="text-black/50 text-lg max-w-2xl">
                                Enterprise-grade infrastructure tailored to your production scale. No hidden fees, no egress taxes.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {pricingTiers.map((tier) => (
                                <button
                                    key={tier.id}
                                    onClick={() => setSelectedTier(tier)}
                                    className={`text-left p-10 rounded-[32px] border transition-all duration-500 relative flex flex-col justify-between min-h-[340px] group ${
                                        selectedTier.id === tier.id 
                                            ? 'bg-white border-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]' 
                                            : 'bg-white/50 border-black/5 hover:border-black/20 hover:bg-white'
                                    }`}
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-10">
                                            <span className={`text-[11px] font-bold uppercase tracking-[0.3em] ${
                                                selectedTier.id === tier.id ? 'text-black' : 'text-black/30'
                                            }`}>
                                                {tier.label}
                                            </span>
                                            {tier.discount > 0 && (
                                                <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-[10px] font-bold">
                                                    SAVE {tier.discount}%
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 tracking-tight">{tier.duration}</h3>
                                        <p className="text-black/50 text-sm leading-relaxed">
                                            {tier.id === 'on-demand' 
                                                ? 'Instant scale for sporadic workloads and early-stage R&D.' 
                                                : `Optimized unit costs for sustained production clusters with a ${tier.duration} commitment.`}
                                        </p>
                                    </div>

                                    <div className="mt-12 flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full border ${
                                            selectedTier.id === tier.id ? 'bg-black border-black' : 'bg-transparent border-black/20'
                                        }`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                            selectedTier.id === tier.id ? 'text-black' : 'text-black/30'
                                        }`}>
                                            {selectedTier.id === tier.id ? 'Selected Strategy' : 'Select Model'}
                                        </span>
                                    </div>

                                    {selectedTier.id === tier.id && (
                                        <motion.div 
                                            layoutId="activePlan"
                                            className="absolute inset-0 rounded-[32px] border-2 border-black pointer-events-none"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Calculator Section */}
                <section className="py-24 bg-white border-y border-black/5">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                        <PricingCalculator
                            gpuModels={gpuModels}
                            selectedTier={selectedTier}
                            title={pageConfig.calculatorTitle}
                            calendlyUrl={pageConfig.calendlyUrl}
                        />
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="py-24">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                        <PricingComparison
                            gpuModels={gpuModels}
                            selectedTier={selectedTier}
                            title={pageConfig.comparisonTableTitle}
                        />
                    </div>
                </section>

                {/* Footer CTA */}
                {pageConfig.footerNote && (
                    <section className="pb-32 px-6">
                        <div className="max-w-[1400px] mx-auto bg-black rounded-[40px] p-12 lg:p-20 flex flex-col md:flex-row justify-between items-center gap-12 text-white overflow-hidden relative">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-4xl font-heading font-bold tracking-tightest">Ready to migrate?</h3>
                                <p className="text-white/60 text-lg max-w-xl">
                                    Our team handles the heavy lifting. Move your clusters to Helios without the downtime or the legacy overhead.
                                </p>
                                <p className="text-white/40 text-sm italic pt-4">{pageConfig.footerNote}</p>
                            </div>
                            <button 
                                onClick={() => window.open(pageConfig.calendlyUrl, '_blank')}
                                className="relative z-10 px-12 py-6 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
                            >
                                Contact Engineering
                            </button>
                            
                            {/* Visual Detail */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default PricingPage;
