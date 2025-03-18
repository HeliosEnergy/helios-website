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

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS eia_electricity_data;
DROP TABLE IF EXISTS kmz_features;
DROP TABLE IF EXISTS metrics;
-- +goose StatementEnd
