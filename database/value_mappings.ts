

const ELECTRICITY_ID = {
	1: "SUN",
	2: "WND",
	3: "BIT",
	4: "SUB",
	5: "LIG",
	6: "NG",
	7: "DFO",
	8: "WAT",
	9: "GEO",
	10: "LFG",
	11: "WDS",
	12: "BLQ",
	13: "NUC",
	14: "MSW",
	15: "MWH",
	16: "OBS",
	17: "OBG",
	18: "WH",
	19: "OG",
	20: "WDL",
	21: "RC",
	22: "SGC",
	23: "RFO",
	24: "OTHER"
}

const ELECTRICITY_NAME = {
	"SUN": "Solar",
	"WND": "Wind",
	"BIT": "Bituminous Coal",
	"SUB": "Subbituminous Coal",
	"LIG": "Lignite Coal",
	"NG": "Natural Gas",
	"DFO": "Fuel Oil",
	"WAT": "Hydro",
	"GEO": "Geothermal",
	"LFG": "Landfill Gas",
	"WDS": "Wood/Biomass",
	"BLQ": "Black Liquor",
	"NUC": "Nuclear",
	"MSW": "Municipal Solid Waste",
	"MWH": "Municipal Waste Heat",
	"OBS": "Other Biomass",
	"OBG": "Other Gas",
	"WH": "Waste Heat",
	"OG": "Other Gas",
	"WDL": "Waste to Liquids",
	"RC": "Refuse Combustion",
	"SGC": "Solar Thermal",
	"RFO": "Residual Fuel Oil",
	"OTHER": "Other"
}

const ELECTRICITY_NAMES = Object.fromEntries(
	Object.entries(ELECTRICITY_ID).map(([key, value]) => [value, key])
);
