import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'infrastructureSection',
    title: 'Infrastructure Section',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionLabel',
            title: 'Section Label',
            type: 'string',
            initialValue: 'Building with Helios',
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'id', type: 'string', title: 'ID (global, enterprise, fast)' },
                        { name: 'icon', type: 'string', title: 'Lucide Icon Name' },
                        { name: 'title', type: 'string', title: 'Title' },
                        { name: 'description', type: 'text', title: 'Description' },
                    ],
                },
            ],
        }),
    ],
})
