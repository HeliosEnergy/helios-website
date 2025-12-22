import React, { useState } from 'react';
import { usePricingData, PricingTier } from '@/hooks/usePricingData';
import PricingHero from '@/components/pricing/PricingHero';
import PricingTabs from '@/components/pricing/PricingTabs';
import PricingCalculator from '@/components/pricing/PricingCalculator';
import PricingComparison from '@/components/pricing/PricingComparison';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PricingPage: React.FC = () => {
    const { gpuModels, pricingTiers, pageConfig, loading, error } = usePricingData();
    const [selectedTier, setSelectedTier] = useState(pricingTiers[0] || null);

    // Update selected tier when data loads
    React.useEffect(() => {
        if (pricingTiers.length > 0 && !selectedTier) {
            setSelectedTier(pricingTiers[0]);
        }
    }, [pricingTiers, selectedTier]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground">Loading pricing data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <h2 className="text-2xl font-bold text-foreground">Error Loading Pricing</h2>
                    <p className="text-muted-foreground">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary text-foreground font-semibold hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!pageConfig || gpuModels.length === 0 || pricingTiers.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <h2 className="text-2xl font-bold text-foreground">No Pricing Data Available</h2>
                    <p className="text-muted-foreground">
                        Please configure pricing data in Sanity CMS first.
                    </p>
                </div>
            </div>
        );
    }

    if (!selectedTier) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <PricingHero
                title={pageConfig.heroTitle}
                subtitle={pageConfig.heroSubtitle}
                ctaButtonText={pageConfig.ctaButtonText}
                ctaButtonUrl={pageConfig.ctaButtonUrl}
            />

            {/* Pricing Tiers Tabs */}
            <div className="w-full py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <PricingTabs
                        tiers={pricingTiers}
                        selectedTier={selectedTier}
                        onTierChange={setSelectedTier}
                    />
                </div>
            </div>

            {/* Pricing Calculator */}
            <div className="w-full py-16 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <PricingCalculator
                        gpuModels={gpuModels}
                        selectedTier={selectedTier}
                        title={pageConfig.calculatorTitle}
                        calendlyUrl={pageConfig.calendlyUrl}
                    />
                </div>
            </div>

            {/* Pricing Comparison Table */}
            <div className="w-full py-16 bg-background">
                <PricingComparison
                    gpuModels={gpuModels}
                    selectedTier={selectedTier}
                    title={pageConfig.comparisonTableTitle}
                />
            </div>

            {/* Footer Note */}
            {pageConfig.footerNote && (
                <div className="w-full py-8 bg-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                        <p className="text-sm text-muted-foreground">{pageConfig.footerNote}</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default PricingPage;
