# Helios Website

Production marketing site for Helios.

## Source of Truth

- GitHub repository: `HeliosEnergy/helios-website`
- Production branch: `main`
- Vercel project: `helios-website`
- Local working directory: `/Users/amoldericksoans/Documents/Helios/helios-website`

Do not use the old Next.js app under `website/helios-landing-page` for production website changes.

## Production Domains

- `helios.co`
- `www.helios.co`
- `helioscloud.org`
- `www.helioscloud.org`
- `heliosenergy.io`
- `www.heliosenergy.io`
- `heliosenergy.ai`
- `www.heliosenergy.ai`

Legacy domains are handled in `src/lib/domainRedirect.ts` and `src/lib/site.ts`.

## Development

```sh
npm install --legacy-peer-deps
npm run dev
```

## Build

```sh
npm run build
```

Vercel production builds use:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Analytics

Microsoft Clarity is loaded only for Vercel production builds.

- Clarity project ID: `whq1fqokkl`
- Loader: `src/lib/microsoftClarity.ts`
- Production gate: `VERCEL_ENV=production`

## Runtime Data And Integrations

This website is not a fully static content app. Several important customer-facing pages read live data from Sanity or submit data to a Cloudflare Worker. A future agent should check these runtime integrations before changing page behavior.

### Sanity CMS

Sanity is the CMS for the website. The frontend client is configured in `src/lib/sanity.ts`:

- Project ID: `05vcm5dh` unless overridden by `VITE_SANITY_PROJECT_ID`.
- Dataset: `production` unless overridden by `VITE_SANITY_DATASET`.
- API version: `2024-12-19`.
- `useCdn: true`, so public reads go through Sanity's CDN.

The main generic Sanity hook is `src/hooks/useSanityData.ts`:

- `useSanityQuery<T>(name, query, params)` wraps `@tanstack/react-query`.
- `QUERIES` contains shared GROQ queries for home sections, blog posts, legal pages, contact page copy, press/events/careers pages, and inference models.

The pricing page uses a separate hook in `src/hooks/usePricingData.ts` because it needs GPU pricing, pricing terms, inference models, and pricing page config. That hook fetches:

- `*[_type == "gpuModel"] | order(displayOrder asc)`
- `*[_type == "inferenceModel"] | order(displayOrder asc)`
- `*[_type == "pricingTier"] | order(displayOrder asc)`
- `*[_type == "pricingPageSection"][0]`

`usePricingData` deduplicates GPU and pricing-tier documents by their `id`, keeping the first document returned by `displayOrder`. This matters because old Sanity GPU documents still exist. Do not assume every `gpuModel` document is shown on `/pricing`.

The Sanity schema files live under `sanity/schemas/`. The most relevant schema for pricing is `sanity/schemas/gpuModel.ts`.

Key `gpuModel` pricing fields:

- `id`: stable app-facing GPU identifier, e.g. `b300`.
- `name`, `vram`, `memory`, `specs`: display metadata.
- `heliosPrice`: current 3-year/base reserved hourly price in USD per GPU hour.
- `heliosReservedTermPrices`: explicit 1-5 year reserved prices. The pricing page prefers this over deriving prices in the browser.
- `marketReservedAvgPrice`: source reserved market average before the Helios discount.
- `heliosBaseReservedPrice`: market average multiplied by `0.95`; equivalent to the 3-year price.
- `pricingHoursPerMonth`: monthly estimate basis. The current pricing automation publishes `730`.
- `pricingLastPublishedAt`: timestamp of the latest automation publish.
- `marketSourceUrl`, `marketSourceUpdatedAt`, `pricingSourceProvider`, `pricingFormulaVersion`: operational metadata. The customer pricing UI intentionally does not display these fields.
- `derivedFromGpuId`, `derivationMultiplier`: used for derived products such as GB300, which is priced from B300 until GetDeploying lists GB300 directly.

Sanity writes are not done by the website at runtime. They are done by scripts or by the external pricing worker. If an agent needs to write Sanity data, use a write token from the environment and avoid committing secrets. Existing migration scripts such as `migrate-to-sanity.ts`, `migrate-gpu-pricing-v2.ts`, and cleanup scripts show the local client pattern.

Important Sanity ID caveat: public Sanity document IDs must not contain dots. The pricing worker now publishes documents such as `gpu-b300` and `gpu-gb300-nvl72`, not IDs like `gpuModel.b300`, because dotted IDs are treated as private/path-like IDs and may not be visible through unauthenticated public reads.

### Pricing Page

The live pricing page is `src/pages/PricingPage.tsx` and is routed from `src/App.tsx` at `/pricing`.

The page is reserved-only GPU pricing. It intentionally does not show source URLs, formulas, or market averages to customers.

Allowed customer-visible GPU IDs are hard-coded in `PricingPage.tsx`:

