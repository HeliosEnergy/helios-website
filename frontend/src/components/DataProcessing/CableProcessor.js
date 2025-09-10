// CableProcessor.js
class CableProcessor {
  /**
   * Process submarine cables from GeoJSON data
   * @param {object} geoJsonData - GeoJSON data containing cable features
   * @returns {Array} - Processed submarine cable objects
   */
  static processSubmarineCables(geoJsonData) {
    if (!geoJsonData || !geoJsonData.features) {
      return [];
    }

    const cables = [];
    const landingPoints = new Map(); // To avoid duplicate landing points

    geoJsonData.features.forEach((feature, index) => {
      if (feature.geometry?.type === 'LineString') {
        // Extract cable properties
        const props = feature.properties || {};
        
        // Extract coordinates (ensure they are in [lng, lat] format)
        const coordinates = feature.geometry.coordinates.map(coord => [
          parseFloat(coord[0]), 
          parseFloat(coord[1])
        ]);
        
        // Create cable object
        const cable = {
          id: `cable_${index}`,
          name: props.name || props.cable_name || `Cable ${index}`,
          coordinates: coordinates,
          length: props.length || props.cable_length || 0,
          capacity: props.capacity || props.design_capacity || null,
          owners: props.owners ? props.owners.split(';').map(o => o.trim()) : [],
          rfs: props.rfs || props.ready_for_service || null,
          landing_points: []
        };

        // Extract landing points from coordinates
        if (coordinates.length >= 2) {
          const startPoint = coordinates[0];
          const endPoint = coordinates[coordinates.length - 1];
          
          // Create unique IDs for landing points
          const startId = `${startPoint[1].toFixed(4)},${startPoint[0].toFixed(4)}`;
          const endId = `${endPoint[1].toFixed(4)},${endPoint[0].toFixed(4)}`;
          
          // Add start point if not already added
          if (!landingPoints.has(startId)) {
            const startLanding = {
              id: `landing_${startId}`,
              name: props.start_point || 'Unknown Start Point',
              country: props.start_country || 'Unknown',
              coordinates: startPoint
            };
            landingPoints.set(startId, startLanding);
            cable.landing_points.push(startLanding);
          }
          
          // Add end point if not already added
          if (!landingPoints.has(endId)) {
            const endLanding = {
              id: `landing_${endId}`,
              name: props.end_point || 'Unknown End Point',
              country: props.end_country || 'Unknown',
              coordinates: endPoint
            };
            landingPoints.set(endId, endLanding);
            cable.landing_points.push(endLanding);
          }
        }

        cables.push(cable);
      }
    });

    return {
      cables: cables,
      landingPoints: Array.from(landingPoints.values())
    };
  }

  /**
   * Filter cables to only include those with North American endpoints
   * @param {Array} cables - Array of cable objects
   * @returns {Array} - Filtered cables
   */
  static filterNorthAmericaCables(cables) {
    // North American countries and regions
    const naCountries = [
      'Canada', 'United States', 'Mexico', 'Greenland', 
      'Alaska', 'Hawaii', 'Puerto Rico', 'US Virgin Islands'
    ];
    
    const naRegions = [
      'North America', 'North American', 'Canada', 'US', 'USA', 
      'United States', 'Mexico', 'Alaska', 'Hawaii'
    ];

    return cables.filter(cable => {
      // Check if either endpoint is in North America
      return cable.landing_points.some(point => {
        const country = (point.country || '').toLowerCase();
        const name = (point.name || '').toLowerCase();
        
        return (
          naCountries.some(c => country.includes(c.toLowerCase())) ||
          naRegions.some(r => name.includes(r.toLowerCase())) ||
          // Check if coordinates are in North American bounds
          this.isNorthAmericanCoordinate(point.coordinates[1], point.coordinates[0])
        );
      });
    });
  }

  /**
   * Check if coordinates are within North American bounds
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} - True if coordinates are in North America
   */
  static isNorthAmericanCoordinate(lat, lng) {
    // Rough bounds for North America
    return (
      lat >= 10 && lat <= 85 &&
      lng >= -170 && lng <= -50
    );
  }

  /**
   * Simplify cable geometry for better performance
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {number} tolerance - Simplification tolerance
   * @returns {Array} - Simplified coordinates
   */
  static simplifyGeometry(coordinates, tolerance = 0.01) {
    if (!Array.isArray(coordinates) || coordinates.length <= 2) {
      return coordinates;
    }

    // Simple implementation - keep every nth point
    const simplified = [];
    const step = Math.max(1, Math.floor(coordinates.length * tolerance));
    
    for (let i = 0; i < coordinates.length; i += step) {
      simplified.push(coordinates[i]);
    }
    
    // Always include the last point
    if (simplified[simplified.length - 1] !== coordinates[coordinates.length - 1]) {
      simplified.push(coordinates[coordinates.length - 1]);
    }

    return simplified;
  }

  /**
   * Fetch submarine cable data from ITU WFS service
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

  /**
   * Parse GPKG file and convert to GeoJSON
   * @param {string} filePath - Path to GPKG file
   * @returns {Promise<object>} - GeoJSON data
   */
  static async parseGPKG(filePath) {
    try {
      // In a real implementation, this would use a library like gpkg.js
      // For this prototype, we'll simulate the conversion
      console.warn('GPKG parsing not implemented in this prototype');
      return { features: [] };
    } catch (error) {
      console.error('Error parsing GPKG file:', error);
      return { features: [] };
    }
  }
}

export default CableProcessor;