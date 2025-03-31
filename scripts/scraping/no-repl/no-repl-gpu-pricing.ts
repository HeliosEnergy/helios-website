import puppeteer from "puppeteer";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import postgres from 'postgres';

console.log("__dirname", __dirname);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Initialize database connection
const sql = postgres({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

// Define an interface for the cloud IDs
interface CloudIdMap {
	[key: string]: number;
}

async function main() {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		userDataDir: './user_data',
		args: ['--window-size=500,500'],
	});

	async function kill() {
		await browser.close();
		process.exit(0);
	}
	
	const page = await browser.newPage();


	const gpu_scrape = await import('../scripts/gpu_scrape')
	const pricing = await gpu_scrape.pricing({
		browser,
		page,
	})

	console.log("FINAL PRICING DATA", pricing);
	
	// do DB insertions here
	try {
		// First, ensure cloud providers are in the database
		const clouds = ['runpod', 'vast', 'cudo', 'tensorDock', 'lambda'];
		const cloudIds: CloudIdMap = {};
		
		for (const cloudName of clouds) {
			const result = await sql`
				INSERT INTO gpu_cloud (name)
				VALUES (${cloudName})
				ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
				RETURNING id
			`;
			cloudIds[cloudName] = result[0].id;
			console.log(`Cloud provider ${cloudName} has ID ${cloudIds[cloudName]}`);
		}
		
		// Process RunPod pricing - RunPod usually has 1 GPU per instance
		if (pricing.runpod && pricing.runpod.length > 0) {
			for (const item of pricing.runpod) {
				// Look up GPU ID using sophisticated matching
				const gpuId = await findGPUByNameOrAlias(item.gpuName);
				if (!gpuId) {
					console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
					continue;
				}
				
				// Get GPU count - typically 1 for RunPod unless specified
				const gpuCount = item.gpuCount || 1;
				
				// Insert secure cloud pricing if exists
				if (item.secureCloudHourlyPricing !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['runpod'], 
						gpuCount,
						item.secureCloudHourlyPricing, 
						'ondemand',
						'secure'
					);
				}
				
				// Insert community cloud pricing if exists
				if (item.communityCloudHourlyPricing !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['runpod'], 
						gpuCount,
						item.communityCloudHourlyPricing, 
						'ondemand',
						'community'
					);
				}
			}
		}
		
		// Process Vast pricing
		if (pricing.vast && pricing.vast.length > 0) {
			for (const item of pricing.vast) {
				const gpuId = await findGPUByNameOrAlias(item.gpuName);
				if (!gpuId) {
					console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
					continue;
				}
				
				// Get GPU count - typically 1 for Vast unless specified
				const gpuCount = item.gpuCount || 1;
				
				// Vast has mixed pricing models - mostly spot instances
				const pricingModel = 'spot';
				
				// Insert median price
				await insertPricing(
					gpuId, 
					cloudIds['vast'], 
					gpuCount,
					item.medPrice, 
					pricingModel,
					null
				);
				
				// Insert min price as a separate entry
				await insertPricing(
					gpuId, 
					cloudIds['vast'], 
					gpuCount,
					item.minPrice, 
					pricingModel,
					'minimum'
				);
				
				// Insert max price as a separate entry
				await insertPricing(
					gpuId, 
					cloudIds['vast'], 
					gpuCount,
					item.maxPrice, 
					pricingModel,
					'maximum'
				);
			}
		}
		
		// Process Cudo pricing
		if (pricing.cudo && pricing.cudo.length > 0) {
			for (const item of pricing.cudo) {
				const gpuId = await findGPUByNameOrAlias(item.gpuName);
				if (!gpuId) {
					console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
					continue;
				}
				
				// Get GPU count - typically 1 for Cudo unless specified
				const gpuCount = item.gpuCount || 1;
				
				// Insert on-demand pricing
				if (item.onDemand !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['cudo'], 
						gpuCount,
						item.onDemand, 
						'ondemand', 
						null
					);
				}
				
				// Insert 1-month pricing
				if (item['1Months'] !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['cudo'], 
						gpuCount,
						item['1Months'], 
						'monthly',
						null
					);
				}
				
				// Insert 3-month pricing
				if (item['3Months'] !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['cudo'], 
						gpuCount,
						item['3Months'], 
						'monthly',
						'three_month'
					);
				}
				
				// Insert 6-month pricing
				if (item['6Months'] !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['cudo'], 
						gpuCount,
						item['6Months'], 
						'monthly',
						'six_month'
					);
				}
			}
		}
		
		// Process TensorDock pricing
		if (pricing.tensorDock && pricing.tensorDock.length > 0) {
			for (const item of pricing.tensorDock) {
				const gpuId = await findGPUByNameOrAlias(item.gpuName);
				if (!gpuId) {
					console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
					continue;
				}
				
				// Get GPU count - typically 1 for TensorDock unless specified
				const gpuCount = item.gpuCount || 1;
				
				if (item.hourly !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['tensorDock'], 
						gpuCount,
						item.hourly, 
						'ondemand', 
						null
					);
				}
			}
		}
		
		// Process Lambda pricing
		if (pricing.lambda && pricing.lambda.length > 0) {
			for (const item of pricing.lambda) {
				const gpuId = await findGPUByNameOrAlias(item.gpuName);
				if (!gpuId) {
					console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
					continue;
				}
				
				// Lambda often has multi-GPU instances
				const gpuCount = item.gpuCount || 1;
				
				if (item.hourly !== null) {
					await insertPricing(
						gpuId, 
						cloudIds['lambda'], 
						gpuCount,
						item.hourly, 
						'ondemand', 
						null
					);
				}
			}
		}
		
		console.log("All pricing data has been inserted successfully!");
	} catch (error) {
		console.error("Error inserting pricing data:", error);
	} finally {
		await sql.end();
		await browser.close();
	}
}

