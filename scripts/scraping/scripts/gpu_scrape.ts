import { Browser, ElementHandle, Page, Puppeteer } from 'puppeteer';
import { writeFileSync, readFileSync, existsSync, writeFile, readFile, mkdirSync } from 'fs';

import { cleanAndGetContent, multilineTrim, ScriptArgs, sleep } from '../utils';
import { authorize, listMajors } from '../google_sheets';
import { extractJSONContents, extractWebData, simpleResponse } from '../openai';


let paused = false;
let output: { [key: string]: any } = {};
const outputJsonFile = "./output/pricing.json";
const pricingDir = "./output/pricing";

// Create pricing directory if it doesn't exist
if (!existsSync(pricingDir)) {
	mkdirSync(pricingDir, { recursive: true });
}

let currentState: {
	last: string
} = null as any;
const currentStateFile = "./output/pricing_current_state.json";


function saveOutput(output: any) {
	writeFileSync(outputJsonFile, JSON.stringify(output, null, 4));
}


function setup() {
	if (existsSync(outputJsonFile)) {
		output = JSON.parse(readFileSync(outputJsonFile).toString());
	} else {
		writeFileSync(outputJsonFile, JSON.stringify(output));
	}

	if (existsSync(currentStateFile)) {
		currentState = JSON.parse(readFileSync(currentStateFile).toString());
	} else {
		currentState = { last: '' };
		writeFileSync(currentStateFile, JSON.stringify(currentState));
	}

}

const BASE_KEY_LIST = `- gpuName (string)`

const GPU_LIST = `
You must simplify GPU names to these formats for gpuName:
- A100 PCIe
- A100
- A100 80GB
- A100 PCIe 40GB
- 8x A100 SXM
- H100 SXM
- L40s
- MI300X
- A6000
Examples of bad names, DO NOT USE A NAME LIKE THESE:
- NVIDIA A100
- NVIDIA H100 SXM
- A100 SXM4
- RTX_4090
- RTX 4500 Ada 24GB
- V100 16GB SXM2
- A100 PCIe PRO
`

function jsonFormat(keys: string[]) {
	return `
If a value is not present in the HTML, set it to null.
You must follow the JSON format of:
\`\`\`json
[
	{
		"gpuName": ...,
		${keys.map(key => `"${key}": ...`).join(",\n\t\t")},
	},
	...
]
\`\`\`
	`;
}


async function runpodPricing({ browser }: ScriptArgs) {

	const page = await browser.newPage();
	console.log('Navigating to RunPod pricing page...');
	await page.goto('https://www.runpod.io/pricing');

	const content = await cleanAndGetContent(page, '#__next');
	await sleep(1000);

	// write content to file
	writeFileSync("./output/runpod_content.html", content);

	await page.close();

	// 	Start by removing all unnecessary elements from the HTML, think about the reduced HTML structure, and then write out all information from the HTML.

	let prompt = multilineTrim(`
		Use the data to create a JSON object that must include the following keys for EVERY GPU listed in the HTML:
		${BASE_KEY_LIST}
		- secureCloudHourlyPricing (number|null)
		- communityCloudHourlyPricing (number|null)

		DO NOT UES THE SERVERLESS PRICING, USE THE HOURLY RATES FOR MONTHLY PRICING.
		EXCLUDE NUMBERS FROM THE SERVERLESS SECTION.

	
		Make numeric fields numbers, not strings, do not include extra fields. If a numeric is not known, use null.
		You must include all GPUs on the page.

		{{JSON_FORMAT}}

	`.trim());
	prompt = prompt.replace("{{JSON_FORMAT}}", jsonFormat([
		"secureCloudHourlyPricing",
		"communityCloudHourlyPricing",
	]));
	console.log('Extracting data from RunPod pricing page...');
	console.log("-------------------------------------------\nprompt", prompt);
	const extractedData = (await extractJSONContents(await extractWebData(prompt, content)))[0];


	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	const datedFileName = `./output/pricing/${formattedDate}_runpod.json`;
	writeFileSync(datedFileName, JSON.stringify(extractedData, null, 4));
	console.log("RunPod is saved to", datedFileName);
	return extractedData;
}

async function vastPricing({ browser }: ScriptArgs) {

	const page = await browser.newPage();
	console.log('Navigating to Vast pricing page...');
	await page.goto('https://vast.ai/pricing');

	const content = await cleanAndGetContent(page, '#__next');
	await sleep(1000);

	await page.close();

	const prompt = multilineTrim(`
		Create a JSON object that must include the following keys:
		${BASE_KEY_LIST}
		- minPrice (number|null)
		- maxPrice (number|null)
		- medPrice (number|null)
		
		Don't include results for other platforms.
		Make numeric fields numbers, not strings.
		Do not include extra fields.
		If a numeric is not known, use null. You must include all GPUs on the page, even if some numerics are null.
		
		${GPU_LIST}

		${jsonFormat([
		"minPrice",
		"maxPrice",
		"medPrice",
	])}
	`.trim());
	console.log("Extracting data from Vast pricing page...");
	console.log("-------------------------------------------\nprompt", prompt);
	const extractedData = (await extractJSONContents(await extractWebData(prompt, content)))[0];


	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	const datedFileName = `./output/pricing/${formattedDate}_vast.json`;
	writeFileSync(datedFileName, JSON.stringify(extractedData, null, 4));
	console.log("Vast is saved to", datedFileName);
	return extractedData;

}

