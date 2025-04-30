-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TABLE IF NOT EXISTS meta_kv (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	key VARCHAR(255) NOT NULL,
	value VARCHAR(255) NOT NULL,
	UNIQUE(key)
);
CREATE INDEX meta_kv_key_idx ON meta_kv (key);
CREATE INDEX meta_kv_created_at_idx ON meta_kv (created_at);
CREATE INDEX meta_kv_updated_at_idx ON meta_kv (updated_at);


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
