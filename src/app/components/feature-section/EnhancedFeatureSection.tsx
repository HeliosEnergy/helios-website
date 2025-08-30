import React from 'react';
import EnhancedFeatureCard from './EnhancedFeatureCard';

// Enhanced Feature Section Component

const EnhancedFeatureSection = () => {
  return (
    <div className="w-full bg-white">
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-3 py-12 md:py-16">
      {/* Section Headings with responsive font size */}
      <div className="mb-16 flex justify-between items-start">
        <div>
          <h2 className="text-[48px] md:text-[64px] font-normal leading-tight">
            <span className="text-black">Maximum Performance.</span>
            <br />
            <span style={{color: '#b8c5d1'}}>Minimum Cost.</span>
          </h2>
        </div>
        
        {/* Performance claim text */}
        <div className="hidden lg:block max-w-xs">
          <p className="text-[16px] text-black/80 leading-relaxed">
            Up to 20 times faster and 81% less expensive than traditional cloud providers.
          </p>
        </div>
      </div>

      {/* 
        Responsive Container for Enhanced Cards
        - Mobile (default): A grid with 1 column, creating a vertical stack.
        - Tablet (md): Switches to a flexbox for horizontal scrolling. A `pb-4` is added to give space for the scrollbar.
        - Desktop (lg): Overrides flex to become a 3-column grid again.
      */}
      <div className="grid grid-cols-1 gap-8 md:flex md:overflow-x-auto lg:grid lg:grid-cols-3 scrollbar-thin-light pb-4">
        
        {/* Card Wrapper: Controls the size of the card at the tablet breakpoint */}
        <div className="md:w-[400px] md:flex-shrink-0 lg:w-auto">
          <EnhancedFeatureCard
            title="Performance Without the Price Tag"
            description="Get the power of a premium cloud for your AI workloads, without the premium cost."
            iconType="sun"
            accordionItems={[
              {
                title: "AI-optimized data centers",
                details: "Our purpose-built data centers feature cutting-edge cooling systems, high-density GPU configurations, and optimized power delivery designed specifically for AI workloads."
              },
              {
                title: "Resilient, self-healing architecture", 
                details: "Advanced monitoring systems automatically detect and resolve issues before they impact your workloads, ensuring maximum uptime and reliability for mission-critical AI applications."
              },
              {
                title: "Next-gen GPU cloud",
                details: "Access the latest NVIDIA H100s, A100s, and other cutting-edge GPUs on-demand, with seamless scaling capabilities and optimized networking for distributed training."
              }
            ]}
          />
        </div>

        <div className="md:w-[400px] md:flex-shrink-0 lg:w-auto">
          <EnhancedFeatureCard
            title="Build Faster, Spend Less"
            description="Our streamlined tools help you innovate faster, reducing development time and saving on costs."
            iconType="starburst"
            accordionItems={[
              {
                title: "Intuitive AI development tools",
                details: "Streamlined SDKs, pre-configured environments, and integrated MLOps tools that eliminate setup complexity and accelerate your development workflow."
              },
              {
                title: "Streamlined deployment pipelines",
                details: "One-click deployment with automatic scaling, load balancing, and version management. Deploy models from development to production in minutes."
              },
              {
                title: "Automated infrastructure management",
                details: "Our platform handles provisioning, monitoring, and maintenance automatically, so you can focus on building breakthrough AI applications."
              }
            ]}
          />
        </div>
        
        <div className="md:w-[400px] md:flex-shrink-0 lg:w-auto">
          <EnhancedFeatureCard
            title="Low-Cost, Scalable Compute"
            description="Scale your AI workloads on demand with access to vast, budget-friendly compute resources."
            iconType="radial"
            accordionItems={[
              {
                title: "Scalable compute clusters",
                details: "Elastic GPU clusters that scale from single nodes to thousands of GPUs, with intelligent workload distribution and optimal resource utilization."
              },
              {
                title: "Energy-efficient processing",
                details: "Powered by renewable energy sources with industry-leading PUE ratios, reducing your carbon footprint while maximizing computational efficiency."
              },
              {
                title: "On-demand resource allocation",
                details: "Instantly provision the exact compute resources you need, when you need them, with transparent pricing and no long-term commitments."
              }
            ]}
          />
        </div>

      </div>
      
      {/* Mobile performance claim */}
      <div className="lg:hidden mt-12 text-center">
        <p className="text-[16px] text-black/80 leading-relaxed">
          Up to 20 times faster and 81% less expensive than traditional cloud providers.
        </p>
      </div>
      </section>
    </div>
  );
};

export default EnhancedFeatureSection;