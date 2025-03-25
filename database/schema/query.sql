-- name: CreateMetric :one
INSERT INTO metrics (
    name,
    value,
    timestamp
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetMetric :one
SELECT * FROM metrics
WHERE id = $1;

-- name: ListMetrics :many
SELECT * FROM metrics
ORDER BY timestamp DESC;

-- name: GetMetricsByTimeRange :many
SELECT * FROM metrics
WHERE timestamp BETWEEN sqlc.arg(start_timestamp) AND sqlc.arg(end_timestamp)
ORDER BY timestamp DESC;

-- name: UpdateMetric :one
UPDATE metrics
SET name = $2,
    value = $3,
    timestamp = $4
WHERE id = $1
RETURNING *;

-- name: DeleteMetric :exec
DELETE FROM metrics
WHERE id = $1;

-- name: GetMetricsByName :many
SELECT * FROM metrics
WHERE name = $1
ORDER BY timestamp DESC;

-- name: CreateEIAElectricityData :exec
INSERT INTO eia_bulk_electricity_data (
    series_id,
    name,
    units,
    frequency,
    copyright,
    source,
    iso3166,
    location,
    geography,
    start_date,
    end_date,
    last_updated,
    data
) VALUES (
    sqlc.arg(series_id),
    sqlc.arg(name),
    sqlc.arg(units),
    sqlc.arg(frequency),
    sqlc.arg(copyright),
    sqlc.arg(source),
    sqlc.arg(iso3166),
    ST_SetSRID(ST_MakePoint(
        sqlc.arg(longitude)::float8,
        sqlc.arg(latitude)::float8
    ), 4326)::geography,
    sqlc.arg(geography),
    sqlc.arg(start_date),
    sqlc.arg(end_date),
    sqlc.arg(last_updated),
    sqlc.arg(data)
);

-- New queries for EIA entities, plants, and stats

-- name: GetEIAEntityByApiID :one
SELECT * FROM eia_entities
WHERE api_entity_id = sqlc.arg(api_entity_id);

-- name: UpsertEIAEntity :one
INSERT INTO eia_entities (
    api_entity_id,
    name,
    description,
    metadata
) VALUES (
    sqlc.arg(api_entity_id),
    sqlc.arg(name),
    sqlc.arg(description),
    sqlc.arg(metadata)
)
ON CONFLICT (api_entity_id) 
DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP
RETURNING *;

-- name: GetEIAPowerPlantByApiID :one
SELECT * FROM eia_power_plants
WHERE api_plant_id = sqlc.arg(api_plant_id);

-- name: UpsertEIAPowerPlant :one
INSERT INTO eia_power_plants (
    api_plant_id,
    entity_id,
    name,
    county,
    state,
    location,
    plant_code,
    fuel_type,
    prime_mover,
    operating_status,
    metadata
) VALUES (
    sqlc.arg(api_plant_id),
    sqlc.arg(entity_id),
    sqlc.arg(name),
    sqlc.arg(county),
    sqlc.arg(state),
    ST_SetSRID(ST_MakePoint(
        sqlc.arg(longitude)::float8,
        sqlc.arg(latitude)::float8
    ), 4326)::geography,
    sqlc.arg(plant_code),
    sqlc.arg(fuel_type),
    sqlc.arg(prime_mover),
    sqlc.arg(operating_status),
    sqlc.arg(metadata)
)
ON CONFLICT (api_plant_id) 
DO UPDATE SET
    entity_id = EXCLUDED.entity_id,
    name = EXCLUDED.name,
    county = EXCLUDED.county,
    state = EXCLUDED.state,
    location = EXCLUDED.location,
    plant_code = EXCLUDED.plant_code,
    fuel_type = EXCLUDED.fuel_type,
    prime_mover = EXCLUDED.prime_mover,
    operating_status = EXCLUDED.operating_status,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP
RETURNING *;

-- name: CreateEIAPlantStat :one
INSERT INTO eia_plant_capacity (
    plant_id,
    timestamp,
    nameplate_capacity_mw,
    net_summer_capacity_mw,
    net_winter_capacity_mw,
    planned_derate_summer_cap_mw,
    planned_uprate_summer_cap_mw,
    operating_year_month,
    planned_derate_year_month,
    planned_uprate_year_month,
    planned_retirement_year_month,
    source_timestamp,
    data_period,
    metadata
) VALUES (
    sqlc.arg(plant_id),
    COALESCE(sqlc.arg(timestamp), CURRENT_TIMESTAMP),
    sqlc.arg(nameplate_capacity_mw),
    sqlc.arg(net_summer_capacity_mw),
    sqlc.arg(net_winter_capacity_mw),
    sqlc.arg(planned_derate_summer_cap_mw),
    sqlc.arg(planned_uprate_summer_cap_mw),
    sqlc.arg(operating_year_month),
    sqlc.arg(planned_derate_year_month),
    sqlc.arg(planned_uprate_year_month),
    sqlc.arg(planned_retirement_year_month),
    sqlc.arg(source_timestamp),
    sqlc.arg(data_period),
    sqlc.arg(metadata)
)
RETURNING *;

-- name: GetEIAPlantStatsByPlantID :many
SELECT * FROM eia_plant_capacity
WHERE plant_id = sqlc.arg(plant_id)
ORDER BY timestamp DESC;

-- name: GetEIAPlantStatsInTimeRange :many
SELECT * FROM eia_plant_capacity
WHERE plant_id = sqlc.arg(plant_id)
AND timestamp BETWEEN sqlc.arg(start_timestamp) AND sqlc.arg(end_timestamp)
ORDER BY timestamp DESC;

-- name: GetLatestEIAPlantStat :one
SELECT * FROM eia_plant_capacity
WHERE plant_id = sqlc.arg(plant_id)
ORDER BY timestamp DESC
LIMIT 1;

-- name: GetEIAPowerPlantsForEntity :many
SELECT * FROM eia_power_plants
WHERE entity_id = sqlc.arg(entity_id);

-- name: GetAllPowerPlantsWithLatestStats :many
WITH latest_gen AS (
    SELECT DISTINCT ON (plant_id) *
    FROM eia_plant_generation
    ORDER BY plant_id, timestamp DESC
)
SELECT 
    p.id, 
    p.api_plant_id, 
    p.entity_id, 
    p.name, 
    p.county, 
    p.state,
    ST_X(p.location::geometry) AS longitude,
    ST_Y(p.location::geometry) AS latitude,
    p.plant_code,
    p.fuel_type,
    p.prime_mover,
    p.operating_status,
    p.metadata AS plant_metadata,
    p.created_at AS plant_created_at,
    p.updated_at AS plant_updated_at,
    g.nameplate_capacity_mw,
    g.net_summer_capacity_mw,
    g.net_winter_capacity_mw,
    s.id AS stat_id,
    s.planned_derate_summer_cap_mw,
    s.planned_uprate_summer_cap_mw,
    s.operating_year_month,
    s.planned_derate_year_month,
    s.planned_uprate_year_month,
    s.planned_retirement_year_month,
    s.source_timestamp,
    s.data_period,
    s.metadata AS stat_metadata,
    s.timestamp AS stat_timestamp,
    gen.id AS gen_id,
    gen.period AS gen_period,
    gen.generation AS gen_generation,
    gen.generation_units AS gen_generation_units,
    gen.consumption_for_eg AS gen_consumption_for_eg,
    gen.consumption_for_eg_units AS gen_consumption_for_eg_units,
    gen.total_consumption AS gen_total_consumption,
    gen.total_consumption_units AS gen_total_consumption_units,
    gen.metadata AS gen_metadata,
    gen.timestamp AS gen_timestamp
FROM eia_power_plants as p
LEFT JOIN (
    SELECT 
        plant_id,
        SUM(nameplate_capacity_mw) AS nameplate_capacity_mw,
        SUM(net_summer_capacity_mw) AS net_summer_capacity_mw,
        SUM(net_winter_capacity_mw) AS net_winter_capacity_mw,
        MAX(updated_at) AS latest_update
    FROM eia_generators
    GROUP BY plant_id
) AS g ON g.plant_id = p.id
LEFT JOIN (
    SELECT DISTINCT ON (plant_id) *
    FROM eia_plant_capacity
    ORDER BY plant_id, timestamp DESC
) as s ON s.plant_id = p.id
LEFT JOIN latest_gen AS gen ON gen.plant_id = p.id
WHERE 
    (sqlc.narg(fuel_type)::text IS NULL OR p.fuel_type = sqlc.narg(fuel_type))
    AND (
        sqlc.narg(states)::text[] IS NULL 
        OR sqlc.narg(states)::text[] = '{}'::text[] 
        OR p.state = ANY(sqlc.narg(states)::text[])
    )
    AND (sqlc.narg(operating_status)::text IS NULL OR p.operating_status = sqlc.narg(operating_status))
    AND (
        sqlc.narg(min_capacity)::float IS NULL 
        OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw >= sqlc.narg(min_capacity))
    )
    AND (
        sqlc.narg(max_capacity)::float IS NULL 
        OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw <= sqlc.narg(max_capacity))
    );

