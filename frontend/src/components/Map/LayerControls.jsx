// LayerControls.jsx
import React from 'react';

const LayerControls = ({ layers, onToggle }) => {
  const layerOptions = [
    { id: 'powerPlants', label: 'Power Plants' },
    { id: 'submarineCables', label: 'Submarine Cables' },
    { id: 'terrestrialLinks', label: 'Terrestrial Links' },
    { id: 'landingPoints', label: 'Landing Points' }
  ];

  return (
    <div className="layer-controls">
      <h3 className="text-lg font-bold mb-2">Layer Controls</h3>
      <div className="space-y-2">
        {layerOptions.map(layer => (
          <div key={layer.id} className="flex items-center">
            <input
              type="checkbox"
              id={layer.id}
              checked={layers[layer.id]}
              onChange={() => onToggle(layer.id)}
              className="mr-2 h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor={layer.id} className="text-sm font-medium text-gray-700">
              {layer.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerControls;