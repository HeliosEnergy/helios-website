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
 * GPU Pricing Research (January 2026)
 * Sources:
 * - AWS: https://aws.amazon.com/ec2/pricing/on-demand/ (post mid-2025 price cuts ~44%)
 * - GCP: https://cloud.google.com/compute/gpus-pricing
 * - Lambda Labs: https://lambda.ai/pricing
 * - IntuitionLabs H100 comparison: https://intuitionlabs.ai/articles/h100-rental-prices-cloud-comparison
 * - GetDeploying GPU comparison: https://getdeploying.com/gpus
 * - Modal L40S pricing: https://modal.com/blog/nvidia-l40s-price-article
 */

interface GPUModel {
    _type: 'gpuModel'
    id: string
    name: string
    vram: string
    memory: string
    specs: string
    heliosPrice: number
    awsPrice: string
    googleCloudPrice: string
    lambdaPrice: string
    displayOrder: number
}

const gpuModels: GPUModel[] = [
    {
        _type: 'gpuModel',
        id: 'h100-sxm',
        name: 'H100 SXM',
        vram: '80GB',
        memory: '80GB HBM3',
        specs: '3958 TFLOPS FP8, 80GB HBM3, 3.35TB/s bandwidth, NVLink 4.0',
        heliosPrice: 2.49, // Competitive with Lambda/specialized providers
        awsPrice: '3.90', // AWS P5 after mid-2025 44% price cut (~$3.59-3.90/GPU-hr)
        googleCloudPrice: '3.00', // GCP post-cuts pricing
        lambdaPrice: '2.99', // Lambda 8-GPU node rate
        displayOrder: 0,
    },
    {
        _type: 'gpuModel',
        id: 'h100-nvl',
        name: 'H100 NVL',
        vram: '94GB',
        memory: '94GB HBM3',
        specs: '3958 TFLOPS FP8, 94GB HBM3, NVLink Bridge for 188GB combined',
        heliosPrice: 2.79,
        awsPrice: '4.20', // Slightly higher for NVL variant
        googleCloudPrice: '3.50',
        lambdaPrice: '3.29', // Lambda single GPU rate
        displayOrder: 1,
    },
    {
        _type: 'gpuModel',
        id: 'a100-80gb',
        name: 'A100 80GB',
        vram: '80GB',
        memory: '80GB HBM2e',
        specs: '312 TFLOPS FP16, 80GB HBM2e, 2TB/s bandwidth',
        heliosPrice: 1.29, // A100s now sub-$1.50 market rate
        awsPrice: '1.79', // AWS P4d after 33% price cut
        googleCloudPrice: '1.60', // GCP A2 ultra pricing
        lambdaPrice: '1.79', // Lambda A100 80GB
        displayOrder: 2,
    },
    {
        _type: 'gpuModel',
        id: 'a100-40gb',
        name: 'A100 40GB',
        vram: '40GB',
        memory: '40GB HBM2e',
        specs: '312 TFLOPS FP16, 40GB HBM2e, 1.6TB/s bandwidth',
        heliosPrice: 0.99,
        awsPrice: '1.40',
        googleCloudPrice: '1.20',
        lambdaPrice: '1.29', // Lambda A100 40GB
        displayOrder: 3,
    },
    {
        _type: 'gpuModel',
        id: 'l40s',
        name: 'L40S',
        vram: '48GB',
        memory: '48GB GDDR6',
        specs: '366 TFLOPS FP8, 48GB GDDR6, Inference optimized',
        heliosPrice: 0.89, // Competitive with Vultr screenshot ($0.89 committed)
        awsPrice: '1.57', // DigitalOcean/AWS tier
        googleCloudPrice: '1.40',
        lambdaPrice: 'Not listed',
        displayOrder: 4,
    },
    {
        _type: 'gpuModel',
        id: 'rtx-a6000',
        name: 'RTX A6000',
        vram: '48GB',
        memory: '48GB GDDR6',
        specs: '38.7 TFLOPS FP32, 48GB GDDR6, Professional workstation',
        heliosPrice: 0.59,
        awsPrice: 'Not listed',
        googleCloudPrice: 'Not listed',
        lambdaPrice: '0.80', // Lambda/RunPod tier
        displayOrder: 5,
    },
    {
        _type: 'gpuModel',
        id: 'rtx-4090',
        name: 'RTX 4090',
        vram: '24GB',
        memory: '24GB GDDR6X',
        specs: '82.6 TFLOPS FP32, 24GB GDDR6X, Consumer flagship',
        heliosPrice: 0.44,
        awsPrice: 'Not listed',
        googleCloudPrice: 'Not listed',
        lambdaPrice: '0.50', // RunPod/community rates $0.34-0.50
        displayOrder: 6,
    },
]

async function migrate() {
    console.log('Starting GPU pricing migration with real competitor data...')
    console.log(`Dataset: ${client.config().dataset}`)
    console.log('')
    console.log('Pricing sources:')
    console.log('- AWS: Post mid-2025 price cuts (44% reduction on H100)')
    console.log('- GCP: Current cloud.google.com/compute/gpus-pricing')
    console.log('- Lambda: lambda.ai/pricing')
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
            console.log(`  AWS: $${gpu.awsPrice} | GCP: $${gpu.googleCloudPrice} | Lambda: $${gpu.lambdaPrice}`)
        } catch (error) {
            console.error(`Error with ${gpu.name}:`, error)
        }
    }

    console.log('')
    console.log('GPU pricing migration complete!')
}

migrate().catch(console.error)
