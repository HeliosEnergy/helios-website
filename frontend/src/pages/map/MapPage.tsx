import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { LatLngExpression } from "leaflet";
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css'; // Make sure this is imported
import React from 'react';
import { Helmet } from 'react-helmet';

const MapLeftSidebar = React.lazy(() => import('./components/MapLeftSidebar'));

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

// Add this new component to track zoom level
function ZoomLevelTracker({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) {
	const map = useMap();
	
	useEffect(() => {
		// Set initial zoom level
		setZoomLevel(map.getZoom());
		
		// Update zoom level on zoom events
		const onZoom = () => {
			setZoomLevel(map.getZoom());
		};
		
		map.on('zoom', onZoom);
		
		return () => {
			map.off('zoom', onZoom);
		};
	}, [map, setZoomLevel]);
	
	return null;
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
	'BLQ': '#228B22',   // Black Liquor - Forest Green
	'NUC': '#4eff33',   // Nuclear - Lime Green
	'MSW': '#996836',   // Municipal Solid Waste - Forest Green
	'MWH': '#996836',   // Municipal Waste Heat - Forest Green
	'OBS': '#996836',   // Other Biomass - Forest Green
	'OBG': '#33fc00',   // Other Gas - Forest Green
	'WH': '#fc7f00',   // Waste Heat - Forest Green
	'OG': '#33fc00',   // Other Gas - Forest Green
	'WDL': '#ead6b2',   // Waste to Liquids - Forest Green
	'RC': '#c86e33',   // Refuse Combustion - Forest Green
	'SGC': '#ffc000',   // Solar Thermal - Forest Green
	'RFO': '#000000',   // Residual Fuel Oil - Forest Green
	'PC': '#000000',   // Petroleum Coke - Forest Green
	'OTHER': '#FFFFFF', // Other - Gray
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
	'NUC': 'Nuclear',
	'MSW': 'Municipal Solid Waste',
	'MWH': 'Municipal Waste Heat',
	'OBS': 'Other Biomass',
	'OBG': 'Other Gas',
	'WH': 'Waste Heat',
	'OG': 'Other Gas',
	'WDL': 'Waste to Liquids',
	'RC': 'Refuse Combustion',
	'SGC': 'Solar Thermal',
	'RFO': 'Residual Fuel Oil',
	'OTHER': 'Other',
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

// Function to calculate radius based on capacity and zoom level
const getRadiusByCapacity = (capacity: number, zoomLevel: number, scaleFactor: number, sizeMultiplier: number, capacityWeight: number) => {
	const zoomBaseFactor = Math.pow(1.5, zoomLevel);
	const zoomCapacityFactor = Math.pow(1.75, zoomLevel);
	console.log("ZOOM FACTOR:", zoomBaseFactor, zoomLevel);

	const baseRadius = Math.pow(2, scaleFactor) * zoomBaseFactor;
	const capacityComponent = Math.pow((capacity || 0.2) / 100, 0.75) * zoomCapacityFactor * capacityWeight; 
	return ((baseRadius + capacityComponent) * sizeMultiplier) / 100;
};

export default function MapPage() {
	const [position] = useState<LatLngExpression>([37.7749, -122.4194]);
	const [leftPanelOpen, setLeftPanelOpen] = useState(false);
	const [mapKey, setMapKey] = useState(0);
	
	// Add state for summer/winter capacity toggle
	const [showSummerCapacity, setShowSummerCapacity] = useState(true);
	
	// Add state for circle size multiplier (default to 15x)
	const [sizeMultiplier, setSizeMultiplier] = useState(15);
	
	// Add state for capacity weight factor (default to 1.0)
	const [capacityWeight, setCapacityWeight] = useState(1.0);

	// Add states for power plant data
	const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Add state for filters
	const [filters, setFilters] = useState({
		fuel_type: null as string | null,
		state: null as string[] | null,
		operating_status: null as string | null,
		min_capacity: null as number | null,
		max_capacity: null as number | null
	});
	
	// Add zoom level state
	const [zoomLevel, setZoomLevel] = useState(5); // Default zoom level
	
	// Add this state to track which popup is currently open
	const [openPopupId, setOpenPopupId] = useState<number | null>(null);
	
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
							filters={filters}
							setFilters={setFilters}
						/>
					) : (
						<button>{'>'}</button>
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
					zoom={5}
					scrollWheelZoom={true} 
					zoomControl={true}
					style={{ height: "100%", width: "100%" }}
				>
					<MapUpdater />
					<ZoomLevelTracker setZoomLevel={setZoomLevel} />
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
						
						// Use fuel type color from the map, or default to blue if fuel_type is missing
						const color = plant.fuel_type && fuelTypeColors[plant.fuel_type] 
							? fuelTypeColors[plant.fuel_type] 
							: '#3388ff'; // Default blue color
						
						// Use nameplate capacity for sizing, now including zoom level and capacity weight
						const radius = plant.nameplate_capacity_mw 
							? getRadiusByCapacity(plant.nameplate_capacity_mw, zoomLevel, 0.5, sizeMultiplier, capacityWeight)
							: Math.max(1, zoomLevel - 3) * sizeMultiplier / 15;
						
						return (
							<CircleMarker 
								key={plant.id}
								center={[plant.latitude, plant.longitude]}
								radius={radius}
								fillColor={color}
								color="#000"
								weight={2}
								opacity={1}
								fillOpacity={0.8}
								eventHandlers={{
									popupopen: () => setOpenPopupId(plant.id),
									popupclose: () => setOpenPopupId(null)
								}}
							>
								<Popup minWidth={200} maxWidth={300} autoPan={false}>
									<div>
										<h3>{plant.name}</h3>
										<p><strong>ID:</strong> {plant.id}</p>
										<p><strong>Location:</strong> {plant.county ? `${plant.county} County, ` : ''}{plant.state || ''}</p>
										<p><strong>Fuel Type:</strong> {plant.fuel_type ? (fuelTypeDisplayNames[plant.fuel_type as keyof typeof fuelTypeDisplayNames] || plant.fuel_type) : 'Unknown'}</p>
										<p><strong>Capacity:</strong> {plant.nameplate_capacity_mw ? `${plant.nameplate_capacity_mw} MW` : 'Unknown'}</p>
										<p><strong>Status:</strong> {plant.operating_status ? (operatingStatusDisplayNames[plant.operating_status as keyof typeof operatingStatusDisplayNames] || plant.operating_status) : 'Unknown'}</p>
										
										{/* Only render detail content when popup is open */}
										{openPopupId === plant.id && (
											<>
												<hr />
												<details>
													<summary>Debug Info</summary>
													<pre style={{maxHeight: '150px', overflow: 'auto'}}>
														{JSON.stringify({
															id: plant.id,
															name: plant.name,
															coordinates: [plant.latitude, plant.longitude],
															fuel_type: plant.fuel_type,
															capacity: plant.nameplate_capacity_mw,
															status: plant.operating_status,
														}, null, 2)}
													</pre>
												</details>
											</>
										)}
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
