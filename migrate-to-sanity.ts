import { createClient } from '@sanity/client'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

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
    apiVersion: '2024-12-19',
})

const landingPageContent = {
    announcement: {
        _id: 'announcement-banner-default',
        _type: 'announcementBanner',
        title: 'Helios RFT now available!',
        description: 'Fine-tune open models that outperform frontier models.',
        ctaText: 'Try today',
        ctaLink: 'https://helios.ai/docs/rft',
        enabled: true
    },
    hero: {
        _id: 'hero-section-default',
        _type: 'heroSection',
        heading: 'Build. Tune. Scale.',
        description: 'Open-source AI models at blazing speed, optimized for your use case, scaled globally with the Helios Inference Cloud',
        primaryCtaText: 'Get Started',
        primaryCtaLink: 'https://helios.ai/signup',
        secondaryCtaText: 'Talk to Our Team',
        secondaryCtaLink: 'https://helios.ai/contact'
    },
    useCases: {
        _id: 'use-cases-section-default',
        _type: 'useCasesSection',
        sectionLabel: 'Helios AI Cloud',
        heading: 'What Can You Build',
        description: 'From experimentation to production — build your Generative AI capabilities at scale',
        useCases: [
            {
                _key: uuidv4(),
                icon: 'Code2',
                title: 'Code Assistance',
                description: 'IDE copilots, code generation, debugging agents',
                tag: 'DEV',
                stat: '10x',
                statLabel: 'faster coding'
            },
            {
                _key: uuidv4(),
                icon: 'MessageSquare',
                title: 'Conversational AI',
                description: 'Customer support bots, internal helpdesk assistants, multilingual chat',
                tag: 'CHAT',
                stat: '24/7',
                statLabel: 'availability'
            },
            {
                _key: uuidv4(),
                icon: 'Brain',
                title: 'Agentic Systems',
                description: 'Multi-step reasoning, planning, and execution pipelines',
                tag: 'AGENT',
                stat: '∞',
                statLabel: 'possibilities'
            },
            {
                _key: uuidv4(),
                icon: 'Search',
                title: 'Semantic Search',
                description: 'Enterprise assistants, summarization, and personalized recommendations',
                tag: 'FIND',
                stat: '0.1s',
                statLabel: 'latency'
            }
        ]
    },
    testimonials: {
        _id: 'testimonials-section-default',
        _type: 'testimonialsSection',
        sectionLabel: 'Customer Love',
        heading: 'What our customers are saying',
        testimonials: [
            {
                _key: uuidv4(),
                quote: "Helios has been a fantastic partner in building AI dev tools at Sourcegraph. Their fast, reliable model inference lets us focus on fine-tuning, AI-powered code search, and deep code context.",
                author: "Beyang Liu",
                role: "CTO",
                company: "Sourcegraph"
            },
            {
                _key: uuidv4(),
                quote: "By partnering with Helios to fine-tune models, we reduced latency from about 2 seconds to 350 milliseconds, significantly improving performance.",
                author: "Sarah Sachs",
                role: "AI Lead",
                company: "Notion"
            }
        ]
    },
    cta: {
        _id: 'cta-section-default',
        _type: 'ctaSection',
        heading: 'Start building today',
        description: 'Instantly run popular and specialized models.',
        primaryCtaText: 'Get Started',
        primaryCtaLink: 'https://helios.ai/signup',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: 'https://helios.ai/contact'
    },
    blogSection: {
        _id: 'blog-section-default',
        _type: 'blogSection',
        heading: 'Latest insights and updates',
        label: 'Blog'
    },
    homePage: {
        _id: 'home-page',
        _type: 'page',
        title: 'Home Page',
        slug: { _type: 'slug', current: 'home' },
        sections: [
            { _type: 'reference', _ref: 'hero-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'use-cases-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'testimonials-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'blog-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'cta-section-default', _key: uuidv4() }
        ]
    }
}

const blogData = {
    author: {
        _id: 'author-amol',
        _type: 'author',
        name: 'Amol Soans',
        slug: { _type: 'slug', current: 'amol-soans' },
        bio: 'Founding Engineer at Helios, focused on distributed systems and LLM inference optimization.'
    },
    category: {
        _id: 'category-announcement',
        _type: 'category',
        title: 'Announcement',
        slug: { _type: 'slug', current: 'announcement' }
    },
    posts: [
        {
            _id: 'post-1',
            _type: 'blogPost',
            title: 'Introducing Helios RFT: Fine-tune models at scale',
            slug: { _type: 'slug', current: 'introducing-helios-rft' },
            author: { _type: 'reference', _ref: 'author-amol' },
            publishedAt: new Date().toISOString(),
            excerpt: 'We are excited to launch Helios RFT, a new way to fine-tune open models that outperform frontier models on specialized tasks.',
            categories: [{ _type: 'reference', _ref: 'category-announcement', _key: uuidv4() }],
            body: [
                {
                    _type: 'block',
                    _key: uuidv4(),
                    style: 'normal',
                    children: [{ _type: 'span', _key: uuidv4(), text: 'Today we are announcing the general availability of Helios RFT (Re-Fine Tuning)...' }]
                },
                {
                    _type: 'block',
                    _key: uuidv4(),
                    style: 'h2',
                    children: [{ _type: 'span', _key: uuidv4(), text: 'Why Fine-Tuning Matters' }]
                },
                {
                    _type: 'block',
                    _key: uuidv4(),
                    style: 'normal',
                    children: [{ _type: 'span', _key: uuidv4(), text: 'General purpose models are great, but for specific business logic, fine-tuned smaller models often perform better and are much cheaper.' }]
                }
            ]
        },
        {
            _id: 'post-2',
            _type: 'blogPost',
            title: 'Optimizing Inference for Llama 3 70B',
            slug: { _type: 'slug', current: 'optimizing-llama-3-70b' },
            author: { _type: 'reference', _ref: 'author-amol' },
            publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            excerpt: 'Learn how we achieved 3x speedup on Llama 3 70B inference using our custom vLLM kernels and quantization techniques.',
            categories: [],
            body: [
                {
                    _type: 'block',
                    _key: uuidv4(),
                    style: 'normal',
                    children: [{ _type: 'span', _key: uuidv4(), text: 'Speed is the most critical factor for real-time AI agents. In this post, we dive into the technical details...' }]
                }
            ]
        }
    ]
}

async function migrate() {
    console.log('🚀 Starting content migration to Sanity...')

    try {
        const transaction = client.transaction()

        // 1. Landing Page Sections
        console.log('  Creating landing page sections...')
        transaction.createOrReplace(landingPageContent.announcement)
        transaction.createOrReplace(landingPageContent.hero)
        transaction.createOrReplace(landingPageContent.useCases)
        transaction.createOrReplace(landingPageContent.testimonials)
        transaction.createOrReplace(landingPageContent.cta)
        transaction.createOrReplace(landingPageContent.blogSection)
        transaction.createOrReplace(landingPageContent.homePage)

        // 2. Blog Data
        console.log('  Creating blog data...')
        transaction.createOrReplace(blogData.author)
        transaction.createOrReplace(blogData.category)
        blogData.posts.forEach(post => transaction.createOrReplace(post))

        const result = await transaction.commit()
        console.log('✅ Migration successful!', result)
        console.log('\nNext steps:')
        console.log('1. Run "npm run sanity" to visit the studio.')
        console.log('2. Verify the documents are correctly created.')
    } catch (err) {
        console.error('❌ Migration failed:', err)
    }
}

migrate()
