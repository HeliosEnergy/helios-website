-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TYPE gpu_manufacturer AS ENUM (
	'nvidia',
	'amd',
	'intel',
	'apple',
	'qualcomm',
	'samsung',
	'google',
	'amazon',
	'huawei',
	'graphcore',
	'groq',
	'etched',
	'other'
);
CREATE TABLE IF NOT EXISTS gpu (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	name VARCHAR(255) NOT NULL,
	manufacturer gpu_manufacturer NOT NULL,
	vram INT,
	int8_flops INT,
	fp16_flops INT,
	fp32_flops INT,
	fp64_flops INT,
	tdp INT,
	aliases VARCHAR(255)[] NOT NULL DEFAULT '{}',
	UNIQUE(name)
);
CREATE INDEX gpu_name_idx ON gpu (name);
CREATE INDEX gpu_created_at_idx ON gpu (created_at);
CREATE INDEX gpu_aliases_idx ON gpu USING GIN (aliases);


CREATE TABLE IF NOT EXISTS gpu_llm_benchmark (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	gpu_id INT NOT NULL REFERENCES gpu(id),
	model VARCHAR(255) NOT NULL,
	requests INT NOT NULL,
	tokens_total INT NOT NULL,
	tokens_average_req_tps INT NOT NULL,
	runtime_ms FLOAT NOT NULL
);
CREATE INDEX gpu_llm_benchmark_gpu_id_idx ON gpu_llm_benchmark (gpu_id);
CREATE INDEX gpu_llm_benchmark_created_at_idx ON gpu_llm_benchmark (created_at);



CREATE TABLE IF NOT EXISTS gpu_cloud (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	UNIQUE(name)
);
CREATE INDEX gpu_cloud_name_idx ON gpu_cloud (name);



CREATE TABLE IF NOT EXISTS gpu_cloud_system (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	gpu_cloud_id INT NOT NULL REFERENCES gpu_cloud(id),
	name VARCHAR(255) NOT NULL,
	gpu_id INT NOT NULL REFERENCES gpu(id),
	memory INT,
	cpu_name VARCHAR(255),
	cpu_cores INT,
	cpu_speed_ghz FLOAT,
	net_up INT,
	net_down INT,
	cloud_unique_name VARCHAR(255) NOT NULL,
	UNIQUE(gpu_cloud_id, cloud_unique_name)
);
CREATE INDEX gpu_cloud_system_gpu_cloud_id_idx ON gpu_cloud_system (gpu_cloud_id);
CREATE INDEX gpu_cloud_system_created_at_idx ON gpu_cloud_system (created_at);



CREATE TYPE gpu_pricing_models AS ENUM ('ondemand', 'spot', 'weekly', 'monthly', 'yearly', 'two_yearly', 'three_yearly');
CREATE TABLE IF NOT EXISTS gpu_cloud_pricing (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	gpu_id INT NOT NULL REFERENCES gpu(id),
	gpu_cloud_id INT NOT NULL REFERENCES gpu_cloud(id),
	gpu_cloud_system_id INT REFERENCES gpu_cloud_system(id),
	price_per_hour FLOAT NOT NULL,
	pricing_model gpu_pricing_models NOT NULL,
	category VARCHAR(255),
	region VARCHAR(255)
);
CREATE INDEX gpu_cloud_pricing_gpu_id_idx ON gpu_cloud_pricing (gpu_id);
CREATE INDEX gpu_cloud_pricing_gpu_cloud_id_idx ON gpu_cloud_pricing (gpu_cloud_id);
CREATE INDEX gpu_cloud_pricing_gpu_cloud_system_id_idx ON gpu_cloud_pricing (gpu_cloud_system_id);
CREATE INDEX gpu_cloud_pricing_created_at_idx ON gpu_cloud_pricing (created_at);
CREATE INDEX gpu_cloud_pricing_region_idx ON gpu_cloud_pricing (region);
CREATE INDEX gpu_cloud_pricing_pricing_model_idx ON gpu_cloud_pricing (pricing_model);
CREATE INDEX gpu_cloud_pricing_price_per_hour_idx ON gpu_cloud_pricing (price_per_hour);
CREATE INDEX gpu_cloud_pricing_category_idx ON gpu_cloud_pricing (category);



