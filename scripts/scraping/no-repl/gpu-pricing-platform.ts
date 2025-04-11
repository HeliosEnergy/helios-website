import puppeteer from "puppeteer";
import path from 'path';
import { fileURLToPath } from 'url';
import * as fsp from 'fs/promises';
import dotenv from 'dotenv';
import postgres from 'postgres';

// Configure dotenv
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Get the platform from command line argument
const platform = process.argv[2];
if (!platform) {
	console.error("Please specify a platform to scrape (runpod, vast, cudo, tensorDock, lambda)");
	process.exit(1);
}

// Validate platform
const validPlatforms = ['runpod', 'vast', 'cudo', 'tensorDock', 'lambda'];
if (!validPlatforms.includes(platform)) {
	console.error(`Invalid platform: ${platform}`);
	console.error(`Valid platforms are: ${validPlatforms.join(', ')}`);
	process.exit(1);
}

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
		headless: process.env.BROWSER_HEADLESS !== 'false',
		defaultViewport: null,
		userDataDir: './user_data',
		args: [
			'--window-size=1920,1080',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--no-first-run',
			'--no-zygote',
			'--disable-gpu'
		],
	});

	async function kill() {
		await browser.close();
		process.exit(0);
	}
	
	const page = await browser.newPage();

	try {
		console.log("Importing gpu_scrape");
		const gpu_scrape = await import('../scripts/gpu_scrape');
		
		// Get the specific platform scraping function
		const scriptArgs = { browser, page };
		const funcs = gpu_scrape.subFuncs(scriptArgs);
		
		console.log("Imported gpu_scrape", Object.keys(funcs.pricing));

		// Call the appropriate platform function
		if (!funcs.pricing[platform]) {
			throw new Error(`No scraping function found for platform: ${platform}`);
		}
		
		const result = await funcs.pricing[platform]();
		const fileName = path.resolve(path.join(
			__dirname,
			`../../../data/temp/platform_pricing_${platform}_${new Date().toISOString().split('T')[0]}.json`
		));
		console.log("Writing to", fileName);
		await fsp.writeFile(fileName, JSON.stringify(result, null, 2));
		console.log(`Saved to %%FILE%%${fileName}%%/FILE%%`);
		
		// Insert data into the database
		try {
			// Get the cloud provider ID from the seeded table
			const cloudIds: CloudIdMap = {};
			const cloudResult = await sql`
				SELECT id, name 
				FROM gpu_cloud 
				WHERE name = ${platform}
			`;
			
			if (cloudResult.length === 0) {
				throw new Error(`Cloud provider ${platform} not found in gpu_cloud table`);
			}
			
			cloudIds[platform] = cloudResult[0].id;
			console.log(`Cloud provider ${platform} has ID ${cloudIds[platform]}`);
			
			let insertedCount = 0;
			let errorCount = 0;

			console.log("Inserting pricing for", platform);
			
			// Process the data based on the platform
			switch (platform) {
				case 'runpod':
					console.log("Results length", result?.length);
					if (result && result.length > 0) {
						for (const item of result) {
							try {
								const gpuId = await findGPUByNameOrAlias(item.gpuName);
								if (!gpuId) {
									console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
									continue;
								}
								
								const gpuCount = item.gpuCount || 1;
								
								if (item.secureCloudHourlyPricing !== null) {
									await insertPricing(
										gpuId, 
										cloudIds[platform], 
										gpuCount,
										item.secureCloudHourlyPricing, 
										'ondemand',
										'secure'
									);
									insertedCount++;
								}
								
								if (item.communityCloudHourlyPricing !== null) {
									await insertPricing(
										gpuId, 
										cloudIds[platform], 
										gpuCount,
										item.communityCloudHourlyPricing, 
										'ondemand',
										'community'
									);
									insertedCount++;
								}
							} catch (error) {
								console.error(`Error processing item for ${platform}:`, error);
								errorCount++;
							}
						}
					}
					break;
					
				case 'vast':
					if (result && result.length > 0) {
						for (const item of result) {
							const gpuId = await findGPUByNameOrAlias(item.gpuName);
							if (!gpuId) {
								console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
								continue;
							}
							
							const gpuCount = item.gpuCount || 1;
							const pricingModel = 'spot';
							
							await insertPricing(
								gpuId, 
								cloudIds[platform], 
								gpuCount,
								item.medPrice, 
								pricingModel,
								null
							);
							
							await insertPricing(
								gpuId, 
								cloudIds[platform], 
								gpuCount,
								item.minPrice, 
								pricingModel,
								'minimum'
							);
							
							await insertPricing(
								gpuId, 
								cloudIds[platform], 
								gpuCount,
								item.maxPrice, 
								pricingModel,
								'maximum'
							);
						}
					}
					break;
					
				case 'cudo':
					if (result && result.length > 0) {
						for (const item of result) {
							const gpuId = await findGPUByNameOrAlias(item.gpuName);
							if (!gpuId) {
								console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
								continue;
							}
							
							const gpuCount = item.gpuCount || 1;
							
							if (item.onDemand !== null) {
								await insertPricing(
									gpuId, 
									cloudIds[platform], 
									gpuCount,
									item.onDemand, 
									'ondemand', 
									null
								);
							}
							
							if (item['1Months'] !== null) {
								await insertPricing(
									gpuId, 
									cloudIds[platform], 
									gpuCount,
									item['1Months'], 
									'monthly',
									null
								);
							}
							
							if (item['3Months'] !== null) {
								await insertPricing(
									gpuId, 
									cloudIds[platform], 
									gpuCount,
									item['3Months'], 
									'monthly',
									'three_month'
								);
							}
							
							if (item['6Months'] !== null) {
								await insertPricing(
									gpuId, 
									cloudIds[platform], 
									gpuCount,
									item['6Months'], 
									'monthly',
									'six_month'
								);
							}
						}
					}
					break;
					
				case 'tensorDock':
					if (result && result.length > 0) {
						for (const item of result) {
							const gpuId = await findGPUByNameOrAlias(item.gpuName);
							if (!gpuId) {
								console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
								continue;
							}
							
							const gpuCount = item.gpuCount || 1;
							
							if (item.hourly !== null) {
								await insertPricing(
									gpuId, 
									cloudIds[platform], 
									gpuCount,
									item.hourly, 
									'ondemand', 
									null
								);
							}
						}
					}
					break;
					
				case 'lambda':
					if (result && result.length > 0) {
						for (const item of result) {
							const gpuId = await findGPUByNameOrAlias(item.gpuName);
							if (!gpuId) {
								console.warn(`Could not find GPU for "${item.gpuName}" - skipping`);
								continue;
							}
							
							const gpuCount = item.gpuCount || 1;
							
							if (item.hourly !== null) {
								await insertPricing(
									gpuId, 
									cloudIds[platform], 
									gpuCount,
									item.hourly, 
									'ondemand', 
									null
								);
							}
						}
					}
					break;
			}
			
			console.log(`\nSummary for ${platform}:`);
			console.log(`- Total records processed: ${result?.length || 0}`);
			console.log(`- Successfully inserted: ${insertedCount}`);
			console.log(`- Errors encountered: ${errorCount}`);
			
			if (errorCount > 0) {
				throw new Error(`Failed to insert ${errorCount} records for ${platform}`);
			}
			
		} catch (error) {
			console.error(`\nFatal error processing ${platform}:`, error);
			throw error; // Re-throw to be caught by the outer try-catch
		} finally {
			await sql.end();
		}
		
	} catch (error) {
		console.error(`\n------\nError scraping ${platform}:`, error, "\n------\n");
	} finally {
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

	console.log("Inserting pricing for GPU", gpuId, "Cloud", cloudId);
	try {
		const result = await sql`
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
			RETURNING id
		`;
		if (result && result.length > 0) {
			console.log(`Successfully inserted pricing record with ID ${result[0].id} for GPU ${gpuId}, Count ${gpuCount}, Cloud ${cloudId}, Price ${price}, Model ${pricingModel}${category ? ', Category ' + category : ''}`);
		} else {
			throw new Error('No record was inserted');
		}
	} catch (error) {
		console.error(`Error inserting pricing:`, error);
		console.error('SQL Parameters:', { gpuId, cloudId, gpuCount, price, pricingModel, category, region });
		throw error; // Re-throw to be caught by the outer try-catch
	}
}

main();