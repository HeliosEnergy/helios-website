# Helios Website

Production marketing site for Helios.

## Source of Truth

- GitHub repository: `HeliosEnergy/helios-website`
- Production branch: `main`
- Vercel project: `helios-website`
- Local working directory: `/Users/amoldericksoans/Documents/Helios/helios-website`

Do not use the old Next.js app under `website/helios-landing-page` for production website changes.

## Production Domains

- `helios.co`
- `www.helios.co`
- `helioscloud.org`
- `www.helioscloud.org`
- `heliosenergy.io`
- `www.heliosenergy.io`
- `heliosenergy.ai`
- `www.heliosenergy.ai`

Legacy domains are handled in `src/lib/domainRedirect.ts` and `src/lib/site.ts`.

## Development

```sh
npm install --legacy-peer-deps
npm run dev
```

## Build

```sh
npm run build
```

Vercel production builds use:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Analytics

Microsoft Clarity is loaded only for Vercel production builds.

- Clarity project ID: `whq1fqokkl`
- Loader: `src/lib/microsoftClarity.ts`
- Production gate: `VERCEL_ENV=production`
