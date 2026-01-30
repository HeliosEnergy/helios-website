import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity'

export function useSanityQuery<T>(name: string, query: string, params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: [name, params],
    queryFn: () => client.fetch<T>(query, params),
  })
}

export const QUERIES = {
  announcementBanner: `*[_type == "announcementBanner" && enabled == true][0]`,
  heroSection: `*[_type == "heroSection"][0]`,
  useCasesSection: `*[_type == "useCasesSection"][0] {
    ...,
    useCases[] {
      ...,
      "image": image.asset->url
    }
  }`,
  testimonialsSection: `*[_type == "testimonialsSection"][0]`,
  ctaSection: `*[_type == "ctaSection"][0]`,
  coreValueProposition: `*[_type == "coreValueProposition"][0]`,

  blogPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    heroImage,
    excerpt,
    "author": author->name
  }`,

  blogPost: `*[_type == "blogPost" && slug.current == $slug][0] {
    ...,
    "author": author-> {
      name,
      image,
      bio
    },
    "categories": categories[]->title
  }`,

  page: `*[_type == "page" && slug.current == $slug][0] {
    ...,
    sections[]->
  }`,

  legalPage: `*[_type == "legalPage"][0] {
    title,
    lastUpdated,
    content
  }`,
  careersPage: `*[_type == "careersPage"][0]`,
  contactPage: `*[_type == "contactPage"][0]`,
  pressPage: `*[_type == "pressPage"][0]`,
  eventsPage: `*[_type == "eventsPage"][0]`,
  inferenceModels: `*[_type == "inferenceModel"] | order(displayOrder asc) {
    _id,
    id,
    name,
    category,
    pricePerSecond,
    estimationUnit,
    description,
    provider
  }`
}
