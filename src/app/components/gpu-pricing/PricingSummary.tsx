'use client';

import React from 'react';
import { GPUModel, ReservationPeriod } from './GPUPricingData';

interface PricingSummaryProps {
  selectedGPU: GPUModel;
  reservationPeriod: ReservationPeriod;
  quantity: number;
  hoursPerMonth: number;
  pricing: {
    baseCost: number;
    discountAmount: number;
    totalCost: number;
    effectiveRate: number;
  };
}

const PricingSummary: React.FC<PricingSummaryProps> = ({
  selectedGPU,
  reservationPeriod,
  quantity,
  hoursPerMonth,
  pricing
}) => {
  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-gray-50 p-6 md:p-8 rounded-sm">
        <h3 className="text-2xl font-semibold text-black mb-6">
          Monthly Infrastructure Cost
        </h3>
        
        {/* Total Cost Display - Hero Section */}
        <div className="text-center mb-8 p-6 bg-white border border-gray-100">
          <div className="text-5xl md:text-6xl font-bold text-black mb-2">
            ${pricing.totalCost.toFixed(2)}
          </div>
          <div className="text-base font-normal text-gray-500">
            Monthly Infrastructure Cost
          </div>
          {reservationPeriod.discount > 0 && (
            <div className="mt-3">
              <div className="text-sm font-normal text-gray-600">
                Commitment discount: ${pricing.discountAmount.toFixed(2)} ({reservationPeriod.discount}% reduction)
              </div>
            </div>
          )}
        </div>

        {/* Configuration Summary */}
        <div className="space-y-6 mb-8">
          <div className="pb-4 border-b border-gray-100">
            <h4 className="text-base font-medium text-black mb-4">
              Infrastructure Specification
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">GPU Model</span>
                <span className="text-sm font-medium text-black text-right">
                  {selectedGPU.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">Instance Count</span>
                <span className="text-sm font-medium text-black">
                  {quantity} unit{quantity !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">Monthly Runtime</span>
                <span className="text-sm font-medium text-black">
                  {hoursPerMonth} hours
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">Contract Term</span>
                <span className="text-sm font-medium text-black">
                  {reservationPeriod.label}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div>
            <h4 className="text-base font-medium text-black mb-4">
              Price Analysis
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-normal text-gray-600">Base rate per unit</span>
                <span className="text-sm font-medium text-black">
                  ${selectedGPU.pricePerHour}/hour
                </span>
              </div>
              
              {reservationPeriod.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-normal text-gray-600">Effective rate per unit</span>
                  <span className="text-sm font-medium text-black">
                    ${pricing.effectiveRate.toFixed(2)}/hour
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Metrics */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-100">
          <div className="text-sm text-gray-700">
            <div className="font-light">Hourly cost breakdown</div>
            <div className="mt-2 space-y-1">
              <div className="text-xs font-light text-gray-600">
                Total: ${(pricing.totalCost / hoursPerMonth).toFixed(4)}/hour
              </div>
              {quantity > 1 && (
                <div className="text-xs font-light text-gray-600">
                  Per unit: ${(pricing.totalCost / hoursPerMonth / quantity).toFixed(4)}/hour
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          className="w-full px-8 py-4 bg-black text-white text-base font-medium border border-black hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-black"
          onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
        >
          Contact Sales
        </button>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <div className="text-xs font-light text-gray-500">
            Instant provisioning • Enterprise SLA • Scalable infrastructure
          </div>
          <button 
            onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
            className="text-xs font-light text-gray-600 hover:text-black underline transition-colors mt-2"
          >
            Enterprise pricing inquiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;