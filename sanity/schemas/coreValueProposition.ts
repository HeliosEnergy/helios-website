import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'coreValueProposition',
    title: 'Core Value Proposition',
    type: 'document',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Why teams choose Helios',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'cards',
            title: 'Cards',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Title' },
                        { name: 'description', type: 'text', title: 'Description' },
                    ],
                },
            ],
            initialValue: [
                {
                    title: 'Predictable costs',
                    description: 'No surprise charges or hidden complexity. Designed for teams that are budget-conscious and serious about scale.',
                },
                {
                    title: 'Inference-first by design',
                    description: 'Optimized for production inference workloads today, with a clear path to training as your needs grow.',
                },
                {
                    title: 'Simple by default',
                    description: 'Deploy and manage GPUs through a clean, intuitive interface built for engineers who want to move fast.',
                },
            ],
        }),
    ],
})
