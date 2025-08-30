
'use client';

import React from 'react';
import Image from 'next/image';

const TrustedBySection = () => {
  return (
    <section className="relative bg-white py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Helios is an NVIDIA Preferred Partner
        </h2>
        <div className="flex justify-center">
          <Image 
            src="/nvidia-inception-program-badge-rgb-for-screen.png" 
            alt="Nvidia Inception Program Badge" 
            width={192}
            height={192}
            className="w-48 h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
