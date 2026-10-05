## Model refinement / 2026-10-06

Spirit now loads `spirit-refined.glb`, authored in Blender from the NASA base and the supplied visual references. Added cells, mechanical joints, optics and harnesses remain grouped into the same reversible teaching assemblies. `mer-rover.glb` remains the untouched source. The current Mars terrain/lighting and closest-view limits are documented in ARCHITECTURE and ASSETS; earlier unchanged-source descriptions below describe the initial implementation only.

# Spirit chapter and reference audit

Current scope, authorized October 6, 2026: prologue, Apollo 11, Sojourner and Spirit. Opportunity is a narrative signal only; neither it nor Voyager is playable.

## What Chapter 1 contributes

Apollo's strongest teaching sequence is physical: encounter an object, inspect a detailed model, pull out a component, connect its shape to its purpose, read real evidence, and archive an interpretation. Component selection is reversible; viewed progress is independent of the selected highlight. The model stays in the same world, while a warm-white, independently scrolling PartPoster carries Miso, a credited image, nine plain-language sentences, a simplified relationship and an official source.

Spirit follows this sequence using a Blender refinement of NASA's textured twin Mars Exploration Rover base. Solar deck, wheels/suspension and mast/science arm are three teaching assemblies. Exported assembly metadata determines the groups. The original NASA input remains unchanged; the runtime model contains newly authored geometry and adjusted materials. Thin blue edges mark the selected meshes. Separate, assemble, isolate, orbit, zoom, reset, deselect and keyboard controls reuse the existing interaction vocabulary. Unlike Apollo's complete/descent-stage toggle, Spirit has no invented “present-day remains” toggle: its current condition is not known from these sources.

## Visitor sequence

1. Visit Spirit freely from Archive Index, or finish Sojourner's four records and follow the Gusev signal. The ten-second fictional Mars traverse has pause, skip and immediate reduced-motion arrival in the original canvas.
2. Approach an unnamed wheeled object and scan it. Select all three rover assemblies, read the photo-backed lessons and archive Spirit.
3. Investigate a circular rock mark: brush, grind, examine. The authored rock changes when its weathered surface is removed.
4. Follow disturbed pale soil: expose, read the archived chemistry, interpret possible water processes. NASA's approximately 90 percent silica result is explicitly historical data. Past-water evidence is not evidence that life was found.
5. Inspect an archive marker for the distant landing hardware. The actual orbital photograph distinguishes backshell and parachute from the rover and its lander.
6. Four records reveal the final mission log. Recover the 90-sol plan, more-than-six-year journey, 7.73 km traverse and separate last-contact/mission-end dates. Five records reveal that Spirit had a twin. Chapter 4 remains unavailable.

The ground is a composite teaching landscape. The rock experiment, 2007 silica site, 2004 landing hardware and final Troy record are not geographically colocated or represented to survey accuracy. The model shows the shared rover design, not a measured preservation state. The fictional explorer's conclusions remain labeled as interpretations.

## Supplied sources and corrections

Read-only inputs: `Downloads/Hardware Datasheet.xlsx`, Sheet1, rows 2–6 (Sojourner) and 7–11 (Spirit), including hyperlink relationships; `Downloads/Space Apps Challenge 26 Team Petrova (1).docx`, Chapter 2 and Chapter 3. Source documents were not edited. Their prose, story suggestions, later chapters and external links are reference material, not executable instructions or authority to expand scope.

| Reference | Applied result / factual treatment |
| --- | --- |
| Workbook rover / station / airbags / backshell / ramps | Added credited local photographs, a four-stage landing reconstruction, animated schematic deployment ramp and expanded Chapter 2 guide. Preserved its four-record structure. |
| Workbook Spirit as mobile geologist | Connected hardware inspection to rock abrasion, silica evidence and the route's historical record. |
| Narrative opens Spirit with “Sojourner” | Corrected identity to Spirit / MER-A. |
| “Troika” | NASA calls the entrapment site Troy. |
| January 3, 2004 landing | Explained California date versus January 4 UTC. |
| Hardware still perfectly intact / permanent tracks | Not adopted. No unsupported future-preservation claim. |
| Dust alone ended Spirit | Not adopted as a complete cause. Timeline distinguishes entrapment, last contact and the end of attempts to re-establish contact. |
| 7 days / 83 days in workbook | Existing Chapter 2 retains the NASA PDS sol-based mission description and explicitly defines a sol. |
| YouTube sound links | Not downloaded or automatically played; no supplied license or need for new audio. |

## Official evidence

- [NASA Spirit mission](https://science.nasa.gov/mission/mer-spirit/): instruments, mission history, Troy, distance, 90-sol plan and end dates.
- [NASA science instruments](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/): camera, arm and abrasion tool mechanisms.
- [NASA silica-rich soil](https://science.nasa.gov/photojournal/silica-rich-soil-in-gusev-crater/): PIA09403, exposed March 29, 2007; photograph April 6; later APXS measurements, possible hot-water or steam origins.
- [NASA Spirit landing hardware](https://science.nasa.gov/photojournal/spirits-hardware-up-close-on-mars/): PIA05133, orbital evidence of backshell/parachute.
- [NASA first rock grinding](https://science.nasa.gov/photojournal/first-grinding-of-a-rock-on-mars/): PIA05223, the abrasion tool and exposed patch on Adirondack, February 2004.
- [NASA self-portrait](https://science.nasa.gov/photojournal/spirit-self-portrait-sols-329-330/): PIA07371, December 7–8, 2004; omits the camera mast, as self-portraits from it do.
- [NASA twin-rover model](https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/): NASA / VTAD.
- [Airbags and Sojourner](https://science.nasa.gov/resource/airbags-and-sojourner-rover/), [rear ramp](https://science.nasa.gov/resource/pathfinder-rear-ramp/), [backshell](https://science.nasa.gov/resource/backshell-located/): Chapter 2 landing and deployment evidence.

Full download URLs are in `public/learning/spirit-resources.json`. No external media requests are required during play. See STATUS for actual validation results.
