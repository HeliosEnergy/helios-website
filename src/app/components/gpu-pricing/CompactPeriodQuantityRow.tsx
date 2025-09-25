'use client';

import React from 'react';
import { ReservationPeriod } from './GPUPricingData';

interface CompactPeriodQuantityRowProps {
  periods: ReservationPeriod[];
  selectedPeriod: ReservationPeriod;
  quantity: number;
  onPeriodChange: (period: ReservationPeriod) => void;
  onQuantityChange: (quantity: number) => void;
}

const CompactPeriodQuantityRow: React.FC<CompactPeriodQuantityRowProps> = ({
  periods,
  selectedPeriod,
  quantity,
  onPeriodChange,
  onQuantityChange
}) => {
  const handleIncrement = () => {
    const newQuantity = Math.min(1296, quantity + 1);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(1, quantity - 1);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Period Selection */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Contract Term
        </label>
        <select
          value={selectedPeriod.id}
          onChange={(e) => {
            const period = periods.find(p => p.id === e.target.value);
            if (period) onPeriodChange(period);
          }}
          className="w-full p-3 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.label}
              {period.discount > 0 && ` (-${period.discount}%)`}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Control */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Quantity
        </label>
        <div className="flex items-center bg-white border border-gray-200">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className={`px-3 py-3 text-sm transition-colors duration-200 ${
              quantity <= 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:text-black hover:bg-gray-50'
            }`}
            aria-label="Decrease quantity"
          >
            −
          </button>
          
          <div className="flex-1 text-center py-3">
            <span className="text-sm font-medium text-black">
              {quantity}
            </span>
          </div>
          
          <button
            onClick={handleIncrement}
            disabled={quantity >= 1296}
            className={`px-3 py-3 text-sm transition-colors duration-200 ${
              quantity >= 1296
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:text-black hover:bg-gray-50'
            }`}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompactPeriodQuantityRow;