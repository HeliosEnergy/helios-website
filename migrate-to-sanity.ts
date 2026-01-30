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
        ctaLink: 'https://heliosenergy.io/docs',
        enabled: true
    },
    hero: {
        _id: 'hero-section-default',
        _type: 'heroSection',
        heading: 'Build. Tune. Scale.',
        description: 'Open-source AI models at blazing speed, optimized for your use case, scaled globally with the Helios Inference Cloud',
        primaryCtaText: 'Get Started',
        primaryCtaLink: 'https://console.heliosenergy.io/login?tab=signup',
        secondaryCtaText: 'Talk to Our Team',
        secondaryCtaLink: '/contact'
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
        primaryCtaLink: 'https://console.heliosenergy.io/login?tab=signup',
        secondaryCtaText: 'Talk to an Expert',
        secondaryCtaLink: '/contact'
    },
    blogSection: {
        _id: 'blog-section-default',
        _type: 'blogSection',
        heading: 'Latest insights and updates',
        label: 'Blog'
    },
    logoBar: {
        _id: 'logo-bar-default',
        _type: 'logoBar',
        title: 'Customer Logos',
        logos: ["Uber", "DoorDash", "Notion", "GitLab", "Upwork", "HubSpot", "Cursor", "Samsung", "Verizon", "Quora"]
    },
    modelLibrary: [
        {
            _id: 'model-deepseek-r1',
            _type: 'modelLibrary',
            name: 'Deepseek R1',
            slug: { _type: 'slug', current: 'deepseek-r1' },
            provider: 'DeepSeek',
            description: 'Advanced reasoning model with exceptional performance on complex tasks',
            iconFilename: 'deepseek-color.png',
            modelType: 'LLM',
            categories: ['featured', 'serverless'],
            inputPrice: 1.35,
            outputPrice: 5.4,
            pricingDisplay: '$1.35/M Input • $5.4/M Output',
            contextWindow: '163840',
            color: 'bg-blue-500',
            initial: 'D'
        },
        {
            _id: 'model-llama-3-70b',
            _type: 'modelLibrary',
            name: 'Llama 3 70B Instruct',
            slug: { _type: 'slug', current: 'llama-3-70b-instruct' },
            provider: 'Meta',
            description: 'Meta\'s flagship open-source language model',
            iconFilename: 'llamaindex.png',
            modelType: 'LLM',
            categories: ['featured', 'serverless'],
            inputPrice: 0.9,
            pricingDisplay: '$0.9/M Tokens',
            contextWindow: '8192',
            color: 'bg-blue-600',
            initial: 'M'
        },
        {
            _id: 'model-gemma-3-27b',
            _type: 'modelLibrary',
            name: 'Gemma 3 27B Instruct',
            slug: { _type: 'slug', current: 'gemma-3-27b-instruct' },
            provider: 'Google',
            description: 'Google\'s efficient instruction-tuned model',
            iconFilename: 'gemini-color.png',
            modelType: 'LLM',
            categories: ['featured'],
            inputPrice: 0.9,
            pricingDisplay: '$0.9/M Tokens',
            contextWindow: '131072',
            color: 'bg-red-500',
            initial: 'G'
        },
        {
            _id: 'model-flux-kontext-pro',
            _type: 'modelLibrary',
            name: 'FLUX.1 Kontext Pro',
            slug: { _type: 'slug', current: 'flux-1-kontext-pro' },
            provider: 'Flux',
            description: 'State-of-the-art image generation model',
            iconFilename: 'flux.png',
            modelType: 'Image',
            categories: ['featured'],
            imagePrice: 0.04,
            pricingDisplay: '$0.04/Image',
            color: 'bg-gray-800',
            initial: 'F'
        },
        {
            _id: 'model-whisper-v3',
            _type: 'modelLibrary',
            name: 'Whisper V3 Large',
            slug: { _type: 'slug', current: 'whisper-v3-large' },
            provider: 'OpenAI',
            description: 'Advanced speech recognition and transcription',
            iconFilename: 'openai (1).png',
            modelType: 'Audio',
            categories: ['featured'],
            inputPrice: 0,
            pricingDisplay: '$0/M Tokens',
            color: 'bg-emerald-600',
            initial: 'O'
        },
        {
            _id: 'model-kimi-k2',
            _type: 'modelLibrary',
            name: 'Kimi K2 Instruct',
            slug: { _type: 'slug', current: 'kimi-k2-instruct' },
            provider: 'Moonshot',
            description: 'Long-context language model from Moonshot AI',
            iconFilename: 'kimi-color.png',
            modelType: 'LLM',
            categories: ['featured', 'serverless'],
            inputPrice: 0.6,
            outputPrice: 2.5,
            pricingDisplay: '$0.6/M Input • $2.5/M Output',
            contextWindow: '131072',
            color: 'bg-purple-500',
            initial: 'M'
        },
        {
            _id: 'model-owen3-coder-480b',
            _type: 'modelLibrary',
            name: 'Owen3 Coder 480B A35B Instruct',
            slug: { _type: 'slug', current: 'owen3-coder-480b-a35b' },
            provider: 'Qwen',
            description: 'Specialized coding model with exceptional performance',
            iconFilename: 'deepseek-color.png',
            modelType: 'LLM',
            categories: ['featured', 'serverless'],
            inputPrice: 0.45,
            outputPrice: 1.8,
            pricingDisplay: '$0.45/M Input • $1.8/M Output',
            contextWindow: '262144',
            color: 'bg-indigo-500',
            initial: 'Q'
        },
        {
            _id: 'model-openai-gpt-oss-20b',
            _type: 'modelLibrary',
            name: 'OpenAI gpt-oss-20b',
            slug: { _type: 'slug', current: 'openai-gpt-oss-20b' },
            provider: 'OpenAI',
            description: 'Open-source GPT model optimized for general tasks',
            iconFilename: 'openai (1).png',
            modelType: 'LLM',
            categories: ['featured'],
            inputPrice: 0.07,
            outputPrice: 0.3,
            pricingDisplay: '$0.07/M Input • $0.3/M Output',
            contextWindow: '131072',
            color: 'bg-emerald-500',
            initial: 'O'
        },
        {
            _id: 'model-openai-gpt-oss-120b',
            _type: 'modelLibrary',
            name: 'OpenAI gpt-oss-120b',
            slug: { _type: 'slug', current: 'openai-gpt-oss-120b' },
            provider: 'OpenAI',
            description: 'Larger open-source GPT variant for complex reasoning',
            iconFilename: 'openai (1).png',
            modelType: 'LLM',
            categories: ['featured'],
            inputPrice: 0.15,
            outputPrice: 0.6,
            pricingDisplay: '$0.15/M Input • $0.6/M Output',
            contextWindow: '131072',
            color: 'bg-emerald-600',
            initial: 'O'
        },
        {
            _id: 'model-embedding-v3',
            _type: 'modelLibrary',
            name: 'Embedding V3 Large',
            slug: { _type: 'slug', current: 'embedding-v3-large' },
            provider: 'OpenAI',
            description: 'High-quality text embeddings for semantic search',
            iconFilename: 'openai (1).png',
            modelType: 'Embedding',
            categories: ['embedding', 'serverless'],
            inputPrice: 0.13,
            pricingDisplay: '$0.13/M Tokens',
            color: 'bg-teal-500',
            initial: 'O'
        },
        {
            _id: 'model-reranker-v1',
            _type: 'modelLibrary',
            name: 'Reranker V1',
            slug: { _type: 'slug', current: 'reranker-v1' },
            provider: 'Cohere',
            description: 'Advanced reranking model for search optimization',
            iconFilename: 'flux.png',
            modelType: 'Reranker',
            categories: ['reranker'],
            inputPrice: 0.02,
            pricingDisplay: '$0.02/M Tokens',
            color: 'bg-orange-500',
            initial: 'C'
        },
        {
            _id: 'model-claude-vision',
            _type: 'modelLibrary',
            name: 'Claude Vision 3.5',
            slug: { _type: 'slug', current: 'claude-vision-3-5' },
            provider: 'Anthropic',
            description: 'Multimodal model with vision capabilities',
            iconFilename: 'gemini-color.png',
            modelType: 'Vision',
            categories: ['featured'],
            inputPrice: 3.0,
            outputPrice: 15.0,
            pricingDisplay: '$3.0/M Input • $15.0/M Output',
            contextWindow: '200000',
            color: 'bg-purple-600',
            initial: 'A'
        }
    ],
    models: {
        _id: 'models-section-default',
        _type: 'modelsSection',
        sectionLabel: 'Model Library',
        heading: 'Run the latest open models with a single line of code',
        description: 'Helios gives you instant access to the most popular OSS models — optimized for cost, speed, and quality on the fastest AI cloud',
        viewAllLink: '/model-library',
        models: [
            { _type: 'reference', _ref: 'model-deepseek-r1', _key: uuidv4() },
            { _type: 'reference', _ref: 'model-llama-3-70b', _key: uuidv4() },
            { _type: 'reference', _ref: 'model-gemma-3-27b', _key: uuidv4() },
            { _type: 'reference', _ref: 'model-flux-kontext-pro', _key: uuidv4() },
            { _type: 'reference', _ref: 'model-whisper-v3', _key: uuidv4() },
            { _type: 'reference', _ref: 'model-kimi-k2', _key: uuidv4() }
        ]
    },
    infrastructure: {
        _id: 'infrastructure-section-default',
        _type: 'infrastructureSection',
        sectionLabel: 'Building with Helios',
        features: [
            { _key: uuidv4(), id: "global", icon: "Globe", title: "Globally distributed", description: "Virtual cloud infrastructure running on the latest hardware across multiple regions worldwide, ensuring low latency and high availability for your AI workloads." },
            { _key: uuidv4(), id: "enterprise", icon: "Shield", title: "Enterprise ready", description: "Enterprise-grade security and reliability across mission-critical workloads with 99.98% uptime and resilient infrastructure, backed by 24/7 support." },
            { _key: uuidv4(), id: "fast", icon: "Zap", title: "Fast inference", description: "Industry-leading throughput and latency with our optimized inference engine, delivering responses in milliseconds for real-time AI applications." }
        ]
    },
    lifecycle: {
        _id: 'lifecycle-section-default',
        _type: 'lifecycleSection',
        sectionLabel: 'Model Lifecycle Management',
        heading: 'Complete AI model lifecycle management',
        description: 'Run the fastest inference, tune with ease, and scale globally, all without managing infrastructure',
        features: [
            { _key: uuidv4(), title: "Build", description: "Go from idea to output in seconds—with just a prompt. Run the latest open models on Helios serverless, with no GPU setup or cold starts. Move to production with on-demand GPUs that auto-scale as you grow" },
            { _key: uuidv4(), title: "Tune", description: "Fine-tune to meet your use case without the complexity. Get the highest-quality results from any open model using advanced tuning techniques like reinforcement learning, quantization-aware tuning, and adaptive speculation" },
            { _key: uuidv4(), title: "Scale", description: "Scale production workloads seamlessly, anywhere, without managing infrastructure. Helios automatically provisions AI infrastructure across any deployment type, so you can focus on building" }
        ]
    },
    whyHelios: {
        _id: 'why-helios-section-default',
        _type: 'whyHeliosSection',
        sectionLabel: 'Why Helios',
        heading: 'Startup velocity. Enterprise-grade stability.',
        description: 'From AI Natives to Enterprises, Helios powers everything from rapid prototyping to mission-critical workloads',
        audiences: [
            { _key: uuidv4(), title: "AI Natives", points: ["Day 0 support for latest models", "Highest quality and performance, lowest cost", "Complete set of developer features no matter where you are on the journey"] },
            { _key: uuidv4(), title: "Enterprise", points: ["SOC2, HIPAA, and GDPR compliant", "Bring your own cloud or run on ours", "Zero data retention and complete data sovereignty"] }
        ]
    },
    caseStudy: {
        _id: 'case-study-section-default',
        _type: 'caseStudySection',
        sectionLabel: 'Case Study',
        heading: 'Sentient Achieved 50% Higher GPU Throughput with Sub-2s Latency',
        description: 'Sentient waitlisted 1.8M users in 24 hours, delivering sub-2s latency across 15-agent workflows with 50% higher throughput per GPU and zero infra sprawl, all powered by Helios',
        ctaText: 'Read the Case Study',
        ctaLink: '#',
        companyName: 'sentient',
        statValue: '50%',
        statLabel: 'Higher throughput per GPU',
        gradientStart: 'primary',
        gradientEnd: 'yellow-dark'
    },
    homePage: {
        _id: 'home-page',
        _type: 'page',
        title: 'Home Page',
        slug: { _type: 'slug', current: 'home' },
        sections: [
            { _type: 'reference', _ref: 'hero-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'logo-bar-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'use-cases-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'models-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'infrastructure-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'lifecycle-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'why-helios-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'testimonials-section-default', _key: uuidv4() },
            { _type: 'reference', _ref: 'case-study-section-default', _key: uuidv4() },
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
                { _type: 'block', _key: uuidv4(), style: 'normal', children: [{ _type: 'span', _key: uuidv4(), text: 'Today we are announcing the general availability of Helios RFT (Re-Fine Tuning)...' }] },
                { _type: 'block', _key: uuidv4(), style: 'h2', children: [{ _type: 'span', _key: uuidv4(), text: 'Why Fine-Tuning Matters' }] },
                { _type: 'block', _key: uuidv4(), style: 'normal', children: [{ _type: 'span', _key: uuidv4(), text: 'General purpose models are great, but for specific business logic, fine-tuned smaller models often perform better and are much cheaper.' }] }
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
                { _type: 'block', _key: uuidv4(), style: 'normal', children: [{ _type: 'span', _key: uuidv4(), text: 'Speed is the most critical factor for real-time AI agents. In this post, we dive into the technical details...' }] }
            ]
        },
        {
            _id: 'post-3',
            _type: 'blogPost',
            title: 'The Future of Agentic Workflows',
            slug: { _type: 'slug', current: 'future-of-agentic-workflows' },
            author: { _type: 'reference', _ref: 'author-amol' },
            publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            excerpt: 'Agents are more than just chatbots. They are reasoning engines capable of planning and executing complex tasks.',
            categories: [{ _type: 'reference', _ref: 'category-announcement', _key: uuidv4() }],
            body: [
                { _type: 'block', _key: uuidv4(), style: 'normal', children: [{ _type: 'span', _key: uuidv4(), text: 'We believe the next phase of AI is agentic. Instead of simple query-response, agents will perform multi-step planning...' }] }
            ]
        },
        {
            _id: 'post-4',
            _type: 'blogPost',
            title: 'Serverless GPUs: Scaling without the Headaches',
            slug: { _type: 'slug', current: 'serverless-gpus-scaling' },
            author: { _type: 'reference', _ref: 'author-amol' },
            publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
            excerpt: 'Don\'t pay for idle GPUs. Learn how Helios handles auto-scaling and zero-cold-start inference.',
            categories: [],
            body: [
                { _type: 'block', _key: uuidv4(), style: 'normal', children: [{ _type: 'span', _key: uuidv4(), text: 'Provisioning GPUs used to take weeks. With Helios, it takes milliseconds...' }] }
            ]
        }
    ]
}

