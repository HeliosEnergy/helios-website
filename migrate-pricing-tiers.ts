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

// 6 pricing tiers: On-demand + 1, 3, 6, 12, 24, 36 months
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
        discount: 25,
        featured: true,
        description: 'Annual commitment with significant savings. Most popular choice.',
        displayOrder: 4,
    },
    {
        _type: 'pricingTier',
        id: '24-month',
        label: '24 Months',
        duration: '2-year commitment',
        discount: 35,
        featured: false,
        description: 'Long-term commitment for enterprise planning.',
        displayOrder: 5,
    },
    {
        _type: 'pricingTier',
        id: '36-month',
        label: '36 Months',
        duration: '3-year commitment',
        discount: 45,
        featured: false,
        description: 'Maximum savings for strategic infrastructure investments.',
        displayOrder: 6,
    },
]

async function migrate() {
    console.log('Starting pricing tiers migration...')
    console.log(`Dataset: ${client.config().dataset}`)

    for (const tier of pricingTiers) {
        try {
            // Check if tier already exists
            const existing = await client.fetch(
                `*[_type == "pricingTier" && id == $id][0]`,
                { id: tier.id }
            )

            if (existing) {
                console.log(`Updating existing tier: ${tier.label}`)
                await client.patch(existing._id).set(tier).commit()
            } else {
                console.log(`Creating new tier: ${tier.label}`)
                await client.create(tier)
            }
        } catch (error) {
            console.error(`Error with tier ${tier.label}:`, error)
        }
    }

    console.log('Migration complete!')
}

migrate().catch(console.error)
