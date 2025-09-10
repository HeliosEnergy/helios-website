// FilterPanel.jsx
import React, { useState, useEffect } from 'react';
import { getSourceColor } from '../../utils/colorUtils';

const FilterPanel = ({ filters, onFilterChange, powerPlants }) => {
  // Extract unique sources from power plants
  const [sources, setSources] = useState([]);
  
  useEffect(() => {
    const uniqueSources = [...new Set(powerPlants.map(plant => plant.source))];
    setSources(uniqueSources);
  }, [powerPlants]);

  const handleSourceToggle = (source) => {
    const currentSources = filters.powerPlants.source;
    let newSources;
    
    if (currentSources.includes(source)) {
      newSources = currentSources.filter(s => s !== source);
    } else {
      newSources = [...currentSources, source];
    }
    
    onFilterChange('powerPlants', 'source', newSources);
  };

  const handleCapacityChange = (type, value) => {
    onFilterChange('powerPlants', type, parseFloat(value) || 0);
  };

  const handleCableTypeToggle = (type) => {
    const currentTypes = filters.cables.type;
    let newTypes;
    
    if (currentTypes.includes(type)) {
      newTypes = currentTypes.filter(t => t !== type);
    } else {
      newTypes = [...currentTypes, type];
    }
    
    onFilterChange('cables', 'type', newTypes);
  };

  return (
    <div className="filter-panel">
      <h3 className="text-lg font-bold mb-3">Filters</h3>
      
      <div className="space-y-4">
        {/* Power Plant Filters */}
        <div>
          <h4 className="font-semibold mb-2">Power Plants</h4>
          
          {/* Source Filters */}
          <div className="mb-3">
            <h5 className="text-sm font-medium mb-1">By Source</h5>
            <div className="grid grid-cols-2 gap-1">
              {sources.map(source => (
                <div key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`source-${source}`}
                    checked={filters.powerPlants.source.includes(source)}
                    onChange={() => handleSourceToggle(source)}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <label 
                    htmlFor={`source-${source}`} 
                    className="text-sm flex items-center"
                  >
                    <span 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: `rgb(${getSourceColor(source).join(',')})` }}
                    ></span>
                    <span className="capitalize">{source}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Capacity Filters */}
          <div>
            <h5 className="text-sm font-medium mb-1">By Capacity (MW)</h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs block mb-1">Min</label>
                <input
                  type="number"
                  value={filters.powerPlants.minCapacity}
                  onChange={(e) => handleCapacityChange('minCapacity', e.target.value)}
                  className="w-full p-1 border rounded text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs block mb-1">Max</label>
                <input
                  type="number"
                  value={filters.powerPlants.maxCapacity}
                  onChange={(e) => handleCapacityChange('maxCapacity', e.target.value)}
                  className="w-full p-1 border rounded text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Cable Filters */}
        <div>
          <h4 className="font-semibold mb-2">Cables</h4>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="submarine-filter"
              checked={filters.cables.type.includes('submarine')}
              onChange={() => handleCableTypeToggle('submarine')}
              className="mr-2 h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="submarine-filter" className="text-sm">
              Submarine Cables
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;