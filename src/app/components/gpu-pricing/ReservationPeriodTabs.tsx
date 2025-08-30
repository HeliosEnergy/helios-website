'use client';

import React from 'react';
import { ReservationPeriod } from './GPUPricingData';

interface ReservationPeriodTabsProps {
  periods: ReservationPeriod[];
  selectedPeriod: ReservationPeriod;
  onPeriodChange: (period: ReservationPeriod) => void;
}

const ReservationPeriodTabs: React.FC<ReservationPeriodTabsProps> = ({
  periods,
  selectedPeriod,
  onPeriodChange
}) => {
  return (
    <div>
      <label className="block text-base font-medium text-black mb-4">
        Contract Commitment
      </label>
      
      {/* Tab buttons - responsive grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => onPeriodChange(period)}
            className={`relative p-4 text-center border transition-all duration-200 ${
              selectedPeriod.id === period.id
                ? 'bg-black border-black text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
            aria-pressed={selectedPeriod.id === period.id}
          >
            {/* Discount badge */}
            {period.discount > 0 && (
              <div className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-medium ${
                selectedPeriod.id === period.id
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
              }`}>
                -{period.discount}%
              </div>
            )}
            
            <div className="space-y-1">
              <div className={`text-sm font-medium ${
                selectedPeriod.id === period.id ? 'text-white' : 'text-black'
              }`}>
                {period.label}
              </div>
              <div className={`text-xs font-light ${
                selectedPeriod.id === period.id ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {period.duration}
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default ReservationPeriodTabs;