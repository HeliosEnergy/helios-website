// Legend.jsx
import React from 'react';
import { getSourceColor, getInfrastructureColor } from '../../utils/colorUtils';

const Legend = () => {
  const powerSources = [
    { type: 'nuclear', label: 'Nuclear' },
    { type: 'hydro', label: 'Hydro' },
    { type: 'gas', label: 'Gas' },
    { type: 'coal', label: 'Coal' },
    { type: 'wind', label: 'Wind' },
    { type: 'solar', label: 'Solar' },
    { type: 'other', label: 'Other' }
  ];

  const infrastructureTypes = [
    { type: 'submarine', label: 'Submarine Cables' },
    { type: 'terrestrial', label: 'Terrestrial Links' },
    { type: 'landingPoint', label: 'Landing Points' }
  ];

  // Helper function to convert RGB array to CSS color
  const rgbToCss = (rgb) => {
    if (Array.isArray(rgb)) {
      return `rgb(${rgb.join(',')})`;
    }
    return rgb;
  };

  return (
    <div className="bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm max-w-xs">
      <h3 className="text-sm font-bold mb-2 text-gray-900">Map Legend</h3>
      
      <div className="space-y-3">
        {/* Power Sources */}
        <div>
          <h4 className="font-semibold text-xs mb-1 text-gray-800">Power Plants</h4>
          <div className="space-y-1">
            {powerSources.map(source => (
              <div key={source.type} className="flex items-center group">
                <span 
                  className="w-3 h-3 rounded-full mr-2 border border-gray-700" 
                  style={{ backgroundColor: rgbToCss(getSourceColor(source.type)) }}
                ></span>
                <span className="text-xs text-gray-900">{source.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Infrastructure */}
        <div>
          <h4 className="font-semibold text-xs mb-1 text-gray-800">Infrastructure</h4>
          <div className="space-y-1">
            {infrastructureTypes.map(type => (
              <div key={type.type} className="flex items-center group">
                <span 
                  className="w-3 h-3 rounded-full mr-2 border border-gray-700" 
                  style={{ backgroundColor: rgbToCss(getInfrastructureColor(type.type)) }}
                ></span>
                <span className="text-xs text-gray-900">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Size Legend */}
        <div>
          <h4 className="font-semibold text-xs mb-1 text-gray-800">Plant Capacity</h4>
          <div className="flex items-center justify-between text-xs">
            <div className="text-center">
              <div 
                className="rounded-full mx-auto bg-blue-500 border border-gray-700"
                style={{ width: '8px', height: '8px' }}
              ></div>
              <div className="mt-1 text-gray-900">Small</div>
            </div>
            <div className="text-center">
              <div 
                className="rounded-full mx-auto bg-blue-500 border border-gray-700"
                style={{ width: '16px', height: '16px' }}
              ></div>
              <div className="mt-1 text-gray-900">Medium</div>
            </div>
            <div className="text-center">
              <div 
                className="rounded-full mx-auto bg-blue-500 border border-gray-700"
                style={{ width: '24px', height: '24px' }}
              ></div>
              <div className="mt-1 text-gray-900">Large</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;