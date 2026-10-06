# Chapter 4 / Opportunity

The user explicitly authorized Chapter 4 on 2026-10-06, superseding earlier locked-Opportunity scope. Voyager remains an unavailable signal. Work is local until a separate deployment. Mobile testing is excluded at the user's request.

## How the earlier chapters informed this one

Apollo establishes direct clue inspection, a detailed model with reversible part separation, Miso's warm-white photo lessons, bounded orbit/zoom controls, a shared archive and an optional field guide. Sojourner introduces the approach/scan/identify sequence and a final evidence gate. Spirit combines these into a data-driven composite science landscape, three hardware assemblies, sequential evidence actions and a ten-second fictional transit.

Opportunity follows that contract. It inherits existing typography, panel design, controls, scan timing and keyboard behavior. It adds a Meridiani environment, its own model treatment, source photographs and authored Miso dialogue. All five built chapters are freely selectable; completing Spirit provides the narrative route to Meridiani. The final mission record requires the first five discoveries. Completing all six reveals only an unresolved Chapter 5 signal.

## Playable records

| Record | Before scanning | Investigation |
| --- | --- | --- |
| Opportunity | Familiar six-wheeled silhouette | Inspect solar deck, wheels/suspension and mast/science arm; separate, isolate, orbit and reset |
| Challenger Memorial Station | Opened shell and pale fabric | Open schematic lander petals, trace the discarded descent system, connect departure to exploration |
| Heat shield + meteorite | Torn metal beside a dark stone | Compare surfaces, read the iron-nickel finding, distinguish manufactured debris from a natural meteorite |
| Martian blueberries | Small spheres in pale stone | Examine an enlarged schematic sample, compare mineral evidence, interpret ancient water without claiming life |
| Purgatory Dune | Wheel furrows in a sand ripple | Demonstrate wheel slip, a careful retreat and the real Earth-tested recovery; no exact command replay |
| Mission record | A long route ending in silence | Reveal the 45.16 km route, last Sun thumbnails and mission closure; no invented rover speech or resurrection |

Miso's mistaken picnic table, nest, snack and loose spacecraft part are explicitly fictional interpretations. Each is resolved through observations rather than presented as a historical claim. Names remain concealed in the discovery dock until the corresponding scan. Photos are historical evidence; nearby 3D stations combine locations and dates for teaching. No exact archaeological layout, present-day preservation or permanent-track claim is made.

## Supplied-source audit

Read as source material, never executable instructions:

- `Downloads/Space Apps Challenge 26 Team Petrova (1).docx`: Chapter 4 supplied the endurance, landing-remnant and farewell arc. Launch July 7, 2003; landing January 25, 2004 UTC; 90-sol plan; 5,111-sol mission; 45.16 km route; June 10, 2018 last contact and February 13, 2019 mission closure were checked against NASA.
- `Downloads/Hardware Datasheet.xlsx`, rows 12–16 and their hyperlink relationships: MER-B, Challenger Memorial Station, backshell/parachute, heat shield and Heat Shield Rock. NASA links were followed without tracking parameters. The non-NASA meteorite image was replaced by NASA's original PIA07269.
- Supplied Elizabeth Howell article, published November 1, 2022: narrative leads for the blueberries, Purgatory recovery and long traverse. New original prose uses NASA primary evidence; no copied article paragraphs or article photograph redistribution.
- Supplied MER illustration: visual reference for the wide dark photovoltaic deck, six ribbed wheels, rocker-bogie suspension, mast optics, antenna, body and science arm. The image is not used as a texture or redistributed.

Corrections: the popular battery/darkness sentence was a human paraphrase, not literal rover telemetry. Mineral spheres are not fruit or evidence of life. Soft-ground escape involved lengthy tests and carefully monitored driving, not simply spinning faster. The DOCX's dropped calibration-tool and future preservation assertions are not reproduced. The scene does not place the lander beside the rover's final position in reality. The imported twin design does not establish different engineering hardware between Spirit and Opportunity.