```ts
const OFFER_ORDER = ['gb300-nvl72', 'b300', 'b200', 'rtx-pro-6000'];
```

Only those four IDs render on `/pricing`, even if Sanity contains older GPU records such as H100, A100, L40S, RTX 4090, or old RTX 6000 Pro variants.

Pricing term behavior:

- The page calls `getTerms(gpu)`.
- If `gpu.heliosReservedTermPrices` exists, the page uses those exact published prices.
- If term prices are missing, it falls back to `heliosBaseReservedPrice ?? heliosPrice` and applies the term multipliers in the browser.
- Term multipliers are:
  - 1 year: `1.10`
  - 2 year: `1.05`
  - 3 year: `1.00`
  - 4 year: `0.95`
  - 5 year: `0.85`

Calculator behavior:

- The calculator is priced in nodes, not individual GPUs.
- `1 node = 8 GPUs`.
- Slider range is `1` to `2048` nodes.
- Hourly total is `selectedTerm.price * nodeCount * 8`.
- Monthly total is hourly total multiplied by `selectedGpu.pricingHoursPerMonth || 730`.
- The default selected GPU is the first valid GPU after sorting by `OFFER_ORDER`, currently GB300.
- The selected reserved term defaults to 3 years when available.

The "Talk to Sales" link currently points to:

```text
/contact?service=clusters&gpu=<gpu_id>&nodes=<nodeCount>
```

`ContactPage.tsx` currently prefills `service`, `cluster`, and `message` query params. If a future agent wants pricing-selected GPU and node count to prefill the contact form, align the pricing URL params with the contact page parser or update the contact page to read `gpu` and `nodes`.

### Daily Pricing Automation

The website does not scrape GetDeploying directly. It reads Sanity. The daily pricing worker lives in the sibling repo directory `../lead-gen-agent`, not in this website project.

Current production architecture:

```text
GetDeploying GPU pages
  -> lead-gen-agent EC2 pricing scraper
  -> SQLite history on the EC2 box
  -> Sanity gpuModel current snapshot
  -> helios.co/pricing reads Sanity
```

The lead-gen worker runs on EC2 instance `i-0aa80083a425cc33b`. Its scheduler job `pricing_scrape` runs daily at `05:00 UTC`.

Important implementation detail: the scraper uses the embedded GetDeploying chart payload, not the FAQ summary table. Each GPU page includes a `gpu-price-chart_data` JSON script with weekly chart rows. The scraper reproduces GetDeploying's own frontend algorithm: select the latest date, filter reservation rows, sort each row's `median_price`, and return the weighted median using `offering_count`. It then rounds to the same two-decimal value shown in the chart before applying the Helios formula. Formula version `reserved_chart_median_0.95_v2` replaced the incorrect v1 arithmetic-average implementation.

Pricing formula:

```text
market_benchmark = latest GetDeploying reserved chart weighted median, rounded to 2 decimals
base = market_benchmark * 0.95
1 year = base * 1.10
2 year = base * 1.05
3 year = base
4 year = base * 0.95
5 year = base * 0.85
GB300 = B300 term price * 1.20 until GB300 has its own GetDeploying listing
```

The worker publishes 4-decimal values to Sanity. The website displays hourly rates with 2 decimals and totals with 2 decimals.

Current offered GPUs:

- `gb300-nvl72`: derived from B300 with `1.20x`.
- `b300`: source page `https://getdeploying.com/gpus/nvidia-b300`.
- `b200`: source page `https://getdeploying.com/gpus/nvidia-b200`.
- `rtx-pro-6000`: source page `https://getdeploying.com/gpus/nvidia-rtx-pro-6000`.

No website redeploy is needed for daily price changes. The website fetches Sanity at runtime, and the worker updates Sanity. Redeploy the website only for code, layout, schema, or routing changes.

Useful verification commands from the website repo root:

```sh
# Confirm the public Sanity CDN data that /pricing will read.
curl -fsSL 'https://05vcm5dh.apicdn.sanity.io/v2024-12-19/data/query/production?query=*%5B_type%20%3D%3D%20%22gpuModel%22%20%26%26%20id%20in%20%5B%22gb300-nvl72%22%2C%22b300%22%2C%22b200%22%2C%22rtx-pro-6000%22%5D%5D%20%7C%20order(displayOrder%20asc)%7Bid%2Cname%2CheliosPrice%2CpricingMarketMetric%2CmarketReservedBenchmarkPrice%2CheliosReservedTermPrices%2CpricingLastPublishedAt%7D'
```

Useful worker-side commands from the EC2 box:

```sh
cd /opt/helios/lead-gen-agent
sudo -u helios .venv/bin/python -m src.cli pricing-scrape --publish
sudo -u helios .venv/bin/python -m src.cli pricing-health
```

