import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { LatLngExpression } from "leaflet";
import { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css'; // Make sure this is imported

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

export default function MapPage() {
	const [position] = useState<LatLngExpression>([37.7749, -122.4194]);
	
	// Add a ref to track if component is mounted
	const [mapKey, setMapKey] = useState(0);
	
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
					<Marker position={position}>
						<Popup>
							A pretty CSS3 popup. <br /> Easily customizable.
						</Popup>
					</Marker>
				</MapContainer>
			</div>
		</div>
	);
}
