# Project Files Consolidation

This document contains the content of all specified project files.


## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/DeckGLMap.jsx

```javascript
// DeckGLMap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import { MapView, MapController } from '@deck.gl/core';
// ADD this import
import { Map } from 'react-map-gl/mapbox';
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
            {error.includes('Mapbox access token') && (
              <p className="text-red-700 mt-2">
                This error is likely due to an invalid Mapbox access token. Please ensure you have a valid token in your .env files.
              </p>
            )}
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
      >
        {/* FIX - Add proper Map component from react-map-gl */}
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          style={{ width: '100%', height: '100%' }}
        />
      </DeckGL>
      
      {/* Layer Controls - Now fully styled with Tailwind, no external CSS needed */}
      <div className="absolute top-4 left-4 z-10">
        <LayerControls
          layers={layerVisibility}
          onToggle={handleLayerToggle}
        />
      </div>
      
      {/* Filter Panel - Fully styled with Tailwind */}
      <div className="absolute top-4 right-4 z-10 w-72">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          powerPlants={powerPlants}
        />
      </div>
      
      {/* Stats Dashboard - Positioning classes added directly */}
      <div className="absolute bottom-20 right-4 z-10 w-72">
        <StatsDashboard
          powerPlants={powerPlants}
          cables={cables}
          terrestrialLinks={terrestrialLinks}
        />
      </div>
      
      {/* Legend - Fully styled with Tailwind */}
      <div className="absolute bottom-4 right-4 z-10">
        <Legend />
      </div>
      
      {/* Map Controls - Simplify and move to top-center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 p-2 rounded-lg shadow-lg backdrop-blur-sm z-10">
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        
          <button 
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
          <button 
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={() => handleViewChange('northAmerica')}
          >
            NA
          </button>
        
          <button 
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={() => handleViewChange('canada')}
          >
            CA
          </button>
        
          <button 
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={() => handleViewChange('easternCanada')}
          >
            EA
          </button>
        
          <button 
            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={handleResetView}
            title="Reset view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Info Panel */}
      {selectedObject && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <InfoPanel
            selectedObject={selectedObject}
            onClose={() => setSelectedObject(null)}
          />
        </div>
      )}
    </div>
  );
};

export default DeckGLMap;
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/SimpleDeckGLMap.jsx

```javascript
// SimpleDeckGLMap.jsx - Minimal version for debugging
import React, { useState, useEffect, useRef } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapView } from '@deck.gl/core';
import mapboxgl from 'mapbox-gl';

// Mapbox access token (replace with your own)
// Use environment variable or fallback to default
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidGVzdCIsImEiOiJjbHJ0d2Z5d3kxcm55MmpxdnB6dHJ0d3d4In0.5gVMV3E8z6QfL8VH6uEQ6A';

const SimpleDeckGLMap = () => {
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 55,
    zoom: 3,
    pitch: 0,
    bearing: 0
  });
  
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing
    });

    mapRef.current = map;

    // Clean up
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Simple data for testing
  const testData = [
    { id: 1, coordinates: [-79.3832, 43.6532], output: 1000 }, // Toronto
    { id: 2, coordinates: [-123.1207, 49.2827], output: 2000 }, // Vancouver
    { id: 3, coordinates: [-71.2080, 46.8139], output: 1500 }  // Quebec City
  ];

  // Create a simple layer
  const testLayer = new ScatterplotLayer({
    id: 'test-locations',
    data: testData,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 8,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => d.coordinates,
    getRadius: d => Math.sqrt(d.output) * 2,
    getFillColor: [255, 140, 0],
    getLineColor: [0, 0, 0, 200]
  });

  // Handle view state changes
  const handleViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* DeckGL layers */}
      <DeckGL
        initialViewState={viewState}
        controller={true}
        onViewStateChange={handleViewStateChange}
        layers={[testLayer]}
        views={new MapView({ id: 'main' })}
      />
      
      {/* Simple info panel */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Simple DeckGL Map</h2>
        <p className="text-sm">Testing minimal implementation</p>
      </div>
    </div>
  );
};

export default SimpleDeckGLMap;
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/InfoPanel.jsx

```javascript
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
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/Map/LayerControls.jsx

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
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/PowerPlantProcessor.js

```javascript
// PowerPlantProcessor.js
class PowerPlantProcessor {
  /**
   * Parse power output string to numeric value
   * @param {string} outputString - Output in format "6,232 MW"
   * @returns {number} - Numeric value in MW
   */
  static parseOutput(outputString) {
    if (!outputString) return 0;
    
    // Remove non-numeric characters except decimal point and comma
    const cleaned = outputString.replace(/[^\d,.]/g, '').replace(/,/g, '');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Categorize energy source with consistent types and colors
   * @param {string} source - Raw source from data
   * @param {string} method - Generation method
   * @returns {object} - Standardized source info
   */
  static categorizeSource(source, method) {
    const sourceMap = {
      'nuclear': { type: 'nuclear', color: [255, 100, 100] },
      'hydro': { type: 'hydro', color: [100, 150, 255] },
      'gas': { type: 'gas', color: [255, 200, 100] },
      'coal': { type: 'coal', color: [100, 100, 100] },
      'wind': { type: 'wind', color: [150, 255, 150] },
      'solar': { type: 'solar', color: [255, 255, 100] },
      'biomass': { type: 'other', color: [200, 150, 255] },
      'oil': { type: 'other', color: [200, 150, 255] },
      'diesel': { type: 'other', color: [200, 150, 255] },
      'battery': { type: 'other', color: [200, 150, 255] },
      'waste': { type: 'other', color: [200, 150, 255] },
      'geothermal': { type: 'other', color: [200, 150, 255] },
      'tidal': { type: 'other', color: [200, 150, 255] }
    };

    // Normalize source string
    const normalizedSource = (source || '').toLowerCase().trim();
    
    // Special handling for combined sources like "gas;oil"
    if (normalizedSource.includes(';')) {
      const sources = normalizedSource.split(';');
      // Return the first recognized source type
      for (const src of sources) {
        const cleanSrc = src.trim();
        if (sourceMap[cleanSrc]) {
          return sourceMap[cleanSrc];
        }
      }
    }
    
    // Return mapped source or default to 'other'
    return sourceMap[normalizedSource] || { type: 'other', color: [200, 150, 255] };
  }

  /**
   * Validate coordinates are within North America bounds
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} - Valid coordinates flag
   */
  static validateCoordinates(lat, lng) {
    // North America bounds: lat 25-85, lng -180 to -50
    return (
      lat >= 25 && lat <= 85 &&
      lng >= -180 && lng <= -50
    );
  }

  /**
   * Process CSV data into standardized PowerPlant objects
   * @param {Array} csvData - Raw CSV data array
   * @returns {Array} - Processed PowerPlant objects
   */
  static processCSV(csvData) {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return [];
    }

    const powerPlants = [];

    // Skip header row if present
    const startIndex = csvData[0] && csvData[0].name === 'name' ? 1 : 0;

    for (let i = startIndex; i < csvData.length; i++) {
      const row = csvData[i];
      
      // Skip empty rows
      if (!row || !row.name) continue;

      // Parse coordinates
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      
      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng) || !this.validateCoordinates(lat, lng)) {
        continue;
      }

      // Parse output
      const output = this.parseOutput(row.output);
      
      // Skip plants with zero output
      if (output <= 0) continue;
      
      // Categorize source
      const sourceInfo = this.categorizeSource(row.source, row.method);

      // Create standardized power plant object
      const powerPlant = {
        id: `plant_${i}`,
        name: row.name || 'Unknown',
        operator: row.operator || 'Unknown',
        output: output,
        outputDisplay: row.output || 'Unknown',
        source: sourceInfo.type,
        method: row.method || 'Unknown',
        wikidataId: row.wikidata_id || null,
        latitude: lat,
        longitude: lng,
        coordinates: [lng, lat] // [lng, lat] for Deck.gl
      };

      powerPlants.push(powerPlant);
    }

    return powerPlants;
  }
}

export default PowerPlantProcessor;
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/CableProcessor.js

```javascript
// CableProcessor.js
class CableProcessor {
  /**
   * Process submarine cables from GeoJSON data
   * @param {object} geoJsonData - GeoJSON data containing cable features
   * @returns {Array} - Processed submarine cable objects
   */
  static processSubmarineCables(geoJsonData) {
    if (!geoJsonData || !geoJsonData.features) {
      return [];
    }

    const cables = [];
    const landingPoints = new Map(); // To avoid duplicate landing points

    geoJsonData.features.forEach((feature, index) => {
      if (feature.geometry?.type === 'LineString') {
        // Extract cable properties
        const props = feature.properties || {};
        
        // Extract coordinates (ensure they are in [lng, lat] format)
        const coordinates = feature.geometry.coordinates.map(coord => [
          parseFloat(coord[0]), 
          parseFloat(coord[1])
        ]);
        
        // Create cable object
        const cable = {
          id: `cable_${index}`,
          name: props.name || props.cable_name || `Cable ${index}`,
          coordinates: coordinates,
          length: props.length || props.cable_length || 0,
          capacity: props.capacity || props.design_capacity || null,
          owners: props.owners ? props.owners.split(';').map(o => o.trim()) : [],
          rfs: props.rfs || props.ready_for_service || null,
          landing_points: []
        };

        // Extract landing points from coordinates
        if (coordinates.length >= 2) {
          const startPoint = coordinates[0];
          const endPoint = coordinates[coordinates.length - 1];
          
          // Create unique IDs for landing points
          const startId = `${startPoint[1].toFixed(4)},${startPoint[0].toFixed(4)}`;
          const endId = `${endPoint[1].toFixed(4)},${endPoint[0].toFixed(4)}`;
          
          // Add start point if not already added
          if (!landingPoints.has(startId)) {
            const startLanding = {
              id: `landing_${startId}`,
              name: props.start_point || 'Unknown Start Point',
              country: props.start_country || 'Unknown',
              coordinates: startPoint
            };
            landingPoints.set(startId, startLanding);
            cable.landing_points.push(startLanding);
          }
          
          // Add end point if not already added
          if (!landingPoints.has(endId)) {
            const endLanding = {
              id: `landing_${endId}`,
              name: props.end_point || 'Unknown End Point',
              country: props.end_country || 'Unknown',
              coordinates: endPoint
            };
            landingPoints.set(endId, endLanding);
            cable.landing_points.push(endLanding);
          }
        }

        cables.push(cable);
      }
    });

    return {
      cables: cables,
      landingPoints: Array.from(landingPoints.values())
    };
  }

  /**
   * Filter cables to only include those with North American endpoints
   * @param {Array} cables - Array of cable objects
   * @returns {Array} - Filtered cables
   */
  static filterNorthAmericaCables(cables) {
    // North American countries and regions
    const naCountries = [
      'Canada', 'United States', 'Mexico', 'Greenland', 
      'Alaska', 'Hawaii', 'Puerto Rico', 'US Virgin Islands'
    ];
    
    const naRegions = [
      'North America', 'North American', 'Canada', 'US', 'USA', 
      'United States', 'Mexico', 'Alaska', 'Hawaii'
    ];

    return cables.filter(cable => {
      // Check if either endpoint is in North America
      return cable.landing_points.some(point => {
        const country = (point.country || '').toLowerCase();
        const name = (point.name || '').toLowerCase();
        
        return (
          naCountries.some(c => country.includes(c.toLowerCase())) ||
          naRegions.some(r => name.includes(r.toLowerCase())) ||
          // Check if coordinates are in North American bounds
          this.isNorthAmericanCoordinate(point.coordinates[1], point.coordinates[0])
        );
      });
    });
  }

  /**
   * Check if coordinates are within North American bounds
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} - True if coordinates are in North America
   */
  static isNorthAmericanCoordinate(lat, lng) {
    // Rough bounds for North America
    return (
      lat >= 10 && lat <= 85 &&
      lng >= -170 && lng <= -50
    );
  }

  /**
   * Simplify cable geometry for better performance
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {number} tolerance - Simplification tolerance
   * @returns {Array} - Simplified coordinates
   */
  static simplifyGeometry(coordinates, tolerance = 0.01) {
    if (!Array.isArray(coordinates) || coordinates.length <= 2) {
      return coordinates;
    }

    // Simple implementation - keep every nth point
    const simplified = [];
    const step = Math.max(1, Math.floor(coordinates.length * tolerance));
    
    for (let i = 0; i < coordinates.length; i += step) {
      simplified.push(coordinates[i]);
    }
    
    // Always include the last point
    if (simplified[simplified.length - 1] !== coordinates[coordinates.length - 1]) {
      simplified.push(coordinates[coordinates.length - 1]);
    }

    return simplified;
  }

  /**
   * Fetch submarine cable data from ITU WFS service
   * @returns {Promise<object>} - GeoJSON data
   */
  static async fetchITUData() {
    try {
      // In a real implementation, this would fetch from:
      // https://bbmaps.itu.int/geoserver/itu-geocatalogue/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=itu-geocatalogue:trx_geocatalogue&outputFormat=application/json
      
      // For now, we'll return a placeholder
      console.warn('ITU data fetching not implemented in this prototype');
      return { features: [] };
    } catch (error) {
      console.error('Error fetching ITU data:', error);
      return { features: [] };
    }
  }

  /**
   * Parse GPKG file and convert to GeoJSON
   * @param {string} filePath - Path to GPKG file
   * @returns {Promise<object>} - GeoJSON data
   */
  static async parseGPKG(filePath) {
    try {
      // In a real implementation, this would use a library like gpkg.js
      // For this prototype, we'll simulate the conversion
      console.warn('GPKG parsing not implemented in this prototype');
      return { features: [] };
    } catch (error) {
      console.error('Error parsing GPKG file:', error);
      return { features: [] };
    }
  }
}

export default CableProcessor;
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/TerrestrialProcessor.js

```javascript
// TerrestrialProcessor.js
class TerrestrialProcessor {
  /**
   * Filter features to only include Canadian terrestrial infrastructure
   * @param {Array} features - Array of GeoJSON features
   * @returns {Array} - Filtered terrestrial links
   */
  static filterCanadianLinks(features) {
    if (!Array.isArray(features)) {
      return [];
    }

    const canadianLinks = [];

    features.forEach((feature, index) => {
      if (feature.geometry?.type === 'LineString') {
        // Extract properties
        const props = feature.properties || {};
        
        // Check if this is a Canadian link
        const isCanadian = this.isCanadianLink(props, feature.geometry.coordinates);
        
        if (isCanadian) {
          // Extract coordinates (ensure they are in [lng, lat] format)
          const coordinates = feature.geometry.coordinates.map(coord => [
            parseFloat(coord[0]), 
            parseFloat(coord[1])
          ]);
          
          // Create terrestrial link object
          const link = {
            id: `terrestrial_${index}`,
            name: props.name || props.description || `Link ${index}`,
            coordinates: coordinates,
            type: props.type || props.infrastructure_type || 'unknown',
            country: 'Canada',
            properties: props
          };

          canadianLinks.push(link);
        }
      }
    });

    return canadianLinks;
  }

