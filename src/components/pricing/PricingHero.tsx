import React from 'react';
import { Button } from '@/components/ui/button';

interface PricingHeroProps {
    title: string;
    subtitle?: string;
    ctaButtonText?: string;
    ctaButtonUrl?: string;
}

const PricingHero: React.FC<PricingHeroProps> = ({
    title,
    subtitle,
    ctaButtonText = 'Get Started',
    ctaButtonUrl = 'https://console.heliosenergy.io/'
}) => {
    return (
        <section className="w-full bg-foreground text-background py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center space-y-8">
                    {/* Main Title - Large Typography */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                        <span className="text-background">{title.split(' ').slice(0, -1).join(' ')}</span>
                        <br />
                        <span className="text-primary">{title.split(' ').slice(-1)}</span>
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-xl md:text-2xl text-background/80 leading-relaxed max-w-3xl mx-auto">
                            {subtitle}
                        </p>
                    )}

                    {/* CTA Button */}
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={() => window.open(ctaButtonUrl, '_blank', 'noopener,noreferrer')}
                            className="px-12 py-6 bg-primary text-foreground font-semibold text-lg hover:bg-primary/90 transition-all duration-300"
                            size="lg"
                        >
                            {ctaButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingHero;
