// Sanity document types
export interface HeroSection {
  _type: 'heroSection';
  _id: string;
  heading: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface UseCase {
  _type: 'useCase';
  icon: string;
  title: string;
  description: string;
  tag: string;
  stat: string;
  statLabel: string;
}

export interface UseCasesSection {
  _type: 'useCasesSection';
  _id: string;
  sectionLabel?: string;
  heading: string;
  description: string;
  useCases: UseCase[];
}

export interface CoreValueCard {
  _type: 'object';
  title: string;
  description: string;
}

export interface CoreValueProposition {
  _type: 'coreValueProposition';
  _id: string;
  heading?: string;
  description?: string;
  cards?: CoreValueCard[];
}

export interface Testimonial {
  _type: 'testimonial';
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface TestimonialsSection {
  _type: 'testimonialsSection';
  _id: string;
  sectionLabel?: string;
  heading: string;
  testimonials: Testimonial[];
}

export interface LogoBar {
  _type: 'logoBar';
  _id: string;
  title?: string;
  logos?: string[];
}