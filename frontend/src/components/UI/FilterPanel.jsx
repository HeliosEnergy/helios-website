// FilterPanel.jsx
import React, { useState, useEffect } from 'react';

const FilterPanel = ({ filters, onFilterChange, powerPlants }) => {
  // Get unique sources from power plants
  const uniqueSources = [...new Set(powerPlants.map(plant => plant.source))].filter(Boolean);
  
  // Local state for capacity range
  const [minCapacity, setMinCapacity] = useState(filters.powerPlants.minCapacity);
  const [maxCapacity, setMaxCapacity] = useState(filters.powerPlants.maxCapacity);
  
  // Validation states
  const [minCapacityError, setMinCapacityError] = useState('');
  const [maxCapacityError, setMaxCapacityError] = useState('');
  
  // Debounce capacity changes
  useEffect(() => {
    // Validate inputs
    let hasError = false;
    
    if (minCapacity < 0) {
      setMinCapacityError('Minimum capacity cannot be negative');
      hasError = true;
    } else if (minCapacity > maxCapacity) {
      setMinCapacityError('Minimum capacity cannot exceed maximum capacity');
      hasError = true;
    } else {
      setMinCapacityError('');
    }
    
    if (maxCapacity < 0) {
      setMaxCapacityError('Maximum capacity cannot be negative');
      hasError = true;
    } else if (maxCapacity < minCapacity) {
      setMaxCapacityError('Maximum capacity cannot be less than minimum capacity');
      hasError = true;
    } else {
      setMaxCapacityError('');
    }
    
    // Only apply filters if no errors
    if (!hasError) {
      const timer = setTimeout(() => {
        onFilterChange('powerPlants', 'minCapacity', minCapacity);
        onFilterChange('powerPlants', 'maxCapacity', maxCapacity);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [minCapacity, maxCapacity]);
  
  const handleSourceToggle = (source) => {
    const currentSources = filters.powerPlants.source;
    const newSources = currentSources.includes(source)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source];
    
    onFilterChange('powerPlants', 'source', newSources);
  };
  
  return (
    <div className="bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm w-72 max-h-80 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold">Filters</h3>
        <button
          onClick={() => {
            setMinCapacity(0);
            setMaxCapacity(10000);
            onFilterChange('powerPlants', 'source', []);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
        >
          Clear All
        </button>
      </div>
      
      {/* Capacity Filter */}
      <div className="mb-4">
        <h4 className="font-semibold text-xs mb-2 text-gray-700">Capacity Range (MW)</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="min-capacity" className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Capacity
            </label>
            <input
              id="min-capacity"
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              className={`w-full px-2 py-1 text-xs border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                minCapacityError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              min="0"
            />
            {minCapacityError && (
              <p className="mt-1 text-xs text-red-600">{minCapacityError}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="max-capacity" className="block text-xs font-medium text-gray-700 mb-1">
              Maximum Capacity
            </label>
            <input
              id="max-capacity"
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className={`w-full px-2 py-1 text-xs border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                maxCapacityError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              min="0"
            />
            {maxCapacityError && (
              <p className="mt-1 text-xs text-red-600">{maxCapacityError}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Source Filter */}
      <div>
        <h4 className="font-semibold text-xs mb-2 text-gray-700">Energy Sources</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {uniqueSources.map(source => (
            <div key={source} className="flex items-center">
              <input
                id={`source-${source}`}
                type="checkbox"
                checked={filters.powerPlants.source.includes(source)}
                onChange={() => handleSourceToggle(source)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label 
                htmlFor={`source-${source}`} 
                className="ml-2 text-xs text-gray-700 capitalize"
              >
                {source}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;