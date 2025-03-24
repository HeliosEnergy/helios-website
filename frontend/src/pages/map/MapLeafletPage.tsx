import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the power plant data interface
interface PowerPlant {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	fuel_type: string;
	nameplate_capacity_mw: number;
	net_summer_capacity_mw?: number;
	net_winter_capacity_mw?: number;
	operating_status: string;
	county?: string;
	state?: string;
	last_updated?: string;
}

// Define colors for different fuel types based on energy source code
const fuelTypeColors: {[key: string]: string} = {
	'SUN': '#FFD700',   // Solar - Gold
	'WND': '#87CEEB',   // Wind - Sky Blue
	'BIT': '#A9A9A9',   // Bituminous Coal - Dark Gray
	'SUB': '#A9A9A9',   // Subbituminous Coal - Dark Gray
	'LIG': '#A9A9A9',   // Lignite Coal - Dark Gray
	'NG': '#d9ff33',    // Natural Gas - Steel Blue
	'DFO': '#000000',   // Distillate Fuel Oil - Black
	'WAT': '#001fff',   // Water/Hydro - Dodger Blue
	'GEO': '#8B4513',   // Geothermal - Saddle Brown
	'LFG': '#228B22',   // Landfill Gas - Forest Green
	'WDS': '#228B22',   // Wood Waste Solids - Forest Green
	'NUC': '#4eff33',   // Nuclear - Lime Green
	'OTHER': '#FFFFFF', // Other - Gray
};

// Map for fuel type display names
const fuelTypeDisplayNames: {[key: string]: string} = {
	'SUN': 'Solar',
	'WND': 'Wind',
	'BIT': 'Bituminous Coal',
	'SUB': 'Subbituminous Coal',
	'LIG': 'Lignite Coal',
	'NG': 'Natural Gas',
	'DFO': 'Fuel Oil',
	'WAT': 'Hydro',
	'GEO': 'Geothermal',
	'LFG': 'Landfill Gas',
	'WDS': 'Wood/Biomass',
	'NUC': 'Nuclear',
};

// Map for operating status display names
const operatingStatusDisplayNames: {[key: string]: string} = {
	'OP': 'Operating',
	'SB': 'Standby/Backup',
	'OS': 'Out of Service',
	'RE': 'Retired',
};

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
		showSummerCapacity: true,
		sizeMultiplier: 15,
		capacityWeight: 1.0
	});
	
	// Configuration state for filter parameters
	const [filterParams, setFilterParams] = useState({
		filters: {
			fuel_type: null as string | null,
			state: null as string[] | null,
			operating_status: null as string | null,
			min_capacity: null as number | null,
			max_capacity: null as number | null
		}
	});
	
	// Default map location (center of US)
	const defaultPosition: [number, number] = [39.8283, -98.5795];
	
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
						capacityWeight: event.data.capacityWeight
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
		return `
			<div>
				<h3>${plant.name}</h3>
				<p><strong>ID:</strong> ${plant.id}</p>
				<p><strong>Location:</strong> ${plant.county ? `${plant.county} County, ` : ''}${plant.state || ''}</p>
				<p><strong>Coordinates:</strong>
					<!--${plant.latitude.toFixed(6)}, ${plant.longitude.toFixed(6)}-->
					<a href="https://www.google.com/maps?q=${plant.latitude},${plant.longitude}" target="_blank" rel="noopener noreferrer">
						View on Google Maps
					</a>
				</p>
				<p><strong>Fuel Type:</strong> ${plant.fuel_type ? (fuelTypeDisplayNames[plant.fuel_type] || plant.fuel_type) : 'Unknown'}</p>
				<p><strong>Capacity:</strong> ${
					visualParams.showSummerCapacity && plant.net_summer_capacity_mw 
						? `${plant.net_summer_capacity_mw} MW (Summer)` 
						: plant.nameplate_capacity_mw 
							? `${plant.nameplate_capacity_mw} MW` 
							: 'Unknown'
				}</p>
				<p><strong>Status:</strong> ${plant.operating_status ? (operatingStatusDisplayNames[plant.operating_status] || plant.operating_status) : 'Unknown'}</p>
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
}, null, 2)}
					</pre>
				</details>
			</div>
		`;
	}
	
	// Fetch power plant data from the API when filters change
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				// Build query string from filters
				const queryParams = new URLSearchParams();
				const filters = filterParams.filters;
				
				if (filters.fuel_type) queryParams.append('fuel_type', filters.fuel_type);
				
				// Handle state array
				if (filters.state && Array.isArray(filters.state)) {
					filters.state.forEach(stateCode => {
						queryParams.append('state', stateCode);
					});
				}
				
				if (filters.operating_status) queryParams.append('operating_status', filters.operating_status);
				if (filters.min_capacity !== null) queryParams.append('min_capacity', filters.min_capacity.toString());
				if (filters.max_capacity !== null) queryParams.append('max_capacity', filters.max_capacity.toString());
				
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
	}, [filterParams.filters]);
	
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
	
	// Update markers when power plants data changes
	useEffect(() => {
		if (!mapInstanceRef.current || !markersLayerRef.current || isLoading) return;
		
		const map = mapInstanceRef.current;
		const markersLayer = markersLayerRef.current;
		const zoomLevel = map.getZoom();
		
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
		
		// Add or update markers
		powerPlants.forEach(plant => {
			// Skip plants without valid coordinates
			if (!plant.latitude || !plant.longitude) return;
			
			// Get color based on fuel type
			const color = plant.fuel_type && fuelTypeColors[plant.fuel_type] 
				? fuelTypeColors[plant.fuel_type] 
				: '#3388ff';
			
			// Calculate radius based on capacity
			const radius = plant.nameplate_capacity_mw 
				? getRadiusByCapacity(
						plant.nameplate_capacity_mw, 
						zoomLevel, 
						visualParams.sizeMultiplier, 
						visualParams.capacityWeight
					)
				: Math.max(1, zoomLevel - 3) * visualParams.sizeMultiplier / 15;
			
			const existingMarker = markerRefs.current.get(plant.id);
			
			if (existingMarker) {
				// Update existing marker
				existingMarker.setRadius(radius);
				existingMarker.setLatLng([plant.latitude, plant.longitude]);
				existingMarker.setStyle({
					fillColor: color,
					color: '#000',
					weight: 2,
					opacity: 1,
					fillOpacity: 0.8
				});
				
				// Update popup
				existingMarker.unbindPopup();
				existingMarker.bindPopup(createPopupContent(plant));
			} else {
				// Create new marker
				const circleMarker = L.circleMarker([plant.latitude, plant.longitude], {
					radius: radius,
					fillColor: color,
					color: '#000',
					weight: 2,
					opacity: 1,
					fillOpacity: 0.8
				});
				
				// Store plant ID on marker for future reference
				(circleMarker as any)._plantId = plant.id;
				
				// Bind popup
				circleMarker.bindPopup(createPopupContent(plant));
				
				// Add to layer and reference map
				markersLayer.addLayer(circleMarker);
				markerRefs.current.set(plant.id, circleMarker);
			}
		});
	}, [powerPlants, isLoading]);
	
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