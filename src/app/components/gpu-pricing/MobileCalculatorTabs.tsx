'use client';

import React, { useState } from 'react';

interface MobileCalculatorTabsProps {
  configurationContent: React.ReactNode;
  pricingContent: React.ReactNode;
}

const MobileCalculatorTabs: React.FC<MobileCalculatorTabsProps> = ({
  configurationContent,
  pricingContent
}) => {
  const [activeTab, setActiveTab] = useState<'configure' | 'pricing'>('configure');

  return (
    <div className="block md:hidden">
      {/* Tab Navigation */}
      <div className="bg-gray-100 p-1 rounded-sm mb-4">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('configure')}
            className={`px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200 ${
              activeTab === 'configure'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Configure
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200 ${
              activeTab === 'pricing'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pricing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'configure' && (
          <div className="space-y-4">
            {configurationContent}
          </div>
        )}
        {activeTab === 'pricing' && (
          <div>
            {pricingContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCalculatorTabs;