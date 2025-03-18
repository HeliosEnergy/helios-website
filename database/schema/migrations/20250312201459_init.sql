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
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS kmz_features;
DROP TABLE IF EXISTS metrics;
-- +goose StatementEnd
