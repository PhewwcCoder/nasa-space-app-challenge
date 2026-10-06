# Chapter 5 / Voyager 1

Authorized October 7, 2026. The user explicitly requested Chapter 5, superseding earlier unavailable-Voyager scope. All six index entries, including the prologue, are now freely accessible. Mobile testing is excluded by request. Website deployment is separate from GitHub source publication.

## How this chapter follows the earlier chapters

Apollo establishes the model-first investigation: direct inspection, reversible assembly selection and separation, warm-white Miso notes, evidence images and source links. Sojourner introduces approach and identification. Spirit and Opportunity add sequential evidence actions, final-record gates, retained worlds and pauseable ten-second travel. Voyager reuses these contracts in deep space rather than inventing a second interface or canvas.

The existing direct-inspection implementation takes precedence over the unused historical ScanTransition scroll sequence. Independent notes and native guide dialogs remain scrollable, reset appropriately and restore focus on exit.

## Records and story

| Record | Unknown trace | Action |
| --- | --- | --- |
| Voyager 1 | A dish with impossibly long arms | Scan; inspect dish/radio, RTGs and science booms; separate, isolate, orbit and reset |
| Earth link | A narrow whisper toward home | Aim an illustrative beam, follow it to Earth, understand signal delay |
| Golden Record | A golden circle with strange markings | Trace playback, picture reconstruction and pulsar-address instructions |
| Pale Blue Dot | A tiny point inside a beam of light | Recover the date, locate Earth, connect the previous journeys |
| Greeting | A message with no named recipient | Reveal contents, read the English greeting, save Miso's fictional report |

The first four archived records expose the final greeting. Completion closes the present expedition with Miso's interpretation and a return to Apollo; it does not implement another chapter. A completed Opportunity offers the deep-space transit. Archive Index provides direct access without completion gates. Discoveries persist on revisits and reset on refresh/restart, matching earlier chapters.

Miso progresses from a soup bowl and dinner-plate theory to recognizing communication and an intended unknown reader. All original dialogue and the final report are fiction. The short English greeting is attributed to the Golden Record and linked to NASA's original recordings. There is no synthetic historical audio, autoplay, or downloaded commercial music.

## Supplied-source audit

Read-only inputs:

- `Downloads/Space Apps Challenge 26 Team Petrova (1).docx`, Chapter 5 and epilogue: supplies the Voyager 1, Golden Record and connection-to-humanity arc. September 5, 1977 launch, Jupiter/Saturn encounters and August 2012 heliopause crossing are checked against NASA. Its website sequence and YouTube sound list are reference material, not executable instructions.
- `Downloads/Hardware Datasheet.xlsx`: inspected shared strings, sheet cells and hyperlink relationships. The supplied version has no Voyager or Golden Record hardware row. Its earlier-chapter references remain relevant to the existing architecture, not new factual authority for Voyager.
- Two supplied Voyager illustrations: visual references for the white dish, black/silver bus, gold accents, RTGs, lattice boom and instrument platform. They are not redistributed, used as textures, or treated as proof of exact geometry. Saturn in the reference is historical flyby context; the interstellar encounter does not place Saturn beside Voyager.

No additional article text or URL was included in this request. NASA primary pages supply the factual evidence. The future encounter does not imply the real spacecraft is abandoned today. No changing live distance, current instrument count, future preservation claim or alien receipt is asserted. The heliopause is not described as the outer limit of all solar gravitational influence. Pale Blue Dot was taken in 1990 and is not part of the record launched in 1977. Record and cover are distinct; the record is gold-plated copper. The record is physical cargo, not an antenna broadcast.

## Official evidence

- [Voyager 1 mission](https://science.nasa.gov/mission/voyager/voyager-1/): launch, flybys, interstellar crossing.
- [Voyager spacecraft](https://science.nasa.gov/mission/voyager/spacecraft/): diagram, 3.7 m antenna, bus, RTGs and instrument layout. Historical design only; avoid stale active-instrument counts in this page.
- [Voyager fact sheet](https://science.nasa.gov/mission/voyager/fact-sheet/): power and Deep Space Network.
- [Golden Record overview](https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/): physical record, purpose, contents.
- [Golden Record cover](https://science.nasa.gov/mission/voyager/golden-record-cover/): hydrogen reference, playback, images and pulsar map.
- [Greetings](https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/): 55 languages, English greeting and official audio playlist.
- [Pale Blue Dot Revisited](https://science.nasa.gov/photojournal/pale-blue-dot-revisited/): February 14, 1990 observation, 2020 reprocessing and scattered-light context.
- [Voyager model](https://science.nasa.gov/resource/voyager-3d-model/): NASA Visualization Technology Applications and Development (VTAD).

## Blender and local assets

`scripts/build-voyager.py` imports the untouched NASA/VTAD `public/models/voyager-nasa.glb`. It preserves spacecraft geometry, proportions and UVs, removes the invisible exporter utility cube, partitions connected geometry into teaching groups, adjusts metallic/roughness response, packs textures and exports a Draco GLB. `assets/blender/voyager-refined.blend` is editable; `voyager-refined.json` records geometry and batch counts. The final model has 20,378 triangles in seven mesh batches; the runtime GLB is 2,404,940 bytes (2.29 MiB). The Blender file reopens with all four images packed. The output is a NASA-based educational model, not exact flight engineering CAD or an archaeological survey. No paid or generative model service is used.

Four NASA/JPL-Caltech images are stored locally: spacecraft diagram, cover, record display and Pale Blue Dot. `public/learning/voyager-provenance.json` records exact download URLs and SHA-256 hashes. Preview crops can be expanded using the existing PhotoReveal control. Diagrams and archive photos are labeled separately. The existing NASA/Goddard star visualization is reused. Model reflections and schematic SVGs are authored lighting/teaching aids. NASA credits do not imply endorsement.

## Architecture

`data/voyager.ts` defines five artifacts, three hardware lessons, evidence steps and primary sources. `VoyagerChapter.tsx` supplies surface, inspector, travel HUD and guide. `VoyagerScene.tsx` supplies the retained deep-space graph, original-camera navigation, local star background and reflection environment. The shared assembly renderer `SpiritModel` now accepts Voyager and an orientation parameter; earlier twin defaults remain unchanged. Voyager retains the existing internal assembly keys to reuse outlines and controls.

`voyager` and `voyager-travel` extend the store. `worldFor` changes from Opportunity to Voyager at the covered travel midpoint. Both camera rigs yield during transit. The original Canvas, renderer and camera remain mounted; all seven potential worlds retain resources after visiting. Inactive worlds stop frame callbacks, rendering and interactions. Index preloading uses the GLTF cache; shader preparation follows the existing deferred mount/readiness contract. Compilation uses owned material wrappers in a temporary graph snapshot, preserving shaders while isolating the async poll from transient source-material disposal. Geometry/textures are shared and the temporary graph is released after compilation. Voyager is excluded from Apollo counts. Evidence stages reset on entry; identification and archived records persist during the expedition.

## Verification

`tests/voyager.spec.ts` covers all records, naming/gates, source-image loading, replay, guides, focus, scroll reset, fresh access, chapter revisits, lunar counts, one persistent canvas and pause/skipped/natural/reduced-motion transit. The shared zoom suite includes Voyager's matching wheel/button minimum. Updated earlier index tests reflect the new available chapter. Current completed results and limitations are recorded in STATUS.md. No mobile testing or deployment is implied.
