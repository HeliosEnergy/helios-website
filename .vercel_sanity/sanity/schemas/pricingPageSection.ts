import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'pricingPageSection',
    title: 'Pricing Page Section',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Section Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Internal title for this section',
        }),
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Main headline on the pricing page',
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'text',
            description: 'Subtitle text below the main headline',
        }),
        defineField({
            name: 'ctaButtonText',
            title: 'CTA Button Text',
            type: 'string',
            description: 'Text for the call-to-action button',
            initialValue: 'Get Started',
        }),
        defineField({
            name: 'ctaButtonUrl',
            title: 'CTA Button URL',
            type: 'url',
            description: 'URL for the call-to-action button',
        }),
        defineField({
            name: 'calculatorTitle',
            title: 'Calculator Section Title',
            type: 'string',
            description: 'Title for the pricing calculator section',
            initialValue: 'Calculate Your Costs',
        }),
        defineField({
            name: 'comparisonTableTitle',
            title: 'Comparison Table Title',
            type: 'string',
            description: 'Title for the pricing comparison table',
            initialValue: 'GPU Pricing Comparison',
        }),
        defineField({
            name: 'footerNote',
            title: 'Footer Note',
            type: 'text',
            description: 'Note displayed at the bottom of the pricing page',
        }),
        defineField({
            name: 'calendlyUrl',
            title: 'Calendly URL',
            type: 'url',
            description: 'URL for the Calendly booking link',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'heroTitle',
        },
    },
})
