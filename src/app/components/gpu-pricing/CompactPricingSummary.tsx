'use client';

import React from 'react';
import { GPUModel, ReservationPeriod } from './GPUPricingData';

interface CompactPricingSummaryProps {
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

const CompactPricingSummary: React.FC<CompactPricingSummaryProps> = ({
  selectedGPU,
  reservationPeriod,
  quantity,
  hoursPerMonth,
  pricing
}) => {
  // Abbreviate GPU name for mobile
  const getCompactName = (name: string) => {
    return name.split('(')[0].trim();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-sm">
      {/* Hero Price */}
      <div className="text-center mb-4 p-4 bg-white border border-gray-100">
        <div className="text-3xl font-bold text-black mb-1">
          ${pricing.totalCost.toFixed(2)}
        </div>
        <div className="text-sm font-normal text-gray-500">
          Monthly Infrastructure Cost
        </div>
        {reservationPeriod.discount > 0 && (
          <div className="mt-2">
            <div className="text-xs font-light text-gray-600">
              Discount: ${pricing.discountAmount.toFixed(2)} ({reservationPeriod.discount}% reduction)
            </div>
          </div>
        )}
      </div>

      {/* Compact Configuration Summary */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="font-normal text-gray-600">GPU:</span>
          <span className="font-medium text-black text-right">
            {getCompactName(selectedGPU.name)} × {quantity}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-normal text-gray-600">Runtime:</span>
          <span className="font-medium text-black">
            {hoursPerMonth}h • {reservationPeriod.label}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-normal text-gray-600">Rate:</span>
          <span className="font-medium text-black">
            ${reservationPeriod.discount > 0 ? pricing.effectiveRate.toFixed(2) : selectedGPU.pricePerHour}/hr
            {reservationPeriod.discount > 0 && (
              <span className="text-xs font-normal text-gray-500 ml-1">
                (was ${selectedGPU.pricePerHour})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-normal text-gray-600">
          <span className="font-medium">Hourly:</span> ${(pricing.totalCost / hoursPerMonth).toFixed(4)}
          {quantity > 1 && (
            <span className="text-gray-500">
              {' '}(${(pricing.totalCost / hoursPerMonth / quantity).toFixed(4)} per unit)
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <button 
        className="w-full px-6 py-3 bg-black text-white text-sm font-medium border border-black hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-black"
        onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
      >
        Contact Sales
      </button>

      {/* Additional Info */}
      <div className="mt-3 text-center">
        <div className="text-xs font-light text-gray-500">
          Instant provisioning • Enterprise SLA • Scalable
        </div>
        <button 
          onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
          className="text-xs font-light text-gray-600 hover:text-black underline transition-colors mt-2"
        >
          Enterprise inquiry
        </button>
      </div>
    </div>
  );
};

export default CompactPricingSummary;