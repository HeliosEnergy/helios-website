import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'ctaSection',
    title: 'CTA Section',
    type: 'document',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'primaryCtaText',
            title: 'Primary CTA Text',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'primaryCtaLink',
            title: 'Primary CTA Link',
            type: 'url',
        }),
        defineField({
            name: 'secondaryCtaText',
            title: 'Secondary CTA Text',
            type: 'string',
        }),
        defineField({
            name: 'secondaryCtaLink',
            title: 'Secondary CTA Link',
            type: 'url',
        }),
    ],
})
