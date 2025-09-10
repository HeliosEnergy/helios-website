const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeOpenInfraMapAndWikidata() {
    console.log('🚀 Starting enhanced Canada power plant scraper...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        // Phase 1: Scrape data from OpenInfraMap
        console.log('📡 Navigating to OpenInfraMap Canada page...');
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
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
                
                // Extract Wikidata ID from the link
                let wikidataId = null;
                const wikidataLink = cells[5]?.querySelector('a');
                if (wikidataLink) {
                    const href = wikidataLink.getAttribute('href');
                    if (href) {
                        const match = href.match(/Q\d+/);
                        if (match) {
                            wikidataId = match[0];
                        }
                    }
                }
                
                return {
                    name: cells[0]?.textContent?.trim() || '',
                    operator: cells[1]?.textContent?.trim() || null,
                    output: cells[2]?.textContent?.trim() || '',
                    source: cells[3]?.textContent?.trim() || '',
                    method: cells[4]?.textContent?.trim() || null,
                    wikidataId: wikidataId,
                    latitude: null,
                    longitude: null
                };
            }).filter(plant => plant !== null);
        });
        
        console.log(`📈 Found ${powerPlants.length} power plants`);
        
        // Save initial data to CSV
        const csvHeaders = ['name', 'operator', 'output', 'source', 'method', 'wikidata_id', 'latitude', 'longitude'];
        const csvRows = powerPlants.map(plant => [
            `"${plant.name}"`,
            plant.operator ? `"${plant.operator}"` : '',
            `"${plant.output}"`,
            `"${plant.source}"`,
            plant.method ? `"${plant.method}"` : '',
            plant.wikidataId || '',
            plant.latitude || '',
            plant.longitude || ''
        ]);
        
        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const csvFilePath = path.join(__dirname, `../data/canada_power_plants_${timestamp}.csv`);
        
        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        fs.writeFileSync(csvFilePath, csvContent);
        console.log(`💾 Initial data saved to ${csvFilePath}`);
        
        // Phase 2: Extract coordinates from Wikidata
        console.log('🌍 Extracting coordinates from Wikidata...');
        let updatedCount = 0;
        
        for (let i = 0; i < powerPlants.length; i++) {
            const plant = powerPlants[i];
            
            // Skip plants without Wikidata IDs
            if (!plant.wikidataId) {
                continue;
            }
            
            try {
                console.log(`📍 Processing ${plant.name} (${plant.wikidataId})...`);
                
                // Navigate to Wikidata page
                const wikidataUrl = `https://www.wikidata.org/wiki/${plant.wikidataId}`;
                await page.goto(wikidataUrl, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });
                
                // Extract coordinates
                const coordinates = await page.evaluate(() => {
                    // Look for coordinate elements
                    const coordinateElements = document.querySelectorAll('.wikibase-kartographer-caption a');
                    
                    for (let i = 0; i < coordinateElements.length; i++) {
                        const element = coordinateElements[i];
                        const href = element.getAttribute('href');
                        if (href && href.includes('geo:')) {
                            // Extract coordinates from geo URI
                            const match = href.match(/geo:(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                            if (match) {
                                return {
                                    latitude: parseFloat(match[1]),
                                    longitude: parseFloat(match[2])
                                };
                            }
                        }
                    }
                    
                    // Alternative approach: look for coordinate text in kartographer captions
                    for (let i = 0; i < coordinateElements.length; i++) {
                        const element = coordinateElements[i];
                        const text = element.textContent?.trim();
                        if (text) {
                            // Match patterns like "54°30′N 74°30′W" or "54.5, -74.5"
                            const dmsMatch = text.match(/(\d+)°(\d+)′([NS])\s*(\d+)°(\d+)′([EW])/);
                            const decimalMatch = text.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
                            
                            if (dmsMatch) {
                                const latDeg = parseInt(dmsMatch[1]);
                                const latMin = parseInt(dmsMatch[2]);
                                const latDir = dmsMatch[3];
                                const lonDeg = parseInt(dmsMatch[4]);
                                const lonMin = parseInt(dmsMatch[5]);
                                const lonDir = dmsMatch[6];
                                
                                let latitude = latDeg + latMin / 60;
                                if (latDir === 'S') latitude = -latitude;
                                
                                let longitude = lonDeg + lonMin / 60;
                                if (lonDir === 'W') longitude = -longitude;
                                
                                return { latitude, longitude };
                            } else if (decimalMatch) {
                                return {
                                    latitude: parseFloat(decimalMatch[1]),
                                    longitude: parseFloat(decimalMatch[2])
                                };
                            }
                        }
                    }
                    
                    return null;
                });
                
                if (coordinates) {
                    console.log(`✅ Found coordinates for ${plant.name}: ${coordinates.latitude}, ${coordinates.longitude}`);
                    powerPlants[i].latitude = coordinates.latitude;
                    powerPlants[i].longitude = coordinates.longitude;
                    updatedCount++;
                } else {
                    console.log(`⚠️  No coordinates found for ${plant.name}`);
                }
                
                // Be respectful to Wikidata servers - add a delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`❌ Error processing ${plant.name}:`, error);
            }
        }
        
        console.log(`✅ Updated ${updatedCount} plants with Wikidata coordinates`);
        
        // Phase 3: Save updated data to CSV
        const updatedCsvRows = powerPlants.map(plant => [
            `"${plant.name}"`,
            plant.operator ? `"${plant.operator}"` : '',
            `"${plant.output}"`,
            `"${plant.source}"`,
            plant.method ? `"${plant.method}"` : '',
            plant.wikidataId || '',
            plant.latitude !== null ? plant.latitude : '',
            plant.longitude !== null ? plant.longitude : ''
        ]);
        
        const updatedCsvContent = [
            csvHeaders.join(','),
            ...updatedCsvRows.map(row => row.join(','))
        ].join('\n');
        
        const updatedCsvFilePath = path.join(__dirname, `../data/canada_power_plants_enhanced_${timestamp}.csv`);
        fs.writeFileSync(updatedCsvFilePath, updatedCsvContent);
        console.log(`💾 Enhanced data saved to ${updatedCsvFilePath}`);
        
        // Print summary
        console.log('\n📋 Summary:');
        console.log(`  Total plants: ${powerPlants.length}`);
        console.log(`  Plants with Wikidata IDs: ${powerPlants.filter(p => p.wikidataId).length}`);
        console.log(`  Plants with coordinates: ${powerPlants.filter(p => p.latitude !== null && p.longitude !== null).length}`);
        console.log(`  Plants without coordinates: ${powerPlants.filter(p => p.latitude === null || p.longitude === null).length}`);
        
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the scraper
if (require.main === module) {
    scrapeOpenInfraMapAndWikidata().catch(console.error);
}

module.exports = { scrapeOpenInfraMapAndWikidata };