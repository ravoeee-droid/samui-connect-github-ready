# Samui Connect Next Changes

This version adds the next growth layer:

- Multilingual app foundation: English, German, Thai, Russian, French
- Floating language switcher in the app layout
- Language settings block inside Profile
- Translated bottom navigation
- Multilingual Rentals copy and WhatsApp request messages
- Provider access CTA for vehicle/stay owners
- Better onboarding goals: people, events, vehicles, stays, work, family, local services
- Vercel build command hardened with `yarn --ignore-engines build`

## Recommended Vercel Settings

Framework: Vite

Install Command:
corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --ignore-engines --network-timeout 100000 --non-interactive

Build Command:
yarn --ignore-engines build

Output Directory:
dist

Node.js:
20.x

After upload:
Redeploy with Clear Build Cache.
