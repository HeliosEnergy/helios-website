// DeckGLMap.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import { MapView } from '@deck.gl/core';
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
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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
  
  // Reference for the map container
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add fullscreen control
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    mapRef.current = map;

    // Handle map load error
    map.on('error', (e) => {
      console.error('Mapbox error:', e);
      setError('Failed to load map background');
    });

    // Clean up
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Update map when view state changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter([viewState.longitude, viewState.latitude]);
      mapRef.current.setZoom(viewState.zoom);
      mapRef.current.setPitch(viewState.pitch);
      mapRef.current.setBearing(viewState.bearing);
    }
  }, [viewState]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
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
        setError('Failed to load map data');
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
      getLineColor: [255, 255, 255],
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
      getColor: d => getInfrastructureColor('submarine'),
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
      getFillColor: d => getInfrastructureColor('landingPoint'),
      getLineColor: [255, 255, 255],
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
      getColor: d => getInfrastructureColor('terrestrial'),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading map data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* DeckGL layers */}
      <DeckGL
        initialViewState={viewState}
        controller={true}
        onViewStateChange={handleViewStateChange}
        layers={layers}
        views={new MapView({ id: 'main' })}
      />
      
      {/* Layer Controls */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <LayerControls
          layers={layerVisibility}
          onToggle={handleLayerToggle}
        />
      </div>
      
      {/* Filter Panel */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg w-80">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          powerPlants={powerPlants}
        />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <Legend />
      </div>
      
      {/* Stats Dashboard */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg w-80">
        <StatsDashboard
          powerPlants={powerPlants}
          cables={cables}
          terrestrialLinks={terrestrialLinks}
        />
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
      
      {/* View Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-90 p-2 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleViewChange('northAmerica')}
          >
            North America
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleViewChange('canada')}
          >
            Canada
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleViewChange('easternCanada')}
          >
            Eastern Canada
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckGLMap;