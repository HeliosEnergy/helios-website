import postgres from 'postgres';
import { config } from 'dotenv';
import { dirname, join, resolve } from 'path';
import { readFileSync } from 'fs';
import { createGPU, createGPUCloud } from './schema/analysis_db/query_sql.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Load environment variables from root .env file
config({ path: resolve(__dirname, '../.env') });


// Database connection configuration
const sql = postgres({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

interface GPU {
  name: string;
  manufacturer: string;
  vram: number;
  int8Flops?: number;
  fp16Flops?: number;
  fp32Flops?: number;
  fp64Flops?: number;
  tdp?: number;
  aliases?: string[];
}

interface CloudMarket {
  name: string;
}

async function seedGPUs() {
  try {
	// Read GPU data
	const gpuPath = join(__dirname, 'schema/seed/gpu.json');
	const gpuData: GPU[] = JSON.parse(readFileSync(gpuPath, 'utf-8'));

	console.log('Seeding GPUs...');
	for (const gpu of gpuData) {
	  try {
		await createGPU(sql, {
		  name: gpu.name,
		  manufacturer: gpu.manufacturer,
		  vram: gpu.vram,
		  // These fields should be made optional in the database schema
		  int8Flops: gpu.int8Flops ?? null,
		  fp16Flops: gpu.fp16Flops ?? null,
		  fp32Flops: gpu.fp32Flops ?? null,
		  fp64Flops: gpu.fp64Flops ?? null,
		  tdp: gpu.tdp ?? null,
		  aliases: gpu.aliases ?? []
		});
		console.log(`Created/Updated GPU: ${gpu.name}`);
	  } catch (error) {
		console.error(`Error processing GPU ${gpu.name}:`, error);
	  }
	}
  } catch (error) {
	console.error('Error seeding GPUs:', error);
  }
}

async function seedCloudMarkets() {
  try {
	// Read Cloud Market data
	const cloudPath = join(__dirname, 'schema/seed/cloud_market.json');
	const cloudData: CloudMarket[] = JSON.parse(readFileSync(cloudPath, 'utf-8'));

	console.log('Seeding Cloud Markets...');
	for (const cloud of cloudData) {
	  try {
		await createGPUCloud(sql, {
		  name: cloud.name,
		});
		console.log(`Created/Updated Cloud Market: ${cloud.name}`);
	  } catch (error) {
		console.error(`Error processing Cloud Market ${cloud.name}:`, error);
	  }
	}
  } catch (error) {
	console.error('Error seeding Cloud Markets:', error);
  }
}

async function main() {
  try {
	await seedGPUs();
	await seedCloudMarkets();
	console.log('Seeding completed successfully');
  } catch (error) {
	console.error('Error during seeding:', error);
  } finally {
	await sql.end();
  }
}

main();
