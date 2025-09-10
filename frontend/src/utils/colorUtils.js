// colorUtils.js

// Color schemes for different infrastructure types
export const COLOR_SCHEMES = {
  powerSources: {
    nuclear: [255, 100, 100],    // Red
    hydro: [100, 150, 255],      // Blue
    gas: [255, 200, 100],        // Orange
    coal: [100, 100, 100],       // Gray
    wind: [150, 255, 150],       // Light green
    solar: [255, 255, 100],      // Yellow
    other: [200, 150, 255]       // Purple
  },
  infrastructure: {
    submarine: [0, 150, 255],    // Ocean blue
    terrestrial: [255, 0, 255],  // Magenta
    landingPoint: [255, 100, 0]  // Orange
  }
};

/**
 * Get color for a power source type
 * @param {string} source - Power source type
 * @returns {Array} - RGB color array
 */
export function getSourceColor(source) {
  // Ensure we return a valid color array
  if (source && COLOR_SCHEMES.powerSources[source]) {
    return COLOR_SCHEMES.powerSources[source];
  }
  return COLOR_SCHEMES.powerSources.other;
}

/**
 * Get color for infrastructure type
 * @param {string} type - Infrastructure type
 * @returns {Array} - RGB color array
 */
export function getInfrastructureColor(type) {
  // Ensure we return a valid color array
  if (type && COLOR_SCHEMES.infrastructure[type]) {
    return COLOR_SCHEMES.infrastructure[type];
  }
  return [200, 200, 200];
}

/**
 * Convert hex color to RGB array
 * @param {string} hex - Hex color code
 * @returns {Array} - RGB array
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/**
 * Convert RGB array to hex color
 * @param {Array} rgb - RGB array
 * @returns {string} - Hex color code
 */
export function rgbToHex(rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

/**
 * Interpolate between two colors
 * @param {Array} color1 - First RGB color
 * @param {Array} color2 - Second RGB color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {Array} - Interpolated RGB color
 */
export function interpolateColor(color1, color2, factor) {
  return [
    Math.round(color1[0] + factor * (color2[0] - color1[0])),
    Math.round(color1[1] + factor * (color2[1] - color1[1])),
    Math.round(color1[2] + factor * (color2[2] - color1[2]))
  ];
}