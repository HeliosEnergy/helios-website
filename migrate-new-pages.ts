import { createClient } from '@sanity/client'
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

const content = {
    careers: {
        _id: 'careers-page-default',
        _type: 'careersPage',
        headline: 'Build Helios with us.',
        intro: 'We’re a team of builders, designers, and systems thinkers. At Helios, we’re focused on one thing: making high-performance compute accessible and simple. If you care about craft and performance, we\'d love to meet you.',
        ctaText: 'Join the team.',
        openPositions: []
    },
    contact: {
        _id: 'contact-page-default',
        _type: 'contactPage',
        headline: 'Get in touch.',
        intro: 'Have a technical question, a partnership idea, or just want to see what we\'re building? Send us a message and we\'ll get back to you shortly.',
        formLabels: {
            name: 'Your Name',
            email: 'Email Address',
            inquiry: 'What\'s on your mind?',
            message: 'How can we help?'
        }
    },
    press: {
        _id: 'press-page-default',
        _type: 'pressPage',
        headline: 'News & Updates.',
        intro: 'The latest stories, product launches, and milestones from the Helios team.',
        releases: []
    },
    events: {
        _id: 'events-page-default',
        _type: 'eventsPage',
        headline: 'Community & Events.',
        intro: 'We’re active in the developer community. Join us at upcoming hackathons, technical conferences, and meetups.',
        events: []
    }
}

async function migrate() {
    console.log('🚀 Starting new pages content migration...')
    try {
        const transaction = client.transaction()
        transaction.createOrReplace(content.careers)
        transaction.createOrReplace(content.contact)
        transaction.createOrReplace(content.press)
        transaction.createOrReplace(content.events)
        const result = await transaction.commit()
        console.log('✅ Migration successful!', result)
    } catch (err) {
        console.error('❌ Migration failed:', err)
    }
}

migrate()
