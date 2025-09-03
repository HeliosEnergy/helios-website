'use client';

import React from 'react';
import Button from '../ui/Button';

const EnergyCTASection = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[550px] flex items-center justify-center overflow-hidden py-16">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat bg-gradient-to-br from-orange-400 via-blue-400 to-orange-600"
        >
          {/* Simple overlay pattern instead of complex wind turbines */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Simple wind turbine silhouettes */}
          <div className="absolute bottom-10 left-1/4 w-1 h-20 bg-white/60"></div>
          <div className="absolute bottom-10 left-2/4 w-1 h-16 bg-white/50"></div>
          <div className="absolute bottom-10 left-3/4 w-1 h-12 bg-white/40"></div>
          
          {/* Ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-orange-800/50"></div>
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight mb-6">
          Build Something Amazing. For Less.
        </h2>
        
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] px-8 py-4 text-lg font-medium"
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