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