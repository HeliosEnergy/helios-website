import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'useCasesSection',
    title: 'Use Cases Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Helios AI Cloud',
        }),
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
            name: 'useCases',
            title: 'Use Cases',
            type: 'array',
            of: [{ type: 'useCase' }],
            validation: (Rule) => Rule.required().min(1).max(6),
        }),
    ],
})
