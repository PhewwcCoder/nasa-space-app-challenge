# Hardware journey contract

Current scope is prologue, Apollo 11 and the Mars teaser. This contract supports later authorized work; it does not authorize adding chapters.

## Visitor sequence

1. Keep an object unnamed until its identification step. Use the artifact's unknown name in the discovery dock until archived.
2. Selecting a clue calls the shared store's `inspect(id)`. A native scroll track opens above the same persistent canvas. Scroll forward/backward to scrub the camera; Continue scan offers a click/keyboard equivalent. Escape or Return cancels. Reduced motion enters the inspector immediately.
3. For hardware with components, start assembled and unselected. Selecting a component pulls it outward and adds thin blue edges. Repeated selection puts it back. Viewed progress remains independent of selection.
4. A selected component opens the right-hand warm-white field note. Keep the world/model visible, with exit and component controls outside the reading panel.
5. Archive only after the artifact's existing investigation requirement is met. Show the newest record and actual discovery count in the surface journey/log panel. Return focus to the clue.

## Reading template

Use `PartPoster.tsx`: Miso portrait and message, component title, explicit schematic-view label, expandable credited photograph, nine simple sentences grouped into two connected paragraphs, optional simplified physics relationship, clearly labeled fictional interpretation, and an official source link. Sentences should explain purpose, mechanism and mission context for students. Do not use numbered one-line facts. Keep all text selectable and independently scrollable; changing component resets the note's scroll position.

NASA facts, authored reconstructions and alien interpretations are different kinds of content. Preserve these distinctions in copy and asset documentation. User reference photos guide appearance but do not establish exact geometry, preservation or historical measurements.

## Ownership

- `src/stores/archive.ts`: session discovery state, selection versus viewed progress, scan progress and inspection exit.
- `src/ScanTransition.tsx`: native scroll/GSAP ScrollTrigger, progress meter and keyboard-accessible completion/cancel controls. Clean up the trigger on exit.
- `src/three/World.tsx`: one camera, approach interpolation, framing and post-scan orbit controls. Return to the surface composition on exit.
- `src/three/ApolloModel.tsx`: component geometry, separation transforms, local material adaptations and selection edges.
- `src/PartPoster.tsx`: sourced student prose and photo reading panel.
- `src/ExpeditionLog.tsx`: actual session milestones/latest log and links into existing archive/mission guide.

The astronaut skeleton and regolith shader are authored presentation effects, not scientific simulations. Eagle source GLBs are unchanged; warm foil and crease shading are runtime material interpretations. Use bright readable physical colors rather than a global dark filter.

## Verify an extension

Run TypeScript, production build and the pure flight checks when relevant. Verify scan forward/reverse/cancel, Continue, reduced-motion bypass, part selection/deselection, scroll reset, all archive gates, source links, guide/inspector exits, and restored clue focus. Review desktop composition at both a standard and a shorter window height. Mobile testing is deferred for this revision at the user's request; equivalent existing touch controls remain. Update STATUS, PRODUCT, ARCHITECTURE, DESIGN_SYSTEM and ASSETS with what actually changed and what was tested.
