import dotenv from 'dotenv'
import { createClient } from '@sanity/client'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN // Required for this script

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

// Model data updates
const modelUpdates = [
  {
    name: 'Meta Llama 3.1 8B Instruct',
    shortDescription: 'The Meta Llama 3.1 collection includes multilingual large language models optimized for dialogue use cases. The 8B instruction-tuned model excels in multilingual tasks, outperforming many open-source chat models on benchmarks like MMLU and MMLU-Pro, with strong performance in reasoning, coding, and tool use.',
    parameters: '8.0B parameters',
    huggingFaceUrl: 'https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct',
    inputPrice: 0.012,
    outputPrice: 0.018,
    modelType: 'LLM'
  },
  {
    name: 'Qwen2.5 7B Instruct',
    shortDescription: 'Qwen2.5-7B-Instruct is an advanced instruction-tuned model with enhanced capabilities in coding, mathematics, and multilingual dialogue. It supports long contexts up to 128K tokens, structured outputs, and tool use, achieving strong performance in benchmarks like HumanEval and multilingual MGSM.',
    parameters: '7.0B parameters',
    huggingFaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct',
    inputPrice: 0.024,
    outputPrice: 0.06,
    modelType: 'LLM'
  },
  {
    name: 'FLUX.1 dev',
    shortDescription: 'FLUX.1-dev is a high-quality text-to-image model that generates detailed, photorealistic images from prompts. It excels in prompt following and visual fidelity, licensed for non-commercial use, and part of Black Forest Labs\' series competing with models like Stable Diffusion.',
    parameters: '12.0B parameters',
    huggingFaceUrl: 'https://huggingface.co/blackforestlabs/FLUX.1-dev',
    imagePrice: 2.20,
    modelType: 'Image'
  },
  {
    name: 'Whisper Large v3',
    shortDescription: 'Whisper-large-v3 is a robust multilingual speech recognition model that transcribes audio to text with high accuracy (10.3% WER). It supports translation, language identification, and handles diverse accents, making it ideal for real-time applications.',
    parameters: '1.6B parameters',
    huggingFaceUrl: 'https://huggingface.co/openai/whisper-large-v3',
    inputPrice: 0.005,
    outputPrice: 0.01,
    modelType: 'Audio'
  },
  {
    name: 'CLIP ViT Large',
    shortDescription: 'CLIP is a vision-language model that learns joint representations of images and text for tasks like zero-shot classification and image-text matching. It predicts relevant text for images without task-specific training, achieving strong generalization.',
    parameters: '428M parameters',
    huggingFaceUrl: 'https://huggingface.co/openai/clip-vit-large-patch14',
    inputPrice: 0.005,
    outputPrice: 0,
    modelType: 'Vision'
  },
  {
    name: 'BGE Large English v1.5',
    shortDescription: 'BGE-large-en-v1.5 is a high-performance English embedding model for semantic search and retrieval, mapping text to 1024-dimensional vectors. It achieves top scores on benchmarks like MTEB (64.23 average), with improved similarity distribution for downstream NLP tasks.',
    parameters: '335M parameters',
    huggingFaceUrl: 'https://huggingface.co/BAAI/bge-large-en-v1.5',
    inputPrice: 0.006,
    outputPrice: 0,
    modelType: 'Embedding'
  },
  {
    name: 'MusicGen Small',
    shortDescription: 'MusicGen-small generates high-quality music from text descriptions or audio prompts using a 300M parameter model. It produces coherent audio at 32kHz with 4 codebooks, outperforming baselines in quality without semantic representations like MusicLM.',
    parameters: '300M parameters',
    huggingFaceUrl: 'https://huggingface.co/facebook/musicgen-small',
    inputPrice: 0.05,
    outputPrice: 0.10,
    modelType: 'Audio'
  }
]

async function updateModels() {
  console.log('🚀 Starting model data updates...')

  // First, let's see what models exist
  const existingModels = await client.fetch(`*[_type == "modelLibrary"]{name, _id}`)
  console.log('Existing models:', existingModels.map(m => m.name))

  // Map our updates to existing models by partial name matching
  const nameMappings = {
    'Meta Llama 3.1 8B Instruct': 'Llama 3 70B Instruct', // Update to match existing
    'Qwen2.5 7B Instruct': 'Kimi K2 Instruct', // Update existing model
    'FLUX.1 dev': 'FLUX.1 Kontext Pro',
    'Whisper Large v3': 'Whisper V3 Large',
    'CLIP ViT Large': 'CLIP ViT Large', // May need to add if not exists
    'BGE Large English v1.5': 'BGE M3', // Update existing
    'MusicGen Small': 'MusicGen Small' // May need to add
  }

  const updatedModelUpdates = modelUpdates.map(update => ({
    ...update,
    targetName: nameMappings[update.name] || update.name
  }))

  for (const modelData of updatedModelUpdates) {
    try {
      // Find existing model by name
      const existingModel = await client.fetch(
        `*[_type == "modelLibrary" && name == $name][0]`,
        { name: modelData.targetName }
      )

      if (existingModel) {
        // Update existing model
        await client
          .patch(existingModel._id)
          .set({
            shortDescription: modelData.shortDescription,
            parameters: modelData.parameters,
            huggingFaceUrl: modelData.huggingFaceUrl,
            inputPrice: modelData.inputPrice,
            outputPrice: modelData.outputPrice,
            imagePrice: modelData.imagePrice
          })
          .commit()

        console.log(`✅ Updated ${modelData.targetName}`)
      } else {
        // Create new model if it doesn't exist
        const newModel = {
          _type: 'modelLibrary',
          name: modelData.name,
          slug: { _type: 'slug', current: modelData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
          provider: modelData.name.split(' ')[0], // Extract provider from name
          shortDescription: modelData.shortDescription,
          parameters: modelData.parameters,
          huggingFaceUrl: modelData.huggingFaceUrl,
          modelType: modelData.modelType,
          inputPrice: modelData.inputPrice,
          outputPrice: modelData.outputPrice,
          imagePrice: modelData.imagePrice,
          categories: ['featured'] // Add to featured by default
        }

        await client.create(newModel)
        console.log(`✅ Created new model ${modelData.name}`)
      }
    } catch (error) {
      console.error(`❌ Error processing ${modelData.name}:`, error)
    }
  }

  console.log('✅ Model updates completed!')
}

// Run the update
updateModels().catch(console.error)