// InfoPanel.jsx
import React from 'react';
import { getSourceColor } from '../../utils/colorUtils';

const InfoPanel = ({ selectedObject, onClose }) => {
  if (!selectedObject) return null;

  const renderPowerPlantInfo = (plant) => (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{plant.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium">Operator:</div>
        <div>{plant.operator}</div>
        
        <div className="font-medium">Output:</div>
        <div>{plant.outputDisplay}</div>
        
        <div className="font-medium">Source:</div>
        <div className="flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: `rgb(${getSourceColor(plant.source).join(',')})` }}
          ></span>
          {plant.source}
        </div>
        
        <div className="font-medium">Method:</div>
        <div>{plant.method}</div>
        
        <div className="font-medium">Location:</div>
        <div>{plant.latitude.toFixed(4)}, {plant.longitude.toFixed(4)}</div>
        
        {plant.wikidataId && (
          <>
            <div className="font-medium">Wikidata:</div>
            <div>
              <a 
                href={`https://www.wikidata.org/wiki/${plant.wikidataId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {plant.wikidataId}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderCableInfo = (cable) => (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{cable.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {cable.length > 0 && (
          <>
            <div className="font-medium">Length:</div>
            <div>{cable.length} km</div>
          </>
        )}
        
        {cable.capacity && (
          <>
            <div className="font-medium">Capacity:</div>
            <div>{cable.capacity}</div>
          </>
        )}
        
        {cable.owners && cable.owners.length > 0 && (
          <>
            <div className="font-medium">Owners:</div>
            <div>{cable.owners.join(', ')}</div>
          </>
        )}
        
        {cable.rfs && (
          <>
            <div className="font-medium">Ready for Service:</div>
            <div>{cable.rfs}</div>
          </>
        )}
        
        <div className="font-medium">Landing Points:</div>
        <div>
          {cable.landing_points && cable.landing_points.map((point, index) => (
            <div key={index} className="mb-1">
              {point.name} ({point.country})
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLandingPointInfo = (point) => (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{point.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium">Country:</div>
        <div>{point.country}</div>
        
        <div className="font-medium">Coordinates:</div>
        <div>{point.coordinates[1].toFixed(4)}, {point.coordinates[0].toFixed(4)}</div>
      </div>
    </div>
  );

  const renderTerrestrialInfo = (link) => (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{link.name || 'Terrestrial Link'}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="font-medium">Type:</div>
        <div>{link.type}</div>
        
        <div className="font-medium">Country:</div>
        <div>{link.country}</div>
        
        <div className="font-medium">Coordinates:</div>
        <div>
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
    <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm w-80">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Information</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoPanel;