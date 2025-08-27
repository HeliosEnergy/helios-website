import React from 'react';

// Simple icon components for each advantage
const AdvantageIcon = ({ type }: { type: 'fast' | 'scale' | 'lowcost' | 'clean' }) => {
  const iconComponents = {
    fast: (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-gray-600">
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
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-gray-600">
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
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-gray-600">
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
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-gray-600">
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
  iconType 
}: {
  title: string;
  description: string;
  iconType: 'fast' | 'scale' | 'lowcost' | 'clean';
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col">
      {/* Icon */}
      <AdvantageIcon type={iconType} />
      
      {/* Title */}
      <h3 className="text-xl font-medium text-gray-900 mb-4">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed flex-grow">
        {description}
      </p>
    </div>
  );
};

const AdvantagesCarousel = () => {
  const advantages = [
    {
      title: "Fast",
      description: "Deploy builds across and compute infrastructures to create and train advanced machine learning models while optimizing resource allocation.",
      iconType: "fast" as const,
    },
    {
      title: "Scale",
      description: "Create agility infrastructure capable of computing your ambitions through rapidly expanding specialized environments.",
      iconType: "scale" as const,
    },
    {
      title: "Low cost",
      description: "Optimize deployment efficiency and cost by ensuring energy efficiency and performance while maintaining competitive pricing.",
      iconType: "lowcost" as const,
    },
    {
      title: "Clean",
      description: "Helios developed our sustainable approach from energy priorities and climate-effective, reliable power solutions.",
      iconType: "clean" as const,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-12">
          Our advantages
        </h2>
        
        {/* Cards Grid - 4 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <AdvantageCard
              key={index}
              title={advantage.title}
              description={advantage.description}
              iconType={advantage.iconType}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesCarousel;