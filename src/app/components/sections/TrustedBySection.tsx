import React from 'react';

// This is a simple functional component for displaying a styled logo placeholder.
// In a real-world app, you'd have an SVG component or Next.js <Image /> component.
const LogoPlaceholder = ({ name, className = '' }: { name: string; className?: string }) => {
  return (
    <div className={`text-2xl md:text-3xl font-bold text-gray-500 tracking-wider ${className}`}>
      {name}
    </div>
  );
};


const TrustedBySection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <p className="text-sm text-gray-600 mb-8 text-center md:text-left">Trusted by:</p>
        
        {/* Logo container */}
        <div className="
          flex flex-wrap justify-center md:justify-between items-center 
          gap-x-8 gap-y-8
        ">
          <LogoPlaceholder name="CURSOR" />
          <LogoPlaceholder name="together.ai" />
          <LogoPlaceholder name="Windsurf" />
          <LogoPlaceholder name="||| |" className="tracking-widest" /> {/* Simple representation of the MIT logo */}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;