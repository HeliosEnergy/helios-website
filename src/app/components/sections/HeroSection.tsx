'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import CalendlyButton from '../ui/CalendlyButton';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-start bg-black text-white">
      {/* Placeholder for particle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-normal leading-tight">
          Modular AI Data Centers <br />
          built 10x faster
        </h1>
        {/* <p className="mt-6 text-xl">Build the future faster</p> */}
        <div className="mt-8 flex items-center space-x-4">
          <CalendlyButton 
            variant="secondary" 
            calendlyUrl="https://calendly.com/jose-helios/30min"
          >
            Contact sales →
          </CalendlyButton>
          <Button 
            variant="primary"
            onClick={() => window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')}
          >
            Get started →
          </Button>
        </div>
        <Image 
          src="/nvidia-inception-program-badge-rgb-for-screen.png" 
          alt="Nvidia Inception Program Badge" 
          width={128}
          height={128}
          className="absolute bottom-8 right-8 w-32 h-auto"
        />
      </div>
    </section>
  );
};

export default HeroSection;