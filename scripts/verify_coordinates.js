// Script to verify coordinate distribution
console.log('Testing coordinate distribution...\n');

// Simplified version of the estimateCoordinates function from canada_openinframap_scraper.ts
function estimateCoordinates(plantName, province) {
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
    
    const baseCoords = provinceCoordinates[province] || 
                      { latitude: 60.0, longitude: -100.0 }; // Default to center of Canada
    
    // Generate a unique hash-based offset for each plant to ensure better distribution
    const plantHash = plantName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    // Use the hash to create deterministic but distributed offsets
    const offsetLat = (plantHash % 1000) / 1000 * 4 - 2; // Range: -2 to 2
    const offsetLon = ((plantHash * 7) % 1000) / 1000 * 8 - 4; // Range: -4 to 4
    
    return {
        latitude: baseCoords.latitude + offsetLat,
        longitude: baseCoords.longitude + offsetLon
    };
}

// Test data
const testPlants = [
    { name: 'Bruce Nuclear Generating Station', province: 'Ontario' },
    { name: 'Pickering Nuclear Station', province: 'Ontario' },
    { name: 'Darlington Nuclear Station', province: 'Ontario' },
    { name: 'Hydro-Québec Plant A', province: 'Quebec' },
    { name: 'Hydro-Québec Plant B', province: 'Quebec' },
    { name: 'BC Hydro Plant 1', province: 'British Columbia' },
    { name: 'BC Hydro Plant 2', province: 'British Columbia' },
    { name: 'Alberta Gas Plant', province: 'Alberta' },
    { name: 'Saskatchewan Wind Farm', province: 'Saskatchewan' },
    { name: 'Manitoba Hydro Station', province: 'Manitoba' },
    { name: 'Nova Scotia Offshore Wind', province: 'Nova Scotia' },
    { name: 'New Brunswick Solar Farm', province: 'New Brunswick' },
    { name: 'Newfoundland Hydro Project', province: 'Newfoundland and Labrador' },
    { name: 'Yukon Geothermal Plant', province: 'Yukon' },
    { name: 'Unknown Plant', province: null }
];

console.log('Plant Name'.padEnd(35) + 'Province'.padEnd(20) + 'Latitude'.padEnd(12) + 'Longitude');
console.log('-'.repeat(80));

testPlants.forEach(plant => {
    const coords = estimateCoordinates(plant.name, plant.province);
    console.log(
        plant.name.padEnd(35) + 
        (plant.province || 'Unknown').padEnd(20) + 
        coords.latitude.toFixed(4).padEnd(12) + 
        coords.longitude.toFixed(4)
    );
});

console.log('\nCoordinate distribution verification completed.');