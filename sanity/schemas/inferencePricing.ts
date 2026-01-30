import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'inferencePricing',
    title: 'Inference Pricing Model',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'Model ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Unique identifier (e.g., llama-3.3-70b, qwen-2.5-72b)',
        }),
        defineField({
            name: 'name',
            title: 'Model Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Display name (e.g., Llama 3.3 70B Instruct)',
        }),
        defineField({
            name: 'provider',
            title: 'Provider',
            type: 'string',
            description: 'Model provider (e.g., Meta, Qwen, Mistral)',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Text Generation', value: 'text' },
                    { title: 'Code Generation', value: 'code' },
                    { title: 'Vision/Multimodal', value: 'vision' },
                    { title: 'Embedding', value: 'embedding' },
                ],
            },
        }),
        defineField({
            name: 'contextWindow',
            title: 'Context Window',
            type: 'string',
            description: 'Max context length (e.g., 128K, 32K)',
        }),
        defineField({
            name: 'inputPricePerMillion',
            title: 'Input Price (per 1M tokens)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
            description: 'Price per million input tokens in USD',
        }),
        defineField({
            name: 'outputPricePerMillion',
            title: 'Output Price (per 1M tokens)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
            description: 'Price per million output tokens in USD',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Show this model prominently',
            initialValue: false,
        }),
        defineField({
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which to display (lower first)',
            validation: (Rule) => Rule.integer().min(0),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            provider: 'provider',
            inputPrice: 'inputPricePerMillion',
            outputPrice: 'outputPricePerMillion',
        },
        prepare({ title, provider, inputPrice, outputPrice }) {
            return {
                title: title,
                subtitle: `${provider || 'Unknown'} | $${inputPrice}/$${outputPrice} per 1M tokens`,
            }
        },
    },
})
