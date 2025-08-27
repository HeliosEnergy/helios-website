'use client';

import React from 'react';
import Button from '../ui/Button';

const EnergyHeroSection = () => {
  return (
    <section className="relative min-h-screen bg-[#f5f5f0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight text-gray-900">
              An energy<br />
              first approach<br />
              to AI
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed">
              We target sites with clean, available power sources to place
              our AI workloads where the environment can efficiently
              scale ambitious projects.
            </p>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="primary" 
                className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] px-8 py-3"
                onClick={() => window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')}
              >
                Get started
              </Button>
            </div>
          </div>
          
          {/* Right Image Placeholder */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <path 
                      d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" 
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-sm">Isometric Energy Infrastructure</p>
                <p className="text-xs text-gray-400">Image placeholder</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation Dots */}
        <div className="flex justify-center lg:justify-start lg:pl-8 mt-12 space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default EnergyHeroSection;