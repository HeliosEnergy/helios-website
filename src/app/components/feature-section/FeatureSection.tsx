import React from 'react';
import FeatureCard from './FeatureCard';
import AccordionItem from './AccordionItem'; // Import the new component

const FeatureSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-3 py-16 md:py-24">
      {/* Section Headings with responsive font size */}
      <div className="mb-12">
        <h2 className="text-[36px] md:text-[48px] font-normal leading-tight">
          <span className="text-black">From energy to</span>
          <br />
          <span className="text-mutedBlueGray">AI cloud computing</span>
        </h2>
      </div>

      {/* 
        Responsive Container for Cards
        - Mobile (default): A grid with 1 column, creating a vertical stack.
        - Tablet (md): Switches to a flexbox for horizontal scrolling. A `pb-4` is added to give space for the scrollbar.
        - Desktop (lg): Overrides flex to become a 3-column grid again.
      */}
      <div className="grid grid-cols-1 gap-6 md:flex md:overflow-x-auto lg:grid lg:grid-cols-3 scrollbar-thin-light pb-4">
        
        {/* Card Wrapper: Controls the size of the card at the tablet breakpoint */}
        <div className="md:w-[400px] md:flex-shrink-0 lg:w-auto">
          <FeatureCard
            title="Unparalleled performance"
            description="Scale ambitiously and fearlessly knowing your AI workloads are backed by peerless infrastructure."
          >
            {/* Replace placeholders with the real AccordionItem component */}
            <div>
              <AccordionItem title="AI-optimized data centers">
                Detailed information about our state-of-the-art, AI-optimized data centers will be displayed here. They are designed for maximum efficiency and performance.
              </AccordionItem>
              <AccordionItem title="Resilient, self-healing architecture">
                Our infrastructure is built on a resilient, self-healing architecture that ensures maximum uptime and reliability for your critical AI workloads.
              </AccordionItem>
              <AccordionItem title="Next-gen GPU cloud">
                Leverage the power of the latest generation of GPUs, available on demand, to accelerate your model training and inference tasks.
              </AccordionItem>
            </div>
          </FeatureCard>
        </div>

        <div className="md:w-[400px] md:flex-shrink-0 lg:w-auto">
          <FeatureCard
            title="Accelerated breakthroughs"
            description="Focus on innovation not infrastructure with intuitive, AI-native systems designed to keep you building."
          />
        </div>
        
        <div className="md:w-[400px] md:flex-shrink-0 lg:w-auto">
          <FeatureCard
            title="Abundant compute"
            description="Achieve your AI potential with vast compute and energy resources."
          />
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;