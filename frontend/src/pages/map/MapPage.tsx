import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { LatLngExpression } from "leaflet";
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css'; // Make sure this is imported
import { MapLeftSidebar } from './components/MapLeftSidebar';

const leftSideBarClosedWidth = 32;
const leftSideBarOpenWidth = 300;
const rightSideBarClosedWidth = 32;
const rightSideBarOpenWidth = 300;

// This component forces the map to recalculate dimensions after mounting
function MapUpdater() {
	const map = useMap();
	
	useEffect(() => {
		// Immediately invalidate size
		map.invalidateSize();
		
		// Also invalidate after a short delay to be sure
		const timer = setTimeout(() => {
			map.invalidateSize();
		}, 300);
		
		return () => clearTimeout(timer);
	}, [map]);
	
	return null;
}

// Define colors for different fuel types based on energy source code
const fuelTypeColors: {[key: string]: string} = {
	'SUN': '#FFD700',   // Solar - Gold
	'WND': '#87CEEB',   // Wind - Sky Blue
	'BIT': '#A9A9A9',   // Bituminous Coal - Dark Gray
	'SUB': '#A9A9A9',   // Subbituminous Coal - Dark Gray
	'LIG': '#A9A9A9',   // Lignite Coal - Dark Gray
	'NG': '#4682B4',    // Natural Gas - Steel Blue
	'DFO': '#000000',   // Distillate Fuel Oil - Black
	'WAT': '#1E90FF',   // Water/Hydro - Dodger Blue
	'GEO': '#8B4513',   // Geothermal - Saddle Brown
	'LFG': '#228B22',   // Landfill Gas - Forest Green
	'WDS': '#228B22',   // Wood Waste Solids - Forest Green
	'BLQ': '#228B22',   // Black Liquor - Forest Green
	'OTHER': '#808080', // Other - Gray
};

// Map for fuel type display names
const fuelTypeDisplayNames = {
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
	'BLQ': 'Black Liquor',
};

// Map for operating status display names
const operatingStatusDisplayNames = {
	'OP': 'Operating',
	'SB': 'Standby/Backup',
	'OS': 'Out of Service',
	'RE': 'Retired',
};

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

// Function to calculate radius based on capacity
const getRadiusByCapacity = (capacity: number, scaleFactor: number = 0.05, sizeMultiplier: number = 15) => {
	// Base minimum radius
	const baseRadius = 5;
	// Scale factor - adjust this to get appropriate circle sizes
	// Apply the size multiplier to scale the circles
	return (baseRadius + Math.sqrt(capacity || 1) * scaleFactor) * sizeMultiplier;
};

export default function MapPage() {
	const [position] = useState<LatLngExpression>([37.7749, -122.4194]);
	const [leftPanelOpen, setLeftPanelOpen] = useState(false);
	const [mapKey, setMapKey] = useState(0);
	
	// Add state for summer/winter capacity toggle
	const [showSummerCapacity, setShowSummerCapacity] = useState(true);
	
	// Add state for circle size multiplier (default to 15x)
	const [sizeMultiplier, setSizeMultiplier] = useState(15);

	// Add states for power plant data
	const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// Add state for filters
	const [filters, setFilters] = useState({
		fuel_type: null as string | null,
		state: null as string | null,
		operating_status: null as string | null,
		min_capacity: null as number | null,
		max_capacity: null as number | null
	});
	
	// Force remount of map component once 
	useEffect(() => {
		// Force a remount of the map after a short delay
		const timer = setTimeout(() => {
			setMapKey(prev => prev + 1);
		}, 100);
		
		return () => clearTimeout(timer);
	}, []);
	
	// Fetch power plant data from the API
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				// Build query string from filters
				const queryParams = new URLSearchParams();
				if (filters.fuel_type) queryParams.append('fuel_type', filters.fuel_type);
				if (filters.state) queryParams.append('state', filters.state);
				if (filters.operating_status) queryParams.append('operating_status', filters.operating_status);
				if (filters.min_capacity !== null) queryParams.append('min_capacity', filters.min_capacity.toString());
				if (filters.max_capacity !== null) queryParams.append('max_capacity', filters.max_capacity.toString());
				
				// Get API URL from environment variable or use default
				const API_SERVER_URL = import.meta.env.API_SERVER_URL || 'http://localhost:4777';
				const url = `${API_SERVER_URL}/api/map_data/power_plants?${queryParams.toString()}`;
				
				const response = await fetch(url);
				
				if (!response.ok) {
					throw new Error(`API request failed with status ${response.status}`);
				}
				
				const data = await response.json();
				
				if (data.success && Array.isArray(data.data)) {
					// Log the first item to see what fields are available
					if (data.data.length > 0) {
						console.log("First plant data sample:", data.data[0]);
					}
					setPowerPlants(data.data);
				} else {
					throw new Error('Invalid response format from API');
				}
			} catch (err) {
				console.error('Error fetching power plant data:', err);
				setError(err instanceof Error ? err.message : 'Unknown error occurred');
				// Keep showing the previous data if available, or set empty array
				setPowerPlants(prev => prev.length > 0 ? prev : []);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchData();
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
			}}>
				{
					leftPanelOpen ? (
						<MapLeftSidebar 
							open={leftPanelOpen} 
							setOpen={setLeftPanelOpen}
							showSummerCapacity={showSummerCapacity}
							setShowSummerCapacity={setShowSummerCapacity}
							sizeMultiplier={sizeMultiplier}
							setSizeMultiplier={setSizeMultiplier}
							filters={filters}
							setFilters={setFilters}
						/>
					) : (
						<button onClick={() => setLeftPanelOpen(!leftPanelOpen)}>{'>'}</button>
					)
				}
			</div>

			<div style={{ 
				position: "absolute",
				top: 0,
				left: leftPanelOpen ? leftSideBarOpenWidth : leftSideBarClosedWidth,
				right: 0,
				bottom: 0
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
				
				<MapContainer 
					key={mapKey}
					center={position} 
					zoom={5} // Change to a lower zoom level to show more of the map
					scrollWheelZoom={true} 
					zoomControl={true}
					style={{ height: "100%", width: "100%" }}
				>
					<MapUpdater />
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					
					{/* Render power plants as circles */}
					{powerPlants.map(plant => {
						// Skip plants without valid coordinates
						if (!plant.latitude || !plant.longitude) {
							return null;
						}
						
						// Set a default color since fuel_type seems to be missing
						const defaultColor = '#3388ff'; // A nice blue as default
						
						// Use a fixed radius since capacity data might be missing
						const radius = plant.nameplate_capacity_mw 
							? getRadiusByCapacity(plant.nameplate_capacity_mw, 0.05, sizeMultiplier)
							: 10 * sizeMultiplier / 15; // Default 10px radius scaled by multiplier
						
						return (
							<CircleMarker 
								key={plant.id}
								center={[plant.latitude, plant.longitude]}
								radius={radius}
								fillColor={defaultColor}
								color="#000"
								weight={2}
								opacity={1}
								fillOpacity={0.8}
							>
								<Popup>
									<div>
										<h3>{plant.name}</h3>
										<p><strong>ID:</strong> {plant.id}</p>
										<p><strong>Location:</strong> {plant.county ? `${plant.county} County, ` : ''}{plant.state || ''}</p>
										<p><strong>Coordinates:</strong> {plant.latitude}, {plant.longitude}</p>
										
										{/* Show all available fields for debugging */}
										<hr />
										<details>
											<summary>Debug Info</summary>
											<pre style={{maxHeight: '150px', overflow: 'auto'}}>
												{JSON.stringify(plant, null, 2)}
											</pre>
										</details>
									</div>
								</Popup>
							</CircleMarker>
						);
					})}
				</MapContainer>
			</div>
		</div>
	);
}
