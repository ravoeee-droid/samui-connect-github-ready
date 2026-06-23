# Samui Connect Platform Structure

This version upgrades Samui Connect from mobile app prototype to platform structure.

## Added

- Public landingpage at `/`
- Premium login page at `/login`
- Protected app area moved to `/app`
- Provider dashboard placeholder at `/provider`
- Legal placeholder pages:
  - `/legal/privacy`
  - `/legal/terms`
- Contact page at `/contact`
- Desktop-friendly landingpage
- Desktop-friendly app container
- Mobile app bottom nav stays focused on app usage
- Language switcher on public pages and login

## Recommended Routing

- `/` public SEO landingpage
- `/login` login / registration entry
- `/app` mobile-first app
- `/app/rentals` rentals marketplace
- `/provider` provider acquisition and future dashboard
- `/legal/privacy`
- `/legal/terms`
- `/contact`

## Vercel Settings

Framework Preset: Vite

Install Command:
corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --ignore-engines --network-timeout 100000 --non-interactive

Build Command:
yarn --ignore-engines build

Output Directory:
dist

Node.js Version:
20.x

After replacing files:
Redeploy with Clear Build Cache.
