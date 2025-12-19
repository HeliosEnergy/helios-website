import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'useCase',
    title: 'Use Case',
    type: 'object',
    fields: [
        defineField({
            name: 'icon',
            title: 'Icon Name',
            type: 'string',
            description: 'Lucide icon name (e.g., Code2, MessageSquare, Brain)',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Title',
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
            name: 'tag',
            title: 'Tag',
            type: 'string',
            validation: (Rule) => Rule.required().max(10),
        }),
        defineField({
            name: 'stat',
            title: 'Stat',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'statLabel',
            title: 'Stat Label',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
    ],
})
