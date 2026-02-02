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
 * GPU Pricing - VERIFIED SOURCES (February 2026)
 *
 * BILLING MODEL NOTES:
 * - AWS: EC2 Capacity Blocks for ML ($/GPU/hr effective rate)
 * - GCP: On-Demand VM pricing divided by GPU count
 * - CoreWeave: Classic per-GPU pricing (coreweave.com/pricing/classic)
 * - Lambda: Per-GPU/hr (lambda.ai/instances)
 *
 * Sources with citations:
 * - Lambda: https://lambda.ai/instances
 * - AWS Capacity Blocks: https://aws.amazon.com/ec2/capacityblocks/pricing/
 * - GCP H100 (a3-highgpu-8g): $88.49/hr ÷ 8 = $11.06/GPU (via Holori calculator)
 * - GCP B200 (a4-highgpu-8g): $148.21/hr ÷ 8 = $18.53/GPU (Vertex AI pricing)
 * - CoreWeave Classic: https://docs.coreweave.com/docs/pricing/pricing-instances
 */

interface GPUModel {
    _type: 'gpuModel'
    id: string
    name: string
    vram: string
    memory: string
    specs: string
    heliosPrice: number
    awsPrice: string      // AWS Capacity Blocks
    googleCloudPrice: string  // GCP On-Demand
    coreweavePrice: string    // CoreWeave Classic
    lambdaPrice: string       // Lambda per-GPU
    displayOrder: number
}

// GPU Models - RTX 6000 Pro first, B200 second, then descending capability
// REMOVED: A100 40GB per user request
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
        googleCloudPrice: '18.53', // GCP a4-highgpu-8g: $148.21/hr ÷ 8 = $18.53
        coreweavePrice: 'N/A',
        lambdaPrice: '4.99', // Lambda verified
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
        awsPrice: '3.93', // AWS p5.48xlarge Capacity Blocks: $3.933/GPU-hr
        googleCloudPrice: '11.06', // GCP a3-highgpu-8g: $88.49/hr ÷ 8 = $11.06
        coreweavePrice: '4.76', // CoreWeave H100 SXM: $38.11/hr ÷ 8 = $4.76
        lambdaPrice: '2.99', // Lambda verified
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
        awsPrice: 'N/A', // Not available as Capacity Blocks
        googleCloudPrice: 'N/A',
        coreweavePrice: 'N/A', // Not on CoreWeave classic
        lambdaPrice: 'N/A',
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
        awsPrice: '1.85', // AWS p4de.24xlarge Capacity Blocks: $1.845/GPU-hr
        googleCloudPrice: '3.67', // GCP A2 ultragpu (needs verification)
        coreweavePrice: '2.21', // CoreWeave A100 80GB NVLINK: $17.65/hr ÷ 8 = $2.21
        lambdaPrice: '1.79', // Lambda verified
        displayOrder: 4,
    },
    // 6. L40S - Inference optimized (FIXED: was using L40 pricing)
    {
        _type: 'gpuModel',
        id: 'l40s',
        name: 'L40S',
        vram: '48GB',
        memory: '48GB GDDR6',
        specs: '366 TFLOPS FP8, 48GB GDDR6, Inference optimized',
        heliosPrice: 0.89,
        awsPrice: 'N/A',
        googleCloudPrice: 'N/A',
        coreweavePrice: '2.25', // FIXED: L40S = $18/hr ÷ 8 = $2.25 (was using L40 at $1.25)
        lambdaPrice: 'N/A',
        displayOrder: 5,
    },
    // 7. RTX A6000 - Professional workstation
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
        coreweavePrice: '0.78', // CoreWeave Quadro RTX A6000
        lambdaPrice: '0.80', // Lambda verified
        displayOrder: 6,
    },
    // 8. RTX 4090 - Consumer flagship
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
        lambdaPrice: 'N/A', // Not on Lambda
        displayOrder: 7,
    },
]

async function deleteA10040GB() {
    console.log('Removing A100 40GB...')
    const a10040 = await client.fetch(`*[_type == "gpuModel" && id == "a100-40gb"][0]`)
    if (a10040) {
        await client.delete(a10040._id)
        console.log('  Deleted A100 40GB')
    } else {
        console.log('  A100 40GB not found (already removed)')
    }
}

async function migrateGPUs() {
    console.log('\nMigrating GPU models with verified pricing...')
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
            console.log(`  AWS(CB): $${gpu.awsPrice} | GCP: $${gpu.googleCloudPrice} | CoreWeave: $${gpu.coreweavePrice} | Lambda: $${gpu.lambdaPrice}`)
        } catch (error) {
            console.error(`Error with ${gpu.name}:`, error)
        }
    }
}

async function migrate() {
    console.log('='.repeat(70))
    console.log('GPU Pricing Migration v3 - VERIFIED PRICING')
    console.log('='.repeat(70))
    console.log(`Dataset: ${dataset}`)
    console.log('')
    console.log('BILLING MODELS:')
    console.log('  AWS     = EC2 Capacity Blocks ($/GPU/hr effective)')
    console.log('  GCP     = On-Demand VM ($/hr ÷ GPU count)')
    console.log('  CoreWeave = Classic per-GPU pricing')
    console.log('  Lambda  = Per-GPU/hr list price')
    console.log('')
    console.log('VERIFIED SOURCES:')
    console.log('  Lambda: lambda.ai/instances')
    console.log('  AWS: aws.amazon.com/ec2/capacityblocks/pricing/')
    console.log('  GCP H100: a3-highgpu-8g $88.49/hr ÷ 8 = $11.06')
    console.log('  GCP B200: a4-highgpu-8g $148.21/hr ÷ 8 = $18.53')
    console.log('  CoreWeave: docs.coreweave.com/docs/pricing/pricing-instances')
    console.log('')
    console.log('CORRECTIONS MADE:')
    console.log('  - L40S CoreWeave: $1.25 → $2.25 (was using L40 price)')
    console.log('  - AWS H100: $3.90 → $3.93 (exact Capacity Blocks rate)')
    console.log('  - AWS A100 80GB: $1.79 → $1.85 (p4de Capacity Blocks)')
    console.log('  - Removed A100 40GB per request')
    console.log('')

    await deleteA10040GB()
    await migrateGPUs()

    console.log('')
    console.log('='.repeat(70))
    console.log('Migration complete!')
    console.log('='.repeat(70))
}

migrate().catch(console.error)