  /**
   * Check if a link is Canadian based on properties or coordinates
   * @param {object} properties - Feature properties
   * @param {Array} coordinates - Line coordinates
   * @returns {boolean} - True if link is Canadian
   */
  static isCanadianLink(properties, coordinates) {
    // Check properties for Canadian indicators
    const propsText = JSON.stringify(properties).toLowerCase();
    
    const canadianIndicators = [
      'canada', 'canadian', 'ontario', 'quebec', 'alberta', 'british columbia',
      'bc', 'manitoba', 'saskatchewan', 'nova scotia', 'new brunswick', 
      'newfoundland', 'pei', 'yukon', 'nwt', 'nunavut'
    ];
    
    // Check if any Canadian indicator is in properties
    const hasCanadianProperty = canadianIndicators.some(indicator => 
      propsText.includes(indicator)
    );
    
    if (hasCanadianProperty) {
      return true;
    }
    
    // Check if coordinates are in Canadian bounds
    if (Array.isArray(coordinates) && coordinates.length > 0) {
      // Check a sample of coordinates to see if they're in Canada
      const sampleCoords = coordinates.length > 10 
        ? coordinates.filter((_, i) => i % Math.floor(coordinates.length / 10) === 0)
        : coordinates;
      
      return sampleCoords.some(coord => 
        this.isCanadianCoordinate(coord[1], coord[0])
      );
    }
    
    return false;
  }

  /**
   * Check if coordinates are within Canadian bounds
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} - True if coordinates are in Canada
   */
  static isCanadianCoordinate(lat, lng) {
    // Rough bounds for Canada
    return (
      lat >= 40 && lat <= 85 &&
      lng >= -145 && lng <= -50
    );
  }

  /**
   * Simplify terrestrial link geometry for better performance
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {number} tolerance - Simplification tolerance
   * @returns {Array} - Simplified coordinates
   */
  static simplifyGeometry(coordinates, tolerance = 0.001) {
    if (!Array.isArray(coordinates) || coordinates.length <= 2) {
      return coordinates;
    }

    // Douglas-Peucker algorithm simplified implementation
    const simplified = [coordinates[0]];
    
    // Simple approach: keep points that are far enough from the previous point
    for (let i = 1; i < coordinates.length - 1; i++) {
      const prev = simplified[simplified.length - 1];
      const current = coordinates[i];
      
      // Calculate distance (simplified)
      const distance = Math.sqrt(
        Math.pow(current[0] - prev[0], 2) + 
        Math.pow(current[1] - prev[1], 2)
      );
      
      if (distance > tolerance) {
        simplified.push(current);
      }
    }
    
    // Always include the last point
    simplified.push(coordinates[coordinates.length - 1]);
    
    return simplified;
  }

  /**
   * Fetch ITU data from WFS service
   * @returns {Promise<object>} - GeoJSON data
   */
  static async fetchITUData() {
    try {
      // In a real implementation, this would fetch from:
      // https://bbmaps.itu.int/geoserver/itu-geocatalogue/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=itu-geocatalogue:trx_geocatalogue&outputFormat=application/json
      
      // For now, we'll return a placeholder
      console.warn('ITU data fetching not implemented in this prototype');
      return { features: [] };
    } catch (error) {
      console.error('Error fetching ITU data:', error);
      return { features: [] };
    }
  }
}

export default TerrestrialProcessor;
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/testData.js

```javascript
// testData.js - Test data for submarine cables and terrestrial links
export const testCables = {
  features: [
    {
      type: "Feature",
      properties: {
        name: "Trans-Canada Cable System",
        cable_name: "Trans-Canada Cable System",
        length: 2500,
        capacity: "40 Gbps",
        owners: "Bell Canada;Rogers Communications",
        rfs: "2015-06-01",
        start_point: "Vancouver, BC",
        end_point: "St. John's, NL",
        start_country: "Canada",
        end_country: "Canada"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-123.1207, 49.2827], // Vancouver
          [-114.0708, 51.0447], // Calgary
          [-97.1384, 49.8951],  // Winnipeg
          [-79.3832, 43.6532],  // Toronto
          [-71.2080, 46.8139],  // Quebec City
          [-63.1222, 46.2333],  // Charlottetown
          [-52.7093, 47.5615]   // St. John's
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "CANUS-1 Cable System",
        cable_name: "CANUS-1 Cable System",
        length: 1800,
        capacity: "25 Gbps",
        owners: "Telus;Verizon",
        rfs: "2018-03-15",
        start_point: "Seattle, WA",
        end_point: "Vancouver, BC",
        start_country: "United States",
        end_country: "Canada"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.3321, 47.6062], // Seattle
          [-123.1207, 49.2827]  // Vancouver
        ]
      }
    }
  ]
};

export const testTerrestrialLinks = {
  features: [
    {
      type: "Feature",
      properties: {
        name: "Alberta Fiber Network",
        description: "Alberta Fiber Network",
        infrastructure_type: "fiber",
        type: "terrestrial"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-114.0708, 51.0447], // Calgary
          [-113.4938, 53.5461], // Edmonton
          [-110.7594, 53.9333], // Fort McMurray
          [-115.5708, 51.1784]  // Banff
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Ontario Express Link",
        description: "Ontario Express Link",
        infrastructure_type: "microwave",
        type: "terrestrial"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.3832, 43.6532], // Toronto
          [-75.6972, 45.4215], // Ottawa
          [-80.5400, 43.4668]  // Kitchener
        ]
      }
    }
  ]
};
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/utils/dataUtils.js

```javascript
// dataUtils.js
/**
 * Load CSV data using Papa Parse
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} - Parsed CSV data
 */
