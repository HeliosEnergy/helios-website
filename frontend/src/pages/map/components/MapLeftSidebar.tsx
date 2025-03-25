import React, { useRef } from 'react';
import Select from 'react-select';

interface MapLeftSidebarProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	showSummerCapacity: boolean;
	setShowSummerCapacity: (show: boolean) => void;
	sizeMultiplier: number;
	setSizeMultiplier: (multiplier: number) => void;
	capacityWeight: number;
	setCapacityWeight: (weight: number) => void;
	colorByCapacityFactor: boolean;
	setColorByCapacityFactor: (show: boolean) => void;
	filters: {
		fuel_type: string | null;
		state: string[] | null;
		operating_status: string | null;
		min_capacity: number | null;
		max_capacity: number | null;
		min_capacity_factor: number | null;
		max_capacity_factor: number | null;
	};
	setFilters: React.Dispatch<React.SetStateAction<{
		fuel_type: string | null;
		state: string[] | null;
		operating_status: string | null;
		min_capacity: number | null;
		max_capacity: number | null;
		min_capacity_factor: number | null;
		max_capacity_factor: number | null;
	}>>;
}

export function MapLeftSidebar({ 
	setOpen, 
	showSummerCapacity, 
	setShowSummerCapacity,
	sizeMultiplier,
	setSizeMultiplier,
	capacityWeight,
	setCapacityWeight,
	colorByCapacityFactor,
	setColorByCapacityFactor,
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

	// Complete list of US states
	const states = [
		{ value: null, label: 'All States' },
		{ value: 'AL', label: 'Alabama' },
		{ value: 'AK', label: 'Alaska' },
		{ value: 'AZ', label: 'Arizona' },
		{ value: 'AR', label: 'Arkansas' },
		{ value: 'CA', label: 'California' },
		{ value: 'CO', label: 'Colorado' },
		{ value: 'CT', label: 'Connecticut' },
		{ value: 'DE', label: 'Delaware' },
		{ value: 'FL', label: 'Florida' },
		{ value: 'GA', label: 'Georgia' },
		{ value: 'HI', label: 'Hawaii' },
		{ value: 'ID', label: 'Idaho' },
		{ value: 'IL', label: 'Illinois' },
		{ value: 'IN', label: 'Indiana' },
		{ value: 'IA', label: 'Iowa' },
		{ value: 'KS', label: 'Kansas' },
		{ value: 'KY', label: 'Kentucky' },
		{ value: 'LA', label: 'Louisiana' },
		{ value: 'ME', label: 'Maine' },
		{ value: 'MD', label: 'Maryland' },
		{ value: 'MA', label: 'Massachusetts' },
		{ value: 'MI', label: 'Michigan' },
		{ value: 'MN', label: 'Minnesota' },
		{ value: 'MS', label: 'Mississippi' },
		{ value: 'MO', label: 'Missouri' },
		{ value: 'MT', label: 'Montana' },
		{ value: 'NE', label: 'Nebraska' },
		{ value: 'NV', label: 'Nevada' },
		{ value: 'NH', label: 'New Hampshire' },
		{ value: 'NJ', label: 'New Jersey' },
		{ value: 'NM', label: 'New Mexico' },
		{ value: 'NY', label: 'New York' },
		{ value: 'NC', label: 'North Carolina' },
		{ value: 'ND', label: 'North Dakota' },
		{ value: 'OH', label: 'Ohio' },
		{ value: 'OK', label: 'Oklahoma' },
		{ value: 'OR', label: 'Oregon' },
		{ value: 'PA', label: 'Pennsylvania' },
		{ value: 'RI', label: 'Rhode Island' },
		{ value: 'SC', label: 'South Carolina' },
		{ value: 'SD', label: 'South Dakota' },
		{ value: 'TN', label: 'Tennessee' },
		{ value: 'TX', label: 'Texas' },
		{ value: 'UT', label: 'Utah' },
		{ value: 'VT', label: 'Vermont' },
		{ value: 'VA', label: 'Virginia' },
		{ value: 'WA', label: 'Washington' },
		{ value: 'WV', label: 'West Virginia' },
		{ value: 'WI', label: 'Wisconsin' },
		{ value: 'WY', label: 'Wyoming' },
		{ value: 'DC', label: 'District of Columbia' }
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

	// Convert states array to react-select format
	const handleStateChange = (selectedOptions: any) => {
		if (!selectedOptions || selectedOptions.length === 0) {
			handleFilterChange('state', null);
		} else {
			// Extract just the state codes into an array
			const stateValues = selectedOptions.map((option: any) => option.value);
			handleFilterChange('state', stateValues);
		}
	};

	// Transform current state filter into the format react-select expects
	const getSelectedStates = () => {
		if (!filters.state) return [];
		if (!Array.isArray(filters.state)) return [];
		
		return filters.state.map(stateCode => 
			states.find(state => state.value === stateCode)
		).filter(Boolean);
	};

	// Add this function at the component level
	function createThrottle(func: Function, limit: number) {
		let inThrottle = false;
		let lastArgs: any[] | null = null;
		
		return function(...args: any[]) {
			lastArgs = args;
			
			if (!inThrottle) {
				func(...args);
				inThrottle = true;
				
				setTimeout(() => {
					inThrottle = false;
					if (lastArgs) {
						func(...lastArgs);
						lastArgs = null;
					}
				}, limit);
			}
		};
	}

	// Create throttled updaters
	const throttledSetSizeMultiplier = useRef(createThrottle((value: number) => {
		setSizeMultiplier(value);
	}, 100)).current;
	
	const throttledSetCapacityWeight = useRef(createThrottle((value: number) => {
		setCapacityWeight(value);
	}, 100)).current;

	return (
		<div style={{ width: '100%', height: '100%', overflow: 'auto', color: 'white', padding: '16px', boxSizing: 'border-box' }}>
			<div style={{width:"100%", height: "30px"}}>
				<div style={{height: 0}}>
				<img src="/white_logo.png" alt="logo" style={{ height: '50px', position: "relative", left: "30px" }} />
				</div>


				<button style={{
					position: "absolute",
					right: "16px",
					top: "30px"
				}} onClick={() => setOpen(false)}>{'<'}</button>
			</div>

			<h4>Monopolizing Optimal AI Territory</h4>

			<div style={{ marginBottom: '20px' }}>
				<h3>Display Settings</h3>
				
				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Base Weight: {sizeMultiplier}x</label>
					<input 
						type="range" 
						min="1" 
						max="50" 
						value={sizeMultiplier}
						onChange={(e) => throttledSetSizeMultiplier(parseInt(e.target.value))}
						style={{ width: '100%' }}
					/>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Capacity Weight: {capacityWeight.toFixed(2)}</label>
					<input 
						type="range" 
						min="0" 
						max="3" 
						step="0.01"
						value={capacityWeight}
						onChange={(e) => throttledSetCapacityWeight(parseFloat(e.target.value))}
						style={{ width: '100%' }}
					/>
					<small style={{ display: 'block', marginTop: '2px', fontSize: '12px', color: '#aaa' }}>
						Controls how much a plant's capacity affects its size (0 = uniform size, 1 = normal, 3 = capacity emphasized)
					</small>
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

				<div style={{ marginBottom: '10px' }}>
					<label>
						<input 
							type="checkbox" 
							checked={colorByCapacityFactor} 
							onChange={() => setColorByCapacityFactor(!colorByCapacityFactor)}
						/>
						{' '}
						Color by Capacity Factor
					</label>
					{colorByCapacityFactor && (
						<div style={{ marginLeft: '20px', marginTop: '5px', fontSize: '12px' }}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ff0000', marginRight: '5px' }}></div>
								&lt;20%
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ff8800', marginRight: '5px' }}></div>
								20-40%
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ffff00', marginRight: '5px' }}></div>
								40-60%
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#88ff00', marginRight: '5px' }}></div>
								60-80%
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#00ff00', marginRight: '5px' }}></div>
								&gt;80%
							</div>
						</div>
					)}
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

				<div style={{ marginBottom: '10px', color: "black" }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>State:</label>
					<Select
						isMulti
						options={states.filter(state => state.value !== null)}
						value={getSelectedStates()}
						onChange={handleStateChange}
						placeholder="Select states..."
						isClearable={true}
						className="react-select-container"
						classNamePrefix="react-select"
					/>
					{filters.state && filters.state.length > 0 && (
						<small style={{ marginTop: '5px', display: 'block' }}>
							{filters.state.length} state(s) selected
						</small>
					)}
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

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Min Capacity Factor: {filters.min_capacity_factor !== null ? `${filters.min_capacity_factor}%` : '0%'}</label>
					<input 
						type="range" 
						min="0"
						max="100"
						step="1"
						value={filters.min_capacity_factor !== null ? filters.min_capacity_factor : 0} 
						onChange={(e) => {
							const newValue = parseInt(e.target.value);
							// Ensure min doesn't exceed max
							if (filters.max_capacity_factor === null || newValue <= filters.max_capacity_factor) {
								handleFilterChange('min_capacity_factor', newValue);
							} else {
								// If min would exceed max, set min to max
								handleFilterChange('min_capacity_factor', filters.max_capacity_factor);
							}
						}}
						style={{ width: '100%' }}
					/>
				</div>

				<div style={{ marginBottom: '10px' }}>
					<label style={{ display: 'block', marginBottom: '5px' }}>Max Capacity Factor: {filters.max_capacity_factor !== null ? `${filters.max_capacity_factor}%` : '100%'}</label>
					<input 
						type="range" 
						min="0"
						max="100"
						step="1"
						value={filters.max_capacity_factor !== null ? filters.max_capacity_factor : 100} 
						onChange={(e) => {
							const newValue = parseInt(e.target.value);
							// Ensure max is not less than min
							if (filters.min_capacity_factor === null || newValue >= filters.min_capacity_factor) {
								handleFilterChange('max_capacity_factor', newValue);
							} else {
								// If max would be less than min, set max to min
								handleFilterChange('max_capacity_factor', filters.min_capacity_factor);
							}
						}}
						style={{ width: '100%' }}
					/>
				</div>
				
				<button 
					onClick={() => setFilters({
						fuel_type: null,
						state: null,
						operating_status: null,
						min_capacity: null,
						max_capacity: null,
						min_capacity_factor: null,
						max_capacity_factor: null
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


export default MapLeftSidebar;