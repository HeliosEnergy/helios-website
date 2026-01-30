import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'careersPage',
    title: 'Careers Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Careers',
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'intro',
            title: 'Intro Text',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Text',
            type: 'string',
            initialValue: 'Craft with us',
        }),
        defineField({
            name: 'openPositions',
            title: 'Open Positions',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'role', title: 'Role', type: 'string' },
                    { name: 'department', title: 'Department', type: 'string' },
                    { name: 'location', title: 'Location', type: 'string' },
                    { name: 'link', title: 'Application Link', type: 'string' }
                ]
            }]
        })
    ],
    preview: {
        select: {
            title: 'headline',
        },
    },
})
