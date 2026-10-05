# Status

## GitHub source release / 2026-10-06

User authorized committing and pushing the completed work to the existing GitHub main branch. This release includes Chapters 2 and 3, their source evidence and tests, Spirit Blender authoring files and runtime model, Mars terrain improvements, shared inspection zoom limits and updated documentation. Local QA screenshots and Blender backup files remain outside the commit. Validation is recorded below; release preparation only removed trailing whitespace from the model component. Website deployment is unchanged and requires a separate release.

## Zoom limit and Spirit visual refinement / 2026-10-06

Implemented and desktop-verified locally; not deployed. The latest user request supersedes the initial Chapter 3 visual treatment. Shared artifact-specific camera minima now constrain wheel/pinch and button zoom consistently; Eagle stops at 17 scene units, approximately its original whole-model inspection pose. Existing zoom increments, far limits, rotations, reset destinations and entry/exit transitions are preserved. Canvas DPR now supports up to 2.

Spirit uses a locally authored Blender refinement of the untouched NASA input: 76,657 triangles, 25 material batches, 6.28 MiB Draco GLB. The editable source is assets/blender/spirit-refined.blend; scripts/build-spirit.py reproduces it. New explicit photovoltaic cells, ribbed wheels/hubs, suspension bearings, mast optics, arm fittings, panels and harnesses follow the supplied visual references. Three teaching assemblies remain selectable/separable. It is a reference-based reconstruction, not an exact engineering model or preservation survey.

Both Mars chapters share revised procedural soil relief, textured irregular stones, layered hills and a dust-colored gradient sky. Spirit adds revised mineral-brown lighting, HDR reflections and finer shadow framing. Desktop captures at 1920x1080 show the assembled model, all separated assemblies and a readable lesson panel. Typecheck, production build and pure flight checks pass; the existing bundle-size advisory remains. Fourteen distinct desktop cases passed across the regression and focused reruns. The broad run passed all eleven existing journey cases plus Eagle/Sojourner zoom; the new Spirit zoom case exceeded a five-second cold-load scan expectation. After waiting for the identified heading with a fifteen-second allowance, all three zoom checks and the full Spirit hardware/guide journey passed together (four tests, 1.3 minutes). Checks measure actual R3F camera distance for repeated buttons and wheel input, then verify zoom out, reset, Escape and one canvas. Earlier exploratory runs also corrected test selectors and were superseded by these stable runs. Reviewed final 1920x1080 and short 1366x768 captures, including separated hardware and readable notes. The editable Blender file reopened with all thirteen images packed and all four assembly values present. A final visual pass replaced the smooth abrasion placeholder with an irregular sediment-layered rock; the final production build and full Spirit hardware/evidence/guide journey passed again (35.7 seconds). Mobile testing is skipped as requested. No deployment, commit, push, paid generation or cloud model project.

## Chapter 3 Spirit and Chapter 2 evidence / 2026-10-06

Implemented and desktop-verified locally. Not deployed. The user explicitly authorized Chapter 3 and supplied XLSX/DOCX resources for Chapter 2. This section supersedes earlier scope limits: Prologue, Apollo 11, Sojourner and Spirit are built and freely available. Opportunity and Voyager remain unavailable.

Spirit carries forward Apollo's detailed-model teaching pattern with the NASA/VTAD twin-rover GLB, three separable/selectable assemblies, warm-white Miso lessons, five evidence investigations and the final twin signal. The original Canvas, shared inspector, chapter revisits and in-memory discoveries remain. A ten-second fictional Mars traverse supports pause, skip and reduced motion. Chapter 2 gains real airbag/ramp/backshell photographs, a four-stage landing reconstruction and relay/deployment interaction. Read CHAPTER_3.md for the Chapter 1 comparison, source corrections and full behavior.

Validation completed: final typecheck and production build pass (624 modules); pure flight checks pass. Eleven distinct desktop Playwright cases passed across focused runs: three existing Apollo cases, four Mars cases and four Spirit cases. The Mars/Spirit run passed six cases in 2.6 minutes; the Apollo/Spirit regression run passed six in 3.4 minutes; the final focused run passed the new landing-evidence gate, final Spirit journey and natural/reduced-motion transit in 1.4 minutes. Full journeys report no browser page errors. Coverage includes scan naming, learning gates, component deselection/separation/isolation, camera controls, paused/skipped/natural transit, one persistent canvas, chapter revisits, freely available chapters after refresh, independent lunar counts, guide/inspector exits, focus restoration and note scroll reset.

Reviewed rendered desktop captures at 1440x900 and reduced-motion 1366x768: `docs/qa/spirit-desktop-*.png`, `mars-desktop-landing-evidence.png` and `mars-desktop-deployment-evidence.png`. Initial QA corrected a missing index label, introduced local reflections to illuminate the NASA model's metallic materials, refined the silica patch outline and made the dock use four equal columns until the fifth record appears. A final standalone browser check confirmed the four 270px columns at 1440px. Source photographs load and captions distinguish dates, spacecraft and schematic scenes. Seven NASA images and the unchanged NASA/VTAD GLB are local; exact provenance is in public/learning/spirit-resources.json.

Updated README, AGENTS, PRODUCT, ARCHITECTURE, DESIGN_SYSTEM, ASSETS, HARDWARE_JOURNEY and CHAPTER_3. The source XLSX/DOCX remain unchanged. Mobile testing was skipped per user instruction; physical mobile, Safari and low-end GPU performance remain unverified. The pre-existing non-blocking Three.js bundle-size advisory remains. Spirit's original model is 11.36 MiB, loaded on entering its scene; slower-network loading is not benchmarked. Progress resets on refresh, matching existing behavior. No deployment, commit, push, paid generation or new service connection.

## Free built-chapter access / 2026-10-05

Removed chapter unlock state and progress requirements. Prologue, Apollo 11 and Sojourner are always accessible from the Archive Index, including fresh sessions and restarts. Non-active built chapters read OPEN; the lunar signal reads MARS ARCHIVE AVAILABLE. Future unbuilt chapters remain unavailable. Artifact investigations and the cinematic narrative route remain intact. Updated README, PRODUCT and ARCHITECTURE. Typecheck, production build and targeted desktop navigation/refresh test pass; existing bundle-size advisory remains. Mobile tests skipped as requested. Local only, not deployed.

## Chapter 2 - Sojourner / 2026-10-05

Implemented locally, not deployed. This section supersedes all teaser-only scope below. The user explicitly authorized Sojourner; later chapters remain locked.

- Apollo retains its world, direct inspection, six discoveries and visual language. Its ending now quiets the lunar scene, shows a distant Mars point and fine signal line, and unlocks a continuous survey-craft departure, space transit and Mars descent within the original Canvas. Pause, skip and reduced-motion arrival are available.
- Added a wide Ares Vallis reconstruction with a small Sojourner, Pathfinder station, deflated airbags, authored tracks and distant illustrative entry remnants. Rover parts include a cell array, six treaded wheels with suspension, cameras and rear APXS. Terrain and all Mars hardware are authored, not exact surveyed geometry or NASA engineering meshes.
- Mars preserves detect/approach/scan/identify/inspect/context. Three rover component lessons reuse PartPoster and PhotoReveal. Station and airbags explain relay and arrival; three records unlock the tracks and final seven-to-83-sol reveal. NASA sources and fictional interpretations are distinct.
- The minimal Archive Index uses a native accessible dialog, locked corrupted-signal rows, session unlocks and chapter revisits without losing discoveries. It sits in free header space on desktop. Field Guide reuses the current white dialog with Mars content and sourced photography.
- Updated README, PRODUCT, ARCHITECTURE, DESIGN_SYSTEM, ASSETS and HARDWARE_JOURNEY. The supplied DOCX and image were treated as creative references, not instructions or factual authority. One unmodified NASA/JPL photo was downloaded; no generated media, credits, public deployment, commit or push.

