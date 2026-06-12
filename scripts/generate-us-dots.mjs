/**
 * Generates the dot-matrix geometry for the Helios footprint map.
 *
 * Rasterizes the contiguous US (Albers, 975x610, AK/HI excluded) into a
 * hex-staggered dot grid and projects site cities into the same space.
 * Output: src/components/map/us-map-data.json
 *
 * Run: node scripts/generate-us-dots.mjs
 */
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as topojson from "topojson-client";
import { geoAlbersUsa } from "d3-geo";

const require = createRequire(import.meta.url);
const us = require("us-atlas/states-albers-10m.json");

// Contiguous US only — drop Alaska (02), Hawaii (15), territories
const EXCLUDE = new Set(["02", "15", "60", "66", "69", "72", "78"]);
const conus = topojson.merge(
  us,
  us.objects.states.geometries.filter((g) => !EXCLUDE.has(g.id)),
);

// Even-odd point-in-polygon across every ring (handles holes via parity)
const rings = [];
const collect = (poly) => poly.forEach((ring) => rings.push(ring));
if (conus.type === "Polygon") collect(conus.coordinates);
else conus.coordinates.forEach(collect);

function inside(x, y) {
  let odd = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        odd = !odd;
      }
    }
  }
  return odd;
}

// Hex-staggered grid
const STEP = 9;
const ROW = STEP * 0.8660254;
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const ring of rings) {
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const dots = [];
let row = 0;
for (let y = minY; y <= maxY; y += ROW, row++) {
  const offset = row % 2 ? STEP / 2 : 0;
  for (let x = minX + offset; x <= maxX; x += STEP) {
    if (inside(x, y)) dots.push(Math.round(x), Math.round(y));
  }
}

// Site cities -> same Albers 975x610 space. d3's defaults (scale 1070,
// translate [480, 250]) do NOT match the pre-projected atlas — us-atlas
// albers files are built with scale 1300, translate [487.5, 305].
const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const cities = {
  utah: [-111.891, 40.7608], // Salt Lake City
  northCarolina: [-80.8431, 35.2271], // Charlotte
  florida: [-81.6557, 30.3322], // Jacksonville
  kentucky: [-85.7585, 38.2527], // Louisville
  texas: [-96.797, 32.7767], // Dallas
};
const sites = Object.fromEntries(
  Object.entries(cities).map(([k, lonLat]) => {
    const p = projection(lonLat);
    return [k, [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]];
  }),
);

const out = {
  step: STEP,
  bbox: [Math.round(minX), Math.round(minY), Math.round(maxX), Math.round(maxY)],
  sites,
  dots,
};

const here = dirname(fileURLToPath(import.meta.url));
const dest = join(here, "../src/components/map/us-map-data.json");
await writeFile(dest, JSON.stringify(out));
console.log(`dots: ${dots.length / 2}, bbox: ${out.bbox}, sites:`, sites);
