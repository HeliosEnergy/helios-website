import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity'

export function useSanityQuery<T>(name: string, query: string, params: Record<string, any> = {}) {
    return useQuery({
        queryKey: [name, params],
        queryFn: () => client.fetch<T>(query, params),
    })
}

export const QUERIES = {
    announcementBanner: `*[_type == "announcementBanner" && enabled == true][0]`,
    heroSection: `*[_type == "heroSection"][0]`,
    useCasesSection: `*[_type == "useCasesSection"][0]`,
    testimonialsSection: `*[_type == "testimonialsSection"][0]`,
    ctaSection: `*[_type == "ctaSection"][0]`,

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
  }`
}
