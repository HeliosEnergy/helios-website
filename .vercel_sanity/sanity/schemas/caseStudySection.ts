import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'caseStudySection',
    title: 'Case Study Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Case Study',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Text',
            type: 'string',
            initialValue: 'Read the Case Study',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'string',
            initialValue: '#',
        }),
        defineField({
            name: 'companyName',
            title: 'Company Name',
            type: 'string',
        }),
        defineField({
            name: 'statValue',
            title: 'Stat Value (e.g., 50%)',
            type: 'string',
        }),
        defineField({
            name: 'statLabel',
            title: 'Stat Label',
            type: 'string',
        }),
        defineField({
            name: 'gradientStart',
            title: 'Gradient Start Color',
            type: 'string',
            initialValue: 'primary',
        }),
        defineField({
            name: 'gradientEnd',
            title: 'Gradient End Color',
            type: 'string',
            initialValue: 'orange',
        }),
    ],
})
