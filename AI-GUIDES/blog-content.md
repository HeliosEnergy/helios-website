# Managing Blog Content

The blog system is modeled after the Fireworks AI design, featuring a two-column layout with a sticky Table of Contents.

## 📝 Document Types
1.  **blogPost**: The main article.
    - Fields: `title`, `slug`, `author` (Reference), `heroImage`, `categories` (Reference Array), `publishedAt`, `body` (Portable Text), `excerpt`.
2.  **author**: The person writing the post.
    - Fields: `name`, `slug`, `image`, `bio`.
3.  **category**: Groups of posts.
    - Fields: `title`, `slug`, `description`.

## 🎨 Rich Text (Portable Text)
The `body` field supports:
- **Headings (H2, H3)**: These are automatically extracted by the frontend `TableOfContents.tsx` component to build the sidebar navigation.
- **Code Blocks**: Handled by `@sanity/code-input`. Supported languages include JS, TS, Python, Bash, and JSON.
- **Images**: Supports hotspots for better cropping control.

## 🔗 Internal Logic
- **TOC**: The `PortableTextRenderer.tsx` component generates anchor IDs for all `h2` and `h3` tags based on their text content (e.g., "Intro" becomes `#intro`).
- **Slugs**: Slugs are generated from the title. Ensure they are unique.

## 🔄 Adding Content
1. Start the studio: `npm run sanity`.
2. Create an **Author** and **Category** first.
3. Create a **Blog Post**, link the author/category, and add content using the block editor.
4. Publish the post to see it on the `/blog` page.
