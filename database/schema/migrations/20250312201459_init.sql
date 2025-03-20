-- +goose Up
-- +goose StatementBegin
-- Enable PostGIS extension

CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kmz_features (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(255) NOT NULL,
    name TEXT,
    description TEXT,
    metadata JSONB,
    geometry GEOGRAPHY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX kmz_features_geometry_idx ON kmz_features USING GIST (geometry);
CREATE INDEX kmz_features_source_id_idx ON kmz_features (source_id);

CREATE TABLE IF NOT EXISTS eia_electricity_data (
    id SERIAL PRIMARY KEY,
    series_id VARCHAR(255) NOT NULL,
    name TEXT NOT NULL,
    units VARCHAR(255) NOT NULL,
    frequency CHAR(1),
    copyright TEXT,
    source TEXT,
    iso3166 VARCHAR(10),
    location GEOGRAPHY(POINT),
    geography VARCHAR(255),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    last_updated TIMESTAMPTZ,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_electricity_data_series_id_idx ON eia_electricity_data (series_id);
CREATE INDEX eia_electricity_data_location_idx ON eia_electricity_data USING GIST (location);

-- New tables for EIA API data structure
CREATE TABLE IF NOT EXISTS eia_entities (
    id SERIAL PRIMARY KEY,
    api_entity_id VARCHAR(255) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_entities_api_entity_id_idx ON eia_entities (api_entity_id);

CREATE TABLE IF NOT EXISTS eia_power_plants (
    id SERIAL PRIMARY KEY,
    api_plant_id VARCHAR(255) NOT NULL UNIQUE,
    entity_id INTEGER REFERENCES eia_entities(id),
    name TEXT NOT NULL,
    county TEXT,
    state TEXT,
    location GEOGRAPHY(POINT),
    plant_code VARCHAR(255),
    fuel_type VARCHAR(255),
    prime_mover VARCHAR(255),
    operating_status VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_power_plants_api_plant_id_idx ON eia_power_plants (api_plant_id);
CREATE INDEX eia_power_plants_entity_id_idx ON eia_power_plants (entity_id);
CREATE INDEX eia_power_plants_location_idx ON eia_power_plants USING GIST (location);

CREATE TABLE IF NOT EXISTS eia_plant_stats (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES eia_power_plants(id),
    timestamp TIMESTAMPTZ NOT NULL,
    nameplate_capacity_mw FLOAT,
    net_summer_capacity_mw FLOAT,
    net_winter_capacity_mw FLOAT,
    planned_derate_summer_cap_mw FLOAT,
    planned_uprate_summer_cap_mw FLOAT,
    operating_year_month DATE,
    planned_derate_year_month DATE,
    planned_uprate_year_month DATE,
    planned_retirement_year_month DATE,
    source_timestamp TIMESTAMPTZ,
    data_period VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_plant_stats_plant_id_timestamp_idx ON eia_plant_stats (plant_id, timestamp);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS eia_plant_stats;
DROP TABLE IF EXISTS eia_power_plants;
DROP TABLE IF EXISTS eia_entities;
DROP TABLE IF EXISTS eia_electricity_data;
DROP TABLE IF EXISTS kmz_features;
DROP TABLE IF EXISTS metrics;
-- +goose StatementEnd