Validation: TypeScript, production build and pure flight checks passed. Three existing Apollo desktop tests passed (full journey, failure/retry, successful manual landing). Three Mars desktop tests passed (full transit/discoveries/revisits, locked chapter guard, reduced motion at 1366x768). Canvas identity is preserved, guide/inspector exits restore focus, and the Mars journey reported no browser page errors. Reviewed screenshots at 1440x900 and 1366x768 are docs/qa/mars-desktop-*.png. Review corrected rocks floating above distant terrain, the Archive Index overlapping Eagle's title, a Mars guide header, and action contrast on the white notes. Earlier preview-script attempts were interrupted by live edits/module-fixture issues; completed Playwright runs used unchanged code. The general suite was stopped after its three Apollo desktop cases when the user requested ignoring mobile tests, then Mars was rerun explicitly with --project=desktop. Mobile tests remain unrun; physical mobile/Safari and low-end GPU performance are unverified. The pre-existing non-blocking Three.js bundle-size warning remains. Progress still resets on refresh, as in the existing app.


## Discovery dock alignment fix / 2026-10-05
Fixed archived-name overflow and vertical alignment: six equal desktop columns, shrinkable text tracks, centered labels/checkmarks, and a natural wrap point in Retroreflector. Verified bounds and vertical centers for reflector-only and all-archived states at 1280, 1440 and 1920px; desktop screenshot reviewed. Production build passes with the existing bundle-size advisory. Mobile tests skipped. Pushed fix commit bef1ca8 to GitHub main and deployed Cloudflare version 2b926e14-e054-4c8b-94db-887c601bf978. Live HTML and referenced asset hashes verified against the local build.

## Published UI release / 2026-10-05
Pushed to GitHub main: 9dd1f71 (UI and NASA assets), a741055 (documentation and deployment configuration). Deployed to https://nasa-space-app-challenge.aryan-sharar.workers.dev/ using the existing Cloudflare Worker. Production version: f62868ab-1b2f-4727-9c0e-867f563f3307. This supersedes the local-only notes below.

Final production build, pure flight checks and all three desktop e2e tests passed (2.0 minutes). Public HTTP verification returned 200; HTML matches the local build after trimming whitespace, and all three JavaScript bundles, CSS and both new NASA images match local SHA-256 hashes. Mobile testing skipped as requested. Existing non-blocking Three.js bundle-size warning remains. QA screenshots stay local and were not included in commits.

## Release preparation / 2026-10-05
Final production build, pure flight checks and all three desktop e2e tests passed (2.0 minutes). Existing non-blocking bundle-size warning remains. UI updates and NASA seismic assets are being committed and pushed to GitHub; Cloudflare configuration targets the existing Worker. Deployment verification will be recorded after publication. QA screenshots remain local. Mobile tests skipped per user instruction.

## Inspector exit placement / 2026-10-05
Moved desktop Eagle and reflector Escape/Return controls to the upper right above the reading panel, clearing the hardware. Reading panels start below the button. Desktop screenshot reviewed (docs/qa/exit-right.png); checked no button/panel overlap and click-to-exit. Mobile layout unchanged and testing skipped. Local only.

## Quiz answer feedback / 2026-10-05
Selected wrong answers now use red fill/border and an Incorrect label; the correct option receives a green border and Correct answer label after any answer. Before answering, options remain neutral. Switching to the correct answer clears the red state. Desktop interaction checks and screenshot review passed, as did typecheck. Capture: docs/qa/quiz-feedback.png. Mobile testing skipped; local only.

## Headset and Eagle label refinement / 2026-10-05
Removed the yellow helmet antenna and replaced the side accents with padded ivory/lavender headphones and a dark overhead band. Shifted the Eagle / Dissect hardware target right to clear the lander. Desktop screenshots reviewed (docs/qa/headset.png and eagle-label.png); shifted target opens inspection correctly. Headset production build and final typecheck passed. Mobile testing remains skipped. Local only.

## Current UI revision / 2026-10-05
Implemented locally, not deployed. This section supersedes older scan-transition and astronaut descriptions.

- Replaced the awkward skinned astronaut with an authored jointed cosmic survey character: purple/ivory armor, gold orbital trim, glowing accents and a star backpack, inspired by the supplied reference. Fictional design, not an Apollo suit reconstruction.
- Discovery buttons lift and reveal related SVG symbols on hover/focus. The Apollo code entrance has matching code icon feedback. Reduced motion removes transitions.
- All clues open directly on click. The extra scroll/Continue scan screen is no longer mounted; shared inspector, one canvas, exit and opener focus restoration remain.
- Seismic inspection retains the schematic meter and adds a scrollable warm-white NASA field note with a real photograph, instrument diagram, key numbers, mechanism, power/thermal context and mission outcome. Links and credits accompany evidence; fictional interpretation remains separate.
- Separate hardware is modestly brighter without changing its label or shape. A centered hint explains orbit and zoom. Decorative sky streak cadence changes from 31 to 22 seconds.
- Updated README, PRODUCT, ARCHITECTURE, DESIGN_SYSTEM, ASSETS and HARDWARE_JOURNEY.

Validation: final typecheck and production build pass (613 modules; existing non-blocking Three.js chunk-size advisory). Pure flight checks pass. All three desktop e2e cases passed: retry and manual landing in the initial run, then the complete journey on rerun (49.3 seconds including runner). The initial full-journey attempt was blocked by a Vite compile overlay from a file-encoding error, corrected before the passing rerun. Full journey verifies six discoveries, source access, separation/selection, archive gates, guide exits, focus restoration and no page errors. Visual captures reviewed at 1440x900 and 1366x768 including reduced motion: docs/qa/ui-*.png. Corrected a short-window exit overlap during review. Mobile testing explicitly skipped as requested. No public deployment or generated media.


## GitHub source update / 2026-09-28
The student hardware journey and preceding local revisions are being published to the GitHub repository. README now points to the user-provided Cloudflare Workers URL. A GitHub source push does not deploy the Cloudflare site; the live build must be verified or deployed separately. QA screenshots remain local because they are large generated review artifacts.

## Current local revision / student hardware journey / 2026-09-27
Implemented and desktop-verified locally. Not deployed. This section takes precedence over all earlier revision summaries.

- Flight measurements now occupy the right edge; map and steering controls leave the central flight path clear. Gray, turbulent shader sheets replace solid dust particles.
- NASA's static astronaut mesh now has an authored nine-bone skeleton with opposing arm/leg swings, knee/elbow bends and a smooth rest pose. The backpack remains rigid. This is approximate artistic skinning, not a NASA animation.
- Eagle uses warm metallic gold/copper foil with irregular crease shading and distinct charcoal/silver upper-shell surfaces. Source GLBs are unchanged. Fixed the upper-shell grouping so cabin panels stay with Structure rather than Landing gear.
- Selecting hardware opens a native scroll-driven GSAP camera scan. Forward/reverse scrubbing, Continue scan, Escape/Return and immediate reduced-motion entry are supported in the existing canvas.
- Miso hardware notes use a warm-white right-hand reading panel with a credited photo and nine sentences in two flowing paragraphs. Physics, official sources and fictional interpretation remain distinct.
- The surface sidebar shows expedition milestones, actual archived count, latest log and links to the archive and Apollo mission guide. It scrolls within shorter desktop windows.
- Read [HARDWARE_JOURNEY.md](HARDWARE_JOURNEY.md) for the reusable sequence, content template, code ownership and validation contract before extending another authorized hardware journey. PRODUCT, ARCHITECTURE, DESIGN_SYSTEM, ASSETS and README are updated.

