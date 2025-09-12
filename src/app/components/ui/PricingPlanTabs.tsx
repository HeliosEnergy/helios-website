'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface PricingPlan {
  id: string;
  label: string;
  duration: string;
  discount: number;
  badge?: string;
}

export interface PricingPlanTabsProps {
  selectedPlan: PricingPlan;
  onPlanChange: (plan: PricingPlan) => void;
  className?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'on-demand',
    label: 'On Demand',
    duration: 'Hourly billing',
    discount: 0
  },
  {
    id: 'quarterly',
    label: '1 month',
    duration: '1-month commitment',
    discount: 5,
  },
  {
    id: 'semi-annually',
    label: '3 months',
    duration: '3-month commitment',
    discount: 10,
  },
  {
    id: 'annually',
    label: '6 months',
    duration: '6-month commitment',
    discount: 15,
  },
  {
    id: 'two-years',
    label: '12 months',
    duration: '12-month commitment',
    discount: 20,
  }
];

const PricingPlanTabs: React.FC<PricingPlanTabsProps> = ({
  selectedPlan,
  onPlanChange,
  className = ''
}) => {
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update slider position when selected plan changes
  useEffect(() => {
    const activeIndex = PRICING_PLANS.findIndex(plan => plan.id === selectedPlan.id);
    const activeTab = tabRefs.current[activeIndex];
    
    if (activeTab && containerRef.current) {
      
      
      setSliderStyle({
        width: activeTab.offsetWidth,
        transform: `translateX(${activeTab.offsetLeft}px)`,
      });
    }
  }, [selectedPlan]);

  // Initialize slider position on mount
  useEffect(() => {
    const handleResize = () => {
      const activeIndex = PRICING_PLANS.findIndex(plan => plan.id === selectedPlan.id);
      const activeTab = tabRefs.current[activeIndex];
      
      if (activeTab) {
        setSliderStyle({
          width: activeTab.offsetWidth,
          transform: `translateX(${activeTab.offsetLeft}px)`,
        });
      }
    };

    // Set initial position
    handleResize();

    // Update on window resize for responsive behavior
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedPlan]);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Tab Container */}
      <div 
        ref={containerRef}
        className="relative bg-gray-100 p-1 rounded-lg inline-flex flex-wrap sm:flex-nowrap gap-1 sm:gap-0 max-w-full"
      >
        {/* Animated slider background */}
        <div 
          className="absolute top-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-out h-[calc(100%-8px)]"
          style={sliderStyle}
        />
        
        {/* Tab buttons */}
        {PRICING_PLANS.map((plan, index) => (
          <button
            key={plan.id}
            ref={el => { tabRefs.current[index] = el; }}
            onClick={() => onPlanChange(plan)}
            className={`relative px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 rounded-md z-10 min-w-0 flex-1 sm:flex-none ${
              selectedPlan.id === plan.id 
                ? 'text-gray-900' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-pressed={selectedPlan.id === plan.id}
            aria-label={`Select ${plan.label} billing plan${plan.badge ? ` with ${plan.badge}` : ''}`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-center leading-tight whitespace-nowrap font-semibold">{plan.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Plan Duration Description */}
      <div className="text-center px-4">
        <p className="text-sm text-gray-600">
          {selectedPlan.duration}
        </p>
        
      </div>
    </div>
  );
};

export default PricingPlanTabs;