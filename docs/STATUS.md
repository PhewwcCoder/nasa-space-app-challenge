# Status

## Current phase
Phase 1 playable prototype complete: prologue + Apollo 11 + Mars signal teaser. No later chapter implemented.

## Redesign validated / 2026-09-25
User explicitly waived further interview pauses. Pinterest reference fetched, preflight completed, measurable mechanisms recorded in bar.md. Rebuild implemented: player-controlled 3D landing with touch/keyboard/assist, actual NASA imagery, detailed NASA-derived descent model, in-world component separation, retained three discoveries and real Mars teaser. Three rendered critics now pass all pieces. Published successfully on 2026-09-25.

The original scroll-based descent was superseded by the user's explicit direct-flight request. One persistent canvas and shared inspector remain. See ARCHITECTURE.md and ASSETS.md for code and source provenance.

Desktop and mobile/reduced-motion full journeys passed after refinements, with explicit sourced-note and mobile-control checks. Failure/retry passed at both breakpoints. Pure simulation tests pass at 15,30,60,144fps plus unsafe touchdown, braking, purity and timestep limits. TypeScript and production build pass. Three.js vendor chunk is 336KB gzip; Vite reports a non-blocking chunk-size advisory. Design-loop progress: docs/DESIGN_LOOP.md. Public deployment is now the piloted NASA-asset redesign, saved version 2, source commit 66d5c831b6834d0bf7823f580892e7c0a6a18063. Anonymous access and core asset requests verified after publication.

## Access
Public, no ChatGPT login. Existing project in .openai/hosting.json, never create a duplicate. https://mersa-petrova-archive.bracunasa.chatgpt.site

## Known limits
NASA-derived hardware is an adapted reconstruction, not an exact site survey. Terrain uses photographic color over authored geometry. Alien ship and flight handling are fictional. Mars remains a teaser. Session progress resets on refresh; opt-in interface tones only. Chromium desktop and mobile emulation are tested; physical Safari/iOS and low-end devices are not yet verified.

## Commands
npm run dev; npm run typecheck; npm run build; npm run test:e2e.

## Landing and discovery revision / 2026-09-26
Implemented a cockpit-led opening from the user-provided reference, first-person real-time descent, keyboard-responsive handle overlays, default assisted landing with manual override, a third-person W/arrow/touch walk along authored footprint geometry, and an accessible skip-walk option. One randomly selected question from three NASA-sourced questions is presented by Miso, a generated fictional alien cat; answering is optional.

Apollo inspection now starts assembled with a clipping-plane cross-section. The complete NASA lunar-module model is available as an explicitly labeled historical reconstruction; the surface keeps the descent stage. Six clues (Eagle, footprints, camera, seismometer, retroreflector, plaque/disc) reveal concise fictional interpretations and gate the requested evidence conclusion. Camera, seismometer, and message interactions are schematic learning illustrations. More detailed text and model tools stay collapsed until requested.

Higgsfield generation is pending: two browser availability checks returned no connected browsers and no Higgsfield connector is available. User is connecting a browser. Current opening is a real-time implementation with the supplied concept image, not a Higgsfield-generated video. No new public version has been published.

Validation complete for the local playable revision: TypeScript, production build and pure flight simulation tests passed. All four desktop/mobile-reduced journey and failure/retry tests passed; both full journeys passed again after the final material and source-note layout fixes. Rendered desktop and mobile captures were inspected under docs/qa/landing. Fixed pointer access for new inspector controls, decorative button accessibility names, initial paused cockpit camera and source-note spacing. Browser testing is Chromium emulation, not physical iOS. The existing non-blocking Three.js chunk-size advisory remains. Higgsfield clip and public publication remain pending; no Higgsfield generation was submitted.

## Higgsfield CLI setup / 2026-09-26
Installed `@higgsfield/cli` globally (1.1.26), completed OAuth authentication, and installed all eight companion skills with `npx skills add higgsfield-ai/skills` into the project's `.agents/skills`. Selected the account's only workspace, Private. Authenticated video model catalog access succeeded. Browser automation is no longer required for CLI generation. The workspace reports a free plan and 0 credits; no generation was submitted. Earlier notes about missing Higgsfield access are superseded by this setup.

## Open canopy and learning posters / 2026-09-26
Local revision implements a much larger unobstructed windshield, exactly two live instrument displays (telemetry and map), camera-relative procedural 3D gloves and sticks, and stable forward framing. Assisted steering remains enabled during input, limits speed, damps drift and holds near the ground until aligned. Manual control remains optional; retry returns to assisted mode.

Eagle parts are directly selectable with blue highlighting, spatial labels and accessible equivalent buttons. Cross-section and Separate hardware are visible primary controls. Miso presents transparent, scrollable right-hand learning posters with live text and matching supplied illustrations; phones use a lower panel. Engine, structure, landing gear and retroreflector have sourced learning content. Reference art is explicitly conceptual. No new Higgsfield generation or public deployment was made.

Validation: pure flight tests pass, including held assisted steering at 15/60/144 fps, automatic recovery after release, near-ground alignment hold and manual drift damping. Typecheck and production build pass (existing non-blocking Three.js chunk advisory). All four desktop and mobile/reduced-motion journey and failure/retry tests pass. Screenshots reviewed at docs/qa/open-canopy; corrected mobile spatial-target overlap, poster illustration switching and inspection-return visibility. Final desktop and mobile full journeys also passed after glove placement and pointer-return checks. Under slower rendering, tests initially raced the timed intro and scene loading; readiness checks and walking timeout were corrected, then affected journeys passed. Final screenshots confirm visible mobile gloves and contrasting controls. Physical mobile devices remain unverified.
