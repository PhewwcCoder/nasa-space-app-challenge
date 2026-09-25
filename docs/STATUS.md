# Status

## Current phase
Phase 1 playable prototype complete: prologue + Apollo 11 + Mars signal teaser. No later chapter implemented.

## What works / complete
- Unknown signal acquisition; Moon identification; native scroll camera approach with accessible assisted alternative; gated descent alignment.
- Unknown surface structure scan, followed by the Apollo 11 reveal and Tranquility Base exploration.
- One persistent 3D canvas, schematic lunar world, spatial discovery markers, reusable inspection mode.
- Eagle orbit/zoom, button-based rotation/zoom, component selection and facts, hover/selection feedback, animated explosion, isolation, assembly/reset.
- Retroreflector alignment and laser-return experiment; NASA footprint exposure reconstruction and emotional interpretation.
- All-three discovery gate, archive journal, 02% to 14% narrative confidence, Mars ending, return and restart.
- Opt-in quiet audio; keyboard focus and Escape; inspection scroll/focus restoration; narrow touch layout; reduced-motion progression.
- Local NASA imagery and local licensed fonts. No external runtime image/font requests.
- Concise project memory, factual citations, chapter-authoring and visual-QA skills.

## Validation
`npm run typecheck` passes. `npm run build` passes. Playwright: 2 complete journeys passed (1440x900 desktop and 390x844 touch + reduced motion), including all investigations, gating, controls, focus, scroll restoration, archive, restart, no horizontal overflow, and zero browser errors. Manual browser interaction and screenshot review completed. Selected QA images are in docs/qa; automated ending screenshots are in ignored test-results.

## In progress
None. Private Sites deployment succeeded on 2026-09-25: https://mersa-petrova-archive.bracunasa.chatgpt.site . Check .openai/hosting.json for the existing project ID; never create a second site. Deployed source: 9a90fe01759ca45e5ab3d6407b5a05bf713081b1. This status-only handoff update follows that deployment.

## Known limitations
- Geometry and terrain are schematic, not photorealistic or dimensionally exact NASA CAD. Site object placement is authored, not a survey.
- The Three.js vendor chunk is approximately 310 KB gzip and triggers Vite's 500 KB uncompressed advisory; no runtime error. Test on physical low-end laptops before a public competition presentation.
- Progress is held in memory; refresh starts over. Audio uses interface tones only; no final music/voice assets.
- Chromium desktop and mobile emulation verified; physical Safari/iOS and no-WebGL hardware not yet tested. The error fallback is coded but not independently exercised in the current automated suite.

## Next exact task
Replace the schematic Eagle geometry with a vetted, optimized, component-separated NASA-derived model; retain the existing inspector contract and re-run both journeys. Do not build Mars yet.

## Important commands and files
`npm run dev`; `npm run typecheck`; `npm run test:e2e`; `npm run build`.
App.tsx: story and inspector; three/World.tsx: scene/models/camera; three/ModelControls.tsx: accessible camera controls; stores/archive.ts: progression and scroll return; data/archive.ts: verified educational content and chapter placeholders; styles.css: visual system; tests/experience.spec.ts: complete journey coverage. All application paths are under src/.

