# Sanity CMS Setup Guide

This project uses Sanity CMS (v3/v5 compatible) to manage landing page sections and blog content.

## 🏗 Architecture
- **Root Studio**: The Sanity Studio is integrated directly into the root of the project using `sanity.config.ts`.
- **Schema Management**: All schemas are defined in the `sanity/schemas/` directory and registered in `sanity/schema.ts`.
- **Frontend Integration**: The Sanity client is configured in `src/lib/sanity.ts`. Data fetching uses TanStack Query via the `useSanityQuery` hook in `src/hooks/useSanityData.ts`.

## ⚙️ Configuration
- **Project ID**: `05vcm5dh`
- **Dataset**: `production`
- **Environment Variables**:
  - `VITE_SANITY_PROJECT_ID`: Used by the frontend and studio.
  - `VITE_SANITY_DATASET`: Set to `production`.
  - `SANITY_WRITE_TOKEN`: Required for CLI migration scripts.

## 🚀 Running the Studio
To manage content locally, run:
```bash
npm run sanity
```
The studio will be available at [http://localhost:3333](http://localhost:3333).

## 🛠 Tech Stack
- **React 19**: Required for Sanity 5 support.
- **Port**: 3333 for Studio, 8080 for the Vite frontend.
- **Toolkit**: `@sanity/client`, `@sanity/image-url`, `@portabletext/react`, `@sanity/code-input`.
