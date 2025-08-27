'use client';

import React, { useState } from 'react';

// Geometric icon components for each card
const GeometricIcon = ({ type }: { type: 'sun' | 'starburst' | 'radial' }) => {
  const iconComponents = {
    sun: (
      <svg viewBox="0 0 200 200" className="w-24 h-24 text-white">
        {/* Sun rays pattern */}
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M100 30 L100 50" />
          <path d="M100 150 L100 170" />
          <path d="M30 100 L50 100" />
          <path d="M150 100 L170 100" />
          <path d="M45 45 L60 60" />
          <path d="M140 140 L155 155" />
          <path d="M155 45 L140 60" />
          <path d="M60 140 L45 155" />
          <path d="M75 35 L75 50" />
          <path d="M125 35 L125 50" />
          <path d="M75 150 L75 165" />
          <path d="M125 150 L125 165" />
        </g>
      </svg>
    ),
    starburst: (
      <svg viewBox="0 0 200 200" className="w-24 h-24 text-white">
        {/* Starburst pattern */}
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M100 20 L100 180" />
          <path d="M20 100 L180 100" />
          <path d="M35 35 L165 165" />
          <path d="M165 35 L35 165" />
          <path d="M100 40 L100 160" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M40 100 L160 100" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M50 50 L150 150" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M150 50 L50 150" strokeWidth="1" strokeDasharray="4,4" />
        </g>
      </svg>
    ),
    radial: (
      <svg viewBox="0 0 200 200" className="w-24 h-24 text-white">
        {/* Radial lines pattern */}
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M100 100 L100 30" />
          <path d="M100 100 L170 100" />
          <path d="M100 100 L100 170" />
          <path d="M100 100 L30 100" />
          <path d="M100 100 L155 45" />
          <path d="M100 100 L155 155" />
          <path d="M100 100 L45 155" />
          <path d="M100 100 L45 45" />
          <path d="M100 100 L130 40" strokeWidth="1" />
          <path d="M100 100 L160 70" strokeWidth="1" />
          <path d="M100 100 L160 130" strokeWidth="1" />
          <path d="M100 100 L130 160" strokeWidth="1" />
          <path d="M100 100 L70 160" strokeWidth="1" />
          <path d="M100 100 L40 130" strokeWidth="1" />
          <path d="M100 100 L40 70" strokeWidth="1" />
          <path d="M100 100 L70 40" strokeWidth="1" />
        </g>
      </svg>
    ),
  };

  return (
    <div className="flex justify-center items-center h-32 mb-8">
      {iconComponents[type]}
    </div>
  );
};

// Enhanced accordion item for hover state with expansion functionality
const HoverAccordionItem = ({ 
  title, 
  details, 
  isExpanded, 
  onToggle 
}: { 
  title: string; 
  details: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-t border-white/30">
      <button
        onClick={onToggle}
        className="w-full py-3 flex justify-between items-center group/item hover:bg-white/10 px-4 -mx-4 rounded transition-colors duration-200"
      >
        <span className="text-sm font-medium text-white/90 group-hover/item:text-white text-left">
          {title}
        </span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          className={`text-white/70 group-hover/item:text-white transition-all duration-300 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <path 
            d="M12 5V19M5 12H19" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {/* Expandable details */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-3 text-sm text-white/70 leading-relaxed">
            {details}
          </div>
        </div>
      </div>
    </div>
  );
};

// Define accordion item interface
type AccordionItemData = {
  title: string;
  details: string;
};

// Define props interface following our TypeScript patterns
type EnhancedFeatureCardProps = {
  title: string;
  description: string;
  iconType: 'sun' | 'starburst' | 'radial';
  accordionItems?: AccordionItemData[];
};

const EnhancedFeatureCard = ({ 
  title, 
  description, 
  iconType,
  accordionItems = [] 
}: EnhancedFeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAccordionToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div 
      className="
        relative bg-[#b8c5d1] rounded-sm p-8 
        transition-all duration-500 ease-out
        hover:scale-[1.02] cursor-pointer overflow-hidden
        h-[500px] flex flex-col
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Geometric Icon */}
      <GeometricIcon type={iconType} />
      
      {/* Content Container */}
      <div className="flex-grow flex flex-col relative">
        <h3 className="text-[28px] font-semibold text-white leading-tight mb-4">
          {title}
        </h3>
        <p className="text-[16px] text-white/80 leading-relaxed mb-6">
          {description}
        </p>
        
        {/* Arrow indicator */}
        <div className="flex justify-end mt-auto">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`text-white transition-transform duration-300 ${
                isHovered ? 'rotate-45' : ''
              }`}
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

      {/* Hover Accordion Panel - slides up from bottom */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 
          bg-[#b8c5d1]/95 backdrop-blur-sm
          border-t border-white/30
          transition-all duration-500 ease-out
          ${isHovered 
            ? 'transform translate-y-0 opacity-100' 
            : 'transform translate-y-full opacity-0'
          }
        `}
      >
        <div className="p-6 pt-4">
          <div className="space-y-1">
            {accordionItems.map((item, index) => (
              <HoverAccordionItem 
                key={index} 
                title={item.title}
                details={item.details}
                isExpanded={expandedIndex === index}
                onToggle={() => handleAccordionToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeatureCard;