// LayerControls.jsx
import React from 'react';

const LayerControls = ({ layers, onToggle }) => {
  const layerOptions = [
    { id: 'powerPlants', label: 'Power Plants', color: 'bg-red-500' },
    { id: 'submarineCables', label: 'Submarine Cables', color: 'bg-blue-500' },
    { id: 'terrestrialLinks', label: 'Terrestrial Links', color: 'bg-green-500' },
    { id: 'landingPoints', label: 'Landing Points', color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm max-w-xs">
      <h3 className="text-sm font-bold mb-2 text-gray-900">Layer Controls</h3>
      <div className="space-y-2">
        {layerOptions.map(layer => (
          <div 
            key={layer.id} 
            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-gray-200"
          >
            <input
              type="checkbox"
              id={layer.id}
              checked={layers[layer.id]}
              onChange={() => onToggle(layer.id)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm cursor-pointer"
            />
            <div className={`ml-2 w-3 h-3 rounded-full ${layer.color}`}></div>
            <label 
              htmlFor={layer.id} 
              className="ml-2 text-xs font-medium text-gray-700 cursor-pointer flex-grow"
            >
              {layer.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerControls;