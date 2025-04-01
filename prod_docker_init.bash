#!/bin/bash

current_dir=$(pwd)

# load .env file
source .env

docker volume create timescaledb_data
docker volume create app_home
docker volume create grafana_data
docker volume create grafana_logs
docker volume create n8n_data