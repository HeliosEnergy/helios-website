// InfoPanel.jsx
import React from 'react';
import { getSourceColor } from '../../utils/colorUtils';

const InfoPanel = ({ selectedObject, onClose }) => {
  if (!selectedObject) return null;

  const renderPowerPlantInfo = (plant) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900" id="info-panel-title">{plant.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Close information panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="col-span-1 font-medium text-gray-700">Operator:</div>
        <div className="col-span-2 text-gray-900">{plant.operator}</div>
        
        <div className="col-span-1 font-medium text-gray-700">Output:</div>
        <div className="col-span-2 text-gray-900">{plant.outputDisplay}</div>
        
        <div className="col-span-1 font-medium text-gray-700">Source:</div>
        <div className="col-span-2 flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2 border border-gray-700" 
            style={{ backgroundColor: `rgb(${getSourceColor(plant.source).join(',')})` }}
            aria-label={`Color indicator for ${plant.source} power source`}
          ></span>
          <span className="capitalize text-gray-900">{plant.source}</span>
        </div>
        
        <div className="col-span-1 font-medium text-gray-700">Method:</div>
        <div className="col-span-2 text-gray-900">{plant.method}</div>
        
        <div className="col-span-1 font-medium text-gray-700">Location:</div>
        <div className="col-span-2 text-gray-900">{plant.latitude.toFixed(4)}, {plant.longitude.toFixed(4)}</div>
        
        {plant.wikidataId && (
          <>
            <div className="col-span-1 font-medium text-gray-700">Wikidata:</div>
            <div className="col-span-2">
              <a 
                href={`https://www.wikidata.org/wiki/${plant.wikidataId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                {plant.wikidataId}
                <span className="sr-only">(opens in new window)</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderCableInfo = (cable) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900" id="info-panel-title">{cable.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Close information panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        {cable.length > 0 && (
          <>
            <div className="col-span-1 font-medium text-gray-700">Length:</div>
            <div className="col-span-2 text-gray-900">{cable.length} km</div>
          </>
        )}
        
        {cable.capacity && (
          <>
            <div className="col-span-1 font-medium text-gray-700">Capacity:</div>
            <div className="col-span-2 text-gray-900">{cable.capacity}</div>
          </>
        )}
        
        {cable.owners && cable.owners.length > 0 && (
          <>
            <div className="col-span-1 font-medium text-gray-700">Owners:</div>
            <div className="col-span-2 text-gray-900">{cable.owners.join(', ')}</div>
          </>
        )}
        
        {cable.rfs && (
          <>
            <div className="col-span-1 font-medium text-gray-700">Ready for Service:</div>
            <div className="col-span-2 text-gray-900">{cable.rfs}</div>
          </>
        )}
        
        <div className="col-span-1 font-medium text-gray-700">Landing Points:</div>
        <div className="col-span-2">
          {cable.landing_points && cable.landing_points.map((point, index) => (
            <div key={index} className="mb-1 text-gray-900">
              {point.name} ({point.country})
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLandingPointInfo = (point) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900" id="info-panel-title">{point.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Close information panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="col-span-1 font-medium text-gray-700">Country:</div>
        <div className="col-span-2 text-gray-900">{point.country}</div>
        
        <div className="col-span-1 font-medium text-gray-700">Coordinates:</div>
        <div className="col-span-2 text-gray-900">{point.coordinates[1].toFixed(4)}, {point.coordinates[0].toFixed(4)}</div>
      </div>
    </div>
  );

  const renderTerrestrialInfo = (link) => (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900" id="info-panel-title">{link.name || 'Terrestrial Link'}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Close information panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="col-span-1 font-medium text-gray-700">Type:</div>
        <div className="col-span-2 text-gray-900">{link.type}</div>
        
        <div className="col-span-1 font-medium text-gray-700">Country:</div>
        <div className="col-span-2 text-gray-900">{link.country}</div>
        
        <div className="col-span-1 font-medium text-gray-700">Coordinates:</div>
        <div className="col-span-2 text-gray-900">
          {link.coordinates.length} points
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedObject.type) {
      case 'powerPlant':
        return renderPowerPlantInfo(selectedObject.data);
      case 'cable':
        return renderCableInfo(selectedObject.data);
      case 'landingPoint':
        return renderLandingPointInfo(selectedObject.data);
      case 'terrestrial':
        return renderTerrestrialInfo(selectedObject.data);
      default:
        return <div>Unknown object type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-5 max-w-sm w-80 border border-gray-200" role="dialog" aria-labelledby="info-panel-title" aria-modal="true">
      <div className="max-h-96 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoPanel;