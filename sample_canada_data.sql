-- Sample Canada Power Plants Data (from OpenInfraMap)
INSERT INTO canada_power_plants (openinframap_id, name, operator, output_mw, fuel_type, province, latitude, longitude, metadata) VALUES 
('bruce-nuclear', 'Bruce Nuclear Generating Station', 'Bruce Power', 6232, 'nuclear', 'Ontario', 44.3225, -81.6017, '{"method": "fission", "wikidata": "Q795104"}'),
('robert-bourassa', 'Centrale Robert-Bourassa', 'Hydro-Québec', 5616, 'hydro', 'Quebec', 53.785, -77.435, '{"method": "water-storage", "wikidata": "Q1456859"}'),
('churchill-falls', 'Churchill Falls Generating Station', 'Newfoundland and Labrador Hydro', 5428, 'hydro', 'Newfoundland and Labrador', 53.565, -64.044, '{"method": "water-storage", "wikidata": "Q1458507"}'),
('darlington-nuclear', 'Darlington Nuclear Generating Station', 'Ontario Power Generation', 3512, 'nuclear', 'Ontario', 43.8728, -78.7173, '{"method": "fission", "wikidata": "Q1739391"}'),
('gordon-shrum', 'Gordon M. Shrum Generating Station', 'BC Hydro', 2880, 'hydro', 'British Columbia', 56.0167, -122.6833, '{"method": "water-storage", "wikidata": "Q1758688"}'),
('mica', 'Mica', 'BC Hydro', 2805, 'hydro', 'British Columbia', 52.0667, -118.5667, '{"method": "water-storage"}'),
('la-grande-4', 'Centrale La Grande-4', NULL, 2779, 'hydro', 'Quebec', 53.736, -73.657, '{"wikidata": "Q1339475"}'),
('revelstoke', 'Revelstoke Generating Station', 'BC Hydro', 2480, 'hydro', 'British Columbia', 50.9833, -118.2, '{"wikidata": "Q1433635"}'),
('la-grande-3', 'La Grande-3', 'Hydro-Québec', 2418, 'hydro', 'Quebec', 53.8, -76.3, '{"method": "run-of-the-river", "wikidata": "Q1339454"}'),
('la-grande-2a', 'Centrale La Grande-2A', 'Hydro-Québec', 2106, 'hydro', 'Quebec', 53.9, -77.7, '{"method": "water-storage", "wikidata": "Q1337853"}'),
('lennox', 'Lennox Generating Station', 'Ontario Power Generation', 2100, 'gas', 'Ontario', 44.2, -76.8, '{"method": "combustion", "wikidata": "Q6522858"}'),
('pickering-nuclear', 'Pickering Nuclear Generating Station', 'Ontario Power Generation', 2086, 'nuclear', 'Ontario', 43.8106, -79.0681, '{"method": "fission", "wikidata": "Q1739455"}'),
('beauharnois', 'Centrale de Beauharnois', 'Hydro-Québec', 1903, 'hydro', 'Quebec', 45.318, -73.871, '{"method": "run-of-the-river", "wikidata": "Q925113"}'),
('genesee', 'Genesee Generating Station', 'Capital Power', 1857, 'gas', 'Alberta', 53.7, -113.4, '{"method": "combustion", "wikidata": "Q5532732"}'),
('manic-5', 'Centrale Manic-5', 'Hydro-Québec', 1596, 'hydro', 'Quebec', 51.4, -68.7, '{"wikidata": "Q1425918"}'),
('sir-adam-beck-ii', 'Sir Adam Beck II Generating Station', 'Ontario Power Generation', 1499, 'hydro', 'Ontario', 43.08, -79.05, '{"method": "water-storage", "wikidata": "Q7525907"}'),
('la-grande-1', 'Centrale La Grande-1', 'Hydro-Québec', 1436, 'hydro', 'Quebec', 53.73, -73.41, '{"wikidata": "Q1338919"}'),
('limestone', 'Limestone Generating Station', 'Manitoba Hydro', 1340, 'hydro', 'Manitoba', 56.5, -96.0, '{"method": "run-of-the-river", "wikidata": "Q6830590"}'),
('kettle', 'Kettle Generating Station', 'Manitoba Hydro', 1220, 'hydro', 'Manitoba', 56.0, -96.0, '{"method": "run-of-the-river", "wikidata": "Q6395516"}'),
('rene-levesque', 'Centrale René-Lévesque', 'Hydro-Québec', 1183, 'hydro', 'Quebec', 50.6, -63.2, '{"method": "water-storage", "wikidata": "Q1302322"}');

-- Sample Fiber Infrastructure Data
INSERT INTO fiber_infrastructure (itu_id, name, cable_type, capacity_gbps, operator, status, geometry, metadata) VALUES 
('transatlantic-1', 'Transatlantic Cable System', 'submarine', 40000, 'Various Operators', 'operational', '{"type": "LineString", "coordinates": [[-52.5, 47.5], [-30.0, 50.0], [-10.0, 55.0]]}', '{"description": "Major transatlantic submarine cable"}'),
('arctic-connect', 'Arctic Connect', 'terrestrial', 10000, 'Arctic Connect', 'operational', '{"type": "LineString", "coordinates": [[-75.0, 45.0], [-80.0, 50.0], [-85.0, 55.0]]}', '{"description": "Northern fiber optic network"}'),
('pacific-crossing', 'Pacific Crossing Cable', 'submarine', 60000, 'Pacific Crossing Ltd.', 'operational', '{"type": "LineString", "coordinates": [[-125.0, 49.0], [-140.0, 55.0], [-160.0, 60.0]]}', '{"description": "Trans-Pacific submarine cable"}');

-- Sample Gas Infrastructure Data  
INSERT INTO gas_infrastructure (cer_id, name, pipeline_type, capacity_mmcfd, operator, status, geometry, metadata) VALUES 
('transcanada-mainline', 'TransCanada Mainline', 'transmission', 12000, 'TC Energy', 'operational', '{"type": "LineString", "coordinates": [[-110.0, 50.0], [-100.0, 52.0], [-90.0, 50.0], [-80.0, 45.0]]}', '{"description": "Major natural gas transmission pipeline"}'),
('alliance-pipeline', 'Alliance Pipeline', 'transmission', 1325, 'Alliance Pipeline Ltd.', 'operational', '{"type": "LineString", "coordinates": [[-110.0, 55.0], [-105.0, 52.0], [-100.0, 50.0], [-95.0, 49.0]]}', '{"description": "Natural gas pipeline from Western Canada to US"}'),
('maritime-northeast', 'Maritime & Northeast Pipeline', 'transmission', 1000, 'Enbridge', 'operational', '{"type": "LineString", "coordinates": [[-70.0, 45.0], [-68.0, 46.0], [-66.0, 45.5], [-64.0, 46.0]]}', '{"description": "Maritime provinces natural gas pipeline"}');