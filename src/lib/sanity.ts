import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '05vcm5dh',
    dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
    useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
    apiVersion: '2024-12-19', // Use current date (YYYY-MM-DD) to get latest API behavior
})

// Helper for generating image URLs
const builder = imageUrlBuilder(client)

export function urlFor(source: unknown) {
    return builder.image(source)
}
