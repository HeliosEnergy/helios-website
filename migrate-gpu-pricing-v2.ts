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

/**
 * GPU Pricing Research (February 2026)
 * Sources:
 * - AWS: https://aws.amazon.com/ec2/pricing/on-demand/ (post mid-2025 44% price cut)
 * - GCP: https://cloud.google.com/compute/gpus-pricing
 * - CoreWeave: https://www.coreweave.com/pricing
 * - Lambda Labs: https://lambda.ai/pricing
 * - RunPod: https://www.runpod.io/pricing
 * - GetDeploying GPU comparison: https://getdeploying.com/gpus
 * - IntuitionLabs H100 comparison: https://intuitionlabs.ai/articles/h100-rental-prices-cloud-comparison
 */

interface GPUModel {
    _type: 'gpuModel'
    id: string
    name: string
    vram: string
    memory: string
    specs: string
    heliosPrice: number // On-demand base price
    awsPrice: string
    googleCloudPrice: string
    coreweavePrice: string
    lambdaPrice: string
    displayOrder: number
}

// GPU Models ordered by: RTX 6000 Pro first, B200 second, then descending capability
const gpuModels: GPUModel[] = [
    // 1. RTX 6000 Pro - Top position (user specified: $1.70 on-demand)
    {
        _type: 'gpuModel',
        id: 'rtx-6000-pro',
        name: 'RTX 6000 Pro',
        vram: '96GB',
        memory: '96GB GDDR7',
        specs: 'Blackwell architecture, 96GB GDDR7, Professional workstation, Ideal for large models',
        heliosPrice: 1.70,
        awsPrice: 'N/A',
        googleCloudPrice: 'N/A',
        coreweavePrice: 'N/A',
        lambdaPrice: 'N/A',
        displayOrder: 0,
    },
    // 2. B200 - Second position (user specified: $4.80 on-demand)
    {
        _type: 'gpuModel',
        id: 'b200',
        name: 'B200',
        vram: '180GB',
        memory: '180GB HBM3e',
        specs: '2.25 PFLOPS FP8, 180GB HBM3e, 8TB/s bandwidth, Blackwell architecture',
        heliosPrice: 4.80,
        awsPrice: 'N/A',
        googleCloudPrice: '18.53',
        coreweavePrice: 'N/A',
        lambdaPrice: '4.99',
        displayOrder: 1,
    },
    // 3. H100 SXM - Flagship datacenter GPU
    {
        _type: 'gpuModel',
        id: 'h100-sxm',
        name: 'H100 SXM',
        vram: '80GB',
        memory: '80GB HBM3',
        specs: '3958 TFLOPS FP8, 80GB HBM3, 3.35TB/s bandwidth, NVLink 4.0',
        heliosPrice: 2.49,
        awsPrice: '3.90',
        googleCloudPrice: '11.06',
        coreweavePrice: '4.25',
        lambdaPrice: '2.99',
        displayOrder: 2,
    },
    // 4. H100 NVL - Higher VRAM variant
    {
        _type: 'gpuModel',
        id: 'h100-nvl',
        name: 'H100 NVL',
        vram: '94GB',
        memory: '94GB HBM3',
        specs: '3958 TFLOPS FP8, 94GB HBM3, NVLink Bridge for 188GB combined',
        heliosPrice: 2.79,
        awsPrice: '4.20',
        googleCloudPrice: '12.00',
        coreweavePrice: '5.00',
        lambdaPrice: '3.29',
        displayOrder: 3,
    },
    // 5. A100 80GB - Previous gen flagship
    {
        _type: 'gpuModel',
        id: 'a100-80gb',
        name: 'A100 80GB',
        vram: '80GB',
        memory: '80GB HBM2e',
        specs: '312 TFLOPS FP16, 80GB HBM2e, 2TB/s bandwidth',
        heliosPrice: 1.29,
        awsPrice: '1.79',
        googleCloudPrice: '3.67',
        coreweavePrice: '2.21',
        lambdaPrice: '1.79',
        displayOrder: 4,
    },
    // 6. A100 40GB
    {
        _type: 'gpuModel',
        id: 'a100-40gb',
        name: 'A100 40GB',
        vram: '40GB',
        memory: '40GB HBM2e',
        specs: '312 TFLOPS FP16, 40GB HBM2e, 1.6TB/s bandwidth',
        heliosPrice: 0.99,
        awsPrice: '1.40',
        googleCloudPrice: '2.93',
        coreweavePrice: '1.80',
        lambdaPrice: '1.29',
        displayOrder: 5,
    },
    // 7. L40S - Inference optimized
    {
        _type: 'gpuModel',
        id: 'l40s',
        name: 'L40S',
        vram: '48GB',
        memory: '48GB GDDR6',
        specs: '366 TFLOPS FP8, 48GB GDDR6, Inference optimized',
        heliosPrice: 0.89,
        awsPrice: '1.57',
        googleCloudPrice: '1.40',
        coreweavePrice: '1.25',
        lambdaPrice: 'N/A',
        displayOrder: 6,
    },
    // 8. RTX A6000 - Professional workstation
    {
        _type: 'gpuModel',
        id: 'rtx-a6000',
        name: 'RTX A6000',
        vram: '48GB',
        memory: '48GB GDDR6',
        specs: '38.7 TFLOPS FP32, 48GB GDDR6, Professional workstation',
        heliosPrice: 0.59,
        awsPrice: 'N/A',
        googleCloudPrice: 'N/A',
        coreweavePrice: '0.78',
        lambdaPrice: '0.80',
        displayOrder: 7,
    },
    // 9. RTX 4090 - Consumer flagship
    {
        _type: 'gpuModel',
        id: 'rtx-4090',
        name: 'RTX 4090',
        vram: '24GB',
        memory: '24GB GDDR6X',
        specs: '82.6 TFLOPS FP32, 24GB GDDR6X, Consumer flagship',
        heliosPrice: 0.44,
        awsPrice: 'N/A',
        googleCloudPrice: 'N/A',
        coreweavePrice: 'N/A',
        lambdaPrice: '0.50',
        displayOrder: 8,
    },
]

