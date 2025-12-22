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
    title = 'GPU Pricing Comparison'
}) => {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // Calculate discounted price
    const getHeliosPrice = (basePrice: number): number => {
        return basePrice * (1 - selectedTier.discount / 100);
    };

    // Sort GPU models
    const sortedModels = useMemo(() => {
        if (!sortDirection) return gpuModels;

        return [...gpuModels].sort((a, b) => {
            const priceA = getHeliosPrice(a.heliosPrice);
            const priceB = getHeliosPrice(b.heliosPrice);
            return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }, [gpuModels, sortDirection, selectedTier]);

    const toggleSort = () => {
        setSortDirection(current => {
            if (current === null) return 'asc';
            if (current === 'asc') return 'desc';
            return null;
        });
    };

    return (
        <div className="w-full py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    {title}
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                    All prices shown in USD/hr
                </p>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-6 px-6 font-semibold text-foreground text-lg">
                                    GPU
                                </th>
                                <th className="text-left py-6 px-6">
                                    <button
                                        onClick={toggleSort}
                                        className="bg-primary text-foreground px-4 py-2 font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
                                    >
                                        <span>Helios</span>
                                        <span className="text-sm">
                                            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
                                        </span>
                                    </button>
                                    {selectedTier.discount > 0 && (
                                        <span className="text-xs text-primary font-bold ml-2">
                                            {selectedTier.discount}% off
                                        </span>
                                    )}
                                </th>
                                <th className="text-left py-6 px-6 font-semibold text-foreground text-lg">AWS</th>
                                <th className="text-left py-6 px-6 font-semibold text-foreground text-lg">Google Cloud</th>
                                <th className="text-left py-6 px-6 font-semibold text-foreground text-lg">Lambda</th>
                                <th className="text-left py-6 px-6 font-semibold text-foreground text-lg">Modal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedModels.map((gpu, index) => {
                                const heliosPrice = getHeliosPrice(gpu.heliosPrice);
                                return (
                                    <tr
                                        key={gpu.id}
                                        className={`border-b border-border/50 hover:bg-surface transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-surface/30'
                                            }`}
                                    >
                                        <td className="py-6 px-6 font-semibold text-foreground">
                                            <div className="flex flex-col space-y-2">
                                                <span>{gpu.name}</span>
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/20 text-primary w-fit">
                                                    {gpu.vram} VRAM
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-foreground font-bold text-lg">
                                                    ${heliosPrice.toFixed(2)}
                                                </span>
                                                {selectedTier.discount > 0 && (
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        ${gpu.heliosPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 text-muted-foreground">
                                            {gpu.awsPrice && parseProviderPrice(gpu.awsPrice) ? `$${gpu.awsPrice}` : (
                                                <span className="italic text-muted-foreground/50">{gpu.awsPrice || 'Not listed'}</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-6 text-muted-foreground">
                                            {gpu.googleCloudPrice && parseProviderPrice(gpu.googleCloudPrice) ? `$${gpu.googleCloudPrice}` : (
                                                <span className="italic text-muted-foreground/50">{gpu.googleCloudPrice || 'Not listed'}</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-6 text-muted-foreground">
                                            {gpu.lambdaPrice && parseProviderPrice(gpu.lambdaPrice) ? `$${gpu.lambdaPrice}` : (
                                                <span className="italic text-muted-foreground/50">{gpu.lambdaPrice || 'Not listed'}</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-6 text-muted-foreground">
                                            {gpu.modalPrice && parseProviderPrice(gpu.modalPrice) ? `$${gpu.modalPrice}` : (
                                                <span className="italic text-muted-foreground/50">{gpu.modalPrice || 'Not listed'}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                    {sortedModels.map((gpu) => {
                        const heliosPrice = getHeliosPrice(gpu.heliosPrice);
                        const isExpanded = expandedCard === gpu.id;

                        return (
                            <div key={gpu.id} className="bg-surface-elevated border border-border">
                                {/* Card Header */}
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => setExpandedCard(isExpanded ? null : gpu.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">{gpu.name}</h3>
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-primary/20 text-primary">
                                                {gpu.vram} VRAM
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-lg font-bold text-foreground">
                                                ${heliosPrice.toFixed(2)}
                                            </div>
                                            {selectedTier.discount > 0 && (
                                                <div className="text-sm text-muted-foreground line-through">
                                                    ${gpu.heliosPrice.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-2 border-t border-border space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-foreground">AWS</span>
                                            <span className="text-muted-foreground">
                                                {gpu.awsPrice && parseProviderPrice(gpu.awsPrice) ? `$${gpu.awsPrice}` : (
                                                    <span className="italic">{gpu.awsPrice || 'Not listed'}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-foreground">Google Cloud</span>
                                            <span className="text-muted-foreground">
                                                {gpu.googleCloudPrice && parseProviderPrice(gpu.googleCloudPrice) ? `$${gpu.googleCloudPrice}` : (
                                                    <span className="italic">{gpu.googleCloudPrice || 'Not listed'}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-foreground">Lambda</span>
                                            <span className="text-muted-foreground">
                                                {gpu.lambdaPrice && parseProviderPrice(gpu.lambdaPrice) ? `$${gpu.lambdaPrice}` : (
                                                    <span className="italic">{gpu.lambdaPrice || 'Not listed'}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-foreground">Modal</span>
                                            <span className="text-muted-foreground">
                                                {gpu.modalPrice && parseProviderPrice(gpu.modalPrice) ? `$${gpu.modalPrice}` : (
                                                    <span className="italic">{gpu.modalPrice || 'Not listed'}</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PricingComparison;
