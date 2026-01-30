import React, { useState } from 'react';

// Simple icon components for each advantage
const AdvantageIcon = ({ type }: { type: 'fast' | 'scale' | 'lowcost' | 'clean' }) => {
  const iconComponents = {
    fast: (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-white/60">
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          {/* Radiating lines for "fast" */}
          <path d="M40 20 L40 60" />
          <path d="M20 40 L60 40" />
          <path d="M28.5 28.5 L51.5 51.5" />
          <path d="M51.5 28.5 L28.5 51.5" />
          <path d="M30 25 L50 55" />
          <path d="M50 25 L30 55" />
          <path d="M25 30 L55 50" />
          <path d="M55 30 L25 50" />
        </g>
      </svg>
    ),
    scale: (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-white/60">
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          {/* Grid pattern for "scale" */}
          <rect x="20" y="20" width="40" height="40" />
          <path d="M25 20 L25 60" />
          <path d="M30 20 L30 60" />
          <path d="M35 20 L35 60" />
          <path d="M45 20 L45 60" />
          <path d="M50 20 L50 60" />
          <path d="M55 20 L55 60" />
          <path d="M20 25 L60 25" />
          <path d="M20 30 L60 30" />
          <path d="M20 35 L60 35" />
          <path d="M20 45 L60 45" />
          <path d="M20 50 L60 50" />
          <path d="M20 55 L60 55" />
        </g>
      </svg>
    ),
    lowcost: (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-white/60">
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          {/* Concentric circles for "low cost" */}
          <circle cx="40" cy="40" r="8" />
          <circle cx="40" cy="40" r="14" />
          <circle cx="40" cy="40" r="20" />
          <circle cx="40" cy="40" r="26" />
        </g>
      </svg>
    ),
    clean: (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-white/60">
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          {/* Leaf/clean pattern */}
          <path d="M40 20 Q25 35 40 50 Q55 35 40 20" />
          <path d="M40 25 L40 45" />
          <path d="M32 37 Q40 30 48 37" />
        </g>
      </svg>
    ),
  };

  return (
    <div className="flex justify-center items-center h-16 mb-6">
      {iconComponents[type]}
    </div>
  );
};

// Individual advantage card component
const AdvantageCard = ({
  title,
  description,
  iconType,
  isExpanded,
  onClick
}: {
  title: string;
  description: string;
  iconType: 'fast' | 'scale' | 'lowcost' | 'clean';
  isExpanded: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-black border border-white/20 rounded-lg p-6 text-left h-full flex flex-col transition-all duration-300 hover:border-white/40 hover:shadow-lg hover:shadow-white/5"
    >
      {/* Icon */}
      <AdvantageIcon type={iconType} />

      {/* Title */}
      <h3 className="text-xl font-medium text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      {isExpanded && (
        <p className="text-sm text-white/70 leading-relaxed flex-grow">
          {description}
        </p>
      )}
    </button>
  );
};

const AdvantagesCarousel = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const advantages = [
    {
      title: "Fast",
      description: "Get to market faster. Our efficient infrastructure reduces deployment time, saving you valuable engineering hours and cost.",
      iconType: "fast" as const,
    },
    {
      title: "Scale",
      description: "Scale your ambitions, not your budget. Expand your AI workloads on demand with our cost-effective infrastructure.",
      iconType: "scale" as const,
    },
    {
      title: "Low cost",
      description: "Our core advantage. By building on low-cost energy, we deliver unbeatable pricing for high-performance compute.",
      iconType: "lowcost" as const,
    },
    {
      title: "Clean",
      description: "Sustainable and affordable are no longer mutually exclusive. Our clean energy approach is the secret to our low prices.",
      iconType: "clean" as const,
    },
  ];

  return (
    <section className="py-10 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-normal text-white mb-8">
          Our advantages
        </h2>

        {/* Cards Grid - 4 equal columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {advantages.map((advantage, index) => (
            <AdvantageCard
              key={index}
              title={advantage.title}
              description={advantage.description}
              iconType={advantage.iconType}
              isExpanded={expandedCard === index}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesCarousel;
