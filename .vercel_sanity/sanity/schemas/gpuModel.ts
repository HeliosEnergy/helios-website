import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'gpuModel',
    title: 'GPU Model',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'GPU ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Unique identifier for the GPU model (e.g., h100-nvl, a100)',
        }),
        defineField({
            name: 'name',
            title: 'GPU Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Display name of the GPU (e.g., H100 NVL, A100)',
        }),
        defineField({
            name: 'vram',
            title: 'VRAM',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'VRAM capacity (e.g., 94GB, 80GB)',
        }),
        defineField({
            name: 'memory',
            title: 'Memory',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Detailed memory specification (e.g., 94GB HBM3)',
        }),
        defineField({
            name: 'specs',
            title: 'Specifications',
            type: 'text',
            description: 'Technical specifications of the GPU',
        }),
        defineField({
            name: 'heliosPrice',
            title: 'Helios Price (USD/hr)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
            description: 'Hourly price for Helios Compute',
        }),
        defineField({
            name: 'awsPrice',
            title: 'AWS Price (USD/hr)',
            type: 'string',
            description: 'AWS price - can be a number or "Not listed"',
        }),
        defineField({
            name: 'googleCloudPrice',
            title: 'Google Cloud Price (USD/hr)',
            type: 'string',
            description: 'Google Cloud price - can be a number or "Not listed"',
        }),
        defineField({
            name: 'lambdaPrice',
            title: 'Lambda Labs Price (USD/hr)',
            type: 'string',
            description: 'Lambda Labs price - can be a number or "Not listed"',
        }),
        defineField({
            name: 'modalPrice',
            title: 'Modal Price (USD/hr)',
            type: 'string',
            description: 'Modal price - can be a number or "Not listed"',
        }),
        defineField({
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which to display this GPU model (lower numbers first)',
            validation: (Rule) => Rule.integer().min(0),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'vram',
            price: 'heliosPrice',
        },
        prepare({ title, subtitle, price }) {
            return {
                title: title,
                subtitle: `${subtitle} - $${price}/hr`,
            }
        },
    },
})
