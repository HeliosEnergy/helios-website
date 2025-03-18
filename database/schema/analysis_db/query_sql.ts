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

