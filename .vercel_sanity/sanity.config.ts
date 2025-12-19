/// <reference types="vite/client" />

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './sanity/schema'

export default defineConfig({
    name: 'default',
    title: 'Helios Blog CMS',

    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '05vcm5dh',
    dataset: import.meta.env.VITE_SANITY_DATASET || 'production',

    plugins: [
        structureTool(),
        visionTool(),
        codeInput(),
    ],

    schema: {
        types: schemaTypes,
    },
})
