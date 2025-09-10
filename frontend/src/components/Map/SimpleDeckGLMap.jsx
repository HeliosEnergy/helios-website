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
      style: 'mapbox://styles/mapbox/dark-v10',
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
    getLineColor: [255, 255, 255]
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