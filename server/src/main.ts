import express, { Request, Response } from "express";
import dotenv from "dotenv";
import postgres from "postgres";
// Import the query functions
import { 
	createMetric,
	getMetric,
	listMetrics,
	getMetricsByTimeRange,
	updateMetric,
	deleteMetric,
	getMetricsByName
} from "@helios/analysis_db/schema/analysis_db/query_sql";

// Load environment variables
dotenv.config();

// Database configuration
const sql = postgres({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

const PORT = 4777;
const app = express();
app.use(express.json());

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
			res.send("Hello World");
		});
	}
	api.use("/map_data", map_data);
}
app.use("/api", api);

// Graceful shutdown
process.on('SIGTERM', async () => {
	console.log('SIGTERM received. Closing database connection...');
	await sql.end();
	process.exit(0);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
