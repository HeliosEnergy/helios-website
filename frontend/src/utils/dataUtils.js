// dataUtils.js
/**
 * Load CSV data using Papa Parse
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} - Parsed CSV data
 */
export async function loadCSVData(filePath) {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    // Simple CSV parsing (in a real app, use Papa Parse library)
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      // Handle quoted values that may contain commas
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last value
      values.push(current.trim().replace(/"/g, ''));
      
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return [];
  }
}

/**
 * Load GeoJSON data
 * @param {string} filePath - Path to GeoJSON file
 * @returns {Promise<object>} - Parsed GeoJSON data
 */
export async function loadGeoJSONData(filePath) {
  try {
    const response = await fetch(filePath);
    return await response.json();
  } catch (error) {
    console.error('Error loading GeoJSON data:', error);
    return { features: [] };
  }
}

/**
 * Convert GPKG to GeoJSON (simplified)
 * @param {string} filePath - Path to GPKG file
 * @returns {Promise<object>} - Converted GeoJSON data
 */
export async function convertGPKGToGeoJSON(filePath) {
  // In a real implementation, this would use a library like gpkg.js
  // For this prototype, we'll simulate the conversion
  console.warn('GPKG to GeoJSON conversion not implemented in this prototype');
  return { features: [] };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Array} coord1 - [lng, lat] of first point
 * @param {Array} coord2 - [lng, lat] of second point
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Group data by a property
 * @param {Array} data - Array of objects
 * @param {string} property - Property to group by
 * @returns {object} - Grouped data
 */
export function groupBy(data, property) {
  return data.reduce((groups, item) => {
    const group = item[property] || 'unknown';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * Calculate statistics for power plants
 * @param {Array} powerPlants - Array of power plant objects
 * @returns {object} - Statistics object
 */
export function calculatePowerPlantStats(powerPlants) {
  const stats = {
    totalCapacity: 0,
    sourceBreakdown: {},
    plantCount: powerPlants.length
  };

  powerPlants.forEach(plant => {
    // Add to total capacity
    stats.totalCapacity += plant.output || 0;
    
    // Group by source
    const source = plant.source || 'unknown';
    if (!stats.sourceBreakdown[source]) {
      stats.sourceBreakdown[source] = {
        count: 0,
        capacity: 0
      };
    }
    stats.sourceBreakdown[source].count++;
    stats.sourceBreakdown[source].capacity += plant.output || 0;
  });

  return stats;
}