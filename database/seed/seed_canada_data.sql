-- Seed data for Canada infrastructure tables
-- This provides sample data for testing the Canada map functionality

-- Insert sample Canadian power plants
INSERT INTO canada_power_plants (openinframap_id, name, operator, output_mw, fuel_type, province, location, metadata) VALUES
('CP001', 'Bruce Nuclear Generating Station', 'Bruce Power', 6300, 'nuclear', 'Ontario', ST_SetSRID(ST_MakePoint(-81.3167, 44.3167), 4326), '{"type": "nuclear", "units": 8}'),
('CP002', 'Pickering Nuclear Generating Station', 'Ontario Power Generation', 3100, 'nuclear', 'Ontario', ST_SetSRID(ST_MakePoint(-79.0667, 43.8167), 4326), '{"type": "nuclear", "units": 6}'),
('CP003', 'Darlington Nuclear Generating Station', 'Ontario Power Generation', 3512, 'nuclear', 'Ontario', ST_SetSRID(ST_MakePoint(-78.7167, 43.8667), 4326), '{"type": "nuclear", "units": 4}'),
('CP004', 'Churchill Falls Generating Station', 'Nalcor Energy', 5428, 'hydro', 'Newfoundland and Labrador', ST_SetSRID(ST_MakePoint(-64.0167, 53.5333), 4326), '{"type": "hydro", "dam_height": "32m"}'),
('CP005', 'Robert-Bourassa Generating Station', 'Hydro-Québec', 5616, 'hydro', 'Quebec', ST_SetSRID(ST_MakePoint(-77.1833, 53.7833), 4326), '{"type": "hydro", "dam_height": "162m"}'),
('CP006', 'La Grande-2-A Generating Station', 'Hydro-Québec', 2106, 'hydro', 'Quebec', ST_SetSRID(ST_MakePoint(-77.1167, 53.7833), 4326), '{"type": "hydro", "dam_height": "142m"}'),
('CP007', 'Shepards Flat Wind Farm', 'Capital Power', 300, 'wind', 'Alberta', ST_SetSRID(ST_MakePoint(-113.3167, 50.7167), 4326), '{"type": "wind", "turbines": 100}'),
('CP008', 'Blackspring Ridge Wind Project', 'Capital Power', 300, 'wind', 'Alberta', ST_SetSRID(ST_MakePoint(-113.5167, 50.5167), 4326), '{"type": "wind", "turbines": 166}'),
('CP009', 'Shepard Energy Centre', 'ENMAX', 800, 'natural_gas', 'Alberta', ST_SetSRID(ST_MakePoint(-113.9167, 51.0167), 4326), '{"type": "combined_cycle", "efficiency": "60%"}'),
('CP010', 'Genesee Generating Station', 'Capital Power', 1372, 'coal', 'Alberta', ST_SetSRID(ST_MakePoint(-114.5167, 53.3167), 4326), '{"type": "coal", "units": 3}');

-- Insert sample fiber infrastructure
INSERT INTO fiber_infrastructure (itu_id, name, cable_type, capacity_gbps, operator, status, geometry, metadata) VALUES
('FI001', 'Hibernia Express', 'submarine', 100, 'Hibernia Networks', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-52.7126,47.5614],[-66.1057,18.2208]]}'), '{"length_km": 4600, "landing_points": ["Newfoundland", "Ireland"]}'),
('FI002', 'Gulf Bridge International', 'submarine', 40, 'Gulf Bridge International', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-79.3832,43.6532],[-80.1918,25.7617]]}'), '{"length_km": 1800, "landing_points": ["Toronto", "Miami"]}'),
('FI003', 'TransCanada Fiber', 'terrestrial', 100, 'Bell Canada', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-79.3832,43.6532],[-123.1207,49.2827]]}'), '{"length_km": 3500, "route": "Toronto to Vancouver"}'),
('FI004', 'Eastern Fiber Network', 'terrestrial', 40, 'Rogers Communications', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-79.3832,43.6532],[-63.5752,44.6488]]}'), '{"length_km": 1200, "route": "Toronto to Halifax"}'),
('FI005', 'Northern Fiber Route', 'terrestrial', 100, 'TELUS', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-114.0719,51.0447],[-123.1207,49.2827]]}'), '{"length_km": 800, "route": "Calgary to Vancouver"}');

-- Insert sample gas infrastructure
INSERT INTO gas_infrastructure (cer_id, name, pipeline_type, capacity_mmcfd, operator, status, geometry, metadata) VALUES
('GI001', 'TransCanada Mainline', 'transmission', 5000, 'TC Energy', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-114.0719,51.0447],[-79.3832,43.6532]]}'), '{"length_km": 2800, "diameter": "42 inches"}'),
('GI002', 'Alliance Pipeline', 'transmission', 1600, 'Enbridge', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-114.0719,51.0447],[-96.8085,46.8772]]}'), '{"length_km": 1600, "diameter": "36 inches"}'),
('GI003', 'Enbridge Mainline', 'transmission', 3000, 'Enbridge', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-114.0719,51.0447],[-79.3832,43.6532]]}'), '{"length_km": 2800, "diameter": "36 inches"}'),
('GI004', 'Montreal Distribution Network', 'distribution', 500, 'Gaz Métro', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-73.5673,45.5017],[-73.5491,45.5089]]}'), '{"length_km": 50, "diameter": "12 inches"}'),
('GI005', 'Vancouver Distribution Network', 'distribution', 300, 'FortisBC', 'operational', ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[-123.1207,49.2827],[-123.1162,49.2827]]}'), '{"length_km": 30, "diameter": "8 inches"}');
