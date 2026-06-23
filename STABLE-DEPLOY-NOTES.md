# Samui Connect — Stable Vercel Fix

This build fixes the blinking / hanging screen.

What changed:
- Removed the PWA service worker from the build because old service-worker cache can make Vercel previews blink or load stale JS.
- Added an automatic service-worker and cache cleaner so old broken deployments stop controlling the page.
- Removed the Base44 Vite plugin from the Vercel build and kept a standard Vite + React config.
- Added safe demo mode when Base44 env vars are missing, so the app opens instead of hanging on auth/public-settings.
- Added local demo data for Rooms, Events, Explore profiles, Work Connect, messages and DM threads.
- Fixed the AuthContext bug where authChecked stayed false after public-settings failed.

Vercel source deployment:
Framework: Vite
Install Command: npm install --include=dev --legacy-peer-deps --no-audit --no-fund
Build Command: npm run build
Output Directory: dist

Emergency static deployment:
Use the static ZIP, choose Framework "Other", leave Install Command and Build Command empty.
