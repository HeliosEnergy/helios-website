#!/bin/bash
set -e

# Explicitly set the PATH at the beginning of the script
export PATH="/usr/lib/postgresql/17/bin:$PATH"

ls -la /usr/lib/postgresql/17/bin/


echo "PGDATA: $PGDATA"
if [ ! -d "$PGDATA" ]; then
    echo "PGDATA directory does not exist, creating it"
    mkdir -p "$PGDATA"
fi
chown -R postgres:postgres "$PGDATA"
ls -la $PGDATA

# Initialize PostgreSQL data directory if it doesn't exist
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    mkdir -p "$PGDATA"
    chown -R postgres:postgres "$PGDATA"
    echo "Initializing PostgreSQL data directory..."
    cd /usr/lib/postgresql/17/bin/ && su postgres -c "./initdb -D $PGDATA"
else
    echo "PostgreSQL data directory already initialized"
fi

# Start PostgreSQL
service postgresql start

# Check if user exists before creating
su postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='$POSTGRES_USER'\"" | grep -q 1 || \
    su postgres -c "psql -c \"CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD' SUPERUSER;\""

# Check if database exists before creating
su postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='$POSTGRES_DB'\"" | grep -q 1 || \
    su postgres -c "psql -c \"CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;\""

# Enable extensions (using IF NOT EXISTS so these are safe to run repeatedly)
su postgres -c "psql -d $POSTGRES_DB -c 'CREATE EXTENSION IF NOT EXISTS timescaledb;'"
su postgres -c "psql -d $POSTGRES_DB -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
su postgres -c "psql -d $POSTGRES_DB -c 'CREATE EXTENSION IF NOT EXISTS vector;'"

# Keep container running - using more reliable method
while true; do
    sleep 60 & wait $!
    tail -f /var/log/postgresql/postgresql-17-main.log
done