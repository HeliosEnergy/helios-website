import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'announcementBanner',
    title: 'Announcement Banner',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Text',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'url',
        }),
        defineField({
            name: 'enabled',
            title: 'Enabled',
            type: 'boolean',
            initialValue: true,
        }),
    ],
})
