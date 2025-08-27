'use client';

import React from 'react';
import CalendlyButton from '../ui/CalendlyButton';

const GPUPricingHero = () => {
  return (
    <section className="w-full bg-black text-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight">
                <span className="text-white">GPU Pricing</span>
                <br />
                <span className="text-[#fbbf24]">That Scales</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Compare our competitive GPU pricing against leading cloud providers. 
                Built for AI workloads, optimized for performance, designed for scale.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="px-8 py-4 bg-[#fbbf24] text-black font-semibold rounded-sm hover:bg-white transition-colors duration-300"
                onClick={() => window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')}
              >
                Get Started
              </button>
              <CalendlyButton 
                variant="secondary" 
                calendlyUrl="https://calendly.com/jose-helios/30min"
                className="px-8 py-4 font-semibold rounded-sm"
              >
                Contact Sales
              </CalendlyButton>
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg overflow-hidden border border-gray-700">
              {/* Grid Pattern Background */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="w-full h-full" 
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}
                />
              </div>
              
              {/* Central GPU Visualization */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full max-w-md">
                  {/* Main GPU Chip */}
                  <div className="bg-gray-700 rounded border border-gray-500 p-6">
                    {/* GPU Grid */}
                    <div className="grid grid-cols-6 grid-rows-4 gap-2 mb-4">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="bg-gray-600 rounded-sm border border-gray-500 aspect-square flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-[#fbbf24] rounded-full opacity-80" />
                        </div>
                      ))}
                    </div>
                    
                    {/* GPU Label */}
                    <div className="text-center">
                      <div className="text-[#fbbf24] text-lg font-mono font-semibold">H100 SXM</div>
                      <div className="text-gray-400 text-sm">80GB HBM3</div>
                    </div>
                  </div>
                  
                  {/* Performance Indicators */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 h-6 bg-[#fbbf24] rounded-sm"
                          style={{
                            opacity: 0.9 - (i * 0.05),
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 bg-[#fbbf24]/20 rounded-full p-3">
                <div className="text-[#fbbf24] text-sm font-mono">AI</div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-green-500/20 rounded-full p-3">
                <div className="text-green-400 text-sm font-mono">ML</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GPUPricingHero;