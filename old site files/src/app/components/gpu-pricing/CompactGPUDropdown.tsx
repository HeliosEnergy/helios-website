'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GPUModel } from './GPUPricingData';

interface CompactGPUDropdownProps {
  gpuModels: GPUModel[];
  selectedGPU: GPUModel;
  onGPUChange: (gpu: GPUModel) => void;
}

const CompactGPUDropdown: React.FC<CompactGPUDropdownProps> = ({
  gpuModels,
  selectedGPU,
  onGPUChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGPUSelect = (gpu: GPUModel) => {
    onGPUChange(gpu);
    setIsOpen(false);
  };

  // Abbreviate GPU name for mobile
  const getCompactName = (name: string) => {
    return name.split('(')[0].trim(); // Remove memory info in parentheses
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-black mb-2">
        GPU Configuration
      </label>
      
      {/* Selected GPU Display / Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-white border border-gray-200 hover:border-gray-400 text-left transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-black"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-black">
              {getCompactName(selectedGPU.name)}
            </div>
            <div className="text-xs font-light text-gray-600">
              {selectedGPU.memory} • ${selectedGPU.pricePerHour}/hr
            </div>
          </div>
          <div className="ml-2">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-sm max-h-60 overflow-y-auto">
          <div className="py-1" role="listbox">
            {gpuModels.map((gpu) => (
              <button
                key={gpu.id}
                onClick={() => handleGPUSelect(gpu)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                  selectedGPU.id === gpu.id ? 'bg-gray-100 border-l-2 border-black' : ''
                }`}
                role="option"
                aria-selected={selectedGPU.id === gpu.id}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      selectedGPU.id === gpu.id ? 'text-black' : 'text-black'
                    }`}>
                      {getCompactName(gpu.name)}
                    </div>
                    <div className="text-xs font-light text-gray-600">
                      {gpu.memory}
                    </div>
                  </div>
                  <div className="ml-2 text-right">
                    <div className={`text-sm font-medium ${
                      selectedGPU.id === gpu.id ? 'text-black' : 'text-black'
                    }`}>
                      ${gpu.pricePerHour}
                    </div>
                    <div className="text-xs font-light text-gray-500">
                      /hr
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactGPUDropdown;