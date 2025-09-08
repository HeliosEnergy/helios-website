import puppeteer from 'puppeteer';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load env from the project root .env (one level up from scripts/)
dotenv.config({ path: resolve(__dirname, '..', '.env') });

interface PowerPlantData {
    name: string;
    operator: string | null;
    output: string;
    source: string;
    method: string | null;
    wikidata: string | null;
}

// Database connection (using same pattern as existing scripts)
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '6432'); // Docker container port
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin123';
const DB_NAME = process.env.DB_NAME || 'gpu_metrics';

const sql = postgres({
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

// Function to extract coordinates from Wikidata ID (simplified approach)
async function getCoordinatesFromWikidata(wikidataId: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
        // For now, return some reasonable coordinates within Canada
        // In a real implementation, you'd query Wikidata SPARQL endpoint
        const canadaCoordinates = {
            'Q795104': { latitude: 44.3225, longitude: -81.6017 }, // Bruce Nuclear
            'Q1456859': { latitude: 53.785, longitude: -77.435 }, // Robert-Bourassa
            'Q1458507': { latitude: 53.565, longitude: -64.044 }, // Churchill Falls
            'Q1739391': { latitude: 43.8728, longitude: -78.7173 }, // Darlington
            'Q1758688': { latitude: 56.0167, longitude: -122.6833 }, // Gordon M. Shrum
        };
        
        return canadaCoordinates[wikidataId as keyof typeof canadaCoordinates] || null;
    } catch (error) {
        console.error(`Error getting coordinates for ${wikidataId}:`, error);
        return null;
    }
}

// Function to estimate coordinates from plant name and province
function estimateCoordinates(plantName: string, province: string | null): { latitude: number; longitude: number } {
    // Simplified coordinate estimation based on province centers
    const provinceCoordinates = {
        'Ontario': { latitude: 45.0, longitude: -80.0 },
        'Quebec': { latitude: 52.0, longitude: -72.0 },
        'British Columbia': { latitude: 54.0, longitude: -125.0 },
        'Alberta': { latitude: 54.0, longitude: -115.0 },
        'Manitoba': { latitude: 55.0, longitude: -97.0 },
        'Saskatchewan': { latitude: 53.0, longitude: -106.0 },
        'Nova Scotia': { latitude: 45.0, longitude: -63.0 },
        'New Brunswick': { latitude: 46.5, longitude: -66.0 },
        'Newfoundland and Labrador': { latitude: 53.0, longitude: -60.0 },
        'Prince Edward Island': { latitude: 46.0, longitude: -63.0 },
        'Northwest Territories': { latitude: 64.0, longitude: -124.0 },
        'Nunavut': { latitude: 70.0, longitude: -100.0 },
        'Yukon': { latitude: 64.0, longitude: -135.0 }
    };
    
    const baseCoords = provinceCoordinates[province as keyof typeof provinceCoordinates] || 
                      { latitude: 60.0, longitude: -100.0 }; // Default to center of Canada
    
    // Add some random offset to avoid exact duplicates
    return {
        latitude: baseCoords.latitude + (Math.random() - 0.5) * 2,
        longitude: baseCoords.longitude + (Math.random() - 0.5) * 4
    };
}

// Function to parse power output (convert MW string to number)
function parseOutputMW(outputStr: string): number | null {
    try {
        const match = outputStr.match(/([0-9,]+)\s*MW/);
        if (match) {
            return parseFloat(match[1].replace(/,/g, ''));
        }
        return null;
    } catch {
        return null;
    }
}

// Function to determine province from operator or plant name
function determineProvince(plantName: string, operator: string | null): string | null {
    const text = `${plantName} ${operator || ''}`.toLowerCase();
    
    if (text.includes('hydro-québec') || text.includes('quebec') || text.includes('beauharnois') || 
        text.includes('manic') || text.includes('la grande') || text.includes('robert-bourassa')) {
        return 'Quebec';
    }
    if (text.includes('bc hydro') || text.includes('british columbia') || text.includes('gordon') || 
        text.includes('mica') || text.includes('revelstoke')) {
        return 'British Columbia';
    }
    if (text.includes('ontario') || text.includes('bruce') || text.includes('darlington') || 
        text.includes('pickering') || text.includes('sir adam beck')) {
        return 'Ontario';
    }
    if (text.includes('alberta') || text.includes('capital power') || text.includes('genesee') || 
        text.includes('shepard') || text.includes('keephills')) {
        return 'Alberta';
    }
    if (text.includes('manitoba') || text.includes('limestone') || text.includes('kettle')) {
        return 'Manitoba';
    }
    if (text.includes('saskatchewan') || text.includes('saskpower') || text.includes('boundary dam')) {
        return 'Saskatchewan';
    }
    if (text.includes('newfoundland') || text.includes('churchill falls') || text.includes('nalcor')) {
        return 'Newfoundland and Labrador';
    }
    if (text.includes('nova scotia') || text.includes('lingan') || text.includes('trenton')) {
        return 'Nova Scotia';
    }
    if (text.includes('new brunswick') || text.includes('nb power') || text.includes('coleson') || 
        text.includes('point lepreau')) {
        return 'New Brunswick';
    }
    
    return null;
}

// Function to normalize fuel type
function normalizeFuelType(source: string): string {
    const lowerSource = source.toLowerCase();
    
    if (lowerSource.includes('nuclear')) return 'nuclear';
    if (lowerSource.includes('hydro')) return 'hydro';
    if (lowerSource.includes('gas')) return 'gas';
    if (lowerSource.includes('wind')) return 'wind';
    if (lowerSource.includes('solar')) return 'solar';
    if (lowerSource.includes('coal')) return 'coal';
    if (lowerSource.includes('oil')) return 'oil';
    if (lowerSource.includes('biomass')) return 'biomass';
    if (lowerSource.includes('geothermal')) return 'geothermal';
    
    return source; // Return original if no match
}

async function scrapeOpenInfraMap(): Promise<void> {
    console.log('🚀 Starting OpenInfraMap Canada scraper...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set a reasonable viewport
        await page.setViewport({ width: 1920, height: 1080 });
        
        console.log('📡 Navigating to OpenInfraMap Canada page...');
        await page.goto('https://openinframap.org/stats/area/Canada/plants', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('📊 Extracting power plant data...');
        
        // Extract table data
        const powerPlants = await page.evaluate(() => {
            const table = document.querySelector('table');
            if (!table) return [];
            
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                if (cells.length < 4) return null;
                
                return {
                    name: cells[0]?.textContent?.trim() || '',
                    operator: cells[1]?.textContent?.trim() || null,
                    output: cells[2]?.textContent?.trim() || '',
                    source: cells[3]?.textContent?.trim() || '',
                    method: cells[4]?.textContent?.trim() || null,
                    wikidata: cells[5]?.querySelector('a')?.href?.match(/Q\d+/)?.[0] || null
                };
            }).filter(plant => plant !== null);
        });
        
        console.log(`📈 Found ${powerPlants.length} power plants`);
        
        // Process and insert data
        let insertedCount = 0;
        let skippedCount = 0;
        
        for (const plant of powerPlants) {
            try {
                const outputMW = parseOutputMW(plant.output);
                if (!outputMW || outputMW < 10) { // Skip very small plants
                    skippedCount++;
                    continue;
                }
                
                const province = determineProvince(plant.name, plant.operator);
                const fuelType = normalizeFuelType(plant.source);
                
                // Get coordinates
                let coordinates = null;
                if (plant.wikidata) {
                    coordinates = await getCoordinatesFromWikidata(plant.wikidata);
                }
                
                if (!coordinates) {
                    coordinates = estimateCoordinates(plant.name, province);
                }
                
                // Create openinframap_id from name
                const openinframapId = plant.name.toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .substring(0, 100);
                
                // Create metadata
                const metadata = {
                    method: plant.method,
                    wikidata: plant.wikidata,
                    scraped_from: 'openinframap.org',
                    scraped_at: new Date().toISOString()
                };
                
                // Insert into database (with ON CONFLICT handling)
                await sql`
                    INSERT INTO canada_power_plants 
                    (openinframap_id, name, operator, output_mw, fuel_type, province, latitude, longitude, metadata)
                    VALUES (${openinframapId}, ${plant.name}, ${plant.operator}, ${outputMW}, 
                           ${fuelType}, ${province}, ${coordinates.latitude}, ${coordinates.longitude}, ${JSON.stringify(metadata)})
                    ON CONFLICT (openinframap_id) 
                    DO UPDATE SET 
                        name = EXCLUDED.name,
                        operator = EXCLUDED.operator,
                        output_mw = EXCLUDED.output_mw,
                        fuel_type = EXCLUDED.fuel_type,
                        province = EXCLUDED.province,
                        latitude = EXCLUDED.latitude,
                        longitude = EXCLUDED.longitude,
                        metadata = EXCLUDED.metadata,
                        updated_at = CURRENT_TIMESTAMP;
                `;
                
                insertedCount++;
                
                if (insertedCount % 10 === 0) {
                    console.log(`💾 Processed ${insertedCount} plants...`);
                }
                
            } catch (error) {
                console.error(`❌ Error processing plant ${plant.name}:`, error);
                skippedCount++;
            }
        }
        
        console.log(`✅ Scraping complete!`);
        console.log(`📊 Inserted/Updated: ${insertedCount} plants`);
        console.log(`⏭️  Skipped: ${skippedCount} plants`);
        
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        throw error;
    } finally {
        await browser.close();
        await sql.end();
    }
}

// Run the scraper
if (require.main === module) {
    scrapeOpenInfraMap().catch(console.error);
}

export { scrapeOpenInfraMap };