interface PricingTier {
    _type: 'pricingTier'
    id: string
    label: string
    duration: string
    discount: number
    featured: boolean
    description: string
    displayOrder: number
}

// Calculate discounts based on user requirements:
// RTX 6000 Pro: $1.10 for 36 months (from $1.70 on-demand) = ~35% discount
// B200: $3.10 for 36 months (from $4.80 on-demand) = ~35% discount
// This means 36-month discount should be ~35%
const pricingTiers: PricingTier[] = [
    {
        _type: 'pricingTier',
        id: 'on-demand',
        label: 'On Demand',
        duration: 'Hourly billing',
        discount: 0,
        featured: false,
        description: 'Pay as you go with no commitment. Perfect for testing and sporadic workloads.',
        displayOrder: 0,
    },
    {
        _type: 'pricingTier',
        id: '1-month',
        label: '1 Month',
        duration: '1-month commitment',
        discount: 5,
        featured: false,
        description: 'Short-term commitment with modest savings.',
        displayOrder: 1,
    },
    {
        _type: 'pricingTier',
        id: '3-month',
        label: '3 Months',
        duration: '3-month commitment',
        discount: 10,
        featured: false,
        description: 'Quarterly commitment with better savings.',
        displayOrder: 2,
    },
    {
        _type: 'pricingTier',
        id: '6-month',
        label: '6 Months',
        duration: '6-month commitment',
        discount: 15,
        featured: false,
        description: 'Semi-annual commitment for growing teams.',
        displayOrder: 3,
    },
    {
        _type: 'pricingTier',
        id: '12-month',
        label: '12 Months',
        duration: '1-year commitment',
        discount: 22,
        featured: true,
        description: 'Annual commitment with significant savings. Most popular choice.',
        displayOrder: 4,
    },
    {
        _type: 'pricingTier',
        id: '24-month',
        label: '24 Months',
        duration: '2-year commitment',
        discount: 30,
        featured: false,
        description: 'Long-term commitment for enterprise planning.',
        displayOrder: 5,
    },
    {
        _type: 'pricingTier',
        id: '36-month',
        label: '36 Months',
        duration: '3-year commitment',
        discount: 35, // ~35% discount: RTX 6000 Pro $1.70 -> $1.10, B200 $4.80 -> $3.10
        featured: false,
        description: 'Maximum savings for strategic infrastructure investments.',
        displayOrder: 6,
    },
]