The lead-gen API also exposes local read-only pricing endpoints for Control Tower integration:

```text
GET /pricing/current
GET /pricing/history?gpu_id=b300&term_years=3&from=2026-06-30&to=2026-07-22
GET /pricing/history?gpu_id=b300&formula_version=all
GET /pricing/runs?limit=20
GET /pricing/health
```

Failure behavior: if a scrape fails or any required GPU is missing a reserved chart median, the worker does not publish partial Sanity data. The website keeps serving the last good Sanity snapshot.

### Contact Form, Slack Leads, And SQS

The main customer enquiry page is `src/pages/ContactPage.tsx` at `/contact`.

The contact page sends form submissions to the Cloudflare Worker:

```ts
const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";
```

The worker source is in `cloudflare-worker/src/index.ts`. It is deployed separately from the Vercel website with Wrangler. Its config is `cloudflare-worker/wrangler.toml`, and the deployment runbook is `cloudflare-worker/DEPLOYMENT.md`.

Submission flow:

```text
Customer submits /contact
  -> ContactPage builds JSON payload
  -> POST https://helios-contact-worker.helios-energy.workers.dev/
  -> Worker normalizes payload to lead.created
  -> Worker posts a Slack message
  -> Worker enqueues the same lead.created event to AWS SQS
  -> lead-gen-agent EC2 consumes SQS and continues the sales workflow
```

Contact page payload fields:

- `name`
- `email`
- `company` from the `organization` form field, defaulting to `Not specified`
- `message`
- `inquiryType`, mapped from the selected service label
- `clusterDetails` for clusters and baremetal
- `colocationDetails` for colocation
- `inferenceDetails` for selected inference models and estimated usage
- `partnershipDetails` for partnership submissions

Contact page service choices:

- `clusters`
- `coloc`
- `inference`
- `baremetal`
- `partnership`
- `others`

The Worker normalizes service labels and aliases into stable `service_key` values:

- `clusters`
- `baremetal`
- `coloc`
- `inference`
- `training`
- `startup_program`
- `partnership`
- `general`

The Worker requires an email. If email is missing, it returns HTTP 400 with `{ "error": "Email is required." }`.

Slack behavior:

- Preferred path: `SLACK_BOT_TOKEN` plus `SLACK_CHANNEL_ID`.
- Fallback path: `SLACK_WEBHOOK_URL`.
- Bot-token posting uses `chat.postMessage`.
- The Slack message is built by `buildSlackLeadMessage()`.
- Slack blocks include name, email, organization, interest, service-specific detail blocks, notes, and the lead ID.
- If Slack posting succeeds, the Worker stores Slack `channel_id`, `message_ts`, and `thread_ts` on the `lead.created` event before enqueueing it.
- If Slack posting fails or Slack is not configured, the Worker logs the error but still tries to enqueue the lead to SQS.

SQS behavior:

- `sendSqsEvent()` signs AWS SQS `SendMessage` requests directly with AWS Signature Version 4.
- Required Worker secrets:
  - `AWS_REGION`
  - `AWS_SQS_QUEUE_URL`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_SESSION_TOKEN` only for temporary credentials
- If SQS is not configured, the Worker logs a warning and skips enqueueing.
- If SQS returns an error, the Worker logs the failure and returns `false`.

Slack action callback flow:

```text
Slack button/modal action
  -> POST /slack/actions on the Worker
  -> Worker verifies X-Slack-Signature using SLACK_SIGNING_SECRET
  -> Worker converts action to an SQS event
  -> lead-gen-agent consumes the event
```

Supported Slack action event types:

- `email.approve`
- `email.edit_approve`
- `email.reject`
- `email.regenerate`

The Worker also supports an `email.edit` button that opens a Slack modal. Modal submissions become `email.edit_approve` events with edited `subject` and `body_text`.

Required Slack app setup:

- Bot token scope: `chat:write`.
- Interactivity enabled.
- Interactivity request URL:
  `https://helios-contact-worker.helios-energy.workers.dev/slack/actions`
- `SLACK_SIGNING_SECRET` set as a Worker secret.
- `SLACK_CHANNEL_ID` set to the inbound lead channel.

Deploying or updating the Worker:

```sh
cd cloudflare-worker
wrangler deploy
```

Set Worker secrets with:

```sh
wrangler secret put SLACK_BOT_TOKEN
wrangler secret put SLACK_SIGNING_SECRET
wrangler secret put SLACK_CHANNEL_ID
wrangler secret put AWS_REGION
wrangler secret put AWS_SQS_QUEUE_URL
wrangler secret put AWS_ACCESS_KEY_ID
wrangler secret put AWS_SECRET_ACCESS_KEY
```

Do not put Slack tokens, signing secrets, AWS credentials, Sanity write tokens, or webhook URLs in committed files.
