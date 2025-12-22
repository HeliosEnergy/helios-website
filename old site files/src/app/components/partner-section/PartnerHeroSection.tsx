'use client';

import React from 'react';

const PartnerHeroSection: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            AI Data Center Parntership Program
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Work with Helios to bring small modular data centers on-site, Helios manages operations, you earn more per kWh than selling to the grid.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PartnerHeroSection;