import { createClient } from '@sanity/client'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
    console.error('❌ Error: SANITY_WRITE_TOKEN is missing in .env.local')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-12-19',
})

const coreValueData = {
    _id: 'core-value-proposition-default',
    _type: 'coreValueProposition',
    heading: 'Why teams choose Helios',
    cards: [
        {
            _key: uuidv4(),
            title: 'Predictable costs',
            description: 'No surprise charges or hidden complexity. Designed for teams that are budget-conscious and serious about scale.',
        },
        {
            _key: uuidv4(),
            title: 'Inference-first by design',
            description: 'Optimized for production inference workloads today, with a clear path to training as your needs grow.',
        },
        {
            _key: uuidv4(),
            title: 'Simple by default',
            description: 'Deploy and manage GPUs through a clean, intuitive interface built for engineers who want to move fast.',
        },
    ],
}

async function migrate() {
    console.log('🚀 Migrating Core Value Proposition to Sanity...')

    try {
        // 1. Create or replace the core value proposition document
        await client.createOrReplace(coreValueData)
        console.log('✅ Created Core Value Proposition document')

        // 2. Add it to the home page sections if not already there
        const homePage = await client.getDocument('home-page')

        if (homePage) {
            const hasSection = homePage.sections?.some((s: any) => s._ref === coreValueData._id)

            if (!hasSection) {
                // Find index of lifecycle section to insert above it
                const lifecycleIndex = homePage.sections?.findIndex((s: any) => s._ref === 'lifecycle-section-default')

                const newSection = {
                    _type: 'reference',
                    _ref: coreValueData._id,
                    _key: uuidv4(),
                }

                const updatedSections = [...(homePage.sections || [])]
                if (lifecycleIndex !== -1) {
                    updatedSections.splice(lifecycleIndex, 0, newSection)
                } else {
                    updatedSections.push(newSection)
                }

                await client.patch('home-page')
                    .set({ sections: updatedSections })
                    .commit()

                console.log('✅ Added Core Value Proposition to Home Page sections')
            } else {
                console.log('ℹ️ Core Value Proposition already exists on Home Page')
            }
        } else {
            console.error('❌ Could not find home-page document')
        }

        console.log('🎉 Migration complete!')
    } catch (err) {
        console.error('❌ Migration failed:', err)
    }
}

migrate()
