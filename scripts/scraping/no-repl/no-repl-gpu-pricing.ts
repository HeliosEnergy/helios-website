import puppeteer from "puppeteer";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

console.log("__dirname", __dirname);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

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

	console.log("FINAL PRICING DATA",pricing);
	// do DB insertions here
}

main();