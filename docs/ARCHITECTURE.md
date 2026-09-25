# Architecture

React + TypeScript + Vite. Zustand holds chapter stage, discoveries, selected artifact and component, inspection transforms, mute state, and camera reset version. src/data/archive.ts owns public facts, source links, interpretation, artifact IDs, and future theme configurations. Future chapters are unavailable data entries.

src/App.tsx contains the narrative state machine, progressive scan, alignment controls, shared artifact inspector, and archive dialog. src/three/World.tsx owns one persistent R3F canvas, Moon, authored lunar terrain, schematic model parts, scene lighting, camera rig, and spatial controls. ModelControls.tsx adds keyboard/touch-friendly rotation and zoom buttons through a shared control event.

Native document scroll is the only narrative authority. GSAP ScrollTrigger maps the approach section to progress. An explicit assisted approach reaches the same alignment control. Inspection captures the document offset before changing UI, locks body scrolling, and restores offset/focus on exit. OrbitControls exists only during inspection. Reduced motion skips camera interpolation and scan delays without bypassing learning gates.

Three interaction types: component investigation, laser alignment/return diagram, archival exposure reconstruction. Final signal requires all three. The archive model indicator is fictional narrative confidence, not a scientific measurement. Progress intentionally lasts for the current session; refresh starts a new expedition.

Audio uses short opt-in Web Audio tones. No autoplay, recordings, music, or sound libraries. 3D module lazy-loads. DPR capped at 1.5, one shadow-casting directional light, local 2k Moon texture, instanced rocks, no heavy postprocessing. A WebGL error boundary leaves DOM investigations playable. No backend, tracking, authentication, or database is needed by the app itself.
