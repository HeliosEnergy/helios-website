'use client';

import React from 'react';
import ConcentricAnimation from './ConcentricAnimation';

const ContactSection = () => {
  const handleCTAClick = () => {
    window.location.href = "/contact";
  };

  return (
    <section className="relative py-16 bg-[#fbbf24] text-black overflow-hidden">
      {/* Concentric Animation Background */}
      <ConcentricAnimation />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-black">
              How many GPUs
              <br />
              will power your vision?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              From baremetal infrastructure to AI image generation and inference workloads.
            </p>
          </div>

          {/* Right CTA */}
          <div className="flex justify-center lg:justify-end">
            <button
              onClick={handleCTAClick}
              className="px-8 py-4 bg-black text-[#fbbf24] font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              Waitlist →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;