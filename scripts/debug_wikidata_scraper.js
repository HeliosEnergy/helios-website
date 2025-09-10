const puppeteer = require('puppeteer');
const fs = require('fs');

async function debugWikidataPage(wikidataId) {
    console.log(`🔍 Debugging Wikidata page for ${wikidataId}...`);
    
    const browser = await puppeteer.launch({
        headless: false, // Run in non-headless mode to see what's happening
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Navigate to Wikidata page
        const wikidataUrl = `https://www.wikidata.org/wiki/${wikidataId}`;
        console.log(`📡 Navigating to ${wikidataUrl}`);
        
        await page.goto(wikidataUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait a bit for all content to load
        await page.waitForTimeout(5000);
        
        // Get the full page content for analysis
        const content = await page.content();
        fs.writeFileSync(`wikidata_${wikidataId}_full.html`, content);
        console.log(`📄 Full page HTML saved to wikidata_${wikidataId}_full.html`);
        
        // Try different approaches to find coordinates
        
        // Approach 1: Look for kartographer elements
        console.log('\n--- Approach 1: Kartographer Elements ---');
        const kartographerElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('.wikibase-kartographer-caption, .wikibase-kartographer-map');
            const results = [];
            elements.forEach((el, index) => {
                results.push({
                    index,
                    tagName: el.tagName,
                    className: el.className,
                    innerHTML: el.innerHTML.substring(0, 200) + '...',
                    textContent: el.textContent?.substring(0, 100) + '...'
                });
            });
            return results;
        });
        console.log('Kartographer elements found:', kartographerElements.length);
        kartographerElements.forEach(el => console.log(el));
        
        // Approach 2: Look for coordinate properties
        console.log('\n--- Approach 2: Coordinate Properties ---');
        const coordinateProperties = await page.evaluate(() => {
            // Look for elements that might contain coordinates
            const possibleElements = document.querySelectorAll('a[href*="geo:"], a[href*="maps"], .wikibase-snakview-value, .wikibase-statementview-mainsnak');
            const results = [];
            possibleElements.forEach((el, index) => {
                const href = el.getAttribute('href');
                const text = el.textContent?.trim();
                const title = el.getAttribute('title');
                
                if (href || text || title) {
                    results.push({
                        index,
                        tagName: el.tagName,
                        href: href?.substring(0, 100),
                        text: text?.substring(0, 100),
                        title: title?.substring(0, 100),
                        className: el.className
                    });
                }
            });
            return results;
        });
        console.log('Coordinate-related elements found:', coordinateProperties.length);
        coordinateProperties.slice(0, 10).forEach(el => console.log(el));
        
        // Approach 3: Look for specific property IDs (P625 is the Wikidata property for coordinates)
        console.log('\n--- Approach 3: Property P625 (coordinate location) ---');
        const p625Elements = await page.evaluate(() => {
            // Look for elements with P625 (coordinate location property)
            const elements = document.querySelectorAll('[data-property-id="P625"], [about*="P625"]');
            const results = [];
            elements.forEach((el, index) => {
                results.push({
                    index,
                    tagName: el.tagName,
                    className: el.className,
                    innerHTML: el.innerHTML.substring(0, 200) + '...',
                    textContent: el.textContent?.substring(0, 100) + '...'
                });
            });
            return results;
        });
        console.log('P625 elements found:', p625Elements.length);
        p625Elements.forEach(el => console.log(el));
        
        // Approach 4: Search for any geo: URIs in the entire page
        console.log('\n--- Approach 4: Search for geo: URIs ---');
        const geoUris = await page.evaluate(() => {
            const bodyText = document.body.innerHTML;
            const geoMatches = bodyText.match(/geo:[^"']+/g);
            return geoMatches || [];
        });
        console.log('Geo URIs found:', geoUris);
        
        // Approach 5: Look for map links
        console.log('\n--- Approach 5: Map Links ---');
        const mapLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('a[href*="map"], a[href*="coordinates"], a[href*="location"]');
            const results = [];
            links.forEach((link, index) => {
                if (index < 10) { // Limit to first 10
                    results.push({
                        index,
                        href: link.getAttribute('href')?.substring(0, 100),
                        text: link.textContent?.substring(0, 50),
                        title: link.getAttribute('title')?.substring(0, 50)
                    });
                }
            });
            return results;
        });
        console.log('Map-related links found:', mapLinks.length);
        mapLinks.forEach(link => console.log(link));
        
        console.log('\n✅ Debugging complete. Check the saved HTML file for detailed analysis.');
        
    } catch (error) {
        console.error('❌ Debugging failed:', error);
    } finally {
        // Don't close the browser immediately so we can see the page
        console.log('🔍 Keeping browser open for manual inspection. Close it manually when done.');
        // await browser.close();
    }
}

// Run debug for a specific Wikidata ID
// You can change this to test with different IDs
const testWikidataId = process.argv[2] || 'Q795104'; // Bruce Nuclear Generating Station
debugWikidataPage(testWikidataId).catch(console.error);