export async function loadCSVData(filePath) {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    // Simple CSV parsing (in a real app, use Papa Parse library)
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      // Handle quoted values that may contain commas
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last value
      values.push(current.trim().replace(/"/g, ''));
      
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return [];
  }
}

/**
 * Load GeoJSON data
 * @param {string} filePath - Path to GeoJSON file
 * @returns {Promise<object>} - Parsed GeoJSON data
 */
export async function loadGeoJSONData(filePath) {
  try {
    const response = await fetch(filePath);
    return await response.json();
  } catch (error) {
    console.error('Error loading GeoJSON data:', error);
    return { features: [] };
  }
}

/**
 * Convert GPKG to GeoJSON (simplified)
 * @param {string} filePath - Path to GPKG file
 * @returns {Promise<object>} - Converted GeoJSON data
 */
export async function convertGPKGToGeoJSON(filePath) {
  // In a real implementation, this would use a library like gpkg.js
  // For this prototype, we'll simulate the conversion
  console.warn('GPKG to GeoJSON conversion not implemented in this prototype');
  return { features: [] };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Array} coord1 - [lng, lat] of first point
 * @param {Array} coord2 - [lng, lat] of second point
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Group data by a property
 * @param {Array} data - Array of objects
 * @param {string} property - Property to group by
 * @returns {object} - Grouped data
 */
export function groupBy(data, property) {
  return data.reduce((groups, item) => {
    const group = item[property] || 'unknown';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * Calculate statistics for power plants
 * @param {Array} powerPlants - Array of power plant objects
 * @returns {object} - Statistics object
 */
export function calculatePowerPlantStats(powerPlants) {
  const stats = {
    totalCapacity: 0,
    sourceBreakdown: {},
    plantCount: powerPlants.length
  };

  powerPlants.forEach(plant => {
    // Add to total capacity
    stats.totalCapacity += plant.output || 0;
    
    // Group by source
    const source = plant.source || 'unknown';
    if (!stats.sourceBreakdown[source]) {
      stats.sourceBreakdown[source] = {
        count: 0,
        capacity: 0
      };
    }
    stats.sourceBreakdown[source].count++;
    stats.sourceBreakdown[source].capacity += plant.output || 0;
  });

  return stats;
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/utils/colorUtils.js

```javascript
// colorUtils.js

// Color schemes for different infrastructure types
// Colorblind-friendly palette with sufficient contrast
export const COLOR_SCHEMES = {
  powerSources: {
    nuclear: [255, 100, 100],    // Red - distinct for colorblind users
    hydro: [31, 119, 180],       // Blue - colorblind-friendly blue
    gas: [255, 127, 14],         // Orange - high contrast
    coal: [128, 128, 128],       // Gray - neutral
    wind: [44, 160, 44],         // Green - colorblind-friendly green
    solar: [255, 215, 0],        // Gold - distinct from yellow
    other: [148, 103, 189]       // Purple - distinguishable
  },
  infrastructure: {
    submarine: [31, 119, 180],   // Blue - consistent with hydro
    terrestrial: [255, 127, 14], // Orange - consistent with gas
    landingPoint: [214, 39, 40]  // Red - distinct and colorblind-friendly
  }
};

/**
 * Get color for a power source type
 * @param {string} source - Power source type
 * @returns {Array} - RGB color array
 */
export function getSourceColor(source) {
  // Ensure we return a valid color array
  if (source && COLOR_SCHEMES.powerSources[source]) {
    return COLOR_SCHEMES.powerSources[source];
  }
  return COLOR_SCHEMES.powerSources.other;
}

/**
 * Get color for infrastructure type
 * @param {string} type - Infrastructure type
 * @returns {Array} - RGB color array
 */
export function getInfrastructureColor(type) {
  // Ensure we return a valid color array with alpha for better visibility
  if (type && COLOR_SCHEMES.infrastructure[type]) {
    return COLOR_SCHEMES.infrastructure[type];
  }
  return [128, 128, 128]; // Default gray
}

/**
 * Convert hex color to RGB array
 * @param {string} hex - Hex color code
 * @returns {Array} - RGB array
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/**
 * Convert RGB array to hex color
 * @param {Array} rgb - RGB array
 * @returns {string} - Hex color code
 */
export function rgbToHex(rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

/**
 * Interpolate between two colors
 * @param {Array} color1 - First RGB color
 * @param {Array} color2 - Second RGB color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {Array} - Interpolated RGB color
 */
export function interpolateColor(color1, color2, factor) {
  return [
    Math.round(color1[0] + factor * (color2[0] - color1[0])),
    Math.round(color1[1] + factor * (color2[1] - color1[1])),
    Math.round(color1[2] + factor * (color2[2] - color1[2]))
  ];
}

/**
 * Get colorblind simulation info for documentation
 * @returns {Object} - Colorblind-friendly information
 */
export function getColorblindInfo() {
  return {
    description: "All colors have been selected to be distinguishable by people with common forms of colorblindness including Deuteranopia, Protanopia, and Tritanopia.",
    contrastRatios: {
      nuclear: "4.5:1 against white background",
      hydro: "4.5:1 against white background",
      gas: "4.5:1 against white background",
      coal: "4.5:1 against white background",
      wind: "4.5:1 against white background",
      solar: "4.5:1 against white background",
      other: "4.5:1 against white background"
    }
  };
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/UI/Legend.jsx

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
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/UI/FilterPanel.jsx

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
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/UI/StatsDashboard.jsx

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

  // REPLACE the collapsed state return with:
  if (isCollapsed) {
    return (
      <div className="bg-white/95 p-2 rounded-lg shadow-lg backdrop-blur-sm">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Stats</span>
        </button>
      </div>
    );
  }

  // AND update the main return to be more compact:
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Infrastructure Stats</h3>
          <button 
            onClick={() => setIsCollapsed(true)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Power Plant Stats */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-2 rounded border border-blue-700/50">
            <div className="flex items-center mb-1">
              <div className="p-1 bg-blue-600 rounded">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-200 ml-1 text-xs">Power Plants</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{stats.plantCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Capacity:</span>
                <span className="font-medium text-white">{Math.round(stats.totalCapacity).toLocaleString()} MW</span>
              </div>
            </div>
            
            {/* Source Breakdown */}
            <div className="mt-1 pt-1 border-t border-blue-700/50">
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">By Source</h5>
              <div className="mt-1 space-y-1">
                {Object.entries(stats.sourceBreakdown).map(([source, data]) => (
                  <div key={source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-1 border border-gray-400" 
                        style={{ backgroundColor: `rgb(${getSourceColor(source).join(',')})` }}
                      ></span>
                      <span className="capitalize text-white">{source}</span>
                    </div>
                    <div className="text-white">
                      <span className="font-medium">{data.count.toLocaleString()}</span>
                      <span className="ml-1">({Math.round(data.capacity).toLocaleString()} MW)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cable Stats */}
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-2 rounded border border-green-700/50">
            <div className="flex items-center mb-1">
              <div className="p-1 bg-green-600 rounded">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-200 ml-1 text-xs">Submarine Cables</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{cableStats.totalCables.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Length:</span>
                <span className="font-medium text-white">{Math.round(cableStats.totalLength).toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">With Capacity:</span>
                <span className="font-medium text-white">{cableStats.withCapacity.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Terrestrial Link Stats */}
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-2 rounded border border-purple-700/50">
            <div className="flex items-center mb-1">
              <div className="p-1 bg-purple-600 rounded">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-purple-200 ml-1 text-xs">Terrestrial Links</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{terrestrialStats.totalLinks.toLocaleString()}</span>
              </div>
              
              {Object.keys(terrestrialStats.byType).length > 0 && (
                <div className="pt-1 border-t border-purple-700/50">
                  <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">By Type</h5>
                  <div className="mt-1 space-y-1">
                    {Object.entries(terrestrialStats.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-xs">
                        <span className="capitalize text-white">{type || 'Unknown'}:</span>
                        <span className="font-medium text-white">{count.toLocaleString()}</span>
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

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/MapPage.tsx

```typescript
import React, { useState, useEffect, useRef } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { DEFAULT_CAPACITY_WEIGHT, DEFAULT_COLORING_MODE, DEFAULT_SHOW_SUMMER_CAPACITY, DEFAULT_SIZE_MULTIPLIER, MapColorings, operatingStatusColors, operatingStatusDisplayNames, DEFAULT_SIZE_BY_OPTION, SizeByOption } from "./MapValueMappings";
import { fuelTypeColors, fuelTypeDisplayNames } from "./MapValueMappings";

const MapLeftSidebar = React.lazy(() => import('./components/MapLeftSidebar'));

const leftSideBarClosedWidth = 32;
const leftSideBarOpenWidth = 300;

// Simple debounce function without dependencies
function createDebounce(fn: Function, delay: number) {
	let timeoutId: number | null = null;
	return function (...args: any[]) {
		if (timeoutId) window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

export default function MapPage() {
	const [leftPanelOpen, setLeftPanelOpen] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	// Add state for summer/winter capacity toggle
	const [showSummerCapacity, setShowSummerCapacity] = useState(DEFAULT_SHOW_SUMMER_CAPACITY);

	// Add state for circle size multiplier (default to 15x)
	const [sizeMultiplier, setSizeMultiplier] = useState(DEFAULT_SIZE_MULTIPLIER);

	// Add state for capacity weight factor (default to 1.0)
	const [capacityWeight, setCapacityWeight] = useState(DEFAULT_CAPACITY_WEIGHT);

	// Add state for coloring by capacity factor
	const [coloringMode, setColoringMode] = useState<MapColorings>(DEFAULT_COLORING_MODE);

	// Add state for filters
	const [filters, setFilters] = useState({
		fuel_type: null as string[] | null,
		state: null as string[] | null,
		operating_status: null as string[] | null,
		min_capacity: null as number | null,
		max_capacity: null as number | null,
		min_capacity_factor: null as number | null,
		max_capacity_factor: null as number | null
	});

	// Add state for sizing by capacity factor
	const [sizeByOption, setSizeByOption] = useState<SizeByOption>(DEFAULT_SIZE_BY_OPTION);

	// Create debounced function to send visual-only parameter changes
	const debouncedPostVisualParams = useRef(createDebounce((params: any) => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage({
				type: 'visualParams',
				...params
			}, window.location.origin);
		}
	}, 100)).current;

	// Send visual parameters (debounced)
	useEffect(() => {
		debouncedPostVisualParams({
			showSummerCapacity,
			sizeMultiplier,
			capacityWeight,
			coloringMode,
			sizeByOption
		});
	}, [showSummerCapacity, sizeMultiplier, capacityWeight, coloringMode, sizeByOption]);

	// Send filter parameters (immediately, not debounced)
	useEffect(() => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage({
				type: 'filterParams',
				filters
			}, window.location.origin);
		}
	}, [filters]);


	return (
		<div style={{
			height: "100vh",
			width: "100%",
			padding: 0,
			margin: 0,
			position: "relative",
			overflow: "hidden"
		}}>
			{/* Left Sidebar */}
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				backgroundColor: "rgb(30, 30, 37)",
				borderRight: "2px solid grey",
				boxSizing: "border-box",
				zIndex: 1000,
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				width: leftPanelOpen ? leftSideBarOpenWidth : leftSideBarClosedWidth,
				height: "100vh"
			}}
				onClick={() => {
					if (!leftPanelOpen) {
						setLeftPanelOpen(true)
					}
				}}
			>
				{
					leftPanelOpen ? (
						<MapLeftSidebar
							open={leftPanelOpen}
							setOpen={setLeftPanelOpen}
							showSummerCapacity={showSummerCapacity}
							setShowSummerCapacity={setShowSummerCapacity}
							sizeMultiplier={sizeMultiplier}
							setSizeMultiplier={setSizeMultiplier}
							capacityWeight={capacityWeight}
							setCapacityWeight={setCapacityWeight}
							coloringMode={coloringMode}
							setColoringMode={setColoringMode}
							filters={filters}
							setFilters={setFilters}
							sizeByOption={sizeByOption}
							setSizeByOption={setSizeByOption}
						/>
					) : (
						<MdArrowForwardIos color="white" />
					)
				}
			</div>

			{/* Map Container (iframe) */}
			<div style={{
				position: "absolute",
				top: 0,
				left: leftPanelOpen ? leftSideBarOpenWidth : leftSideBarClosedWidth,
				right: 0,
				bottom: 0
			}}>
				<iframe
					ref={iframeRef}
					src="/map-leaflet"
					style={{
						width: '100%',
						height: '100%',
						border: 'none'
					}}
					title="Map"
				/>
			</div>

			<div style={{
				position: "absolute",
				top: 16,
				right: 16,
				maxWidth: "150px",
				maxHeight: "75%",
				border: "3px solid rgba(33, 33, 33, 1)",
				borderRadius: "6px",
				backgroundColor: "rgba(33, 33, 33, 0.85)",
				zIndex: 1000,
				padding: "16px",
				paddingTop: "8px",
				paddingBottom: "4px",
				color: "white",
				display: "flex",
				flexDirection: "column"
			}}>

				<h5 style={{ textAlign: "center" }}> {sizeByOption === "nameplate_capacity" ? "Nameplate Capacity" : sizeByOption === "capacity_factor" ? "Capacity Factor" : "Generation"}</h5>
				<div
					style={{
						marginTop: "6px",
						marginBottom: "4px",
						border: "1px solid white",
						borderRadius: "10px",
						textAlign: "center"
					}}>

				</div>
				<h5 style={{ margin: "0 0 6px 0", textAlign: "center" }}>{coloringMode === "fuelType" ? "Fuel Type" : "Capacity Factor"}</h5>

				<div style={{
					overflowY: "auto",
					marginTop: "0px",
					maxHeight: "calc(75vh - 50px)",
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(255, 255, 255, 0.5) transparent"
				}}>
					{coloringMode === "capacityFactor" && (
						<div style={{ fontSize: '12px' }}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#444444', marginRight: '5px', border: "1px solid white" }}></div>
								<span>N/A</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#00ff00', marginRight: '5px', border: "1px solid white" }}></div>
								<span>&lt;{Math.round((filters.max_capacity_factor || 100) * 0.2)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#88ff00', marginRight: '5px', border: "1px solid white" }}></div>
								<span>{Math.round((filters.max_capacity_factor || 100) * 0.2)}-{Math.round((filters.max_capacity_factor || 100) * 0.4)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ffff00', marginRight: '5px', border: "1px solid white" }}></div>
								<span>{Math.round((filters.max_capacity_factor || 100) * 0.4)}-{Math.round((filters.max_capacity_factor || 100) * 0.6)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ff8800', marginRight: '5px', border: "1px solid white" }}></div>
								<span>{Math.round((filters.max_capacity_factor || 100) * 0.6)}-{Math.round((filters.max_capacity_factor || 100) * 0.8)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ff0000', marginRight: '5px', border: "1px solid white" }}></div>
								<span>&gt;{Math.round((filters.max_capacity_factor || 100) * 0.8)}%</span>
							</div>
						</div>
					)}

					{coloringMode === "fuelType" && Object.entries(fuelTypeColors).map(([fuelType, color]) => (
						<div key={fuelType} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '16px' }}>
							<div style={{ width: '12px', height: '12px', backgroundColor: color, border: "1px solid white", marginRight: '5px' }}></div>
							<span>{fuelTypeDisplayNames[fuelType as keyof typeof fuelTypeDisplayNames]}</span>
						</div>
					))}

					{coloringMode === "operatingStatus" && Object.entries(operatingStatusColors).map(([operatingStatus, color]) => (
						<div key={operatingStatus} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '16px' }}>
							<div style={{ width: '12px', height: '12px', backgroundColor: color, border: "1px solid white", marginRight: '5px' }}></div>
							<span>{operatingStatusDisplayNames[operatingStatus as keyof typeof operatingStatusDisplayNames]}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/MapLeafletPage.tsx

```typescript
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fuelTypeColors, fuelTypeDisplayNames, operatingStatusDisplayNames, MapColorings, DEFAULT_SHOW_SUMMER_CAPACITY, DEFAULT_SIZE_MULTIPLIER, DEFAULT_CAPACITY_WEIGHT, DEFAULT_COLORING_MODE, operatingStatusColors, DEFAULT_SIZE_BY_OPTION } from './MapValueMappings';
import { MapLeafletPopup } from './components/MapLeafletPopup';
import ReactDOMServer from 'react-dom/server';

// Add efficient debounce implementation
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

// Define the power plant data interface
export interface PowerPlant {
	id: number;
	latitude: number;
	longitude: number;
	fuel_type: keyof typeof fuelTypeDisplayNames;
	operating_status: keyof typeof operatingStatusDisplayNames;
	capacity: number;
	generation: number | null;
	capacity_factor: number | null;
}

// Define Canada infrastructure interfaces
export interface CanadaPowerPlant {
	id: number;
	openinframap_id: string;
	name: string;
	operator: string | null;
	output_mw: number | null;
	fuel_type: string;
	province: string | null;
	latitude: number;
	longitude: number;
	metadata: any;
}

export interface FiberInfrastructure {
	id: number;
	itu_id: string;
	name: string;
	cable_type: string | null;
	capacity_gbps: number | null;
	operator: string | null;
	status: string | null;
	geometry: any;
	metadata: any;
}

export interface GasInfrastructure {
	id: number;
	cer_id: string;
	name: string;
	pipeline_type: string | null;
	capacity_mmcfd: number | null;
	operator: string | null;
	status: string | null;
	geometry: any;
	metadata: any;
}

// Define colors for different fuel types based on energy source code
 

export const getRadiusBase = (capacity: number | null | undefined, zoomLevel: number, sizeMultiplier: number): [number, number] => {
	// Return just base size if capacity is null or undefined
	if (capacity === null || capacity === undefined) {
		const baseSize = Math.max(1, zoomLevel - 3) * sizeMultiplier / 15;
		return [baseSize, 0];
	}
	
	const zoomBaseFactor = Math.pow(1.5, zoomLevel);
	const zoomCapacityFactor = Math.pow(1.75, zoomLevel);
	const baseSize = Math.pow(2, 0.5) * zoomBaseFactor;

	return [baseSize, zoomCapacityFactor];
};

// Function to calculate radius based on capacity and zoom level
const getRadiusByCapacity = (capacity: number | null | undefined, zoomLevel: number, sizeMultiplier: number, capacityWeight: number) => {
	const [baseSize, zoomCapacityFactor] = getRadiusBase(capacity, zoomLevel, sizeMultiplier);
	const capacityComponent = Math.pow((capacity || 0.2) / 100, 0.75) * zoomCapacityFactor * capacityWeight; 
	return ((baseSize + capacityComponent) * sizeMultiplier) / 100;
};

// Function to calculate outline weight based on zoom level
const getOutlineWeightByZoom = (zoomLevel: number) => {
	// Min weight at zoom level 4, max weight at zoom level 18
	return Math.max(0.5, Math.min(2, zoomLevel / 9));
};

// Define a non-hook version of the capacity factor color function
const calculateCapacityFactorColor = (capacityFactor: number | undefined | null, maxCapacityFactor: number | null = 100): string => {
	if (capacityFactor === undefined || capacityFactor === null) return '#444444'; // Dark gray for unknown/N/A
	
	// Use either the filter's max capacity factor or default to 100%
	const actualMaxCapacity = maxCapacityFactor || 100;
	
	// Scale thresholds based on max capacity factor
	const threshold1 = actualMaxCapacity * 0.2; // 20% of max
	const threshold2 = actualMaxCapacity * 0.4; // 40% of max
	const threshold3 = actualMaxCapacity * 0.6; // 60% of max
	const threshold4 = actualMaxCapacity * 0.8; // 80% of max
	
	if (capacityFactor < threshold1) return '#00ff00'; // Bright green for very low
	if (capacityFactor < threshold2) return '#88ff00'; // Light green for low
	if (capacityFactor < threshold3) return '#ffff00'; // Yellow for medium
	if (capacityFactor < threshold4) return '#ff8800'; // Orange for good
	return '#ff0000'; // Red for excellent
};

const clampValue = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(max, value));
};

// Replace the getScaledCapacityFactorForRadius function with this direct fix:
const getScaledCapacityFactorForRadius = (capacityFactor: number, maxCapacityFactor: number | null = 100): number => {
	// All values are percentages (0-100)
	const actualCapacityFactor = clampValue(capacityFactor, 0, 100);
	const actualMaxCapacityFactor = clampValue(maxCapacityFactor || 100, 1, 100);
	
	// Invert the values - higher capacity factors will be smaller
	const invertedValue = actualMaxCapacityFactor - actualCapacityFactor;
	
	// Create a scaling factor that increases dramatically as max decreases
	// When maxCapacityFactor is small, this will greatly exaggerate differences
	const scalingFactor = 100 / actualMaxCapacityFactor;
	
	// Return the inverted, scaled value - this is still a percentage
	return invertedValue * scalingFactor;
};

// Add a new function to fetch plant details
async function fetchPlantDetails(plantId: number) {
	const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
	if (!API_SERVER_URL) {
		throw new Error('API_SERVER_URL is not defined');
	}

	const response = await fetch(`${API_SERVER_URL}/api/map_data/power_plant/${plantId}`);
	const data = await response.json();
	console.log('Full plant data response:', data);
	return data.data;
}

// Function to fetch Canada infrastructure data
async function fetchCanadaData() {
	const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
	if (!API_SERVER_URL) {
		throw new Error('API_SERVER_URL is not defined');
	}

	try {
		const [powerPlantsRes, fiberRes, gasRes] = await Promise.all([
			fetch(`${API_SERVER_URL}/api/map_data/canada_power_plants`),
			fetch(`${API_SERVER_URL}/api/map_data/canada_fiber_infrastructure`),
			fetch(`${API_SERVER_URL}/api/map_data/canada_gas_infrastructure`)
		]);

		const powerPlantsData = await powerPlantsRes.json();
		const fiberData = await fiberRes.json();
		const gasData = await gasRes.json();

		return {
			powerPlants: powerPlantsData.success ? powerPlantsData.data : [],
			fiber: fiberData.success ? fiberData.data : [],
			gas: gasData.success ? gasData.data : []
		};
	} catch (error) {
		console.error('Error fetching Canada data:', error);
		return { powerPlants: [], fiber: [], gas: [] };
	}
}

// Define the array format type
type PowerPlantArray = [
	number,      // id
	string,      // fuel_type
	string,      // operating_status
	number,      // latitude
	number,      // longitude
	number|null, // capacity
	number|null, // generation
	number|null  // capacity_factor
];

// Convert array format to PowerPlant object
function arrayToPowerPlant(arr: PowerPlantArray): PowerPlant {
	return {
		id: arr[0],
		fuel_type: arr[1] as keyof typeof fuelTypeDisplayNames,
		operating_status: arr[2] as keyof typeof operatingStatusDisplayNames,
		latitude: arr[3],
		longitude: arr[4],
		capacity: arr[5] ?? 0,
		generation: arr[6],
		capacity_factor: arr[7]
	};
}

export function MapLeafletPage() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);
	const markersLayerRef = useRef<L.LayerGroup | null>(null);
	const markerRefs = useRef<Map<number, L.CircleMarker>>(new Map());
	
	// Add states for power plant data
	const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// Add states for Canada infrastructure data
	const [canadaPowerPlants, setCanadaPowerPlants] = useState<CanadaPowerPlant[]>([]);
	const [fiberInfrastructure, setFiberInfrastructure] = useState<FiberInfrastructure[]>([]);
	const [gasInfrastructure, setGasInfrastructure] = useState<GasInfrastructure[]>([]);
	
	// Configuration state for visual parameters
	const [visualParams, setVisualParams] = useState({
		showSummerCapacity: DEFAULT_SHOW_SUMMER_CAPACITY,
		sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
		capacityWeight: DEFAULT_CAPACITY_WEIGHT,
		coloringMode: DEFAULT_COLORING_MODE,
		sizeByOption: DEFAULT_SIZE_BY_OPTION
	});
	
	// Configuration state for filter parameters
	const [filterParams, setFilterParams] = useState({
		filters: {
			fuel_type: null as string[] | null,
			state: null as string[] | null,
			operating_status: null as string[] | null,
			min_capacity: null as number | null,
			max_capacity: null as number | null,
			min_capacity_factor: null as number | null,
			max_capacity_factor: null as number | null
		}
	});
	
	// Memoized capacity factor color calculation (inside component)
	const getCapacityFactorColor = useCallback(
		(capacityFactor: number | undefined | null, maxCapacityFactor: number | null = 100): string => {
			return calculateCapacityFactorColor(capacityFactor, maxCapacityFactor);
		}, 
		[]
	);

	const defaultPosition: [number, number] = [39.8283, -98.5795];
	
	// Debounce filter changes for better performance (using a moderate value)
	const debouncedFilters = useDebounce(filterParams.filters, 150);
	
	const capacityFactorColorMap = useMemo(() => {
		const map = new Map<number, string>();
		const maxCap = filterParams.filters.max_capacity_factor || 100;
		
		// Precompute colors for common capacity factor values
		for (let i = 0; i <= maxCap; i += 5) {
			map.set(i, getCapacityFactorColor(i, maxCap));
		}
		
		return map;
	}, [filterParams.filters.max_capacity_factor, getCapacityFactorColor]);
	

	const getPlantColor = useCallback((plant: PowerPlant, coloringMode: MapColorings): string => {
		if (coloringMode === "capacityFactor") {
			if (plant.capacity_factor === null || plant.capacity_factor === undefined) {
				return 'darkgrey';
			}
			
			const roundedFactor = Math.round(plant.capacity_factor / 5) * 5;
			return capacityFactorColorMap.get(roundedFactor) || getCapacityFactorColor(plant.capacity_factor, filterParams.filters.max_capacity_factor);
		}

		if (coloringMode === "operatingStatus") {
			return plant.operating_status && operatingStatusColors[plant.operating_status] 
				? operatingStatusColors[plant.operating_status] 
				: 'darkgrey';
		}
		
		return plant.fuel_type && fuelTypeColors[plant.fuel_type] 
			? fuelTypeColors[plant.fuel_type] 
			: 'darkgrey';
	}, [capacityFactorColorMap, filterParams.filters.max_capacity_factor]);
	
	
	// Listen for messages from parent page
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Verify the origin is from our own domain for security
			if (event.origin !== window.location.origin) return;
			
			// Update configuration with received data
			if (event.data && typeof event.data === 'object') {
				console.log('Received message from parent:', event.data);
				
				if (event.data.type === 'visualParams') {
					setVisualParams({
						showSummerCapacity: event.data.showSummerCapacity,
						sizeMultiplier: event.data.sizeMultiplier,
						capacityWeight: event.data.capacityWeight,
						coloringMode: event.data.coloringMode || "fuelType",
						sizeByOption: event.data.sizeByOption || "nameplate_capacity"
					});
				} 
				else if (event.data.type === 'filterParams') {
					setFilterParams({
						filters: event.data.filters
					});
				}
			}
		};
		
		window.addEventListener('message', handleMessage);
		
		// Cleanup listener on unmount
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);
	
	// Fetch power plant data from the API when debounced filters change
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				// Build query string from filters
				const queryParams = new URLSearchParams();
				const filters = debouncedFilters;
				
				if (filters.fuel_type && Array.isArray(filters.fuel_type) && filters.fuel_type.length > 0) {
					queryParams.append('fuel_type', filters.fuel_type.join(','));
				}
				
				if (filters.state && Array.isArray(filters.state)) {
					filters.state.forEach(stateCode => {
						queryParams.append('state', stateCode);
					});
				}
				
				if (filters.operating_status && Array.isArray(filters.operating_status) && filters.operating_status.length > 0) {
					queryParams.append('operating_status', filters.operating_status.join(','));
				}
				
				if (filters.min_capacity !== null) queryParams.append('min_capacity', filters.min_capacity.toString());
				if (filters.max_capacity !== null) queryParams.append('max_capacity', filters.max_capacity.toString());
				if (filters.min_capacity_factor !== null) queryParams.append('min_capacity_factor', filters.min_capacity_factor.toString());
				if (filters.max_capacity_factor !== null) queryParams.append('max_capacity_factor', filters.max_capacity_factor.toString());
				
				const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
				if (!API_SERVER_URL) {
					throw new Error('API_SERVER_URL is not defined');
				}
				// Update URL to use minimal endpoint
				const url = `${API_SERVER_URL}/api/map_data/power_plants_minimal?${queryParams.toString()}`;
				
				const response = await fetch(url);
				
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}
				
				const data = await response.json();
				
				if (data.success && Array.isArray(data.data)) {
					console.log(`Loaded ${data.data.length} power plants`);
					// Convert array format to PowerPlant objects
					const plants = data.data.map((plantArray: PowerPlantArray) => 
						arrayToPowerPlant(plantArray)
					);
					setPowerPlants(plants);
				} else {
					throw new Error('Invalid response format from API');
				}
			} catch (err) {
				console.error('Error fetching power plant data:', err);
				setError(err instanceof Error ? err.message : 'Unknown error occurred');
				setPowerPlants([]);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchData();
	}, [debouncedFilters]);
	
	// Fetch Canada infrastructure data when component mounts
	useEffect(() => {
		const fetchCanadaInfrastructure = async () => {
			try {
				const canadaData = await fetchCanadaData();
				setCanadaPowerPlants(canadaData.powerPlants);
				setFiberInfrastructure(canadaData.fiber);
				setGasInfrastructure(canadaData.gas);
				console.log(`Loaded ${canadaData.powerPlants.length} Canada power plants, ${canadaData.fiber.length} fiber routes, ${canadaData.gas.length} gas pipelines`);
			} catch (err) {
				console.error('Error fetching Canada infrastructure data:', err);
			}
		};
		
		fetchCanadaInfrastructure();
	}, []); // Empty dependency array - fetch once on mount
	
	// Initialize map
	useEffect(() => {
		// Initialize map only once when component mounts
		if (mapRef.current && !mapInstanceRef.current) {
			// Initialize the map and set its view to center of US
			const map = L.map(mapRef.current).setView(defaultPosition, 5);
			mapInstanceRef.current = map;
			
			// Add OpenStreetMap tile layer
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
			
			// Create a layer group for markers
			const markersLayer = L.layerGroup().addTo(map);
			markersLayerRef.current = markersLayer;
		}
		
		// Cleanup function to remove the map when component unmounts
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, []); // Empty dependency array ensures this runs only once on mount
	
	// Update markers when power plants data changes - use the optimized color function
	useEffect(() => {
		if (!mapInstanceRef.current || !markersLayerRef.current || isLoading) return;
		
		const map = mapInstanceRef.current;
		const markersLayer = markersLayerRef.current;
		const zoomLevel = map.getZoom();
		const outlineWeight = getOutlineWeightByZoom(zoomLevel);
		
		// Track old marker IDs to remove ones that are no longer needed
		const currentPlantIds = new Set(powerPlants.map(plant => plant.id));
		const oldPlantIds = new Set(markerRefs.current.keys());
		
		// Remove markers that are no longer in the data
		for (const id of oldPlantIds) {
			if (!currentPlantIds.has(id)) {
				const marker = markerRefs.current.get(id);
				if (marker) {
					markersLayer.removeLayer(marker);
					markerRefs.current.delete(id);
				}
			}
		}
		
		const batchSize = 2000;
		
		// Plants to process
		const plantsToProcess = [...powerPlants];
		let processedCount = 0;
		
		// Process plants in chunks to avoid blocking the UI
		const processNextBatch = async () => {
			// Calculate the end index for this batch
			const endIdx = Math.min(processedCount + batchSize, plantsToProcess.length);
			
			// Temporary arrays for this batch
			const newMarkersInBatch: L.CircleMarker[] = [];
			const markersToUpdateInBatch: [L.CircleMarker, PowerPlant][] = [];
			
			// Process a batch of plants
			for (let i = processedCount; i < endIdx; i++) {
				const plant = plantsToProcess[i];
				
				// Skip plants without valid coordinates
				if (!plant.latitude || !plant.longitude) continue;
				
				const existingMarker = markerRefs.current.get(plant.id);
				
				if (existingMarker) {
					markersToUpdateInBatch.push([existingMarker, plant]);
				} else {
					// Get color using optimized function
					const color = getPlantColor(plant, visualParams.coloringMode);
					
					// Calculate radius based on capacity
					const radius = getPlantRadius(plant, zoomLevel);
					
					// Create new marker
					const circleMarker = L.circleMarker([plant.latitude, plant.longitude], {
						radius: radius,
						fillColor: color,
						color: '#000',
						weight: outlineWeight,
						opacity: 1,
						fillOpacity: 0.8
					});
					
					// Store plant ID on marker for future reference
					(circleMarker as any)._plantId = plant.id;
					
					// Instead of binding popup directly, handle popup opening:
					circleMarker.on('click', async function(e) {
						const popup = L.popup()
							.setLatLng(e.latlng)
							.setContent('Loading plant details...')
							.openOn(mapInstanceRef.current!);

						try {
							const fullData = await fetchPlantDetails(plant.id);
							popup.setContent(ReactDOMServer.renderToString(
								<MapLeafletPopup plant={plant} fullPlantData={fullData} />
							));
						} catch (error) {
							console.error('Error fetching plant details:', error);
							popup.setContent('Error loading plant details');
						}
					});
					
					newMarkersInBatch.push(circleMarker);
					markerRefs.current.set(plant.id, circleMarker);
				}
			}
			
			// Update markers in this batch
			markersToUpdateInBatch.forEach(([marker, plant]) => {
				// Get color using optimized function
				const color = getPlantColor(plant, visualParams.coloringMode);
				
				// Calculate radius based on capacity
				const radius = getPlantRadius(plant, zoomLevel);
				
				// Update existing marker
				marker.setRadius(radius);
				marker.setLatLng([plant.latitude, plant.longitude]);
				marker.setStyle({
					fillColor: color,
					color: '#000',
					weight: outlineWeight,
					opacity: 1,
					fillOpacity: 0.8
				});
				
				// Update click handler instead of using bindPopup
				marker.off('click'); // Remove old handler
				marker.on('click', async function(e) {
					const popup = L.popup()
						.setLatLng(e.latlng)
						.setContent('Loading plant details...')
						.openOn(mapInstanceRef.current!);

					try {
						const fullData = await fetchPlantDetails(plant.id);
						popup.setContent(ReactDOMServer.renderToString(
							<MapLeafletPopup plant={plant} fullPlantData={fullData} />
						));
					} catch (error) {
						console.error('Error fetching plant details:', error);
						popup.setContent('Error loading plant details');
					}
				});
			});
			
			// Add new markers to the layer
			newMarkersInBatch.forEach(marker => {
				markersLayer.addLayer(marker);
			});
			
			// Update processed count
			processedCount = endIdx;
			
			// Continue processing if there are more plants
			if (processedCount < plantsToProcess.length) {
				// Use requestAnimationFrame to avoid blocking the UI
				requestAnimationFrame(processNextBatch);
			}
		};
		
		// Start processing
		if (plantsToProcess.length > 0) {
			processNextBatch();
		}
	}, [powerPlants, isLoading, visualParams, getPlantColor]);
	
	// Update Canada infrastructure markers when data changes
	useEffect(() => {
		if (!mapInstanceRef.current || !markersLayerRef.current) return;
		
		const map = mapInstanceRef.current;
		const markersLayer = markersLayerRef.current;
		const zoomLevel = map.getZoom();
		
		// Add Canada power plants
		canadaPowerPlants.forEach(plant => {
			if (!plant.latitude || !plant.longitude) return;
			
			// Determine color based on fuel type (matching US data colors)
			let fillColor = '#ff6b6b'; // Default red for unknown
			if (plant.fuel_type) {
				const fuelType = plant.fuel_type.toLowerCase();
				if (fuelType.includes('hydro') || fuelType.includes('water')) {
					fillColor = '#001fff'; // Dodger Blue for hydro (matching US data)
				} else if (fuelType.includes('nuclear')) {
					fillColor = '#4eff33'; // Lime Green for nuclear (matching US data)
				} else if (fuelType.includes('coal')) {
					fillColor = '#A9A9A9'; // Dark Gray for coal (matching US data)
				} else if (fuelType.includes('gas') || fuelType.includes('natural')) {
					fillColor = '#d9ff33'; // Steel Blue for gas (matching US data)
				} else if (fuelType.includes('wind')) {
					fillColor = '#87CEEB'; // Sky Blue for wind (matching US data)
				} else if (fuelType.includes('solar')) {
					fillColor = '#FFD700'; // Gold for solar (matching US data)
				} else if (fuelType.includes('biomass') || fuelType.includes('waste')) {
					fillColor = '#228B22'; // Forest Green for biomass/waste (matching US data)
				} else if (fuelType.includes('oil') || fuelType.includes('diesel')) {
					fillColor = '#000000'; // Black for oil/diesel (matching US data)
				} else if (fuelType.includes('battery')) {
					fillColor = '#9933cc'; // Purple for battery (keeping this unique)
				}
			}
			
			// Calculate dynamic radius using EXACT same logic as US power plants
			const capacity = plant.output_mw || 0;
			
			// Use the exact same getRadiusByCapacity function with same parameters as US data
			const dynamicRadius = getRadiusByCapacity(
				capacity, 
				zoomLevel, 
				DEFAULT_SIZE_MULTIPLIER, // 15 (same as US)
				DEFAULT_CAPACITY_WEIGHT  // 0.2 (same as US)
			);
			
			// Debug logging
			console.log(`Plant: ${plant.name}, Capacity: ${capacity} MW, Zoom: ${zoomLevel}, Radius: ${dynamicRadius.toFixed(1)}`);
			
			// Create marker for Canada power plant with categorized color and uniform sizing
			const marker = L.circleMarker([plant.latitude, plant.longitude], {
				radius: Math.max(1, Math.min(25, dynamicRadius)), // Same clamping as US data
				fillColor: fillColor,
				color: '#000',
				weight: getOutlineWeightByZoom(zoomLevel), // Dynamic outline weight
				opacity: 1,
				fillOpacity: 0.8
			});
			
			// Add popup for Canada power plant
			marker.bindPopup(`
				<div style="min-width: 200px;">
					<h4>${plant.name}</h4>
					<p><strong>Province:</strong> ${plant.province || 'N/A'}</p>
					<p><strong>Fuel Type:</strong> ${plant.fuel_type || 'N/A'}</p>
					<p><strong>Capacity:</strong> ${plant.output_mw ? `${plant.output_mw} MW` : 'N/A'}</p>
					<p><strong>Operator:</strong> ${plant.operator || 'N/A'}</p>
					<p><em>💡 Dot size represents capacity - larger dots = higher capacity</em></p>
				</div>
			`);
			
			markersLayer.addLayer(marker);
		});
		
		// Add fiber infrastructure - translucent by default, brighten on hover
		fiberInfrastructure.forEach(fiber => {
			if (!fiber.geometry) return;
			
			try {
				const geoJson = JSON.parse(fiber.geometry);
				const isSubmarine = fiber.cable_type === 'submarine';
				const baseColor = isSubmarine ? '#1e90ff' : '#32cd32';
				const cableWidth = isSubmarine ? 4 : 3;
				
				const defaultStyle = {
					color: baseColor,
					weight: cableWidth,
					opacity: 0.25,
					lineCap: 'round' as const,
					lineJoin: 'round' as const
				};
				const hoverStyle = {
					color: baseColor,
					weight: cableWidth + 2,
					opacity: 1.0,
					lineCap: 'round' as const,
					lineJoin: 'round' as const
				};
				
				const fiberPath = L.geoJSON(geoJson, {
					style: defaultStyle,
					onEachFeature: function(_feature, layer) {
						layer.on('mouseover', () => {
							(layer as any).setStyle(hoverStyle);
							(layer as any).bringToFront();
						});
						layer.on('mouseout', () => {
							(layer as any).setStyle(defaultStyle);
						});
						(layer as any).bindTooltip(`Fiber: ${isSubmarine ? 'Submarine' : 'Terrestrial'}`, { sticky: true });
					}
				});
				
				const popupContent = `
					<div style="min-width: 200px;">
						<h4>🌐 ${fiber.name}</h4>
						<p><strong>Type:</strong> ${fiber.cable_type || 'N/A'}</p>
						<p><strong>Capacity:</strong> ${fiber.capacity_gbps ? `${fiber.capacity_gbps} Gbps` : 'N/A'}</p>
						<p><strong>Status:</strong> ${fiber.status || 'N/A'}</p>
						<p><strong>Operator:</strong> ${fiber.operator || 'N/A'}</p>
						<p><em>💡 Fiber optic cable</em></p>
					</div>
				`;
				fiberPath.bindPopup(popupContent);
				markersLayer.addLayer(fiberPath);
			} catch (error) {
				console.error('Error parsing fiber geometry:', error);
			}
		});
		
		// Add gas infrastructure - translucent by default, brighten on hover
		gasInfrastructure.forEach(gas => {
			if (!gas.geometry) return;
			
			try {
				const geoJson = JSON.parse(gas.geometry);
				const isTransmission = gas.pipeline_type === 'transmission';
				const baseColor = isTransmission ? '#ff6b35' : '#ff4757';
				const pipelineWidth = isTransmission ? 4 : 3;
				
				const defaultStyle = {
					color: baseColor,
					weight: pipelineWidth,
					opacity: 0.25,
					lineCap: 'round' as const,
					lineJoin: 'round' as const
				};
				const hoverStyle = {
					color: baseColor,
					weight: pipelineWidth + 2,
					opacity: 1.0,
					lineCap: 'round' as const,
					lineJoin: 'round' as const
				};
				
				const pipelinePath = L.geoJSON(geoJson, {
					style: defaultStyle,
					onEachFeature: function(_feature, layer) {
						layer.on('mouseover', () => {
							(layer as any).setStyle(hoverStyle);
							(layer as any).bringToFront();
						});
						layer.on('mouseout', () => {
							(layer as any).setStyle(defaultStyle);
						});
						(layer as any).bindTooltip(`Gas: ${isTransmission ? 'Transmission' : 'Distribution'}`, { sticky: true });
					}
				});
				
				const popupContent = `
					<div style="min-width: 200px;">
						<h4>⛽ ${gas.name}</h4>
						<p><strong>Type:</strong> ${gas.pipeline_type || 'N/A'}</p>
						<p><strong>Capacity:</strong> ${gas.capacity_mmcfd ? `${gas.capacity_mmcfd} MMcf/d` : 'N/A'}</p>
						<p><strong>Status:</strong> ${gas.status || 'N/A'}</p>
						<p><strong>Operator:</strong> ${gas.operator || 'N/A'}</p>
						<p><em>💡 Natural gas pipeline</em></p>
					</div>
				`;
				pipelinePath.bindPopup(popupContent);
				markersLayer.addLayer(pipelinePath);
			} catch (error) {
				console.error('Error parsing gas geometry:', error);
			}
		});
		
	}, [canadaPowerPlants, fiberInfrastructure, gasInfrastructure]);
	
	// Update marker sizes when visual parameters change
	useEffect(() => {
		if (!mapInstanceRef.current || !markersLayerRef.current) return;
		
		const map = mapInstanceRef.current;
		const zoomLevel = map.getZoom();
		
		// Update all existing markers
		markerRefs.current.forEach((marker, plantId) => {
			const plant = powerPlants.find(p => p.id === plantId);
			if (plant && plant.capacity) {
				const newRadius = getPlantRadius(plant, zoomLevel);
				marker.setRadius(newRadius);
				
				// Update click handler instead of using bindPopup
				marker.off('click'); // Remove old handler
				marker.on('click', async function(e) {
					const popup = L.popup()
						.setLatLng(e.latlng)
						.setContent('Loading plant details...')
						.openOn(mapInstanceRef.current!);

					try {
						const fullData = await fetchPlantDetails(plant.id);
						popup.setContent(ReactDOMServer.renderToString(
							<MapLeafletPopup plant={plant} fullPlantData={fullData} />
						));
					} catch (error) {
						console.error('Error fetching plant details:', error);
						popup.setContent('Error loading plant details');
					}
				});
			}
		});
	}, [visualParams, powerPlants]);
	
	// Update markers when zoom changes
	useEffect(() => {
		if (!mapInstanceRef.current) return;
		
		const map = mapInstanceRef.current;
		
		const handleZoom = () => {
			const newZoomLevel = map.getZoom();
			const outlineWeight = getOutlineWeightByZoom(newZoomLevel);
			
			markerRefs.current.forEach((marker, plantId) => {
				const plant = powerPlants.find(p => p.id === plantId);
				if (plant) {
					const newRadius = getPlantRadius(plant, newZoomLevel);
					marker.setRadius(newRadius);
					marker.setStyle({
						weight: outlineWeight
					});
				}
			});
		};
		
		map.on('zoomend', handleZoom);
		
		return () => {
			map.off('zoomend', handleZoom);
		};
	}, [powerPlants, visualParams]);
	
	// Move getPlantRadius inside component and memoize it
	const getPlantRadius = useCallback((plant: PowerPlant, zoomLevel: number) => {
		return visualParams.sizeByOption === "capacity_factor" 
			? (plant.capacity_factor !== null)
				? getRadiusByCapacity(
					getScaledCapacityFactorForRadius(plant.capacity_factor, filterParams.filters.max_capacity_factor), 
					zoomLevel, 
					visualParams.sizeMultiplier, 
					visualParams.capacityWeight
				)
				: Math.max(1, zoomLevel - 3) * visualParams.sizeMultiplier / 15
			: visualParams.sizeByOption === "generation" 
				? (plant.generation !== null)
					? getRadiusByCapacity(
						plant.generation / 1000,
						zoomLevel, 
						visualParams.sizeMultiplier, 
						visualParams.capacityWeight
					)
					: Math.max(1, zoomLevel - 3) * visualParams.sizeMultiplier / 15
				: plant.capacity 
					? getRadiusByCapacity(
						plant.capacity, 
						zoomLevel, 
						visualParams.sizeMultiplier, 
						visualParams.capacityWeight
					)
					: Math.max(1, zoomLevel - 3) * visualParams.sizeMultiplier / 15;
	}, [visualParams, filterParams.filters.max_capacity_factor]);
	
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100vh',
			width: '100vw',
			backgroundColor: '#f0f0f0',
			position: 'relative'
		}}>
			{isLoading && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(0, 0, 0, ' + (powerPlants.length ? '0.5' : '0.7') + ')',
					color: 'white',
					padding: '20px',
					borderRadius: '5px',
					zIndex: 1001
				}}>
					Loading power plant data...
				</div>
			)}
			
			{error && !powerPlants.length && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(255, 0, 0, 0.7)',
					color: 'white',
					padding: '20px',
					borderRadius: '5px',
					zIndex: 1001
				}}>
					Error: {error}
				</div>
			)}
			
			<div 
				ref={mapRef} 
				style={{ 
					height: '100%', 
					width: '100%',
				}}
			></div>
		</div>
	);
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/MapCanadaPage.tsx

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fuelTypeColors, fuelTypeDisplayNames, operatingStatusDisplayNames, MapColorings, DEFAULT_SHOW_SUMMER_CAPACITY, DEFAULT_SIZE_MULTIPLIER, DEFAULT_CAPACITY_WEIGHT, DEFAULT_COLORING_MODE, operatingStatusColors, DEFAULT_SIZE_BY_OPTION } from './MapValueMappings';
import { MapLeafletPopup } from './components/MapLeafletPopup';
import ReactDOMServer from 'react-dom/server';

// Add efficient debounce implementation (same as US)
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

// Define the Canada power plant data interface (following US pattern)
export interface CanadaPowerPlant {
	id: number;
	openinframap_id: string;
	name: string;
	operator: string | null;
	output_mw: number | null;
	fuel_type: keyof typeof fuelTypeDisplayNames;
	province: string | null;
	latitude: number;
	longitude: number;
	metadata: any;
	// Add missing properties to match PowerPlant interface
	operating_status: keyof typeof operatingStatusDisplayNames;
	capacity: number;
	generation: number | null;
	capacity_factor: number | null;
}

// Define fiber infrastructure interface
export interface FiberInfrastructure {
	id: number;
	itu_id: string;
	name: string;
	cable_type: string | null;
	capacity_gbps: number | null;
	operator: string | null;
	status: string | null;
	geometry: any;
	metadata: any;
}

// Define gas infrastructure interface
export interface GasInfrastructure {
	id: number;
	cer_id: string;
	name: string;
	pipeline_type: string | null;
	capacity_mmcfd: number | null;
	operator: string | null;
	status: string | null;
	geometry: any;
	metadata: any;
}

// Define the array format type (following US pattern)
type CanadaPowerPlantArray = [
	number,      // id
	string,      // fuel_type
	string,      // operating_status (always 'OP' for Canada)
	number,      // latitude
	number,      // longitude
	number|null, // capacity (output_mw)
	number|null, // generation (always null for Canada)
	number|null  // capacity_factor (always null for Canada)
];

// Convert array format to CanadaPowerPlant object (following US pattern)
function arrayToCanadaPowerPlant(arr: CanadaPowerPlantArray): CanadaPowerPlant {
	return {
		id: arr[0],
		openinframap_id: '', // Will be filled from full data
		name: '', // Will be filled from full data
		operator: null, // Will be filled from full data
		output_mw: arr[5],
		fuel_type: arr[1] as keyof typeof fuelTypeDisplayNames,
		province: null, // Will be filled from full data
		latitude: arr[3],
		longitude: arr[4],
		metadata: {},
		// Add missing properties with default values
		operating_status: 'OP' as keyof typeof operatingStatusDisplayNames, // Default to operating
		capacity: arr[5] || 0, // Use output_mw as capacity
		generation: null, // No generation data for Canada
		capacity_factor: null // No capacity factor data for Canada
	};
}

// Add a new function to fetch plant details (following US pattern)
async function fetchCanadaPlantDetails(plantId: number) {
	const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
	if (!API_SERVER_URL) {
		throw new Error('API_SERVER_URL is not defined');
	}

	const response = await fetch(`${API_SERVER_URL}/api/map_data/canada_power_plant/${plantId}`);
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	const data = await response.json();
	if (data.success) {
		return data.data;
	} else {
		throw new Error('Invalid response format from API');
	}
}

// Enhanced Canada map component with better layout and controls
export function MapCanadaPage() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);
	const powerPlantsLayerRef = useRef<L.LayerGroup | null>(null);
	const fiberLayerRef = useRef<L.LayerGroup | null>(null);
	const gasLayerRef = useRef<L.LayerGroup | null>(null);
	const markerRefs = useRef<Map<number, L.CircleMarker>>(new Map());
	
	// State for data and UI
	const [powerPlants, setPowerPlants] = useState<CanadaPowerPlant[]>([]);
	const [fiberInfrastructure, setFiberInfrastructure] = useState<FiberInfrastructure[]>([]);
	const [gasInfrastructure, setGasInfrastructure] = useState<GasInfrastructure[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// Enhanced visual parameters for better Canada map display
	const [visualParams, setVisualParams] = useState({
		coloringMode: DEFAULT_COLORING_MODE,
		sizeBy: DEFAULT_SIZE_BY_OPTION,
		showSummerCapacity: DEFAULT_SHOW_SUMMER_CAPACITY,
		capacityWeight: DEFAULT_CAPACITY_WEIGHT,
		sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
		showFiber: true,
		showGas: true,
		showPowerPlants: true
	});
	
	// Enhanced filter parameters for Canada-specific filtering
	const [filterParams, setFilterParams] = useState({
		filters: {
			fuel_type: [] as string[],
			province: [] as string[],
			min_capacity: null as number | null,
			max_capacity: null as number | null,
			operator: [] as string[]
		}
	});
	
	// Debounced filters for better performance
	const debouncedFilters = useDebounce(filterParams.filters, 300);
	
	// Enhanced default position for better Canada view
	const defaultPosition: [number, number] = [56.1304, -106.3468]; // Center of Canada
	const defaultZoom = 4; // Better zoom level for Canada overview
	
	// Enhanced color function for Canada power plants
	const getPlantColor = useCallback((plant: CanadaPowerPlant, coloringMode: MapColorings) => {
		switch (coloringMode) {
			case 'fuelType':
				return fuelTypeColors[plant.fuel_type] || '#999999';
			case 'operatingStatus':
				return operatingStatusColors['OP'] || '#00ff00'; // Canada plants are always operating
			case 'capacityFactor':
				const capacity = plant.output_mw || 0;
				if (capacity > 1000) return '#ff0000'; // Red for large plants
				if (capacity > 500) return '#ff6600'; // Orange for medium-large
				if (capacity > 100) return '#ffff00'; // Yellow for medium
				return '#00ff00'; // Green for small plants
			default:
				return fuelTypeColors[plant.fuel_type] || '#999999';
		}
	}, []);
	
	// Listen for messages from parent page (same as US)
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Verify the origin is from our own domain for security
			if (event.origin !== window.location.origin) return;
			
			// Update configuration with received data
			if (event.data && typeof event.data === 'object') {
				console.log('Received message from parent:', event.data);
				
				if (event.data.type === 'visualParams') {
					setVisualParams({
						sizeBy: event.data.sizeBy || "nameplate_capacity",
						showSummerCapacity: event.data.showSummerCapacity,
						sizeMultiplier: event.data.sizeMultiplier,
						capacityWeight: event.data.capacityWeight,
						coloringMode: event.data.coloringMode || "fuelType",
						showFiber: event.data.showFiber,
						showGas: event.data.showGas,
						showPowerPlants: event.data.showPowerPlants
					});
				} 
				else if (event.data.type === 'filterParams') {
					setFilterParams({
						filters: event.data.filters
					});
				}
			}
		};
		
		window.addEventListener('message', handleMessage);
		
		// Cleanup listener on unmount
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);
	
	// Fetch Canada power plant data from the API when debounced filters change (following US pattern)
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				// Build query string from filters (following US pattern)
				const queryParams = new URLSearchParams();
				const filters = debouncedFilters;
				
				if (filters.fuel_type && Array.isArray(filters.fuel_type) && filters.fuel_type.length > 0) {
					queryParams.append('fuel_type', filters.fuel_type.join(','));
				}
				
				if (filters.province && Array.isArray(filters.province)) {
					filters.province.forEach(province => {
						queryParams.append('province', province);
					});
				}
				
				if (filters.min_capacity !== null) queryParams.append('min_capacity', filters.min_capacity.toString());
				if (filters.max_capacity !== null) queryParams.append('max_capacity', filters.max_capacity.toString());
				
				const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
				if (!API_SERVER_URL) {
					throw new Error('API_SERVER_URL is not defined');
				}
				
				// Use minimal endpoint (following US pattern)
				const url = `${API_SERVER_URL}/api/map_data/canada_power_plants_minimal?${queryParams.toString()}`;
				
				const response = await fetch(url);
				
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}
				
				const data = await response.json();
				
				if (data.success && Array.isArray(data.data)) {
					console.log(`Loaded ${data.data.length} Canada power plants`);
					// Convert array format to CanadaPowerPlant objects (following US pattern)
					const plants = data.data.map((plantArray: CanadaPowerPlantArray) => 
						arrayToCanadaPowerPlant(plantArray)
					);
					setPowerPlants(plants);
				} else {
					throw new Error('Invalid response format from API');
				}
			} catch (err) {
				console.error('Error fetching Canada power plant data:', err);
				setError(err instanceof Error ? err.message : 'Unknown error occurred');
				setPowerPlants([]);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchData();
	}, [debouncedFilters]);
	
	// Fetch fiber infrastructure data
	useEffect(() => {
		const fetchFiberData = async () => {
			try {
				const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
				if (!API_SERVER_URL) {
					throw new Error('API_SERVER_URL is not defined');
				}
				
				const response = await fetch(`${API_SERVER_URL}/api/map_data/fiber_infrastructure`);
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}
				
				const data = await response.json();
				if (data.success) {
					setFiberInfrastructure(data.data);
				}
			} catch (err) {
				console.error('Error fetching fiber infrastructure:', err);
			}
		};
		
		fetchFiberData();
	}, []);
	
	// Fetch gas infrastructure data
	useEffect(() => {
		const fetchGasData = async () => {
			try {
				const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
				if (!API_SERVER_URL) {
					throw new Error('API_SERVER_URL is not defined');
				}
				
				const response = await fetch(`${API_SERVER_URL}/api/map_data/gas_infrastructure`);
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}
				
				const data = await response.json();
				if (data.success) {
					setGasInfrastructure(data.data);
				}
			} catch (err) {
				console.error('Error fetching gas infrastructure:', err);
			}
		};
		
		fetchGasData();
	}, []);
	
	// Initialize map (following US pattern)
	useEffect(() => {
		// Initialize map only once when component mounts
		if (mapRef.current && !mapInstanceRef.current) {
			// Initialize the map and set its view to center of Canada
			const map = L.map(mapRef.current).setView(defaultPosition, defaultZoom);
			mapInstanceRef.current = map;
			
			// Add multiple tile layer options for better Canada mapping
			const osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});
			
			const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
				maxZoom: 19,
				attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
			});
			
			const terrainTiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
				maxZoom: 17,
				attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
			});
			
			// Add default OSM tiles
			osmTiles.addTo(map);
			
			// Create layer groups for different infrastructure types
			const powerPlantsLayer = L.layerGroup().addTo(map);
			const fiberLayer = L.layerGroup().addTo(map);
			const gasLayer = L.layerGroup().addTo(map);
			
			powerPlantsLayerRef.current = powerPlantsLayer;
			fiberLayerRef.current = fiberLayer;
			gasLayerRef.current = gasLayer;
			
			// Add layer control for different tile types
			const baseMaps = {
				"OpenStreetMap": osmTiles,
				"Satellite": satelliteTiles,
				"Terrain": terrainTiles
			};
			
			const overlayMaps = {
				"Power Plants": powerPlantsLayer,
				"Fiber Infrastructure": fiberLayer,
				"Gas Infrastructure": gasLayer
			};
			
			// Add layer control to top right
			L.control.layers(baseMaps, overlayMaps, {
				position: 'topright',
				collapsed: false
			}).addTo(map);
			
			// Add scale control
			L.control.scale({
				position: 'bottomleft',
				metric: true,
				imperial: false
			}).addTo(map);
			
			// Add custom info control for Canada map
			const infoControl = L.Control.extend({
				onAdd: function() {
					const div = L.DomUtil.create('div', 'info-control');
					div.innerHTML = `
						<div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4); min-width: 200px;">
							<h4 style="margin: 0 0 10px 0; color: #333;">🇨🇦 Canada Infrastructure</h4>
							<div id="map-info">Loading...</div>
						</div>
					`;
					return div;
				}
			});
			new infoControl({ position: 'topright' }).addTo(map);
			
			// Add fullscreen control (using a simple button since fullscreen control may not be available)
			const fullscreenControl = L.Control.extend({
				onAdd: function() {
					const div = L.DomUtil.create('div', 'fullscreen-control');
					div.innerHTML = `
						<button style="background: white; border: 2px solid rgba(0,0,0,0.2); border-radius: 4px; padding: 8px; cursor: pointer; font-size: 12px;" onclick="document.documentElement.requestFullscreen()">
							⛶ Full Screen
						</button>
					`;
					return div;
				}
			});
			new fullscreenControl({ position: 'topleft' }).addTo(map);
			
			// Add zoom control with better positioning
			L.control.zoom({
				position: 'bottomright'
			}).addTo(map);
			
			// Add province boundaries for better context
			const provinceBoundaries = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 10,
				opacity: 0.3
			});
			
			// Add province boundaries to overlay maps
			(overlayMaps as any)["Province Boundaries"] = provinceBoundaries;
			provinceBoundaries.addTo(map);
		}
		
		// Cleanup function to remove the map when component unmounts
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, []); // Empty dependency array ensures this runs only once on mount
	
	// Update power plants on map (following US pattern)
	useEffect(() => {
		if (!powerPlantsLayerRef.current || !mapInstanceRef.current) return;
		
		const map = mapInstanceRef.current;
		const powerPlantsLayer = powerPlantsLayerRef.current;
		const zoomLevel = map.getZoom();
		const outlineWeight = Math.max(0.5, Math.min(2, zoomLevel / 9)); // Same as US
		
		// Track old marker IDs to remove ones that are no longer needed (same as US)
		const currentPlantIds = new Set(powerPlants.map(plant => plant.id));
		const oldPlantIds = new Set(markerRefs.current.keys());
		
		// Remove markers that are no longer in the data (same as US)
		for (const id of oldPlantIds) {
			if (!currentPlantIds.has(id)) {
				const marker = markerRefs.current.get(id);
				if (marker) {
					powerPlantsLayer.removeLayer(marker);
					markerRefs.current.delete(id);
				}
			}
		}
		
		// Process plants in batches (same as US)
		const batchSize = 2000;
		const plantsToProcess = [...powerPlants];
		let processedCount = 0;
		
		const processNextBatch = async () => {
			const endIdx = Math.min(processedCount + batchSize, plantsToProcess.length);
			const newMarkersInBatch: L.CircleMarker[] = [];
			const markersToUpdateInBatch: [L.CircleMarker, CanadaPowerPlant][] = [];
			
			for (let i = processedCount; i < endIdx; i++) {
				const plant = plantsToProcess[i];
				
				// Skip plants without valid coordinates (same as US)
				if (!plant.latitude || !plant.longitude) continue;
				
				const existingMarker = markerRefs.current.get(plant.id);
				
				if (existingMarker) {
					markersToUpdateInBatch.push([existingMarker, plant]);
				} else {
					// Get color using optimized function (same as US)
					const color = getPlantColor(plant, visualParams.coloringMode);
					
					// Calculate radius based on capacity (same as US)
					const radius = Math.max(3, Math.min(15, (plant.output_mw || 100) / 100));
					
					// Create new marker (same as US)
					const circleMarker = L.circleMarker([plant.latitude, plant.longitude], {
						radius: radius,
						fillColor: color,
						color: '#000',
						weight: outlineWeight,
						opacity: 1,
						fillOpacity: 0.8
					});
					
					// Store plant ID on marker for future reference (same as US)
					(circleMarker as any)._plantId = plant.id;
					
					// Handle popup opening (same as US)
					circleMarker.on('click', async function(e) {
						const popup = L.popup()
							.setLatLng(e.latlng)
							.setContent('Loading plant details...')
							.openOn(mapInstanceRef.current!);

						try {
							const fullData = await fetchCanadaPlantDetails(plant.id);
							popup.setContent(ReactDOMServer.renderToString(
								<MapLeafletPopup plant={plant} fullPlantData={fullData} />
							));
						} catch (error) {
							console.error('Error fetching plant details:', error);
							popup.setContent('Error loading plant details');
						}
					});
					
					newMarkersInBatch.push(circleMarker);
					markerRefs.current.set(plant.id, circleMarker);
				}
			}
			
			// Update markers in this batch (same as US)
			markersToUpdateInBatch.forEach(([marker, plant]) => {
				const color = getPlantColor(plant, visualParams.coloringMode);
				const radius = Math.max(3, Math.min(15, (plant.output_mw || 100) / 100));
				
				marker.setRadius(radius);
				marker.setLatLng([plant.latitude, plant.longitude]);
				marker.setStyle({
					fillColor: color,
					color: '#000',
					weight: outlineWeight,
					opacity: 1,
					fillOpacity: 0.8
				});
				
				// Update click handler (same as US)
				marker.off('click');
				marker.on('click', async function(e) {
					const popup = L.popup()
						.setLatLng(e.latlng)
						.setContent('Loading plant details...')
						.openOn(mapInstanceRef.current!);

					try {
						const fullData = await fetchCanadaPlantDetails(plant.id);
						popup.setContent(ReactDOMServer.renderToString(
							<MapLeafletPopup plant={plant} fullPlantData={fullData} />
						));
					} catch (error) {
						console.error('Error fetching plant details:', error);
						popup.setContent('Error loading plant details');
					}
				});
			});
			
			// Add new markers to the layer (same as US)
			newMarkersInBatch.forEach(marker => {
				powerPlantsLayer.addLayer(marker);
			});
			
			// Update processed count
			processedCount = endIdx;
			
			// Continue processing if there are more plants (same as US)
			if (processedCount < plantsToProcess.length) {
				requestAnimationFrame(processNextBatch);
			}
		};
		
		// Start processing
		if (plantsToProcess.length > 0) {
			processNextBatch();
		}
	}, [powerPlants, isLoading, visualParams, getPlantColor]);
	
	// Update fiber infrastructure on map
	useEffect(() => {
		if (!fiberLayerRef.current) return;
		
		const layer = fiberLayerRef.current;
		layer.clearLayers();
		
		fiberInfrastructure.forEach(fiber => {
			if (!fiber.geometry) return;
			
			try {
				const geoJson = JSON.parse(fiber.geometry);
				
				// Styling: translucent by default, brighten on hover
				const isSubmarine = fiber.cable_type === 'submarine';
				const baseColor = isSubmarine ? '#1e90ff' : '#32cd32';
				const glowColor = isSubmarine ? '#87ceeb' : '#90ee90';
				const cableWidth = isSubmarine ? 6 : 4;
				const fiberStrands = isSubmarine ? 8 : 6;
				
				const defaultStyle = {
					color: baseColor,
					weight: cableWidth,
					opacity: 0.25,
					lineCap: 'round' as const,
					lineJoin: 'round' as const
				};
				
				const hoverStyle = {
					color: baseColor,
					weight: cableWidth + 2,
					opacity: 1.0,
					lineCap: 'round' as const,
					lineJoin: 'round' as const
				};
				
				const fiberPath = L.geoJSON(geoJson, {
					style: defaultStyle,
					onEachFeature: function(_feature, layer) {
						layer.on('mouseover', () => {
							(layer as any).setStyle(hoverStyle);
							(layer as any).bringToFront();
						});
						layer.on('mouseout', () => {
							(layer as any).setStyle(defaultStyle);
						});
						(layer as any).bindTooltip(`Fiber: ${isSubmarine ? 'Submarine' : 'Terrestrial'}`, { sticky: true });
					}
				});
				
				// Enhanced popup with better styling
				const popupContent = `
					<div style="font-family: Arial, sans-serif; min-width: 200px;">
						<div style="background: linear-gradient(135deg, ${baseColor}, ${glowColor}); color: white; padding: 8px; margin: -8px -8px 8px -8px; border-radius: 4px;">
							<h3 style="margin: 0; font-size: 14px;">${fiber.name}</h3>
						</div>
						<div style="font-size: 12px; line-height: 1.4;">
							<p style="margin: 4px 0;"><strong>Type:</strong> ${fiber.cable_type || 'Unknown'}</p>
							<p style="margin: 4px 0;"><strong>Capacity:</strong> ${fiber.capacity_gbps ? `${fiber.capacity_gbps} Gbps` : 'Unknown'}</p>
							<p style="margin: 4px 0;"><strong>Strands:</strong> ${fiberStrands} fiber strands</p>
							<p style="margin: 4px 0;"><strong>Operator:</strong> ${fiber.operator || 'Unknown'}</p>
							<p style="margin: 4px 0;"><strong>Status:</strong> ${fiber.status || 'Unknown'}</p>
						</div>
					</div>
				`;
				
				// Bind popup and add to layer
				fiberPath.bindPopup(popupContent);
				layer.addLayer(fiberPath);
			} catch (err) {
				console.error('Error parsing fiber geometry:', err);
			}
		});
	}, [fiberInfrastructure]);
	
	// Update gas infrastructure on map
	useEffect(() => {
		if (!gasLayerRef.current) return;
		
		const layer = gasLayerRef.current;
		layer.clearLayers();
		
		gasInfrastructure.forEach(gas => {
			if (!gas.geometry) return;
			
			try {
				const geoJson = JSON.parse(gas.geometry);
				
				// Gas pipeline styling: translucent by default, brighten on hover
				const isTransmission = gas.pipeline_type === 'transmission';
				const baseColor = isTransmission ? '#ff6b35' : '#ff4757';
				const glowColor = isTransmission ? '#ffa726' : '#ff7675';
				
				// Create realistic pipeline effect
				const pipelineWidth = isTransmission ? 6 : 4;
				
				// Create realistic pipeline with depth
				const createRealisticPipeline = (geometry: any) => {
					const pipelineGroup = L.layerGroup();
					
					if (geometry.type === 'LineString' && geometry.coordinates) {
						const coordinates = geometry.coordinates;
						
						// 1. Shadow layer
						const shadowStyle = {
							color: '#000000',
							weight: pipelineWidth + 2,
							opacity: 0.2,
							lineCap: 'round' as const,
							lineJoin: 'round' as const
						};
						
						const shadowOffset = 0.0001;
						const shadowCoords = coordinates.map((coord: [number, number]) => [
							coord[0] + shadowOffset,
							coord[1] - shadowOffset
						]);
						
						const shadowGeometry = {
							...geometry,
							coordinates: shadowCoords
						};
						
						const shadow = L.geoJSON(shadowGeometry, { style: shadowStyle });
						pipelineGroup.addLayer(shadow);
						
						// 2. Main pipeline
						const mainPipelineStyle = {
							color: baseColor,
							weight: pipelineWidth,
							opacity: 0.25,
							lineCap: 'round' as const,
							lineJoin: 'round' as const
						};
						
						const mainPipeline = L.geoJSON(geometry, {
							style: mainPipelineStyle,
							onEachFeature: function(_feature, layer) {
								layer.on('mouseover', () => {
									(layer as any).setStyle({
										weight: pipelineWidth + 2,
										opacity: 1.0
									});
									(layer as any).bringToFront();
								});
								layer.on('mouseout', () => {
									(layer as any).setStyle(mainPipelineStyle);
								});
								(layer as any).bindTooltip(`Gas: ${isTransmission ? 'Transmission' : 'Distribution'}`, { sticky: true });
							}
						});
						pipelineGroup.addLayer(mainPipeline);
						
						// 3. Inner core
						const coreStyle = {
							color: isTransmission ? '#d84315' : '#c62828',
							weight: Math.max(2, pipelineWidth - 2),
							opacity: 0.8,
							lineCap: 'round' as const,
							lineJoin: 'round' as const
						};
						
						const core = L.geoJSON(geometry, { style: coreStyle });
						pipelineGroup.addLayer(core);
						
						// 4. Highlight
						const highlightStyle = {
							color: '#ffffff',
							weight: 1,
							opacity: 0.5,
							lineCap: 'round' as const,
							lineJoin: 'round' as const
						};
						
						const highlightCoords = coordinates.map((coord: [number, number]) => [
							coord[0] - 0.00003,
							coord[1] + 0.00003
						]);
						
						const highlightGeometry = {
							...geometry,
							coordinates: highlightCoords
						};
						
						const highlight = L.geoJSON(highlightGeometry, { style: highlightStyle });
						pipelineGroup.addLayer(highlight);
					}
					
					return pipelineGroup;
				};
				
				const realisticPipeline = createRealisticPipeline(geoJson);
				
				// Enhanced popup with better styling
				const popupContent = `
					<div style="font-family: Arial, sans-serif; min-width: 200px;">
						<div style="background: linear-gradient(135deg, ${baseColor}, ${glowColor}); color: white; padding: 8px; margin: -8px -8px 8px -8px; border-radius: 4px;">
							<h3 style="margin: 0; font-size: 14px;">${gas.name}</h3>
						</div>
						<div style="font-size: 12px; line-height: 1.4;">
							<p style="margin: 4px 0;"><strong>Type:</strong> ${gas.pipeline_type || 'Unknown'}</p>
							<p style="margin: 4px 0;"><strong>Capacity:</strong> ${gas.capacity_mmcfd ? `${gas.capacity_mmcfd} MMcf/d` : 'Unknown'}</p>
							<p style="margin: 4px 0;"><strong>Operator:</strong> ${gas.operator || 'Unknown'}</p>
							<p style="margin: 4px 0;"><strong>Status:</strong> ${gas.status || 'Unknown'}</p>
						</div>
					</div>
				`;
				
				realisticPipeline.bindPopup(popupContent);
				layer.addLayer(realisticPipeline);
			} catch (err) {
				console.error('Error parsing gas geometry:', err);
			}
		});
	}, [gasInfrastructure]);
	
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100vh',
			width: '100vw',
			backgroundColor: '#f0f0f0',
			position: 'relative'
		}}>
			{/* Enhanced loading indicator */}
			{isLoading && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(0, 0, 0, ' + (powerPlants.length ? '0.5' : '0.7') + ')',
					color: 'white',
					padding: '20px',
					borderRadius: '10px',
					zIndex: 1001,
					textAlign: 'center',
					boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
				}}>
					<div style={{ fontSize: '18px', marginBottom: '10px' }}>🇨🇦</div>
					<div>Loading Canada Infrastructure Data...</div>
					{powerPlants.length > 0 && (
						<div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
							{powerPlants.length} power plants loaded
						</div>
					)}
				</div>
			)}
			
			{/* Enhanced error display */}
			{error && !powerPlants.length && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(255, 0, 0, 0.8)',
					color: 'white',
					padding: '20px',
					borderRadius: '10px',
					zIndex: 1001,
					textAlign: 'center',
					boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
					maxWidth: '400px'
				}}>
					<div style={{ fontSize: '18px', marginBottom: '10px' }}>⚠️</div>
					<div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Error Loading Data</div>
					<div style={{ fontSize: '14px' }}>{error}</div>
				</div>
			)}
			
			{/* Enhanced map container with better styling */}
			<div 
				ref={mapRef} 
				style={{ 
					height: '100%', 
					width: '100%',
					borderRadius: '0',
					boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
				}}
			></div>
			
			{/* Enhanced legend overlay */}
			{(powerPlants.length > 0 || fiberInfrastructure.length > 0 || gasInfrastructure.length > 0) && (
				<div style={{
					position: 'absolute',
					bottom: '20px',
					right: '20px',
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
					padding: '15px',
					borderRadius: '10px',
					boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
					zIndex: 1000,
					minWidth: '200px',
					border: '2px solid rgba(0,0,0,0.1)'
				}}>
					<div style={{ 
						fontWeight: 'bold', 
						marginBottom: '10px', 
						color: '#333',
						fontSize: '14px',
						textAlign: 'center'
					}}>
						🇨🇦 Canada Map Legend
					</div>
					<div style={{ fontSize: '12px', lineHeight: '1.4' }}>
						<div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
							Power Plants (dot size = capacity)
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#ffff00' }}>●</span> Solar
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#66ccff' }}>●</span> Wind
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#00cc00' }}>●</span> Natural Gas
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#0066cc' }}>●</span> Hydro
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#4eff33' }}>●</span> Nuclear
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#333333' }}>●</span> Coal
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#996633' }}>●</span> Biomass/Waste
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#cc6600' }}>●</span> Oil/Diesel
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#9933cc' }}>●</span> Battery
						</div>
						<div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
							Infrastructure Lines
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#1e90ff', fontWeight: 'bold' }}>━━━</span> Submarine Fiber (8 strands)
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#32cd32', fontWeight: 'bold' }}>━━━</span> Terrestrial Fiber (6 strands)
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#ff6b35', fontWeight: 'bold' }}>━━━</span> Gas Transmission
						</div>
						<div style={{ marginBottom: '5px' }}>
							<span style={{ color: '#ff4757', fontWeight: 'bold' }}>━━━</span> Gas Distribution
						</div>
					</div>
				</div>
			)}
			
			{/* Enhanced stats overlay */}
			{(powerPlants.length > 0 || fiberInfrastructure.length > 0 || gasInfrastructure.length > 0) && (
				<div style={{
					position: 'absolute',
					top: '20px',
					left: '20px',
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
					padding: '15px',
					borderRadius: '10px',
					boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
					zIndex: 1000,
					minWidth: '180px',
					border: '2px solid rgba(0,0,0,0.1)'
				}}>
					<div style={{ 
						fontWeight: 'bold', 
						marginBottom: '10px', 
						color: '#333',
						fontSize: '14px',
						textAlign: 'center'
					}}>
						📊 Infrastructure Stats
					</div>
					<div style={{ fontSize: '12px', lineHeight: '1.4' }}>
						<div style={{ marginBottom: '5px' }}>
							Power Plants: <strong>{powerPlants.length}</strong>
						</div>
						<div style={{ marginBottom: '5px' }}>
							Fiber Routes: <strong>{fiberInfrastructure.length}</strong>
						</div>
						<div style={{ marginBottom: '5px' }}>
							Gas Pipelines: <strong>{gasInfrastructure.length}</strong>
						</div>
						<div style={{ marginBottom: '5px' }}>
							Total Capacity: <strong>
								{(powerPlants.reduce((sum, plant) => sum + (plant.output_mw || 0), 0) / 1000).toFixed(1)} GW
							</strong>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/styles/map.css

*File not found*


## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/pages/map/Map.scss

*File not found*


## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/PowerPlantProcessor.test.js

```javascript
// PowerPlantProcessor.test.js
import PowerPlantProcessor from './PowerPlantProcessor';

describe('PowerPlantProcessor', () => {
  describe('parseOutput', () => {
    it('should parse standard MW format', () => {
      expect(PowerPlantProcessor.parseOutput('1,234 MW')).toBe(1234);
    });

    it('should handle decimal values', () => {
      expect(PowerPlantProcessor.parseOutput('1,234.5 MW')).toBe(1234.5);
    });

    it('should return 0 for invalid input', () => {
      expect(PowerPlantProcessor.parseOutput('')).toBe(0);
      expect(PowerPlantProcessor.parseOutput(null)).toBe(0);
      expect(PowerPlantProcessor.parseOutput('invalid')).toBe(0);
    });
  });

  describe('categorizeSource', () => {
    it('should categorize nuclear power', () => {
      const result = PowerPlantProcessor.categorizeSource('nuclear');
      expect(result.type).toBe('nuclear');
      expect(result.color).toEqual([255, 100, 100]);
    });

    it('should categorize hydro power', () => {
      const result = PowerPlantProcessor.categorizeSource('hydro');
      expect(result.type).toBe('hydro');
      expect(result.color).toEqual([100, 150, 255]);
    });

    it('should default to other for unknown sources', () => {
      const result = PowerPlantProcessor.categorizeSource('unknown');
      expect(result.type).toBe('other');
      expect(result.color).toEqual([200, 150, 255]);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate coordinates within North America', () => {
      expect(PowerPlantProcessor.validateCoordinates(50, -100)).toBe(true);
    });

    it('should reject coordinates outside North America', () => {
      expect(PowerPlantProcessor.validateCoordinates(0, 0)).toBe(false);
      expect(PowerPlantProcessor.validateCoordinates(90, -100)).toBe(false);
    });
  });

  describe('processCSV', () => {
    it('should process valid CSV data', () => {
      const csvData = [
        {
          name: 'Test Plant',
          operator: 'Test Operator',
          output: '1,000 MW',
          source: 'nuclear',
          method: 'fission',
          wikidata_id: 'Q123456',
          latitude: '50.0',
          longitude: '-100.0'
        }
      ];

      const result = PowerPlantProcessor.processCSV(csvData);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Test Plant');
      expect(result[0].output).toBe(1000);
      expect(result[0].source).toBe('nuclear');
      expect(result[0].coordinates).toEqual([-100.0, 50.0]);
    });

    it('should skip invalid coordinates', () => {
      const csvData = [
        {
          name: 'Invalid Plant',
          operator: 'Test Operator',
          output: '1,000 MW',
          source: 'nuclear',
          method: 'fission',
          latitude: '0.0',
          longitude: '0.0' // Outside North America
        }
      ];

      const result = PowerPlantProcessor.processCSV(csvData);
      expect(result.length).toBe(0);
    });
  });
});
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/components/DataProcessing/CableProcessor.test.js

```javascript
// CableProcessor.test.js
import CableProcessor from './CableProcessor';

describe('CableProcessor', () => {
  describe('processSubmarineCables', () => {
    it('should process submarine cable data', () => {
      const geoJsonData = {
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Test Cable',
              length: 1000,
              capacity: '10 Gbps'
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [-123, 49],
                [-73, 40]
              ]
            }
          }
        ]
      };

      const result = CableProcessor.processSubmarineCables(geoJsonData);
      expect(result.cables).toHaveLength(1);
      expect(result.cables[0].name).toBe('Test Cable');
      expect(result.cables[0].length).toBe(1000);
      expect(result.landingPoints).toHaveLength(2);
    });
  });

  describe('isNorthAmericanCoordinate', () => {
    it('should identify North American coordinates', () => {
      expect(CableProcessor.isNorthAmericanCoordinate(50, -100)).toBe(true);
    });

    it('should reject non-North American coordinates', () => {
      expect(CableProcessor.isNorthAmericanCoordinate(0, 0)).toBe(false);
    });
  });
});
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/utils/dataUtils.test.js

```javascript
// dataUtils.test.js
import { calculateDistance, groupBy, calculatePowerPlantStats } from './dataUtils';

describe('dataUtils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Test with known distance (approximately 111 km for 1 degree of latitude)
      const coord1 = [0, 0];
      const coord2 = [0, 1];
      const distance = calculateDistance(coord1, coord2);
      expect(distance).toBeCloseTo(111, -1); // Within 10 km
    });
  });

  describe('groupBy', () => {
    it('should group items by property', () => {
      const data = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 }
      ];

      const grouped = groupBy(data, 'type');
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
    });
  });

  describe('calculatePowerPlantStats', () => {
    it('should calculate power plant statistics', () => {
      const powerPlants = [
        { output: 100, source: 'nuclear' },
        { output: 200, source: 'hydro' },
        { output: 150, source: 'nuclear' }
      ];

      const stats = calculatePowerPlantStats(powerPlants);
      expect(stats.plantCount).toBe(3);
      expect(stats.totalCapacity).toBe(450);
      expect(stats.sourceBreakdown.nuclear.count).toBe(2);
      expect(stats.sourceBreakdown.nuclear.capacity).toBe(250);
      expect(stats.sourceBreakdown.hydro.count).toBe(1);
      expect(stats.sourceBreakdown.hydro.capacity).toBe(200);
    });
  });
});
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/postcss.config.js

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		postcss: './postcss.config.js',
	},
	server: {
		port: 9725,
		host: true,
		proxy: {
			'/itu-proxy': {
				target: 'https://bbmaps.itu.int',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/itu-proxy/, ''),
				secure: false
			}
		}
	},
})
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/main.tsx

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routes.tsx'
import { RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'

createRoot(document.getElementById('root')!).render(
	<StrictMode>

<Helmet>
				<meta charSet="utf-8" />
				<title>Helios | Monopolizing Optimal AI Territory</title>
			</Helmet>
		<RouterProvider router={router} />
	</StrictMode>,
)
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/App.tsx

```typescript
import './App.css'
import { Outlet } from 'react-router-dom'

export function App() {

	return (
		<>
			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<header className="bg-white shadow-sm">
					<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold text-gray-900">Helios Infrastructure Visualization</h1>
						<p className="mt-2 text-gray-600">Interactive visualization of North American energy infrastructure</p>
					</div>
				</header>

				{/* Navigation */}
				<nav className="bg-gray-100 border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-wrap space-x-8 py-4">
							<a 
								href="/" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								Home
							</a>
							<a 
								href="/map" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Existing Map
								<span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Basic</span>
							</a>
							<a 
								href="/map-leaflet" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Leaflet Map
								<span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Interactive</span>
							</a>
							<a 
								href="/map-deckgl" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Deck.gl Map
								<span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Advanced</span>
							</a>
							<a 
								href="/map-deckgl-simple" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Simple Deck.gl
								<span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Demo</span>
							</a>
							<a 
								href="/test-styling" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
								</svg>
								Test Styling
								<span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Debug</span>
							</a>
						</div>
					</div>
				</nav>

				{/* Main Content */}
				<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Available Maps</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-blue-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Existing Map</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Traditional map implementation with basic features</p>
								<a 
									href="/map" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 mt-auto"
								>
									View Map
								</a>
							</div>
							
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-green-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Leaflet Implementation</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Interactive map using Leaflet.js library with enhanced features</p>
								<a 
									href="/map-leaflet" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 mt-auto"
								>
									View Map
								</a>
							</div>
							
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-purple-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Deck.gl Implementation</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Advanced WebGL-powered visualization with 3D capabilities</p>
								<a 
									href="/map-deckgl" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 mt-auto"
								>
									View Map
								</a>
							</div>
							
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-yellow-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Simple Deck.gl Demo</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Simplified version of the Deck.gl implementation for learning</p>
								<a 
									href="/map-deckgl-simple" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 mt-auto"
								>
									View Demo
								</a>
							</div>
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-yellow-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Test Styling</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Debug page to verify Tailwind CSS is working correctly</p>
								<a 
									href="/test-styling" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 mt-auto"
								>
									View Test
								</a>
							</div>
						</div>
					</div>
				</main>
			</div>
			<Outlet/>
		</>
	)
}

export default App
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/routes.tsx

```typescript
import { createBrowserRouter } from "react-router-dom";
import MapPage from "./pages/map/MapPage";
import App from "./App";
import { MapLeafletPage } from "./pages/map/MapLeafletPage";
import DeckGLDemoPage from "./pages/map/DeckGLDemoPage";
import SimpleDeckGLDemoPage from "./pages/map/SimpleDeckGLDemoPage";
import TestStyling from "./TestStyling";
import TestTailwind from "./test-tailwind";
import TailwindTest from "./TailwindTest";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <div>Home</div>
			},
			{
				path: "/map",
				element: <MapPage />
			},
			{
				path: "/map-leaflet",
				element: <MapLeafletPage />
			},
			{
				path: "/map-deckgl",
				element: <DeckGLDemoPage />
			},
			{
				path: "/map-deckgl-simple",
				element: <SimpleDeckGLDemoPage />
			},
			{
				path: "/test-styling",
				element: <TestStyling />
			},
			{
				path: "/test-tailwind",
				element: <TestTailwind />
			},
			{
				path: "/tailwind-test",
				element: <TailwindTest />
			}
		]
	}
])
```

## /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
	margin: 0;
	padding: 0;
	height: 100%;
	width: 100%;

	font-family: "IBM Plex Sans", sans-serif;
	font-optical-sizing: auto;
	font-style: normal;
	font-variation-settings:
	  "wdth" 100;
}
```