#!/bin/bash
set -e

# Initialize PostgreSQL data directory if it doesn't exist
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    mkdir -p "$PGDATA"
    chown -R postgres:postgres "$PGDATA"
    su postgres -c "initdb -D $PGDATA"
fi

# Start PostgreSQL
service postgresql start

# Create user and database
su postgres -c "psql -c \"CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD' SUPERUSER;\""
su postgres -c "psql -c \"CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;\""

# Enable extensions
su postgres -c "psql -d $POSTGRES_DB -c 'CREATE EXTENSION IF NOT EXISTS timescaledb;'"
su postgres -c "psql -d $POSTGRES_DB -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
su postgres -c "psql -d $POSTGRES_DB -c 'CREATE EXTENSION IF NOT EXISTS vector;'"

# Keep container running
tail -f /var/log/postgresql/postgresql.log