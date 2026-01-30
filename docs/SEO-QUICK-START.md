# SEO Quick-Start Implementation Guide

**Reference:** [Full Epic Document](./EPIC-SEO-IMPLEMENTATION.md)

This guide gets you from zero to basic SEO in under 2 hours.

---

## Step 1: Install Dependencies (5 min)

```bash
npm install react-helmet-async
```

---

## Step 2: Update App.tsx (5 min)

```tsx
// src/App.tsx
import { HelmetProvider } from 'react-helmet-async';

// Wrap everything with HelmetProvider
const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ... existing routes ... */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
```

---

## Step 3: Create SEO Component (15 min)

Create `src/components/seo/SEO.tsx`:

```tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

const SITE_NAME = 'Helios Cloud';
const BASE_URL = 'https://helioscloud.dev'; // TODO: Use env var
const DEFAULT_IMAGE = `${BASE_URL}/og-default.png`;

export const SEO = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
}: SEOProps) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = `${BASE_URL}${url}`;
  const desc = description.slice(0, 160);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
```

---

## Step 4: Add to Pages (30 min)

### Homepage (src/pages/Index.tsx)

```tsx
import { SEO } from '@/components/seo/SEO';

const Index = () => {
  return (
    <>
      <SEO
        title="Helios Cloud - GPU Infrastructure for AI at Scale"
        description="Deploy AI models with enterprise-grade GPU infrastructure. Serverless inference, fine-tuning, and model deployment made simple."
        url="/"
      />
      {/* existing content */}
    </>
  );
};
```

### Blog Post (src/pages/BlogPost.tsx)

```tsx
import { SEO } from '@/components/seo/SEO';

const BlogPost = () => {
  const { data: post } = useSanityQuery(...);

  if (!post) return null;

  return (
    <>
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt || ''}
        image={post.heroImage ? urlFor(post.heroImage).width(1200).height(630).url() : undefined}
        url={`/blog/${post.slug.current}`}
        type="article"
      />
      {/* existing content */}
    </>
  );
};
```

### Model Details (src/pages/ModelDetailsPage.tsx)

```tsx
import { SEO } from '@/components/seo/SEO';

const ModelDetailsPage = () => {
  const { data: model } = useSanityQuery(...);

  if (!model) return null;

  return (
    <>
      <SEO
        title={model.seoTitle || `${model.name} - ${model.provider}`}
        description={model.seoDescription || model.shortDescription || model.description || ''}
        url={`/model-library/${model.slug.current}`}
        type="product"
      />
      {/* existing content */}
    </>
  );
};
```

### Other Pages

| Page | Title | Description |
|------|-------|-------------|
| `/blog` | "Blog - Helios Cloud" | "Latest insights on AI infrastructure, GPU computing, and machine learning." |
| `/pricing` | "Pricing - Helios Cloud" | "Transparent GPU pricing. Pay only for what you use with serverless inference." |
| `/model-library` | "Model Library - Helios Cloud" | "Explore 100+ AI models ready to deploy. LLMs, image generation, embeddings, and more." |
| `/tnc` | "Terms of Service - Helios Cloud" | (use content from Sanity) |

---

## Step 5: Update Sanity Schema (10 min)

Add to `sanity/schemas/modelLibrary.ts`:

```typescript
// Add these fields after line 210 (after shortDescription)
defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    description: 'Custom title for search engines (max 60 chars)',
    validation: Rule => Rule.max(60),
}),
defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 3,
    description: 'Custom description for search engines (max 160 chars)',
    validation: Rule => Rule.max(160),
}),
```

---

## Step 6: Update index.html (5 min)

Replace placeholder meta tags in `index.html`:

```html
<head>
  <!-- ... existing head content ... -->

  <title>Helios Cloud - GPU Infrastructure for AI at Scale</title>
  <meta name="description" content="Deploy AI models with enterprise-grade GPU infrastructure. Serverless inference, fine-tuning, and model deployment made simple." />
  <meta name="author" content="Helios Cloud" />

  <meta property="og:title" content="Helios Cloud - GPU Infrastructure for AI at Scale" />
  <meta property="og:description" content="Deploy AI models with enterprise-grade GPU infrastructure. Serverless inference, fine-tuning, and model deployment made simple." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://helioscloud.dev/og-default.png" />
  <meta property="og:url" content="https://helioscloud.dev" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@HeliosCloud" />
  <meta name="twitter:title" content="Helios Cloud - GPU Infrastructure for AI at Scale" />
  <meta name="twitter:description" content="Deploy AI models with enterprise-grade GPU infrastructure." />
  <meta name="twitter:image" content="https://helioscloud.dev/og-default.png" />
</head>
```

---

## Step 7: Create Default OG Image (10 min)

Create a 1200x630px image at `public/og-default.png` with:
- Helios Cloud logo
- Tagline
- Dark background matching brand

---

## Step 8: Update robots.txt (2 min)

Add sitemap reference to `public/robots.txt`:

```text
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /

Sitemap: https://helioscloud.dev/sitemap.xml
```

---

## Verification Checklist

After implementation, verify:

- [ ] Open each page and check browser tab shows unique title
- [ ] View Page Source → confirm `<title>` and `<meta description>` are correct
- [ ] Share a blog post URL on Twitter/Slack → preview shows correct image
- [ ] Run `npm run build` → no errors

---

## What's Next?

After completing this quick-start:

1. **Sitemap Generation** - See Phase 2 in epic
2. **Structured Data** - See Phase 3 in epic
3. **Pre-rendering** - See Phase 4 in epic

---

## Common Issues

### Title not updating?
- Make sure `HelmetProvider` wraps the entire app
- Check that `SEO` component is rendered (not inside a conditional that might be false)

### OG image not showing in preview?
- Image must be absolute URL (not relative)
- Image must be publicly accessible
- Clear social media preview cache (use LinkedIn Post Inspector, Twitter Card Validator)

### Multiple meta tags appearing?
- Only render one `SEO` component per page
- Check that index.html base tags aren't conflicting (react-helmet should override them)
