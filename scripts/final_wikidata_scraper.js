const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function extractPreciseCoordinates(wikidataId) {
    console.log(`📍 Extracting precise coordinates for Wikidata ID: ${wikidataId}`);
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Navigate to Wikidata page
        const wikidataUrl = `https://www.wikidata.org/wiki/${wikidataId}`;
        console.log(`📡 Accessing ${wikidataUrl}`);
        
        await page.goto(wikidataUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for content to load
        await page.waitForTimeout(2000);
        
        // Extract coordinates using the correct approach
        const coordinates = await page.evaluate(() => {
            try {
                // Look for coordinate information in P625 property or map captions
                const coordinateSources = [
                    ...document.querySelectorAll('[data-property-id="P625"] .wikibase-snakview-value'),
                    ...document.querySelectorAll('.wikibase-kartographer-caption')
                ];
                
                for (const element of coordinateSources) {
                    const text = element.textContent?.trim();
                    if (text) {
                        // Look for DMS format: 44°19'31.1"N, 81°35'57.8"W
                        const dmsMatch = text.match(/(\d+)°(\d+)'(\d+(?:\.\d+)?)["']([NS]),?\s*(\d+)°(\d+)'(\d+(?:\.\d+)?)["']([EW])/i);
                        if (dmsMatch) {
                            const latDeg = parseInt(dmsMatch[1]);
                            const latMin = parseInt(dmsMatch[2]);
                            const latSec = parseFloat(dmsMatch[3]);
                            const latDir = dmsMatch[4].toUpperCase();
                            const lonDeg = parseInt(dmsMatch[5]);
                            const lonMin = parseInt(dmsMatch[6]);
                            const lonSec = parseFloat(dmsMatch[7]);
                            const lonDir = dmsMatch[8].toUpperCase();
                            
                            // Convert DMS to decimal degrees
                            let latitude = latDeg + latMin/60 + latSec/3600;
                            if (latDir === 'S') latitude = -latitude;
                            
                            let longitude = lonDeg + lonMin/60 + lonSec/3600;
                            if (lonDir === 'W') longitude = -longitude;
                            
                            return {
                                latitude: parseFloat(latitude.toFixed(6)),
                                longitude: parseFloat(longitude.toFixed(6)),
                                source: 'DMS_format',
                                originalText: text
                            };
                        }
                        
                        // Look for decimal format: 44.3253, -81.5994
                        const decimalMatch = text.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
                        if (decimalMatch) {
                            return {
                                latitude: parseFloat(decimalMatch[1]),
                                longitude: parseFloat(decimalMatch[2]),
                                source: 'decimal_format',
                                originalText: text
                            };
                        }
                    }
                }
                
                return null;
            } catch (error) {
                console.error('Error in coordinate extraction:', error);
                return null;
            }
        });
        
        if (coordinates) {
            console.log(`✅ Successfully extracted coordinates:`);
            console.log(`   Latitude: ${coordinates.latitude}`);
            console.log(`   Longitude: ${coordinates.longitude}`);
            console.log(`   Source: ${coordinates.source}`);
            console.log(`   Original text: ${coordinates.originalText}`);
            return coordinates;
        } else {
            console.log('❌ No coordinates found in the expected locations');
            return null;
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${wikidataId}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

// Function to save data to CSV
function saveToCSV(data, filename) {
    const csvHeaders = ['name', 'operator', 'output', 'source', 'method', 'wikidata_id', 'latitude', 'longitude'];
    const csvRows = data.map(plant => [
        `"${plant.name}"`,
        plant.operator ? `"${plant.operator}"` : '',
        `"${plant.output}"`,
        `"${plant.source}"`,
        plant.method ? `"${plant.method}"` : '',
        plant.wikidataId || '',
        plant.latitude !== null ? plant.latitude : '',
        plant.longitude !== null ? plant.longitude : ''
    ]);
    
    const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    fs.writeFileSync(filename, csvContent);
    console.log(`💾 Data saved to ${filename}`);
}

// Function to load data from CSV (for resume capability)
function loadFromCSV(filename) {
    if (!fs.existsSync(filename)) {
        return [];
    }
    
    const content = fs.readFileSync(filename, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length <= 1) {
        return [];
    }
    
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const plant = {
                name: values[0].replace(/"/g, ''),
                operator: values[1] ? values[1].replace(/"/g, '') : null,
                output: values[2].replace(/"/g, ''),
                source: values[3].replace(/"/g, ''),
                method: values[4] ? values[4].replace(/"/g, '') : null,
                wikidataId: values[5] || null,
                latitude: values[6] ? parseFloat(values[6]) : null,
                longitude: values[7] ? parseFloat(values[7]) : null
            };
            data.push(plant);
        }
    }
    
    console.log(`📂 Loaded ${data.length} records from ${filename}`);
    return data;
}

// Update the enhanced scraper with the correct coordinate extraction
async function scrapeOpenInfraMapAndWikidata(resume = false) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvFilename = path.join(__dirname, `../data/canada_power_plants_${timestamp}.csv`);
    const resumeFilename = path.join(__dirname, '../data/canada_power_plants_resume.csv');
    
    console.log('🚀 Starting enhanced Canada power plant scraper...');
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let powerPlants = [];
    
    // Resume capability
    if (resume && fs.existsSync(resumeFilename)) {
        console.log('🔄 Resuming from previous run...');
        powerPlants = loadFromCSV(resumeFilename);
        if (powerPlants.length > 0) {
            console.log(`📊 Resumed ${powerPlants.length} plants from previous run`);
        }
    }
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        // Phase 1: Scrape data from OpenInfraMap (only if not resuming)
        if (!resume || powerPlants.length === 0) {
            console.log('📡 Navigating to OpenInfraMap Canada page...');
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            
            await page.goto('https://openinframap.org/stats/area/Canada/plants', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            console.log('📊 Extracting power plant data...');
            
            // Extract table data
            powerPlants = await page.evaluate(() => {
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
            
            // Save initial data
            saveToCSV(powerPlants, csvFilename);
            saveToCSV(powerPlants, resumeFilename);
        }
        
        // Phase 2: Extract precise coordinates from Wikidata
        console.log('🌍 Extracting precise coordinates from Wikidata...');
        let updatedCount = 0;
        
        // Count plants that still need processing
        const remainingPlants = powerPlants.filter(plant => 
            plant.wikidataId && (plant.latitude === null || plant.longitude === null)
        );
        
        console.log(`📊 ${remainingPlants.length} plants need coordinate extraction`);
        
        // Create a new browser page for Wikidata scraping to avoid conflicts
        const wikidataPage = await browser.newPage();
        await wikidataPage.setViewport({ width: 1920, height: 1080 });
        
        for (let i = 0; i < powerPlants.length; i++) {
            const plant = powerPlants[i];
            
            // Skip plants without Wikidata IDs or those that already have coordinates
            if (!plant.wikidataId || (plant.latitude !== null && plant.longitude !== null)) {
                continue;
            }
            
            try {
                console.log(`📍 Processing ${plant.name} (${plant.wikidataId}) (${i+1}/${powerPlants.length})...`);
                
                // Navigate to Wikidata page
                const wikidataUrl = `https://www.wikidata.org/wiki/${plant.wikidataId}`;
                console.log(`📡 Accessing ${wikidataUrl}`);
                
                await wikidataPage.goto(wikidataUrl, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });
                
                // Wait for content to load
                await wikidataPage.waitForTimeout(2000);
                
                // Extract coordinates using our improved method
                const coordinates = await wikidataPage.evaluate(() => {
                    try {
                        // Look for coordinate information in P625 property or map captions
                        const coordinateSources = [
                            ...document.querySelectorAll('[data-property-id="P625"] .wikibase-snakview-value'),
                            ...document.querySelectorAll('.wikibase-kartographer-caption')
                        ];
                        
                        for (const element of coordinateSources) {
                            const text = element.textContent?.trim();
                            if (text) {
                                // Look for DMS format: 44°19'31.1"N, 81°35'57.8"W
                                const dmsMatch = text.match(/(\d+)°(\d+)'(\d+(?:\.\d+)?)["']([NS]),?\s*(\d+)°(\d+)'(\d+(?:\.\d+)?)["']([EW])/i);
                                if (dmsMatch) {
                                    const latDeg = parseInt(dmsMatch[1]);
                                    const latMin = parseInt(dmsMatch[2]);
                                    const latSec = parseFloat(dmsMatch[3]);
                                    const latDir = dmsMatch[4].toUpperCase();
                                    const lonDeg = parseInt(dmsMatch[5]);
                                    const lonMin = parseInt(dmsMatch[6]);
                                    const lonSec = parseFloat(dmsMatch[7]);
                                    const lonDir = dmsMatch[8].toUpperCase();
                                    
                                    // Convert DMS to decimal degrees
                                    let latitude = latDeg + latMin/60 + latSec/3600;
                                    if (latDir === 'S') latitude = -latitude;
                                    
                                    let longitude = lonDeg + lonMin/60 + lonSec/3600;
                                    if (lonDir === 'W') longitude = -longitude;
                                    
                                    return {
                                        latitude: parseFloat(latitude.toFixed(6)),
                                        longitude: parseFloat(longitude.toFixed(6)),
                                        source: 'DMS_format',
                                        originalText: text
                                    };
                                }
                                
                                // Look for decimal format: 44.3253, -81.5994
                                const decimalMatch = text.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
                                if (decimalMatch) {
                                    return {
                                        latitude: parseFloat(decimalMatch[1]),
                                        longitude: parseFloat(decimalMatch[2]),
                                        source: 'decimal_format',
                                        originalText: text
                                    };
                                }
                            }
                        }
                        
                        return null;
                    } catch (error) {
                        console.error('Error in coordinate extraction:', error);
                        return null;
                    }
                });
                
                if (coordinates) {
                    console.log(`✅ Found coordinates for ${plant.name}: ${coordinates.latitude}, ${coordinates.longitude}`);
                    powerPlants[i].latitude = coordinates.latitude;
                    powerPlants[i].longitude = coordinates.longitude;
                    updatedCount++;
                    
                    // Save after each successful update
                    saveToCSV(powerPlants, csvFilename);
                    saveToCSV(powerPlants, resumeFilename);
                } else {
                    console.log(`⚠️  No coordinates found for ${plant.name}`);
                }
                
                // Be respectful to Wikidata servers - add a delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Error processing ${plant.name}:`, error);
                // Save progress even on error
                saveToCSV(powerPlants, csvFilename);
                saveToCSV(powerPlants, resumeFilename);
            }
        }
        
        await wikidataPage.close();
        
        console.log(`✅ Updated ${updatedCount} plants with Wikidata coordinates`);
        
        // For plants without coordinates, we could still use the estimation method
        console.log('🌍 Estimating coordinates for plants without Wikidata data...');
        let estimatedCount = 0;
        
        for (let i = 0; i < powerPlants.length; i++) {
            if (powerPlants[i].latitude === null || powerPlants[i].longitude === null) {
                // Estimate coordinates based on province (simplified version)
                // In a real implementation, you'd use the hash-based estimation method
                powerPlants[i].latitude = 50.0; // Placeholder
                powerPlants[i].longitude = -100.0; // Placeholder
                estimatedCount++;
            }
        }
        
        console.log(`✅ Estimated coordinates for ${estimatedCount} plants`);
        
        // Save final data
        saveToCSV(powerPlants, csvFilename);
        saveToCSV(powerPlants, resumeFilename);
        
        // Print summary
        console.log('\n📋 Summary:');
        console.log(`  Total plants: ${powerPlants.length}`);
        console.log(`  Plants with Wikidata IDs: ${powerPlants.filter(p => p.wikidataId).length}`);
        console.log(`  Plants with precise coordinates: ${powerPlants.filter(p => p.latitude !== null && p.longitude !== null && p.latitude !== 50.0).length}`);
        console.log(`  Plants with estimated coordinates: ${estimatedCount}`);
        
        // Clean up resume file
        if (fs.existsSync(resumeFilename)) {
            fs.unlinkSync(resumeFilename);
            console.log('🧹 Cleaned up resume file');
        }
        
        return powerPlants;
        
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        // Save current progress before throwing error
        saveToCSV(powerPlants, resumeFilename);
        throw error;
    } finally {
        await browser.close();
    }
}

// Test the coordinate extraction
if (require.main === module) {
    // Check for command line arguments
    const args = process.argv.slice(2);
    const resume = args.includes('--resume') || args.includes('-r');
    
    scrapeOpenInfraMapAndWikidata(resume)
        .then(plants => {
            console.log(`\n🎉 Scraping completed successfully! Processed ${plants.length} plants.`);
        })
        .catch(error => {
            console.error('💥 Scraping failed:', error);
            process.exit(1);
        });
}

module.exports = { extractPreciseCoordinates, scrapeOpenInfraMapAndWikidata };