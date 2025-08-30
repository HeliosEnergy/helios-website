'use client';

import React, { useState, useEffect } from 'react';
import { usagePresets } from './GPUPricingData';

interface UsageSliderProps {
  hours: number;
  onHoursChange: (hours: number) => void;
  minHours?: number;
  maxHours?: number;
}

const UsageSlider: React.FC<UsageSliderProps> = ({
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

  const handlePresetClick = (presetHours: number) => {
    onHoursChange(presetHours);
  };

  const getUsageType = (hours: number) => {
    if (hours <= 200) return 'Light';
    if (hours <= 500) return 'Medium';
    return 'Heavy';
  };

  const getUsageDescription = (hours: number) => {
    if (hours <= 200) return 'Ideal for development and testing';
    if (hours <= 500) return 'Good for regular training workloads';
    return 'Perfect for 24/7 production workloads';
  };

  return (
    <div>
      <label className="block text-lg font-medium text-gray-900 mb-3">
        Hours per Month
      </label>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.entries(usagePresets).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => handlePresetClick(preset.hours)}
            className={`p-3 text-center rounded-sm transition-all duration-200 border-2 ${
              hours === preset.hours
                ? 'bg-[#fbbf24] border-[#fbbf24] text-black'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`text-sm font-semibold ${
              hours === preset.hours ? 'text-black' : 'text-gray-900'
            }`}>
              {preset.label.replace(' Usage', '')}
            </div>
            <div className={`text-xs mt-1 ${
              hours === preset.hours ? 'text-black text-opacity-80' : 'text-gray-500'
            }`}>
              {preset.hours}h
            </div>
          </button>
        ))}
      </div>

      {/* Custom Slider */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="range"
            min={minHours}
            max={maxHours}
            value={hours}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(hours / maxHours) * 100}%, #e5e7eb ${(hours / maxHours) * 100}%, #e5e7eb 100%)`
            }}
          />
          {/* Slider thumb custom styling */}
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #fbbf24;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              cursor: pointer;
            }
            .slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #fbbf24;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              cursor: pointer;
            }
          `}</style>
        </div>

        {/* Hours Display and Input */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-20 text-2xl font-bold text-black text-center bg-gray-50 border border-gray-200 rounded-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-opacity-50"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">hours/month</div>
              <div className="text-xs text-[#fbbf24] font-medium">{getUsageType(hours)} Usage</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {getUsageDescription(hours)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Typical: 730 hours/month (24/7) • Max: 8,760 hours/year
            </div>
          </div>
        </div>
      </div>

      {/* Usage insights */}
      {hours === 730 && (
        <div className="mt-3 p-3 bg-green-50 rounded-sm">
          <div className="text-sm text-green-700 font-medium">
            ⚡ Maximum monthly usage - perfect for production workloads
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageSlider;