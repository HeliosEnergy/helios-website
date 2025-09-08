import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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
