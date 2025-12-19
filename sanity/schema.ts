// Import all schema types
import announcementBanner from './schemas/announcementBanner'
import heroSection from './schemas/heroSection'
import useCase from './schemas/useCase'
import useCasesSection from './schemas/useCasesSection'
import testimonial from './schemas/testimonial'
import testimonialsSection from './schemas/testimonialsSection'
import ctaSection from './schemas/ctaSection'
import author from './schemas/author'
import category from './schemas/category'
import blogPost from './schemas/blogPost'
import page from './schemas/page'
import blogSection from './schemas/blogSection'

export const schemaTypes = [
    // Landing page schemas
    announcementBanner,
    heroSection,
    useCase,
    useCasesSection,
    testimonial,
    testimonialsSection,
    ctaSection,
    blogSection,

    // Blog schemas
    author,
    category,
    blogPost,

    // Page builder
    page,
]
