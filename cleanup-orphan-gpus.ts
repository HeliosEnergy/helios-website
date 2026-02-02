import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    token: process.env.SANITY_WRITE_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

// Expected GPU IDs (the ones we want to keep)
const expectedGpuIds = [
    'rtx-6000-pro',
    'b200',
    'h100-sxm',
    'h100-nvl',
    'a100-80gb',
    'a100-40gb',
    'l40s',
    'rtx-a6000',
    'rtx-4090'
]

async function cleanup() {
    console.log('Cleaning up orphan GPU documents...')

    const allGpus = await client.fetch(`*[_type == "gpuModel"]{ _id, id, name }`)
    console.log('Current GPUs:', allGpus.map((g: { id: string }) => g.id).join(', '))

    for (const gpu of allGpus) {
        if (!expectedGpuIds.includes(gpu.id)) {
            console.log(`Deleting orphan GPU: "${gpu.id}" (${gpu._id})`)
            await client.delete(gpu._id)
        }
    }

    const remaining = await client.fetch(`*[_type == "gpuModel"]{ _id, id, name } | order(displayOrder asc)`)
    console.log('\nRemaining GPUs:', remaining.map((g: { id: string }) => g.id).join(', '))
    console.log('Count:', remaining.length)
}

cleanup().catch(console.error)
