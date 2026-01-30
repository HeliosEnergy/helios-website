# EPIC: SEO Foundation & Search Visibility

**Epic ID:** SEO-001
**Created:** 2026-01-16
**Owner:** Engineering Team
**Status:** Planning
**Priority:** P0 - Critical
**Estimated Effort:** 3-4 Sprints (6-8 weeks)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Background & Context](#background--context)
3. [Problem Statement](#problem-statement)
4. [Goals & Success Metrics](#goals--success-metrics)
5. [User Stories](#user-stories)
6. [Technical Architecture](#technical-architecture)
7. [Implementation Phases](#implementation-phases)
8. [Detailed Task Breakdown](#detailed-task-breakdown)
9. [Dependencies](#dependencies)
10. [Risks & Mitigations](#risks--mitigations)
11. [Acceptance Criteria](#acceptance-criteria)
12. [Appendix](#appendix)

---

## Executive Summary

Helios Cloud's current website is a **client-side React SPA** that is fundamentally invisible to search engines. This epic addresses critical SEO gaps that prevent the site from ranking in Google, capturing organic traffic, and competing for high-value keywords like "GPU cloud inference", "AI model API", and "LLM fine-tuning".

**Current State:** SEO Score 32/100 (Critical)
**Target State:** SEO Score 85+/100 (Optimized)

### Key Deliverables

1. **Dynamic Meta Tag System** - Per-page titles, descriptions, and Open Graph tags
2. **Sitemap Generation** - Auto-generated XML sitemap for all content
3. **Structured Data (JSON-LD)** - Rich snippets for blog posts, models, and organization
4. **Pre-rendering/SSR Solution** - Server-side rendering for crawlability
5. **SEO Content Infrastructure** - CMS fields, canonical URLs, and internal linking

---

## Background & Context

### Current Technology Stack

| Layer | Technology | SEO Impact |
|-------|------------|------------|
| **Frontend** | React 19 + Vite 5 | ❌ Client-side only, no SSR |
| **Routing** | React Router 6 | ❌ Hash/browser routing, no server awareness |
| **CMS** | Sanity Studio | ✅ Headless, flexible schemas |
| **Styling** | Tailwind CSS | ✅ No impact |
| **Data Fetching** | TanStack Query | ✅ Efficient caching |
| **Build** | Vite | ⚠️ No SSR by default |

### Historical Context

The codebase shows evidence of a **migration FROM Next.js TO Vite+React**:
- `/old site files/` directory contains Next.js artifacts
- Migration scripts exist (`migrate-to-sanity.ts`, `migrate-core-value.ts`)
- This migration **removed SSR capabilities** that Next.js provided

### Why This Matters

1. **Google's JavaScript Rendering:** While Googlebot can render JavaScript, it's a two-phase process that can take days/weeks. Pre-rendered content is indexed immediately.

2. **Competitive Landscape:** Competitors like Replicate, Modal, and RunPod have SEO-optimized sites ranking for GPU cloud keywords.

3. **Content Investment:** The team is creating blog posts and model documentation, but none of it can be found via search.

4. **Revenue Impact:** For B2B SaaS, 30-50% of qualified leads typically come from organic search.

### Current SEO Audit Findings

| Category | Score | Critical Issues |
|----------|-------|-----------------|
| Technical SEO | 4/25 | No SSR, static meta tags, no sitemap |
| On-Page SEO | 5/25 | SEO fields unused, no dynamic titles |
| Content Structure | 10/20 | Placeholder links, no internal linking |
| Crawlability | 4/15 | No sitemap, SPA rendering issues |
| Performance | 9/15 | Font loading, no image optimization |
| **TOTAL** | **32/100** | **Critical - Immediate action required** |

---

## Problem Statement

### Primary Problem

> **Helios Cloud's website cannot be properly indexed by search engines because it renders entirely in the browser via JavaScript. All pages share identical meta tags, there is no sitemap, and SEO content fields in the CMS are not utilized.**

### Secondary Problems

1. **Wasted Content Effort:** Blog posts with `seoTitle` and `seoDescription` fields are created in Sanity, but these values never reach the `<head>` of the HTML.

2. **No Rich Snippets:** Without structured data, Google cannot display enhanced search results (star ratings, author info, pricing, etc.).

3. **Duplicate Content Signals:** Every page has the same title "Helios Cloud" and description "HeliosCloud Generated Project", signaling low-quality content to Google.

4. **Model Library Invisibility:** High-value pages like `/model-library/gpt-4` cannot rank for searches like "GPT-4 API pricing comparison" because they have no unique metadata.

5. **No Discovery Path:** Without a sitemap, Google relies solely on link crawling to find pages, missing dynamically-generated blog posts and model pages.

---

## Goals & Success Metrics

### Primary Goals

| Goal | Metric | Current | Target | Timeline |
|------|--------|---------|--------|----------|
| **Indexable Pages** | Pages in Google Index | ~5 | 100+ | 8 weeks |
| **Unique Titles** | Pages with unique `<title>` | 0 | 100% | 4 weeks |
| **Sitemap Coverage** | URLs in sitemap | 0 | All public URLs | 2 weeks |
| **Structured Data** | Pages with JSON-LD | 0 | All content pages | 6 weeks |
| **Core Web Vitals** | LCP, FID, CLS passing | Unknown | All green | 8 weeks |

### Secondary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Organic Traffic | Monthly sessions from search | +500% in 6 months |
| Keyword Rankings | Top 20 positions for target keywords | 50+ keywords |
| Click-Through Rate | Average CTR from SERPs | >3% |
| Blog Discovery | Blog posts indexed within 48hrs | 100% |

### Success Criteria

1. All pages render unique, descriptive `<title>` and `<meta description>` tags
2. Google Search Console shows 0 crawl errors
3. Sitemap is automatically updated when content is published
4. Rich snippets appear in search results for blog posts
5. Model library pages rank for "[model name] + API/pricing/inference" keywords

---

## User Stories

### Epic User Stories

#### US-1: Dynamic Page Titles
> **As a** potential customer searching Google
> **I want** to see descriptive page titles in search results
> **So that** I can identify relevant Helios Cloud pages before clicking

**Acceptance Criteria:**
- [ ] Each page has a unique `<title>` tag
- [ ] Blog posts use: `{seoTitle || title} | Helios Cloud Blog`
- [ ] Model pages use: `{modelName} - {provider} | Helios Cloud Models`
- [ ] Homepage uses: `Helios Cloud - GPU Infrastructure for AI at Scale`
- [ ] Titles are under 60 characters

**Technical Notes:**
- Implement `react-helmet-async` for head management
- Create `<SEO>` component for consistent usage
- Hook into Sanity data for dynamic values

---

#### US-2: Meta Descriptions
> **As a** search engine
> **I want** unique meta descriptions per page
> **So that** I can display relevant snippets in search results

**Acceptance Criteria:**
- [ ] Each page has a unique `<meta name="description">` tag
- [ ] Blog posts use `seoDescription` or `excerpt` from Sanity
- [ ] Model pages use `shortDescription` from Sanity
- [ ] Descriptions are 150-160 characters
- [ ] Descriptions contain primary keywords

**Technical Notes:**
- Add `seoDescription` field to `modelLibrary` schema
- Create fallback logic: `seoDescription → shortDescription → auto-generate`

---

#### US-3: Open Graph Tags
> **As a** user sharing Helios Cloud links on social media
> **I want** rich previews with images and descriptions
> **So that** shared links look professional and informative

**Acceptance Criteria:**
- [ ] All pages have `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Blog posts use `heroImage` for `og:image`
- [ ] Model pages use provider logo or model icon for `og:image`
- [ ] Twitter Card tags mirror Open Graph values
- [ ] Images are 1200x630px for optimal display

**Technical Notes:**
- Create default OG image for pages without specific images
- Use Sanity image URL builder with dimensions: `.width(1200).height(630)`

---

#### US-4: XML Sitemap
> **As a** search engine crawler
> **I want** an XML sitemap listing all public URLs
> **So that** I can discover and index all content efficiently

**Acceptance Criteria:**
- [ ] Sitemap available at `/sitemap.xml`
- [ ] Includes all static pages (/, /pricing, /blog, /model-library, /tnc)
- [ ] Includes all blog post URLs with `lastmod` dates
- [ ] Includes all model library URLs
- [ ] `robots.txt` references sitemap location
- [ ] Sitemap regenerates on content publish

**Technical Notes:**
- Build-time generation for static pages
- Sanity webhook or scheduled job for dynamic content
- Consider sitemap index for >50,000 URLs

---

#### US-5: Structured Data (JSON-LD)
> **As a** search engine
> **I want** structured data markup on content pages
> **So that** I can display rich snippets in search results

**Acceptance Criteria:**
- [ ] Homepage has `Organization` schema
- [ ] Blog posts have `Article` schema with author, date, image
- [ ] Model pages have `SoftwareApplication` or `Product` schema
- [ ] Pricing page has `Product` schema with pricing
- [ ] All schemas validate in Google Rich Results Test

**Technical Notes:**
- Create `<JsonLd>` component for each schema type
- Pull data from Sanity queries
- Test with https://search.google.com/test/rich-results

---

#### US-6: Canonical URLs
> **As a** search engine
> **I want** canonical URL tags on every page
> **So that** I know which URL version to index for duplicate content

**Acceptance Criteria:**
- [ ] Every page has `<link rel="canonical" href="...">`
- [ ] Canonical URLs use consistent format (with/without trailing slash)
- [ ] Dynamic pages use their clean URL as canonical
- [ ] Query parameters don't create duplicate canonicals

**Technical Notes:**
- Base URL from environment variable
- Handle `/model-library?filter=LLM` → canonical to `/model-library`

---

#### US-7: Pre-rendering for Crawlers
> **As a** search engine bot
> **I want** to receive pre-rendered HTML
> **So that** I can index page content without executing JavaScript

**Acceptance Criteria:**
- [ ] Googlebot receives full HTML with content
- [ ] Meta tags are present in initial HTML response
- [ ] Content is not hidden behind JavaScript rendering
- [ ] Time to First Byte (TTFB) < 500ms for bots

**Technical Notes:**
- Options: Vite SSR, Next.js migration, or prerender.io service
- Evaluate trade-offs in Technical Architecture section

---

#### US-8: SEO CMS Fields
> **As a** content editor
> **I want** SEO fields in the CMS for every content type
> **So that** I can optimize pages for specific keywords

**Acceptance Criteria:**
- [ ] `modelLibrary` schema has `seoTitle`, `seoDescription` fields
- [ ] All SEO fields have helper text explaining best practices
- [ ] Character counters show title (60) and description (160) limits
- [ ] Preview shows how page will appear in Google

**Technical Notes:**
- Add validation rules for character limits
- Consider Sanity SEO plugin for SERP preview

---

#### US-9: Internal Linking
> **As a** search engine crawler
> **I want** internal links between related content
> **So that** I can discover and understand content relationships

**Acceptance Criteria:**
- [ ] Blog posts link to relevant model pages
- [ ] Model pages link to related blog posts
- [ ] Footer contains links to all main sections
- [ ] Breadcrumbs provide hierarchical navigation
- [ ] No broken internal links (href="#" removed)

**Technical Notes:**
- Audit all `href="#"` placeholders and replace with real URLs
- Create "Related Models" component for blog posts
- Create "Related Articles" component for model pages

---

#### US-10: Performance Optimization
> **As a** Google ranking algorithm
> **I want** fast page load times and good Core Web Vitals
> **So that** I can rank the site higher in search results

**Acceptance Criteria:**
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Fonts don't cause FOUT/FOIT
- [ ] Images are lazy-loaded and properly sized

**Technical Notes:**
- Self-host fonts or use `font-display: swap`
- Implement `loading="lazy"` for images
- Code-split heavy components (3D, shaders)

---

## Technical Architecture

### Option Analysis: SSR/Pre-rendering Approaches

| Approach | Effort | Performance | Maintenance | Recommendation |
|----------|--------|-------------|-------------|----------------|
| **A: Vite SSR** | High | Excellent | Medium | ⭐ Long-term best |
| **B: Next.js Migration** | Very High | Excellent | Low | Best if starting fresh |
| **C: Prerender.io SaaS** | Low | Good | Low | ⭐ Quick win |
| **D: Static Pre-rendering** | Medium | Excellent | Medium | Good for mostly static |

### Recommended Hybrid Approach

**Phase 1 (Immediate):** Implement `react-helmet-async` + Prerender.io
- Get meta tags working immediately
- Prerender.io handles bot detection and serves static HTML
- Minimal code changes required

**Phase 2 (Medium-term):** Add Vite SSR
- Implement server-side rendering for critical pages
- Better performance for all users, not just bots
- More control over rendering

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   User Request   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   CDN / Edge     │
                    │   (Cloudflare)   │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  Is Search Bot? │          │  Regular User   │
     │  (User-Agent)   │          │                 │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  Prerender.io   │          │  Vite Static    │
     │  (Cached HTML)  │          │  (React SPA)    │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  Full HTML with │          │  Client-side    │
     │  Meta Tags      │          │  Rendering      │
     └─────────────────┘          └─────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                       COMPONENT ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

src/
├── components/
│   └── seo/
│       ├── SEO.tsx              # Main SEO component
│       ├── JsonLd.tsx           # Structured data wrapper
│       ├── schemas/
│       │   ├── OrganizationSchema.tsx
│       │   ├── ArticleSchema.tsx
│       │   ├── ProductSchema.tsx
│       │   └── BreadcrumbSchema.tsx
│       └── utils/
│           ├── generateMeta.ts   # Meta tag generation
│           └── truncate.ts       # Title/desc truncation
│
├── hooks/
│   └── useSEO.ts                # SEO data hook
│
└── lib/
    └── sitemap/
        ├── generate.ts          # Sitemap generation
        └── config.ts            # Sitemap configuration


┌─────────────────────────────────────────────────────────────────┐
│                         SEO COMPONENT USAGE                      │
└─────────────────────────────────────────────────────────────────┘

// Example: BlogPost.tsx
import { SEO } from '@/components/seo/SEO';
import { ArticleSchema } from '@/components/seo/schemas/ArticleSchema';

const BlogPost = () => {
  const { data: post } = useSanityQuery(...);

  return (
    <>
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        image={urlFor(post.heroImage).width(1200).height(630).url()}
        type="article"
        url={`/blog/${post.slug.current}`}
      />
      <ArticleSchema
        title={post.title}
        author={post.author.name}
        publishedAt={post.publishedAt}
        image={urlFor(post.heroImage).url()}
      />
      {/* Page content */}
    </>
  );
};
```

### Data Flow for SEO

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sanity    │────▶│  React App  │────▶│   <head>    │
│   CMS       │     │  Component  │     │   Tags      │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │
      │   seoTitle         │   <SEO            │   <title>
      │   seoDescription   │    title=...      │   <meta>
      │   heroImage        │    desc=...       │   <link>
      │   slug             │    image=...      │   <script type="ld+json">
      │                    │   />              │
      ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Content    │     │  react-     │     │  Rendered   │
│  Editor     │     │  helmet-    │     │  HTML       │
│  Input      │     │  async      │     │  Output     │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation (Sprint 1-2)
**Goal:** Get basic SEO infrastructure working

| Task | Story | Effort | Owner |
|------|-------|--------|-------|
| Install react-helmet-async | US-1 | 1h | Dev |
| Create `<SEO>` component | US-1, US-2, US-3 | 4h | Dev |
| Update index.html base meta tags | US-1 | 1h | Dev |
| Add SEO component to all pages | US-1 | 4h | Dev |
| Add `seoTitle`, `seoDescription` to modelLibrary schema | US-8 | 2h | Dev |
| Update Sanity queries to include SEO fields | US-8 | 2h | Dev |
| Create canonical URL helper | US-6 | 2h | Dev |
| **Phase 1 Total** | | **16h** | |

### Phase 2: Sitemap & Robots (Sprint 2)
**Goal:** Enable search engine discovery

| Task | Story | Effort | Owner |
|------|-------|--------|-------|
| Create sitemap generation script | US-4 | 4h | Dev |
| Add build step for sitemap | US-4 | 2h | Dev |
| Update robots.txt with sitemap reference | US-4 | 0.5h | Dev |
| Set up Sanity webhook for sitemap refresh | US-4 | 4h | Dev |
| Submit sitemap to Google Search Console | US-4 | 1h | Dev |
| **Phase 2 Total** | | **11.5h** | |

### Phase 3: Structured Data (Sprint 3)
**Goal:** Enable rich snippets in search results

| Task | Story | Effort | Owner |
|------|-------|--------|-------|
| Create `<JsonLd>` base component | US-5 | 2h | Dev |
| Create OrganizationSchema | US-5 | 2h | Dev |
| Create ArticleSchema for blog posts | US-5 | 3h | Dev |
| Create ProductSchema for models | US-5 | 3h | Dev |
| Create BreadcrumbSchema | US-5 | 2h | Dev |
| Validate all schemas with Google tool | US-5 | 2h | QA |
| **Phase 3 Total** | | **14h** | |

### Phase 4: Pre-rendering (Sprint 3-4)
**Goal:** Serve indexable HTML to search engines

| Task | Story | Effort | Owner |
|------|-------|--------|-------|
| Set up Prerender.io account | US-7 | 1h | Dev |
| Configure middleware/CDN for bot detection | US-7 | 4h | DevOps |
| Test with Google Mobile-Friendly Test | US-7 | 2h | QA |
| Test with Fetch as Google in Search Console | US-7 | 1h | QA |
| Monitor cache hit rates | US-7 | Ongoing | DevOps |
| **Phase 4 Total** | | **8h** | |

### Phase 5: Content & Links (Sprint 4)
**Goal:** Improve content discoverability and internal linking

| Task | Story | Effort | Owner |
|------|-------|--------|-------|
| Audit and fix all `href="#"` placeholders | US-9 | 4h | Dev |
| Create "Related Models" component | US-9 | 4h | Dev |
| Create "Related Articles" component | US-9 | 4h | Dev |
| Add internal links to footer | US-9 | 2h | Dev |
| Review and update all image alt texts | US-2 | 3h | Content |
| **Phase 5 Total** | | **17h** | |

### Phase 6: Performance (Sprint 4)
**Goal:** Pass Core Web Vitals

| Task | Story | Effort | Owner |
|------|-------|--------|-------|
| Self-host Google Fonts | US-10 | 2h | Dev |
| Implement image lazy loading | US-10 | 2h | Dev |
| Code-split 3D/shader components | US-10 | 4h | Dev |
| Add Sanity image size parameters | US-10 | 2h | Dev |
| Run Lighthouse audit and fix issues | US-10 | 4h | Dev |
| **Phase 6 Total** | | **14h** | |

### Total Effort Summary

| Phase | Effort | Sprint |
|-------|--------|--------|
| Phase 1: Foundation | 16h | 1-2 |
| Phase 2: Sitemap & Robots | 11.5h | 2 |
| Phase 3: Structured Data | 14h | 3 |
| Phase 4: Pre-rendering | 8h | 3-4 |
| Phase 5: Content & Links | 17h | 4 |
| Phase 6: Performance | 14h | 4 |
| **TOTAL** | **80.5h** | **4 sprints** |

---

## Detailed Task Breakdown

### Task 1.1: Install react-helmet-async

```bash
npm install react-helmet-async
```

Update `src/App.tsx`:
```tsx
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {/* ... existing code ... */}
      </QueryClientProvider>
    </HelmetProvider>
  );
}
```

---

### Task 1.2: Create SEO Component

Create `src/components/seo/SEO.tsx`:

```tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  author?: string;
  publishedAt?: string;
}

const SITE_NAME = 'Helios Cloud';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://helioscloud.dev';
const DEFAULT_IMAGE = `${BASE_URL}/og-default.png`;

export const SEO = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  noindex = false,
  author,
  publishedAt,
}: SEOProps) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const truncatedDesc = description.length > 160
    ? description.substring(0, 157) + '...'
    : description;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDesc} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@HeliosCloud" />

      {/* Article-specific */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
    </Helmet>
  );
};
```

---

### Task 1.5: Update modelLibrary Schema

Update `sanity/schemas/modelLibrary.ts`:

```typescript
// Add after shortDescription field (line 211)
defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    description: 'Custom title for search engines (max 60 characters)',
    validation: Rule => Rule.max(60).warning('SEO titles should be under 60 characters'),
    group: 'seo',
}),
defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 3,
    description: 'Custom description for search engines (max 160 characters)',
    validation: Rule => Rule.max(160).warning('SEO descriptions should be under 160 characters'),
    group: 'seo',
}),
defineField({
    name: 'seoImage',
    title: 'SEO Image',
    type: 'image',
    description: 'Custom image for social sharing (1200x630px recommended)',
    options: { hotspot: true },
    group: 'seo',
}),

// Add field groups at the end of the schema
groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'technical', title: 'Technical Details' },
    { name: 'seo', title: 'SEO' },
],
```

---

### Task 2.1: Create Sitemap Generation Script

Create `scripts/generate-sitemap.ts`:

```typescript
import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '05vcm5dh',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-12-19',
});

const BASE_URL = process.env.VITE_BASE_URL || 'https://helioscloud.dev';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

async function generateSitemap() {
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { path: '/', changefreq: 'weekly' as const, priority: 1.0 },
    { path: '/pricing', changefreq: 'weekly' as const, priority: 0.9 },
    { path: '/blog', changefreq: 'daily' as const, priority: 0.8 },
    { path: '/model-library', changefreq: 'daily' as const, priority: 0.9 },
    { path: '/tnc', changefreq: 'monthly' as const, priority: 0.3 },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${BASE_URL}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  // Blog posts from Sanity
  const blogPosts = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(`
    *[_type == "blogPost"] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  blogPosts.forEach(post => {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post._updatedAt.split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
    });
  });

  // Models from Sanity
  const models = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(`
    *[_type == "modelLibrary"] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  models.forEach(model => {
    urls.push({
      loc: `${BASE_URL}/model-library/${model.slug}`,
      lastmod: model._updatedAt.split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public folder
  const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated with ${urls.length} URLs: ${outputPath}`);
}

generateSitemap().catch(console.error);
```

Add to `package.json`:
```json
{
  "scripts": {
    "generate:sitemap": "npx tsx scripts/generate-sitemap.ts",
    "build": "npm run generate:sitemap && vite build"
  }
}
```

---

### Task 3.2: Create ArticleSchema Component

Create `src/components/seo/schemas/ArticleSchema.tsx`:

```tsx
import { Helmet } from 'react-helmet-async';

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  image: string;
  url: string;
}

export const ArticleSchema = ({
  title,
  description,
  author,
  publishedAt,
  modifiedAt,
  image,
  url,
}: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Helios Cloud',
      logo: {
        '@type': 'ImageObject',
        url: 'https://helioscloud.dev/logos/logo-black.svg',
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
```

---

## Dependencies

### External Dependencies

| Dependency | Purpose | Risk |
|------------|---------|------|
| Prerender.io | Bot detection & pre-rendering | Medium - external service |
| Google Search Console | Monitoring & submission | Low - free Google service |
| Sanity Webhooks | Sitemap regeneration | Low - existing integration |

### Internal Dependencies

| Dependency | Blocker For | Status |
|------------|-------------|--------|
| Environment variables (`VITE_BASE_URL`) | SEO component, sitemap | Needs setup |
| Sanity schema changes | SEO fields in CMS | Requires migration |
| Build pipeline update | Sitemap generation | DevOps task |

### Technical Dependencies

```json
{
  "dependencies": {
    "react-helmet-async": "^2.0.0"
  }
}
```

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Prerender.io costs escalate** | Medium | Medium | Set up caching rules, monitor usage, have Vite SSR as backup |
| **Sanity schema migration breaks existing content** | Low | High | Test migration in staging, backup data, use additive changes only |
| **Google doesn't index pre-rendered pages** | Low | High | Test with Search Console before full rollout |
| **Performance regression from helmet** | Low | Medium | Benchmark before/after, lazy load where possible |
| **SEO changes don't improve rankings** | Medium | Medium | Set realistic expectations, SEO takes 3-6 months |

---

## Acceptance Criteria

### Phase 1 Complete When:
- [ ] Every page has unique `<title>` tag visible in browser tab
- [ ] View Source shows correct meta description per page
- [ ] Social sharing shows correct preview on Twitter/LinkedIn
- [ ] Sanity CMS has SEO fields for all content types

### Phase 2 Complete When:
- [ ] `/sitemap.xml` returns valid XML with all URLs
- [ ] `robots.txt` contains `Sitemap:` directive
- [ ] Sitemap submitted to Google Search Console
- [ ] New content appears in sitemap within 24 hours

### Phase 3 Complete When:
- [ ] All blog posts pass Google Rich Results Test
- [ ] Organization schema on homepage validates
- [ ] Breadcrumb schema on detail pages validates

### Phase 4 Complete When:
- [ ] `curl -A "Googlebot" https://helioscloud.dev/blog/test-post` returns full HTML
- [ ] Google Search Console shows pages as "Crawled - currently not indexed" → "Indexed"
- [ ] Mobile-Friendly Test shows content rendered

### Phase 5 Complete When:
- [ ] Zero `href="#"` links in codebase
- [ ] Blog posts have "Related Models" section
- [ ] Model pages have "Related Articles" section

### Phase 6 Complete When:
- [ ] Lighthouse Performance score > 90
- [ ] Core Web Vitals all green in Search Console
- [ ] No layout shifts on page load

---

## Appendix

### A. Keyword Research Suggestions

| Category | Target Keywords | Search Volume | Difficulty |
|----------|-----------------|---------------|------------|
| **GPU Cloud** | gpu cloud computing, gpu instances, cloud gpu rental | High | High |
| **AI Inference** | ai inference api, llm inference, model serving | Medium | Medium |
| **Fine-tuning** | llm fine tuning, custom ai model training | Medium | Medium |
| **Specific Models** | gpt-4 api alternative, llama 3 hosting, mistral api | Medium | Low |
| **Pricing** | gpu cloud pricing, ai api cost comparison | High | Medium |

### B. Competitor SEO Analysis

| Competitor | Domain Authority | Indexed Pages | Top Rankings |
|------------|------------------|---------------|--------------|
| Replicate | 65 | 50,000+ | "run ai models", "stable diffusion api" |
| Modal | 55 | 10,000+ | "serverless gpu", "python gpu cloud" |
| RunPod | 50 | 20,000+ | "cheap gpu cloud", "gpu rental" |
| Together.ai | 60 | 15,000+ | "llm api", "inference api" |

### C. Technical SEO Checklist

- [ ] Unique title tags (< 60 chars)
- [ ] Unique meta descriptions (< 160 chars)
- [ ] Canonical URLs on all pages
- [ ] XML Sitemap submitted
- [ ] robots.txt properly configured
- [ ] Structured data validates
- [ ] Mobile-friendly test passes
- [ ] Core Web Vitals passing
- [ ] HTTPS enabled
- [ ] No broken links (4xx errors)
- [ ] No redirect chains
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Image alt texts present
- [ ] Hreflang tags (if multi-language)

### D. Monitoring & Reporting

**Weekly Metrics:**
- Pages indexed (Google Search Console)
- Crawl errors (Google Search Console)
- Average position for target keywords

**Monthly Metrics:**
- Organic traffic (Google Analytics)
- Keyword rankings (Ahrefs/SEMrush)
- Backlinks acquired
- Core Web Vitals scores

**Quarterly Review:**
- ROI of SEO investment
- Competitive positioning
- Content gap analysis
- Technical debt assessment

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-16 | Claude | Initial epic creation |

---

*This document should be reviewed and updated as implementation progresses.*
