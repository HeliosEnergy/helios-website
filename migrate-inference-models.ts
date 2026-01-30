import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
    console.error('Error: SANITY_WRITE_TOKEN is missing in .env.local')
    console.log('Please get a write token from https://www.sanity.io/manage and add it to .env.local as SANITY_WRITE_TOKEN=xxx')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-12-19',
})

// Inference models with pricing based on RTX 6000 Pro benchmarks
// Prices are per second of GPU runtime
const inferenceModels = [
    {
        _id: 'inference-whisper-faster',
        _type: 'inferenceModel',
        id: 'whisper-faster',
        name: 'Whisper Faster',
        category: 'audio-input',
        pricePerSecond: 0.00004, // Per second of audio processed (50-60x realtime factor)
        estimationUnit: 'voice-mins',
        description: 'Optimized speech-to-text with 50-60x realtime speed. Processes 1 hour of audio in ~1 minute.',
        provider: 'SYSTRAN',
        displayOrder: 0
    },
    {
        _id: 'inference-whisper-large',
        _type: 'inferenceModel',
        id: 'whisper-large',
        name: 'Whisper Large V3',
        category: 'audio-input',
        pricePerSecond: 0.00006, // Per second of audio processed (25-30x realtime factor)
        estimationUnit: 'voice-mins',
        description: 'OpenAI Whisper Large v3 for high-accuracy transcription. Best-in-class accuracy for difficult audio.',
        provider: 'OpenAI',
        displayOrder: 1
    },
    {
        _id: 'inference-flux',
        _type: 'inferenceModel',
        id: 'flux',
        name: 'Flux.1',
        category: 'image',
        pricePerSecond: 0.008, // Per image (approximately 5 seconds GPU time)
        estimationUnit: 'images',
        description: 'State-of-the-art image generation from Black Forest Labs. 1024x1024 images in ~5 seconds.',
        provider: 'Black Forest Labs',
        displayOrder: 2
    },
    {
        _id: 'inference-bark',
        _type: 'inferenceModel',
        id: 'bark',
        name: 'Bark',
        category: 'audio-output',
        pricePerSecond: 0.0012, // Per second of generated audio (1x realtime)
        estimationUnit: 'voice-mins',
        description: 'High-quality text-to-speech with natural prosody and emotion. Supports multiple voices and languages.',
        provider: 'Suno',
        displayOrder: 3
    },
    {
        _id: 'inference-qwen3-vl',
        _type: 'inferenceModel',
        id: 'qwen3-vl',
        name: 'Qwen3 VL',
        category: 'vision',
        pricePerSecond: 0.00004, // Per token (approximately 40-60 tokens/second)
        estimationUnit: 'video-mins',
        description: 'Vision-language model for video understanding and analysis. Processes video frames with natural language.',
        provider: 'Alibaba',
        displayOrder: 4
    }
]

async function migrateInferenceModels() {
    console.log('Starting inference models migration...')

    try {
        const transaction = client.transaction()

        console.log('  Creating inference models...')
        inferenceModels.forEach(model => {
            console.log(`    - ${model.name} ($${model.pricePerSecond}/${model.estimationUnit === 'images' ? 'image' : 's'})`)
            transaction.createOrReplace(model)
        })

        const result = await transaction.commit()
        console.log('Migration successful!', result)
        console.log('\nInference models added:')
        inferenceModels.forEach(m => {
            console.log(`  - ${m.name} (${m.category}): $${m.pricePerSecond}/${m.estimationUnit}`)
        })
    } catch (err) {
        console.error('Migration failed:', err)
    }
}

migrateInferenceModels()
