"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeOpenInfraMapAndWikidata = scrapeOpenInfraMapAndWikidata;
var puppeteer_1 = require("puppeteer");
var fs_1 = require("fs");
var path_1 = require("path");
function scrapeOpenInfraMapAndWikidata() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, powerPlants, csvHeaders, csvRows, csvContent, timestamp, csvFilePath, dataDir, updatedCount, i, plant, wikidataUrl, coordinates, error_1, updatedCsvRows, updatedCsvContent, updatedCsvFilePath, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Starting enhanced Canada power plant scraper...');
                    return [4 /*yield*/, puppeteer_1.default.launch({
                            headless: true,
                            args: ['--no-sandbox', '--disable-setuid-sandbox']
                        })];
                case 1:
                    browser = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 15, 16, 18]);
                    // Phase 1: Scrape data from OpenInfraMap
                    console.log('📡 Navigating to OpenInfraMap Canada page...');
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.goto('https://openinframap.org/stats/area/Canada/plants', {
                            waitUntil: 'networkidle0',
                            timeout: 30000
                        })];
                case 5:
                    _a.sent();
                    console.log('📊 Extracting power plant data...');
                    return [4 /*yield*/, page.evaluate(function () {
                            var table = document.querySelector('table');
                            if (!table)
                                return [];
                            var rows = Array.from(table.querySelectorAll('tbody tr'));
                            return rows.map(function (row) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                var cells = Array.from(row.querySelectorAll('td'));
                                if (cells.length < 4)
                                    return null;
                                // Extract Wikidata ID from the link
                                var wikidataId = null;
                                var wikidataLink = (_a = cells[5]) === null || _a === void 0 ? void 0 : _a.querySelector('a');
                                if (wikidataLink) {
                                    var href = wikidataLink.getAttribute('href');
                                    if (href) {
                                        var match = href.match(/Q\d+/);
                                        if (match) {
                                            wikidataId = match[0];
                                        }
                                    }
                                }
                                return {
                                    name: ((_c = (_b = cells[0]) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '',
                                    operator: ((_e = (_d = cells[1]) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || null,
                                    output: ((_g = (_f = cells[2]) === null || _f === void 0 ? void 0 : _f.textContent) === null || _g === void 0 ? void 0 : _g.trim()) || '',
                                    source: ((_j = (_h = cells[3]) === null || _h === void 0 ? void 0 : _h.textContent) === null || _j === void 0 ? void 0 : _j.trim()) || '',
                                    method: ((_l = (_k = cells[4]) === null || _k === void 0 ? void 0 : _k.textContent) === null || _l === void 0 ? void 0 : _l.trim()) || null,
                                    wikidataId: wikidataId,
                                    latitude: null,
                                    longitude: null
                                };
                            }).filter(function (plant) { return plant !== null; });
                        })];
                case 6:
                    powerPlants = _a.sent();
                    console.log("\uD83D\uDCC8 Found ".concat(powerPlants.length, " power plants"));
                    csvHeaders = ['name', 'operator', 'output', 'source', 'method', 'wikidata_id', 'latitude', 'longitude'];
                    csvRows = powerPlants.map(function (plant) { return [
                        "\"".concat(plant.name, "\""),
                        plant.operator ? "\"".concat(plant.operator, "\"") : '',
                        "\"".concat(plant.output, "\""),
                        "\"".concat(plant.source, "\""),
                        plant.method ? "\"".concat(plant.method, "\"") : '',
                        plant.wikidataId || '',
                        plant.latitude || '',
                        plant.longitude || ''
                    ]; });
                    csvContent = __spreadArray([
                        csvHeaders.join(',')
                    ], csvRows.map(function (row) { return row.join(','); }), true).join('\n');
                    timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    csvFilePath = path_1.default.join(__dirname, "../data/canada_power_plants_".concat(timestamp, ".csv"));
                    dataDir = path_1.default.join(__dirname, '../data');
                    if (!fs_1.default.existsSync(dataDir)) {
                        fs_1.default.mkdirSync(dataDir, { recursive: true });
                    }
                    fs_1.default.writeFileSync(csvFilePath, csvContent);
                    console.log("\uD83D\uDCBE Initial data saved to ".concat(csvFilePath));
                    // Phase 2: Extract coordinates from Wikidata
                    console.log('🌍 Extracting coordinates from Wikidata...');
                    updatedCount = 0;
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < powerPlants.length)) return [3 /*break*/, 14];
                    plant = powerPlants[i];
                    // Skip plants without Wikidata IDs
                    if (!plant.wikidataId) {
                        return [3 /*break*/, 13];
                    }
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 12, , 13]);
                    console.log("\uD83D\uDCCD Processing ".concat(plant.name, " (").concat(plant.wikidataId, ")..."));
                    wikidataUrl = "https://www.wikidata.org/wiki/".concat(plant.wikidataId);
                    return [4 /*yield*/, page.goto(wikidataUrl, {
                            waitUntil: 'networkidle0',
                            timeout: 30000
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            var _a;
                            // Look for coordinate elements
                            var coordinateElements = document.querySelectorAll('.wikibase-kartographer-caption a');
                            for (var _i = 0, coordinateElements_1 = coordinateElements; _i < coordinateElements_1.length; _i++) {
                                var element = coordinateElements_1[_i];
                                var href = element.getAttribute('href');
                                if (href && href.includes('geo:')) {
                                    // Extract coordinates from geo URI
                                    var match = href.match(/geo:(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                                    if (match) {
                                        return {
                                            latitude: parseFloat(match[1]),
                                            longitude: parseFloat(match[2])
                                        };
                                    }
                                }
                            }
                            // Alternative approach: look for coordinate text in kartographer captions
                            for (var _b = 0, coordinateElements_2 = coordinateElements; _b < coordinateElements_2.length; _b++) {
                                var element = coordinateElements_2[_b];
                                var text = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                                if (text) {
                                    // Match patterns like "54°30′N 74°30′W" or "54.5, -74.5"
                                    var dmsMatch = text.match(/(\d+)°(\d+)′([NS])\s*(\d+)°(\d+)′([EW])/);
                                    var decimalMatch = text.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
                                    if (dmsMatch) {
                                        var latDeg = parseInt(dmsMatch[1]);
                                        var latMin = parseInt(dmsMatch[2]);
                                        var latDir = dmsMatch[3];
                                        var lonDeg = parseInt(dmsMatch[4]);
                                        var lonMin = parseInt(dmsMatch[5]);
                                        var lonDir = dmsMatch[6];
                                        var latitude = latDeg + latMin / 60;
                                        if (latDir === 'S')
                                            latitude = -latitude;
                                        var longitude = lonDeg + lonMin / 60;
                                        if (lonDir === 'W')
                                            longitude = -longitude;
                                        return { latitude: latitude, longitude: longitude };
                                    }
                                    else if (decimalMatch) {
                                        return {
                                            latitude: parseFloat(decimalMatch[1]),
                                            longitude: parseFloat(decimalMatch[2])
                                        };
                                    }
                                }
                            }
                            return null;
                        })];
                case 10:
                    coordinates = _a.sent();
                    if (coordinates) {
                        console.log("\u2705 Found coordinates for ".concat(plant.name, ": ").concat(coordinates.latitude, ", ").concat(coordinates.longitude));
                        powerPlants[i].latitude = coordinates.latitude;
                        powerPlants[i].longitude = coordinates.longitude;
                        updatedCount++;
                    }
                    else {
                        console.log("\u26A0\uFE0F  No coordinates found for ".concat(plant.name));
                    }
                    // Be respectful to Wikidata servers - add a delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 11:
                    // Be respectful to Wikidata servers - add a delay
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    console.error("\u274C Error processing ".concat(plant.name, ":"), error_1);
                    return [3 /*break*/, 13];
                case 13:
                    i++;
                    return [3 /*break*/, 7];
                case 14:
                    console.log("\u2705 Updated ".concat(updatedCount, " plants with Wikidata coordinates"));
                    updatedCsvRows = powerPlants.map(function (plant) { return [
                        "\"".concat(plant.name, "\""),
                        plant.operator ? "\"".concat(plant.operator, "\"") : '',
                        "\"".concat(plant.output, "\""),
                        "\"".concat(plant.source, "\""),
                        plant.method ? "\"".concat(plant.method, "\"") : '',
                        plant.wikidataId || '',
                        plant.latitude !== null ? plant.latitude : '',
                        plant.longitude !== null ? plant.longitude : ''
                    ]; });
                    updatedCsvContent = __spreadArray([
                        csvHeaders.join(',')
                    ], updatedCsvRows.map(function (row) { return row.join(','); }), true).join('\n');
                    updatedCsvFilePath = path_1.default.join(__dirname, "../data/canada_power_plants_enhanced_".concat(timestamp, ".csv"));
                    fs_1.default.writeFileSync(updatedCsvFilePath, updatedCsvContent);
                    console.log("\uD83D\uDCBE Enhanced data saved to ".concat(updatedCsvFilePath));
                    // Print summary
                    console.log('\n📋 Summary:');
                    console.log("  Total plants: ".concat(powerPlants.length));
                    console.log("  Plants with Wikidata IDs: ".concat(powerPlants.filter(function (p) { return p.wikidataId; }).length));
                    console.log("  Plants with coordinates: ".concat(powerPlants.filter(function (p) { return p.latitude !== null && p.longitude !== null; }).length));
                    console.log("  Plants without coordinates: ".concat(powerPlants.filter(function (p) { return p.latitude === null || p.longitude === null; }).length));
                    return [3 /*break*/, 18];
                case 15:
                    error_2 = _a.sent();
                    console.error('❌ Scraping failed:', error_2);
                    throw error_2;
                case 16: return [4 /*yield*/, browser.close()];
                case 17:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
// Run the scraper
if (require.main === module) {
    scrapeOpenInfraMapAndWikidata().catch(console.error);
}
