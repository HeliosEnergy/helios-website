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

// Define colors for different fuel types
const fuelTypeColors = {
	'SOLAR': '#FFD700', // Gold
	'WIND': '#87CEEB', // Sky Blue
	'COAL': '#A9A9A9', // Dark Gray
	'NATURAL GAS': '#4682B4', // Steel Blue
	'NUCLEAR': '#FF6347', // Tomato
	'HYDRO': '#1E90FF', // Dodger Blue
	'GEOTHERMAL': '#8B4513', // Saddle Brown
	'BIOMASS': '#228B22', // Forest Green
	'OIL': '#000000', // Black
	'OTHER': '#808080', // Gray
};

// Sample power plant data
const samplePowerPlants = [
	{
		id: 1,
		name: "Solar Farm Alpha",
		latitude: 37.7749,
		longitude: -122.4194,
		fuel_type: "SOLAR",
		nameplate_capacity_mw: 150,
		net_summer_capacity_mw: 180,
		net_winter_capacity_mw: 120,
		operating_status: "operating"
	},
	{
		id: 2,
		name: "Wind Park Beta",
		latitude: 37.7649,
		longitude: -122.4294,
		fuel_type: "WIND",
		nameplate_capacity_mw: 100,
		operating_status: "operating"
	},
	{
		id: 3,
		name: "Coal Plant Gamma",
		latitude: 37.7849,
		longitude: -122.4094,
		fuel_type: "COAL",
		nameplate_capacity_mw: 500,
		operating_status: "operating"
	},
	{
		id: 4,
		name: "Natural Gas Plant Delta",
		latitude: 37.7949,
		longitude: -122.3994,
		fuel_type: "NATURAL GAS",
		nameplate_capacity_mw: 350,
		operating_status: "operating"
	},
	{
		id: 5,
		name: "Solar Farm Epsilon",
		latitude: 37.7549,
		longitude: -122.4394,
		fuel_type: "SOLAR",
		nameplate_capacity_mw: 200,
		net_summer_capacity_mw: 240,
		net_winter_capacity_mw: 160,
		operating_status: "operating"
	}
];

// Function to calculate radius based on capacity
const getRadiusByCapacity = (capacity: number, scaleFactor: number = 0.05, sizeMultiplier: number = 15) => {
	// Base minimum radius
	const baseRadius = 5;
	// Scale factor - adjust this to get appropriate circle sizes
	// Apply the size multiplier to scale the circles
	return (baseRadius + Math.sqrt(capacity) * scaleFactor) * sizeMultiplier;
};

export default function MapPage() {
	const [position] = useState<LatLngExpression>([37.7749, -122.4194]);
	const [leftPanelOpen, setLeftPanelOpen] = useState(false);
	const [mapKey, setMapKey] = useState(0);
	
	// Add state for summer/winter capacity toggle
	const [showSummerCapacity, setShowSummerCapacity] = useState(true);
	
	// Add state for circle size multiplier (default to 15x)
	const [sizeMultiplier, setSizeMultiplier] = useState(15);
	
	// Force remount of map component once 
	useEffect(() => {
		// Force a remount of the map after a short delay
		const timer = setTimeout(() => {
			setMapKey(prev => prev + 1);
		}, 100);
		
		return () => clearTimeout(timer);
	}, []);
	
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
						/>
					) : (
						<button onClick={() => setLeftPanelOpen(!leftPanelOpen)}>{'>'}</button>
					)
				}
			</div>



{/* 			<div style={{
				position: "absolute",
				top: 0,
				right: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				borderLeft: "2px solid black",
				boxSizing: "border-box",
				zIndex: 1000,
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				width: rightPanelOpen ? rightSideBarOpenWidth : rightSideBarClosedWidth,
				height: "100vh"
			}}>
				<button onClick={() => setRightPanelOpen(!rightPanelOpen)}>{'<'}</button>
			</div> */}


			<div style={{ 
				position: "absolute",
				top: 0,
				left: leftPanelOpen ? leftSideBarOpenWidth : leftSideBarClosedWidth,
				/* right: (rightPanelOpen ? rightSideBarOpenWidth : rightSideBarClosedWidth) - 3, */
				right: 0,
				bottom: 0
			}}>
				<MapContainer 
					key={mapKey}
					center={position} 
					zoom={13} 
					scrollWheelZoom={true} 
					zoomControl={false}
					style={{ height: "100%", width: "100%" }}
				>
					<MapUpdater />
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					
					{/* Render power plants as circles */}
					{samplePowerPlants.map(plant => {
						// Determine capacity to use for circle size
						let capacityToUse = plant.nameplate_capacity_mw;
						
						// For solar plants, use summer or winter capacity if toggle is active
						if (plant.fuel_type === 'SOLAR') {
							if (showSummerCapacity && plant.net_summer_capacity_mw) {
								capacityToUse = plant.net_summer_capacity_mw;
							} else if (!showSummerCapacity && plant.net_winter_capacity_mw) {
								capacityToUse = plant.net_winter_capacity_mw;
							}
						}
						
						// Color based on fuel type
						const color = fuelTypeColors[plant.fuel_type as keyof typeof fuelTypeColors] || fuelTypeColors.OTHER;
						
						return (
							<CircleMarker 
								key={plant.id}
								center={[plant.latitude, plant.longitude]}
								radius={getRadiusByCapacity(capacityToUse, 0.05, sizeMultiplier)}
								fillColor={color}
								color={color}
								weight={Math.max(1, Math.log(plant.nameplate_capacity_mw) / 2)}
								opacity={0.4}
								fillOpacity={0.6}
							>
								<Popup>
									<div>
										<h3>{plant.name}</h3>
										<p><strong>Fuel Type:</strong> {plant.fuel_type}</p>
										<p><strong>Nameplate Capacity:</strong> {plant.nameplate_capacity_mw} MW</p>
										{plant.fuel_type === 'SOLAR' && (
											<>
												<p><strong>Summer Capacity:</strong> {plant.net_summer_capacity_mw} MW</p>
												<p><strong>Winter Capacity:</strong> {plant.net_winter_capacity_mw} MW</p>
											</>
										)}
										<p><strong>Status:</strong> {plant.operating_status}</p>
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
