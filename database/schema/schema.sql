
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS kmz_features (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(255),
    name VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    geometry GEOGRAPHY(GEOMETRYCOLLECTION, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS kmz_features_geom_gist_idx 
ON kmz_features USING GIST (geometry);

CREATE INDEX IF NOT EXISTS kmz_features_geom_brin_idx 
ON kmz_features USING BRIN (geometry);

CREATE INDEX IF NOT EXISTS kmz_features_source_idx
ON kmz_features (source_id);

ALTER TABLE kmz_features ALTER COLUMN geometry SET STATISTICS 1000;