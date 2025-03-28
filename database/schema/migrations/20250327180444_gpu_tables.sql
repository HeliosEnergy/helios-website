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
	name VARCHAR(255) NOT NULL,
	gpu_id INT NOT NULL REFERENCES gpu(id),
	memory INT NOT NULL,
	cpu_name VARCHAR(255),
	cpu_cores INT,
	cpu_speed_ghz FLOAT,
	net_up INT,
	net_down INT
);
CREATE INDEX gpu_vast_system_name_idx ON gpu_vast_system (name);
CREATE INDEX gpu_vast_system_created_at_idx ON gpu_vast_system (created_at);
CREATE INDEX gpu_vast_system_gpu_id_idx ON gpu_vast_system (gpu_id);


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE gpu_vast_system;
DROP TABLE gpu_cloud_pricing;
DROP TABLE gpu_cloud_system;
DROP TABLE gpu_cloud;
DROP TABLE gpu_llm_benchmark;
DROP TABLE gpu;
DROP TYPE gpu_manufacturer;
DROP TYPE gpu_pricing_models;
-- +goose StatementEnd
