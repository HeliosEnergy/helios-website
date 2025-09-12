export type MapColorings = "capacityFactor" | "fuelType" | "operatingStatus";

// Add this new type definition
export type SizeByOption = "nameplate_capacity" | "capacity_factor" | "generation";

export const fuelTypeColors: {[key: string]: string} = {
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
	'OBG': '#90ad5e',   // Other Gas - Forest Green
	'WH': '#fc7f00',   // Waste Heat - Forest Green
	'OG': '#90ad5e',   // Other Gas - Forest Green
	'WDL': '#ead6b2',   // Waste to Liquids - Forest Green
	'RC': '#c86e33',   // Refuse Combustion - Forest Green
	'SGC': '#ffc000',   // Solar Thermal - Forest Green
	'RFO': '#000000',   // Residual Fuel Oil - Forest Green
	'PC': '#000000',   // Petroleum Coke - Forest Green
	'OTHER': '#333333', // Other - Dark Gray (was white)
};

export const fuelTypeDisplayNames = {
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

export const operatingStatusColors: {[key: string]: string} = {
	'OP': 'green',
	'SB': 'yellow',
	'OS': 'red',
	'RE': 'grey',
};

// Map for operating status display names
export const operatingStatusDisplayNames = {
	'OP': 'Operating',
	'SB': 'Standby/Backup',
	'OS': 'Out of Service',
	'RE': 'Retired',
};

	// Complete list of US states
export const states = [
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


export const DEFAULT_CAPACITY_WEIGHT = 0.2;
export const DEFAULT_SIZE_MULTIPLIER = 15;
export const DEFAULT_COLORING_MODE: MapColorings = "fuelType";
export const DEFAULT_SHOW_SUMMER_CAPACITY = false;
export const DEFAULT_SIZE_BY_OPTION: SizeByOption = "nameplate_capacity";