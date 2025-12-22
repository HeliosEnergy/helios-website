'use client';

import React, { useState, useEffect } from 'react';

interface ProfessionalUsageSliderProps {
  hours: number;
  onHoursChange: (hours: number) => void;
  minHours?: number;
  maxHours?: number;
}

const ProfessionalUsageSlider: React.FC<ProfessionalUsageSliderProps> = ({
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(minHours, Math.min(maxHours, numValue));
        onHoursChange(clampedValue);
      } else {
        setInputValue(hours.toString());
      }
    }
  };

  return (
    <div>
      <label className="block text-base font-medium text-black mb-3">
        Monthly Runtime Hours
      </label>

      {/* Professional Slider */}
      <div className="space-y-4">
        <div className="relative">
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
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #000000;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
              cursor: pointer;
            }
            .slider::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #000000;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
              cursor: pointer;
            }
          `}</style>
        </div>

        {/* Hours Display and Input */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                className="w-20 text-lg font-medium text-black text-center bg-white border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
              <span className="text-sm font-light text-gray-600">hours/month</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-light text-gray-600">
              {hours === 730 ? 'Continuous' : 
               hours >= 500 ? 'High utilization' :
               hours >= 200 ? 'Standard' : 'Development'}
            </div>
            <div className="text-xs font-light text-gray-500 mt-1">
              {Math.round((hours / 730) * 100)}% capacity
            </div>
          </div>
        </div>
      </div>

      {/* Professional Usage Insights */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-100">
        <div className="text-sm font-light text-gray-700">
          <span className="font-medium">Capacity utilization:</span> {Math.round((hours / 730) * 100)}%
          {hours === 730 && (
            <span className="ml-2 text-black font-medium">• Maximum efficiency</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalUsageSlider;