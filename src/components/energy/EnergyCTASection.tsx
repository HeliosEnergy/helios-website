import React from 'react';
import { Button } from '@/components/ui/button';

const EnergyCTASection = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[550px] flex items-center justify-center overflow-hidden py-16">
      {/* Background with gradient */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-gradient-to-br from-orange-600 via-blue-600 to-orange-700"
        >
          {/* Overlay pattern */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Simple wind turbine silhouettes */}
          <div className="absolute bottom-10 left-1/4 w-1 h-20 bg-white/60"></div>
          <div className="absolute bottom-10 left-2/4 w-1 h-16 bg-white/50"></div>
          <div className="absolute bottom-10 left-3/4 w-1 h-12 bg-white/40"></div>

          {/* Ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-orange-900/50"></div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight mb-6">
          Build Something Amazing. For Less.
        </h2>

        <div className="flex justify-center">
          <Button
            variant="default"
            className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
            onClick={() => window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')}
          >
            Get started today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EnergyCTASection;
