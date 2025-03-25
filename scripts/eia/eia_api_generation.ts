import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import postgres from 'postgres';
import { default as fsp } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });


const PAGE_SIZE = 5000
;

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
const API_RESPONSES_FILE = resolve(TEMP_DIR_PATH, '__eia_api_generation_responses.json');

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

// Define API endpoint for facility-fuel data
const API_URL_GENERATION = "https://api.eia.gov/v2/electricity/facility-fuel/data";

async function getPageOfGeneration(page: number, pageSize: number = PAGE_SIZE) {
	const url = `${API_URL_GENERATION}`
		+ `?api_key=${process.env.EIA_API_KEY}`
		+ `&offset=${page * pageSize}`
		+ `&length=${pageSize}`
		+ `&data[0]=average-heat-content`
		+ `&data[1]=consumption-for-eg`
		+ `&data[2]=consumption-for-eg-btu`
		+ `&data[3]=generation`
		+ `&data[4]=gross-generation`
		+ `&data[5]=total-consumption`
		+ `&data[6]=total-consumption-btu`
		+ `&frequency=monthly`
		+ `&sort[0][column]=period`
		+ `&sort[0][direction]=desc`;
	console.log(url);
	
	try {
		const response = await fetch(url);
		
		// First get the response as text
		const textResponse = await response.text();
		
		// Check if it looks like HTML (contains DOCTYPE or html tags)
		if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
			console.error('API RETURNED HTML ERROR:');
			console.error('-----------------------------------------------------');
			console.error(textResponse);
			console.error('-----------------------------------------------------');
			throw new Error('API returned HTML instead of JSON');
		}
		
		// If it's not HTML, parse it as JSON
		const data = JSON.parse(textResponse);
		return data;
	} catch (error) {
		console.error(`Error in getPageOfGeneration:`, error);
		throw error;
	}
}

// Helper function to find matching plant and generator IDs
async function findMatchingPlantAndGenerator(item: any): Promise<{plantId: number | null, generatorId: number | null}> {
	// Try to find the plant first
	let plantId = null;
	let generatorId = null;
	
	if (item.plantCode) {
		const result = await sql`
			SELECT id FROM eia_power_plants 
			WHERE api_plant_id = ${item.plantCode}
		`;
		if (result.length > 0) {
			plantId = result[0].id;
			
			// If we have a generator ID, try to find that specific generator
			if (item.generatorid) {
				const compoundId = `${item.plantCode}_${item.generatorid}`;
				const genResult = await sql`
					SELECT id FROM eia_generators 
					WHERE compound_id = ${compoundId}
				`;
				if (genResult.length > 0) {
					generatorId = genResult[0].id;
				}
			}
		}
	}
	
	// If no direct match, try to find by name and state
	if (!plantId && item.plantName && item.stateCode) {
		const result = await sql`
			SELECT id FROM eia_power_plants 
			WHERE name = ${item.plantName} AND state = ${item.stateCode}
		`;
		if (result.length > 0) {
			plantId = result[0].id;
		}
	}
	
	return { plantId, generatorId };
}

// Function to insert plant generation data
async function createPlantGeneration(plantId: number, genData: any, generatorId: number | null = null): Promise<void> {
	// Extract generation data from API response
	const period = genData.period || null;
	const generation = genData.generation ? parseFloat(genData.generation) : null;
	const generationUnits = genData['generation-units'] || null;
	const grossGeneration = genData['gross-generation'] ? parseFloat(genData['gross-generation']) : null;
	const grossGenerationUnits = genData['gross-generation-units'] || null;
	
	// Consumption-related fields
	const consumptionForEg = genData['consumption-for-eg'] ? parseFloat(genData['consumption-for-eg']) : null;
	const consumptionForEgUnits = genData['consumption-for-eg-units'] || null;
	const consumptionForEgBtu = genData['consumption-for-eg-btu'] ? parseFloat(genData['consumption-for-eg-btu']) : null;
	const consumptionForEgBtuUnits = genData['consumption-for-eg-btu-units'] || null;
	
	// Total consumption
	const totalConsumption = genData['total-consumption'] ? parseFloat(genData['total-consumption']) : null;
	const totalConsumptionUnits = genData['total-consumption-units'] || null;
	const totalConsumptionBtu = genData['total-consumption-btu'] ? parseFloat(genData['total-consumption-btu']) : null;
	const totalConsumptionBtuUnits = genData['total-consumption-btu-units'] || null;
	
	// Heat content
	const averageHeatContent = genData['average-heat-content'] ? parseFloat(genData['average-heat-content']) : null;
	const averageHeatContentUnits = genData['average-heat-content-units'] || null;
	
	// Get source timestamp from period
	let sourceTimestamp = null;
	if (period) {
		const parts = period.split('-');
		if (parts.length === 2) {
			sourceTimestamp = new Date(`${parts[0]}-${parts[1]}-01`);
		}
	}
	
	// Insert generation record with generator_id if available
	await sql`
		INSERT INTO eia_plant_generation (
			plant_id,
			generator_id,
			timestamp,
			period,
			generation,
			generation_units,
			gross_generation,
			gross_generation_units,
			consumption_for_eg,
			consumption_for_eg_units,
			consumption_for_eg_btu,
			consumption_for_eg_btu_units,
			total_consumption,
			total_consumption_units,
			total_consumption_btu,
			total_consumption_btu_units,
			average_heat_content,
			average_heat_content_units,
			source_timestamp,
			metadata
		) VALUES (
			${plantId},
			${generatorId},
			CURRENT_TIMESTAMP,
			${period},
			${generation},
			${generationUnits},
			${grossGeneration},
			${grossGenerationUnits},
			${consumptionForEg},
			${consumptionForEgUnits},
			${consumptionForEgBtu},
			${consumptionForEgBtuUnits},
			${totalConsumption},
			${totalConsumptionUnits},
			${totalConsumptionBtu},
			${totalConsumptionBtuUnits},
			${averageHeatContent},
			${averageHeatContentUnits},
			${sourceTimestamp},
			${JSON.stringify(genData)}::jsonb
		)
	`;
}

