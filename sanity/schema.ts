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
import logoBar from './schemas/logoBar'
import modelLibrary from './schemas/modelLibrary'
import modelsSection from './schemas/modelsSection'
import infrastructureSection from './schemas/infrastructureSection'
import lifecycleSection from './schemas/lifecycleSection'
import whyHeliosSection from './schemas/whyHeliosSection'
import caseStudySection from './schemas/caseStudySection'
import gpuModel from './schemas/gpuModel'
import pricingTier from './schemas/pricingTier'
import pricingPageSection from './schemas/pricingPageSection'
import legalPage from './schemas/legalPage'
import coreValueProposition from './schemas/coreValueProposition'
import careersPage from './schemas/careersPage'
import contactPage from './schemas/contactPage'
import pressPage from './schemas/pressPage'
import eventsPage from './schemas/eventsPage'
import inferenceModel from './schemas/inferenceModel'
import inferencePricing from './schemas/inferencePricing'

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
    logoBar,
    modelLibrary,
    modelsSection,
    infrastructureSection,
    lifecycleSection,
    whyHeliosSection,
    caseStudySection,
    coreValueProposition,

    // Pricing schemas
    gpuModel,
    pricingTier,
    pricingPageSection,
    inferenceModel,
    inferencePricing,

    // Blog schemas
    author,
    category,
    blogPost,

    // Page builder
    page,

    // Legal schemas
    legalPage,

    // New standalone pages
    careersPage,
    contactPage,
    pressPage,
    eventsPage,
]
