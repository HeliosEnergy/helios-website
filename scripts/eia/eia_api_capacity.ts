import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import postgres from 'postgres';
import { default as fsp } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PAGE_SIZE = 5000;

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

// Define path for saving raw API responses
const TEMP_DIR_PATH = resolve(__dirname, '../../data/temp');
const API_RESPONSES_FILE = resolve(TEMP_DIR_PATH, '__eia_api_capacity_responses.json');

// Clear/create the API responses file at startup
async function resetApiResponsesFile() {
	try {
		// Ensure temp directory exists
		await fsp.mkdir(TEMP_DIR_PATH, { recursive: true });
		// Create empty file (or overwrite existing)
		await fsp.writeFile(API_RESPONSES_FILE, '', { encoding: 'utf8' });
		console.log(`Created empty file for API responses at: ${API_RESPONSES_FILE}`);
	} catch (error) {
		console.error(`Error creating/clearing API responses file: ${error}`);
		throw error;
	}
}

// Append a record to the API responses file
async function appendApiResponse(record: any): Promise<void> {
	try {
		// Convert record to JSON string with newline
		const recordStr = JSON.stringify(record) + '\n';
		// Append to file
		await fsp.appendFile(API_RESPONSES_FILE, recordStr, { encoding: 'utf8' });
	} catch (error) {
		console.error(`Error appending record to API responses file: ${error}`);
		// Continue execution despite error
	}
}

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

async function getPageOfGenerationCapacity(page: number, pageSize: number = PAGE_SIZE, retryCount: number = 0, maxRetries: number = 3) {
	const url = `${API_URL_GENERATION_CAPACITY}`
		+ `?api_key=${process.env.EIA_API_KEY}`
		+ `&offset=${page * pageSize}`
		+ `&length=${pageSize}`
		+ `&data[0]=county`
		+ `&data[1]=latitude`
		+ `&data[2]=longitude`
		+ `&data[3]=nameplate-capacity-mw`
		+ `&data[4]=net-summer-capacity-mw`
		+ `&data[5]=net-winter-capacity-mw`
		+ `&data[6]=operating-year-month`
		+ `&frequency=monthly`
		+ `&sort[0][column]=period`
		+ `&sort[0][direction]=desc`;
	console.log(url);
	try {
		const response = await fetch(url);
		const data = await response.json();
		
		// Check if we got an error response
		if (data.error) {
			console.log(`API returned error: ${data.error} (code: ${data.code})`);
			
			// Implement retry logic with 3-second delay
			if (retryCount < maxRetries) {
				console.log(`Waiting 3 seconds before retry ${retryCount + 1}/${maxRetries}...`);
				await new Promise(resolve => setTimeout(resolve, 3000));
				return getPageOfGenerationCapacity(page, pageSize, retryCount + 1, maxRetries);
			}
			
			return { response: { data: [] } }; // Return empty data after max retries
		}
		
		return data;
	} catch (error) {
		console.error(`Error fetching data from API: ${error}`);
		
		// Implement retry logic with 3-second delay for network errors too
		if (retryCount < maxRetries) {
			console.log(`Waiting 3 seconds before retry ${retryCount + 1}/${maxRetries}...`);
			await new Promise(resolve => setTimeout(resolve, 3000));
			return getPageOfGenerationCapacity(page, pageSize, retryCount + 1, maxRetries);
		}
		
		return { response: { data: [] } }; // Return empty data after max retries
	}
}