// Function to process a batch of generation data
async function processGenerationDataBatch(data: any): Promise<number> {
	if (!data.response || !data.response.data) {
		console.log("No generation data in response");
		return 0;
	}
	
	const dataItems = data.response.data;
	console.log(`Processing ${dataItems.length} generation items`);
	
	let processedCount = 0;
	for (const item of dataItems) {
		try {
			// Log first item for debugging
			if (processedCount === 0) {
				console.log('First generation item structure:');
				console.log(JSON.stringify(item, null, 2));
			}
			
			// Save the raw API response to file
			await appendApiResponse(item);
			
			// Find matching plant and generator
			const { plantId, generatorId } = await findMatchingPlantAndGenerator(item);
			
			if (plantId) {
				// Create generation record with generator ID if available
				await createPlantGeneration(plantId, item, generatorId);
				processedCount++;
				
				if (processedCount % 100 === 0) {
					console.log(`Processed ${processedCount}/${dataItems.length} generation items`);
				}
			} else {
				console.log(`No matching plant found for generation data:`, 
					item.plantid || item.plantName || JSON.stringify(item).substring(0, 100) + "...");
			}
		} catch (error) {
			console.error(`Error processing generation item:`, error);
			console.error(`Item data:`, JSON.stringify(item).substring(0, 200) + "...");
		}
	}
	
	console.log(`Successfully processed ${processedCount} out of ${dataItems.length} generation items`);
	return dataItems.length;
}

async function main() {
	try {
		// Reset the API responses file at the start
		await resetApiResponsesFile();
		
		// First, get a sample to log the structure
		const sampleData = await getPageOfGeneration(0, 3);
		
		console.log('Generation API Response Structure:');
		console.log('Response keys:', JSON.stringify(sampleData, null, 4));
		
		if (sampleData.response && sampleData.response.data && sampleData.response.data.length > 0) {
			console.log('First generation item keys:', Object.keys(sampleData.response.data[0]));
			console.log('First generation item sample:', JSON.stringify(sampleData.response.data[0], null, 2));
		}
		
		// Now continue with normal processing
		let page = 0;
		let totalProcessed = 0;
		let hasMoreData = true;
		let finalResponse = null;
		
		console.log("Starting EIA API generation data import...");
		
		while (hasMoreData) {
			const data = await getPageOfGeneration(page);
			
			// Store this response
			finalResponse = data;
			
			// Check if we got valid data
			if (!data.response || !data.response.data || data.response.data.length === 0) {
				console.log(`No more generation data to process at page ${page}`);
				hasMoreData = false;
				break;
			}
			
			// Process this batch
			const processedCount = await processGenerationDataBatch(data);
			totalProcessed += processedCount;
			
			console.log(`Completed generation page ${page}, processed ${processedCount} records (total: ${totalProcessed})`);
			
			// Check if we've reached the end
			if (data.response.total && totalProcessed >= data.response.total) {
				console.log(`Processed all ${totalProcessed} generation records`);
				hasMoreData = false;
				break;
			}
			
			// Move to next page
			page++;
			
			// Add a small delay between requests
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		
		// Log the final generation response
		console.log("\n\n====== FINAL GENERATION API RESPONSE ======");
		console.log(JSON.stringify(finalResponse, null, 2));
		console.log("==========================================\n\n");
		
		// Save final generation response to a dedicated file
		const genFinalResponsePath = resolve(TEMP_DIR_PATH, '__eia_final_generation_response.json');
		await fsp.writeFile(genFinalResponsePath, JSON.stringify(finalResponse, null, 2), { encoding: 'utf8' });
		console.log(`Final generation response saved to: ${genFinalResponsePath}`);
		
		console.log(`Generation import complete! Total processed: ${totalProcessed} records`);
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
