import React, { useRef, useState } from 'react';
import { MdArrowBackIos, MdExpandMore, MdExpandLess } from 'react-icons/md';
import Select from 'react-select';
import { DEFAULT_CAPACITY_WEIGHT, DEFAULT_COLORING_MODE, DEFAULT_SHOW_SUMMER_CAPACITY, DEFAULT_SIZE_MULTIPLIER, fuelTypeDisplayNames, MapColorings, operatingStatusDisplayNames, states, SizeByOption, DEFAULT_SIZE_BY_OPTION } from '../MapValueMappings';

interface MapLeftSidebarProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	showSummerCapacity: boolean;
	setShowSummerCapacity: (show: boolean) => void;
	sizeMultiplier: number;
	setSizeMultiplier: (multiplier: number) => void;
	capacityWeight: number;
	setCapacityWeight: (weight: number) => void;
	coloringMode: MapColorings;
	setColoringMode: (show: MapColorings) => void;
	filters: {
		fuel_type: string[] | null;
		state: string[] | null;
		operating_status: string[] | null;
		min_capacity: number | null;
		max_capacity: number | null;
		min_capacity_factor: number | null;
		max_capacity_factor: number | null;
	};
	setFilters: React.Dispatch<React.SetStateAction<{
		fuel_type: string[] | null;
		state: string[] | null;
		operating_status: string[] | null;
		min_capacity: number | null;
		max_capacity: number | null;
		min_capacity_factor: number | null;
		max_capacity_factor: number | null;
	}>>;
	sizeByOption: SizeByOption;
	setSizeByOption: (option: SizeByOption) => void;
}

interface DropdownProps {
	title: string;
	isOpen: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}

const Dropdown = ({ title, isOpen, onToggle, children }: DropdownProps) => {
	return (
		<div style={{ marginBottom: '15px', width: "100%" }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '8px 12px',
					backgroundColor: '#333',
					borderRadius: '4px',
					cursor: 'pointer'
				}}
				onClick={onToggle}
			>
				<h3 style={{ margin: 0 }}>{title}</h3>
				{isOpen ? <MdExpandLess size={24} color='white' /> : <MdExpandMore size={24} color='white' />}
			</div>
			{isOpen && (
				<div style={{
					padding: '12px',
					backgroundColor: '#222',
					borderRadius: '0 0 4px 4px',
					marginTop: '1px'
				}}>
					{children}
				</div>
			)}
		</div>
	);
};