// Function to upsert an entity and return its ID
async function upsertEntity(entityData: any): Promise<number> {
	// Extract entity data from API response with correct field names
	const apiEntityId = entityData.entityid || `unknown_entity_${Date.now()}`;
	const name = entityData.entityName || 'Unknown Entity';
	
	// Add descriptive information
	const description = `Energy company/utility with ID: ${apiEntityId}. Data from EIA API.`;
	
	console.log(`Upserting entity: ${apiEntityId} - ${name}`);
	
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
				description = ${description},
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
				${description},
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
	// Extract plant data from API response with correct field names
	const apiPlantId = plantData.plantid || `unknown_plant_${Date.now()}`;
	const name = plantData.plantName || 'Unknown Plant';
	const county = plantData.county || null;
	const state = plantData.stateid || plantData.stateName || null;
	const latitude = parseFloat(plantData.latitude) || 0;
	const longitude = parseFloat(plantData.longitude) || 0;
	const plantCode = plantData.generatorid || null;
	const fuelType = plantData.energy_source_code || plantData['energy-source-desc'] || null;
	const primeMover = plantData.prime_mover_code || null;
	const operatingStatus = plantData.status || plantData.statusDescription || 'unknown';
	
	console.log(`Upserting plant: ${apiPlantId} - ${name}, State: ${state}, Fuel: ${fuelType}, Mover: ${primeMover}`);
	
	// Check if plant exists
	const existingPlant = await sql`
		SELECT id FROM eia_power_plants WHERE api_plant_id = ${apiPlantId}
	`;
	
	if (existingPlant.length > 0) {
		console.log(`Plant ${apiPlantId} already exists`);
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

// Function to upsert a generator and return its ID
async function upsertGenerator(generatorData: any, plantId: number): Promise<number> {
	// Extract plant and generator IDs to create a compound ID
	const plantCode = generatorData.plantCode || generatorData.plantid || 'unknown';
	const generatorCode = generatorData.generatorid || generatorData.generator_id || 'unknown';
	const compoundId = `${plantCode}_${generatorCode}`;
	
	// Since generators may not have a dedicated name field, create one from available data
	// Use the plant name + generator ID or technology info if available
	const plantName = generatorData.plantName || 'Unknown Plant';
	const technologyDesc = generatorData.technology_description || 
						  generatorData['technology-desc'] || '';
	const energySourceDesc = generatorData['energy-source-desc'] || 
							generatorData.energy_source_description || '';
	
	// Construct a name using available information
	const name = `${plantName} - Generator ${generatorCode} (${technologyDesc || energySourceDesc || 'Unnamed'})`.trim();
	
	// Capacity data
	const nameplateCapacityMw = parseFloat(generatorData['nameplate-capacity-mw']) || null;
	const netSummerCapacityMw = parseFloat(generatorData['net-summer-capacity-mw']) || null;
	const netWinterCapacityMw = parseFloat(generatorData['net-winter-capacity-mw']) || null;
	
	// Parse dates
	let operatingYearMonth = null;
	if (generatorData['operating-year-month']) {
		const parts = generatorData['operating-year-month'].split('-');
		if (parts.length === 2) {
			operatingYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	// These fields may not be present
	let plannedDerateYearMonth = null;
	let plannedUprateYearMonth = null;
	let plannedRetirementYearMonth = null;
	
	if (generatorData['planned-derate-year-month']) {
		const parts = generatorData['planned-derate-year-month'].split('-');
		if (parts.length === 2) {
			plannedDerateYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	if (generatorData['planned-uprate-year-month']) {
		const parts = generatorData['planned-uprate-year-month'].split('-');
		if (parts.length === 2) {
			plannedUprateYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	if (generatorData['planned-retirement-year-month']) {
		const parts = generatorData['planned-retirement-year-month'].split('-');
		if (parts.length === 2) {
			plannedRetirementYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	console.log(`Upserting generator: ${compoundId} - ${name}, Energy: ${energySourceDesc}, Mover: ${generatorCode}`);
	
	// Upsert the generator
	const result = await sql`
		INSERT INTO eia_generators (
			compound_id,
			plant_id,
			generator_code,
			name,
			technology_description,
			energy_source_code,
			energy_source_description,
			prime_mover_code,
			prime_mover_description,
			operating_status,
			nameplate_capacity_mw,
			net_summer_capacity_mw,
			net_winter_capacity_mw,
			operating_year_month,
			planned_derate_summer_cap_mw,
			planned_derate_year_month,
			planned_uprate_summer_cap_mw,
			planned_uprate_year_month,
			planned_retirement_year_month,
			metadata,
			created_at,
			updated_at
		) VALUES (
			${compoundId},
			${plantId},
			${generatorCode},
			${name},
			${technologyDesc},
			${energySourceDesc},
			${energySourceDesc},
			${generatorCode},
			${generatorCode},
			${generatorData.status || generatorData.statusDescription || 'unknown'},
			${nameplateCapacityMw},
			${netSummerCapacityMw},
			${netWinterCapacityMw},
			${operatingYearMonth},
			${generatorData['planned-derate-summer-cap-mw'] ? parseFloat(generatorData['planned-derate-summer-cap-mw']) : null},
			${plannedDerateYearMonth},
			${generatorData['planned-uprate-summer-cap-mw'] ? parseFloat(generatorData['planned-uprate-summer-cap-mw']) : null},
			${plannedUprateYearMonth},
			${plannedRetirementYearMonth},
			${JSON.stringify(generatorData)}::jsonb,
			CURRENT_TIMESTAMP,
			CURRENT_TIMESTAMP
		)
		ON CONFLICT (compound_id) 
		DO UPDATE SET
			plant_id = EXCLUDED.plant_id,
			generator_code = EXCLUDED.generator_code,
			name = EXCLUDED.name,
			technology_description = EXCLUDED.technology_description,
			energy_source_code = EXCLUDED.energy_source_code,
			energy_source_description = EXCLUDED.energy_source_description,
			prime_mover_code = EXCLUDED.prime_mover_code,
			prime_mover_description = EXCLUDED.prime_mover_description,
			operating_status = EXCLUDED.operating_status,
			nameplate_capacity_mw = EXCLUDED.nameplate_capacity_mw,
			net_summer_capacity_mw = EXCLUDED.net_summer_capacity_mw,
			net_winter_capacity_mw = EXCLUDED.net_winter_capacity_mw,
			operating_year_month = EXCLUDED.operating_year_month,
			planned_derate_summer_cap_mw = EXCLUDED.planned_derate_summer_cap_mw,
			planned_derate_year_month = EXCLUDED.planned_derate_year_month,
			planned_uprate_summer_cap_mw = EXCLUDED.planned_uprate_summer_cap_mw,
			planned_uprate_year_month = EXCLUDED.planned_uprate_year_month,
			planned_retirement_year_month = EXCLUDED.planned_retirement_year_month,
			metadata = EXCLUDED.metadata,
			updated_at = CURRENT_TIMESTAMP
		RETURNING id
	`;
	
	return result[0].id;
}

// Function to insert plant statistics
async function createPlantStat(plantId: number, statData: any): Promise<void> {
	// Extract stats data from API response
	const nameplateCapacityMw = parseFloat(statData['nameplate-capacity-mw']) || null;
	const netSummerCapacityMw = parseFloat(statData['net-summer-capacity-mw']) || null;
	const netWinterCapacityMw = parseFloat(statData['net-winter-capacity-mw']) || null;
	
	// We may not have these fields, but include them just in case
	const plannedDerateSummerCapMw = statData['planned-derate-summer-cap-mw'] ? 
		parseFloat(statData['planned-derate-summer-cap-mw']) : null;
	const plannedUprateSummerCapMw = statData['planned-uprate-summer-cap-mw'] ? 
		parseFloat(statData['planned-uprate-summer-cap-mw']) : null;
	
	// Parse dates
	let operatingYearMonth = null;
	if (statData['operating-year-month']) {
		const parts = statData['operating-year-month'].split('-');
		if (parts.length === 2) {
			operatingYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	// These fields may not be present in the data
	let plannedDerateYearMonth = null;
	let plannedUprateYearMonth = null;
	let plannedRetirementYearMonth = null;
	
	if (statData['planned-derate-year-month']) {
		const parts = statData['planned-derate-year-month'].split('-');
		if (parts.length === 2) {
			plannedDerateYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	if (statData['planned-uprate-year-month']) {
		const parts = statData['planned-uprate-year-month'].split('-');
		if (parts.length === 2) {
			plannedUprateYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	if (statData['planned-retirement-year-month']) {
		const parts = statData['planned-retirement-year-month'].split('-');
		if (parts.length === 2) {
			plannedRetirementYearMonth = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	// Insert new stat record
	await sql`
		INSERT INTO eia_plant_capacity (
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

// Modify processDataBatch to handle generators
async function processDataBatch(data: any): Promise<number> {
	if (!data.response || !data.response.data) {
		console.log("No data in response");
		return 0;
	}
	
	const dataItems = data.response.data;
	console.log(`Processing ${dataItems.length} items`);
	
	// Group items by plant ID to handle multiple generators per plant
	const plantGroups: { [key: string]: any[] } = {};
	
	// First, group all items by plant ID
	for (const item of dataItems) {
		const plantId = item.plantid || item.plantCode || 'unknown';
		if (!plantGroups[plantId]) {
			plantGroups[plantId] = [];
		}
		plantGroups[plantId].push(item);
	}
	
	let processedCount = 0;
	
	// Process each plant and its generators
	for (const [plantId, items] of Object.entries(plantGroups)) {
		try {
			// Save the raw API responses to file
			for (const item of items) {
				await appendApiResponse(item);
			}
			
			// Use the first item for plant-level data
			const plantData = items[0];
			
			// Upsert entity and plant
			const entityId = await upsertEntity(plantData);
			const dbPlantId = await upsertPowerPlant(plantData, entityId);
			
			// Process each generator for this plant
			for (const item of items) {
				await upsertGenerator(item, dbPlantId);
			}
			
			// Calculate aggregate plant capacity from all generators
			let totalNameplateCapacity = 0;
			let totalNetSummerCapacity = 0;
			let totalNetWinterCapacity = 0;
			
			for (const item of items) {
				totalNameplateCapacity += parseFloat(item['nameplate-capacity-mw'] || '0') || 0;
				totalNetSummerCapacity += parseFloat(item['net-summer-capacity-mw'] || '0') || 0;
				totalNetWinterCapacity += parseFloat(item['net-winter-capacity-mw'] || '0') || 0;
			}
			
			// Create aggregated plant stat record
			await createPlantStat(dbPlantId, {
				...plantData,
				'nameplate-capacity-mw': totalNameplateCapacity,
				'net-summer-capacity-mw': totalNetSummerCapacity,
				'net-winter-capacity-mw': totalNetWinterCapacity,
				// Keep other fields from the first item
			});
			
			processedCount += items.length;
			console.log(`Processed plant ${plantId} with ${items.length} generators`);
		} catch (error) {
			console.error(`Error processing plant ${plantId}:`, error);
		}
	}
	
	console.log(`Successfully processed ${processedCount} out of ${dataItems.length} items`);
	return dataItems.length;
}

async function main() {
	try {
		// Reset the API responses file at the start
		await resetApiResponsesFile();
		
		// Parse command line arguments for starting point
		const args = process.argv.slice(2);
		let startingPoint = 0;
		
		if (args.length > 0) {
			const parsedValue = parseInt(args[0], 10);
			if (!isNaN(parsedValue) && parsedValue >= 0) {
				startingPoint = parsedValue;
				console.log(`Starting from point: ${startingPoint}`);
			} else {
				console.warn(`Invalid starting point provided: ${args[0]}. Starting from 0.`);
			}
		}
		
		// Calculate initial page number based on starting point
		let page = Math.floor(startingPoint / PAGE_SIZE);
		// Calculate the offset within the page
		const offset = startingPoint % PAGE_SIZE;
		
		console.log(`Starting from page ${page} (offset ${offset})`);
		
		// First, get the data and log the structure - only if starting from beginning
		if (page === 0) {
			const sampleData = await getPageOfGenerationCapacity(0, 3);
			
			console.log('API Response Structure:');
			console.log('Response keys:', JSON.stringify(sampleData, null, 4));
			
			if (sampleData.response && sampleData.response.data && sampleData.response.data.length > 0) {
				console.log('First item keys:', Object.keys(sampleData.response.data[0]));
				console.log('First item sample:', JSON.stringify(sampleData.response.data[0], null, 2));
			}
		}
		
		// Now continue with normal processing
		let totalProcessed = 0;
		let hasMoreData = true;
		let finalResponse = null;
		let consecutiveEmptyResponses = 0;
		const maxConsecutiveEmptyResponses = 3; // Allow up to 3 consecutive empty responses before giving up
		
		console.log(`Starting EIA API capacity data import from page ${page}...`);
		
		while (hasMoreData) {
			const data = await getPageOfGenerationCapacity(page);
			
			// Store this response - it will become the final one when the loop exits
			finalResponse = data;
			
			// Check if we got valid data
			if (!data.response || !data.response.data || data.response.data.length === 0) {
				console.log(`No data received for page ${page}`);
				
				// Count consecutive empty responses
				consecutiveEmptyResponses++;
				
				if (consecutiveEmptyResponses >= maxConsecutiveEmptyResponses) {
					console.log(`Received ${maxConsecutiveEmptyResponses} consecutive empty responses. Stopping.`);
					hasMoreData = false;
					break;
				}
				
				console.log(`Waiting 3 seconds before trying next page...`);
				await new Promise(resolve => setTimeout(resolve, 3000));
				page++; // Still move to next page
				continue;
			}
			
			// Reset counter when we get data
			consecutiveEmptyResponses = 0;
			
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
		
		// Log the final response in its entirety
		console.log("\n\n====== FINAL API RESPONSE ======");
		console.log(JSON.stringify(finalResponse, null, 2));
		console.log("================================\n\n");
		
		// Save final response to a dedicated file for easier inspection
		const finalResponsePath = resolve(TEMP_DIR_PATH, '__eia_final_capacity_response.json');
		await fsp.writeFile(finalResponsePath, JSON.stringify(finalResponse, null, 2), { encoding: 'utf8' });
		console.log(`Final response saved to: ${finalResponsePath}`);
		
		console.log(`Capacity import complete! Total processed: ${totalProcessed} records`);
		console.log(`Raw API responses saved to: ${API_RESPONSES_FILE}`);
		
	} catch (error) {
		console.error("Error in main process:", error);
	} finally {
		// Close database connection
		await sql.end();
		console.log("Database connection closed");
	}
}

main();
