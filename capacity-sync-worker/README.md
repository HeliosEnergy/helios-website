# Helios Capacity Sync Worker

Cloudflare Worker that subscribes to Google Drive push notifications for the
Drive-hosted `Helios_Powered_Sites.xlsx` file, parses the second tab
(`Powered Sites`), aggregates capacity by state, and publishes the current
capacity snapshot to Sanity.

The local workbook `../Helios_Powered_Sites.xlsx` is reference-only and must not
be committed.

## Required Secrets

Set these with `wrangler secret put <NAME>`:

- `ADMIN_TOKEN`: bearer token for `/admin/sync` and `/admin/watch`.
- `GOOGLE_CLIENT_EMAIL`: service account email.
- `GOOGLE_PRIVATE_KEY`: service account private key. Keep escaped newlines or
  paste the multiline PEM.
- `GOOGLE_DRIVE_FILE_ID`: Drive file ID for the `.xlsx`.
- `GOOGLE_DRIVE_CHANNEL_TOKEN`: random secret used to verify Drive webhook
  notifications.
- `SANITY_WRITE_TOKEN`: token that can mutate the production dataset.

Optional vars/secrets:

- `PUBLIC_BASE_URL`: deployed worker origin, e.g.
  `https://helios-capacity-sync-worker.helios-energy.workers.dev`.
- `SANITY_PROJECT_ID`: defaults to `05vcm5dh`.
- `SANITY_DATASET`: defaults to `production`.

## Deployment

1. Confirm `wrangler.toml` points at the `helios_capacity_kv` namespace.
2. Deploy the worker:

   ```sh
   cd capacity-sync-worker
   npm install
   wrangler deploy
   ```

3. Share the restricted `.xlsx` Drive file with the service account email as a
   viewer.
4. Register the Drive notification channel:

   ```sh
   curl -X POST "$PUBLIC_BASE_URL/admin/watch" \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

5. Run an initial sync:

   ```sh
   curl -X POST "$PUBLIC_BASE_URL/admin/sync?force=1" \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

The scheduled worker renews the Drive watch every 12 hours. Drive notification
channels expire, so renewal is required even though capacity sync itself remains
event-driven.

## Workbook Contract

The worker reads the second tab, `Powered Sites`, not the agent-generated
`MW by State` tab.

Required columns:

- `Project`
- `Total Capacity (MW)`
- `Asset Type`
- `Geo/Market`

`Geo/Market` values are normalized into map state IDs. Known non-state labels
include `So. UT` and `SLC Metro`, both mapped to Utah. If `Geo/Market` is blank,
the worker falls back to known `Powered Sites` project names or state
abbreviations embedded in the project name. Blank geography that cannot be
resolved fails the sync instead of publishing a partial snapshot. State totals
are rounded to the nearest MW for the website map, while compute/energy totals
preserve the source decimal values.
