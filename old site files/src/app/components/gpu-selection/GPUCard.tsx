'use client';

import React from 'react';
import CalendlyButton from '../ui/CalendlyButton';

// GPU data interface with real specifications
type GPUData = {
  id: string;
  brand: 'NVIDIA' | 'AMD';
  model: string;
  title: string;
  memory: string;
  performance: string;
  bandwidth: string;
  power: string;
  image: string;
  isPurple?: boolean;
  isCopper?: boolean;
  specs?: string[];
};

// Props interface following our component typing standards
type GPUCardProps = {
  gpu: GPUData;
  isExpanded: boolean;
  onExpand: () => void;
};

const GPUCard = ({ gpu, isExpanded, onExpand }: GPUCardProps) => {
  // Dynamic background color based on GPU type
  const getCardBackground = () => {
    if (isExpanded) {
      if (gpu.isCopper) return 'bg-[#C4A484]';
      return 'bg-black';
    }
    if (gpu.isCopper) return 'bg-[#D4B896] hover:bg-[#C4A484]';
    return 'bg-[#b8c5d1] hover:bg-[#a8b2c1]';
  };

  return (
    <div 
      className={`
        relative rounded-sm cursor-pointer flex flex-col overflow-hidden
        transition-all duration-500 ease-out
        hover:scale-[1.01] min-w-0
        ${getCardBackground()}
        text-white
        ${isExpanded 
          ? 'h-[75vh] md:h-full md:flex-[2.5]' 
          : 'h-24 md:h-full md:flex-[1]'
        }
      `}
      onClick={onExpand}
    >
      {/* Background Image with Vignette Effect */}
      {isExpanded && (
        <div 
            className={`absolute inset-0 ${gpu.id === 'rtx-pro-6000' || gpu.id === 'a100' ? 'bg-black' : ''}`}
          >
            <div 
              className={`absolute inset-0 ${gpu.id === 'rtx-pro-6000' || gpu.id === 'a100' ? 'bg-center' : 'bg-cover bg-center'}`}
              style={{
                backgroundImage: `url(/gpus/${gpu.image})`,
                transform: gpu.id === 'rtx-pro-6000' || gpu.id === 'a100' ? 'rotate(90deg)' : 'none',
                backgroundSize: gpu.id === 'rtx-pro-6000' || gpu.id === 'a100' ? 'auto 100%' : 'cover'
              }}
            />
          </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Brand label */}
        <div className="mb-2">
          <span className={`text-xs font-medium tracking-wider ${
            isExpanded ? 'text-gray-300' : gpu.isCopper ? 'text-amber-100' : 'text-white/70'
          }`}>
            {gpu.brand}
          </span>
        </div>

        {/* GPU Title */}
        <div className={`mb-4 ${isExpanded ? 'mb-6' : ''}`}>
          <h3 className={`font-bold text-white leading-tight ${
            isExpanded ? 'text-3xl' : 'text-lg'
          }`}>
            {gpu.title}
          </h3>
          {isExpanded && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                gpu.isCopper ? 'bg-[#E6C7A6]' : 'bg-yellow-500'
              } text-black`}>
                {gpu.memory}
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                {gpu.power}
              </span>
            </div>
          )}
        </div>

        {/* Content - shows based on expansion state */}
        {isExpanded ? (
          /* Expanded Content */
          <div className="flex-1 flex flex-col justify-between">
            {/* Performance Metrics */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Performance</h4>
                <p className="text-2xl font-bold text-white">{gpu.performance}</p>
                <p className="text-sm text-gray-300 mt-1">{gpu.bandwidth} bandwidth</p>
              </div>
              
              {/* Key Specs */}
              {gpu.specs && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Key Features</h4>
                  <div className="space-y-1">
                    {gpu.specs.slice(2).map((spec, index) => (
                      <div key={index} className="text-sm text-gray-300 leading-relaxed">
                        • {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Contact sales button */}
            <div className="pt-6">
              <CalendlyButton 
                variant="primary" 
                className="text-sm px-6 py-3 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                calendlyUrl="https://calendly.com/jose-helios/30min"
              >
                Contact sales →
              </CalendlyButton>
            </div>
          </div>
        ) : (
          /* Collapsed Content - Different for Mobile vs Desktop */
          <div className="flex-1 flex flex-col justify-between">
            {/* Mobile: Simple horizontal layout */}
            <div className="md:hidden flex items-center justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-white">{gpu.title}</h3>
                <p className="text-sm text-white/70">{gpu.memory}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{gpu.power}</p>
              </div>
            </div>
            
            {/* Desktop: Vertical text with arrow (original design) */}
            <div className="hidden md:flex flex-1 flex-col justify-between">
              {/* Minimal content for collapsed state */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="transform -rotate-90 origin-center">
                    <span className="text-sm font-medium whitespace-nowrap">
                      {gpu.model}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className="flex justify-center">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white/70 transition-transform duration-300 hover:text-white"
                >
                  <path 
                    d="M7 17L17 7M17 7H7M17 7V17" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPUCard;