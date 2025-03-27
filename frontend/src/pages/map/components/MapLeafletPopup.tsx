import { PowerPlant } from "../MapLeafletPage";
import { fuelTypeDisplayNames, operatingStatusDisplayNames } from "../MapValueMappings";

interface MapLeafletPopupProps {
	plant: PowerPlant;
	fullPlantData: {
		id: number;
		name: string;
		county: string;
		state: string;
		latitude: number;
		longitude: number;
		fuel_type: string;
		operating_status: string;
		nameplate_capacity_mw: number | null;
		capacity_factor: number | null;
		generation?: {
			generation: number | null;
			generation_units: string;
			timestamp: string;
		} | null;
	};
}

export function MapLeafletPopup({ fullPlantData }: MapLeafletPopupProps) {


	return (
		<div style={{ color: 'black', minWidth: '250px' }}>
			<h3 style={{ margin: '0 0 8px 0' }}>{fullPlantData.name || `Power Plant ${fullPlantData.id}`}</h3>
			<div style={{ marginBottom: '8px' }}>
				<p style={{ margin: '4px 0' }}>
					<strong>Location:</strong> {fullPlantData.county ? `${fullPlantData.county} County, ` : ''}{fullPlantData.state || 'N/A'}
				</p>
				<p style={{ margin: '4px 0' }}>
					<strong>Fuel Type:</strong> {fuelTypeDisplayNames[fullPlantData.fuel_type as keyof typeof fuelTypeDisplayNames] || fullPlantData.fuel_type}
				</p>
				<p style={{ margin: '4px 0' }}>
					<strong>Status:</strong> {operatingStatusDisplayNames[fullPlantData.operating_status as keyof typeof operatingStatusDisplayNames] || fullPlantData.operating_status}
				</p>
				<p style={{ margin: '4px 0' }}>
					<strong>Capacity:</strong> {fullPlantData.nameplate_capacity_mw ? `${Math.round(fullPlantData.nameplate_capacity_mw)} MW` : 'N/A'}
				</p>
				{fullPlantData.capacity_factor !== null && (
					<p style={{ margin: '4px 0' }}>
						<strong>Capacity Factor:</strong> {fullPlantData.capacity_factor.toFixed(1)}%
					</p>
				)}
				{fullPlantData.generation && (
					<p style={{ margin: '4px 0' }}>
						<strong>Generation:</strong>{' '}
						{fullPlantData.generation.generation 
							? `${Math.round(fullPlantData.generation.generation).toLocaleString()} ${fullPlantData.generation.generation_units}`
							: 'N/A'
						}
					</p>
				)}
			</div>
			<div style={{ 
				borderTop: '1px solid #ccc', 
				paddingTop: '8px',
				textAlign: 'center'
			}}>
				<a 
					href={`https://www.google.com/maps/search/?api=1&query=${fullPlantData.latitude},${fullPlantData.longitude}`}
					target="_blank"
					style={{
						display: 'inline-block',
						padding: '4px 12px',
						backgroundColor: '#007bff',
						color: 'white',
						textDecoration: 'none',
						borderRadius: '4px',
						fontSize: '14px'
					}}
				>
					View on Google Maps
				</a>
			</div>
		</div>
	);
}