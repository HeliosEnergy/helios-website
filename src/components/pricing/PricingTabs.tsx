import React from 'react';
import { PricingTier } from '@/hooks/usePricingData';

interface PricingTabsProps {
    tiers: PricingTier[];
    selectedTier: PricingTier;
    onTierChange: (tier: PricingTier) => void;
}

const PricingTabs: React.FC<PricingTabsProps> = ({ tiers, selectedTier, onTierChange }) => {
    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Tabs Container */}
            <div className="relative bg-surface p-1 rounded-sm inline-flex flex-wrap sm:flex-nowrap gap-1 sm:gap-0 max-w-full">
                {/* Tab buttons */}
                {tiers.map((tier) => (
                    <button
                        key={tier.id}
                        onClick={() => onTierChange(tier)}
                        className={`relative px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all duration-200 z-10 min-w-0 flex-1 sm:flex-none ${selectedTier.id === tier.id
                                ? 'bg-foreground text-background shadow-md'
                                : 'text-foreground/70 hover:text-foreground hover:bg-surface-elevated'
                            }`}
                        aria-pressed={selectedTier.id === tier.id}
                        aria-label={`Select ${tier.label} plan`}
                    >
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-center leading-tight whitespace-nowrap font-semibold">
                                {tier.label}
                                {tier.featured && <span className="ml-1">⭐</span>}
                            </span>
                            {tier.discount > 0 && selectedTier.id === tier.id && (
                                <span className="text-xs text-primary font-bold">
                                    {tier.discount}% off
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Selected Plan Description */}
            <div className="text-center px-4">
                <p className="text-sm text-muted-foreground">
                    {selectedTier.duration}
                </p>
            </div>
        </div>
    );
};

export default PricingTabs;
