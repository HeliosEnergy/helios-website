#!/bin/bash

current_dir=$(pwd)

# load .env file
source .env
source .env.prod

cd $current_dir/database
docker build -t prod_da_timescaledb .

cd $current_dir
docker build -t prod_da_app .




docker run \
	--name prod_da_timescaledb \
	-e POSTGRES_USER=${DB_USER} \
	-e POSTGRES_PASSWORD=${DB_PASSWORD} \
	-e POSTGRES_DB=${DB_NAME} \
	-e PGDATA=/var/lib/postgresql/17/main \
	-p 16432:5432 \
	-v timescaledb_data:/var/lib/postgresql/17 \
	-d \
	prod_da_timescaledb

echo "Waiting for timescaledb to be ready..."
sleep 10
echo "Running migrations..."
task goose-up
echo "Seeding database..."
task seed


docker run \
	--name prod_da_app \
	-e DATABASE_URL=postgresql://postgres:postgres@localhost:6432/postgres \
	-p 16080:3000 \
	-v app_home:/data \
	-v .:/workspace \
	-d \
	prod_da_app 

docker run \
	--name prod_da_grafana \
	-e GF_SECURITY_ADMIN_USER=admin \
	-e GF_SECURITY_ADMIN_PASSWORD=admin123 \
	-e GF_USERS_ALLOW_SIGN_UP=false \
	-e GF_SERVER_HTTP_PORT=3000 \
	-e GF_SERVER_PROTOCOL=http \
	-e GF_SERVER_DOMAIN=localhost \
	-e GF_SERVER_ROOT_URL=http://localhost:3000 \
	-p 16000:3000 \
	-v grafana_data:/var/lib/grafana/data \
	-v grafana_logs:/var/lib/grafana/logs \
	-d \
	grafana/grafana:latest



docker run \
	--name prod_da_n8n \
	-e DB_TYPE=postgresdb \
	-e DB_POSTGRESDB_DATABASE=${N8N_DB_NAME} \
	-e DB_POSTGRESDB_HOST=localhost \
	-e DB_POSTGRESDB_PORT=16432 \
	-e DB_POSTGRESDB_USER=postgres \
	-e DB_POSTGRESDB_SCHEMA=n8n \
	-e DB_POSTGRESDB_PASSWORD=postgres \
	-p 16578:5678 \
	-v n8n_data:/home/node/.n8n \
	-d \
	docker.n8n.io/n8nio/n8n:latest


