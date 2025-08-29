'use client';

import React from 'react';
import Logo from './Logo';
import { PricingPlan } from './PricingPlanTabs';
import PricingPlanTabs from './PricingPlanTabs';

interface PricingData {
  gpu: string;
  heliosCompute: string;
  aws: string;
  googleCloud: string;
  lambda: string;
  modal: string;
}

interface PricingTableProps {
  selectedPlan?: PricingPlan;
  onPlanChange?: (plan: PricingPlan) => void;
}

const pricingData: PricingData[] = [
  {
    gpu: 'H100 NVL',
    heliosCompute: '2.47',
    aws: '5.88',
    googleCloud: 'Not listed',
    lambda: '2.49',
    modal: '3.95'
  },
  {
    gpu: 'H100 SXM',
    heliosCompute: '2.25',
    aws: '4.40',
    googleCloud: '11.06',
    lambda: '2.99',
    modal: '3.95'
  },
  {
    gpu: 'RTX Pro 6000 ',
    heliosCompute: '1.19',
    aws: 'Not listed',
    googleCloud: 'Not listed',
    lambda: 'Not listed',
    modal: 'Not listed'
  },
  {
    gpu: 'L40S',
    heliosCompute: '0.87',
    aws: '1.86-2.24',
    googleCloud: 'Not listed',
    lambda: 'Not Available',
    modal: '1.95'
  },
  {
    gpu: 'A100',
    heliosCompute: '1.35',
    aws: '3.67-4.10',
    googleCloud: '3.67',
    lambda: '1.29',
    modal: '2.50'
  }
];

const PricingTable: React.FC<PricingTableProps> = ({ selectedPlan, onPlanChange }) => {
  // Calculate discounted price helper
  const calculateDiscountedPrice = (originalPrice: string, discountPercent: number): string => {
    const price = parseFloat(originalPrice);
    if (isNaN(price)) return originalPrice;
    const discountedPrice = price * (1 - discountPercent / 100);
    return discountedPrice.toFixed(2);
  };
  
  // Get display price for Helios column
  const getHeliosPrice = (originalPrice: string): string => {
    if (!selectedPlan || selectedPlan.discount === 0) {
      return originalPrice;
    }
    return calculateDiscountedPrice(originalPrice, selectedPlan.discount);
  };
  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-6">
            GPU Pricing Comparison
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare our competitive GPU pricing against leading cloud providers. 
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <span className="font-medium">All prices shown in USD/hr</span>
          </div>
        </div>

        {/* Pricing Plan Tabs */}
        {selectedPlan && onPlanChange && (
          <div className="flex justify-center mb-12">
            <PricingPlanTabs 
              selectedPlan={selectedPlan}
              onPlanChange={onPlanChange}
            />
          </div>
        )}

        {/* Pricing Table */}
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-sm shadow-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  GPU
                </th>
                <th className="text-left py-8 px-8">
                  <div className="relative flex items-center">
                    <div className="bg-[#fbbf24] text-black px-4 py-2 rounded-full flex items-center">
                      <Logo 
                        shouldInvert={true} 
                        height={20} 
                        linkToHome={false}
                        className="opacity-90"
                      />
                    </div>
                    
                  </div>
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  AWS
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  Google Cloud
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  Lambda
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  Modal
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row, index) => (
                <tr 
                  key={row.gpu} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="py-8 px-8 font-semibold text-gray-900 text-lg">
                    {row.gpu}
                  </td>
                  <td className="py-8 px-8">
                    <div className="flex flex-col">
                      <span className="text-black font-bold text-lg">
                        ${getHeliosPrice(row.heliosCompute)}
                      </span>
                      {selectedPlan && selectedPlan.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through">
                          ${row.heliosCompute}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.aws === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.aws}</span>
                    ) : (
                      `$${row.aws}`
                    )}
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.googleCloud === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.googleCloud}</span>
                    ) : (
                      `$${row.googleCloud}`
                    )}
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.lambda === 'Not Available' || row.lambda === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.lambda}</span>
                    ) : (
                      `$${row.lambda}`
                    )}
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.modal === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.modal}</span>
                    ) : (
                      `$${row.modal}`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden space-y-6">
          {pricingData.map((row, index) => (
            <div key={row.gpu} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* GPU Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{row.gpu}</h3>
                <div className="text-sm text-gray-500">Per Hour Pricing (USD)</div>
              </div>
              
              {/* Helios Pricing - Featured */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-[#fbbf24] rounded-lg p-4 mb-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#fbbf24] text-black px-3 py-2 rounded-full flex items-center">
                      <Logo 
                        shouldInvert={true} 
                        height={24} 
                        linkToHome={false}
                        className="opacity-90"
                      />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-black">
                        ${getHeliosPrice(row.heliosCompute)}
                      </div>
                      {selectedPlan && selectedPlan.discount > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          ${row.heliosCompute}
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Other Providers */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">AWS</span>
                  <span className="text-gray-600">
                    {row.aws === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.aws}</span>
                    ) : (
                      `$${row.aws}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Google Cloud</span>
                  <span className="text-gray-600">
                    {row.googleCloud === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.googleCloud}</span>
                    ) : (
                      `$${row.googleCloud}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Lambda</span>
                  <span className="text-gray-600">
                    {row.lambda === 'Not Available' || row.lambda === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.lambda}</span>
                    ) : (
                      `$${row.lambda}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Modal</span>
                  <span className="text-gray-600">
                    {row.modal === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.modal}</span>
                    ) : (
                      `$${row.modal}`
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Prices are subject to change. {' '}
            <button 
              onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
              className="text-[#fbbf24] hover:text-black underline transition-colors duration-200 cursor-pointer"
            >
              Contact us
            </button>
            {' '} for enterprise pricing and volume discounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;