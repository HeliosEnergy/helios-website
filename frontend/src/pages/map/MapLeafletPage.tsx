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