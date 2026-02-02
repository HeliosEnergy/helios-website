import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
    console.error('Error: SANITY_WRITE_TOKEN is missing in .env.local')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
})

async function cleanup() {
    console.log('='.repeat(60))
    console.log('Sanity Duplicate Cleanup')
    console.log('='.repeat(60))
    console.log(`Dataset: ${dataset}`)
    console.log('')

    // Cleanup GPU models
    console.log('Checking GPU models...')
    const allGpus = await client.fetch(`*[_type == "gpuModel"]{ _id, id, name, displayOrder } | order(displayOrder asc)`)
    console.log(`Found ${allGpus.length} total GPU documents`)

    const gpuById: Record<string, Array<{ _id: string; id: string; name: string; displayOrder: number }>> = {}
    for (const gpu of allGpus) {
        if (!gpuById[gpu.id]) {
            gpuById[gpu.id] = []
        }
        gpuById[gpu.id].push(gpu)
    }

    let gpuDupsDeleted = 0
    for (const [id, gpus] of Object.entries(gpuById)) {
        if (gpus.length > 1) {
            console.log(`  GPU "${id}" has ${gpus.length} copies:`)
            // Keep the one with lowest displayOrder (or first if same)
            gpus.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
            for (let i = 0; i < gpus.length; i++) {
                if (i === 0) {
                    console.log(`    KEEP: ${gpus[i]._id} (${gpus[i].name}, order=${gpus[i].displayOrder})`)
                } else {
                    console.log(`    DELETE: ${gpus[i]._id} (${gpus[i].name}, order=${gpus[i].displayOrder})`)
                    await client.delete(gpus[i]._id)
                    gpuDupsDeleted++
                }
            }
        }
    }
    console.log(`Deleted ${gpuDupsDeleted} duplicate GPU documents`)

    // Cleanup pricing tiers
    console.log('')
    console.log('Checking pricing tiers...')
    const allTiers = await client.fetch(`*[_type == "pricingTier"]{ _id, id, label, displayOrder } | order(displayOrder asc)`)
    console.log(`Found ${allTiers.length} total pricing tier documents`)

    const tierById: Record<string, Array<{ _id: string; id: string; label: string; displayOrder: number }>> = {}
    for (const tier of allTiers) {
        if (!tierById[tier.id]) {
            tierById[tier.id] = []
        }
        tierById[tier.id].push(tier)
    }

    let tierDupsDeleted = 0
    for (const [id, tiers] of Object.entries(tierById)) {
        if (tiers.length > 1) {
            console.log(`  Tier "${id}" has ${tiers.length} copies:`)
            // Keep the one with lowest displayOrder (or first if same)
            tiers.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
            for (let i = 0; i < tiers.length; i++) {
                if (i === 0) {
                    console.log(`    KEEP: ${tiers[i]._id} (${tiers[i].label}, order=${tiers[i].displayOrder})`)
                } else {
                    console.log(`    DELETE: ${tiers[i]._id} (${tiers[i].label}, order=${tiers[i].displayOrder})`)
                    await client.delete(tiers[i]._id)
                    tierDupsDeleted++
                }
            }
        }
    }
    console.log(`Deleted ${tierDupsDeleted} duplicate pricing tier documents`)

    // List all unique IDs found
    console.log('')
    console.log('Remaining documents:')
    console.log('  GPUs:', Object.keys(gpuById).join(', '))
    console.log('  Tiers:', Object.keys(tierById).join(', '))

    // Check for orphan tiers (IDs we don't expect)
    const expectedTierIds = ['on-demand', '1-month', '3-month', '6-month', '12-month', '24-month', '36-month']
    const unexpectedTiers = Object.keys(tierById).filter(id => !expectedTierIds.includes(id))
    if (unexpectedTiers.length > 0) {
        console.log('')
        console.log('WARNING: Found unexpected tier IDs (may be orphans):')
        for (const id of unexpectedTiers) {
            console.log(`  "${id}" - will delete...`)
            for (const tier of tierById[id]) {
                await client.delete(tier._id)
            }
        }
    }

    console.log('')
    console.log('='.repeat(60))
    console.log('Cleanup complete!')
    console.log('='.repeat(60))
}

cleanup().catch(console.error)
