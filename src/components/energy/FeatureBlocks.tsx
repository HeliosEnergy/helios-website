import React, { useState } from 'react';

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
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex justify-start items-center gap-6 group hover:bg-white/5 px-6 -mx-6 rounded transition-colors duration-200"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-[#fbbf24] group-hover:text-[#f59e0b] transition-all duration-300 flex-shrink-0 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-medium text-white group-hover:text-white/80 text-left">
          {title}
        </span>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start py-12">
      {/* Image */}
      <div className="relative">
        <div className="aspect-[4/3] rounded-sm overflow-hidden bg-white/5 min-h-[400px]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="lg:pl-8">
        <h3 className="text-3xl md:text-4xl font-normal text-white mb-8">
          {title}
        </h3>
        <p className="text-xl text-white/70 leading-relaxed mb-8">
          {description}
        </p>

        {/* Accordion items */}
        <div className="space-y-2">
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
      title: "Site Selection That Cuts Costs",
      description: "We build our data centers where power is cheapest. This simple principle is the foundation of our pricing advantage.",
      imageSrc: "/energy/solar-panels.jpg",
      imageAlt: "Solar Panel Installation",
      accordionItems: [
        "Energy-based site screening",
        "Superior due diligence",
        "Trusted networks"
      ]
    },
    {
      title: "Diverse Energy, Singularly Low Prices",
      description: "By using a mix of the most affordable energy sources, we ensure you always get the best possible price for your compute.",
      imageSrc: "/energy/wind-turbines.jpg",
      imageAlt: "Industrial Turbine Equipment",
      accordionItems: [
        "Low-carbon energy expertise",
        "Power Peninsula™ infrastructure technology",
        "On-site deployments"
      ]
    },
    {
      title: "Optimization That Saves You Money",
      description: "Our real-time power orchestration means not a single watt—or dollar—is wasted. We match demand to the lowest-cost power available.",
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
    <section className="py-16 bg-black border-t border-white/10">
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
