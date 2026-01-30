import React, { useState, useMemo } from 'react';
import { GPUModel, PricingTier } from '@/hooks/usePricingData';
import { parseProviderPrice } from '@/lib/pricingCalculations';

interface PricingComparisonProps {
    gpuModels: GPUModel[];
    selectedTier: PricingTier;
    title?: string;
}

const PricingComparison: React.FC<PricingComparisonProps> = ({
    gpuModels,
    selectedTier,
    title = 'Provider Benchmark'
}) => {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const getHeliosPrice = (basePrice: number): number => {
        return basePrice * (1 - selectedTier.discount / 100);
    };

    const sortedModels = useMemo(() => {
        return [...gpuModels].sort((a, b) => {
            const priceA = getHeliosPrice(a.heliosPrice);
            const priceB = getHeliosPrice(b.heliosPrice);
            return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }, [gpuModels, sortDirection, selectedTier]);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                    <h2 className="text-4xl font-heading font-bold text-black mb-4">{title}</h2>
                    <p className="text-black/50 text-lg">Direct hourly comparison against legacy and specialized clouds.</p>
                </div>
                <button 
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="text-[11px] font-bold uppercase tracking-widest text-black border-2 border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all"
                >
                    Sort Price: {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
            </div>

            <div className="overflow-x-auto rounded-[32px] border border-black/5 bg-white shadow-xl">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-black/5">
                            <th className="py-8 px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">Architecture</th>
                            <th className="py-8 px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-[#F9F9FB]">Helios Cloud</th>
                            <th className="py-8 px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">AWS (Legacy)</th>
                            <th className="py-8 px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">GCP (Legacy)</th>
                            <th className="py-8 px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">Lambda (Specialized)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03]">
                        {sortedModels.map((gpu) => {
                            const heliosPrice = getHeliosPrice(gpu.heliosPrice);
                            const awsPriceNum = parseProviderPrice(gpu.awsPrice || '');
                            const savings = awsPriceNum ? Math.round(((awsPriceNum - heliosPrice) / awsPriceNum) * 100) : null;

                            return (
                                <tr key={gpu.id} className="hover:bg-[#F9F9FB]/50 transition-colors">
                                    <td className="py-10 px-10">
                                        <p className="text-xl font-bold text-black">{gpu.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">{gpu.vram} VRAM</span>
                                            {savings && savings > 0 && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">Save {savings}%</span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    {/* Helios Column - Highlighted */}
                                    <td className="py-10 px-10 bg-[#F9F9FB] border-x border-black/[0.03]">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-black">${heliosPrice.toFixed(2)}</span>
                                            {selectedTier.discount > 0 && (
                                                <span className="text-[10px] text-black/30 line-through mt-1 font-bold">${gpu.heliosPrice.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-10 px-10 text-base font-medium text-black/40">
                                        {gpu.awsPrice && parseProviderPrice(gpu.awsPrice) ? `$${gpu.awsPrice}` : '—'}
                                    </td>
                                    <td className="py-10 px-10 text-base font-medium text-black/40">
                                        {gpu.googleCloudPrice && parseProviderPrice(gpu.googleCloudPrice) ? `$${gpu.googleCloudPrice}` : '—'}
                                    </td>
                                    <td className="py-10 px-10 text-base font-medium text-black/40">
                                        {gpu.lambdaPrice && parseProviderPrice(gpu.lambdaPrice) ? `$${gpu.lambdaPrice}` : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Reliability Metrics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-t border-black/5">
                {[
                    { label: "Uptime SLA", value: "99.99%", detail: "Enterprise Grade" },
                    { label: "Deployment", value: "< 60s", detail: "Global Ready" },
                    { label: "Networking", value: "400Gbps", detail: "RDMA Enabled" },
                    { label: "Security", value: "Enterprise", detail: "Certified Ready" } // Changed from SOC2/HIPAA until certified
                ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">{stat.label}</p>
                        <p className="text-2xl font-bold text-black">{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">{stat.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingComparison;
