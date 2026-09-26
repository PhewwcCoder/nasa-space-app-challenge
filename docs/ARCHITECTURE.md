# Architecture

React + TypeScript + Vite, Zustand and one persistent React Three Fiber canvas. The user requested direct spacecraft control, replacing the previous scroll-based descent with a full-viewport flight state machine. GSAP drives signal resolution. No separate chapter canvases or forced-scroll cameras.

`src/game/flight.ts` is a pure lunar-inspired flight simulation with fixed substeps, horizontal thrust, braking, fuel, landing limits, assisted approach, and recoverable failure. `input.ts` shares keyboard and pointer controls. Flight events update measured HUD values without rerendering the world every frame. Pause and archive hold the trajectory; retry resets flight state.

`src/three/World.tsx` owns NASA-textured Moon, catalog star background, photographic lunar backdrop/terrain, instanced rocks, target, camera, reflector and the persistent canvas. `SurveyCraft.tsx` is the fictional player craft. `ApolloModel.tsx` loads the local NASA GLB with local Draco decoding, selects descent-stage meshes, groups structure/engine/gear, and animates spatial separation. Geometry remains a reconstruction; object placement is authored.

`src/App.tsx` owns progression: resolve unknown signal, take control, land, scan unidentified hardware, explore three discoveries, and receive the Mars teaser. The shared inspector is an in-world region with component labels, accessible equivalent buttons, orbit/zoom, isolation and assembly. Escape restores focus to the relevant artifact. The page has no narrative scroll offset to restore; the camera restores the surface view. The native archive dialog traps focus and closes with Escape.

`src/data/archive.ts` holds verified facts, source links and separately authored fictional interpretations. All three investigations gate the ending. Reduced-motion skips visual interpolation without bypassing any learning gate. Touch flight buttons use pointer capture; component controls remain available on narrow layouts.

Assets and fonts are local. DPR is capped at 1.5; a single directional shadow light and instanced rocks limit draw cost. No external runtime image/font requests, backend, account, tracking or app authentication. Public Sites access is managed independently of the application. Progress is intentionally in memory. Sound is opt-in interface tones only.

Validation: `npm run typecheck`, `npm run build`, `npm run test:e2e`. Browser tests cover desktop and touch/reduced-motion full journeys, flight pause/assist, discovery gates, inspection controls, focus return, archive, restart and errors.

## Cockpit / walking / six-clue revision
`src/Journey.tsx` provides the cockpit overlay, short skippable intro, footprint walk prompt and optional random single-question cat interaction. `src/three/Explorer.tsx` owns the authored astronaut geometry, walking gait and third-person follow camera during the surface stage. `walk` is bounded from 0 to 1 and gates identification; skip-walk is the equivalent accessible action. Flight retains the pure simulation; assisted control stays active during steering, damps drift on release, and holds near the ground until aligned. Controls clear on window blur, pointer cancellation and launch.

ApolloModel optionally loads the complete NASA GLB for historical reconstruction. Structure materials receive a world-space clipping plane in cross-section mode; this is a schematic inspection view, not a modeled pressure cabin or engineering section. Historical mode resets on inspection exit. New camera/seismometer/message interactions reuse the shared inspector. Six records now gate the conclusion and existing Mars teaser.

## Open canopy and component posters / 2026-09-26
`PilotCockpit.tsx` draws camera-relative procedural gloves, articulated fingers and control sticks inside the existing canvas. `FlightHUD.tsx` provides exactly two live displays: telemetry and an illustrative target map. The camera keeps a stable forward view without input-driven banking. Guided descent limits lateral velocity, automatically centers when released and waits for alignment near the ground. Manual flight remains optional.

`PartPoster.tsx` renders selectable, scrollable learning text, source links, Miso and matching user-supplied concept illustrations. Direct meshes, spatial labels and keyboard-accessible buttons share selection state and blue highlights. Cross-section and Separate hardware are primary controls. Inspection camera view offsets reserve space for the right-hand desktop poster or lower mobile poster and clear on exit. Poster scroll resets when selecting another part.