async function cleanupDuplicates() {
    console.log('Cleaning up duplicate GPU models...')

    // Get all GPU models
    const allGpus = await client.fetch(`*[_type == "gpuModel"]{ _id, id, name }`)
    console.log(`Found ${allGpus.length} total GPU documents`)

    // Group by id to find duplicates
    const gpuById: Record<string, Array<{ _id: string; id: string; name: string }>> = {}
    for (const gpu of allGpus) {
        if (!gpuById[gpu.id]) {
            gpuById[gpu.id] = []
        }
        gpuById[gpu.id].push(gpu)
    }

    // Delete duplicates (keep first, delete rest)
    for (const [id, gpus] of Object.entries(gpuById)) {
        if (gpus.length > 1) {
            console.log(`  Found ${gpus.length} duplicates for GPU "${id}", deleting extras...`)
            for (let i = 1; i < gpus.length; i++) {
                await client.delete(gpus[i]._id)
                console.log(`    Deleted: ${gpus[i]._id}`)
            }
        }
    }

    console.log('Cleaning up duplicate pricing tiers...')

    // Get all pricing tiers
    const allTiers = await client.fetch(`*[_type == "pricingTier"]{ _id, id, label }`)
    console.log(`Found ${allTiers.length} total pricing tier documents`)

    // Group by id to find duplicates
    const tierById: Record<string, Array<{ _id: string; id: string; label: string }>> = {}
    for (const tier of allTiers) {
        if (!tierById[tier.id]) {
            tierById[tier.id] = []
        }
        tierById[tier.id].push(tier)
    }

    // Delete duplicates (keep first, delete rest)
    for (const [id, tiers] of Object.entries(tierById)) {
        if (tiers.length > 1) {
            console.log(`  Found ${tiers.length} duplicates for tier "${id}", deleting extras...`)
            for (let i = 1; i < tiers.length; i++) {
                await client.delete(tiers[i]._id)
                console.log(`    Deleted: ${tiers[i]._id}`)
            }
        }
    }
}

async function migrateGPUs() {
    console.log('\nMigrating GPU models...')
    console.log('Order: RTX 6000 Pro -> B200 -> H100 -> A100 -> L40S -> A6000 -> RTX 4090')
    console.log('')

    for (const gpu of gpuModels) {
        try {
            const existing = await client.fetch(
                `*[_type == "gpuModel" && id == $id][0]`,
                { id: gpu.id }
            )

            if (existing) {
                console.log(`Updating: ${gpu.name} - Helios: $${gpu.heliosPrice}/hr`)
                await client.patch(existing._id).set(gpu).commit()
            } else {
                console.log(`Creating: ${gpu.name} - Helios: $${gpu.heliosPrice}/hr`)
                await client.create(gpu)
            }
            console.log(`  AWS: $${gpu.awsPrice} | GCP: $${gpu.googleCloudPrice} | CoreWeave: $${gpu.coreweavePrice} | Lambda: $${gpu.lambdaPrice}`)
        } catch (error) {
            console.error(`Error with ${gpu.name}:`, error)
        }
    }
}

async function migrateTiers() {
    console.log('\nMigrating pricing tiers...')

    for (const tier of pricingTiers) {
        try {
            const existing = await client.fetch(
                `*[_type == "pricingTier" && id == $id][0]`,
                { id: tier.id }
            )

            if (existing) {
                console.log(`Updating tier: ${tier.label} (${tier.discount}% discount)`)
                await client.patch(existing._id).set(tier).commit()
            } else {
                console.log(`Creating tier: ${tier.label} (${tier.discount}% discount)`)
                await client.create(tier)
            }
        } catch (error) {
            console.error(`Error with tier ${tier.label}:`, error)
        }
    }
}

async function migrate() {
    console.log('='.repeat(60))
    console.log('GPU & Pricing Tier Migration v2')
    console.log('='.repeat(60))
    console.log(`Dataset: ${client.config().dataset}`)
    console.log('')
    console.log('Pricing sources (February 2026):')
    console.log('- AWS: Post mid-2025 price cuts (44% reduction on H100)')
    console.log('- GCP: cloud.google.com/compute/gpus-pricing')
    console.log('- CoreWeave: coreweave.com/pricing')
    console.log('- Lambda: lambda.ai/pricing')
    console.log('')
    console.log('Helios pricing (user specified):')
    console.log('- RTX 6000 Pro: $1.10 (36mo) / $1.70 (on-demand)')
    console.log('- B200: $3.10 (36mo) / $4.80 (on-demand)')
    console.log('')

    await cleanupDuplicates()
    await migrateGPUs()
    await migrateTiers()

    console.log('')
    console.log('='.repeat(60))
    console.log('Migration complete!')
    console.log('='.repeat(60))
}

migrate().catch(console.error)
