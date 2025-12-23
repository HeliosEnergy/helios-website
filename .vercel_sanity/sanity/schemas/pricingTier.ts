import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'pricingTier',
    title: 'Pricing Tier',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'Tier ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Unique identifier for the pricing tier (e.g., on-demand, quarterly)',
        }),
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Display label for the tier (e.g., On Demand, 1 month)',
        }),
        defineField({
            name: 'duration',
            title: 'Duration Description',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Description of the commitment period (e.g., Hourly billing, 1-month commitment)',
        }),
        defineField({
            name: 'discount',
            title: 'Discount Percentage',
            type: 'number',
            validation: (Rule) => Rule.required().min(0).max(100),
            description: 'Discount percentage for this tier (0-100)',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Mark this tier as featured/recommended',
            initialValue: false,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Optional additional description for this pricing tier',
        }),
        defineField({
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which to display this tier (lower numbers first)',
            validation: (Rule) => Rule.required().integer().min(0),
        }),
    ],
    preview: {
        select: {
            title: 'label',
            subtitle: 'duration',
            discount: 'discount',
            featured: 'featured',
        },
        prepare({ title, subtitle, discount, featured }) {
            return {
                title: `${title}${featured ? ' ⭐' : ''}`,
                subtitle: `${subtitle} - ${discount}% off`,
            }
        },
    },
})
