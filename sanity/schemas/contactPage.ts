import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'contactPage',
    title: 'Contact Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Contact',
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
            name: 'formLabels',
            title: 'Form Labels',
            type: 'object',
            fields: [
                { name: 'name', title: 'Name Label', type: 'string', initialValue: 'Name' },
                { name: 'email', title: 'Email Label', type: 'string', initialValue: 'Email' },
                { name: 'inquiry', title: 'Inquiry Label', type: 'string', initialValue: 'Inquiry' },
                { name: 'message', title: 'Message Label', type: 'string', initialValue: 'Message' },
            ]
        })
    ],
    preview: {
        select: {
            title: 'headline',
        },
    },
})
