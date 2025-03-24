export const createMetricQuery = `-- name: CreateMetric :one
INSERT INTO metrics (
    name,
    value,
    timestamp
) VALUES (
    $1, $2, $3
) RETURNING id, name, value, timestamp`;
export async function createMetric(sql, args) {
    const rows = await sql.unsafe(createMetricQuery, [args.name, args.value, args.timestamp]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        name: row[1],
        value: row[2],
        timestamp: row[3]
    };
}
export const getMetricQuery = `-- name: GetMetric :one
SELECT id, name, value, timestamp FROM metrics
WHERE id = $1`;
export async function getMetric(sql, args) {
    const rows = await sql.unsafe(getMetricQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        name: row[1],
        value: row[2],
        timestamp: row[3]
    };
}
export const listMetricsQuery = `-- name: ListMetrics :many
SELECT id, name, value, timestamp FROM metrics
ORDER BY timestamp DESC`;
export async function listMetrics(sql) {
    return (await sql.unsafe(listMetricsQuery, []).values()).map(row => ({
        id: row[0],
        name: row[1],
        value: row[2],
        timestamp: row[3]
    }));
}
export const getMetricsByTimeRangeQuery = `-- name: GetMetricsByTimeRange :many
SELECT id, name, value, timestamp FROM metrics
WHERE timestamp BETWEEN $1 AND $2
ORDER BY timestamp DESC`;
export async function getMetricsByTimeRange(sql, args) {
    return (await sql.unsafe(getMetricsByTimeRangeQuery, [args.startTimestamp, args.endTimestamp]).values()).map(row => ({
        id: row[0],
        name: row[1],
        value: row[2],
        timestamp: row[3]
    }));
}
export const updateMetricQuery = `-- name: UpdateMetric :one
UPDATE metrics
SET name = $2,
    value = $3,
    timestamp = $4
WHERE id = $1
RETURNING id, name, value, timestamp`;
export async function updateMetric(sql, args) {
    const rows = await sql.unsafe(updateMetricQuery, [args.id, args.name, args.value, args.timestamp]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        name: row[1],
        value: row[2],
        timestamp: row[3]
    };
}
export const deleteMetricQuery = `-- name: DeleteMetric :exec
DELETE FROM metrics
WHERE id = $1`;
export async function deleteMetric(sql, args) {
    await sql.unsafe(deleteMetricQuery, [args.id]);
}
export const getMetricsByNameQuery = `-- name: GetMetricsByName :many
SELECT id, name, value, timestamp FROM metrics
WHERE name = $1
ORDER BY timestamp DESC`;
export async function getMetricsByName(sql, args) {
    return (await sql.unsafe(getMetricsByNameQuery, [args.name]).values()).map(row => ({
        id: row[0],
        name: row[1],
        value: row[2],
        timestamp: row[3]
    }));
}
export const createEIAElectricityDataQuery = `-- name: CreateEIAElectricityData :exec
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
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    ST_SetSRID(ST_MakePoint(
        $8::float8,
        $9::float8
    ), 4326)::geography,
    $10,
    $11,
    $12,
    $13,
    $14
)`;
export async function createEIAElectricityData(sql, args) {
    await sql.unsafe(createEIAElectricityDataQuery, [args.seriesId, args.name, args.units, args.frequency, args.copyright, args.source, args.iso3166, args.longitude, args.latitude, args.geography, args.startDate, args.endDate, args.lastUpdated, args.data]);
}
export const getEIAEntityByApiIDQuery = `-- name: GetEIAEntityByApiID :one

SELECT id, api_entity_id, name, description, metadata, created_at, updated_at FROM eia_entities
WHERE api_entity_id = $1`;
export async function getEIAEntityByApiID(sql, args) {
    const rows = await sql.unsafe(getEIAEntityByApiIDQuery, [args.apiEntityId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        apiEntityId: row[1],
        name: row[2],
        description: row[3],
        metadata: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}
export const upsertEIAEntityQuery = `-- name: UpsertEIAEntity :one
INSERT INTO eia_entities (
    api_entity_id,
    name,
    description,
    metadata
) VALUES (
    $1,
    $2,
    $3,
    $4
)
ON CONFLICT (api_entity_id) 
DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata,
    updated_at = CURRENT_TIMESTAMP
RETURNING id, api_entity_id, name, description, metadata, created_at, updated_at`;
export async function upsertEIAEntity(sql, args) {
    const rows = await sql.unsafe(upsertEIAEntityQuery, [args.apiEntityId, args.name, args.description, args.metadata]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        apiEntityId: row[1],
        name: row[2],
        description: row[3],
        metadata: row[4],
        createdAt: row[5],
        updatedAt: row[6]
    };
}
export const getEIAPowerPlantByApiIDQuery = `-- name: GetEIAPowerPlantByApiID :one
SELECT id, api_plant_id, entity_id, name, county, state, location, plant_code, fuel_type, prime_mover, operating_status, metadata, created_at, updated_at FROM eia_power_plants
WHERE api_plant_id = $1`;
export async function getEIAPowerPlantByApiID(sql, args) {
    const rows = await sql.unsafe(getEIAPowerPlantByApiIDQuery, [args.apiPlantId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        apiPlantId: row[1],
        entityId: row[2],
        name: row[3],
        county: row[4],
        state: row[5],
        location: row[6],
        plantCode: row[7],
        fuelType: row[8],
        primeMover: row[9],
        operatingStatus: row[10],
        metadata: row[11],
        createdAt: row[12],
        updatedAt: row[13]
    };
}
export const upsertEIAPowerPlantQuery = `-- name: UpsertEIAPowerPlant :one
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
    $1,
    $2,
    $3,
    $4,
    $5,
    ST_SetSRID(ST_MakePoint(
        $6::float8,
        $7::float8
    ), 4326)::geography,
    $8,
    $9,
    $10,
    $11,
    $12
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
RETURNING id, api_plant_id, entity_id, name, county, state, location, plant_code, fuel_type, prime_mover, operating_status, metadata, created_at, updated_at`;
export async function upsertEIAPowerPlant(sql, args) {
    const rows = await sql.unsafe(upsertEIAPowerPlantQuery, [args.apiPlantId, args.entityId, args.name, args.county, args.state, args.longitude, args.latitude, args.plantCode, args.fuelType, args.primeMover, args.operatingStatus, args.metadata]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        apiPlantId: row[1],
        entityId: row[2],
        name: row[3],
        county: row[4],
        state: row[5],
        location: row[6],
        plantCode: row[7],
        fuelType: row[8],
        primeMover: row[9],
        operatingStatus: row[10],
        metadata: row[11],
        createdAt: row[12],
        updatedAt: row[13]
    };
}
export const createEIAPlantStatQuery = `-- name: CreateEIAPlantStat :one
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
    $1,
    COALESCE($2, CURRENT_TIMESTAMP),
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14
)
RETURNING id, plant_id, timestamp, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, planned_derate_summer_cap_mw, planned_uprate_summer_cap_mw, operating_year_month, planned_derate_year_month, planned_uprate_year_month, planned_retirement_year_month, source_timestamp, data_period, metadata, created_at`;
export async function createEIAPlantStat(sql, args) {
    const rows = await sql.unsafe(createEIAPlantStatQuery, [args.plantId, args.timestamp, args.nameplateCapacityMw, args.netSummerCapacityMw, args.netWinterCapacityMw, args.plannedDerateSummerCapMw, args.plannedUprateSummerCapMw, args.operatingYearMonth, args.plannedDerateYearMonth, args.plannedUprateYearMonth, args.plannedRetirementYearMonth, args.sourceTimestamp, args.dataPeriod, args.metadata]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        nameplateCapacityMw: row[3],
        netSummerCapacityMw: row[4],
        netWinterCapacityMw: row[5],
        plannedDerateSummerCapMw: row[6],
        plannedUprateSummerCapMw: row[7],
        operatingYearMonth: row[8],
        plannedDerateYearMonth: row[9],
        plannedUprateYearMonth: row[10],
        plannedRetirementYearMonth: row[11],
        sourceTimestamp: row[12],
        dataPeriod: row[13],
        metadata: row[14],
        createdAt: row[15]
    };
}
export const getEIAPlantStatsByPlantIDQuery = `-- name: GetEIAPlantStatsByPlantID :many
SELECT id, plant_id, timestamp, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, planned_derate_summer_cap_mw, planned_uprate_summer_cap_mw, operating_year_month, planned_derate_year_month, planned_uprate_year_month, planned_retirement_year_month, source_timestamp, data_period, metadata, created_at FROM eia_plant_capacity
WHERE plant_id = $1
ORDER BY timestamp DESC`;
export async function getEIAPlantStatsByPlantID(sql, args) {
    return (await sql.unsafe(getEIAPlantStatsByPlantIDQuery, [args.plantId]).values()).map(row => ({
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        nameplateCapacityMw: row[3],
        netSummerCapacityMw: row[4],
        netWinterCapacityMw: row[5],
        plannedDerateSummerCapMw: row[6],
        plannedUprateSummerCapMw: row[7],
        operatingYearMonth: row[8],
        plannedDerateYearMonth: row[9],
        plannedUprateYearMonth: row[10],
        plannedRetirementYearMonth: row[11],
        sourceTimestamp: row[12],
        dataPeriod: row[13],
        metadata: row[14],
        createdAt: row[15]
    }));
}
export const getEIAPlantStatsInTimeRangeQuery = `-- name: GetEIAPlantStatsInTimeRange :many
SELECT id, plant_id, timestamp, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, planned_derate_summer_cap_mw, planned_uprate_summer_cap_mw, operating_year_month, planned_derate_year_month, planned_uprate_year_month, planned_retirement_year_month, source_timestamp, data_period, metadata, created_at FROM eia_plant_capacity
WHERE plant_id = $1
AND timestamp BETWEEN $2 AND $3
ORDER BY timestamp DESC`;
export async function getEIAPlantStatsInTimeRange(sql, args) {
    return (await sql.unsafe(getEIAPlantStatsInTimeRangeQuery, [args.plantId, args.startTimestamp, args.endTimestamp]).values()).map(row => ({
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        nameplateCapacityMw: row[3],
        netSummerCapacityMw: row[4],
        netWinterCapacityMw: row[5],
        plannedDerateSummerCapMw: row[6],
        plannedUprateSummerCapMw: row[7],
        operatingYearMonth: row[8],
        plannedDerateYearMonth: row[9],
        plannedUprateYearMonth: row[10],
        plannedRetirementYearMonth: row[11],
        sourceTimestamp: row[12],
        dataPeriod: row[13],
        metadata: row[14],
        createdAt: row[15]
    }));
}
export const getLatestEIAPlantStatQuery = `-- name: GetLatestEIAPlantStat :one
SELECT id, plant_id, timestamp, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, planned_derate_summer_cap_mw, planned_uprate_summer_cap_mw, operating_year_month, planned_derate_year_month, planned_uprate_year_month, planned_retirement_year_month, source_timestamp, data_period, metadata, created_at FROM eia_plant_capacity
WHERE plant_id = $1
ORDER BY timestamp DESC
LIMIT 1`;
export async function getLatestEIAPlantStat(sql, args) {
    const rows = await sql.unsafe(getLatestEIAPlantStatQuery, [args.plantId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        nameplateCapacityMw: row[3],
        netSummerCapacityMw: row[4],
        netWinterCapacityMw: row[5],
        plannedDerateSummerCapMw: row[6],
        plannedUprateSummerCapMw: row[7],
        operatingYearMonth: row[8],
        plannedDerateYearMonth: row[9],
        plannedUprateYearMonth: row[10],
        plannedRetirementYearMonth: row[11],
        sourceTimestamp: row[12],
        dataPeriod: row[13],
        metadata: row[14],
        createdAt: row[15]
    };
}
export const getEIAPowerPlantsForEntityQuery = `-- name: GetEIAPowerPlantsForEntity :many
SELECT id, api_plant_id, entity_id, name, county, state, location, plant_code, fuel_type, prime_mover, operating_status, metadata, created_at, updated_at FROM eia_power_plants
WHERE entity_id = $1`;
export async function getEIAPowerPlantsForEntity(sql, args) {
    return (await sql.unsafe(getEIAPowerPlantsForEntityQuery, [args.entityId]).values()).map(row => ({
        id: row[0],
        apiPlantId: row[1],
        entityId: row[2],
        name: row[3],
        county: row[4],
        state: row[5],
        location: row[6],
        plantCode: row[7],
        fuelType: row[8],
        primeMover: row[9],
        operatingStatus: row[10],
        metadata: row[11],
        createdAt: row[12],
        updatedAt: row[13]
    }));
}
export const getAllPowerPlantsWithLatestStatsQuery = `-- name: GetAllPowerPlantsWithLatestStats :many
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
    s.timestamp AS stat_timestamp
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
    SELECT DISTINCT ON (plant_id) id, plant_id, timestamp, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, planned_derate_summer_cap_mw, planned_uprate_summer_cap_mw, operating_year_month, planned_derate_year_month, planned_uprate_year_month, planned_retirement_year_month, source_timestamp, data_period, metadata, created_at
    FROM eia_plant_capacity
    ORDER BY plant_id, timestamp DESC
) as s ON s.plant_id = p.id
WHERE 
    ($1::text IS NULL OR p.fuel_type = $1)
    AND (
        $2::text[] IS NULL 
        OR $2::text[] = '{}'::text[] 
        OR p.state = ANY($2::text[])
    )
    AND ($3::text IS NULL OR p.operating_status = $3)
    AND (
        $4::float IS NULL 
        OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw >= $4)
    )
    AND (
        $5::float IS NULL 
        OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw <= $5)
    )`;
export async function getAllPowerPlantsWithLatestStats(sql, args) {
    return (await sql.unsafe(getAllPowerPlantsWithLatestStatsQuery, [args.fuelType, args.states, args.operatingStatus, args.minCapacity, args.maxCapacity]).values()).map(row => ({
        id: row[0],
        apiPlantId: row[1],
        entityId: row[2],
        name: row[3],
        county: row[4],
        state: row[5],
        longitude: row[6],
        latitude: row[7],
        plantCode: row[8],
        fuelType: row[9],
        primeMover: row[10],
        operatingStatus: row[11],
        plantMetadata: row[12],
        plantCreatedAt: row[13],
        plantUpdatedAt: row[14],
        nameplateCapacityMw: row[15],
        netSummerCapacityMw: row[16],
        netWinterCapacityMw: row[17],
        statId: row[18],
        plannedDerateSummerCapMw: row[19],
        plannedUprateSummerCapMw: row[20],
        operatingYearMonth: row[21],
        plannedDerateYearMonth: row[22],
        plannedUprateYearMonth: row[23],
        plannedRetirementYearMonth: row[24],
        sourceTimestamp: row[25],
        dataPeriod: row[26],
        statMetadata: row[27],
        statTimestamp: row[28]
    }));
}
export const createEIAPlantGenerationQuery = `-- name: CreateEIAPlantGeneration :one
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
    $1,
    $2,
    COALESCE($3, CURRENT_TIMESTAMP),
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19,
    $20
)
RETURNING id, plant_id, generator_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at`;
export async function createEIAPlantGeneration(sql, args) {
    const rows = await sql.unsafe(createEIAPlantGenerationQuery, [args.plantId, args.generatorId, args.timestamp, args.period, args.generation, args.generationUnits, args.grossGeneration, args.grossGenerationUnits, args.consumptionForEg, args.consumptionForEgUnits, args.consumptionForEgBtu, args.consumptionForEgBtuUnits, args.totalConsumption, args.totalConsumptionUnits, args.totalConsumptionBtu, args.totalConsumptionBtuUnits, args.averageHeatContent, args.averageHeatContentUnits, args.sourceTimestamp, args.metadata]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        plantId: row[1],
        generatorId: row[2],
        timestamp: row[3],
        period: row[4],
        generation: row[5],
        generationUnits: row[6],
        grossGeneration: row[7],
        grossGenerationUnits: row[8],
        consumptionForEg: row[9],
        consumptionForEgUnits: row[10],
        consumptionForEgBtu: row[11],
        consumptionForEgBtuUnits: row[12],
        totalConsumption: row[13],
        totalConsumptionUnits: row[14],
        totalConsumptionBtu: row[15],
        totalConsumptionBtuUnits: row[16],
        averageHeatContent: row[17],
        averageHeatContentUnits: row[18],
        sourceTimestamp: row[19],
        metadata: row[20],
        createdAt: row[21]
    };
}
export const getEIAPlantGenerationByPlantIDQuery = `-- name: GetEIAPlantGenerationByPlantID :many
SELECT id, plant_id, generator_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at FROM eia_plant_generation
WHERE plant_id = $1
ORDER BY timestamp DESC`;
export async function getEIAPlantGenerationByPlantID(sql, args) {
    return (await sql.unsafe(getEIAPlantGenerationByPlantIDQuery, [args.plantId]).values()).map(row => ({
        id: row[0],
        plantId: row[1],
        generatorId: row[2],
        timestamp: row[3],
        period: row[4],
        generation: row[5],
        generationUnits: row[6],
        grossGeneration: row[7],
        grossGenerationUnits: row[8],
        consumptionForEg: row[9],
        consumptionForEgUnits: row[10],
        consumptionForEgBtu: row[11],
        consumptionForEgBtuUnits: row[12],
        totalConsumption: row[13],
        totalConsumptionUnits: row[14],
        totalConsumptionBtu: row[15],
        totalConsumptionBtuUnits: row[16],
        averageHeatContent: row[17],
        averageHeatContentUnits: row[18],
        sourceTimestamp: row[19],
        metadata: row[20],
        createdAt: row[21]
    }));
}
export const getEIAPlantGenerationInTimeRangeQuery = `-- name: GetEIAPlantGenerationInTimeRange :many
SELECT id, plant_id, generator_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at FROM eia_plant_generation
WHERE plant_id = $1
AND timestamp BETWEEN $2 AND $3
ORDER BY timestamp DESC`;
export async function getEIAPlantGenerationInTimeRange(sql, args) {
    return (await sql.unsafe(getEIAPlantGenerationInTimeRangeQuery, [args.plantId, args.startTimestamp, args.endTimestamp]).values()).map(row => ({
        id: row[0],
        plantId: row[1],
        generatorId: row[2],
        timestamp: row[3],
        period: row[4],
        generation: row[5],
        generationUnits: row[6],
        grossGeneration: row[7],
        grossGenerationUnits: row[8],
        consumptionForEg: row[9],
        consumptionForEgUnits: row[10],
        consumptionForEgBtu: row[11],
        consumptionForEgBtuUnits: row[12],
        totalConsumption: row[13],
        totalConsumptionUnits: row[14],
        totalConsumptionBtu: row[15],
        totalConsumptionBtuUnits: row[16],
        averageHeatContent: row[17],
        averageHeatContentUnits: row[18],
        sourceTimestamp: row[19],
        metadata: row[20],
        createdAt: row[21]
    }));
}
export const getLatestEIAPlantGenerationQuery = `-- name: GetLatestEIAPlantGeneration :one
SELECT id, plant_id, generator_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at FROM eia_plant_generation
WHERE plant_id = $1
ORDER BY timestamp DESC
LIMIT 1`;
export async function getLatestEIAPlantGeneration(sql, args) {
    const rows = await sql.unsafe(getLatestEIAPlantGenerationQuery, [args.plantId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        plantId: row[1],
        generatorId: row[2],
        timestamp: row[3],
        period: row[4],
        generation: row[5],
        generationUnits: row[6],
        grossGeneration: row[7],
        grossGenerationUnits: row[8],
        consumptionForEg: row[9],
        consumptionForEgUnits: row[10],
        consumptionForEgBtu: row[11],
        consumptionForEgBtuUnits: row[12],
        totalConsumption: row[13],
        totalConsumptionUnits: row[14],
        totalConsumptionBtu: row[15],
        totalConsumptionBtuUnits: row[16],
        averageHeatContent: row[17],
        averageHeatContentUnits: row[18],
        sourceTimestamp: row[19],
        metadata: row[20],
        createdAt: row[21]
    };
}
export const upsertEIAGeneratorQuery = `-- name: UpsertEIAGenerator :one
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
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19,
    $20
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
RETURNING id, compound_id, plant_id, generator_code, name, technology_description, energy_source_code, energy_source_description, prime_mover_code, prime_mover_description, operating_status, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, operating_year_month, planned_derate_summer_cap_mw, planned_derate_year_month, planned_uprate_summer_cap_mw, planned_uprate_year_month, planned_retirement_year_month, metadata, created_at, updated_at`;
export async function upsertEIAGenerator(sql, args) {
    const rows = await sql.unsafe(upsertEIAGeneratorQuery, [args.compoundId, args.plantId, args.generatorCode, args.name, args.technologyDescription, args.energySourceCode, args.energySourceDescription, args.primeMoverCode, args.primeMoverDescription, args.operatingStatus, args.nameplateCapacityMw, args.netSummerCapacityMw, args.netWinterCapacityMw, args.operatingYearMonth, args.plannedDerateSummerCapMw, args.plannedDerateYearMonth, args.plannedUprateSummerCapMw, args.plannedUprateYearMonth, args.plannedRetirementYearMonth, args.metadata]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        compoundId: row[1],
        plantId: row[2],
        generatorCode: row[3],
        name: row[4],
        technologyDescription: row[5],
        energySourceCode: row[6],
        energySourceDescription: row[7],
        primeMoverCode: row[8],
        primeMoverDescription: row[9],
        operatingStatus: row[10],
        nameplateCapacityMw: row[11],
        netSummerCapacityMw: row[12],
        netWinterCapacityMw: row[13],
        operatingYearMonth: row[14],
        plannedDerateSummerCapMw: row[15],
        plannedDerateYearMonth: row[16],
        plannedUprateSummerCapMw: row[17],
        plannedUprateYearMonth: row[18],
        plannedRetirementYearMonth: row[19],
        metadata: row[20],
        createdAt: row[21],
        updatedAt: row[22]
    };
}
export const getEIAGeneratorsByPlantIDQuery = `-- name: GetEIAGeneratorsByPlantID :many
SELECT id, compound_id, plant_id, generator_code, name, technology_description, energy_source_code, energy_source_description, prime_mover_code, prime_mover_description, operating_status, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, operating_year_month, planned_derate_summer_cap_mw, planned_derate_year_month, planned_uprate_summer_cap_mw, planned_uprate_year_month, planned_retirement_year_month, metadata, created_at, updated_at FROM eia_generators
WHERE plant_id = $1`;
export async function getEIAGeneratorsByPlantID(sql, args) {
    return (await sql.unsafe(getEIAGeneratorsByPlantIDQuery, [args.plantId]).values()).map(row => ({
        id: row[0],
        compoundId: row[1],
        plantId: row[2],
        generatorCode: row[3],
        name: row[4],
        technologyDescription: row[5],
        energySourceCode: row[6],
        energySourceDescription: row[7],
        primeMoverCode: row[8],
        primeMoverDescription: row[9],
        operatingStatus: row[10],
        nameplateCapacityMw: row[11],
        netSummerCapacityMw: row[12],
        netWinterCapacityMw: row[13],
        operatingYearMonth: row[14],
        plannedDerateSummerCapMw: row[15],
        plannedDerateYearMonth: row[16],
        plannedUprateSummerCapMw: row[17],
        plannedUprateYearMonth: row[18],
        plannedRetirementYearMonth: row[19],
        metadata: row[20],
        createdAt: row[21],
        updatedAt: row[22]
    }));
}
export const getEIAGeneratorByCompoundIDQuery = `-- name: GetEIAGeneratorByCompoundID :one
SELECT id, compound_id, plant_id, generator_code, name, technology_description, energy_source_code, energy_source_description, prime_mover_code, prime_mover_description, operating_status, nameplate_capacity_mw, net_summer_capacity_mw, net_winter_capacity_mw, operating_year_month, planned_derate_summer_cap_mw, planned_derate_year_month, planned_uprate_summer_cap_mw, planned_uprate_year_month, planned_retirement_year_month, metadata, created_at, updated_at FROM eia_generators
WHERE compound_id = $1`;
export async function getEIAGeneratorByCompoundID(sql, args) {
    const rows = await sql.unsafe(getEIAGeneratorByCompoundIDQuery, [args.compoundId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        compoundId: row[1],
        plantId: row[2],
        generatorCode: row[3],
        name: row[4],
        technologyDescription: row[5],
        energySourceCode: row[6],
        energySourceDescription: row[7],
        primeMoverCode: row[8],
        primeMoverDescription: row[9],
        operatingStatus: row[10],
        nameplateCapacityMw: row[11],
        netSummerCapacityMw: row[12],
        netWinterCapacityMw: row[13],
        operatingYearMonth: row[14],
        plannedDerateSummerCapMw: row[15],
        plannedDerateYearMonth: row[16],
        plannedUprateSummerCapMw: row[17],
        plannedUprateYearMonth: row[18],
        plannedRetirementYearMonth: row[19],
        metadata: row[20],
        createdAt: row[21],
        updatedAt: row[22]
    };
}
export const getLatestGeneratorsByPlantQuery = `-- name: GetLatestGeneratorsByPlant :many
SELECT 
    g.id, g.compound_id, g.plant_id, g.generator_code, g.name, g.technology_description, g.energy_source_code, g.energy_source_description, g.prime_mover_code, g.prime_mover_description, g.operating_status, g.nameplate_capacity_mw, g.net_summer_capacity_mw, g.net_winter_capacity_mw, g.operating_year_month, g.planned_derate_summer_cap_mw, g.planned_derate_year_month, g.planned_uprate_summer_cap_mw, g.planned_uprate_year_month, g.planned_retirement_year_month, g.metadata, g.created_at, g.updated_at,
    p.name AS plant_name,
    p.state,
    p.county
FROM eia_generators g
JOIN eia_power_plants p ON g.plant_id = p.id
WHERE p.id = $1`;
export async function getLatestGeneratorsByPlant(sql, args) {
    return (await sql.unsafe(getLatestGeneratorsByPlantQuery, [args.plantId]).values()).map(row => ({
        id: row[0],
        compoundId: row[1],
        plantId: row[2],
        generatorCode: row[3],
        name: row[4],
        technologyDescription: row[5],
        energySourceCode: row[6],
        energySourceDescription: row[7],
        primeMoverCode: row[8],
        primeMoverDescription: row[9],
        operatingStatus: row[10],
        nameplateCapacityMw: row[11],
        netSummerCapacityMw: row[12],
        netWinterCapacityMw: row[13],
        operatingYearMonth: row[14],
        plannedDerateSummerCapMw: row[15],
        plannedDerateYearMonth: row[16],
        plannedUprateSummerCapMw: row[17],
        plannedUprateYearMonth: row[18],
        plannedRetirementYearMonth: row[19],
        metadata: row[20],
        createdAt: row[21],
        updatedAt: row[22],
        plantName: row[23],
        state: row[24],
        county: row[25]
    }));
}