-- name: CreateEIAPlantGeneration :one
INSERT INTO eia_plant_generation (
    plant_id,
    generator_id,
    timestamp,
    period,
    generation,
    generation_units,
    gross_generation,
    gross_generation_units,
    consumption_for_eg,
    consumption_for_eg_units,
    consumption_for_eg_btu,
    consumption_for_eg_btu_units,
    total_consumption,
    total_consumption_units,
    total_consumption_btu,
    total_consumption_btu_units,
    average_heat_content,
    average_heat_content_units,
    source_timestamp,
    metadata
) VALUES (
    sqlc.arg(plant_id),
    sqlc.arg(generator_id),
    COALESCE(sqlc.arg(timestamp), CURRENT_TIMESTAMP),
    sqlc.arg(period),
    sqlc.arg(generation),
    sqlc.arg(generation_units),
    sqlc.arg(gross_generation),
    sqlc.arg(gross_generation_units),
    sqlc.arg(consumption_for_eg),
    sqlc.arg(consumption_for_eg_units),
    sqlc.arg(consumption_for_eg_btu),
    sqlc.arg(consumption_for_eg_btu_units),
    sqlc.arg(total_consumption),
    sqlc.arg(total_consumption_units),
    sqlc.arg(total_consumption_btu),
    sqlc.arg(total_consumption_btu_units),
    sqlc.arg(average_heat_content),
    sqlc.arg(average_heat_content_units),
    sqlc.arg(source_timestamp),
    sqlc.arg(metadata)
)
RETURNING *;

