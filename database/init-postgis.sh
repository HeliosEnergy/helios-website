#!/bin/bash
set -e

# This script runs during database initialization
echo "Initializing PostGIS extension..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS postgis_raster;
    CREATE EXTENSION IF NOT EXISTS vector;
    
    -- Verify extensions are installed
    SELECT name, default_version FROM pg_available_extensions WHERE name LIKE '%postgis%' OR name = 'vector';
EOSQL

echo "PostGIS extensions installed successfully!"