const pricingData = {
    gpuModels: [
        {
            _id: 'gpu-h100-nvl',
            _type: 'gpuModel',
            id: 'h100-nvl',
            name: 'H100 NVL',
            vram: '94GB',
            memory: '94GB HBM3',
            specs: '94GB HBM3',
            heliosPrice: 2.47,
            awsPrice: '5.88',
            googleCloudPrice: 'Not listed',
            lambdaPrice: '2.49',
            modalPrice: '3.95',
            displayOrder: 0
        },
        {
            _id: 'gpu-h100-sxm',
            _type: 'gpuModel',
            id: 'h100-sxm',
            name: 'H100 SXM',
            vram: '80GB',
            memory: '80GB HBM3',
            specs: '80GB HBM3',
            heliosPrice: 2.25,
            awsPrice: '4.40',
            googleCloudPrice: '11.06',
            lambdaPrice: '2.99',
            modalPrice: '3.95',
            displayOrder: 1
        },
        {
            _id: 'gpu-rtx-pro-6000',
            _type: 'gpuModel',
            id: 'rtx-pro-6000',
            name: 'RTX Pro 6000',
            vram: '96GB',
            memory: '96GB GDDR7 ECC',
            specs: '96GB GDDR7 ECC, Blackwell Architecture',
            heliosPrice: 1.70,
            awsPrice: 'Not listed',
            googleCloudPrice: 'Not listed',
            lambdaPrice: 'Not listed',
            modalPrice: 'Not listed',
            displayOrder: 2
        },
        {
            _id: 'gpu-l40s',
            _type: 'gpuModel',
            id: 'l40s',
            name: 'L40S',
            vram: '48GB',
            memory: '48GB GDDR6',
            specs: '48GB GDDR6',
            heliosPrice: 0.87,
            awsPrice: '1.86-2.24',
            googleCloudPrice: 'Not listed',
            lambdaPrice: 'Not Available',
            modalPrice: '1.95',
            displayOrder: 3
        },
        {
            _id: 'gpu-a100',
            _type: 'gpuModel',
            id: 'a100',
            name: 'A100',
            vram: '80GB',
            memory: '80GB HBM2e',
            specs: '80GB HBM2e',
            heliosPrice: 1.35,
            awsPrice: '3.67-4.10',
            googleCloudPrice: '3.67',
            lambdaPrice: '1.29',
            modalPrice: '2.50',
            displayOrder: 4
        }
    ],
    pricingTiers: [
        {
            _id: 'tier-on-demand',
            _type: 'pricingTier',
            id: 'on-demand',
            label: 'On Demand',
            duration: 'Hourly billing',
            discount: 0,
            featured: false,
            displayOrder: 0
        },
        {
            _id: 'tier-1-month',
            _type: 'pricingTier',
            id: '1-month',
            label: '1 Month',
            duration: '1-month commitment',
            discount: 5,
            featured: false,
            displayOrder: 1
        },
        {
            _id: 'tier-3-months',
            _type: 'pricingTier',
            id: '3-months',
            label: '3 Months',
            duration: '3-month commitment',
            discount: 10,
            featured: true,
            displayOrder: 2
        },
        {
            _id: 'tier-6-months',
            _type: 'pricingTier',
            id: '6-months',
            label: '6 Months',
            duration: '6-month commitment',
            discount: 15,
            featured: false,
            displayOrder: 3
        },
        {
            _id: 'tier-12-months',
            _type: 'pricingTier',
            id: '12-months',
            label: '12 Months',
            duration: '12-month commitment',
            discount: 20,
            featured: false,
            displayOrder: 4
        }
    ],
    pricingPageSection: {
        _id: 'pricing-page-section-default',
        _type: 'pricingPageSection',
        title: 'Pricing Page Configuration',
        heroTitle: 'GPU Pricing That Scales',
        heroSubtitle: 'Compare our competitive GPU pricing against leading cloud providers. Built for AI workloads, optimized for performance, designed for scale.',
        ctaButtonText: 'Get Started',
        ctaButtonUrl: 'https://console.heliosenergy.io/',
        calculatorTitle: 'Calculate Your Costs',
        comparisonTableTitle: 'GPU Pricing Comparison',
        footerNote: 'Prices are subject to change. Contact us for enterprise pricing and volume discounts.',
        calendlyUrl: 'https://calendly.com/jose-helios/30min'
    },
    pricingPage: {
        _id: 'pricing-page',
        _type: 'page',
        title: 'Pricing',
        slug: { _type: 'slug', current: 'pricing' },
        sections: [
            { _type: 'reference', _ref: 'pricing-page-section-default', _key: uuidv4() }
        ]
    }
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
        transaction.createOrReplace(landingPageContent.logoBar)

        // Create model library documents first
        console.log('  Creating model library...')
        landingPageContent.modelLibrary.forEach(model => transaction.createOrReplace(model))

        // Then create models section with references
        transaction.createOrReplace(landingPageContent.models)
        transaction.createOrReplace(landingPageContent.infrastructure)
        transaction.createOrReplace(landingPageContent.lifecycle)
        transaction.createOrReplace(landingPageContent.whyHelios)
        transaction.createOrReplace(landingPageContent.caseStudy)
        transaction.createOrReplace(landingPageContent.homePage)

        // 2. Blog Data
        console.log('  Creating blog data...')
        transaction.createOrReplace(blogData.author)
        transaction.createOrReplace(blogData.category)
        blogData.posts.forEach(post => transaction.createOrReplace(post))

        // 3. Pricing Data
        console.log('  Creating pricing data...')
        pricingData.gpuModels.forEach(gpu => transaction.createOrReplace(gpu))
        pricingData.pricingTiers.forEach(tier => transaction.createOrReplace(tier))
        transaction.createOrReplace(pricingData.pricingPageSection)
        transaction.createOrReplace(pricingData.pricingPage)

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
