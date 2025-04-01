import { spawn, spawnSync } from "child_process";
import { Request, Response } from "express";
import path, { resolve, join } from "path";
import * as fsp from "fs/promises";

const __dirname = resolve(process.cwd(), "..");

async function executeScript(script: string) {
	return "Hello World";
}


export async function executeScriptEIACapacity(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "No body provided" });
		return;
	}

	spawnSync("npm", ["run", "capacity"], {
		cwd: path.join(__dirname, "../scripts/eia"),
		stdio: "inherit",
	});

	res.json({
		success: true,
		message: "Script executed successfully",
	});
}


export async function executeScriptEIAGeneration(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "No body provided" });
		return;
	}

	spawnSync("npm", ["run", "generation"], {
		cwd: path.join(__dirname, "../scripts/eia"),
		stdio: "inherit",
	});

	res.json({
		success: true,
		message: "Script executed successfully",
	});
}


export interface GPUPricingRequest {
	platform: string;
}

export async function executeScriptGPUPricing(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "No body provided" });
		return;
	}
	
	const platform = req.params.platform;

	try {
		
		const proc = spawnSync("npm", ["run", "gpu_platform_pricing", platform], {
			cwd: path.resolve(path.join(__dirname, "scripts/scraping")),
			stdio: "pipe",
		});

		if (proc.status !== 0) {
			res.status(500).json({
				error: "Failed to execute script",
				stdout: proc.stdout.toString(),
				stderr: proc.stderr.toString(),
				status: proc.status,
			});
			return;
		}

		const stdoutData = proc.stdout.toString();
		console.log(stdoutData);
		
		// Extract content between %%FILE%% and %%/FILE%% markers
		let extractedData = '';
		const fileRegex = /%%FILE%%([\s\S]*?)%%\/FILE%%/;
		const match = stdoutData.match(fileRegex);
		
		if (match && match[1]) {
			extractedData = match[1].trim();
		}

		if (!extractedData) {
			res.status(500).json({ error: "Failed to execute script, no output found" });
			return;
		}

		const fileContent = await fsp.readFile(extractedData, "utf8");
		const fileData = JSON.parse(fileContent);

		res.json({
			success: true,
			message: "Script executed successfully",
			result: fileData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to execute script" });
		return;
	}

}