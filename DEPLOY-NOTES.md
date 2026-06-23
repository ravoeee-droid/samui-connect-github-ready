# Vercel Deploy Fix

This version avoids the Vercel npm/pnpm URLSearchParams bug by using Yarn Classic 1.22.22 via Corepack.

Vercel settings:
- Framework Preset: Vite
- Install Command: `corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --ignore-engines --network-timeout 100000 --non-interactive`
- Build Command: `yarn build`
- Output Directory: `dist`
- Node.js Version: 20.x / 20.18.1

Important: remove old Vercel project cache or create a new Vercel project.
