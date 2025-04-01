# Helios Data Analysis
Database/dashboards/interactive apps for Helios data collection and analysis.

Contains data scrapping and processing for things like fiber optic maps, energy pricing, and GPU pricing.



# Data Analysis Containers
To run the complete data analysis stack run `docker compose up --build` which will start the container which runs the scripts, TimeScaleDB (Postgres) with the PostGIS extension, and Grafana for visualizations/analysis.

Then run `task goose-up` in a seperate terminal to init/update the database. 



# Scripts

## KMZ Upload
/scripts/kmz_upload.py

Reads a list of KMZ files from /kmz_files.json into the PostGIS DB. The KMZ files will be in /data/kmz or provided by URL which will be pulled by the script.

It's intended to be ran by a CRON tab in /container/cron/kmz

## EIA Collection
/scripts/eia_collection.py

Reads data from the EIA (U.S. Energy Information Administration) APIs found at [https://www.eia.gov/opendata/](https://www.eia.gov/opendata/) with an OpenAPI spec provided here [https://www.eia.gov/opendata/eia-api-swagger.zip](https://www.eia.gov/opendata/eia-api-swagger.zip).

You can request an API at one of the pages listed above, or contact Tucker for his.

# Scraping
NodeJS REPL, Puppeteer, web scraping for to the data analysis repo. It uses Google Chrome automation to scrape data into the TimeScaleDB or JSON files for analaysis.

Haven't determined if this script will manage it's own scheduling or be ran by CRON.

## GPU Pricing
Scrapes various cloud platforms to obtain real-time pricing info.



# Container



# Database



# Misc things

curl -fsSL https://raw.githubusercontent.com/pressly/goose/master/install.sh | sudo sh



# Remote Server (prod)
ssh -L 6555:localhost:6432 ubuntu@51.222.46.142


# Testing Prod Docker
How to kill when testing, DO NOT USE IN PROD! VERIFY WHERE YOU ARE USING THIS!
```
bash prod_docker_stop.bash; docker container rm prod_da_grafana; docker container rm prod_da_timescaledb; docker container rm prod_da_app; docker container rm prod_da_n8n;
```