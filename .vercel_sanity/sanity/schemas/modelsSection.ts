import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'modelsSection',
    title: 'Models Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Model Library',
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
            name: 'viewAllLink',
            title: 'View All Link',
            type: 'string',
            initialValue: '#',
        }),
        defineField({
            name: 'models',
            title: 'Models',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', type: 'string', title: 'Model Name' },
                        { name: 'provider', type: 'string', title: 'Provider' },
                        { name: 'pricing', type: 'string', title: 'Pricing Info' },
                        { name: 'context', type: 'string', title: 'Context Window' },
                        { name: 'type', type: 'string', title: 'Model Type (LLM, Image, Audio)' },
                        { name: 'icon', type: 'string', title: 'Icon Filename' },
                        { name: 'color', type: 'string', title: 'Tailwind Color (e.g., bg-blue-500)' },
                        { name: 'initial', type: 'string', title: 'Initial' },
                    ],
                },
            ],
        }),
    ],
})
