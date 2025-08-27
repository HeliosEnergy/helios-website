'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Accordion item component
const AccordionItem = ({ 
  title, 
  isExpanded, 
  onToggle 
}: { 
  title: string; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex justify-between items-center group hover:bg-gray-50 px-4 -mx-4 rounded transition-colors duration-200"
      >
        <span className="text-lg font-medium text-gray-900 group-hover:text-gray-700 text-left">
          {title}
        </span>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          className={`text-gray-600 group-hover:text-gray-800 transition-all duration-300 ${
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
    </div>
  );
};

// Individual feature block component
const FeatureBlock = ({ 
  title, 
  description, 
  imageSrc,
  imageAlt, 
  accordionItems,
  expandedIndex,
  onAccordionToggle 
}: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  accordionItems: string[];
  expandedIndex: number | null;
  onAccordionToggle: (index: number) => void;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start py-16">
      {/* Image */}
      <div className="relative">
        <div className="aspect-[4/3] rounded-sm overflow-hidden bg-gray-100">
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            fill
            unoptimized
            className="object-cover"
            onError={(e) => {
              console.error('Image failed to load:', imageSrc);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageSrc);
            }}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="lg:pl-8">
        <h3 className="text-3xl md:text-4xl font-normal text-gray-900 mb-6">
          {title}
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          {description}
        </p>
        
        {/* Accordion items */}
        <div className="space-y-0">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={index}
              title={item}
              isExpanded={expandedIndex === index}
              onToggle={() => onAccordionToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureBlocks = () => {
  const [expandedAccordion, setExpandedAccordion] = useState<{
    blockIndex: number;
    itemIndex: number;
  } | null>(null);

  const handleAccordionToggle = (blockIndex: number, itemIndex: number) => {
    if (expandedAccordion?.blockIndex === blockIndex && expandedAccordion?.itemIndex === itemIndex) {
      setExpandedAccordion(null);
    } else {
      setExpandedAccordion({ blockIndex, itemIndex });
    }
  };

  const featureBlocks = [
    {
      title: "Energy-first site selection",
      description: "We target sites with clean, available power sources to place our AI workloads where the environment can efficiently scale ambitious projects.",
      imageSrc: "/energy/solar-panels.jpg",
      imageAlt: "Solar Panel Installation",
      accordionItems: [
        "Energy-based site screening",
        "Superior due diligence", 
        "Trusted networks"
      ]
    },
    {
      title: "All-of-the-above energy sourcing",
      description: "We bring together diverse energy sources to deliver cost-effective, reliable power solutions for high-performance computing workloads.",
      imageSrc: "/energy/wind-turbines.jpg",
      imageAlt: "Industrial Turbine Equipment",
      accordionItems: [
        "Low-carbon energy expertise",
        "Power Peninsula™ infrastructure technology",
        "On-site deployments"
      ]
    },
    {
      title: "Power orchestration and optimization",
      description: "We use power delivery in real-time to match the demands of your compute infrastructure with cost-effective, reliable power.",
      imageSrc: "/energy/sustainable-power.jpg",
      imageAlt: "Electrical Transmission Infrastructure", 
      accordionItems: [
        "Power engineering",
        "Live power modeling",
        "AI-centric design"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {featureBlocks.map((block, blockIndex) => (
          <FeatureBlock
            key={blockIndex}
            title={block.title}
            description={block.description}
            imageSrc={block.imageSrc}
            imageAlt={block.imageAlt}
            accordionItems={block.accordionItems}
            expandedIndex={
              expandedAccordion?.blockIndex === blockIndex 
                ? expandedAccordion.itemIndex 
                : null
            }
            onAccordionToggle={(itemIndex) => handleAccordionToggle(blockIndex, itemIndex)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureBlocks;