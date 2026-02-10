import { client } from './src/lib/sanity';

// Existing content from components for initial migration
const initialContent = {
    announcement: {
        _type: 'announcementBanner',
        title: 'Helios RFT now available!',
        description: 'Fine-tune open models that outperform frontier models.',
        ctaText: 'Try today',
        ctaLink: 'https://helios.co/docs',
        enabled: true
    },
    hero: {
        _type: 'heroSection',
        heading: 'Build. Tune. Scale.',
        description: 'Open-source AI models at blazing speed, optimized for your use case, scaled globally with the Helios Inference Cloud',
        primaryCtaText: 'Get Started',
        primaryCtaLink: 'https://console.heliosenergy.io/login?tab=signup',
        secondaryCtaText: 'Talk to Our Team',
        secondaryCtaLink: '/contact'
    },
    useCases: [
        {
            _type: 'useCase',
            icon: 'Code2',
            title: 'Code Assistance',
            description: 'IDE copilots, code generation, debugging agents',
            tag: 'DEV',
            stat: '10x',
            statLabel: 'faster coding'
        },
        {
            _type: 'useCase',
            icon: 'MessageSquare',
            title: 'Conversational AI',
            description: 'Customer support bots, internal helpdesk assistants, multilingual chat',
            tag: 'CHAT',
            stat: '24/7',
            statLabel: 'availability'
        },
        {
            _type: 'useCase',
            icon: 'Brain',
            title: 'Agentic Systems',
            description: 'Multi-step reasoning, planning, and execution pipelines',
            tag: 'AGENT',
            stat: '∞',
            statLabel: 'possibilities'
        }
    ],
    testimonials: [
        {
            _type: 'testimonial',
            quote: "Helios has been a fantastic partner in building AI dev tools at Sourcegraph. Their fast, reliable model inference lets us focus on fine-tuning, AI-powered code search, and deep code context, making Cody the best AI coding assistant.",
            author: "Beyang Liu",
            role: "CTO at Sourcegraph",
            company: "Sourcegraph"
        }
    ]
};

async function migrate() {
    console.log('Starting migration...');
    try {
        // Note: This requires a write token which we don't have yet.
        // This is a template for the user to use when they have their project configured.
        console.log('Migration requires a write token and project ID.');
        console.log('Planned content:', JSON.stringify(initialContent, null, 2));
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

// migrate();
