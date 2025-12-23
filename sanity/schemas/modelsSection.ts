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
                    type: 'reference',
                    to: [{ type: 'modelLibrary' }],
                },
            ],
            description: 'Select models from the Model Library to display in the carousel',
        }),
    ],
})
