import { CUSTOM_ALPHABET, EIA_BULK_FILE_ELEC } from "./const.ts";

import AdmZip from "adm-zip";
import { EIAElectricityData, EIAManifestData } from "./const.ts";
import fs from "fs";
import { default as fsp } from "fs/promises";
import { customAlphabet } from "nanoid";
import readline from "readline";
import dotenv from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';
import { createEIAElectricityData } from '@helios/analysis_db/schema/analysis_db/query_sql.ts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

const sql = postgres({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

export let EIA_DATA: {
	manifest: EIAManifestData[];
	electricity: EIAElectricityData[];
} = {
	manifest: [],
	electricity: []
}

interface DownloadCache {
	[url: string]: {
		timestamp: number;
		filePath: string;
	}
}

async function loadDownloadCache(): Promise<DownloadCache> {
	const cachePath = '../../data/temp/__cached_download.json'
	try {
		const data = await fsp.readFile(cachePath, 'utf-8')
		return JSON.parse(data)
	} catch {
		return {}
	}
}

async function saveDownloadCache(cache: DownloadCache) {
	const cachePath = '../../data/temp/__cached_download.json'
	await fsp.writeFile(cachePath, JSON.stringify(cache, null, 2))
}

// returns the path to the unzipped directory
async function downloadAndUnzipFile(url: string): Promise<string> {
	// Load cache
	const cache = await loadDownloadCache()
	const oneHourAgo = Date.now() - (60 * 60 * 1000)

	// Check if we have a recent cached download
	if (cache[url] && cache[url].timestamp > oneHourAgo) {
		console.log(`Using cached file for ${url}`)
		return cache[url].filePath
	}

	console.log(`Downloading and unzipping ${url}`)
	const nanoidId = CUSTOM_ALPHABET(16)
	const path = `../../data/temp/${nanoidId}`
	const response = await fetch(url)
	const buffer = await response.arrayBuffer()
	await fsp.writeFile(`${path}.zip`, Buffer.from(buffer))
	try {
		const zip = new AdmZip(`${path}.zip`);
		await zip.extractAllTo(path, true); // true = overwrite files
		console.log(`Extraction complete ${url}`);
	} catch (error) {
		console.error('Error extracting zip file:', error);
		throw error;
	}
	await fsp.rm(`${path}.zip`)

	const files = await fsp.readdir(path)
	const filePaths = files.map(file => `${path}/${file}`)

	await fsp.mkdir(`../../data/temp/eia`, { recursive: true })
	let completedFilePaths: string[] = []
	await Promise.all(filePaths.map(async (filePath) => {
		const fileName = filePath.split('/').pop()
		await fsp.rename(filePath, `../../data/temp/eia/${fileName}`)
		completedFilePaths.push(`../../data/temp/eia/${fileName}`)
	}))
	await fsp.rm(path, { recursive: true })

	// Update cache with new download
	cache[url] = {
		timestamp: Date.now(),
		filePath: completedFilePaths[0]
	}
	await saveDownloadCache(cache)

	console.log(`Unzipped file ${url} to ${filePaths[0]}`)
	return completedFilePaths[0]
}

// Update the helper function to handle all date formats
function parseQuarterDate(dateStr: string): Date | null {
	if (!dateStr) return null;
	
	// Try quarter format (e.g., "2001Q1")
	const quarterMatch = dateStr.match(/^(\d{4})Q(\d)$/);
	if (quarterMatch) {
		const year = parseInt(quarterMatch[1]);
		const quarter = parseInt(quarterMatch[2]);
		const month = (quarter - 1) * 3; // Q1->0, Q2->3, Q3->6, Q4->9
		return new Date(Date.UTC(year, month, 1));
	}

	// Try YYYYMM format (e.g., "202101")
	const yearMonthMatch = dateStr.match(/^(\d{4})(\d{2})$/);
	if (yearMonthMatch) {
		const year = parseInt(yearMonthMatch[1]);
		const month = parseInt(yearMonthMatch[2]) - 1; // JS months are 0-based
		return new Date(Date.UTC(year, month, 1));
	}

	// Try year-only format (e.g., "2001")
	const yearMatch = dateStr.match(/^(\d{4})$/);
	if (yearMatch) {
		const year = parseInt(yearMatch[1]);
		return new Date(Date.UTC(year, 0, 1)); // January 1st of that year
	}

	return null;
}

async function electricityDataProcessing(filePath: string) {
	const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
	const reader = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of reader) {
		try {
			if (!line) continue;
			const entry = JSON.parse(line);

			
			await createEIAElectricityData(sql, {
				seriesId: entry.series_id,
				name: entry.name,
				units: entry.units,
				frequency: entry.f || null,
				copyright: entry.copyright || null,
				source: entry.source || null,
				iso3166: entry.iso3166 || null,
				longitude: parseFloat(entry.lon),
				latitude: parseFloat(entry.lat),
				geography: entry.geography || null,
				startDate: parseQuarterDate(entry.start),
				endDate: parseQuarterDate(entry.end),
				lastUpdated: new Date(entry.last_updated),
				data: JSON.stringify(entry.data)
			});
		} catch (error) {
			console.error(`Error processing line: |${line}|`);
			console.error(error);
			throw error;
		}
	}

	await sql.end();
}

export async function scrapeEIAData() {
	const fileDownloads = [
		downloadAndUnzipFile(EIA_BULK_FILE_ELEC)
	]
	const filePaths = await Promise.all(fileDownloads)

	const electricityData = await electricityDataProcessing(filePaths[0])
	console.log(electricityData)
}


scrapeEIAData()