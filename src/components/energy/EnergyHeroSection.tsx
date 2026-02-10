import React from 'react';
import { Button } from '@/components/ui/button';
import { CONSOLE_URL } from '@/lib/site';

const EnergyHeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/energy/energy.jpeg"
          alt="Renewable energy landscape with wind turbines and solar panels"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-8 md:py-16 z-10">
        <div className="flex items-center min-h-[75vh]">
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight text-white drop-shadow-2xl">
              Low-Cost Energy.<br />
              High-Powered AI.
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed drop-shadow-lg">
              Our strategy is simple: go directly to the cheapest, cleanest energy sources. This allows us to power your AI workloads for a fraction of the cost of traditional data centers.
            </p>

	            <div className="flex items-center gap-4">
	              <Button
	                variant="default"
	                className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300"
	                onClick={() => window.open(CONSOLE_URL, '_blank', 'noopener,noreferrer')}
	              >
	                Get started
	              </Button>
	            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EnergyHeroSection;
