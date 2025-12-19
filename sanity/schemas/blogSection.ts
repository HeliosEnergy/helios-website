import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'blogSection',
    title: 'Blog Section',
    type: 'document',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Latest insights and updates',
        }),
        defineField({
            name: 'label',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Blog',
        }),
    ],
})
