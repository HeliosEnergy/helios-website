import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonialsSection',
    title: 'Testimonials Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Customer Love',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'testimonials',
            title: 'Testimonials',
            type: 'array',
            of: [{ type: 'testimonial' }],
            validation: (Rule) => Rule.required().min(1),
        }),
    ],
})
