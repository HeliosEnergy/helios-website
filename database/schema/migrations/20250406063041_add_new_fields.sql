-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

ALTER TABLE gpu
ADD COLUMN release_date DATE,
ADD COLUMN relevancy INT;

CREATE TYPE gpu_cloud_type AS ENUM ('self_hosted', 'market', 'colocation_user', 'unknown');

ALTER TABLE gpu_cloud
ADD COLUMN type gpu_cloud_type DEFAULT 'unknown',
ADD COLUMN founding_year INT,
ADD COLUMN global_relevancy INT;



CREATE INDEX gpu_release_date_idx ON gpu (release_date);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

ALTER TABLE gpu
DROP COLUMN release_date,
DROP COLUMN relevancy;

ALTER TABLE gpu_cloud
DROP COLUMN type,
DROP COLUMN founding_year,
DROP COLUMN global_relevancy;

DROP TYPE gpu_cloud_type;
-- +goose StatementEnd
