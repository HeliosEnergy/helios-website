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
const API_RESPONSES_FILE = resolve(TEMP_DIR_PATH, '__vast_api_responses.json');
const UNKNOWN_GPUS_LOG_FILE = resolve(TEMP_DIR_PATH, 'unknown_gpus.log');

interface VastOffer {
	id: number;
	ask_contract_id?: number;
	bundle_id?: number;
	bundled_results?: any;
	bw_nvlink?: number;
	cuda_max_good: string;
	compute_cap: number;
	cpu_arch?: string;
	cpu_name: string;
	cpu_cores: number;
	cpu_cores_effective?: number;
	cpu_ghz?: number;
	cpu_ram: number;
	credit_discount_max?: number;
	disk_bw?: number;
	disk_name?: string;
	disk_space?: number;
	dlperf: number;
	dlperf_per_dphtotal?: number;
	dph_base?: number;
	dph_total: number;
	driver_version: string;
	driver_vers?: number;
	duration: string | null;
	end_date?: number;
	external?: any;
	flops_per_dphtotal?: number;
	geolocation?: string;
	geolocode?: number;
	gpu_arch?: string;
	gpu_display_active?: boolean;
	gpu_frac?: number;
	gpu_ids?: number[];
	gpu_lanes?: number;
	gpu_mem_bw?: number;
	gpu_name: string;
	gpu_ram: number;
	gpu_total_ram?: number;
	gpu_max_power?: number;
	gpu_max_temp?: number;
	has_avx?: number;
	host_id?: number;
	hosting_type?: number;
	hostname?: string | null;
	inet_up: number;
	inet_down: number;
	inet_up_cost: number;
	inet_down_cost: number;
	is_bid: boolean;
	logo?: string;
	machine_id: number;
	min_bid: number;
	motherboard_name: string;
	mobo_name?: string;
	num_gpus?: number;
	os_version?: string;
	pci_gen: number;
	pcie_bw?: number;
	public_ipaddr?: string;
	reliability: number;
	reliability_mult?: number;
	rentable?: boolean;
	rented?: boolean;
	score: number;
	start_date?: number | null;
	static_ip?: boolean;
	storage_cost: number;
	storage_total: number;
	storage_total_cost?: number;
	total_flops?: number;
	verification: string;
	vericode?: number;
	vram_costperhour?: number;
	webpage?: string | null;
	vms_enabled?: boolean;
	expected_reliability?: number;
	rn?: number;
	dph_total_adj?: number;
	reliability2?: number;
	discount_rate?: number | null;
	discounted_hourly?: number;
	discounted_dph_total?: number;
	search?: {
		gpuCostPerHour?: number;
		diskHour?: number;
		totalHour?: number;
		discountTotalHour?: number;
		discountedTotalPerHour?: number;
	};
	instance?: {
		gpuCostPerHour?: number;
		diskHour?: number;
		totalHour?: number;
		discountTotalHour?: number;
		discountedTotalPerHour?: number;
	};
	time_remaining?: string;
	time_remaining_isbid?: string;
	internet_up_cost_per_tb?: number;
	internet_down_cost_per_tb?: number;
	url?: string;
}

async function resetApiResponsesFile() {
	try {
		await fsp.mkdir(TEMP_DIR_PATH, { recursive: true });
		await fsp.writeFile(API_RESPONSES_FILE, '', { encoding: 'utf8' });
		console.log(`Created empty file for API responses at: ${API_RESPONSES_FILE}`);
	} catch (error) {
		console.error(`Error creating/clearing API responses file: ${error}`);
		throw error;
	}
}

async function appendApiResponse(record: any): Promise<void> {
	try {
		const recordStr = JSON.stringify(record) + '\n';
		await fsp.appendFile(API_RESPONSES_FILE, recordStr, { encoding: 'utf8' });
	} catch (error) {
		console.error(`Error appending record to API responses file: ${error}`);
	}
}

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
	
	return result.length > 0 ? result[0].id : null;
}

async function logUnknownGPU(gpuName: string, machineId: number): Promise<void> {
	try {
		const logEntry = `${new Date().toISOString()},${machineId},${gpuName}\n`;
		await fsp.appendFile(UNKNOWN_GPUS_LOG_FILE, logEntry, { encoding: 'utf8' });
	} catch (error) {
		console.error(`Error logging unknown GPU: ${error}`);
	}
}

