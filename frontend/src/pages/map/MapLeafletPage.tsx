import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fuelTypeColors, fuelTypeDisplayNames, operatingStatusDisplayNames, MapColorings, DEFAULT_SHOW_SUMMER_CAPACITY, DEFAULT_SIZE_MULTIPLIER, DEFAULT_CAPACITY_WEIGHT, DEFAULT_COLORING_MODE, operatingStatusColors } from './MapValueMappings';

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
interface PowerPlant {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	fuel_type: keyof typeof fuelTypeDisplayNames;
	nameplate_capacity_mw: number;
	net_summer_capacity_mw?: number;
	net_winter_capacity_mw?: number;
	operating_status: keyof typeof operatingStatusDisplayNames;
	county?: string;
	state?: string;
	last_updated?: string;
	capacity_factor?: number;
	// Add generation data
	generation?: {
		id: number;
		period: string;
		generation: number;
		generation_units: string;
		consumption_for_eg: number;
		consumption_for_eg_units: string;
		total_consumption: number;
		total_consumption_units: string;
		timestamp: string;
		metadata: any;
	};
}

// Define colors for different fuel types based on energy source code
 

// Function to calculate radius based on capacity and zoom level
const getRadiusByCapacity = (capacity: number, zoomLevel: number, sizeMultiplier: number, capacityWeight: number) => {
	const zoomBaseFactor = Math.pow(1.5, zoomLevel);
	const zoomCapacityFactor = Math.pow(1.75, zoomLevel);

	const baseRadius = Math.pow(2, 0.5) * zoomBaseFactor;
	const capacityComponent = Math.pow((capacity || 0.2) / 100, 0.75) * zoomCapacityFactor * capacityWeight; 
	return ((baseRadius + capacityComponent) * sizeMultiplier) / 100;
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

export function MapLeafletPage() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);
	const markersLayerRef = useRef<L.LayerGroup | null>(null);
	const markerRefs = useRef<Map<number, L.CircleMarker>>(new Map());
	
	// Add states for power plant data
	const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// Configuration state for visual parameters
	const [visualParams, setVisualParams] = useState({
		showSummerCapacity: DEFAULT_SHOW_SUMMER_CAPACITY,
		sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
		capacityWeight: DEFAULT_CAPACITY_WEIGHT,
		coloringMode: DEFAULT_COLORING_MODE
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
				// Return dark gray for N/A capacity factors when coloring by capacity factor is enabled
				return 'darkgrey';
			}
			
			// Round to nearest 5 to use from map or compute directly if needed
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
						coloringMode: event.data.coloringMode || "fuelType"
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
	
	// Function to create popup content
	function createPopupContent(plant: PowerPlant) {
		// Format generation date if available
		const generationDate = plant.generation?.timestamp 
			? new Date(plant.generation.timestamp).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
			: null;
		
		return `
			<div style="color: black;">
				<h3>${plant.name}</h3>
				<p><strong>ID:</strong> ${plant.id}</p>
				<p><strong>Location:</strong> ${plant.county ? `${plant.county} County, ` : ''}${plant.state || ''}</p>
				<p><strong>Coordinates:</strong>
					<!--${plant.latitude.toFixed(6)}, ${plant.longitude.toFixed(6)}-->
					<a href="https://www.google.com/maps?q=${plant.latitude},${plant.longitude}" target="_blank" rel="noopener noreferrer">
						View on Google Maps
					</a>
				</p>
				<p><strong>Fuel Type:</strong> ${plant.fuel_type ? (fuelTypeDisplayNames[plant.fuel_type as keyof typeof fuelTypeDisplayNames] || plant.fuel_type) : 'Unknown'}</p>
				<p><strong>Capacity:</strong> ${
					visualParams.showSummerCapacity && plant.net_summer_capacity_mw 
						? `${plant.net_summer_capacity_mw} MW (Summer)` 
						: plant.nameplate_capacity_mw 
							? `${plant.nameplate_capacity_mw} MW` 
							: 'Unknown'
				}</p>
				<p><strong>Status:</strong> ${plant.operating_status ? (operatingStatusDisplayNames[plant.operating_status] || plant.operating_status) : 'Unknown'}</p>
				<p><strong>Capacity Factor:</strong> ${plant.capacity_factor ? 
					`<span style="background-color: black; padding-left: 4px; padding-right: 4px; color: ${getCapacityFactorColor(plant.capacity_factor, filterParams.filters.max_capacity_factor)}; font-weight: bold;">${plant.capacity_factor.toFixed(1)}%</span>` 
					: 'N/A'}</p>
				
				${plant.generation ? `
				<hr />
				<h4>Latest Generation Data (${generationDate || 'Unknown Date'})</h4>
				<p><strong>Generation:</strong> ${plant.generation.generation ? `${plant.generation.generation.toLocaleString()} ${plant.generation.generation_units || ''}` : 'N/A'}</p>
				${plant.generation.consumption_for_eg ? `
				<p><strong>Consumption:</strong> ${plant.generation.consumption_for_eg.toLocaleString()} ${plant.generation.consumption_for_eg_units || ''}</p>
				` : ''}${plant.generation.total_consumption ? `
				<p><strong>Total Consumption:</strong> ${plant.generation.total_consumption.toLocaleString()} ${plant.generation.total_consumption_units || ''}</p>
				` : ''}
				` : ''}
				
				<hr />
				<details>
					<summary>Debug Info</summary>
					<pre style="max-height: 150px; overflow: auto;">
${JSON.stringify({
	id: plant.id,
	name: plant.name,
	coordinates: [plant.latitude, plant.longitude],
	fuel_type: plant.fuel_type,
	capacity: plant.nameplate_capacity_mw,
	status: plant.operating_status,
	capacity_factor: plant.capacity_factor,
	generation: plant.generation ? {
		period: plant.generation.period,
		amount: plant.generation.generation,
		units: plant.generation.generation_units,
		timestamp: plant.generation.timestamp
	} : null
}, null, 2)}
					</pre>
				</details>
			</div>
		`;
	}
	
	// Fetch power plant data from the API when debounced filters change
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				// Build query string from filters
				const queryParams = new URLSearchParams();
				const filters = debouncedFilters;
				
				// Handle fuel_type array - join with commas for the API
				if (filters.fuel_type && Array.isArray(filters.fuel_type) && filters.fuel_type.length > 0) {
					queryParams.append('fuel_type', filters.fuel_type.join(','));
				}
				
				// Handle state array
				if (filters.state && Array.isArray(filters.state)) {
					filters.state.forEach(stateCode => {
						queryParams.append('state', stateCode);
					});
				}
				
				// Handle operating_status array - join with commas for the API
				if (filters.operating_status && Array.isArray(filters.operating_status) && filters.operating_status.length > 0) {
					queryParams.append('operating_status', filters.operating_status.join(','));
				}
				
				if (filters.min_capacity !== null) queryParams.append('min_capacity', filters.min_capacity.toString());
				if (filters.max_capacity !== null) queryParams.append('max_capacity', filters.max_capacity.toString());
				if (filters.min_capacity_factor !== null) queryParams.append('min_capacity_factor', filters.min_capacity_factor.toString());
				if (filters.max_capacity_factor !== null) queryParams.append('max_capacity_factor', filters.max_capacity_factor.toString());
				
				// Get API URL from environment variable or use default
				const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
				if (!API_SERVER_URL) {
					throw new Error('API_SERVER_URL is not defined');
				}
				const url = `${API_SERVER_URL}/api/map_data/power_plants?${queryParams.toString()}`;
				
				const response = await fetch(url);
				
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}
				
				const data = await response.json();
				
				if (data.success && Array.isArray(data.data)) {
					console.log(`Loaded ${data.data.length} power plants`);
					setPowerPlants(data.data);
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
		const processNextBatch = () => {
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
					const radius = plant.nameplate_capacity_mw 
						? getRadiusByCapacity(
								plant.nameplate_capacity_mw, 
								zoomLevel, 
								visualParams.sizeMultiplier, 
								visualParams.capacityWeight
							)
						: Math.max(1, zoomLevel - 3) * visualParams.sizeMultiplier / 15;
					
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
					
					// Bind popup
					circleMarker.bindPopup(createPopupContent(plant));
					
					newMarkersInBatch.push(circleMarker);
					markerRefs.current.set(plant.id, circleMarker);
				}
			}
			
			// Update markers in this batch
			markersToUpdateInBatch.forEach(([marker, plant]) => {
				// Get color using optimized function
				const color = getPlantColor(plant, visualParams.coloringMode);
				
				// Calculate radius based on capacity
				const radius = plant.nameplate_capacity_mw 
					? getRadiusByCapacity(
							plant.nameplate_capacity_mw, 
							zoomLevel, 
							visualParams.sizeMultiplier, 
							visualParams.capacityWeight
						)
					: Math.max(1, zoomLevel - 3) * visualParams.sizeMultiplier / 15;
				
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
				
				// Update popup
				marker.unbindPopup();
				marker.bindPopup(createPopupContent(plant));
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
	
	// Update marker sizes when visual parameters change
	useEffect(() => {
		if (!mapInstanceRef.current || !markersLayerRef.current) return;
		
		const map = mapInstanceRef.current;
		const zoomLevel = map.getZoom();
		
		// Update all existing markers
		markerRefs.current.forEach((marker, plantId) => {
			const plant = powerPlants.find(p => p.id === plantId);
			if (plant && plant.nameplate_capacity_mw) {
				const newRadius = getRadiusByCapacity(
					plant.nameplate_capacity_mw,
					zoomLevel,
					visualParams.sizeMultiplier,
					visualParams.capacityWeight
				);
				marker.setRadius(newRadius);
				
				// Update popup content for summer capacity changes
				marker.unbindPopup();
				marker.bindPopup(createPopupContent(plant));
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
				if (plant && plant.nameplate_capacity_mw) {
					const newRadius = getRadiusByCapacity(
						plant.nameplate_capacity_mw,
						newZoomLevel,
						visualParams.sizeMultiplier,
						visualParams.capacityWeight
					);
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
			{isLoading && !powerPlants.length && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
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