/**
 * Pricing / GPU-list migration for the 2026-06 website refactor.
 *
 * Goal:
 *   - Offer ONLY: GB300 NVL72, B300, RTX PRO 6000, 5090.
 *   - Remove every other gpuModel from Sanity.
 *   - Set per-term prices ($/GPU/hr). These do NOT fit the single
 *     heliosPrice × tier-discount model (RTX and B300 have different
 *     term ratios), so prices are stored explicitly per term in
 *     `termPrices` (requires the gpuModel schema field added in
 *     sanity/schemas/gpuModel.ts).
 *
 * SAFETY: dry-run by default. Pass --commit to actually write.
 *   Read token:   reads use the public dataset.
 *   Write token:  SANITY_WRITE_TOKEN in .env.local (required for --commit).
 *
 * Usage:
 *   npx tsx migrate-pricing.ts            # dry run, prints planned changes
 *   npx tsx migrate-pricing.ts --commit   # writes to PRODUCTION dataset
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const COMMIT = process.argv.includes('--commit')
const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (COMMIT && !token) {
  console.error('❌ --commit requires SANITY_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-12-19',
})

// term ids align with existing pricingTier durations: 12-month / 36-month / 60-month.
// null = price not yet provided (collect from founder — see Slack message / PRD §9).
type Term = { term: '1-year' | '3-year' | '5-year'; pricePerGpuHr: number | null }

const OFFERED: {
  id: string
  name: string
  vram: string
  memory: string
  displayOrder: number
  // base hourly used by legacy single-price rendering; keep = 1-year rate.
  heliosPrice: number
  termPrices: Term[]
}[] = [
  {
    id: 'gb300-nvl72',
    name: 'GB300 NVL72',
    vram: '288GB',
    memory: 'HBM3e',
    displayOrder: 0,
    heliosPrice: 0, // TODO(owner): GB300 NVL72 pricing not provided
    termPrices: [
      { term: '1-year', pricePerGpuHr: null },
      { term: '3-year', pricePerGpuHr: null },
      { term: '5-year', pricePerGpuHr: null },
    ],
  },
  {
    id: 'b300',
    name: 'B300',
    vram: '288GB',
    memory: 'HBM3e',
    displayOrder: 1,
    heliosPrice: 4.8,
    termPrices: [
      { term: '1-year', pricePerGpuHr: 4.8 },
      { term: '3-year', pricePerGpuHr: 4.2 },
      { term: '5-year', pricePerGpuHr: 3.8 },
    ],
  },
  {
    id: 'rtx-pro-6000',
    name: 'RTX PRO 6000',
    vram: '96GB',
    memory: 'GDDR7',
    displayOrder: 2,
    heliosPrice: 1.7,
    termPrices: [
      { term: '1-year', pricePerGpuHr: 1.7 },
      { term: '3-year', pricePerGpuHr: 1.4 },
      { term: '5-year', pricePerGpuHr: null }, // TODO(owner): RTX 5-year not provided
    ],
  },
  {
    id: '5090',
    name: 'RTX 5090',
    vram: '32GB',
    memory: 'GDDR7',
    displayOrder: 3,
    heliosPrice: 0, // TODO(owner): 5090 pricing not provided
    termPrices: [
      { term: '1-year', pricePerGpuHr: null },
      { term: '3-year', pricePerGpuHr: null },
      { term: '5-year', pricePerGpuHr: null },
    ],
  },
]

const KEEP_IDS = new Set(OFFERED.map((g) => g.id))

async function main() {
  console.log(`\n=== Pricing migration (${COMMIT ? 'COMMIT' : 'DRY RUN'}) — ${projectId}/${dataset} ===\n`)

  const existing: { _id: string; id: string; name: string }[] = await client.fetch(
    `*[_type=="gpuModel"]{_id, id, name}`
  )

  const toRemove = existing.filter((g) => !KEEP_IDS.has(g.id))
  console.log(`Existing gpuModels: ${existing.length}`)
  console.log(`Will REMOVE ${toRemove.length}: ${toRemove.map((g) => g.id).join(', ') || '(none)'}`)
  console.log(`Will UPSERT ${OFFERED.length}: ${OFFERED.map((g) => g.id).join(', ')}\n`)

  if (!COMMIT) {
    console.log('Dry run only. Re-run with --commit to apply.\n')
    console.log('⚠ Requires `termPrices` field on the gpuModel schema and a PricingPage update to read it.')
    return
  }

  // Upsert offered models with deterministic _ids.
  for (const g of OFFERED) {
    const doc = {
      _id: `gpuModel.${g.id}`,
      _type: 'gpuModel',
      id: g.id,
      name: g.name,
      vram: g.vram,
      memory: g.memory,
      heliosPrice: g.heliosPrice,
      displayOrder: g.displayOrder,
      termPrices: g.termPrices,
    }
    await client.createOrReplace(doc)
    console.log(`upserted ${g.id}`)
  }

  // Remove non-offered models.
  for (const g of toRemove) {
    await client.delete(g._id)
    console.log(`deleted ${g.id} (${g._id})`)
  }

  console.log('\n✅ Done.\n')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
