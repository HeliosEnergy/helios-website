import React from 'react';

interface MapLeftSidebarProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	showSummerCapacity: boolean;
	setShowSummerCapacity: (show: boolean) => void;
	sizeMultiplier: number;
	setSizeMultiplier: (multiplier: number) => void;
	filters: {
		fuel_type: string | null;
		state: string | null;
		operating_status: string | null;
		min_capacity: number | null;
		max_capacity: number | null;
	};
	setFilters: React.Dispatch<React.SetStateAction<{
		fuel_type: string | null;
		state: string | null;
		operating_status: string | null;
		min_capacity: number | null;
		max_capacity: number | null;
	}>>;
}

export function MapLeftSidebar({ 
	open, 
	setOpen, 
	showSummerCapacity, 
	setShowSummerCapacity,
	sizeMultiplier,
	setSizeMultiplier,
	filters,
	setFilters
}: MapLeftSidebarProps) {
	// Common fuel types
	const fuelTypes = [
		{ value: null, label: 'All Fuel Types' },
		{ value: 'SUN', label: 'Solar' },
		{ value: 'WND', label: 'Wind' },
		{ value: 'BIT', label: 'Bituminous Coal' },
		{ value: 'SUB', label: 'Subbituminous Coal' },
		{ value: 'LIG', label: 'Lignite Coal' },
		{ value: 'NG', label: 'Natural Gas' },
		{ value: 'WAT', label: 'Hydro' },
		{ value: 'GEO', label: 'Geothermal' },
		{ value: 'DFO', label: 'Fuel Oil' },
		{ value: 'LFG', label: 'Landfill Gas' },
		{ value: 'WDS', label: 'Wood/Biomass' }
	];

	// Common states
	const states = [
		{ value: null, label: 'All States' },
		{ value: 'CA', label: 'California' },
		{ value: 'TX', label: 'Texas' },
		{ value: 'NY', label: 'New York' },
		{ value: 'FL', label: 'Florida' },
		{ value: 'IL', label: 'Illinois' },
		{ value: 'OH', label: 'Ohio' },
		{ value: 'GA', label: 'Georgia' },
		{ value: 'PA', label: 'Pennsylvania' },
		{ value: 'NC', label: 'North Carolina' },
		{ value: 'MI', label: 'Michigan' }
	];

	// Operating statuses
	const operatingStatuses = [
		{ value: null, label: 'All Statuses' },
		{ value: 'OP', label: 'Operating' },
		{ value: 'SB', label: 'Standby/Backup' },
		{ value: 'OS', label: 'Out of Service' }
	];

	const handleFilterChange = (key: string, value: any) => {
		setFilters(prev => ({
			...prev,
			[key]: value
		}));
	};

	return (
		<div style={{ width: '100%', height: '100%', overflow: 'auto', color: 'white', padding: '16px', boxSizing: 'border-box' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
				<h2 style={{ margin: 0 }}>Power Plant Map</h2>
				<button onClick={() => setOpen(false)}>{'<'}</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h3>Display Settings</h3>
				
				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Circle Size Multiplier: {sizeMultiplier}x</label>
					<input 
						type="range" 
						min="1" 
						max="30" 
						value={sizeMultiplier}
						onChange={(e) => setSizeMultiplier(parseInt(e.target.value))}
						style={{ width: '100%' }}
					/>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label>
						<input 
							type="checkbox" 
							checked={showSummerCapacity} 
							onChange={() => setShowSummerCapacity(!showSummerCapacity)}
						/>
						{' '}
						Show Summer Capacity (for Solar)
					</label>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h3>Filters</h3>
				
				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Fuel Type:</label>
					<select 
						value={filters.fuel_type || ''} 
						onChange={(e) => handleFilterChange('fuel_type', e.target.value || null)}
						style={{ width: '100%', padding: '5px' }}
					>
						{fuelTypes.map(option => (
							<option key={option.label} value={option.value || ''}>{option.label}</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>State:</label>
					<select 
						value={filters.state || ''} 
						onChange={(e) => handleFilterChange('state', e.target.value || null)}
						style={{ width: '100%', padding: '5px' }}
					>
						{states.map(option => (
							<option key={option.label} value={option.value || ''}>{option.label}</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Operating Status:</label>
					<select 
						value={filters.operating_status || ''} 
						onChange={(e) => handleFilterChange('operating_status', e.target.value || null)}
						style={{ width: '100%', padding: '5px' }}
					>
						{operatingStatuses.map(option => (
							<option key={option.label} value={option.value || ''}>{option.label}</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Min Capacity (MW):</label>
					<input 
						type="number" 
						value={filters.min_capacity || ''} 
						onChange={(e) => handleFilterChange('min_capacity', e.target.value ? parseFloat(e.target.value) : null)}
						style={{ width: '100%', padding: '5px' }}
					/>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Max Capacity (MW):</label>
					<input 
						type="number" 
						value={filters.max_capacity || ''} 
						onChange={(e) => handleFilterChange('max_capacity', e.target.value ? parseFloat(e.target.value) : null)}
						style={{ width: '100%', padding: '5px' }}
					/>
				</div>
				
				<button 
					onClick={() => setFilters({
						fuel_type: null,
						state: null,
						operating_status: null,
						min_capacity: null,
						max_capacity: null
					})}
					style={{ 
						width: '100%', 
						padding: '8px', 
						backgroundColor: '#444', 
						color: 'white', 
						border: 'none', 
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					Reset Filters
				</button>
			</div>
		</div>
	);
}
