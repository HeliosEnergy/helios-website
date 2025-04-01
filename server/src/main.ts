import express, { Request, Response } from "express";
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

// Load environment variables with fallback and error handling
const loadEnvConfig = () => {
	// First try in current working directory
	const cwdEnvPath = resolve(process.cwd(), '.env');
	
	console.log("cwdEnvPath",cwdEnvPath);

	if (existsSync(cwdEnvPath)) {
		console.log(`Loading .env from: ${cwdEnvPath}`);
		return dotenv.config({ path: cwdEnvPath });
	}
	
	// Then try one directory up
	const parentEnvPath = resolve(process.cwd(), '..', '.env');
	
	if (existsSync(parentEnvPath)) {
		console.log(`Loading .env from: ${parentEnvPath}`);
		return dotenv.config({ path: parentEnvPath });
	}
	
	// If neither location has a .env file, error out
	console.error('ERROR: No .env file found in current directory or parent directory');
	process.exit(1);
};

loadEnvConfig();

console.log("DB HOST",process.env.DB_HOST);

// Replace the existing unhandledRejection handler with this more detailed one
process.on('unhandledRejection', (reason: any, promise) => {
	console.error('=== Unhandled Promise Rejection ===');
	console.error('Promise:', promise);
	console.error('Reason:', reason);
	if (reason instanceof Error) {
		console.error('Stack:', reason.stack);
	}
	if (reason && reason.code) {
		console.error('Error code:', reason.code);
	}
	if (reason && reason.message) {
		console.error('Error message:', reason.message);
	}
	console.error('===============================');
});

// Database configuration
let sql;
try {
	sql = postgres({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT || "5432"),
	});
} catch (error) {
	console.error('Failed to initialize database connection:', error);
	process.exit(1);
}

const PORT = parseInt(process.env.PORT || "4777");
const app = express();
app.use(express.json());
app.use(cors());

console.log("adding route");
app.get("/", (req: Request, res: Response) => {
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



	api.use("/n8n/webhook/*", httpAnyN8NWebhookTunnel());

}
app.use("/api", api);


// Graceful shutdown
process.on('SIGTERM', async () => {
	console.log('SIGTERM received. Closing database connection...');
	await sql.end();
	process.exit(0);
});

console.log("listening");

// Wrap the server startup in a try-catch
try {
	const useHttps = process.env.USE_HTTPS === 'true';
	
	if (useHttps) {
		// Check for certificate files
		const certPath = process.env.CERT_PATH || resolve(process.cwd(), 'cert');
		const keyFile = resolve(certPath, 'key.pem');
		const certFile = resolve(certPath, 'cert.pem');
		
		// Generate certificates if they don't exist
		if (!existsSync(keyFile) || !existsSync(certFile)) {
			console.log('SSL certificates not found, generating self-signed certificates...');
			await generateSelfSignedCert(certPath);
		}
		
		// Read certificate files
		const { readFileSync } = await import('fs');
		const key = readFileSync(keyFile, 'utf8');
		const cert = readFileSync(certFile, 'utf8');
		
		// Create HTTPS server
		const httpsServer = https.createServer({ key, cert }, app);
		
		httpsServer.listen(PORT, () => {
			console.log(`HTTPS Server is running on port ${PORT}`);
			console.log(`https://localhost:${PORT}`);
		});
	} else {
		// Create HTTP server (existing functionality)
		app.listen(PORT, () => {
			console.log(`HTTP Server is running on port ${PORT}`);
			console.log(`http://localhost:${PORT}`);
		});
	}
} catch (error) {
	console.error('Failed to start server:', error);
	process.exit(1);
}