CREATE TABLE IF NOT EXISTS gpu_vast_system (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	vast_system_id INT NOT NULL,
	name VARCHAR(255),
	gpu_id INT NOT NULL REFERENCES gpu(id),
	memory INT,
	cpu_name VARCHAR(255),
	cpu_cores INT,
	cpu_speed_ghz FLOAT,
	cuda_version VARCHAR(255),
	driver_version VARCHAR(255),
	geolocation VARCHAR(255),
	geolocode VARCHAR(255),
	pci_gen FLOAT,
	vms_enabled BOOLEAN,
	mobo_name VARCHAR(255),
	UNIQUE(vast_system_id)
);
CREATE INDEX gpu_vast_system_name_idx ON gpu_vast_system (name);
CREATE INDEX gpu_vast_system_created_at_idx ON gpu_vast_system (created_at);
CREATE INDEX gpu_vast_system_gpu_id_idx ON gpu_vast_system (gpu_id);
CREATE INDEX gpu_vast_system_vast_system_id_idx ON gpu_vast_system (vast_system_id);
CREATE INDEX gpu_vast_system_geolocation_idx ON gpu_vast_system (geolocation);
CREATE INDEX gpu_vast_system_mobo_name_idx ON gpu_vast_system (mobo_name);
CREATE INDEX gpu_vast_system_cuda_version_idx ON gpu_vast_system (cuda_version);
CREATE INDEX gpu_vast_system_driver_version_idx ON gpu_vast_system (driver_version);
CREATE INDEX gpu_vast_system_vms_enabled_idx ON gpu_vast_system (vms_enabled);
CREATE INDEX gpu_vast_system_pci_gen_idx ON gpu_vast_system (pci_gen);



CREATE TABLE IF NOT EXISTS gpu_vast_offer (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	offer_id INT NOT NULL,
	offer_url VARCHAR(255),
	offer_url_id VARCHAR(255),
	UNIQUE(offer_id)
);
CREATE INDEX gpu_vast_offer_offer_id_idx ON gpu_vast_offer (offer_id);
CREATE INDEX gpu_vast_offer_created_at_idx ON gpu_vast_offer (created_at);



CREATE TABLE IF NOT EXISTS gpu_vast_system_update (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	gpu_vast_system_id INT NOT NULL REFERENCES gpu_vast_system(id),
	latest_offer_id INT NOT NULL REFERENCES gpu_vast_offer(id),
	reliability FLOAT,
	score FLOAT,
	disk_space FLOAT,
	inet_up FLOAT,
	inet_up_cost FLOAT,
	inet_down FLOAT,
	inet_down_cost FLOAT,
	is_bid BOOLEAN,
	min_bid FLOAT,
	ip_address VARCHAR(255),
	storage_cost FLOAT,
	storage_total_cost FLOAT,
	total_flops FLOAT,
	cost_per_hour FLOAT,
	disk_per_hour FLOAT,
	time_remaining VARCHAR(255),
	time_remaining_isbid VARCHAR(255),
	UNIQUE(gpu_vast_system_id, latest_offer_id)
);
CREATE INDEX gpu_vast_system_update_gpu_vast_system_id_idx ON gpu_vast_system_update (gpu_vast_system_id);
CREATE INDEX gpu_vast_system_update_latest_offer_id_idx ON gpu_vast_system_update (latest_offer_id);
CREATE INDEX gpu_vast_system_update_created_at_idx ON gpu_vast_system_update (created_at);
CREATE INDEX gpu_vast_system_update_time_remaining_idx ON gpu_vast_system_update (time_remaining);
CREATE INDEX gpu_vast_system_update_time_remaining_isbid_idx ON gpu_vast_system_update (time_remaining_isbid);
CREATE INDEX gpu_vast_system_update_cost_per_hour_idx ON gpu_vast_system_update (cost_per_hour);
CREATE INDEX gpu_vast_system_update_disk_per_hour_idx ON gpu_vast_system_update (disk_per_hour);
CREATE INDEX gpu_vast_system_update_storage_cost_idx ON gpu_vast_system_update (storage_cost);
CREATE INDEX gpu_vast_system_update_storage_total_cost_idx ON gpu_vast_system_update (storage_total_cost);
CREATE INDEX gpu_vast_system_update_total_flops_idx ON gpu_vast_system_update (total_flops);
CREATE INDEX gpu_vast_system_update_reliability_idx ON gpu_vast_system_update (reliability);
CREATE INDEX gpu_vast_system_update_score_idx ON gpu_vast_system_update (score);
CREATE INDEX gpu_vast_system_update_disk_space_idx ON gpu_vast_system_update (disk_space);
CREATE INDEX gpu_vast_system_update_inet_up_idx ON gpu_vast_system_update (inet_up);
CREATE INDEX gpu_vast_system_update_inet_down_idx ON gpu_vast_system_update (inet_down);
CREATE INDEX gpu_vast_system_update_is_bid_idx ON gpu_vast_system_update (is_bid);
CREATE INDEX gpu_vast_system_update_min_bid_idx ON gpu_vast_system_update (min_bid);










-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

-- First drop tables that depend on gpu
DROP TABLE IF EXISTS gpu_cloud_pricing;
DROP TABLE IF EXISTS gpu_cloud_system;
DROP TABLE IF EXISTS gpu_llm_benchmark;
DROP TABLE IF EXISTS gpu_vast_system_update;
DROP TABLE IF EXISTS gpu_vast_offer;
DROP TABLE IF EXISTS gpu_vast_system;

-- Then drop the base tables
DROP TABLE IF EXISTS gpu_cloud;
DROP TABLE IF EXISTS gpu;

-- Finally drop the types
DROP TYPE IF EXISTS gpu_manufacturer;
DROP TYPE IF EXISTS gpu_pricing_models;
-- +goose StatementEnd
