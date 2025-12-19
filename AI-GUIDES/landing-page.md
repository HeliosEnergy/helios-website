# Changing Landing Page Content

The landing page (`src/pages/Index.tsx`) is dynamic and its layout is controlled by Sanity.

## 🏗 The Page Builder
The "Home Page" document in Sanity (type: `page`) allows you to:
1.  Set the page title and slug (`home`).
2.  **Sections**: An array of references to specific section documents.
3.  **Reordering**: You can drag and drop sections in the Sanity Studio to change their appearance order on the frontend.

## 📑 Supported Sections
The following schemas are mapped in `Index.tsx`:
- `announcementBanner`: The thin top bar.
- `heroSection`: Main heading and primary/secondary CTAs.
- `logoBar`: Scrolling reel of customer logos.
- `useCasesSection`: Features grid with icons and stats.
- `modelsSection`: Interactive model library carousel.
- `infrastructureSection`: Interactive accordion with custom illustrations.
- `lifecycleSection`: Build/Tune/Scale lifecycle grid.
- `whyHeliosSection`: Audience comparison cards (AI Natives vs Enterprise).
- `testimonialsSection`: Customer quotes carousel.
- `caseStudySection`: Split-view section with stats card.
- `blogSection`: Latest 3 blog articles.
- `ctaSection`: Bottom call-to-action bar.

## 🛠 Adding/Removing Sections
1.  **To add**: Go to the **Page** document for "Home Page", click "Add Item", and select an existing section or create a new one.
2.  **To remove**: Delete the reference from the **Sections** array in the Page document.
3.  **To edit content**: Open the specific section document (e.g., "Hero Section") and update its fields.

## 🧩 Component Mapping
The mapping between Sanity types and React components is defined in `src/pages/Index.tsx`:
```typescript
const sectionMap: Record<string, React.ComponentType<any>> = {
  announcementBanner: AnnouncementBanner,
  heroSection: HeroSection,
  useCasesSection: UseCasesSection,
  testimonialsSection: TestimonialsSection,
  ctaSection: CTASection,
  blogSection: BlogSection,
  // ... placeholders
};
```
If adding a NEW section type, you must also add it to this `sectionMap`.
