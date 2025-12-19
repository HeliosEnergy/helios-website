import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'whyHeliosSection',
    title: 'Why Helios Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Why Helios',
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
            name: 'audiences',
            title: 'Audiences',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Audience Title' },
                        {
                            name: 'points',
                            type: 'array',
                            title: 'Points',
                            of: [{ type: 'string' }],
                        },
                        { name: 'link', type: 'string', title: 'Learn More Link', initialValue: '#' },
                    ],
                },
            ],
        }),
    ],
})
