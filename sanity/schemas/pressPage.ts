import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'pressPage',
    title: 'Press Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Press',
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
            name: 'releases',
            title: 'Press Releases',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'date', title: 'Date', type: 'date' },
                    { name: 'title', title: 'Title', type: 'string' },
                    { name: 'link', title: 'Link', type: 'string' },
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
