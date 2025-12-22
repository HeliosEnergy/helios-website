import React, { useState } from 'react';
import { GPUModel, PricingTier } from '@/hooks/usePricingData';
import { calculatePricing, calculateTotalReservationCost, formatPrice } from '@/lib/pricingCalculations';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PricingCalculatorProps {
    gpuModels: GPUModel[];
    selectedTier: PricingTier;
    title?: string;
    calendlyUrl?: string;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({
    gpuModels,
    selectedTier,
    title = 'Calculate Your Costs',
    calendlyUrl = 'https://calendly.com/jose-helios/30min'
}) => {
    const [selectedGPU, setSelectedGPU] = useState(gpuModels[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [hoursPerMonth, setHoursPerMonth] = useState(730); // 24/7 by default
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!selectedGPU) return null;

    const pricing = calculatePricing(
        selectedGPU.heliosPrice,
        quantity,
        hoursPerMonth,
        selectedTier.discount
    );

    const totalReservationCost = calculateTotalReservationCost(pricing.totalCost, selectedTier.id);

    const handleContactSales = () => {
        setIsSubmitting(true);
        window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => setIsSubmitting(false), 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                {title}
            </h2>

            <div className="bg-surface-elevated p-8 md:p-12 space-y-8">
                {/* GPU Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                        Select GPU Model
                    </label>
                    <select
                        value={selectedGPU.id}
                        onChange={(e) => {
                            const gpu = gpuModels.find(g => g.id === e.target.value);
                            if (gpu) setSelectedGPU(gpu);
                        }}
                        className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {gpuModels.map((gpu) => (
                            <option key={gpu.id} value={gpu.id}>
                                {gpu.name} - ${gpu.heliosPrice}/hr
                            </option>
                        ))}
                    </select>
                    {selectedGPU.specs && (
                        <p className="text-sm text-muted-foreground">{selectedGPU.specs}</p>
                    )}
                </div>

                {/* Quantity Control */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                        Number of GPUs: <span className="text-2xl font-bold text-primary">{quantity}</span>
                    </label>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            variant="outline"
                            size="sm"
                            className="px-4"
                        >
                            -
                        </Button>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <Button
                            onClick={() => setQuantity(Math.min(100, quantity + 1))}
                            variant="outline"
                            size="sm"
                            className="px-4"
                        >
                            +
                        </Button>
                    </div>
                </div>

                {/* Hours Per Month */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                        Hours Per Month: <span className="text-2xl font-bold text-primary">{hoursPerMonth}</span>
                    </label>
                    <Slider
                        value={[hoursPerMonth]}
                        onValueChange={(values) => setHoursPerMonth(values[0])}
                        min={1}
                        max={730}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 hour</span>
                        <span>730 hours (24/7)</span>
                    </div>
                </div>

                {/* Pricing Summary - Large Typography */}
                <div className="border-t border-border pt-8 mt-8">
                    <div className="text-center space-y-6">
                        {/* Monthly Cost - Hero Display */}
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Monthly Infrastructure Cost</p>
                            <p className="text-6xl md:text-7xl font-bold text-foreground">
                                ${formatPrice(pricing.totalCost)}
                            </p>
                            {selectedTier.discount > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Save ${formatPrice(pricing.discountAmount)} ({selectedTier.discount}% off)
                                </p>
                            )}
                        </div>

                        {/* Total Reservation Cost */}
                        {selectedTier.id !== 'on-demand' && (
                            <div className="bg-surface py-4 px-6">
                                <p className="text-sm text-muted-foreground">
                                    Total for {selectedTier.label}:{' '}
                                    <span className="font-bold text-foreground text-lg">
                                        ${formatPrice(totalReservationCost)}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* CTA Button */}
                        <Button
                            onClick={handleContactSales}
                            disabled={isSubmitting}
                            className="w-full px-8 py-6 bg-foreground text-background hover:bg-foreground/90 text-lg font-semibold"
                            size="lg"
                        >
                            {isSubmitting ? 'Opening Calendar...' : 'Contact Sales'}
                        </Button>

                        {/* Small Print */}
                        <p className="text-xs text-muted-foreground">
                            Instant provisioning • Enterprise SLA • Scalable infrastructure
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCalculator;
