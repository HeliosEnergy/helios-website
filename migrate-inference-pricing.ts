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

interface InferencePricingModel {
    _type: 'inferencePricing'
    id: string
    name: string
    provider: string
    category: 'text' | 'code' | 'vision' | 'embedding'
    contextWindow: string
    inputPricePerMillion: number
    outputPricePerMillion: number
    featured: boolean
    displayOrder: number
}

// Competitive pricing based on market rates (slightly below major providers)
const inferencePricingModels: InferencePricingModel[] = [
    // Featured Text Models
    {
        _type: 'inferencePricing',
        id: 'llama-3.3-70b',
        name: 'Llama 3.3 70B Instruct',
        provider: 'Meta',
        category: 'text',
        contextWindow: '128K',
        inputPricePerMillion: 0.35,
        outputPricePerMillion: 0.40,
        featured: true,
        displayOrder: 1,
    },
    {
        _type: 'inferencePricing',
        id: 'qwen-2.5-72b',
        name: 'Qwen 2.5 72B Instruct',
        provider: 'Alibaba',
        category: 'text',
        contextWindow: '128K',
        inputPricePerMillion: 0.35,
        outputPricePerMillion: 0.40,
        featured: true,
        displayOrder: 2,
    },
    {
        _type: 'inferencePricing',
        id: 'deepseek-v3',
        name: 'DeepSeek V3',
        provider: 'DeepSeek',
        category: 'text',
        contextWindow: '64K',
        inputPricePerMillion: 0.14,
        outputPricePerMillion: 0.28,
        featured: true,
        displayOrder: 3,
    },
    // More Text Models
    {
        _type: 'inferencePricing',
        id: 'llama-3.1-8b',
        name: 'Llama 3.1 8B Instruct',
        provider: 'Meta',
        category: 'text',
        contextWindow: '128K',
        inputPricePerMillion: 0.05,
        outputPricePerMillion: 0.08,
        featured: false,
        displayOrder: 4,
    },
    {
        _type: 'inferencePricing',
        id: 'mistral-7b',
        name: 'Mistral 7B Instruct',
        provider: 'Mistral AI',
        category: 'text',
        contextWindow: '32K',
        inputPricePerMillion: 0.05,
        outputPricePerMillion: 0.08,
        featured: false,
        displayOrder: 5,
    },
    {
        _type: 'inferencePricing',
        id: 'mixtral-8x7b',
        name: 'Mixtral 8x7B Instruct',
        provider: 'Mistral AI',
        category: 'text',
        contextWindow: '32K',
        inputPricePerMillion: 0.24,
        outputPricePerMillion: 0.24,
        featured: false,
        displayOrder: 6,
    },
    // Code Models
    {
        _type: 'inferencePricing',
        id: 'codellama-70b',
        name: 'Code Llama 70B',
        provider: 'Meta',
        category: 'code',
        contextWindow: '16K',
        inputPricePerMillion: 0.35,
        outputPricePerMillion: 0.40,
        featured: false,
        displayOrder: 10,
    },
    {
        _type: 'inferencePricing',
        id: 'deepseek-coder-33b',
        name: 'DeepSeek Coder 33B',
        provider: 'DeepSeek',
        category: 'code',
        contextWindow: '16K',
        inputPricePerMillion: 0.15,
        outputPricePerMillion: 0.20,
        featured: false,
        displayOrder: 11,
    },
    // Vision Models
    {
        _type: 'inferencePricing',
        id: 'llama-3.2-90b-vision',
        name: 'Llama 3.2 90B Vision',
        provider: 'Meta',
        category: 'vision',
        contextWindow: '128K',
        inputPricePerMillion: 0.90,
        outputPricePerMillion: 0.90,
        featured: true,
        displayOrder: 20,
    },
    {
        _type: 'inferencePricing',
        id: 'qwen-2-vl-72b',
        name: 'Qwen 2 VL 72B',
        provider: 'Alibaba',
        category: 'vision',
        contextWindow: '32K',
        inputPricePerMillion: 0.80,
        outputPricePerMillion: 0.80,
        featured: false,
        displayOrder: 21,
    },
    // Embedding Models
    {
        _type: 'inferencePricing',
        id: 'nomic-embed-text',
        name: 'Nomic Embed Text v1.5',
        provider: 'Nomic',
        category: 'embedding',
        contextWindow: '8K',
        inputPricePerMillion: 0.008,
        outputPricePerMillion: 0,
        featured: false,
        displayOrder: 30,
    },
    {
        _type: 'inferencePricing',
        id: 'bge-large',
        name: 'BGE Large EN v1.5',
        provider: 'BAAI',
        category: 'embedding',
        contextWindow: '512',
        inputPricePerMillion: 0.005,
        outputPricePerMillion: 0,
        featured: false,
        displayOrder: 31,
    },
]

async function migrate() {
    console.log('Starting inference pricing migration...')
    console.log(`Dataset: ${client.config().dataset}`)

    for (const model of inferencePricingModels) {
        try {
            // Check if model already exists
            const existing = await client.fetch(
                `*[_type == "inferencePricing" && id == $id][0]`,
                { id: model.id }
            )

            if (existing) {
                console.log(`Updating existing model: ${model.name}`)
                await client.patch(existing._id).set(model).commit()
            } else {
                console.log(`Creating new model: ${model.name}`)
                await client.create(model)
            }
        } catch (error) {
            console.error(`Error with model ${model.name}:`, error)
        }
    }

    console.log('Migration complete!')
}

migrate().catch(console.error)
