'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import CalendlyButton from '../ui/CalendlyButton';
import ParticleBackground from '../ui/ParticleBackground';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-start bg-black text-white overflow-hidden">
      {/* Three.js Particle Background with Parallax */}
      <ParticleBackground 
        enableParallax={true}
        parallaxIntensity={0.2}
        brightnessReduction={0.7}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" style={{ zIndex: 2 }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6" style={{ zIndex: 10 }}>
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