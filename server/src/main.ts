import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import postgres from "postgres";
import cors from "cors";
import { resolve } from 'path';
import { existsSync } from 'fs';
import https from 'https';
import { generateSelfSignedCert } from './utils/cert.js';

// Import the query functions
import { externalRoutes, internalRoutes } from "./routes.js";

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

const external = express();
external.use(express.json());
external.use(cors());
external.use(async (req: Request, res: Response, next: NextFunction) => {
	try {
		await next();
	} catch (error) {
		console.error('Failed to process request:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
externalRoutes(external, sql);





const internal = express();
internal.use(express.json());
internal.use(cors());
internal.use(async (req: Request, res: Response, next: NextFunction) => {
	try {
		await next();
	} catch (error) {
		console.error('Failed to process request:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
internalRoutes(internal, sql);





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
		const httpsServer = https.createServer({ key, cert }, external);
		
		httpsServer.listen(process.env.PORT, () => {
			console.log(`HTTPS Server is running on port ${process.env.PORT}`);
			console.log(`https://localhost:${process.env.PORT}`);
		});
	} else {
		// Create HTTP server (existing functionality)
		external.listen(process.env.PORT, () => {
			console.log(`HTTP Server is running on port ${process.env.PORT}`);
			console.log(`http://localhost:${process.env.PORT}`);
		});
	}

	internal.listen(process.env.INTERNAL_PORT, () => {
		console.log(`Internal Server is running on port ${process.env.INTERNAL_PORT}`);
		console.log(`http://localhost:${process.env.INTERNAL_PORT}`);
	});
} catch (error) {
	console.error('Failed to start server:', error);
	process.exit(1);
}
