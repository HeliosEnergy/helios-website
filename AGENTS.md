# Agent Instructions

This directory is the source of truth for the production Helios website.

- Use this repo for `helios.co`: `/Users/amoldericksoans/Documents/Helios/helios-website`
- GitHub repo: `HeliosEnergy/helios-website`
- Vercel project: `helios-website`
- Production branch: `main`
- App framework: Vite + React, not Next.js.

Do not make production website changes in:

- `/Users/amoldericksoans/Documents/Helios/website/helios-landing-page`
- temporary worktrees under `/tmp`

Before deploying or checking Vercel, confirm:

```sh
git remote -v
vercel project inspect helios-website
```

Expected Git remotes:

```text
origin -> https://github.com/HeliosEnergy/helios-website.git
myfork -> https://github.com/AmolDerickSoans/fireworks-clone.git
```

Expected Vercel production domains:

- `helios.co`
- `www.helios.co`
- `helioscloud.org`
- `www.helioscloud.org`
- `heliosenergy.io`
- `www.heliosenergy.io`
- `heliosenergy.ai`
- `www.heliosenergy.ai`
