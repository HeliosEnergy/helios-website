import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'lifecycleSection',
    title: 'Lifecycle Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Model Lifecycle Management',
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
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Title' },
                        { name: 'description', type: 'text', title: 'Description' },
                        { name: 'link', type: 'string', title: 'Learn More Link', initialValue: '#' },
                    ],
                },
            ],
        }),
    ],
})
