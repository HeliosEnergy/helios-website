import React from 'react';

const InfographicSection = () => {
  return (
    <section className="py-16 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#fbbf24]" />
            <span className="text-xs font-medium tracking-widest uppercase text-[#fbbf24]">
              Infrastructure
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-normal text-white">
            How Helios works
          </h2>
        </div>

        {/* Infographic container */}
        <div
          className="relative w-full rounded-sm overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px rgba(251,191,36,0.15), 0 0 40px rgba(251,191,36,0.05)',
          }}
        >
          <img
            src="/HELIOSInfographic.svg"
            alt="Helios infrastructure infographic — how our energy and compute stack works"
            className="w-full h-auto block"
            style={{ aspectRatio: '16/9' }}
          />
        </div>
      </div>
    </section>
  );
};

export default InfographicSection;