// Better GPU lookup function, similar to vast_api_scrape.ts
async function findGPUByNameOrAlias(gpuName: string): Promise<number | null> {
	console.log(`Looking up GPU: ${gpuName}`);
	
	const normalizedName = gpuName.trim().toUpperCase();
	
	const result = await sql`
		WITH 
		normalized_name AS (
			SELECT ${normalizedName} as name
		),
		exact_match AS (
			SELECT id FROM gpu, normalized_name
			WHERE UPPER(gpu.name) = normalized_name.name
			LIMIT 1
		),
		alias_match AS (
			SELECT id FROM gpu, normalized_name
			WHERE EXISTS (
				SELECT 1 FROM unnest(gpu.aliases) alias
				WHERE UPPER(alias) = normalized_name.name
			)
			LIMIT 1
		),
		partial_match AS (
			SELECT id FROM gpu, normalized_name
			WHERE 
				normalized_name.name LIKE CONCAT('%', UPPER(gpu.name), '%') OR
				UPPER(gpu.name) LIKE CONCAT('%', normalized_name.name, '%')
			ORDER BY LENGTH(gpu.name) DESC
			LIMIT 1
		)
		SELECT id FROM exact_match
		UNION ALL
		SELECT id FROM alias_match WHERE NOT EXISTS (SELECT 1 FROM exact_match)
		UNION ALL
		SELECT id FROM partial_match WHERE NOT EXISTS (SELECT 1 FROM exact_match) AND NOT EXISTS (SELECT 1 FROM alias_match)
		LIMIT 1;
	`;
	
	if (result.length > 0) {
		console.log(`Found match for "${gpuName}": GPU ID ${result[0].id}`);
		return result[0].id;
	}
	
	console.warn(`WARNING: Could not find a matching GPU for "${gpuName}"`);
	return null;
}

// Helper function to insert pricing data, now with gpu_count
async function insertPricing(
	gpuId: number, 
	cloudId: number, 
	gpuCount: number,
	price: number, 
	pricingModel: string, 
	category: string | null = null, 
	region: string | null = null
): Promise<void> {
	try {
		await sql`
			INSERT INTO gpu_cloud_pricing (
				gpu_id,
				gpu_cloud_id,
				gpu_count,
				price_per_hour,
				pricing_model,
				category,
				region
			) VALUES (
				${gpuId},
				${cloudId},
				${gpuCount},
				${price},
				${pricingModel}::gpu_pricing_models,
				${category},
				${region}
			)
		`;
		console.log(`Inserted pricing for GPU ${gpuId}, Count ${gpuCount}, Cloud ${cloudId}, Price ${price}, Model ${pricingModel}${category ? ', Category ' + category : ''}`);
	} catch (error) {
		console.error(`Error inserting pricing:`, error);
	}
}

main();