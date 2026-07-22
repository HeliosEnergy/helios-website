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
            description: 'Current 3-year/base reserved hourly price for Helios Compute',
        }),
        defineField({
            name: 'pricingSourceProvider',
            title: 'Pricing Source Provider',
            type: 'string',
            description: 'Source used for market benchmark pricing, e.g. getdeploying',
        }),
        defineField({
            name: 'pricingFormulaVersion',
            title: 'Pricing Formula Version',
            type: 'string',
            description: 'Formula identifier used to calculate Helios reserved pricing',
        }),
        defineField({
            name: 'pricingMarketMetric',
            title: 'Pricing Market Metric',
            type: 'string',
            description: 'GetDeploying chart metric used as the market benchmark',
        }),
        defineField({
            name: 'pricingCurrency',
            title: 'Pricing Currency',
            type: 'string',
            description: 'Currency for pricing fields, e.g. USD',
        }),
        defineField({
            name: 'pricingUnit',
            title: 'Pricing Unit',
            type: 'string',
            description: 'Unit for pricing fields, e.g. gpu_hour',
        }),
        defineField({
            name: 'pricingHoursPerMonth',
            title: 'Pricing Hours Per Month',
            type: 'number',
            description: 'Hours used for monthly estimates',
        }),
        defineField({
            name: 'pricingLastPublishedAt',
            title: 'Pricing Last Published At',
            type: 'datetime',
            description: 'Timestamp when Helios last published this computed pricing snapshot',
        }),
        defineField({
            name: 'marketSourceUrl',
            title: 'Market Source URL',
            type: 'url',
            description: 'GetDeploying GPU page used for this benchmark',
        }),
        defineField({
            name: 'marketSourceUpdatedAt',
            title: 'Market Source Updated At',
            type: 'datetime',
            description: 'Timestamp reported by the source page',
        }),
        defineField({
            name: 'marketReservedBenchmarkPrice',
            title: 'Market Reserved Chart Benchmark (USD/GPU/hr)',
            type: 'number',
            validation: (Rule) => Rule.min(0),
            description: 'Customer-visible GetDeploying reserved chart median before the Helios discount',
        }),
        defineField({
            name: 'marketReservedAvgPrice',
            title: 'Legacy Market Reserved Price (USD/GPU/hr)',
            type: 'number',
            validation: (Rule) => Rule.min(0),
            description: 'Compatibility alias. Use marketReservedBenchmarkPrice for v2 pricing.',
        }),
        defineField({
            name: 'heliosBaseReservedPrice',
            title: 'Helios Base Reserved Price (USD/GPU/hr)',
            type: 'number',
            validation: (Rule) => Rule.min(0),
            description: 'Market reserved chart benchmark multiplied by 0.95; equivalent to 3-year price',
        }),
        defineField({
            name: 'derivedFromGpuId',
            title: 'Derived From GPU ID',
            type: 'string',
            description: 'GPU ID used as pricing source for derived products such as GB300',
        }),
        defineField({
            name: 'derivationMultiplier',
            title: 'Derivation Multiplier',
            type: 'number',
            description: 'Multiplier applied to the source GPU price for derived products',
        }),
        defineField({
            name: 'heliosReservedTermPrices',
            title: 'Helios Reserved Term Prices',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'years',
                            title: 'Years',
                            type: 'number',
                            validation: (Rule) => Rule.required().integer().min(1).max(5),
                        }),
                        defineField({
                            name: 'multiplier',
                            title: 'Multiplier',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                        defineField({
                            name: 'price',
                            title: 'Price (USD/GPU/hr)',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                    ],
                    preview: {
                        select: {
                            years: 'years',
                            price: 'price',
                        },
                        prepare({ years, price }) {
                            return {
                                title: `${years} year`,
                                subtitle: `$${price}/GPU/hr`,
                            }
                        },
                    },
                },
            ],
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
            name: 'coreweavePrice',
            title: 'CoreWeave Price (USD/hr)',
            type: 'string',
            description: 'CoreWeave price - can be a number or "N/A"',
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
