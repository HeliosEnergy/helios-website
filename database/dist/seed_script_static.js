import postgres from 'postgres';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*
// Load environment variables from root .env file
config({ path: resolve(__dirname, '../.env') });

 */
console.log("DB_HOST", process.env.DB_HOST);
// Database connection configuration
const sql = postgres({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
async function seedGPUs() {
    try {
        // Read GPU data
        const gpuPath = join(__dirname, 'schema/seed/gpu.json');
        const gpuData = JSON.parse(readFileSync(gpuPath, 'utf-8'));
        console.log('Seeding GPUs...');
        for (const gpu of gpuData) {
            try {
                await sql `
					INSERT INTO gpu (
						name,
						manufacturer,
						vram,
						int8_flops,
						fp16_flops,
						fp32_flops,
						fp64_flops,
						tdp,
						aliases,
						release_date,
						relevancy
					) VALUES (
						${gpu.name},
						${gpu.manufacturer},
						${gpu.vram},
						${gpu.int8Flops ?? null},
						${gpu.fp16Flops ?? null},
						${gpu.fp32Flops ?? null},
						${gpu.fp64Flops ?? null},
						${gpu.tdp ?? null},
						${gpu.aliases ?? []},
						${gpu.release_date ?? null},
						${gpu.relevancy ?? null}
					)
					ON CONFLICT (name)
					DO UPDATE SET
						manufacturer = EXCLUDED.manufacturer,
						vram = EXCLUDED.vram,
						int8_flops = EXCLUDED.int8_flops,
						fp16_flops = EXCLUDED.fp16_flops,
						fp32_flops = EXCLUDED.fp32_flops,
						fp64_flops = EXCLUDED.fp64_flops,
						tdp = EXCLUDED.tdp,
						aliases = EXCLUDED.aliases,
						release_date = EXCLUDED.release_date,
						relevancy = EXCLUDED.relevancy
				`;
                console.log(`Created/Updated GPU: ${gpu.name}`);
            }
            catch (error) {
                console.error(`Error processing GPU ${gpu.name}:`, error);
            }
        }
    }
    catch (error) {
        console.error('Error seeding GPUs:', error);
    }
}
async function seedCloudMarkets() {
    try {
        // Read Cloud Market data
        const cloudPath = join(__dirname, 'schema/seed/cloud_market.json');
        const cloudData = JSON.parse(readFileSync(cloudPath, 'utf-8'));
        console.log('Seeding Cloud Markets...');
        for (const cloud of cloudData) {
            try {
                await sql `
			INSERT INTO gpu_cloud (
				name,
				type,
				global_relevancy,
				founding_year
			) VALUES (
				${cloud.name},
				${cloud.type},
				${cloud.global_relevancy},
				${cloud.founding_year ?? null}
			)
			ON CONFLICT (name) 
			DO UPDATE SET
			name = EXCLUDED.name,
			type = EXCLUDED.type,
			global_relevancy = EXCLUDED.global_relevancy,
			founding_year = EXCLUDED.founding_year
		`;
                console.log(`Created/Updated Cloud Market: ${cloud.name}`);
            }
            catch (error) {
                console.error(`Error processing Cloud Market ${cloud.name}:`, error);
            }
        }
    }
    catch (error) {
        console.error('Error seeding Cloud Markets:', error);
    }
}
async function main() {
    try {
        await seedGPUs();
        await seedCloudMarkets();
        console.log('Seeding completed successfully');
    }
    catch (error) {
        console.error('Error during seeding:', error);
    }
    finally {
        await sql.end();
    }
}
main();
//# sourceMappingURL=seed_script_static.js.map