export function MapLeftSidebar({
	setOpen,
	showSummerCapacity,
	setShowSummerCapacity,
	sizeMultiplier,
	setSizeMultiplier,
	capacityWeight,
	setCapacityWeight,
	coloringMode,
	setColoringMode,
	filters,
	setFilters,
	sizeByOption,
	setSizeByOption
}: MapLeftSidebarProps) {
	// Track which dropdown is currently open
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	const toggleDropdown = (dropdown: string) => {
		setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
	};


	const handleFilterChange = (key: string, value: any) => {
		console.log("KEY", key, "VALUE", value)
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

	// Convert fuel types array to react-select format
	const handleFuelTypeChange = (selectedOptions: any) => {
		if (!selectedOptions || selectedOptions.length === 0) {
			handleFilterChange('fuel_type', null);
		} else {
			// Extract just the fuel type codes into an array
			const fuelTypeValues = selectedOptions.map((option: any) => option.value);
			handleFilterChange('fuel_type', fuelTypeValues);
		}
	};

	// Transform current fuel_type filter into the format react-select expects
	const getSelectedFuelTypes = () => {
		if (!filters.fuel_type) return [];
		if (!Array.isArray(filters.fuel_type)) return [];

		const fuelTypes = filters.fuel_type.map(fuelTypeCode =>
			Object.keys(fuelTypeDisplayNames).find(fuelType => fuelType === fuelTypeCode)
		).filter(Boolean);

		return fuelTypes.map((ft) => {
			return {
				value: ft,
				label: fuelTypeDisplayNames[ft as keyof typeof fuelTypeDisplayNames]
			}
		});
	};

	// Convert operating status array to react-select format
	const handleOperatingStatusChange = (selectedOptions: any) => {
		if (!selectedOptions || selectedOptions.length === 0) {
			handleFilterChange('operating_status', null);
		} else {
			// Extract just the status codes into an array
			const statusValues = selectedOptions.map((option: any) => option.value);
			handleFilterChange('operating_status', statusValues);
		}
	};

	// Transform current operating_status filter into the format react-select expects
	const getSelectedOperatingStatuses = () => {
		if (!filters.operating_status) return [];
		if (!Array.isArray(filters.operating_status)) return [];

		return filters.operating_status.map(statusCode =>
			Object.keys(operatingStatusDisplayNames).find(status => status === statusCode)
		).filter(Boolean).map((status) => {
			return {
				value: status,
				label: operatingStatusDisplayNames[status as keyof typeof operatingStatusDisplayNames]
			}
		});
	};

	// Add this function at the component level
	function createThrottle(func: Function, limit: number) {
		let inThrottle = false;
		let lastArgs: any[] | null = null;

		return function (...args: any[]) {
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

	const throttledSetMinCapacityFactor = useRef(createThrottle((value: number) => {
		handleFilterChange('min_capacity_factor', value);
	}, 100)).current;

	const throttledSetMaxCapacityFactor = useRef(createThrottle((value: number) => {
		handleFilterChange('max_capacity_factor', value);
	}, 100)).current;


	return (
		<div style={{
			width: '100%',
			height: '100%',
			overflow: 'auto',
			color: 'black',
			boxSizing: 'border-box',
			display: "flex",
			flexDirection: "row",
			paddingLeft: "24px",
			paddingRight: "24px"
		}}>

			<div style={{
				width: "100%",
			}}>
				<div style={{ width: "100%", height: "64px" }}>
					<div style={{
						height: "400px",
						marginTop: "16px"
					}}>
						<img src="/white_logo.png" alt="logo" style={{ height: '50px', position: "relative", left: "30px" }} />
					</div>


					<MdArrowBackIos
						color="white"
						size={24}
						style={{
							position: "absolute",
							right: "8px",
							top: "30px",
							color: "white"
						}}
						onClick={() => setOpen(false)}
					/>
				</div>

				<h4 style={{
					marginBottom: "16px"
				}}>
					MOAT: Monopolizing Optimal<br />AI Territory
				</h4>

				<Dropdown
					title="Plant Sizing"
					isOpen={activeDropdown === 'displaySettings'}
					onToggle={() => toggleDropdown('displaySettings')}
				>
					<div style={{ marginBottom: '10px' }}>
						<label style={{ display: 'block', marginBottom: '5px' }}>Base Size: {sizeMultiplier}x</label>
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
						<label style={{ display: 'block', marginBottom: '5px' }}>Data Emphasis: {capacityWeight.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="3"
							step="0.01"
							value={capacityWeight}
							onChange={(e) => throttledSetCapacityWeight(parseFloat(e.target.value))}
							style={{ width: '100%' }}
						/>
						<small style={{ display: 'block', marginTop: '2px', fontSize: '10px', color: '#aaa' }}>
							Raises plant's capacity effect on size<br/>(0 = uniform, 1 = normal, 3 = emphasized)
						</small>
					</div>

					<div style={{ marginBottom: '10px' }}>
						<label style={{ display: 'block', marginBottom: '5px' }}>Size Circles By:</label>
						<select 
							value={sizeByOption}
							onChange={(e) => setSizeByOption(e.target.value as SizeByOption)}
							style={{ 
								width: '100%', 
								padding: '5px',
								backgroundColor: '#333',
								color: 'white',
								border: '1px solid #555',
								borderRadius: '4px' 
							}}
						>
							<option value="nameplate_capacity">Nameplate Capacity</option>
							<option value="capacity_factor">Capacity Factor</option>
							<option value="generation">Generation</option>
						</select>
					</div>

					<div style={{ marginBottom: '10px' }}>
						<label>
							<input
								type="checkbox"
								checked={showSummerCapacity}
								onChange={() => setShowSummerCapacity(!showSummerCapacity)}
							/>
							{' '}
							Show Summer Capacity
						</label>
					</div>

				</Dropdown>

				<Dropdown
					title="Color Settings"
					isOpen={activeDropdown === 'capacityGeolocation'}
					onToggle={() => toggleDropdown('capacityGeolocation')}
				>
					<div style={{ padding: '10px 0' }}>

						<div style={{ marginBottom: '10px' }}>

							<label>
								<input
									type="checkbox"
									checked={coloringMode === "fuelType"}
									onChange={() => setColoringMode("fuelType")}
								/>
								{' '}
								Color by Fuel Type
							</label>

							<br />
							<br />

							<label>
								<input
									type="checkbox"
									checked={coloringMode === "capacityFactor"}
									onChange={() => setColoringMode("capacityFactor")}
								/>
								{' '}
								Color by Capacity Factor
							</label>

							<br />
							<br />

							<label>
								<input
									type="checkbox"
									checked={coloringMode === "operatingStatus"}
									onChange={() => setColoringMode("operatingStatus")}
								/>
								{' '}
								Color by Operating Status
							</label>

						</div>
					</div>
				</Dropdown>

				<Dropdown
					title="Filters"
					isOpen={activeDropdown === 'filters'}
					onToggle={() => toggleDropdown('filters')}
				>
					<div style={{ marginBottom: '10px', color: "black" }}>
						<label style={{ display: 'block', marginBottom: '5px' }}>Fuel Type:</label>
						<Select
							isMulti
							options={Object.keys(fuelTypeDisplayNames).filter(fuelType => fuelType !== null).map((ft) => {
								return {
									label: fuelTypeDisplayNames[ft as keyof typeof fuelTypeDisplayNames],
									value: ft
								}
							}) as any}
							value={getSelectedFuelTypes()}
							onChange={handleFuelTypeChange}
							placeholder="Select fuel types..."
							isClearable={true}
							className="react-select-container"
							classNamePrefix="react-select"
						/>
						{filters.fuel_type && filters.fuel_type.length > 0 && (
							<small style={{ marginTop: '5px', display: 'block' }}>
								{filters.fuel_type.length} fuel type(s) selected
							</small>
						)}
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

					<div style={{ marginBottom: '10px', color: "black" }}>
						<label style={{ display: 'block', marginBottom: '5px' }}>Operating Status:</label>
						<Select
							isMulti
							options={Object.keys(operatingStatusDisplayNames).filter(status => status !== null).map((status) => {
								return {
									label: operatingStatusDisplayNames[status as keyof typeof operatingStatusDisplayNames],
									value: status
								}
							}) as any}
							value={getSelectedOperatingStatuses()}
							onChange={handleOperatingStatusChange}
							placeholder="Select statuses..."
							isClearable={true}
							className="react-select-container"
							classNamePrefix="react-select"
						/>
						{filters.operating_status && filters.operating_status.length > 0 && (
							<small style={{ marginTop: '5px', display: 'block' }}>
								{filters.operating_status.length} status(es) selected
							</small>
						)}
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
									throttledSetMinCapacityFactor(newValue);
								} else {
									// If min would exceed max, set min to max
									throttledSetMinCapacityFactor(filters.max_capacity_factor);
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
									throttledSetMaxCapacityFactor(newValue);
								} else {
									// If max would be less than min, set max to min
									throttledSetMaxCapacityFactor(filters.min_capacity_factor);
								}
							}}
							style={{ width: '100%' }}
						/>
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
				</Dropdown>


				<button
					onClick={() => {
						setFilters({
							fuel_type: null,
							state: null,
							operating_status: null,
							min_capacity: null,
							max_capacity: null,
							min_capacity_factor: null,
							max_capacity_factor: null
						})
						setColoringMode(DEFAULT_COLORING_MODE)
						setShowSummerCapacity(DEFAULT_SHOW_SUMMER_CAPACITY)
						setSizeMultiplier(DEFAULT_SIZE_MULTIPLIER)
						setCapacityWeight(DEFAULT_CAPACITY_WEIGHT)
						setSizeByOption(DEFAULT_SIZE_BY_OPTION)
					}}
					style={{
						width: '100%',
						padding: '8px',
						marginBottom: '32px',
						backgroundColor: '#444',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					Reset Map
				</button>
			</div>
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					width: "20px",
					height: "100%",
					cursor: "pointer"
				}}
				onClick={() => setOpen(false)}
			>
				&nbsp;
			</div>
		</div>
	);
}


export default MapLeftSidebar;