async function cudoPricing({ browser }: ScriptArgs) {

	const page = await browser.newPage();
	console.log('Navigating to Cudo pricing page...');
	await page.goto('https://www.cudocompute.com/pricing');

	const content = await cleanAndGetContent(page, '#__nuxt');
	await sleep(1000);

	await page.close();


	const prompt = multilineTrim(`
		Create a JSON object that must include the following keys:
		${BASE_KEY_LIST}
		- onDemand (number|null)
		- 1Months (number|null)
		- 3Months (number|null)
		- 6Months (number|null)
		
		Make numeric fields numbers, not strings. If a numeric is not known, use null.
		Do not include extra fields.
		You must include all GPUs on the page, even if some numerics are null.
		Do not include GPUs that are not in the HTML content.
		
		${GPU_LIST}

		${jsonFormat([
		"onDemand",
		"1Months",
		"3Months",
		"6Months",
	])}
	`.trim());
	console.log("Extracting data from Cudo pricing page...");
	console.log("-------------------------------------------\nprompt", prompt);
	const extractedData = (await extractJSONContents(await extractWebData(prompt, content)))[0];

	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	const datedFileName = `./output/pricing/${formattedDate}_cudo.json`;
	console.log("Cudo is saved to", datedFileName);
	writeFileSync(datedFileName, JSON.stringify(extractedData, null, 4) || "{}");
	return extractedData;
}


async function tensorDockPricing({ browser }: ScriptArgs) {

	const page = await browser.newPage();
	console.log('Navigating to TensorDock pricing page...');
	await page.goto('https://dashboard.tensordock.com/deploy');

	const content = await cleanAndGetContent(page, '#mainbody');
	await sleep(1000);

	await page.close();

	const prompt = multilineTrim(`
		Create a JSON object that must include the following keys:
		${BASE_KEY_LIST}
		- hourly (number|null)

		Make numeric fields numbers, not strings.
		Do not include extra fields.
		If a numeric is not known, use null. You must include all GPUs on the page, even if some numerics are null.
		
		${GPU_LIST}
		
		${jsonFormat([
		"hourly",
	])}
	`.trim());
	console.log("Extracting data from TensorDock pricing page...");
	console.log("-------------------------------------------\nprompt", prompt);
	const extractedData = (await extractJSONContents(await extractWebData(prompt, content)))[0];

	console.log("extractedData", extractedData);

	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	const datedFileName = `./output/pricing/${formattedDate}_tensorDock.json`;
	console.log("Tensor Dock is saved to", datedFileName);
	writeFileSync(datedFileName, JSON.stringify(extractedData, null, 4));
	return extractedData;
}


async function lambdaPricing({ browser }: ScriptArgs) {

	const page = await browser.newPage();
	console.log('Navigating to Lambda pricing page...');
	await page.goto('https://lambdalabs.com/service/gpu-cloud#pricing');

	const content = await page.$eval('#main-content', (el) => el.innerHTML);
	await sleep(1000);

	await page.close();

	const prompt = multilineTrim(`

		Create a JSON object that must include the following keys:
		${BASE_KEY_LIST}
		- hourly (number|null)
		
		For 8x, 4x, 2x, 1x, etc configurations do seperate entries in the JSON output.
		Make numeric fields numbers, not strings.
		Do not include extra fields.
		If a numeric is not known, use null. You must include all GPUs on the page, even if some numeric fields are null.
		
		${GPU_LIST}

		${jsonFormat([
		"hourly",
	])}
	`.trim());

	console.log("Extracting data from Lambda pricing page...", content.length);
	console.log("-------------------------------------------\nprompt", prompt);
	const extractedContent = await extractWebData(prompt, content);
	//console.log("extractedContent", extractedContent);
	const extractedData = (await extractJSONContents(extractedContent));

	//console.log("extractedData", extractedData.length);

	//console.log("type of extractedData", typeof extractedData[0], Object.keys(extractedData[0] || {}));

	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	const datedFileName = `./output/pricing/${formattedDate}_lambda.json`;
	console.log("Lambda is saved to", datedFileName);
	writeFileSync(datedFileName, JSON.stringify(extractedData[0], null, 4));
	return extractedData[0];
}





export async function pricingCrowd(args: ScriptArgs) {
	setup();

	const promises = await Promise.all([
		runpodPricing(args),
		vastPricing(args),
		cudoPricing(args),
		tensorDockPricing(args),
	]);
	const data = {
		runpod: promises[0],
		vast: promises[1],
		cudo: promises[2],
		tensorDock: promises[3],
	};

	// write to file, all_YYMMDD.json
	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	writeFileSync(`./output/pricing/all_crowd_${formattedDate}.json`, JSON.stringify(data, null, 4));

	console.log("Completed pricingCrowd");

	return data;
}

export async function pricingCloud(args: ScriptArgs) {
	setup();

	const promises = await Promise.all([
		lambdaPricing(args),
	]);
	const data: any = {
		lambda: promises[0],
	};

	// write to file, all_YYMMDD.json
	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	writeFileSync(`./output/pricing/all_cloud_${formattedDate}.json`, JSON.stringify(data, null, 4));

	console.log("Completed pricingCloud");

	return data;
}

export async function pricing(args: ScriptArgs) {

	const promises = await Promise.all([
		pricingCrowd(args),
		pricingCloud(args),
	]);

	const data = {
		...promises[0],
		...promises[1],
	};

	const date = new Date();
	const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
	writeFileSync(`./output/pricing/all_${formattedDate}.json`, JSON.stringify(data, null, 4));

	return data;
}

export function subFuncs(scriptArgs: ScriptArgs) {
	function wrap(func: (args: ScriptArgs) => Promise<any>) {
		return async () => {
			await setup();
			return await func(scriptArgs);
		}
	}
	return {
		"pricing": {
			"runpod": wrap(runpodPricing),
			"vast": wrap(vastPricing),
			"cudo": wrap(cudoPricing),
			"tensorDock": wrap(tensorDockPricing),
			"lambda": wrap(lambdaPricing),
			"setup": setup,
		}
	}
}