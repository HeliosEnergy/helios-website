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



CREATE TABLE IF NOT EXISTS eia_bulk_electricity_data (
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
CREATE INDEX eia_bulk_electricity_data_series_id_idx ON eia_bulk_electricity_data (series_id);
CREATE INDEX eia_bulk_electricity_data_location_idx ON eia_bulk_electricity_data USING GIST (location);



CREATE TABLE IF NOT EXISTS eia_entities (
    id SERIAL PRIMARY KEY,
    api_entity_id VARCHAR(255) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_entities_api_entity_id_idx ON eia_entities USING HASH (api_entity_id);
CREATE INDEX eia_entities_created_at_idx ON eia_entities (created_at);



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
CREATE INDEX eia_power_plants_api_plant_id_idx ON eia_power_plants USING HASH (api_plant_id);
CREATE INDEX eia_power_plants_entity_id_idx ON eia_power_plants USING HASH (entity_id);
CREATE INDEX eia_power_plants_location_idx ON eia_power_plants USING GIST (location);
CREATE INDEX eia_power_plants_created_at_idx ON eia_power_plants (created_at);
CREATE INDEX eia_power_plants_updated_at_idx ON eia_power_plants (updated_at);
CREATE INDEX eia_power_plants_state_idx ON eia_power_plants USING HASH (state);
CREATE INDEX eia_power_plants_fuel_type_idx ON eia_power_plants USING HASH (fuel_type);
CREATE INDEX eia_power_plants_operating_status_idx ON eia_power_plants USING HASH (operating_status);



CREATE TABLE IF NOT EXISTS eia_generators (
    id SERIAL PRIMARY KEY,
    compound_id VARCHAR(255) NOT NULL UNIQUE, -- "PLANTID_GENERATORID" format
    plant_id INTEGER REFERENCES eia_power_plants(id),
    generator_code VARCHAR(255) NOT NULL,
    name TEXT,
    technology_description TEXT,
    energy_source_code VARCHAR(255),
    energy_source_description TEXT,
    prime_mover_code VARCHAR(255),
    prime_mover_description TEXT,
    operating_status VARCHAR(255),
    nameplate_capacity_mw FLOAT,
    net_summer_capacity_mw FLOAT,
    net_winter_capacity_mw FLOAT,
    operating_year_month DATE,
    planned_derate_summer_cap_mw FLOAT,
    planned_derate_year_month DATE,
    planned_uprate_summer_cap_mw FLOAT,
    planned_uprate_year_month DATE,
    planned_retirement_year_month DATE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_generators_plant_id_idx ON eia_generators (plant_id);
CREATE INDEX eia_generators_compound_id_idx ON eia_generators USING HASH (compound_id);
CREATE INDEX eia_generators_energy_source_code_idx ON eia_generators USING HASH (energy_source_code);
CREATE INDEX eia_generators_prime_mover_code_idx ON eia_generators USING HASH (prime_mover_code);



CREATE TABLE IF NOT EXISTS eia_plant_capacity (
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
CREATE INDEX eia_plant_capacity_plant_id_timestamp_idx ON eia_plant_capacity (plant_id, timestamp);
CREATE INDEX eia_plant_capacity_created_at_idx ON eia_plant_capacity (created_at);
CREATE INDEX eia_plant_capacity_timestamp_idx ON eia_plant_capacity (timestamp);
CREATE INDEX eia_plant_capacity_nameplate_capacity_mw_idx ON eia_plant_capacity (nameplate_capacity_mw);
CREATE INDEX eia_plant_capacity_net_summer_capacity_mw_idx ON eia_plant_capacity (net_summer_capacity_mw);
CREATE INDEX eia_plant_capacity_net_winter_capacity_mw_idx ON eia_plant_capacity (net_winter_capacity_mw);
CREATE INDEX eia_plant_capacity_planned_derate_summer_cap_mw_idx ON eia_plant_capacity (planned_derate_summer_cap_mw);
CREATE INDEX eia_plant_capacity_planned_uprate_summer_cap_mw_idx ON eia_plant_capacity (planned_uprate_summer_cap_mw);
CREATE INDEX eia_plant_capacity_planned_derate_year_month_idx ON eia_plant_capacity (planned_derate_year_month);
CREATE INDEX eia_plant_capacity_planned_uprate_year_month_idx ON eia_plant_capacity (planned_uprate_year_month);



CREATE TABLE IF NOT EXISTS eia_plant_generation (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES eia_power_plants(id),
    generator_id INTEGER REFERENCES eia_generators(id),
    timestamp TIMESTAMPTZ NOT NULL,
    period VARCHAR(255),
    generation FLOAT,
    generation_units VARCHAR(255),
    gross_generation FLOAT,
    gross_generation_units VARCHAR(255),
    consumption_for_eg FLOAT,
    consumption_for_eg_units VARCHAR(255),
    consumption_for_eg_btu FLOAT,
    consumption_for_eg_btu_units VARCHAR(255),
    total_consumption FLOAT,
    total_consumption_units VARCHAR(255),
    total_consumption_btu FLOAT,
    total_consumption_btu_units VARCHAR(255),
    average_heat_content FLOAT,
    average_heat_content_units VARCHAR(255),
    source_timestamp TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX eia_plant_generation_plant_id_timestamp_idx ON eia_plant_generation (plant_id, timestamp);
CREATE INDEX eia_plant_generation_created_at_idx ON eia_plant_generation (created_at);
CREATE INDEX eia_plant_generation_timestamp_idx ON eia_plant_generation (timestamp);
CREATE INDEX eia_plant_generation_period_idx ON eia_plant_generation (period);
CREATE INDEX eia_plant_generation_generation_idx ON eia_plant_generation (generation);



-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS eia_plant_generation;
DROP TABLE IF EXISTS eia_plant_capacity;
DROP TABLE IF EXISTS eia_generators;
DROP TABLE IF EXISTS eia_power_plants;
DROP TABLE IF EXISTS eia_entities;
DROP TABLE IF EXISTS eia_bulk_electricity_data;
DROP TABLE IF EXISTS kmz_features;
DROP TABLE IF EXISTS metrics;
-- +goose StatementEnd
