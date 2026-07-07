import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteCapacitySnapshot',
    title: 'Site Capacity Snapshot',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'Snapshot ID',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Use "current" for the production website snapshot.',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'sourceProvider',
            title: 'Source Provider',
            type: 'string',
        }),
        defineField({
            name: 'sourceFileId',
            title: 'Source Drive File ID',
            type: 'string',
        }),
        defineField({
            name: 'sourceFileName',
            title: 'Source File Name',
            type: 'string',
        }),
        defineField({
            name: 'sourceModifiedTime',
            title: 'Source Modified Time',
            type: 'datetime',
        }),
        defineField({
            name: 'sourceMd5Checksum',
            title: 'Source MD5 Checksum',
            type: 'string',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
        }),
        defineField({
            name: 'totalMw',
            title: 'Total MW',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'computeMw',
            title: 'Compute / mDC MW',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'energyMw',
            title: 'Energy MW',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'siteCount',
            title: 'Site Count',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'sites',
            title: 'Sites By State',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'id', title: 'Map Site ID', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'stateAbbr', title: 'State Abbreviation', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'totalMw', title: 'Total MW', type: 'number', validation: (Rule) => Rule.required().min(0) }),
                        defineField({ name: 'computeMw', title: 'Compute / mDC MW', type: 'number', validation: (Rule) => Rule.min(0) }),
                        defineField({ name: 'energyMw', title: 'Energy MW', type: 'number', validation: (Rule) => Rule.min(0) }),
                        defineField({ name: 'siteCount', title: 'Site Count', type: 'number', validation: (Rule) => Rule.required().min(0) }),
                    ],
                    preview: {
                        select: {
                            title: 'stateAbbr',
                            totalMw: 'totalMw',
                            siteCount: 'siteCount',
                        },
                        prepare({ title, totalMw, siteCount }) {
                            return {
                                title,
                                subtitle: `${totalMw ?? 0} MW - ${siteCount ?? 0} sites`,
                            }
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            totalMw: 'totalMw',
            siteCount: 'siteCount',
            publishedAt: 'publishedAt',
        },
        prepare({ title, totalMw, siteCount, publishedAt }) {
            return {
                title: title || 'Site capacity snapshot',
                subtitle: `${totalMw ?? 0} MW across ${siteCount ?? 0} sites${publishedAt ? ` - ${publishedAt}` : ''}`,
            }
        },
    },
})
