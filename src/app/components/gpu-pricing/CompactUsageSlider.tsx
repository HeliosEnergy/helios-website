'use client';

import React, { useState, useEffect } from 'react';

interface CompactUsageSliderProps {
  hours: number;
  onHoursChange: (hours: number) => void;
  minHours?: number;
  maxHours?: number;
}

const CompactUsageSlider: React.FC<CompactUsageSliderProps> = ({
  hours,
  onHoursChange,
  minHours = 1,
  maxHours = 730
}) => {
  const [inputValue, setInputValue] = useState(hours.toString());

  // Update input when external hours change
  useEffect(() => {
    setInputValue(hours.toString());
  }, [hours]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onHoursChange(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Validate and update hours
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= minHours && numValue <= maxHours) {
      onHoursChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Reset to current hours if input is invalid
    setInputValue(hours.toString());
  };

  const getUsageType = (hours: number) => {
    if (hours === 730) return '24/7';
    if (hours >= 500) return 'High';
    if (hours >= 200) return 'Medium';
    return 'Light';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">
        Runtime Hours
      </label>

      {/* Slider */}
      <div className="mb-3">
        <input
          type="range"
          min={minHours}
          max={maxHours}
          value={hours}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #000000 0%, #000000 ${(hours / maxHours) * 100}%, #e5e7eb ${(hours / maxHours) * 100}%, #e5e7eb 100%)`
          }}
        />
        {/* Slider thumb custom styling */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            cursor: pointer;
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* Hours Input and Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-16 text-lg font-medium text-black text-center bg-white border border-gray-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <span className="text-sm font-light text-gray-600">hrs</span>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-light text-gray-600">
            {getUsageType(hours)}
          </div>
          <div className="text-xs font-light text-gray-500">
            {Math.round((hours / 730) * 100)}% capacity
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactUsageSlider;