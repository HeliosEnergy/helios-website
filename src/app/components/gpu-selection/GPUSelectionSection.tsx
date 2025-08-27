'use client';

import React, { useState } from 'react';
import GPUCard from './GPUCard';

// GPU data with real specifications from Helios
const gpuData = [
  {
    id: 'h100-nvl',
    brand: 'NVIDIA' as const,
    model: 'H100 NVL',
    title: 'H100 NVL',
    memory: '94 GB',
    performance: '3,341 TFLOPS FP8',
    bandwidth: '3.9 TB/s',
    power: '350-400W',
    image: 'h100-official-product-image.jpeg',
    specs: [
      '94 GB memory',
      '3,341 TFLOPS FP8 performance',
      '3.9 TB/s bandwidth',
      'PCIe, NVLink, 7 MIGs'
    ]
  },
  {
    id: 'h100-sxm',
    brand: 'NVIDIA' as const,
    model: 'H100 SXM',
    title: 'H100 SXM',
    memory: '80 GB',
    performance: '3,958 TFLOPS FP8',
    bandwidth: '3.35 TB/s',
    power: 'Up to 700W',
    image: 'h100-sxm-product-image.jpeg',
    specs: [
      '80 GB memory',
      '3,958 TFLOPS FP8 performance',
      '3.35 TB/s bandwidth',
      'SXM, NVLink, 7 MIGs'
    ]
  },
  {
    id: 'rtx-pro-6000',
    brand: 'NVIDIA' as const,
    model: 'RTX Pro 6000',
    title: 'RTX Pro 6000 Blackwell',
    memory: '96 GB',
    performance: 'Blackwell Architecture',
    bandwidth: 'GDDR7 ECC',
    power: '600W',
    image: 'nvidia-rack-2.webp',
    isCopper: true,
    specs: [
      '96 GB GDDR7 ECC memory',
      '5th Gen Tensor Cores',
      '4th Gen Ray Tracing',
      'PCIe Gen 5.0, 4x DisplayPort 2.1'
    ]
  },
  {
    id: 'l40s',
    brand: 'NVIDIA' as const,
    model: 'L40S',
    title: 'L40S',
    memory: '48 GB',
    performance: '1,466 TFLOPS FP8',
    bandwidth: 'GDDR6',
    power: '350W',
    image: 'nvidia-rack-3.webp',
    specs: [
      '48 GB memory',
      '1,466 TFLOPS FP8',
      '212 TFLOPS Ray Tracing',
      'Universal AI/graphics'
    ]
  },
  {
    id: 'a100',
    brand: 'NVIDIA' as const,
    model: 'A100',
    title: 'A100',
    memory: '80 GB',
    performance: '624 TFLOPS FP16',
    bandwidth: '2.0 TB/s',
    power: '400W',
    image: 'nvidia-rack.jpg',
    specs: [
      '80 GB memory',
      '624 TFLOPS FP16',
      '2.0 TB/s bandwidth',
      'SXM/PCIe, NVLink, 7 MIGs'
    ]
  }
];

const GPUSelectionSection = () => {
  // State management following our accordion pattern - always one card expanded
  const [expandedIndex, setExpandedIndex] = useState<number>(0); // Default to H100 NVL expanded (never null)

  const handleCardExpand = (index: number) => {
    // Exclusive expansion pattern - only switch if clicking different card
    if (expandedIndex !== index) {
      setExpandedIndex(index);
    }
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-2 sm:px-3">
        {/* Section Headings */}
        <div className="mb-16 flex justify-between items-start">
          <div>
            <h2 className="text-[48px] md:text-[64px] font-normal leading-tight">
              <span className="text-black">Built for the demands of AI.</span>
              <br />
              <span className="text-mutedBlueGray">Ready for what&apos;s next.</span>
            </h2>
          </div>
          
          {/* Performance claim text */}
          <div className="hidden lg:block max-w-xs">
            <p className="text-[16px] text-black/80 leading-relaxed">
              We have the latest GPU offerings. Purpose-built for cutting-edge AI, engineered for performance at scale.
            </p>
          </div>
        </div>

        {/* GPU Cards Container - Vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[700px]">
          {gpuData.map((gpu, index) => (
            <GPUCard
              key={gpu.id}
              gpu={gpu}
              isExpanded={expandedIndex === index}
              onExpand={() => handleCardExpand(index)}
            />
          ))}
        </div>
        
        {/* Mobile performance claim */}
        <div className="lg:hidden mt-12 text-center">
          <p className="text-[16px] text-black/80 leading-relaxed">
            We have the latest GPU offerings. Purpose-built for cutting-edge AI, engineered for performance at scale.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GPUSelectionSection;