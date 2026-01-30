import dotenv from 'dotenv'
import { createClient } from '@sanity/client'

dotenv.config({ path: '.env.local' })

const projectId = process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh'
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
    console.error('❌ Error: SANITY_WRITE_TOKEN is missing in .env.local')
    console.log('Please get a write token from https://www.sanity.io/manage and add it to .env.local as SANITY_WRITE_TOKEN=xxx')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-01-01'
})

async function updateTestimonials() {
  console.log('🚀 Starting testimonials update...')

  try {
    // Find the testimonials section
    const testimonialsSection = await client.fetch(
      `*[_type == "testimonialsSection"][0]`
    )

    if (!testimonialsSection) {
      console.error('❌ Testimonials section not found')
      return
    }

    console.log('📝 Updating testimonials section...')

    // Update with single combined testimonial
    const updated = await client
      .patch(testimonialsSection._id)
      .set({
        sectionLabel: 'The Consensus',
        testimonials: [
          {
            _key: 'testimonial-kaustubh-mixio',
            quote: "It was ridiculous paying for compute we weren't even using. We had to keep GPUs running idle just to avoid the cold starts between requests. With Helios, we generate the same volume and save ~$1,480/month. I like paying for the actual work, and not the infrastructure penalties.",
            author: "Kaustubh",
            role: "Co-founder",
            company: "Mixio Pro"
          }
        ]
      })
      .commit()

    console.log('✅ Testimonials updated successfully')
    console.log('📄 Updated document:', updated)
  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

// Run the update
updateTestimonials().catch(console.error)
