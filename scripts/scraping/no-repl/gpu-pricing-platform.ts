import puppeteer from "puppeteer";
import path from 'path';
import { fileURLToPath } from 'url';
import * as fsp from 'fs/promises';

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
		
	} catch (error) {
		console.error(`\n------\nError scraping ${platform}:`, error, "\n------\n");
	} finally {
		await browser.close();
	}
}

main();