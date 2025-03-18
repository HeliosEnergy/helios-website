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
INSERT INTO eia_electricity_data (
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
