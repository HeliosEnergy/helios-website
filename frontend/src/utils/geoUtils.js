// geoUtils.js

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} - Angle in degrees
 */
export function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Calculate the center point of a set of coordinates
 * @param {Array} coordinates - Array of [lng, lat] coordinates
 * @returns {Array} - Center [lng, lat]
 */
export function getCenter(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return [0, 0];
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  coordinates.forEach(coord => {
    if (Array.isArray(coord) && coord.length >= 2) {
      const [lng, lat] = coord;
      minX = Math.min(minX, lng);
      maxX = Math.max(maxX, lng);
      minY = Math.min(minY, lat);
      maxY = Math.max(maxY, lat);
    } else if (coord.coordinates) {
      // Handle nested coordinates (like in GeoJSON)
      const center = getCenter(coord.coordinates);
      minX = Math.min(minX, center[0]);
      maxX = Math.max(maxX, center[0]);
      minY = Math.min(minY, center[1]);
      maxY = Math.max(maxY, center[1]);
    }
  });

  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

/**
 * Calculate bounding box for a set of coordinates
 * @param {Array} coordinates - Array of [lng, lat] coordinates
 * @returns {object} - Bounding box {minLng, minLat, maxLng, maxLat}
 */
export function getBoundingBox(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { minLng: -180, minLat: -90, maxLng: 180, maxLat: 90 };
  }

  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  function processCoordinate(coord) {
    if (Array.isArray(coord) && coord.length >= 2) {
      const [lng, lat] = coord;
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }

  coordinates.forEach(coord => {
    if (coord.coordinates) {
      // Handle nested coordinates
      const bbox = getBoundingBox(coord.coordinates);
      minLng = Math.min(minLng, bbox.minLng);
      maxLng = Math.max(maxLng, bbox.maxLng);
      minLat = Math.min(minLat, bbox.minLat);
      maxLat = Math.max(maxLat, bbox.maxLat);
    } else if (Array.isArray(coord)) {
      if (Array.isArray(coord[0])) {
        // Array of coordinates
        coord.forEach(processCoordinate);
      } else {
        // Single coordinate
        processCoordinate(coord);
      }
    }
  });

  return { minLng, minLat, maxLng, maxLat };
}

/**
 * Check if a point is within a bounding box
 * @param {Array} point - [lng, lat] point
 * @param {object} bbox - Bounding box {minLng, minLat, maxLng, maxLat}
 * @returns {boolean} - True if point is within bbox
 */
export function isPointInBoundingBox(point, bbox) {
  const [lng, lat] = point;
  return (
    lng >= bbox.minLng && lng <= bbox.maxLng &&
    lat >= bbox.minLat && lat <= bbox.maxLat
  );
}

/**
 * Simplify a line using the Douglas-Peucker algorithm
 * @param {Array} points - Array of [lng, lat] points
 * @param {number} tolerance - Simplification tolerance
 * @returns {Array} - Simplified points
 */
export function simplifyLine(points, tolerance = 0.001) {
  if (!Array.isArray(points) || points.length <= 2) {
    return points;
  }

  function perpendicularDistance(point, lineStart, lineEnd) {
    // Calculate perpendicular distance from point to line
    const [x, y] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;
    
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function douglasPeucker(points, tolerance) {
    if (points.length <= 2) {
      return points;
    }
    
    let maxDistance = 0;
    let index = 0;
    
    const start = points[0];
    const end = points[points.length - 1];
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    if (maxDistance > tolerance) {
      const left = douglasPeucker(points.slice(0, index + 1), tolerance);
      const right = douglasPeucker(points.slice(index), tolerance);
      return left.slice(0, -1).concat(right);
    } else {
      return [start, end];
    }
  }

  return douglasPeucker(points, tolerance);
}

/**
 * Convert coordinates precision (reduce decimal places)
 * @param {Array} coordinates - Array of coordinates
 * @param {number} decimals - Number of decimal places
 * @returns {Array} - Coordinates with reduced precision
 */
export function reduceCoordinatePrecision(coordinates, decimals = 4) {
  if (!Array.isArray(coordinates)) {
    return coordinates;
  }

  if (coordinates.length === 2 && typeof coordinates[0] === 'number') {
    // Single coordinate [lng, lat]
    return [
      parseFloat(coordinates[0].toFixed(decimals)),
      parseFloat(coordinates[1].toFixed(decimals))
    ];
  }

  // Array of coordinates
  return coordinates.map(coord => reduceCoordinatePrecision(coord, decimals));
}