import { Sql } from "postgres";

export const createMetricQuery = `-- name: CreateMetric :one
INSERT INTO metrics (
    name,
    value,
    timestamp
) VALUES (
    $1, $2, $3
) RETURNING id, name, value, timestamp`;

export interface CreateMetricArgs {
    name: string;
    value: number;
    timestamp: Date | null;
}

export interface CreateMetricRow {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export async function createMetric(sql: Sql, args: CreateMetricArgs): Promise<CreateMetricRow | null> {
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

export interface GetMetricArgs {
    id: number;
}

export interface GetMetricRow {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export async function getMetric(sql: Sql, args: GetMetricArgs): Promise<GetMetricRow | null> {
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

export interface ListMetricsRow {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export async function listMetrics(sql: Sql): Promise<ListMetricsRow[]> {
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

export interface GetMetricsByTimeRangeArgs {
    startTimestamp: Date | null;
    endTimestamp: Date | null;
}

export interface GetMetricsByTimeRangeRow {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export async function getMetricsByTimeRange(sql: Sql, args: GetMetricsByTimeRangeArgs): Promise<GetMetricsByTimeRangeRow[]> {
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

export interface UpdateMetricArgs {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export interface UpdateMetricRow {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export async function updateMetric(sql: Sql, args: UpdateMetricArgs): Promise<UpdateMetricRow | null> {
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

export interface DeleteMetricArgs {
    id: number;
}

export async function deleteMetric(sql: Sql, args: DeleteMetricArgs): Promise<void> {
    await sql.unsafe(deleteMetricQuery, [args.id]);
}

export const getMetricsByNameQuery = `-- name: GetMetricsByName :many
SELECT id, name, value, timestamp FROM metrics
WHERE name = $1
ORDER BY timestamp DESC`;

export interface GetMetricsByNameArgs {
    name: string;
}

export interface GetMetricsByNameRow {
    id: number;
    name: string;
    value: number;
    timestamp: Date | null;
}

export async function getMetricsByName(sql: Sql, args: GetMetricsByNameArgs): Promise<GetMetricsByNameRow[]> {
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

export interface CreateEIAElectricityDataArgs {
    seriesId: string;
    name: string;
    units: string;
    frequency: string | null;
    copyright: string | null;
    source: string | null;
    iso3166: string | null;
    longitude: number;
    latitude: number;
    geography: string | null;
    startDate: Date | null;
    endDate: Date | null;
    lastUpdated: Date | null;
    data: any | null;
}

export async function createEIAElectricityData(sql: Sql, args: CreateEIAElectricityDataArgs): Promise<void> {
    await sql.unsafe(createEIAElectricityDataQuery, [args.seriesId, args.name, args.units, args.frequency, args.copyright, args.source, args.iso3166, args.longitude, args.latitude, args.geography, args.startDate, args.endDate, args.lastUpdated, args.data]);
}

export const getEIAEntityByApiIDQuery = `-- name: GetEIAEntityByApiID :one

SELECT id, api_entity_id, name, description, metadata, created_at, updated_at FROM eia_entities
WHERE api_entity_id = $1`;

export interface GetEIAEntityByApiIDArgs {
    apiEntityId: string;
}

export interface GetEIAEntityByApiIDRow {
    id: number;
    apiEntityId: string;
    name: string;
    description: string | null;
    metadata: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getEIAEntityByApiID(sql: Sql, args: GetEIAEntityByApiIDArgs): Promise<GetEIAEntityByApiIDRow | null> {
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

export interface UpsertEIAEntityArgs {
    apiEntityId: string;
    name: string;
    description: string | null;
    metadata: any | null;
}

export interface UpsertEIAEntityRow {
    id: number;
    apiEntityId: string;
    name: string;
    description: string | null;
    metadata: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function upsertEIAEntity(sql: Sql, args: UpsertEIAEntityArgs): Promise<UpsertEIAEntityRow | null> {
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

export interface GetEIAPowerPlantByApiIDArgs {
    apiPlantId: string;
}

export interface GetEIAPowerPlantByApiIDRow {
    id: number;
    apiPlantId: string;
    entityId: number | null;
    name: string;
    county: string | null;
    state: string | null;
    location: string | null;
    plantCode: string | null;
    fuelType: string | null;
    primeMover: string | null;
    operatingStatus: string | null;
    metadata: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getEIAPowerPlantByApiID(sql: Sql, args: GetEIAPowerPlantByApiIDArgs): Promise<GetEIAPowerPlantByApiIDRow | null> {
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

export interface UpsertEIAPowerPlantArgs {
    apiPlantId: string;
    entityId: number | null;
    name: string;
    county: string | null;
    state: string | null;
    longitude: number;
    latitude: number;
    plantCode: string | null;
    fuelType: string | null;
    primeMover: string | null;
    operatingStatus: string | null;
    metadata: any | null;
}

export interface UpsertEIAPowerPlantRow {
    id: number;
    apiPlantId: string;
    entityId: number | null;
    name: string;
    county: string | null;
    state: string | null;
    location: string | null;
    plantCode: string | null;
    fuelType: string | null;
    primeMover: string | null;
    operatingStatus: string | null;
    metadata: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function upsertEIAPowerPlant(sql: Sql, args: UpsertEIAPowerPlantArgs): Promise<UpsertEIAPowerPlantRow | null> {
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

export interface CreateEIAPlantStatArgs {
    plantId: number | null;
    timestamp: string | null;
    nameplateCapacityMw: number | null;
    netSummerCapacityMw: number | null;
    netWinterCapacityMw: number | null;
    plannedDerateSummerCapMw: number | null;
    plannedUprateSummerCapMw: number | null;
    operatingYearMonth: Date | null;
    plannedDerateYearMonth: Date | null;
    plannedUprateYearMonth: Date | null;
    plannedRetirementYearMonth: Date | null;
    sourceTimestamp: Date | null;
    dataPeriod: string | null;
    metadata: any | null;
}

export interface CreateEIAPlantStatRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    nameplateCapacityMw: number | null;
    netSummerCapacityMw: number | null;
    netWinterCapacityMw: number | null;
    plannedDerateSummerCapMw: number | null;
    plannedUprateSummerCapMw: number | null;
    operatingYearMonth: Date | null;
    plannedDerateYearMonth: Date | null;
    plannedUprateYearMonth: Date | null;
    plannedRetirementYearMonth: Date | null;
    sourceTimestamp: Date | null;
    dataPeriod: string | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function createEIAPlantStat(sql: Sql, args: CreateEIAPlantStatArgs): Promise<CreateEIAPlantStatRow | null> {
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

export interface GetEIAPlantStatsByPlantIDArgs {
    plantId: number | null;
}

export interface GetEIAPlantStatsByPlantIDRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    nameplateCapacityMw: number | null;
    netSummerCapacityMw: number | null;
    netWinterCapacityMw: number | null;
    plannedDerateSummerCapMw: number | null;
    plannedUprateSummerCapMw: number | null;
    operatingYearMonth: Date | null;
    plannedDerateYearMonth: Date | null;
    plannedUprateYearMonth: Date | null;
    plannedRetirementYearMonth: Date | null;
    sourceTimestamp: Date | null;
    dataPeriod: string | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function getEIAPlantStatsByPlantID(sql: Sql, args: GetEIAPlantStatsByPlantIDArgs): Promise<GetEIAPlantStatsByPlantIDRow[]> {
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

export interface GetEIAPlantStatsInTimeRangeArgs {
    plantId: number | null;
    startTimestamp: Date;
    endTimestamp: Date;
}

export interface GetEIAPlantStatsInTimeRangeRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    nameplateCapacityMw: number | null;
    netSummerCapacityMw: number | null;
    netWinterCapacityMw: number | null;
    plannedDerateSummerCapMw: number | null;
    plannedUprateSummerCapMw: number | null;
    operatingYearMonth: Date | null;
    plannedDerateYearMonth: Date | null;
    plannedUprateYearMonth: Date | null;
    plannedRetirementYearMonth: Date | null;
    sourceTimestamp: Date | null;
    dataPeriod: string | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function getEIAPlantStatsInTimeRange(sql: Sql, args: GetEIAPlantStatsInTimeRangeArgs): Promise<GetEIAPlantStatsInTimeRangeRow[]> {
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

export interface GetLatestEIAPlantStatArgs {
    plantId: number | null;
}

export interface GetLatestEIAPlantStatRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    nameplateCapacityMw: number | null;
    netSummerCapacityMw: number | null;
    netWinterCapacityMw: number | null;
    plannedDerateSummerCapMw: number | null;
    plannedUprateSummerCapMw: number | null;
    operatingYearMonth: Date | null;
    plannedDerateYearMonth: Date | null;
    plannedUprateYearMonth: Date | null;
    plannedRetirementYearMonth: Date | null;
    sourceTimestamp: Date | null;
    dataPeriod: string | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function getLatestEIAPlantStat(sql: Sql, args: GetLatestEIAPlantStatArgs): Promise<GetLatestEIAPlantStatRow | null> {
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

export interface GetEIAPowerPlantsForEntityArgs {
    entityId: number | null;
}

export interface GetEIAPowerPlantsForEntityRow {
    id: number;
    apiPlantId: string;
    entityId: number | null;
    name: string;
    county: string | null;
    state: string | null;
    location: string | null;
    plantCode: string | null;
    fuelType: string | null;
    primeMover: string | null;
    operatingStatus: string | null;
    metadata: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export async function getEIAPowerPlantsForEntity(sql: Sql, args: GetEIAPowerPlantsForEntityArgs): Promise<GetEIAPowerPlantsForEntityRow[]> {
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
    s.id AS stat_id,
    s.nameplate_capacity_mw,
    s.net_summer_capacity_mw,
    s.net_winter_capacity_mw,
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
        OR (s.nameplate_capacity_mw IS NOT NULL AND s.nameplate_capacity_mw >= $4)
    )
    AND (
        $5::float IS NULL 
        OR (s.nameplate_capacity_mw IS NOT NULL AND s.nameplate_capacity_mw <= $5)
    )`;

export interface GetAllPowerPlantsWithLatestStatsArgs {
    fuelType: string | null;
    states: string[] | null;
    operatingStatus: string | null;
    minCapacity: number | null;
    maxCapacity: number | null;
}

export interface GetAllPowerPlantsWithLatestStatsRow {
    id: number;
    apiPlantId: string;
    entityId: number | null;
    name: string;
    county: string | null;
    state: string | null;
    longitude: string | null;
    latitude: string | null;
    plantCode: string | null;
    fuelType: string | null;
    primeMover: string | null;
    operatingStatus: string | null;
    plantMetadata: any | null;
    plantCreatedAt: Date | null;
    plantUpdatedAt: Date | null;
    statId: number;
    nameplateCapacityMw: number | null;
    netSummerCapacityMw: number | null;
    netWinterCapacityMw: number | null;
    plannedDerateSummerCapMw: number | null;
    plannedUprateSummerCapMw: number | null;
    operatingYearMonth: Date | null;
    plannedDerateYearMonth: Date | null;
    plannedUprateYearMonth: Date | null;
    plannedRetirementYearMonth: Date | null;
    sourceTimestamp: Date | null;
    dataPeriod: string | null;
    statMetadata: any | null;
    statTimestamp: Date;
}

export async function getAllPowerPlantsWithLatestStats(sql: Sql, args: GetAllPowerPlantsWithLatestStatsArgs): Promise<GetAllPowerPlantsWithLatestStatsRow[]> {
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
        statId: row[15],
        nameplateCapacityMw: row[16],
        netSummerCapacityMw: row[17],
        netWinterCapacityMw: row[18],
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
    $14,
    $15,
    $16,
    $17,
    $18,
    $19
)
RETURNING id, plant_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at`;

export interface CreateEIAPlantGenerationArgs {
    plantId: number | null;
    timestamp: string | null;
    period: string | null;
    generation: number | null;
    generationUnits: string | null;
    grossGeneration: number | null;
    grossGenerationUnits: string | null;
    consumptionForEg: number | null;
    consumptionForEgUnits: string | null;
    consumptionForEgBtu: number | null;
    consumptionForEgBtuUnits: string | null;
    totalConsumption: number | null;
    totalConsumptionUnits: string | null;
    totalConsumptionBtu: number | null;
    totalConsumptionBtuUnits: string | null;
    averageHeatContent: number | null;
    averageHeatContentUnits: string | null;
    sourceTimestamp: Date | null;
    metadata: any | null;
}

export interface CreateEIAPlantGenerationRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    period: string | null;
    generation: number | null;
    generationUnits: string | null;
    grossGeneration: number | null;
    grossGenerationUnits: string | null;
    consumptionForEg: number | null;
    consumptionForEgUnits: string | null;
    consumptionForEgBtu: number | null;
    consumptionForEgBtuUnits: string | null;
    totalConsumption: number | null;
    totalConsumptionUnits: string | null;
    totalConsumptionBtu: number | null;
    totalConsumptionBtuUnits: string | null;
    averageHeatContent: number | null;
    averageHeatContentUnits: string | null;
    sourceTimestamp: Date | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function createEIAPlantGeneration(sql: Sql, args: CreateEIAPlantGenerationArgs): Promise<CreateEIAPlantGenerationRow | null> {
    const rows = await sql.unsafe(createEIAPlantGenerationQuery, [args.plantId, args.timestamp, args.period, args.generation, args.generationUnits, args.grossGeneration, args.grossGenerationUnits, args.consumptionForEg, args.consumptionForEgUnits, args.consumptionForEgBtu, args.consumptionForEgBtuUnits, args.totalConsumption, args.totalConsumptionUnits, args.totalConsumptionBtu, args.totalConsumptionBtuUnits, args.averageHeatContent, args.averageHeatContentUnits, args.sourceTimestamp, args.metadata]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        period: row[3],
        generation: row[4],
        generationUnits: row[5],
        grossGeneration: row[6],
        grossGenerationUnits: row[7],
        consumptionForEg: row[8],
        consumptionForEgUnits: row[9],
        consumptionForEgBtu: row[10],
        consumptionForEgBtuUnits: row[11],
        totalConsumption: row[12],
        totalConsumptionUnits: row[13],
        totalConsumptionBtu: row[14],
        totalConsumptionBtuUnits: row[15],
        averageHeatContent: row[16],
        averageHeatContentUnits: row[17],
        sourceTimestamp: row[18],
        metadata: row[19],
        createdAt: row[20]
    };
}

export const getEIAPlantGenerationByPlantIDQuery = `-- name: GetEIAPlantGenerationByPlantID :many
SELECT id, plant_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at FROM eia_plant_generation
WHERE plant_id = $1
ORDER BY timestamp DESC`;

export interface GetEIAPlantGenerationByPlantIDArgs {
    plantId: number | null;
}

export interface GetEIAPlantGenerationByPlantIDRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    period: string | null;
    generation: number | null;
    generationUnits: string | null;
    grossGeneration: number | null;
    grossGenerationUnits: string | null;
    consumptionForEg: number | null;
    consumptionForEgUnits: string | null;
    consumptionForEgBtu: number | null;
    consumptionForEgBtuUnits: string | null;
    totalConsumption: number | null;
    totalConsumptionUnits: string | null;
    totalConsumptionBtu: number | null;
    totalConsumptionBtuUnits: string | null;
    averageHeatContent: number | null;
    averageHeatContentUnits: string | null;
    sourceTimestamp: Date | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function getEIAPlantGenerationByPlantID(sql: Sql, args: GetEIAPlantGenerationByPlantIDArgs): Promise<GetEIAPlantGenerationByPlantIDRow[]> {
    return (await sql.unsafe(getEIAPlantGenerationByPlantIDQuery, [args.plantId]).values()).map(row => ({
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        period: row[3],
        generation: row[4],
        generationUnits: row[5],
        grossGeneration: row[6],
        grossGenerationUnits: row[7],
        consumptionForEg: row[8],
        consumptionForEgUnits: row[9],
        consumptionForEgBtu: row[10],
        consumptionForEgBtuUnits: row[11],
        totalConsumption: row[12],
        totalConsumptionUnits: row[13],
        totalConsumptionBtu: row[14],
        totalConsumptionBtuUnits: row[15],
        averageHeatContent: row[16],
        averageHeatContentUnits: row[17],
        sourceTimestamp: row[18],
        metadata: row[19],
        createdAt: row[20]
    }));
}

export const getEIAPlantGenerationInTimeRangeQuery = `-- name: GetEIAPlantGenerationInTimeRange :many
SELECT id, plant_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at FROM eia_plant_generation
WHERE plant_id = $1
AND timestamp BETWEEN $2 AND $3
ORDER BY timestamp DESC`;

export interface GetEIAPlantGenerationInTimeRangeArgs {
    plantId: number | null;
    startTimestamp: Date;
    endTimestamp: Date;
}

export interface GetEIAPlantGenerationInTimeRangeRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    period: string | null;
    generation: number | null;
    generationUnits: string | null;
    grossGeneration: number | null;
    grossGenerationUnits: string | null;
    consumptionForEg: number | null;
    consumptionForEgUnits: string | null;
    consumptionForEgBtu: number | null;
    consumptionForEgBtuUnits: string | null;
    totalConsumption: number | null;
    totalConsumptionUnits: string | null;
    totalConsumptionBtu: number | null;
    totalConsumptionBtuUnits: string | null;
    averageHeatContent: number | null;
    averageHeatContentUnits: string | null;
    sourceTimestamp: Date | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function getEIAPlantGenerationInTimeRange(sql: Sql, args: GetEIAPlantGenerationInTimeRangeArgs): Promise<GetEIAPlantGenerationInTimeRangeRow[]> {
    return (await sql.unsafe(getEIAPlantGenerationInTimeRangeQuery, [args.plantId, args.startTimestamp, args.endTimestamp]).values()).map(row => ({
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        period: row[3],
        generation: row[4],
        generationUnits: row[5],
        grossGeneration: row[6],
        grossGenerationUnits: row[7],
        consumptionForEg: row[8],
        consumptionForEgUnits: row[9],
        consumptionForEgBtu: row[10],
        consumptionForEgBtuUnits: row[11],
        totalConsumption: row[12],
        totalConsumptionUnits: row[13],
        totalConsumptionBtu: row[14],
        totalConsumptionBtuUnits: row[15],
        averageHeatContent: row[16],
        averageHeatContentUnits: row[17],
        sourceTimestamp: row[18],
        metadata: row[19],
        createdAt: row[20]
    }));
}

export const getLatestEIAPlantGenerationQuery = `-- name: GetLatestEIAPlantGeneration :one
SELECT id, plant_id, timestamp, period, generation, generation_units, gross_generation, gross_generation_units, consumption_for_eg, consumption_for_eg_units, consumption_for_eg_btu, consumption_for_eg_btu_units, total_consumption, total_consumption_units, total_consumption_btu, total_consumption_btu_units, average_heat_content, average_heat_content_units, source_timestamp, metadata, created_at FROM eia_plant_generation
WHERE plant_id = $1
ORDER BY timestamp DESC
LIMIT 1`;

export interface GetLatestEIAPlantGenerationArgs {
    plantId: number | null;
}

export interface GetLatestEIAPlantGenerationRow {
    id: number;
    plantId: number | null;
    timestamp: Date;
    period: string | null;
    generation: number | null;
    generationUnits: string | null;
    grossGeneration: number | null;
    grossGenerationUnits: string | null;
    consumptionForEg: number | null;
    consumptionForEgUnits: string | null;
    consumptionForEgBtu: number | null;
    consumptionForEgBtuUnits: string | null;
    totalConsumption: number | null;
    totalConsumptionUnits: string | null;
    totalConsumptionBtu: number | null;
    totalConsumptionBtuUnits: string | null;
    averageHeatContent: number | null;
    averageHeatContentUnits: string | null;
    sourceTimestamp: Date | null;
    metadata: any | null;
    createdAt: Date | null;
}

export async function getLatestEIAPlantGeneration(sql: Sql, args: GetLatestEIAPlantGenerationArgs): Promise<GetLatestEIAPlantGenerationRow | null> {
    const rows = await sql.unsafe(getLatestEIAPlantGenerationQuery, [args.plantId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        plantId: row[1],
        timestamp: row[2],
        period: row[3],
        generation: row[4],
        generationUnits: row[5],
        grossGeneration: row[6],
        grossGenerationUnits: row[7],
        consumptionForEg: row[8],
        consumptionForEgUnits: row[9],
        consumptionForEgBtu: row[10],
        consumptionForEgBtuUnits: row[11],
        totalConsumption: row[12],
        totalConsumptionUnits: row[13],
        totalConsumptionBtu: row[14],
        totalConsumptionBtuUnits: row[15],
        averageHeatContent: row[16],
        averageHeatContentUnits: row[17],
        sourceTimestamp: row[18],
        metadata: row[19],
        createdAt: row[20]
    };
}

