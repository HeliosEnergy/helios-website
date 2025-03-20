import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import postgres from 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Initialize database connection
const sql = postgres({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

// Example Request:
// https://api.eia.gov/v2/electricity/operating-generator-capacity/data/
// 		?frequency=monthly
// 		&data[0]=county
// 		&data[1]=latitude
// 		&data[2]=longitude
// 		&data[3]=nameplate-capacity-mw
// 		&data[4]=net-summer-capacity-mw
// 		&data[5]=net-winter-capacity-mw
// 		&data[6]=operating-year-month
// 		&data[7]=planned-derate-summer-cap-mw
// 		&data[8]=planned-derate-year-month
// 		&data[9]=planned-retirement-year-month
// 		&data[10]=planned-uprate-summer-cap-mw
// 		&data[11]=planned-uprate-year-month
// 		&sort[0][column]=period
// 		&sort[0][direction]=desc
// 		&offset=0
// 		&length=5000
const API_URL_GENERATION_CAPACITY = "https://api.eia.gov/v2/electricity/operating-generator-capacity/data/";


async function getPageOfGenerationCapacity(page: number) {
	const url = `${API_URL_GENERATION_CAPACITY}`
		+ `?api_key=${process.env.EIA_API_KEY}`
		+ `&offset=${page * 5000}`
		+ `&length=2500`
		+ `&data[0]=county`
		+ `&data[1]=latitude`
		+ `&data[2]=longitude`
		+ `&data[3]=nameplate-capacity-mw`
		+ `&data[4]=net-summer-capacity-mw`
		+ `&data[5]=net-winter-capacity-mw`
		+ `&data[6]=operating-year-month`
		;
	console.log(url);
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

// Function to upsert an entity and return its ID
async function upsertEntity(entityData: any): Promise<number> {
	// Extract entity data from API response
	const apiEntityId = entityData.respondent_id || entityData.entity_id || `unknown_entity_${Date.now()}`;
	const name = entityData.respondent_name || entityData.entity_name || 'Unknown Entity';
	
	// Check if entity exists
	const existingEntity = await sql`
		SELECT id FROM eia_entities WHERE api_entity_id = ${apiEntityId}
	`;
	
	if (existingEntity.length > 0) {
		// Update existing entity
		const updatedEntity = await sql`
			UPDATE eia_entities
			SET 
				name = ${name},
				metadata = ${JSON.stringify(entityData)}::jsonb,
				updated_at = CURRENT_TIMESTAMP
			WHERE api_entity_id = ${apiEntityId}
			RETURNING id
		`;
		return updatedEntity[0].id;
	} else {
		// Insert new entity
		const newEntity = await sql`
			INSERT INTO eia_entities (
				api_entity_id,
				name,
				description,
				metadata,
				created_at,
				updated_at
			) VALUES (
				${apiEntityId},
				${name},
				${`Entity from EIA API: ${apiEntityId}`},
				${JSON.stringify(entityData)}::jsonb,
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			) RETURNING id
		`;
		return newEntity[0].id;
	}
}

// Function to upsert a power plant and return its ID
async function upsertPowerPlant(plantData: any, entityId: number): Promise<number> {
	// Extract plant data from API response
	const apiPlantId = plantData.plant_id || `unknown_plant_${Date.now()}`;
	const name = plantData.plant_name || 'Unknown Plant';
	const county = plantData.county || null;
	const state = plantData.state || null;
	const latitude = parseFloat(plantData.latitude) || 0;
	const longitude = parseFloat(plantData.longitude) || 0;
	const plantCode = plantData.plant_code || null;
	const fuelType = plantData.fuel_type || plantData.fuel || null;
	const primeMover = plantData.prime_mover || null;
	const operatingStatus = plantData.operating_status || 'unknown';
	
	// Check if plant exists
	const existingPlant = await sql`
		SELECT id FROM eia_power_plants WHERE api_plant_id = ${apiPlantId}
	`;
	
	if (existingPlant.length > 0) {
		// Update existing plant
		const updatedPlant = await sql`
			UPDATE eia_power_plants
			SET 
				entity_id = ${entityId},
				name = ${name},
				county = ${county},
				state = ${state},
				location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
				plant_code = ${plantCode},
				fuel_type = ${fuelType},
				prime_mover = ${primeMover},
				operating_status = ${operatingStatus},
				metadata = ${JSON.stringify(plantData)}::jsonb,
				updated_at = CURRENT_TIMESTAMP
			WHERE api_plant_id = ${apiPlantId}
			RETURNING id
		`;
		return updatedPlant[0].id;
	} else {
		// Insert new plant
		const newPlant = await sql`
			INSERT INTO eia_power_plants (
				api_plant_id,
				entity_id,
				name,
				county,
				state,
				location,
				plant_code,
				fuel_type,
				prime_mover,
				operating_status,
				metadata,
				created_at,
				updated_at
			) VALUES (
				${apiPlantId},
				${entityId},
				${name},
				${county},
				${state},
				ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
				${plantCode},
				${fuelType},
				${primeMover},
				${operatingStatus},
				${JSON.stringify(plantData)}::jsonb,
				CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
			) RETURNING id
		`;
		return newPlant[0].id;
	}
}

// Function to insert plant statistics
async function createPlantStat(plantId: number, statData: any): Promise<void> {
	// Extract stats data from API response
	const nameplateCapacityMw = parseFloat(statData['nameplate-capacity-mw']) || null;
	const netSummerCapacityMw = parseFloat(statData['net-summer-capacity-mw']) || null;
	const netWinterCapacityMw = parseFloat(statData['net-winter-capacity-mw']) || null;
	const plannedDerateSummerCapMw = parseFloat(statData['planned-derate-summer-cap-mw']) || null;
	const plannedUprateSummerCapMw = parseFloat(statData['planned-uprate-summer-cap-mw']) || null;
	
	// Parse dates
	let operatingYearMonth = null;
	if (statData['operating-year-month']) {
		const parts = statData['operating-year-month'].split('-');
		if (parts.length === 2) {
			operatingYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	let plannedDerateYearMonth = null;
	if (statData['planned-derate-year-month']) {
		const parts = statData['planned-derate-year-month'].split('-');
		if (parts.length === 2) {
			plannedDerateYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	let plannedUprateYearMonth = null;
	if (statData['planned-uprate-year-month']) {
		const parts = statData['planned-uprate-year-month'].split('-');
		if (parts.length === 2) {
			plannedUprateYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	let plannedRetirementYearMonth = null;
	if (statData['planned-retirement-year-month']) {
		const parts = statData['planned-retirement-year-month'].split('-');
		if (parts.length === 2) {
			plannedRetirementYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	// Insert new stat record
	await sql`
		INSERT INTO eia_plant_stats (
			plant_id,
			timestamp,
			nameplate_capacity_mw,
			net_summer_capacity_mw,
			net_winter_capacity_mw,
			planned_derate_summer_cap_mw,
			planned_uprate_summer_cap_mw,
			operating_year_month,
			planned_derate_year_month,
			planned_uprate_year_month,
			planned_retirement_year_month,
			source_timestamp,
			data_period,
			metadata
		) VALUES (
			${plantId},
			CURRENT_TIMESTAMP,
			${nameplateCapacityMw},
			${netSummerCapacityMw},
			${netWinterCapacityMw},
			${plannedDerateSummerCapMw},
			${plannedUprateSummerCapMw},
			${operatingYearMonth},
			${plannedDerateYearMonth},
			${plannedUprateYearMonth},
			${plannedRetirementYearMonth},
			${new Date(statData.period || Date.now())},
			${statData.period || 'unknown'},
			${JSON.stringify(statData)}::jsonb
		)
	`;
}

// Function to process a batch of data
async function processDataBatch(data: any): Promise<number> {
	if (!data.response || !data.response.data) {
		console.log("No data in response");
		return 0;
	}
	
	const dataItems = data.response.data;
	console.log(`Processing ${dataItems.length} items`);
	
	let processedCount = 0;
	for (const item of dataItems) {
		try {
			// Extract entity data
			const entityData = {
				respondent_id: item.respondent_id,
				respondent_name: item.respondent_name
			};
			
			// Extract plant data
			const plantData = {
				plant_id: item.plant_id,
				plant_name: item.plant_name,
				plant_code: item.plant_code,
				county: item.county,
				state: item.state,
				latitude: item.latitude,
				longitude: item.longitude,
				fuel: item.fuel,
				prime_mover: item.prime_mover
			};
			
			// Process entity and plant
			const entityId = await upsertEntity(entityData);
			const plantId = await upsertPowerPlant(plantData, entityId);
			
			// Create stat record
			await createPlantStat(plantId, item);
			
			processedCount++;
			if (processedCount % 100 === 0) {
				console.log(`Processed ${processedCount}/${dataItems.length} items`);
			}
		} catch (error) {
			console.error(`Error processing item:`, error);
			console.error(`Item data:`, JSON.stringify(item).substring(0, 200) + "...");
		}
	}
	
	console.log(`Successfully processed ${processedCount} out of ${dataItems.length} items`);
	return dataItems.length;
}

async function main() {
	try {
		let page = 0;
		let totalProcessed = 0;
		let hasMoreData = true;
		
		console.log("Starting EIA API data import...");
		
		while (hasMoreData) {
			const data = await getPageOfGenerationCapacity(page);
			
			// Check if we got valid data
			if (!data.response || !data.response.data || data.response.data.length === 0) {
				console.log(`No more data to process at page ${page}`);
				hasMoreData = false;
				break;
			}
			
			// Process this batch
			const processedCount = await processDataBatch(data);
			totalProcessed += processedCount;
			
			console.log(`Completed page ${page}, processed ${processedCount} records (total: ${totalProcessed})`);
			
			// Check if we've reached the end based on total count and what we've processed
			if (data.response.total && totalProcessed >= data.response.total) {
				console.log(`Processed all ${totalProcessed} records`);
				hasMoreData = false;
				break;
			}
			
			// Move to next page
			page++;
			
			// Optional: Add a small delay between requests to be nice to the API
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		
		console.log(`Import complete! Total processed: ${totalProcessed} records`);
	} catch (error) {
		console.error("Error in main process:", error);
	} finally {
		// Close database connection
		await sql.end();
		console.log("Database connection closed");
	}
}

main();