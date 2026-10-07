# Sol-3: The Human Trace

Team Petrova's interactive space archaeology experience: prologue, Apollo 11, Chapter 2 - Sojourner, Chapter 3 - Spirit, Chapter 4 - Opportunity on Mars, and Chapter 5 - Voyager 1 in deep space.

## Chapter 5 Voyager 1 / current scope

Voyager 1 is now playable through Archive Index or the completed Opportunity story. Five investigations connect a NASA-based Blender spacecraft, radio communication, the Golden Record, Pale Blue Dot and Miso's final report. Read [Chapter 5](docs/CHAPTER_5.md) for sources, reconstruction limits and implementation; [Status](docs/STATUS.md) records validation and publication. Desktop-only testing is requested.

## Run

Install with `npm install`, then `npm run dev`. Open the local URL printed by Vite. Node 22 or newer is recommended.

`npm run typecheck` checks TypeScript. `npm run build` produces static output in dist. With the dev server running and Chrome installed, `npm run test:e2e` runs desktop and mobile/reduced-motion journeys.

Start a new development session with AGENTS.md and docs/STATUS.md. Source narrative and asset provenance live in source-material and docs/ASSETS.md.

## Play

[Play Sol-3 on Cloudflare](https://nasa-space-app-challenge.aryan-sharar.workers.dev/) - public, no login. The latest source changes in this repository may appear there only after a separate Cloudflare deployment.

Land in third person: WASD/arrows steer, release stops drift, and Space brakes for touchdown. Flight assist starts off; touch controls and optional assist are available. Walk or skip to the unknown hardware, scan it, and explore six discoveries. See complete Eagle first, then use See what remains today for its lower stage. Choose a part to pull it out with blue edge outlines and a white field note with Miso and nine sentences of flowing prose; click again to return it. Footprints appear immediately. FIELD GUIDE opens a white study page with the mission overview, crew, timeline, experiments, photos and interactive code. The separate Apollo code entrance links to VS Code for the Web. Replay the supplied historical landing and first-step recordings from their scenes. Archive all six discoveries to hear the next signal. Continue through a continuous lift-off and descent, approach the small rover, and recover four Mars records. Prologue, Apollo 11, Sojourner, Spirit, Opportunity and Voyager 1 are freely accessible from the Archive Index from the start; switching chapters retains discoveries.

Run `node tests/flight.cjs` for pure flight checks. Current architecture and interaction contracts are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

NASA imagery and model credits are in the in-game archive and docs/ASSETS.md. The alien craft, terrain placement and disassembly are interpretive, not an exact survey.

For desktop-only website verification: `npx playwright test --project=desktop`. Chapter 2 has mobile layouts and reduced-motion support; mobile testing is skipped at the user's request. Read the current summary at the top of docs/STATUS.md before older historical logs to minimize context.

The current hardware pattern adds right-edge flight instruments, gray flowing dust, an authored astronaut walk, warmer metallic Eagle materials, direct-open inspection, and a surface journey/log sidebar. Read [the reusable hardware journey contract](docs/HARDWARE_JOURNEY.md) before extending another hardware journey.


UI revision (2026-10-05): direct-open clue inspection, cosmic explorer, animated discovery/code icons, expanded NASA seismic exhibit and refined hardware guidance. See docs/STATUS.md for desktop validation and provenance.

## Spirit and expanded Mars evidence

Spirit follows Apollo's teaching pattern with a Blender-refined NASA twin-rover reconstruction, three separable assemblies, five investigations and a sourced field guide. Follow the Sojourner ending to Gusev or select Spirit directly from Archive Index. Rock abrasion, silica-rich soil and the final mission record lead to a twin-rover signal and a journey to playable Chapter 4.

Chapter 2 now includes NASA airbag, ramp and backshell evidence, a four-stage landing lesson and a deployment interaction. Read [the source audit and Chapter 1 comparison](docs/CHAPTER_3.md). Playable on the current Cloudflare deployment. Current desktop checks: `npx playwright test --project=desktop`; mobile testing remains deferred.

## Opportunity

Choose **04 - OPPORTUNITY** from Archive Index, or finish Spirit and continue to Meridiani Planum. Six investigations cover the rover, Challenger Memorial Station, heat shield and meteorite, mineral blueberries, Purgatory Dune and the final mission record. Miso has original dialogue, sourced NASA photographs and three separable hardware lessons. Its completed story now continues to Voyager 1. Read [the source audit and chapter structure](docs/CHAPTER_4.md).

Opportunity uses `assets/blender/opportunity-refined.blend`. Rebuild with `blender --background --factory-startup --python scripts/build-opportunity.py`; the common MER builder exports its separate `public/models/opportunity-refined.glb`. Chapter changes preserve the persistent Canvas and reuse prepared scene resources.

## Rover authoring and inspection quality

Spirit's editable model is `assets/blender/spirit-refined.blend`; rebuild it with Blender 4.5 using `blender --background --factory-startup --python scripts/build-spirit.py`. The script retains the NASA base and adds reference-inspired wheels, suspension, camera hardware, solar cells and wiring, then exports `public/models/spirit-refined.glb`. It is an illustrative reconstruction, not exact engineering geometry.

Wheel/pinch and buttons share artifact-specific closest distances in `src/three/inspectionZoom.ts`. Eagle stops at the supplied whole-model framing. Zoom out, rotation, reset and inspection entry/exit retain their behavior. Canvas resolution follows device pixel ratio up to 2. Mars uses authored soil relief, textured stones, layered ridges and dust-colored sky. See `docs/ASSETS.md` for provenance.

## Deploy

After `npm run build`, run `npx wrangler deploy` while signed into the existing Cloudflare account. `wrangler.jsonc` targets the existing `nasa-space-app-challenge` Worker and uploads only `dist`. GitHub pushes alone do not publish the site.
