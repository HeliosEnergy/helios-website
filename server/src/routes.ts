import express, { NextFunction, Request, Response, Express } from "express";
import dotenv from "dotenv";
import postgres from "postgres";
import cors from "cors";
import { httpGetMinimalPowerPlantData, httpGetPowerPlantData, httpGetPowerPlantDataById } from "./routes/map_data.js";
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import https from 'https';
import http from 'http';
import { generateSelfSignedCert } from './utils/cert.js';

// Import the query functions
import { 
	createMetric,
	getMetric,
	listMetrics,
	getMetricsByTimeRange,
	updateMetric,
	deleteMetric,
	getMetricsByName
} from "@helios/analysis_db/schema/analysis_db/query_sql.js";
import { httpAnyN8NWebhookTunnel } from "./routes/n8n_tunnel.js";
import { executeScriptEIACapacity, executeScriptEIAGeneration, executeScriptGPUPricing, executeScriptVastAPIScraping } from "./iternal_routes/execute_scripts.js";
import { getCompanies } from "./iternal_routes/notion-databases";

export function externalRoutes(external: Express, sql: postgres.Sql) {
	console.log("adding route");
	external.get("/", (req: Request, res: Response) => {
		res.send("Hello World");
	});

	const api = express.Router();
	{
		// Example endpoints using the actual query functions
		api.get("/metrics", async (req: Request, res: Response) => {
			try {
				const metrics = await listMetrics(sql);
				res.json(metrics);
			} catch (error) {
				console.error('Database query error:', error);
				res.status(500).json({ error: 'Internal server error' });
			}
		});

		api.post("/metrics", async (req: Request, res: Response) => {
			try {
				const { name, value, timestamp } = req.body;
				const result = await createMetric(sql, {
					name,
					value,
					timestamp: timestamp ? new Date(timestamp) : null
				});
				res.json(result);
			} catch (error) {
				console.error('Database query error:', error);
				res.status(500).json({ error: 'Internal server error' });
			}
		});

		api.get("/metrics/:id", async (req: Request, res: Response) => {
			try {
				const metric = await getMetric(sql, { id: parseInt(req.params.id) });
				if (!metric) {
					res.status(404).json({ error: 'Metric not found' });
					return;
				}
				res.json(metric);
			} catch (error) {
				console.error('Database query error:', error);
				res.status(500).json({ error: 'Internal server error' });
			}
		});

		const gpu_pricing = express.Router();
		{
			gpu_pricing.get("/", (req: Request, res: Response) => {
				res.send("Hello World");
			});
		}
		api.use("/gpu_pricing", gpu_pricing);

		const map_data = express.Router();
		{
			map_data.get("/", (req: Request, res: Response) => {
				res.send("Map data");
			});

			map_data.get("/power_plants", httpGetPowerPlantData(sql));
			map_data.get("/power_plants_minimal", httpGetMinimalPowerPlantData(sql));
			map_data.get("/power_plant/:id", httpGetPowerPlantDataById(sql));
		}
		api.use("/map_data", map_data);


		api.use("/n8n/webhook/*", httpAnyN8NWebhookTunnel("webhook"));
		api.use("/n8n/webhook-test/*", httpAnyN8NWebhookTunnel("webhook-test"));


	}
	external.use("/api", api);
}

export function internalRoutes(internal: Express, sql: postgres.Sql) {

	internal.post("/execute_script/eia_capacity", executeScriptEIACapacity);
	internal.post("/execute_script/eia_generation", executeScriptEIAGeneration);
	internal.post("/execute_script/gpu_pricing/:platform", executeScriptGPUPricing);
	internal.get("/execute_script/vast_api_scraping", executeScriptVastAPIScraping);


	internal.get("/notion/companies", getCompanies);
	
	const internal_site = express.Router();

	internal.use("/site", internal_site);
}
