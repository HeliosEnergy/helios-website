import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'logoBar',
    title: 'Logo Bar',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title (Admin only)',
            type: 'string',
            initialValue: 'Customer Logos',
        }),
        defineField({
            name: 'logos',
            title: 'Logos',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of company names to display in the scrolling bar',
        }),
    ],
})
