import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'eventsPage',
    title: 'Events Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Events',
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
            name: 'events',
            title: 'Events',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'date', title: 'Date', type: 'date' },
                    { name: 'name', title: 'Event Name', type: 'string' },
                    { name: 'location', title: 'Location', type: 'string' },
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
