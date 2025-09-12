# All Modified Components

This document contains the complete code for all components that were modified to improve the UI of the DeckGL map application.

## Table of Contents
1. [DeckGLMap.jsx](#deckglmapjsx)
2. [LayerControls.jsx](#layercontrolsjsx)
3. [Legend.jsx](#legendjsx)
4. [StatsDashboard.jsx](#statsdashboardjsx)
5. [FilterPanel.jsx](#filterpaneljsx)

---

## DeckGLMap.jsx

```javascript
// DeckGLMap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import { MapView, MapController } from '@deck.gl/core';
import mapboxgl from 'mapbox-gl';
import PowerPlantProcessor from '../DataProcessing/PowerPlantProcessor';
import CableProcessor from '../DataProcessing/CableProcessor';
import TerrestrialProcessor from '../DataProcessing/TerrestrialProcessor';
import { loadCSVData, loadGeoJSONData } from '../../utils/dataUtils';
import { getSourceColor, getInfrastructureColor } from '../../utils/colorUtils';
import LayerControls from './LayerControls';
import InfoPanel from './InfoPanel';
import Legend from '../UI/Legend';
import FilterPanel from '../UI/FilterPanel';
import StatsDashboard from '../UI/StatsDashboard';
import { testCables, testTerrestrialLinks } from '../DataProcessing/testData';

// Mapbox access token (replace with your own)
// Use environment variable or fallback to default
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidGVzdCIsImEiOiJjbHJ0d2Z5d3kxcm55MmpxdnB6dHJ0d3d4In0.5gVMV3E8z6QfL8VH6uEQ6A';

const DeckGLMap = () => {
  // State for map data
  const [powerPlants, setPowerPlants] = useState([]);
  const [cables, setCables] = useState([]);
  const [landingPoints, setLandingPoints] = useState([]);
  const [terrestrialLinks, setTerrestrialLinks] = useState([]);
  
  // State for UI controls
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 55,
    zoom: 3,
    pitch: 0,
    bearing: 0
  });
  
  // State for layer visibility
  const [layerVisibility, setLayerVisibility] = useState({
    powerPlants: true,
    submarineCables: true,
    terrestrialLinks: true,
    landingPoints: true
  });
  
  // State for selected object
  const [selectedObject, setSelectedObject] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    powerPlants: {
      source: [],
      minCapacity: 0,
      maxCapacity: 10000
    },
    cables: {
      type: []
    }
  });
  
  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load power plant data
        const csvData = await loadCSVData('/data/canada_power_plants_2025-09-10T06-37-39-198Z.csv');
        const processedPlants = PowerPlantProcessor.processCSV(csvData);
        setPowerPlants(processedPlants);
        
        // Fetch submarine cable data from ITU WFS service
        try {
          // Use Vite proxy for development
          const isDevelopment = import.meta.env.MODE === 'dev';
          const baseUrl = isDevelopment 
            ? '/itu-proxy/geoserver/itu-geocatalogue/ows'
            : 'https://bbmaps.itu.int/geoserver/itu-geocatalogue/ows';
          
          const params = new URLSearchParams({
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typeName: 'itu-geocatalogue:trx_geocatalogue',
            outputFormat: 'application/json'
          });
          
          const url = `${baseUrl}?${params}`;
          
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch submarine cable data: ${response.status} ${response.statusText}`);
          }
          
          const cableData = await response.json();
          const processedCables = CableProcessor.processSubmarineCables(cableData);
          setCables(processedCables.cables);
          setLandingPoints(processedCables.landingPoints);
        } catch (cableError) {
          console.warn('Failed to fetch submarine cable data, using test data:', cableError);
          // Use test data as fallback
          const processedCables = CableProcessor.processSubmarineCables(testCables);
          setCables(processedCables.cables);
          setLandingPoints(processedCables.landingPoints);
        }
        
        // Process terrestrial links
        const processedTerrestrial = TerrestrialProcessor.filterCanadianLinks(testTerrestrialLinks.features);
        setTerrestrialLinks(processedTerrestrial);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(`Failed to load map data: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter power plants based on filters
  const filteredPowerPlants = useMemo(() => {
    return powerPlants.filter(plant => {
      // Capacity filter
      if (plant.output < filters.powerPlants.minCapacity || 
          plant.output > filters.powerPlants.maxCapacity) {
        return false;
      }
      
      // Source filter
      if (filters.powerPlants.source.length > 0 && 
          !filters.powerPlants.source.includes(plant.source)) {
        return false;
      }
      
      return true;
    });
  }, [powerPlants, filters]);

  // Filter cables based on filters
  const filteredCables = useMemo(() => {
    return cables.filter(cable => {
      // Type filter
      if (filters.cables.type.length > 0 && 
          !filters.cables.type.includes('submarine')) {
        return false;
      }
      
      return true;
    });
  }, [cables, filters]);

  // Create power plant layer
  const powerPlantLayer = useMemo(() => {
    if (!layerVisibility.powerPlants) return null;
    
    return new ScatterplotLayer({
      id: 'power-plants',
      data: filteredPowerPlants,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 8,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.coordinates,
      getRadius: d => Math.sqrt(d.output) * 2, // Scale by capacity
      getFillColor: d => getSourceColor(d.source), // Fixed color mapping
      getLineColor: [0, 0, 0, 200],
      onHover: info => {
        if (info.object) {
          setSelectedObject({
            type: 'powerPlant',
            data: info.object
          });
        } else {
          setSelectedObject(null);
        }
      },
      onClick: info => {
        if (info.object) {
          setSelectedObject({
            type: 'powerPlant',
            data: info.object
          });
        }
      }
    });
  }, [filteredPowerPlants, layerVisibility.powerPlants]);

  // Create submarine cable layer
  const submarineCableLayer = useMemo(() => {
    if (!layerVisibility.submarineCables) return null;
    
    return new PathLayer({
      id: 'submarine-cables',
      data: filteredCables,
      pickable: true,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: d => d.coordinates,
      getColor: d => [...getInfrastructureColor('submarine'), 200],
      getWidth: 3,
      onHover: info => {
        if (info.object) {
          setSelectedObject({
            type: 'cable',
            data: info.object
          });
        } else {
          setSelectedObject(null);
        }
      },
      onClick: info => {
        if (info.object) {
          setSelectedObject({
            type: 'cable',
            data: info.object
          });
        }
      }
    });
  }, [filteredCables, layerVisibility.submarineCables]);

  // Create landing points layer
  const landingPointsLayer = useMemo(() => {
    if (!layerVisibility.landingPoints) return null;
    
    // Flatten landing points from cables
    const allLandingPoints = [];
    filteredCables.forEach(cable => {
      if (cable.landing_points) {
        allLandingPoints.push(...cable.landing_points);
      }
    });
    
    return new ScatterplotLayer({
      id: 'landing-points',
      data: allLandingPoints,
      pickable: true,
      opacity: 0.9,
      radiusMinPixels: 4,
      radiusMaxPixels: 12,
      getPosition: d => d.coordinates,
      getRadius: 8,
      getFillColor: d => [...getInfrastructureColor('landingPoint'), 200],
      getLineColor: [0, 0, 0, 200],
      onHover: info => {
        if (info.object) {
          setSelectedObject({
            type: 'landingPoint',
            data: info.object
          });
        } else {
          setSelectedObject(null);
        }
      },
      onClick: info => {
        if (info.object) {
          setSelectedObject({
            type: 'landingPoint',
            data: info.object
          });
        }
      }
    });
  }, [filteredCables, layerVisibility.landingPoints]);

  // Create terrestrial links layer
  const terrestrialLayer = useMemo(() => {
    if (!layerVisibility.terrestrialLinks) return null;
    
    return new PathLayer({
      id: 'terrestrial-links',
      data: terrestrialLinks,
      pickable: true,
      widthScale: 10,
      widthMinPixels: 1,
      getPath: d => d.coordinates,
      getColor: d => [...getInfrastructureColor('terrestrial'), 200],
      getWidth: 2,
      onHover: info => {
        if (info.object) {
          setSelectedObject({
            type: 'terrestrial',
            data: info.object
          });
        } else {
          setSelectedObject(null);
        }
      },
      onClick: info => {
        if (info.object) {
          setSelectedObject({
            type: 'terrestrial',
            data: info.object
          });
        }
      }
    });
  }, [terrestrialLinks, layerVisibility.terrestrialLinks]);

  // Collect all layers
  const layers = [
    powerPlantLayer,
    submarineCableLayer,
    landingPointsLayer,
    terrestrialLayer
  ].filter(Boolean);

  // Handle view state changes
  const handleViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  // Handle layer visibility toggle
  const handleLayerToggle = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  // Handle filter changes
  const handleFilterChange = (filterType, filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [filterKey]: value
      }
    }));
  };

  // Handle preset view changes
  const handleViewChange = (viewName) => {
    const viewStates = {
      northAmerica: {
        longitude: -100,
        latitude: 55,
        zoom: 3,
        pitch: 0,
        bearing: 0
      },
      canada: {
        longitude: -106,
        latitude: 56,
        zoom: 4.5,
        pitch: 0,
        bearing: 0
      },
      easternCanada: {
        longitude: -75,
        latitude: 50,
        zoom: 6,
        pitch: 0,
        bearing: 0
      }
    };
    
    if (viewStates[viewName]) {
      setViewState(viewStates[viewName]);
    }
  };

  // Reset view to default
  const handleResetView = () => {
    setViewState({
      longitude: -100,
      latitude: 55,
      zoom: 3,
      pitch: 0,
      bearing: 0
    });
  };

  // Zoom in
  const handleZoomIn = () => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 20)
    }));
  };

  // Zoom out
  const handleZoomOut = () => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Map Data</h2>
          <p className="text-gray-600 mb-6">Please wait while we fetch and process infrastructure data...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Error</h2>
          <p className="text-gray-600 mb-6">We encountered an issue while loading the map data:</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              Retry Loading
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-gray-100">
      <DeckGL
        initialViewState={viewState}
        controller={true}
        onViewStateChange={handleViewStateChange}
        layers={layers}
        views={new MapView({ id: 'main' })}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v10"
      />
      
      {/* Layer Controls */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
        <LayerControls
          layers={layerVisibility}
          onToggle={handleLayerToggle}
        />
      </div>
      
      {/* Filter Panel */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg w-80 backdrop-blur-sm">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          powerPlants={powerPlants}
        />
      </div>
      
      {/* Stats Dashboard - now positioned better */}
      <div className="absolute top-4 left-44 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg w-80 backdrop-blur-sm">
        <StatsDashboard
          powerPlants={powerPlants}
          cables={cables}
          terrestrialLinks={terrestrialLinks}
        />
      </div>
      
      {/* Legend - moved to right side */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
        <Legend />
      </div>
      
      {/* Info Panel */}
      {selectedObject && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <InfoPanel
            selectedObject={selectedObject}
            onClose={() => setSelectedObject(null)}
          />
        </div>
      )}
      
      {/* Improved Map Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 p-2 rounded-lg shadow-lg backdrop-blur-sm flex space-x-2">
        {/* Zoom Controls */}
        <div className="flex space-x-1">
          <button 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button 
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
        
        {/* Divider */}
        <div className="border-r border-gray-300 mx-1"></div>
        
        {/* View Presets */}
        <div className="flex space-x-1">
          <button 
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center text-sm"
            onClick={() => handleViewChange('northAmerica')}
          >
            NA
          </button>
          <button 
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center text-sm"
            onClick={() => handleViewChange('canada')}
          >
            CA
          </button>
          <button 
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center text-sm"
            onClick={() => handleViewChange('easternCanada')}
          >
            ECA
          </button>
        </div>
        
        {/* Divider */}
        <div className="border-r border-gray-300 mx-1"></div>
        
        {/* Reset View */}
        <button 
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 flex items-center text-sm"
          onClick={handleResetView}
          aria-label="Reset view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Map Controls Help */}
      <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded-lg">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Drag to pan • Scroll to zoom • Click objects for info</span>
        </div>
      </div>
    </div>
  );
};

export default DeckGLMap;
```

---

## LayerControls.jsx

```javascript
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
    <div className="layer-controls">
      <h3 className="text-lg font-bold mb-4 text-gray-900">Layer Controls</h3>
      <div className="space-y-3">
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
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm cursor-pointer"
            />
            <div className={`ml-3 w-3 h-3 rounded-full ${layer.color}`}></div>
            <label 
              htmlFor={layer.id} 
              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer flex-grow"
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
```

---

## Legend.jsx

```javascript
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
    <div className="legend">
      <h3 className="text-lg font-bold mb-3 text-gray-900">Map Legend</h3>
      
      <div className="space-y-4">
        {/* Power Sources */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-800">Power Plants</h4>
          <div className="space-y-2">
            {powerSources.map(source => (
              <div key={source.type} className="flex items-center group">
                <span 
                  className="w-4 h-4 rounded-full mr-3 border border-gray-700" 
                  style={{ backgroundColor: rgbToCss(getSourceColor(source.type)) }}
                ></span>
                <span className="text-sm text-gray-900">{source.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Infrastructure */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-800">Infrastructure</h4>
          <div className="space-y-2">
            {infrastructureTypes.map(type => (
              <div key={type.type} className="flex items-center group">
                <span 
                  className="w-4 h-4 rounded-full mr-3 border border-gray-700" 
                  style={{ backgroundColor: rgbToCss(getInfrastructureColor(type.type)) }}
                ></span>
                <span className="text-sm text-gray-900">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Size Legend */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-800">Plant Capacity</h4>
          <div className="flex items-center justify-between text-xs">
            <div className="text-center">
              <div 
                className="rounded-full mx-auto bg-blue-500 border border-gray-700"
                style={{ width: '10px', height: '10px' }}
              ></div>
              <div className="mt-1 text-gray-900">Small</div>
            </div>
            <div className="text-center">
              <div 
                className="rounded-full mx-auto bg-blue-500 border border-gray-700"
                style={{ width: '20px', height: '20px' }}
              ></div>
              <div className="mt-1 text-gray-900">Medium</div>
            </div>
            <div className="text-center">
              <div 
                className="rounded-full mx-auto bg-blue-500 border border-gray-700"
                style={{ width: '30px', height: '30px' }}
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
```

---

## StatsDashboard.jsx

```javascript
// StatsDashboard.jsx
import React, { useState } from 'react';
import { calculatePowerPlantStats } from '../../utils/dataUtils';
import { getSourceColor } from '../../utils/colorUtils';

const StatsDashboard = ({ powerPlants, cables, terrestrialLinks }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const stats = calculatePowerPlantStats(powerPlants);
  
  // Calculate cable statistics
  const cableStats = {
    totalCables: cables.length,
    totalLength: cables.reduce((sum, cable) => sum + (cable.length || 0), 0),
    withCapacity: cables.filter(cable => cable.capacity).length
  };
  
  // Calculate terrestrial link statistics
  const terrestrialStats = {
    totalLinks: terrestrialLinks.length,
    byType: {}
  };
  
  terrestrialLinks.forEach(link => {
    const type = link.type || 'unknown';
    if (!terrestrialStats.byType[type]) {
      terrestrialStats.byType[type] = 0;
    }
    terrestrialStats.byType[type]++;
  });

  if (isCollapsed) {
    return (
      <div className="bg-white bg-opacity-90 p-2 rounded-lg shadow-lg backdrop-blur-sm">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Expand statistics panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="stats-dashboard bg-white bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Infrastructure Statistics</h3>
          <button 
            onClick={() => setIsCollapsed(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Collapse statistics panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Power Plant Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-300">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-900 ml-2">Power Plants</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Plants:</span>
                <span className="font-medium text-gray-900">{stats.plantCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Capacity:</span>
                <span className="font-medium text-gray-900">{Math.round(stats.totalCapacity).toLocaleString()} MW</span>
              </div>
            </div>
            
            {/* Source Breakdown */}
            <div className="mt-3 pt-3 border-t border-blue-300">
              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">By Source</h5>
              <div className="mt-2 space-y-2">
                {Object.entries(stats.sourceBreakdown).map(([source, data]) => (
                  <div key={source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2 border border-gray-700" 
                        style={{ backgroundColor: `rgb(${getSourceColor(source).join(',')})` }}
                      ></span>
                      <span className="capitalize text-gray-900">{source}</span>
                    </div>
                    <div className="text-gray-900">
                      <span className="font-medium">{data.count.toLocaleString()}</span> plants
                      <span className="ml-2">({Math.round(data.capacity).toLocaleString()} MW)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cable Stats */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-300">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-900 ml-2">Submarine Cables</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Cables:</span>
                <span className="font-medium text-gray-900">{cableStats.totalCables.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Length:</span>
                <span className="font-medium text-gray-900">{Math.round(cableStats.totalLength).toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">With Capacity Data:</span>
                <span className="font-medium text-gray-900">{cableStats.withCapacity.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Terrestrial Link Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-300">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-purple-900 ml-2">Terrestrial Links</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Links:</span>
                <span className="font-medium text-gray-900">{terrestrialStats.totalLinks.toLocaleString()}</span>
              </div>
              
              {Object.keys(terrestrialStats.byType).length > 0 && (
                <div className="pt-2 border-t border-purple-300">
                  <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">By Type</h5>
                  <div className="mt-2 space-y-2">
                    {Object.entries(terrestrialStats.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-xs">
                        <span className="capitalize text-gray-900">{type || 'Unknown'}:</span>
                        <span className="font-medium text-gray-900">{count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
```

---

## FilterPanel.jsx

```javascript
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
    <div className="filter-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Filters</h3>
        <button
          onClick={() => {
            setMinCapacity(0);
            setMaxCapacity(10000);
            onFilterChange('powerPlants', 'source', []);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
        >
          Clear All
        </button>
      </div>
      
      {/* Capacity Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3 text-gray-700">Capacity Range (MW)</h4>
        <div className="space-y-4">
          <div>
            <label htmlFor="min-capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Capacity
            </label>
            <input
              id="min-capacity"
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                minCapacityError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              min="0"
            />
            {minCapacityError && (
              <p className="mt-1 text-sm text-red-600">{minCapacityError}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="max-capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Capacity
            </label>
            <input
              id="max-capacity"
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                maxCapacityError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              min="0"
            />
            {maxCapacityError && (
              <p className="mt-1 text-sm text-red-600">{maxCapacityError}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Source Filter */}
      <div>
        <h4 className="font-semibold text-sm mb-3 text-gray-700">Energy Sources</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
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
                className="ml-3 text-sm text-gray-700 capitalize"
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
```