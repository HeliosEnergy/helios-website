import puppeteer from 'puppeteer';
import * as repl from 'repl';
import * as dotenv from 'dotenv';
import { ScriptArgs } from './utils';
import path from 'path';
import { fileURLToPath } from 'url';

console.log("__dirname", __dirname);
dotenv.config({ path: path.join(__dirname, '../../.env') });


process.on('SIGINT', () => {
	console.log('SIGINT received, exiting...');
	process.exit(0);
});

async function main() {

	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch({
		headless: process.env.BROWSER_HEADLESS === 'false' ? false : true,
		defaultViewport: null,
		userDataDir: './user_data',
		//set height and width
		args: ['--window-size=1920,1080'],
	});

	async function kill() {
		await browser.close();
		process.exit(0);
	}

	// on CTRL+C, exit
	process.on('SIGINT', kill);
	process.on('exit', kill);

	const page = await browser.newPage();

	const r = repl.start({ prompt: '> ' });

	async function wrappedFunc(file: string, func: (
		module: any,
		scriptArgs: ScriptArgs,
		...args: any[]
	) => Promise<any>) {
		const module = await import(file);
		delete require.cache[require.resolve(file)];
		return (...args: any[]) => func(module, {
			repl: r,
			browser: browser,
			page: page,
		}, ...args);
	}

	r.context.load_env = () => {
		dotenv.config();
	}
	r.context.page = page;
	r.context.browser = browser;
	r.context.gpu_scrape = await wrappedFunc('./scripts/gpu_scrape', (gpu_scrape, scriptArgs) => {
		return gpu_scrape.pricing(scriptArgs);
	});
	const gpu_scrape = await import('./scripts/gpu_scrape')
	r.context.gpu = gpu_scrape.subFuncs({
		repl: r,
		browser: browser,
		page: page,
	});



	r.context.reload = async () => {
		const gpu_scrape = await import('./scripts/gpu_scrape')
		r.context.gpu = gpu_scrape.subFuncs({
			repl: r,
			browser: browser,
			page: page,
		});
	}

}

main();
