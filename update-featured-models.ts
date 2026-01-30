import dotenv from 'dotenv'
import { createClient } from '@sanity/client'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
    console.error('❌ Error: SANITY_WRITE_TOKEN is missing in .env.local')
    console.log('Please get a write token from https://www.sanity.io/manage and add it to .env.local as SANITY_WRITE_TOKEN=xxx')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-01-01'
})

// Featured model pricing updates from Sri's list
const featuredModels = [
  {
    name: 'Whisper Faster',
    pricingDisplay: '$0.00034/s',
    modelType: 'Audio',
    provider: 'OpenAI',
    shortDescription: 'Optimized Whisper variant for ultra-fast speech-to-text transcription with reduced latency. Ideal for real-time applications requiring immediate audio processing.',
  },
  {
    name: 'FLUX.1 dev',
    pricingDisplay: '$0.00034/s',
    modelType: 'Image',
    provider: 'Black Forest Labs',
    shortDescription: 'High-quality text-to-image model that generates detailed, photorealistic images from prompts with exceptional visual fidelity.',
  },
  {
    name: 'Qwen3 VL',
    pricingDisplay: '$0.00116/s',
    modelType: 'Vision-Language',
    provider: 'Qwen',
    shortDescription: 'Advanced vision-language model for multimodal understanding, combining visual recognition with natural language processing.',
  },
  {
    name: 'Bark',
    pricingDisplay: '$0.00031/s',
    modelType: 'Audio',
    provider: 'Suno',
    shortDescription: 'Text-prompted generative audio model for creating realistic speech and sound effects with voice cloning capabilities.',
  },
  {
    name: 'Whisper Large v3',
    pricingDisplay: '$0.0005/s',
    modelType: 'Audio',
    provider: 'OpenAI',
    shortDescription: 'Robust multilingual speech recognition model that transcribes audio to text with high accuracy across diverse accents and languages.',
  },
  // Add a 6th model if needed - placeholder
  {
    name: 'Meta Llama 3.1 8B Instruct',
    pricingDisplay: '$0.012/M · $0.018/M',
    inputPrice: 0.012,
    outputPrice: 0.018,
    modelType: 'LLM',
    provider: 'Meta',
    shortDescription: 'Efficient instruction-tuned language model excelling in multilingual tasks, reasoning, and dialogue with strong benchmark performance.',
  }
]

async function updateFeaturedModels() {
  console.log('🚀 Starting featured models update...')

  for (const modelData of featuredModels) {
    try {
      // Find existing model by name (partial match)
      const existingModel = await client.fetch(
        `*[_type == "modelLibrary" && name match $name][0]`,
        { name: `*${modelData.name}*` }
      )

      if (existingModel) {
        // Update existing model
        const updates: any = {
          pricingDisplay: modelData.pricingDisplay,
          modelType: modelData.modelType,
          provider: modelData.provider,
          shortDescription: modelData.shortDescription,
        }

        // Add inputPrice/outputPrice if available
        if (modelData.inputPrice !== undefined) {
          updates.inputPrice = modelData.inputPrice
        }
        if (modelData.outputPrice !== undefined) {
          updates.outputPrice = modelData.outputPrice
        }

        await client
          .patch(existingModel._id)
          .set(updates)
          .commit()

        console.log(`✅ Updated ${modelData.name} (matched: ${existingModel.name})`)
      } else {
        // Create new model if it doesn't exist
        const newModel: any = {
          _type: 'modelLibrary',
          name: modelData.name,
          slug: {
            _type: 'slug',
            current: modelData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          },
          provider: modelData.provider,
          shortDescription: modelData.shortDescription,
          modelType: modelData.modelType,
          pricingDisplay: modelData.pricingDisplay,
          categories: ['featured']
        }

        if (modelData.inputPrice !== undefined) {
          newModel.inputPrice = modelData.inputPrice
        }
        if (modelData.outputPrice !== undefined) {
          newModel.outputPrice = modelData.outputPrice
        }

        await client.create(newModel)
        console.log(`✅ Created new model ${modelData.name}`)
      }
    } catch (error) {
      console.error(`❌ Error processing ${modelData.name}:`, error)
    }
  }

  console.log('✅ Featured models update completed!')
}

// Run the update
updateFeaturedModels().catch(console.error)
