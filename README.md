# MERSA - The Human Trace

Team Petrova's Phase 1 interactive space archaeology experience: prologue, Apollo 11, and a Mars signal teaser.

## Run

Install with `npm install`, then `npm run dev`. Open the local URL printed by Vite. Node 22 or newer is recommended.

`npm run typecheck` checks TypeScript. `npm run build` produces static output in dist. With the dev server running and Chrome installed, `npm run test:e2e` runs desktop and mobile/reduced-motion journeys.

Start a new development session with AGENTS.md and docs/STATUS.md. Source narrative and asset provenance live in source-material and docs/ASSETS.md.

## Play

[Play MERSA on Cloudflare](https://nasa-space-app-challenge.aryan-sharar.workers.dev/) - public, no login. The latest source changes in this repository may appear there only after a separate Cloudflare deployment.

Land in third person: WASD/arrows steer, release stops drift, and Space brakes for touchdown. Flight assist starts off; touch controls and optional assist are available. Walk or skip to the unknown hardware, scan it, and explore six discoveries. See complete Eagle first, then use See what remains today for its lower stage. Choose a part to pull it out with blue edge outlines and a white field note with Miso and nine sentences of flowing prose; click again to return it. Footprints appear immediately. FIELD GUIDE opens a white study page with the mission overview, crew, timeline, experiments, photos and interactive code. The separate Apollo code entrance links to VS Code for the Web. Replay the supplied historical landing and first-step recordings from their scenes. Archive all six discoveries to reveal the Mars teaser.

Run `node tests/flight.cjs` for pure flight checks. Current architecture and interaction contracts are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

NASA imagery and model credits are in the in-game archive and docs/ASSETS.md. The alien craft, terrain placement and disassembly are interpretive, not an exact survey.

For desktop-only website verification: `npx playwright test --project=desktop`. Current user preference is to defer mobile testing. Read the current summary at the top of docs/STATUS.md before older historical logs to minimize context.

The current hardware pattern adds right-edge flight instruments, gray flowing dust, an authored astronaut walk, warmer metallic Eagle materials, direct-open inspection, and a surface journey/log sidebar. Read [the reusable hardware journey contract](docs/HARDWARE_JOURNEY.md) before extending another hardware journey.


UI revision (2026-10-05): direct-open clue inspection, cosmic explorer, animated discovery/code icons, expanded NASA seismic exhibit and refined hardware guidance. See docs/STATUS.md for desktop validation and provenance.

## Deploy

After `npm run build`, run `npx wrangler deploy` while signed into the existing Cloudflare account. `wrangler.jsonc` targets the existing `nasa-space-app-challenge` Worker and uploads only `dist`. GitHub pushes alone do not publish the site.
