# Status

## Current phase
Phase 1 playable prototype complete: prologue + Apollo 11 + Mars signal teaser. No later chapter implemented.

## Redesign validated / 2026-09-25
User explicitly waived further interview pauses. Pinterest reference fetched, preflight completed, measurable mechanisms recorded in bar.md. Rebuild implemented: player-controlled 3D landing with touch/keyboard/assist, actual NASA imagery, detailed NASA-derived descent model, in-world component separation, retained three discoveries and real Mars teaser. Three rendered critics now pass all pieces. Public publication follows the successful production build.

The original scroll-based descent was superseded by the user's explicit direct-flight request. One persistent canvas and shared inspector remain. See ARCHITECTURE.md and ASSETS.md for code and source provenance.

Desktop and mobile/reduced-motion full journeys passed after refinements, with explicit sourced-note and mobile-control checks. Failure/retry passed at both breakpoints. Pure simulation tests pass at 15,30,60,144fps plus unsafe touchdown, braking, purity and timestep limits. TypeScript and production build pass. Three.js vendor chunk is 336KB gzip; Vite reports a non-blocking chunk-size advisory. Design-loop progress: docs/DESIGN_LOOP.md. Existing public deployment remains the prior prototype until publishing completes.

## Access
Public, no ChatGPT login. Existing project in .openai/hosting.json, never create a duplicate. https://mersa-petrova-archive.bracunasa.chatgpt.site

## Known limits
NASA-derived hardware is an adapted reconstruction, not an exact site survey. Terrain uses photographic color over authored geometry. Alien ship and flight handling are fictional. Mars remains a teaser. Session progress resets on refresh; opt-in interface tones only. Chromium desktop and mobile emulation are tested; physical Safari/iOS and low-end devices are not yet verified.

## Commands
npm run dev; npm run typecheck; npm run build; npm run test:e2e.