async function upsertGPUVastSystem(offer: VastOffer): Promise<number | null> {
	console.log(`Upserting system: ${offer.machine_id} - ${offer.gpu_name}`);
	
	let gpuId = await findGPUByNameOrAlias(offer.gpu_name);
	
	if (gpuId === null || gpuId === undefined) {
		console.warn(`WARNING: Could not find a matching GPU for "${offer.gpu_name}". Logging and skipping.`);
		await logUnknownGPU(offer.gpu_name, offer.machine_id);
		return null; // Return null to indicate this system should be skipped
	}
	

	const result = await sql`
		INSERT INTO gpu_vast_system (
			vast_system_id,
			name,
			gpu_id,
			memory,
			cpu_name,
			cpu_cores,
			cpu_speed_ghz,
			cuda_version,
			driver_version,
			geolocation,
			geolocode,
			pci_gen,
			vms_enabled,
			mobo_name
		) VALUES (
			${offer.machine_id || null},
			${offer.hostname || null},
			${gpuId},
			${offer.gpu_ram || null},
			${offer.cpu_name || null},
			${offer.cpu_cores || null},
			${offer.cpu_ghz || null},
			${offer.cuda_max_good || null},
			${offer.driver_version || null},
			${offer.geolocation || null},
			${offer.geolocode || null},
			${offer.pci_gen || null},
			${offer.vms_enabled || null},
			${offer.motherboard_name || null}
		)
		ON CONFLICT (vast_system_id)
		DO UPDATE SET
			name = EXCLUDED.name,
			gpu_id = EXCLUDED.gpu_id,
			memory = EXCLUDED.memory,
			cpu_name = EXCLUDED.cpu_name,
			cpu_cores = EXCLUDED.cpu_cores,
			cuda_version = EXCLUDED.cuda_version,
			driver_version = EXCLUDED.driver_version,
			pci_gen = EXCLUDED.pci_gen,
			mobo_name = EXCLUDED.mobo_name,
			updated_at = CURRENT_TIMESTAMP
		RETURNING id
	`;
	
	return result[0].id;
}

async function upsertGPUVastOffer(offer: VastOffer): Promise<number> {
	console.log(`Upserting offer: ${offer.id}`);
	
	// Check if url exists and extract the ID safely
	const urlId = offer.url ? (offer.url.split('/').pop() || null) : null;
	
	const result = await sql`
		INSERT INTO gpu_vast_offer (
			offer_id,
			offer_url,
			offer_url_id
		) VALUES (
			${offer.id},
			${offer.url || null},
			${urlId}
		)
		ON CONFLICT (offer_id)
		DO UPDATE SET
			offer_url = EXCLUDED.offer_url,
			offer_url_id = EXCLUDED.offer_url_id,
			created_at = CURRENT_TIMESTAMP
		RETURNING id
	`;
	
	return result[0].id;
}

async function upsertGPUVastSystemUpdate(systemId: number, offerId: number, offer: VastOffer): Promise<void> {
	console.log(`Upserting system update for system ${systemId} with offer ${offerId}`);
	
	await sql`
		INSERT INTO gpu_vast_system_update (
			gpu_vast_system_id,
			latest_offer_id,
			reliability,
			score,
			disk_space,
			inet_up,
			inet_up_cost,
			inet_down,
			inet_down_cost,
			is_bid,
			min_bid,
			ip_address,
			storage_cost,
			storage_total_cost,
			total_flops,
			cost_per_hour,
			disk_per_hour,
			time_remaining,
			time_remaining_isbid
		) VALUES (
			${systemId},
			${offerId},
			${offer.reliability || null},
			${offer.score || null},
			${offer.storage_total || null},
			${offer.inet_up || null},
			${offer.inet_up_cost || null},
			${offer.inet_down || null},
			${offer.inet_down_cost || null},
			${offer.is_bid || null},
			${offer.min_bid || null},
			${null},
			${offer.storage_cost || null},
			${offer.storage_cost * offer.storage_total || null},
			${offer.dlperf || null},
			${offer.dph_total || null},
			${offer.storage_cost || null},
			${offer.duration || null},
			${offer.duration || null}
		)
		ON CONFLICT (gpu_vast_system_id, latest_offer_id)
		DO UPDATE SET
			reliability = EXCLUDED.reliability,
			score = EXCLUDED.score,
			disk_space = EXCLUDED.disk_space,
			inet_up = EXCLUDED.inet_up,
			inet_up_cost = EXCLUDED.inet_up_cost,
			inet_down = EXCLUDED.inet_down,
			inet_down_cost = EXCLUDED.inet_down_cost,
			is_bid = EXCLUDED.is_bid,
			min_bid = EXCLUDED.min_bid,
			storage_cost = EXCLUDED.storage_cost,
			storage_total_cost = EXCLUDED.storage_total_cost,
			total_flops = EXCLUDED.total_flops,
			cost_per_hour = EXCLUDED.cost_per_hour,
			disk_per_hour = EXCLUDED.disk_per_hour,
			time_remaining = EXCLUDED.time_remaining,
			time_remaining_isbid = EXCLUDED.time_remaining_isbid
	`;
}

