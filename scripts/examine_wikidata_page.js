const puppeteer = require('puppeteer');
const fs = require('fs');

async function examineWikidataPage(wikidataId) {
    console.log(`🔍 Examining Wikidata page for ${wikidataId}...`);
    
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
        await page.waitForTimeout(3000);
        
        // Get specific elements that might contain coordinates
        const analysis = await page.evaluate(() => {
            const results = {};
            
            // Look for P625 (coordinate location) property specifically
            const p625Sections = document.querySelectorAll('[data-property-id="P625"]');
            results.p625Count = p625Sections.length;
            results.p625Details = [];
            
            p625Sections.forEach((section, index) => {
                const valueElement = section.querySelector('.wikibase-snakview-value');
                if (valueElement) {
                    results.p625Details.push({
                        index,
                        textContent: valueElement.textContent?.trim(),
                        innerHTML: valueElement.innerHTML.substring(0, 200)
                    });
                }
            });
            
            // Look for kartographer elements
            const kartographerElements = document.querySelectorAll('.wikibase-kartographer');
            results.kartographerCount = kartographerElements.length;
            results.kartographerDetails = [];
            
            kartographerElements.forEach((element, index) => {
                results.kartographerDetails.push({
                    index,
                    className: element.className,
                    innerHTML: element.innerHTML.substring(0, 200)
                });
            });
            
            // Look for map captions
            const mapCaptions = document.querySelectorAll('.wikibase-kartographer-caption');
            results.mapCaptionCount = mapCaptions.length;
            results.mapCaptionDetails = [];
            
            mapCaptions.forEach((caption, index) => {
                results.mapCaptionDetails.push({
                    index,
                    textContent: caption.textContent?.trim(),
                    innerHTML: caption.innerHTML.substring(0, 200)
                });
            });
            
            // Look for any geo: links
            const geoLinks = document.querySelectorAll('a[href*="geo:"]');
            results.geoLinkCount = geoLinks.length;
            results.geoLinkDetails = [];
            
            geoLinks.forEach((link, index) => {
                results.geoLinkDetails.push({
                    index,
                    href: link.getAttribute('href'),
                    textContent: link.textContent?.trim()
                });
            });
            
            // Get page title and some context
            results.pageTitle = document.title;
            results.firstHeading = document.querySelector('h1')?.textContent?.trim();
            
            return results;
        });
        
        console.log('\n=== Analysis Results ===');
        console.log(`Page Title: ${analysis.pageTitle}`);
        console.log(`First Heading: ${analysis.firstHeading}`);
        console.log(`\nP625 (Coordinate Location) Sections: ${analysis.p625Count}`);
        analysis.p625Details.forEach(detail => {
            console.log(`  ${detail.index}: ${detail.textContent}`);
        });
        
        console.log(`\nKartographer Elements: ${analysis.kartographerCount}`);
        analysis.kartographerDetails.forEach(detail => {
            console.log(`  ${detail.index}: ${detail.className}`);
        });
        
        console.log(`\nMap Captions: ${analysis.mapCaptionCount}`);
        analysis.mapCaptionDetails.forEach(detail => {
            console.log(`  ${detail.index}: ${detail.textContent}`);
        });
        
        console.log(`\nGeo Links: ${analysis.geoLinkCount}`);
        analysis.geoLinkDetails.forEach(detail => {
            console.log(`  ${detail.index}: ${detail.href} -> ${detail.textContent}`);
        });
        
        // Save the full HTML for detailed analysis
        const htmlContent = await page.content();
        fs.writeFileSync(`wikidata_${wikidataId}_analysis.html`, htmlContent);
        console.log(`\n📄 Full HTML saved to wikidata_${wikidataId}_analysis.html`);
        
    } catch (error) {
        console.error('❌ Analysis failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the examination
const testId = process.argv[2] || 'Q795104'; // Bruce Nuclear Generating Station
examineWikidataPage(testId).catch(console.error);