Validation: typecheck, pure flight checks and production build pass (617 modules; existing non-blocking Three.js chunk-size advisory). All three desktop Playwright tests passed (5.1 minutes), including full journey, scan forward/reverse, manual landing and failure/retry. After the final shell-grouping and backpack-weight refinements, the complete desktop journey passed again (1.7 minutes). Additional desktop visual checks at 1440x900 and 1366x768 verified normal/reduced-motion inspection, scan bypass, journey/archive links and two walking poses; no browser page or console errors. Reviewed captures are in `docs/qa/current-*.png` and `docs/qa/immersive`. An initial test run failed because the scan button's decorative arrow was included in its accessible name; fixed with aria-hidden before the passing runs. A concurrent standalone capture timed out during navigation and passed when rerun independently. Mobile testing was intentionally skipped at the user's request. No new generated media or public deployment.

## Previous local revision (historical context)
Previous local revision: forward approach, extracted hardware lessons, astronaut, historical audio and white Apollo study guide (2026-09-27). This older summary is retained as history; the current section above supersedes it. Local only; not deployed.

### Read this first (context-efficient handoff)
- Larger third-person craft follows a shallow forward corridor; hills frame the approach and low dust appears near landing. Assist remains OFF by default. Two HUD screens are retained.
- Complete Eagle is the initial historical reconstruction. See what remains today switches to its descent stage. Selected parts move outward with blue edges only; clicking again deselects and returns them. Original NASA materials remain unchanged.
- Four photo-first floating lessons (structure, engine, gear, reflector) each contain nine simple lines, a Miso quote, equation and official source.
- NASA generic astronaut mesh replaces the primitive figure. It is a static pose, not a rigged gait or exact Apollo suit. Terrain is flat beneath the walking route.
- User-supplied landing and first-step MP3s are local, replayable and controlled by global mute. Landing event playback is opt-in; browser restrictions have a replay fallback.
- Visible Apollo code CTA opens a repository preview linked to VS Code for the Web and interactive source explanations.
- FIELD GUIDE now uses a warm white reading surface. MissionOverview.tsx adds crew, objective, six expandable milestones, surface science and return journey from the supplied NASA mission text. Dates explain the first step's July 21 UTC / July 20 US distinction.
- Read ARCHITECTURE.md for implementation contracts, PRODUCT.md for scope, DESIGN_SYSTEM.md for current visual treatment and ASSETS.md for provenance. Earlier log sections are historical, not current requirements.

Validation: TypeScript and pure flight tests passed. All 3 desktop Playwright tests passed (2.0 minutes), covering full journey, retry and controlled manual landing. Additional desktop reduced-motion captures checked white guide/timeline, model composition and native MP3 playback (first-step duration 12.953 seconds, play time advanced, global mute paused it). Screenshots: docs/qa/immersive. Production build passed (610 modules; existing non-blocking Three.js chunk-size advisory). One earlier run failed because a new test used Mute sound instead of the actual Mute audio label; fixed before the passing run. A terrain regression affecting astronaut feet was also fixed and visually checked. User explicitly requested skipping further mobile testing; mobile validation is deferred for this revision. Existing Vite Three.js chunk-size advisory remains. No new generation or deployment.

Phase 1 playable prototype complete: prologue + Apollo 11 + Mars signal teaser. No later chapter implemented.

## Redesign validated / 2026-09-25
User explicitly waived further interview pauses. Pinterest reference fetched, preflight completed, measurable mechanisms recorded in bar.md. Rebuild implemented: player-controlled 3D landing with touch/keyboard/assist, actual NASA imagery, detailed NASA-derived descent model, in-world component separation, retained three discoveries and real Mars teaser. Three rendered critics now pass all pieces. Published successfully on 2026-09-25.