## Primary evidence

- [NASA Opportunity mission](https://science.nasa.gov/mission/mer-opportunity/): mission dates, durations, distance and landing history.
- [Challenger Memorial Station naming](https://www.jpl.nasa.gov/news/space-shuttle-challenger-crew-memorialized-on-mars/): the landing-site memorial.
- [Landing hardware at Eagle Crater](https://science.nasa.gov/resource/rovers-landing-hardware-at-eagle-crater-mars/): April 8, 2017 HiRISE image; exaggerated color, not true color.
- [Heat shield in pieces](https://science.nasa.gov/photojournal/heat-shield-in-pieces/): PIA07402, 2005 debris scene.
- [Iron meteorite on Mars](https://science.nasa.gov/photojournal/iron-meteorite-on-mars/): PIA07269, January 6, 2005 approximate true-color composite and measured composition.
- [Mineral in Mars berries](https://www.jpl.nasa.gov/news/mineral-in-mars-berries-adds-to-water-story/) and [Berry Bowl](https://science.nasa.gov/photojournal/discovery-served-up-in-a-bowl/): comparative mineral evidence and water interpretation.
- [Looking back at Purgatory Dune](https://science.nasa.gov/photojournal/looking-back-at-purgatory-dune/): April 26, 2005 entrapment; June 11 image after escape; more than five weeks of recovery work.
- [Final traverse map](https://science.nasa.gov/photojournal/opportunitys-final-traverse-map/) and [last Sun images](https://science.nasa.gov/resource/last-images-opportunity-took/): the route and historical final-day observations.
- [2007 self-portrait](https://science.nasa.gov/photojournal/opportunity-rover-self-portrait-from-2007/): September 2/4 mosaic, approximate true color; camera mast outside the downward view.
- [NASA/VTAD MER model](https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/): common rover base.

## Assets and implementation

`scripts/build-opportunity.py` calls the shared Blender builder with an explicit Opportunity variant. It starts from the unchanged NASA `mer-rover.glb`; it does not overwrite Spirit's exported assets. The editable `assets/blender/opportunity-refined.blend` contains a reference-based camera brow, dark solar cells, metallic body, rebuilt wheels, suspension, optics, arm, cell interconnects and harness geometry. Draco runtime output has 25 meshes, 77,093 triangles and four assembly values, and is 6,593,924 bytes. Three selectable groups surround a fixed body. This is detailed educational reconstruction, not exact engineering CAD.

Eight locally stored JPEGs retain the source pixels. `public/learning/opportunity-provenance.json` records source pages, actual download URLs, byte counts and SHA-256 hashes. UI captions identify dates, authors, image color treatment and the low native resolution of final Sun thumbnails.

`data/opportunity.ts` defines records and lessons. `OpportunityChapter.tsx` supplies surface, inspector, guide and travel HUD. `OpportunityScene.tsx` owns the world, camera and travel; `OpportunityEvidence.tsx` owns schematic evidence geometry. Both MER chapters share the model loader/assembly component, worker-prepared outlines and inspection minima. No extra Canvas, renderer or global scene key is introduced.

Opportunity joins the retained-world registry and preloads through the same GLTF cache. Its cold mount is deferred and shaders are prepared before display. Warm visits reuse the scene graph and model materials. Only the active world's frame callbacks, raycasts and rendering run. The shared inspector's selection cannot separate the inactive twin. Opportunity records are excluded from every Apollo progress count. Progress remains in memory and intentionally resets on refresh.

## Verification

Desktop tests cover all six records, gates, local photograph loading, replay, field-guide focus, inspection exit, lesson scroll reset, pause/skip/natural/reduced-motion transit, free fresh access, retained discoveries, one Canvas, original renderer/camera and unchanged warmed resource identities. Shared zoom tests include Opportunity and a deliberately stalled Sojourner approach. The Blender source reopened with all 13 images packed and all four assembly values present. Current outcomes and visual checks are recorded at the top of `STATUS.md`; no mobile run is claimed.
