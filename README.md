# Samui Connect

Premium Koh Samui community app with social rooms, events, gamification, rentals, vehicles and stays.

## What is included

- Vite + React app
- Premium tropical image system
- XP, levels, streaks and badges
- Connect / Explore profiles
- Live rooms and messages
- Events page
- Rentals page with Vehicles + Stays tabs
- WhatsApp request flow
- Demo mode without Base44 environment variables
- Vercel config prepared for GitHub deploy using pnpm

## Local development

```bash
npm install --include=dev --legacy-peer-deps --no-audit --no-fund
npm run dev
```

The app runs in demo mode if no Base44 app id is provided.

## Deploy with GitHub + Vercel

1. Create a new GitHub repository.
2. Upload/push all files from this folder to the repo root.
3. In Vercel: **Add New Project** > import the GitHub repo.
4. Framework preset: **Vite**.
5. Vercel should read `vercel.json` automatically.

Recommended settings:

- Install Command: `corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm install --no-frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist`

## Demo mode

For a public preview without Base44, set:

```bash
VITE_FORCE_DEMO=true
```

When Base44 is ready, add the real values from `.env.example` to Vercel and remove/disable `VITE_FORCE_DEMO`.

## Important

Do not deploy this by repeatedly dragging random ZIP versions into an old Vercel project. Use GitHub import so Vercel receives a clean repo root every time.
