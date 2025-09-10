// PowerPlantProcessor.js
class PowerPlantProcessor {
  /**
   * Parse power output string to numeric value
   * @param {string} outputString - Output in format "6,232 MW"
   * @returns {number} - Numeric value in MW
   */
  static parseOutput(outputString) {
    if (!outputString) return 0;
    
    // Remove non-numeric characters except decimal point and comma
    const cleaned = outputString.replace(/[^\d,.]/g, '').replace(/,/g, '');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Categorize energy source with consistent types and colors
   * @param {string} source - Raw source from data
   * @param {string} method - Generation method
   * @returns {object} - Standardized source info
   */
  static categorizeSource(source, method) {
    const sourceMap = {
      'nuclear': { type: 'nuclear', color: [255, 100, 100] },
      'hydro': { type: 'hydro', color: [100, 150, 255] },
      'gas': { type: 'gas', color: [255, 200, 100] },
      'coal': { type: 'coal', color: [100, 100, 100] },
      'wind': { type: 'wind', color: [150, 255, 150] },
      'solar': { type: 'solar', color: [255, 255, 100] },
      'biomass': { type: 'other', color: [200, 150, 255] },
      'oil': { type: 'other', color: [200, 150, 255] },
      'diesel': { type: 'other', color: [200, 150, 255] },
      'battery': { type: 'other', color: [200, 150, 255] },
      'waste': { type: 'other', color: [200, 150, 255] },
      'geothermal': { type: 'other', color: [200, 150, 255] },
      'tidal': { type: 'other', color: [200, 150, 255] }
    };

    // Normalize source string
    const normalizedSource = (source || '').toLowerCase().trim();
    
    // Special handling for combined sources like "gas;oil"
    if (normalizedSource.includes(';')) {
      const sources = normalizedSource.split(';');
      // Return the first recognized source type
      for (const src of sources) {
        const cleanSrc = src.trim();
        if (sourceMap[cleanSrc]) {
          return sourceMap[cleanSrc];
        }
      }
    }
    
    // Return mapped source or default to 'other'
    return sourceMap[normalizedSource] || { type: 'other', color: [200, 150, 255] };
  }

  /**
   * Validate coordinates are within North America bounds
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} - Valid coordinates flag
   */
  static validateCoordinates(lat, lng) {
    // North America bounds: lat 25-85, lng -180 to -50
    return (
      lat >= 25 && lat <= 85 &&
      lng >= -180 && lng <= -50
    );
  }

  /**
   * Process CSV data into standardized PowerPlant objects
   * @param {Array} csvData - Raw CSV data array
   * @returns {Array} - Processed PowerPlant objects
   */
  static processCSV(csvData) {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      return [];
    }

    const powerPlants = [];

    // Skip header row if present
    const startIndex = csvData[0] && csvData[0].name === 'name' ? 1 : 0;

    for (let i = startIndex; i < csvData.length; i++) {
      const row = csvData[i];
      
      // Skip empty rows
      if (!row || !row.name) continue;

      // Parse coordinates
      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      
      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng) || !this.validateCoordinates(lat, lng)) {
        continue;
      }

      // Parse output
      const output = this.parseOutput(row.output);
      
      // Skip plants with zero output
      if (output <= 0) continue;
      
      // Categorize source
      const sourceInfo = this.categorizeSource(row.source, row.method);

      // Create standardized power plant object
      const powerPlant = {
        id: `plant_${i}`,
        name: row.name || 'Unknown',
        operator: row.operator || 'Unknown',
        output: output,
        outputDisplay: row.output || 'Unknown',
        source: sourceInfo.type,
        method: row.method || 'Unknown',
        wikidataId: row.wikidata_id || null,
        latitude: lat,
        longitude: lng,
        coordinates: [lng, lat] // [lng, lat] for Deck.gl
      };

      powerPlants.push(powerPlant);
    }

    return powerPlants;
  }
}

export default PowerPlantProcessor;