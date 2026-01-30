import React, { useState } from 'react';
import { GPUModel, PricingTier } from '@/hooks/usePricingData';
import { calculatePricing, calculateTotalReservationCost, formatPrice } from '@/lib/pricingCalculations';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingCalculatorProps {
    gpuModels: GPUModel[];
    selectedTier: PricingTier;
    title?: string;
    calendlyUrl?: string;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({
    gpuModels,
    selectedTier,
    title = 'Cost Estimator',
    calendlyUrl = 'https://calendly.com/jose-helios/30min'
}) => {
    const [selectedGPU, setSelectedGPU] = useState(gpuModels[0] || null);
    const [hoursPerMonth, setHoursPerMonth] = useState(730);

    if (!selectedGPU) return null;

    const pricing = calculatePricing(
        selectedGPU.heliosPrice,
        1,
        hoursPerMonth,
        selectedTier.discount
    );

    const totalReservationCost = calculateTotalReservationCost(pricing.totalCost, selectedTier.id);

    return (
        <div className="w-full">
            <div className="mb-16">
                <h2 className="text-4xl font-heading font-bold text-black mb-4">
                    {title}
                </h2>
                <p className="text-black/60 text-lg">Model your infrastructure costs with precision.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                
                {/* Configuration side - Clean Grey Surface */}
                <div className="space-y-12 bg-[#F9F9FB] p-12 rounded-[40px] border border-black/[0.05]">
                    {/* GPU Selector */}
                    <div className="space-y-6">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-black/40">Hardware Architecture</label>
                        <div className="grid grid-cols-2 gap-4">
                            {gpuModels.map((gpu) => (
                                <button
                                    key={gpu.id}
                                    onClick={() => setSelectedGPU(gpu)}
                                    className={`px-6 py-5 rounded-2xl text-sm font-bold transition-all border-2 ${
                                        selectedGPU.id === gpu.id 
                                            ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                                            : 'bg-white text-black/60 border-black/5 hover:border-black/20'
                                    }`}
                                >
                                    {gpu.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hours Slider */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-black/40">Usage Intensity</label>
                            <div className="text-right">
                                <span className="text-4xl font-bold text-black">{hoursPerMonth}</span>
                                <span className="text-sm font-bold text-black/40 ml-2">hrs / mo</span>
                            </div>
                        </div>
                        
                        <div className="relative h-2 bg-black/5 rounded-full">
                            <input
                                type="range"
                                min="1"
                                max="730"
                                value={hoursPerMonth}
                                onChange={(e) => setHoursPerMonth(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="absolute h-full bg-black rounded-full transition-all duration-100"
                                style={{ width: `${(hoursPerMonth / 730) * 100}%` }}
                            />
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-black rounded-full shadow-xl pointer-events-none"
                                style={{ left: `calc(${(hoursPerMonth / 730) * 100}% - 12px)` }}
                            />
                        </div>

                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-black/20">
                            <span>Intermittent (1h)</span>
                            <span>Always-On (730h)</span>
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="pt-8 border-t border-black/5 grid grid-cols-2 gap-12">
                        <div>
                            <p className="text-black/30 text-[10px] uppercase font-bold tracking-widest mb-1">Compute RAM</p>
                            <p className="text-2xl font-bold text-black">{selectedGPU.vram} VRAM</p>
                        </div>
                        <div>
                            <p className="text-black/30 text-[10px] uppercase font-bold tracking-widest mb-1">Standard Rate</p>
                            <p className="text-2xl font-bold text-black">${selectedGPU.heliosPrice}/hr</p>
                        </div>
                    </div>
                </div>

                {/* Estimation side - The High-Contrast Output */}
                <div className="flex flex-col h-full">
                    <div className="bg-white p-12 lg:p-16 rounded-[40px] text-black border-2 border-black flex flex-col justify-between flex-1 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Estimated Monthly Infrastructure</p>
                            <AnimatePresence mode="wait">
                                <motion.h3
                                    key={pricing.totalCost}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
                                >
                                    ${formatPrice(pricing.totalCost)}
                                </motion.h3>
                            </AnimatePresence>
                        </div>

                        <div className="space-y-6 pt-12 border-t border-black/5">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-black/40 font-medium">Applied Plan</span>
                                <span className="font-bold">{selectedTier.label}</span>
                            </div>
                            {selectedTier.discount > 0 && (
                                <div className="flex justify-between items-center text-lg">
                                    <span className="text-black/40 font-medium">Volume Discount</span>
                                    <span className="font-bold text-[#FF6B35]">-{selectedTier.discount}% Applied</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-4 border-t border-black/5">
                                <span className="text-xl font-bold">Total Period Value</span>
                                <span className="text-3xl font-bold">${formatPrice(totalReservationCost)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => window.open(calendlyUrl, '_blank')}
                            className="w-full py-8 mt-12 bg-black text-white rounded-2xl font-bold text-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-2xl"
                        >
                            Confirm Reservation
                        </button>
                    </div>
                    
                    <p className="mt-8 text-center text-xs text-black/30 font-medium px-12 leading-relaxed">
                        Final rates may vary based on region and network configurations. All prices exclude local taxes.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PricingCalculator;