async function processVastData(offers: VastOffer[]): Promise<void> {
	// Create/clear the unknown GPUs log file
	await fsp.writeFile(UNKNOWN_GPUS_LOG_FILE, 'timestamp,machine_id,gpu_name\n', { encoding: 'utf8' });
	
	for (const offer of offers) {
		try {
			await appendApiResponse(offer);
			
			const systemId = await upsertGPUVastSystem(offer);
			
			// Skip this offer if the system couldn't be created (unknown GPU)
			if (systemId === null) {
				console.log(`Skipping offer ${offer.id} due to unknown GPU "${offer.gpu_name}"`);
				continue;
			}
			
			const offerId = await upsertGPUVastOffer(offer);
			await upsertGPUVastSystemUpdate(systemId, offerId, offer);
			
			console.log(`Processed offer ${offer.id} for system ${offer.machine_id}`);
		} catch (error) {
			console.error(`Error processing offer ${offer.id}:`, error);
		}
	}
}


type VastStats = {[gpuName: string]: {
	offers: VastOffer[];
	total_offers: number;
	min_price: number;
	max_price: number;
	avg_price: number;
}}

function aggregateVastStats(offers: VastOffer[]): VastStats {
	const stats: VastStats = {};

	for (const offer of offers) {
		if (!stats[offer.gpu_name]) {
			stats[offer.gpu_name] = {
				offers: [],
				total_offers: 0,
				min_price: offer.dph_total,
				max_price: offer.dph_total,
				avg_price: offer.dph_total
			};
		}

		stats[offer.gpu_name].offers.push(offer);
	}

	for (const gpuName in stats) {
		const gpuStats = stats[gpuName];
		gpuStats.total_offers = gpuStats.offers.length;
		gpuStats.avg_price = gpuStats.offers.reduce((sum, offer) => sum + offer.dph_total, 0) / gpuStats.offers.length;
		gpuStats.min_price = Math.min(...gpuStats.offers.map(offer => offer.dph_total));
		gpuStats.max_price = Math.max(...gpuStats.offers.map(offer => offer.dph_total));
		gpuStats.offers = [];
	}

	return stats;
}



async function fetchVastData(): Promise<void> {
	try {
		await resetApiResponsesFile();

		const myHeaders = new Headers();
		myHeaders.append("Accept", "application/json");
		myHeaders.append("Content-Type", "application/json");

		const body = {
			"q": {
				"limit": 100000
			}
		};

		const requestOptions: RequestInit = {
			method: 'PUT',
			headers: myHeaders,
			body: JSON.stringify(body),
			redirect: 'follow'
		};

		const response = await fetch("https://console.vast.ai/api/v0/search/asks/", requestOptions);
		const result = await response.text();
		
		// Write raw response to file
		const tempFilePath = resolve(TEMP_DIR_PATH, 'vast_data_raw.json');
		await fsp.writeFile(tempFilePath, result);
		
		const data = JSON.parse(result);
		console.log(`Retrieved ${data.offers.length} offers`);

		const statsFilePath = resolve(TEMP_DIR_PATH, 'vast_stats.json');
		const stats = aggregateVastStats(data.offers);
		await fsp.writeFile(statsFilePath, JSON.stringify(stats, null, 2));

		
		console.log("%%FILE%%" + statsFilePath + "%%/FILE%%");
	} catch (error) {
		console.error('Error:', error);
	} finally {
		await sql.end();
		console.log("Database connection closed");
	}
}

// Run the script
fetchVastData();