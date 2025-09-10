const puppeteer = require('puppeteer');

async function extractCoordinatesFromWikidata(wikidataId) {
    console.log(`📍 Extracting coordinates for Wikidata ID: ${wikidataId}`);
    
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
        
        // Wait for page to load completely
        await page.waitForTimeout(3000);
        
        // Try multiple approaches to find coordinates
        
        // Approach 1: Direct extraction of P625 (coordinate location) property
        const coordinates = await page.evaluate(() => {
            try {
                // Method 1: Look for the structured data approach
                const coordinateElements = document.querySelectorAll('div.wikibase-snakview-value[data-property-id="P625"]');
                for (let el of coordinateElements) {
                    const text = el.textContent?.trim();
                    if (text) {
                        // Look for coordinate patterns
                        const decimalMatch = text.match(/(-?\d+\.?\d*)[°,\s]+(-?\d+\.?\d*)/);
                        if (decimalMatch) {
                            return {
                                latitude: parseFloat(decimalMatch[1]),
                                longitude: parseFloat(decimalMatch[2]),
                                source: 'P625_decimal'
                            };
                        }
                    }
                }
                
                // Method 2: Look for geo: URIs in href attributes
                const geoLinks = document.querySelectorAll('a[href*="geo:"]');
                for (let link of geoLinks) {
                    const href = link.getAttribute('href');
                    if (href) {
                        const match = href.match(/geo:(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                        if (match) {
                            return {
                                latitude: parseFloat(match[1]),
                                longitude: parseFloat(match[2]),
                                source: 'geo_uri'
                            };
                        }
                    }
                }
                
                // Method 3: Look for kartographer map elements
                const mapCaptions = document.querySelectorAll('.wikibase-kartographer-caption');
                for (let caption of mapCaptions) {
                    const text = caption.textContent?.trim();
                    if (text) {
                        // Try to parse various coordinate formats
                        // Format: "54°30′N 74°30′W"
                        const dmsMatch = text.match(/(\d+)°(\d+)′([NS])\s*(\d+)°(\d+)′([EW])/);
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
                            
                            return {
                                latitude,
                                longitude,
                                source: 'kartographer_dms'
                            };
                        }
                        
                        // Format: Decimal coordinates
                        const decimalMatch = text.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
                        if (decimalMatch) {
                            return {
                                latitude: parseFloat(decimalMatch[1]),
                                longitude: parseFloat(decimalMatch[2]),
                                source: 'kartographer_decimal'
                            };
                        }
                    }
                }
                
                // Method 4: Look for any element with coordinate-like text
                const allText = document.body.textContent;
                const coordPatterns = [
                    /(-?\d+\.?\d*)°?\s*[,\/]\s*(-?\d+\.?\d*)°?/,
                    /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/
                ];
                
                for (let pattern of coordPatterns) {
                    const matches = allText.match(pattern);
                    if (matches && matches.length >= 3) {
                        const lat = parseFloat(matches[1]);
                        const lon = parseFloat(matches[2]);
                        // Basic validation
                        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                            return {
                                latitude: lat,
                                longitude: lon,
                                source: 'text_pattern'
                            };
                        }
                    }
                }
                
                return null;
            } catch (error) {
                console.error('Error in page evaluation:', error);
                return null;
            }
        });
        
        if (coordinates) {
            console.log(`✅ Found coordinates: ${coordinates.latitude}, ${coordinates.longitude} (source: ${coordinates.source})`);
            return coordinates;
        } else {
            console.log('❌ No coordinates found');
            
            // Let's do a more detailed analysis of what's on the page
            const pageContent = await page.evaluate(() => {
                // Get some sample content to understand the structure
                const title = document.title;
                const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
                    .map(h => h.textContent?.trim())
                    .slice(0, 5);
                const firstPara = document.querySelector('p')?.textContent?.substring(0, 200);
                
                return { title, headings, firstPara };
            });
            
            console.log('Page analysis:', pageContent);
            return null;
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${wikidataId}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

// Test with a known Wikidata ID
if (require.main === module) {
    const testId = process.argv[2] || 'Q795104'; // Bruce Nuclear Generating Station
    extractCoordinatesFromWikidata(testId)
        .then(coords => {
            if (coords) {
                console.log(`\n📍 Final result for ${testId}:`);
                console.log(`   Latitude: ${coords.latitude}`);
                console.log(`   Longitude: ${coords.longitude}`);
                console.log(`   Source: ${coords.source}`);
            }
        })
        .catch(console.error);
}

module.exports = { extractCoordinatesFromWikidata };