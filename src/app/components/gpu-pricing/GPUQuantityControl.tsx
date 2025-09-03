'use client';

import React, { useState, useEffect } from 'react';

interface GPUQuantityControlProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const GPUQuantityControl: React.FC<GPUQuantityControlProps> = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 400
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  // Update input when external quantity changes
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleIncrement = () => {
    const newQuantity = Math.min(maxQuantity, quantity + 1);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(minQuantity, quantity - 1);
    onQuantityChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Validate and update quantity
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= minQuantity && numValue <= maxQuantity) {
      onQuantityChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Reset to current quantity if input is invalid
    setInputValue(quantity.toString());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, numValue));
        onQuantityChange(clampedValue);
      } else {
        setInputValue(quantity.toString());
      }
    }
  };

  return (
    <div>
      <label className="block text-base font-medium text-black mb-3">
        Instance Quantity
      </label>
      
      <div className="flex items-center justify-center space-x-6">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={quantity <= minQuantity}
          className={`w-10 h-10 border text-lg font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-black ${
            quantity <= minQuantity
              ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:border-black hover:text-black'
          }`}
          aria-label="Decrease quantity"
        >
          −
        </button>

        {/* Quantity Display and Input */}
        <div className="text-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            className="w-16 text-2xl font-medium text-black text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-black"
            aria-label="GPU quantity"
          />
          <div className="text-xs font-light text-gray-500 mt-1">
            unit{quantity !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
          className={`w-10 h-10 border text-lg font-normal transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-black ${
            quantity >= maxQuantity
              ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:border-black hover:text-black'
          }`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Validation message and limits */}
      <div className="mt-4 text-center">
        <div className="text-xs font-light text-gray-500">
          Available range: {minQuantity}-{maxQuantity} units
        </div>
        {quantity >= 10 && (
          <div className="text-xs font-light text-gray-600 mt-2">
            Enterprise volumes available - 
            <button 
              onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
              className="underline hover:text-black transition-colors"
            >
              Contact us
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPUQuantityControl;