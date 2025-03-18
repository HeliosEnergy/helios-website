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
ORDER BY timestamp DESC
LIMIT $1 OFFSET $2;

-- name: GetMetricsByTimeRange :many
SELECT * FROM metrics
WHERE timestamp BETWEEN $1 AND $2
ORDER BY timestamp DESC;

-- name: UpdateMetricValue :one
UPDATE metrics
SET value = $2
WHERE id = $1
RETURNING *;

-- name: DeleteMetric :exec
DELETE FROM metrics
WHERE id = $1;
