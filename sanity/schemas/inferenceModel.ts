import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'inferenceModel',
    title: 'Inference Model',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'Model ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Unique identifier for the model (e.g., whisper-faster, flux, bark)',
        }),
        defineField({
            name: 'name',
            title: 'Model Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Display name of the model (e.g., Whisper Faster, Flux)',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Audio Input (Speech-to-Text)', value: 'audio-input' },
                    { title: 'Audio Output (Text-to-Speech)', value: 'audio-output' },
                    { title: 'Image Generation', value: 'image' },
                    { title: 'Vision/Video', value: 'vision' },
                    { title: 'Text Generation', value: 'text' },
                ],
            },
            description: 'Type of model - determines which estimation slider to show',
        }),
        defineField({
            name: 'pricePerSecond',
            title: 'Price per Second (USD)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
            description: 'Price per second of GPU runtime',
        }),
        defineField({
            name: 'estimationUnit',
            title: 'Estimation Unit',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Voice Minutes', value: 'voice-mins' },
                    { title: 'Images', value: 'images' },
                    { title: 'Video Minutes', value: 'video-mins' },
                    { title: 'Tokens (Millions)', value: 'tokens' },
                ],
            },
            description: 'Unit used for estimation slider in contact form',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Brief description of the model capabilities',
        }),
        defineField({
            name: 'provider',
            title: 'Provider',
            type: 'string',
            description: 'Model provider (e.g., OpenAI, Suno, Black Forest Labs)',
        }),
        defineField({
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which to display this model (lower numbers first)',
            validation: (Rule) => Rule.integer().min(0),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
            price: 'pricePerSecond',
        },
        prepare({ title, subtitle, price }) {
            const categoryLabels: Record<string, string> = {
                'audio-input': 'Speech-to-Text',
                'audio-output': 'Text-to-Speech',
                'image': 'Image Gen',
                'vision': 'Vision/Video',
                'text': 'Text Gen',
            }
            return {
                title: title,
                subtitle: `${categoryLabels[subtitle] || subtitle} - $${price}/s`,
            }
        },
    },
})
