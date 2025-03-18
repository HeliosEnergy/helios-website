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
