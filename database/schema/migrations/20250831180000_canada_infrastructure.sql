-- +goose Up
-- +goose StatementBegin

-- Migration: Add Canada Infrastructure Tables
-- Date: 2025-08-31
-- Description: Creates tables for Canada power plants, fiber infrastructure, and gas infrastructure

-- Create Canada Power Plants table
CREATE TABLE IF NOT EXISTS canada_power_plants (
    id SERIAL PRIMARY KEY,
    openinframap_id VARCHAR(255) UNIQUE,
    name TEXT NOT NULL,
    operator VARCHAR(255),
    output_mw DECIMAL(10,2),
    fuel_type VARCHAR(255),
    province VARCHAR(255),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for Canada power plants
CREATE INDEX IF NOT EXISTS idx_canada_power_plants_province ON canada_power_plants(province);
CREATE INDEX IF NOT EXISTS idx_canada_power_plants_fuel_type ON canada_power_plants(fuel_type);
CREATE INDEX IF NOT EXISTS idx_canada_power_plants_location ON canada_power_plants USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX IF NOT EXISTS idx_canada_power_plants_created_at ON canada_power_plants(created_at);

-- Create Fiber Infrastructure table
CREATE TABLE IF NOT EXISTS fiber_infrastructure (
    id SERIAL PRIMARY KEY,
    itu_id VARCHAR(255) UNIQUE,
    name TEXT NOT NULL,
    cable_type VARCHAR(255),
    capacity_gbps INTEGER,
    operator VARCHAR(255),
    status VARCHAR(255),
    geometry TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fiber infrastructure
CREATE INDEX IF NOT EXISTS idx_fiber_infrastructure_cable_type ON fiber_infrastructure(cable_type);
CREATE INDEX IF NOT EXISTS idx_fiber_infrastructure_status ON fiber_infrastructure(status);
CREATE INDEX IF NOT EXISTS idx_fiber_infrastructure_operator ON fiber_infrastructure(operator);
CREATE INDEX IF NOT EXISTS idx_fiber_infrastructure_created_at ON fiber_infrastructure(created_at);

-- Create Gas Infrastructure table
CREATE TABLE IF NOT EXISTS gas_infrastructure (
    id SERIAL PRIMARY KEY,
    cer_id VARCHAR(255) UNIQUE,
    name TEXT NOT NULL,
    pipeline_type VARCHAR(255),
    capacity_mmcfd INTEGER,
    operator VARCHAR(255),
    status VARCHAR(255),
    geometry TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for gas infrastructure
CREATE INDEX IF NOT EXISTS idx_gas_infrastructure_pipeline_type ON gas_infrastructure(pipeline_type);
CREATE INDEX IF NOT EXISTS idx_gas_infrastructure_status ON gas_infrastructure(status);
CREATE INDEX IF NOT EXISTS idx_gas_infrastructure_operator ON gas_infrastructure(operator);
CREATE INDEX IF NOT EXISTS idx_gas_infrastructure_created_at ON gas_infrastructure(created_at);

-- Create Canada Provinces reference table
CREATE TABLE IF NOT EXISTS canada_provinces (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    population INTEGER,
    area_km2 DECIMAL(12,2),
    capital TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert Canada provinces data
INSERT INTO canada_provinces (code, name, full_name, population, area_km2, capital) VALUES
('ON', 'Ontario', 'Province of Ontario', 14711827, 1076395.00, 'Toronto'),
('QC', 'Quebec', 'Province of Quebec', 8501833, 1542056.00, 'Quebec City'),
('BC', 'British Columbia', 'Province of British Columbia', 5071338, 944735.00, 'Victoria'),
('AB', 'Alberta', 'Province of Alberta', 4371406, 661848.00, 'Edmonton'),
('SK', 'Saskatchewan', 'Province of Saskatchewan', 1171641, 651036.00, 'Regina'),
('MB', 'Manitoba', 'Province of Manitoba', 1377517, 647797.00, 'Winnipeg'),
('NS', 'Nova Scotia', 'Province of Nova Scotia', 969383, 55284.00, 'Halifax'),
('NB', 'New Brunswick', 'Province of New Brunswick', 775610, 72908.00, 'Fredericton'),
('NL', 'Newfoundland and Labrador', 'Province of Newfoundland and Labrador', 510550, 405212.00, 'St. John''s'),
('PE', 'Prince Edward Island', 'Province of Prince Edward Island', 154331, 5660.00, 'Charlottetown'),
('NT', 'Northwest Territories', 'Northwest Territories', 41070, 1346106.00, 'Yellowknife'),
('NU', 'Nunavut', 'Territory of Nunavut', 36858, 2093190.00, 'Iqaluit'),
('YT', 'Yukon', 'Territory of Yukon', 40232, 482443.00, 'Whitehorse')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for provinces
CREATE INDEX IF NOT EXISTS idx_canada_provinces_code ON canada_provinces(code);
CREATE INDEX IF NOT EXISTS idx_canada_provinces_name ON canada_provinces(name);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- Drop tables in reverse order
DROP TABLE IF EXISTS canada_provinces;
DROP TABLE IF EXISTS gas_infrastructure;
DROP TABLE IF EXISTS fiber_infrastructure;
DROP TABLE IF EXISTS canada_power_plants;

-- +goose StatementEnd
