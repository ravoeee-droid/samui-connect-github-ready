# Deploy Notes

This repository is configured for GitHub → Vercel deployment.

The previous npm bug (`Exit handler never called`) happened during Vercel's npm install step. To avoid this, `vercel.json` uses Corepack + pnpm instead of Vercel's default `npm install`.

Use a new Vercel project if the old one still has cached build settings.

## Vercel settings

Framework: Vite  
Install: `corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm install --no-frozen-lockfile`  
Build: `pnpm run build`  
Output: `dist`

## If Vercel ignores settings

Open Project Settings → Build & Development Settings and override them manually with the values above.