-- name: GetEIAPlantGenerationByPlantID :many
SELECT * FROM eia_plant_generation
WHERE plant_id = sqlc.arg(plant_id)
ORDER BY timestamp DESC;

-- name: GetEIAPlantGenerationInTimeRange :many
SELECT * FROM eia_plant_generation
WHERE plant_id = sqlc.arg(plant_id)
AND timestamp BETWEEN sqlc.arg(start_timestamp) AND sqlc.arg(end_timestamp)
ORDER BY timestamp DESC;

-- name: GetLatestEIAPlantGeneration :one
SELECT * FROM eia_plant_generation
WHERE plant_id = sqlc.arg(plant_id)
ORDER BY timestamp DESC
LIMIT 1;

-- name: UpsertEIAGenerator :one
INSERT INTO eia_generators (
    compound_id,
    plant_id,
    generator_code,
    name,
    technology_description,
    energy_source_code,
    energy_source_description,
    prime_mover_code,
    prime_mover_description,
    operating_status,
    nameplate_capacity_mw,
    net_summer_capacity_mw,
    net_winter_capacity_mw,
    operating_year_month,
    planned_derate_summer_cap_mw,
    planned_derate_year_month,
    planned_uprate_summer_cap_mw,
    planned_uprate_year_month,
    planned_retirement_year_month,
    metadata
) VALUES (
    sqlc.arg(compound_id),
    sqlc.arg(plant_id),
    sqlc.arg(generator_code),
    sqlc.arg(name),
    sqlc.arg(technology_description),
    sqlc.arg(energy_source_code),
    sqlc.arg(energy_source_description),
    sqlc.arg(prime_mover_code),
    sqlc.arg(prime_mover_description),
    sqlc.arg(operating_status),
    sqlc.arg(nameplate_capacity_mw),
    sqlc.arg(net_summer_capacity_mw),
    sqlc.arg(net_winter_capacity_mw),
    sqlc.arg(operating_year_month),
    sqlc.arg(planned_derate_summer_cap_mw),
    sqlc.arg(planned_derate_year_month),
    sqlc.arg(planned_uprate_summer_cap_mw),
    sqlc.arg(planned_uprate_year_month),
    sqlc.arg(planned_retirement_year_month),
    sqlc.arg(metadata)
)
ON CONFLICT (compound_id) 
DO UPDATE SET
    plant_id = EXCLUDED.plant_id,
    generator_code = EXCLUDED.generator_code,
    name = EXCLUDED.name,
    technology_description = EXCLUDED.technology_description,
    energy_source_code = EXCLUDED.energy_source_code,
    energy_source_description = EXCLUDED.energy_source_description,
    prime_mover_code = EXCLUDED.prime_mover_code,
    prime_mover_description = EXCLUDED.prime_mover_description,
    operating_status = EXCLUDED.operating_status,
    nameplate_capacity_mw = EXCLUDED.nameplate_capacity_mw,
    net_summer_capacity_mw = EXCLUDED.net_summer_capacity_mw,
    net_winter_capacity_mw = EXCLUDED.net_winter_capacity_mw,
    operating_year_month = EXCLUDED.operating_year_month,
    planned_derate_summer_cap_mw = EXCLUDED.planned_derate_summer_cap_mw,
    planned_derate_year_month = EXCLUDED.planned_derate_year_month,
    planned_uprate_summer_cap_mw = EXCLUDED.planned_uprate_summer_cap_mw,
    planned_uprate_year_month = EXCLUDED.planned_uprate_year_month,
    planned_retirement_year_month = EXCLUDED.planned_retirement_year_month,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP
RETURNING *;

-- name: GetEIAGeneratorsByPlantID :many
SELECT * FROM eia_generators
WHERE plant_id = sqlc.arg(plant_id);

-- name: GetEIAGeneratorByCompoundID :one
SELECT * FROM eia_generators
WHERE compound_id = sqlc.arg(compound_id);

-- name: GetLatestGeneratorsByPlant :many
SELECT 
    g.*,
    p.name AS plant_name,
    p.state,
    p.county
FROM eia_generators g
JOIN eia_power_plants p ON g.plant_id = p.id
WHERE p.id = sqlc.arg(plant_id);
