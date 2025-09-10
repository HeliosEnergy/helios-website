// TerrestrialProcessor.js
class TerrestrialProcessor {
  /**
   * Filter features to only include Canadian terrestrial infrastructure
   * @param {Array} features - Array of GeoJSON features
   * @returns {Array} - Filtered terrestrial links
   */
  static filterCanadianLinks(features) {
    if (!Array.isArray(features)) {
      return [];
    }

    const canadianLinks = [];

    features.forEach((feature, index) => {
      if (feature.geometry?.type === 'LineString') {
        // Extract properties
        const props = feature.properties || {};
        
        // Check if this is a Canadian link
        const isCanadian = this.isCanadianLink(props, feature.geometry.coordinates);
        
        if (isCanadian) {
          // Extract coordinates (ensure they are in [lng, lat] format)
          const coordinates = feature.geometry.coordinates.map(coord => [
            parseFloat(coord[0]), 
            parseFloat(coord[1])
          ]);
          
          // Create terrestrial link object
          const link = {
            id: `terrestrial_${index}`,
            name: props.name || props.description || `Link ${index}`,
            coordinates: coordinates,
            type: props.type || props.infrastructure_type || 'unknown',
            country: 'Canada',
            properties: props
          };

          canadianLinks.push(link);
        }
      }
    });

    return canadianLinks;
  }

  /**
   * Check if a link is Canadian based on properties or coordinates
   * @param {object} properties - Feature properties
   * @param {Array} coordinates - Line coordinates
   * @returns {boolean} - True if link is Canadian
   */
  static isCanadianLink(properties, coordinates) {
    // Check properties for Canadian indicators
    const propsText = JSON.stringify(properties).toLowerCase();
    
    const canadianIndicators = [
      'canada', 'canadian', 'ontario', 'quebec', 'alberta', 'british columbia',
      'bc', 'manitoba', 'saskatchewan', 'nova scotia', 'new brunswick', 
      'newfoundland', 'pei', 'yukon', 'nwt', 'nunavut'
    ];
    
    // Check if any Canadian indicator is in properties
    const hasCanadianProperty = canadianIndicators.some(indicator => 
      propsText.includes(indicator)
    );
    
    if (hasCanadianProperty) {
      return true;
    }
    
    // Check if coordinates are in Canadian bounds
    if (Array.isArray(coordinates) && coordinates.length > 0) {
      // Check a sample of coordinates to see if they're in Canada
      const sampleCoords = coordinates.length > 10 
        ? coordinates.filter((_, i) => i % Math.floor(coordinates.length / 10) === 0)
        : coordinates;
      
      return sampleCoords.some(coord => 
        this.isCanadianCoordinate(coord[1], coord[0])
      );
    }
    
    return false;
  }

  /**
   * Check if coordinates are within Canadian bounds
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} - True if coordinates are in Canada
   */
  static isCanadianCoordinate(lat, lng) {
    // Rough bounds for Canada
    return (
      lat >= 40 && lat <= 85 &&
      lng >= -145 && lng <= -50
    );
  }

  /**
   * Simplify terrestrial link geometry for better performance
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {number} tolerance - Simplification tolerance
   * @returns {Array} - Simplified coordinates
   */
  static simplifyGeometry(coordinates, tolerance = 0.001) {
    if (!Array.isArray(coordinates) || coordinates.length <= 2) {
      return coordinates;
    }

    // Douglas-Peucker algorithm simplified implementation
    const simplified = [coordinates[0]];
    
    // Simple approach: keep points that are far enough from the previous point
    for (let i = 1; i < coordinates.length - 1; i++) {
      const prev = simplified[simplified.length - 1];
      const current = coordinates[i];
      
      // Calculate distance (simplified)
      const distance = Math.sqrt(
        Math.pow(current[0] - prev[0], 2) + 
        Math.pow(current[1] - prev[1], 2)
      );
      
      if (distance > tolerance) {
        simplified.push(current);
      }
    }
    
    // Always include the last point
    simplified.push(coordinates[coordinates.length - 1]);
    
    return simplified;
  }

  /**
   * Fetch ITU data from WFS service
   * @returns {Promise<object>} - GeoJSON data
   */
  static async fetchITUData() {
    try {
      // In a real implementation, this would fetch from:
      // https://bbmaps.itu.int/geoserver/itu-geocatalogue/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=itu-geocatalogue:trx_geocatalogue&outputFormat=application/json
      
      // For now, we'll return a placeholder
      console.warn('ITU data fetching not implemented in this prototype');
      return { features: [] };
    } catch (error) {
      console.error('Error fetching ITU data:', error);
      return { features: [] };
    }
  }
}

export default TerrestrialProcessor;