The original scroll-based descent was superseded by the user's explicit direct-flight request. One persistent canvas and shared inspector remain. See ARCHITECTURE.md and ASSETS.md for code and source provenance.

Desktop and mobile/reduced-motion full journeys passed after refinements, with explicit sourced-note and mobile-control checks. Failure/retry passed at both breakpoints. Pure simulation tests pass at 15,30,60,144fps plus unsafe touchdown, braking, purity and timestep limits. TypeScript and production build pass. Three.js vendor chunk is 336KB gzip; Vite reports a non-blocking chunk-size advisory. Design-loop progress: docs/DESIGN_LOOP.md. Public deployment is now the piloted NASA-asset redesign, saved version 2, source commit 66d5c831b6834d0bf7823f580892e7c0a6a18063. Anonymous access and core asset requests verified after publication.

## Access
Public, no ChatGPT login. Existing project in .openai/hosting.json, never create a duplicate. https://mersa-petrova-archive.bracunasa.chatgpt.site

## Known limits
NASA-derived hardware is an adapted reconstruction, not an exact site survey. Terrain uses photographic color over authored geometry. Alien ship and flight handling are fictional. Mars remains a teaser. Session progress resets on refresh; interface tones and historical radio playback are opt-in. Chromium desktop and mobile emulation are tested; physical Safari/iOS and low-end devices are not yet verified.

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


## Third-person landing and Apollo field guide / 2026-09-27

Implemented the requested return to a visible third-person survey craft, elevated approach view and closer touchdown framing while preserving the minimalist opening and two HUD displays. Landing starts centered horizontally with the ring ahead. Manual flight remains off-assist on launch, retry and restart. Responsive speed control and release damping make steering easier; capped manual descent gives time to align, while Space/touch brake is still needed for safe landing. Optional assist remains available.

Wrong quiz answers explicitly say "Oops, not quite" and explain the right answer. Eagle starts unselected and assembled. Selection uses faint material highlighting and a fine halo; repeated selection removes the checkmark, poster and isolation while retaining viewed-part progress. Footprints display at full exposure and are immediately archiveable. No exposure slider remains.

Miso panels are more transparent and show real NASA photo previews before the detailed facts. Photos unfold with hover, keyboard focus or tap, retain captions/source links, and show their full image when expanded. FIELD GUIDE is one optional scrollable page after identification: NASA lander/camera stories in short English plus three real Apollo guidance code excerpts with selectable lines, live explanations and pinned original-source links. Six local photographs include explicitly identified Apollo 13 training, and the three local public-domain source files preserve attribution. Occasional decorative sky glows and streaks are credited as fictional, disabled for reduced motion and suspended while paused.

Updated README, PRODUCT, ARCHITECTURE, DESIGN_SYSTEM and ASSETS. This is a local revision; the earlier public URL has not been redeployed. No generated image/video credits were spent.

Validation complete: typecheck and production build pass; pure flight tests pass at 15/30/60/144 fps, including manual approach and held braking. All six end-to-end tests pass (4.3 minutes): desktop and mobile/reduced-motion full journeys, failure/retry and successful manual landings using keyboard or the on-screen pointer controls. The final mobile-only spacing refinement also passed targeted photo expansion, complete footprint-note and nested guide-exit checks. Screenshots were reviewed under `docs/qa/third-person`; early review caught and corrected ring/HUD overlap, flight heading overlap, footprint text overlap, poster photo placement and guide focus restoration. The guide preserves the underlying inspector on Escape and restores opener focus. Tests wait for live flight telemetry before steering; editing during an earlier test run caused hot-reload/input resets, so the final suite ran against unchanged source. No browser page errors in the complete journeys. Existing non-blocking Three.js bundle-size advisory remains (about 336KB gzip). Chrome desktop and mobile emulation were checked; physical iOS/Safari and low-end hardware remain unverified.
