import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'page',
    title: 'Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sections',
            title: 'Page Sections',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'announcementBanner' },
                        { type: 'heroSection' },
                        { type: 'useCasesSection' },
                        { type: 'testimonialsSection' },
                        { type: 'ctaSection' },
                        { type: 'blogSection' },
                        { type: 'logoBar' },
                        { type: 'modelsSection' },
                        { type: 'infrastructureSection' },
                        { type: 'lifecycleSection' },
                        { type: 'whyHeliosSection' },
                        { type: 'caseStudySection' },
                        { type: 'pricingPageSection' },
                        { type: 'coreValueProposition' },
                    ]
                },
            ],
            description: 'Drag to reorder sections on the page',
        }),
    ],
})
