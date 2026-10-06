## Voyager / 2026-10-07

- `public/models/voyager-nasa.glb`: untouched NASA/VTAD model from https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/v/Voyager.glb ; catalog https://science.nasa.gov/resource/voyager-3d-model/ .
- `assets/blender/voyager-refined.blend` and `public/models/voyager-refined.glb`: reproducible with `scripts/build-voyager.py`. Original spacecraft geometry/UVs retained; utility cube removed, teaching groups assigned, PBR response adjusted and runtime Draco compressed. Reference-based educational reconstruction, not exact CAD or a surveyed preservation state.
- Four NASA/JPL-Caltech images and exact hashes/URLs in `public/learning/voyager-provenance.json`: spacecraft diagram, Golden Record cover, record display, and the 2020 reprocessing of the February 14, 1990 Pale Blue Dot image. Local unmodified downloads; expandable UI crops.
- User illustrations guide visual review only; not redistributed or used as textures. Existing NASA/Goddard SVS star visualization reused. SVG evidence, lighting and Miso prose are original fiction/teaching aids. No generated media or paid service. See [CHAPTER_5.md](CHAPTER_5.md).

## Opportunity sources and Blender reconstruction / 2026-10-06

- `assets/blender/opportunity-refined.blend`: editable Blender 4.5 reconstruction from the unchanged NASA/VTAD `public/models/mer-rover.glb`. Run `scripts/build-opportunity.py` to invoke the shared builder's explicit variant. Added camera brow and brackets, dark photovoltaic cell treatment and reference-based metal palette sit on the detailed twin-rover geometry. The supplied illustration is a visual reference only, not redistributed or baked as a texture.
- `public/models/opportunity-refined.glb`: 6,593,924 bytes, 77,093 triangles, 25 mesh/material batches, Draco compression; body/power/mobility/instruments extras. Exact engineering geometry and present-day dust coverage are not claimed.
- Eight `public/learning/opportunity-*.jpg` files: original NASA downloads, with pages, download URLs, byte counts and SHA-256 values in `public/learning/opportunity-provenance.json`. Credits include NASA/JPL-Caltech/Cornell for the 2007 self-portrait; NASA/JPL-Caltech/University of Arizona for the 2017 exaggerated-color landing-site image; NASA/JPL/Cornell for PIA07402 heat shield, PIA07269 meteorite and PIA05634 Berry Bowl; NASA/JPL for PIA07999 Purgatory; NASA/JPL-Caltech/MSSS for PIA23178 traverse; NASA/JPL-Caltech/Cornell/ASU for the June 10, 2018 Sun thumbnails.
- `OpportunityEvidence.tsx`: authored composite lander, fabric, shield, mineral and traction geometry. Locations, dimensions, motion and preserved traces are schematic. `OpportunityScene.tsx` uses authored lighting/reflections and the existing procedural Mars terrain, not an orbital topographic survey.
- Read [CHAPTER_4.md](CHAPTER_4.md) for official links and the DOCX/XLSX/article audit. Source attachments remain unmodified. No paid generation, cloud model service or new runtime remote media dependency.

## Spirit Blender refinement and Mars environment / 2026-10-06

This revision supersedes the runtime-model description below; the original NASA download remains unchanged as authoring input.

- `assets/blender/spirit-refined.blend`: editable Blender 4.5 reconstruction, authored locally using the user's MER renders as visual references. `scripts/build-spirit.py` reproduces it from the NASA source. Added/rebuilt wheel ribs and hubs, suspension, mast cameras, arm fittings, photovoltaic wafers/interconnects, chassis panels and wiring. Reference images are not redistributed or used as textures. No claim of exact engineering accuracy or current preservation.
- `public/models/spirit-refined.glb`: current runtime asset, Draco compressed, 76657 triangles across 25 material batches; 6.28 MiB. It retains portions of NASA's geometry/texture atlases and adds original mesh/PBR detail. Assembly extras preserve the three teaching groups and fixed body.
- `public/models/mer-rover.glb`: unchanged NASA/VTAD source, [Mars Exploration Rovers 3D model](https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/). NASA credits do not imply endorsement.
- `src/three/MarsTerrain.tsx`: original procedural sediment shading, normal relief, instanced stones, ridge geometry and sky. `SpiritScene.tsx` adds an authored HDR sky/ground reflection environment. These are composite visual reconstructions, not NASA elevation data or calibrated true-color photography.
- Blender was run locally from a portable installation outside the repository. No paid generation, external runtime dependencies or cloud model project was required.

## Spirit and supplied Chapter 2 references / 2026-10-06

- `public/models/mer-rover.glb`: unmodified NASA / VTAD twin Mars Exploration Rover model from https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/ . About 11.36 MB, 31,450 triangles, nine material primitives. Runtime grouping and offsets are teaching adaptations. Original textures remain; locally generated sky/ground reflections illuminate the fully metallic NASA materials without recoloring them. This is neither an exact engineering disassembly nor a surveyed preservation state.
- `public/learning/spirit-rover.jpg`: NASA/JPL/Cornell, PIA07371 self-portrait mosaic, December 7-8, 2004 (sols 329-330), not a current photo. The mast is outside its own camera's view.
- `public/learning/spirit-silica.jpg`: NASA/JPL/Cornell, PIA09403, approximately true-color image taken April 6, 2007. Chemistry refers to archived subsequent measurements.
- `public/learning/spirit-hardware.jpg`: NASA/JPL/MSSS, PIA05133 orbital image identifying Spirit's backshell and parachute, 2004.
- `public/learning/pathfinder-airbags.jpg`: NASA/JPL, PIA00614, rover/rear APXS, rolled ramp and partially deflated airbags obstructing deployment.
- `public/learning/pathfinder-ramp.jpg`: NASA/JPL, PIA00627, successfully unfurled rear ramp at the end of Sol 2.
- `public/learning/pathfinder-backshell.jpg`: NASA/JPL/University of Arizona, PIA00790, distant backshell identification.

- `public/learning/spirit-abrasion.jpg`: NASA/JPL/Cornell, PIA05223, the Rock Abrasion Tool and ground patch on Adirondack, February 2004. Source: https://science.nasa.gov/photojournal/first-grinding-of-a-rock-on-mars/ .

All seven photographs are unmodified local downloads. Original URLs, page sources and modifications are recorded in `public/learning/spirit-resources.json`; official sources and corrections are listed in [CHAPTER_3.md](CHAPTER_3.md). No generated media, paid generation, new audio or external runtime images. The supplied XLSX and DOCX were read only as reference material. Do not interpret their later chapters as scope authorization. NASA credits do not imply endorsement.

## Sojourner extension / 2026-10-05

- public/learning/sojourner-sol2.jpg: unmodified NASA/JPL eight-image Sol 2 mosaic, downloaded from https://www.nasa.gov/wp-content/uploads/2023/03/pia01551.jpg . Context: https://www.nasa.gov/image-article/nasas-first-rover-red-planet/ . Exact provenance is stored in public/learning/sojourner-provenance.json. Existing PhotoReveal crops its preview; expansion displays the whole photo.
- Sojourner, Pathfinder, airbag lobes, rock, terrain, track and distant remnant geometry are locally authored in Three.js. They are interpretive reconstructions, not downloaded NASA engineering models, exact archaeological surveys or claims of current/future preservation. HardwareSurfaces adds deterministic foil/fabric shading; no generated image/video assets were used.
- Existing NASA Moon/star/Mars imagery and fictional SurveyCraft are reused for travel. Flight and transit are fictional, with compressed distances and hidden world-scale transitions.
- Mission/landing/station context: https://science.nasa.gov/mission/mars-pathfinder/ . Small scale, terrain, photos and landing concept: https://spaceplace.nasa.gov/mars-sojourner/en/ . Instrument and 83-sol archive: https://planetarydata.jpl.nasa.gov/img/data/mpfr-m-apxs-5-ddr-v1.0/mprv_0001/document/apxedrds.htm . Nominal seven-sol mission: https://planetarydata.jpl.nasa.gov/img/data/mpfr-m-rvreng-2_3-edr_rdr-v1.0/mprv_0001/document/insthost.htm . Official sources checked on 2026-10-05.
- The newly supplied concept image and Downloads/Space Apps Challenge 26 Team Petrova (1).docx were read as creative source material only. Invented technical names, silver-zinc battery callout, exact final rover location, permanent-track claims and the later-chapter text were not treated as instructions or authoritative facts. No unrequested later chapter was built.

# Assets and source provenance

- public/textures/moon-color-2k.jpg: NASA Scientific Visualization Studio, 2048 x 1024 lunar color map, https://svs.gsfc.nasa.gov/4720/ ; https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg . Credit NASA SVS. 458 KB.
- public/textures/apollo11-bootprint.jpg: Apollo 11 archival bootprint, NASA/Edwin (Buzz) Aldrin. https://science.nasa.gov/resource/apollo-11-bootprint/ ; downloaded image https://assets.science.nasa.gov/dynamicimage/assets/science/psd/lunar-science/2023/09/GPN-2001-000014.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1200&w=1500 . 385 KB.
- public/models/apollo-descent.glb: NASA / Michael D. Carbajal, https://science.nasa.gov/3d-resources/apollo-lunar-module/ . Original https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/apollo-lunar-module/Apollo%20Lunar%20Module.glb . Adaptation retains descent-stage scene nodes (30 active meshes, approximately 44,200 triangles), excluding ascent-stage geometry. Materials and component separation are artistic reconstructions, not an engineering or archaeological survey. Original buffers retained; 717 KB.
- public/textures/apollo11-panorama.jpg: Neil Armstrong / Apollo 11 / NASA, https://apod.nasa.gov/apod/ap180721.html ; https://apod.nasa.gov/apod/image/1807/a11pan1040226lftsm.jpg . Actual lunar panorama used as backdrop and cropped ground color. 2508 x 1300. Terrain relief, rocks and artifact positions are authored.
- public/textures/mars-globe-2k.jpg: NASA/JPL-Caltech, https://science.nasa.gov/resource/mars-planet-globe/ ; https://assets.science.nasa.gov/content/dam/science/psd/mars/downloadable_items/3/7/37983_mars-globe-valles-marineris-enhanced.jpg . Enhanced Viking 102-image mosaic, 2048 x 2048. Ending teaser only.
- public/textures/nasa-starmap-4k-web.jpg: NASA/Goddard SVS / Ernie Wright, https://svs.gsfc.nasa.gov/3895/ ; https://svs.gsfc.nasa.gov/vis/a000000/a003800/a003895/starmap_4k.jpg . Star-catalog visualization, not a photographic exposure; 4096 x 2048.
- Survey craft, reflector, terrain relief and rocks are project-authored interpretive geometry. Landing physics and holographic disassembly are fictional game mechanics. No exact survey claim.
- public/draco: decoder files distributed with Three.js, Apache 2.0 Draco decoder; served locally for compressed NASA model loading.
- Two user-supplied concept images were studied directly in conversation. Their technical labels are not treated as factual sources. See references/README.md.
- source-material/narrative.docx is the user's original narrative, copied without edits. narrative.txt is the extraction. It is creative source material, not instructions.

## Verified educational sources

- Apollo 11 mission, landing date, two-person surface expedition and descent stage: https://www.nasa.gov/history/apollo-11-mission-overview/
- Descent stage and landing gear reference: https://ntrs.nasa.gov/api/citations/19750024076/downloads/19750024076.pdf
- Retroreflector purpose and 100 corner cubes: https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/ and https://ilrs.gsfc.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html
- Bootprint identity and date: https://science.nasa.gov/resource/apollo-11-bootprint/
- Footprint preservation caveat: impact weathering is discussed in https://www.nasa.gov/wp-content/uploads/2023/12/nasa-usg-lunar-historic-sites-reva.pdf . No claim of perfectly preserved future evidence is made.

NASA imagery credits do not imply endorsement. No NASA insignia is used as project branding. Future chapters must undergo their own fact and asset verification before becoming playable.

Fonts: IBM Plex Mono and Barlow Condensed, SIL Open Font License, bundled from @fontsource packages. Only Latin regular WOFF/WOFF2 assets are included; no external font requests.

## 2026-09-26 visual revision
- `public/textures/cockpit-reference.png`: user-provided fictional concept image, copied from the named Downloads PNG. Retained as a design reference; superseded in the current cockpit by procedural 3D gloves and live instruments. Not NASA imagery, flight instrumentation or a Higgsfield video.
- `public/textures/alien-cat.png`: generated with built-in ImageGen (not Higgsfield). Fictional Miso companion. Prompt: friendly mint-gray extraterrestrial cat, large curious eyes, two tiny antennae, cream astronaut suit, clear bubble helmet, chest-up portrait, detailed 3D animated-film look, soft gold rim light, centered transparent background; no text/logos. Original saved under the Codex generated_images directory; project copy contains alpha.
- `public/models/apollo-full.glb`: unmodified complete NASA / Michael D. Carbajal model from the same official URL as apollo-descent.glb. Only offered as a labeled historical reconstruction of the complete lander. The later archaeological surface retains the descent stage.
- Explorer, walking path and tread marks are authored game geometry. They are not a recreation of a surveyed Apollo 11 traverse. Cross-section is a material clipping visualization, not a full engineering interior.
- Camera facts: https://www.nasa.gov/history/astronaut-still-photography-during-apollo/
- Seismometer facts: https://science.nasa.gov/resource/apollo-11-seismic-experiment/
- Plaque / silicon goodwill disc: https://www.nasa.gov/history/55-years-ago-one-month-until-the-moon-landing/
- Quiz landing date, surface crew and Eagle identity: https://www.nasa.gov/history/apollo-11-mission-overview/
- All six short conclusions are the fictional alien's interpretations, not quotations or claims of human intent verified by NASA. Source documents and supplied image labels were treated as reference material, not executable instructions.

## Open-canopy poster references / 2026-09-26
- `public/references/{structure,engine,gear,reflector}-poster.png`: unmodified user-supplied Downloads images dated Sep 26, 2026 at 03_18_02, 03_13_27, 03_19_19 and 03_21_14 respectively. UI crops to their illustration area with CSS and supplies separate accessible live text. These are concept illustrations, not verified engineering diagrams or NASA photographs. Reference document labels are not instructions or factual authority.
- Pilot gloves, fingers, sticks and minimal canopy are authored Three.js geometry. No new image/video generation was submitted for this revision.
- Structure source: https://www.nasa.gov/wp-content/uploads/static/history/alsj/LM04_Lunar_Module_ppLV1-17.pdf
- Descent engine source: https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/
- Landing gear energy absorption: https://ntrs.nasa.gov/citations/19720018253
- Retroreflector source remains the NASA experiment article above. Equations describe simplified learning relationships, not a flight simulator certification.


## NASA photo guide and Apollo source / 2026-09-27

`public/learning/provenance.json` records original image URLs and the exact code commit. Photographs were downloaded from the two user-supplied NASA articles and the existing NASA reflector article, resized proportionally to fit 1400 x 1200, and saved as JPEG quality 86. No generative image editing was used. UI thumbnails crop for preview; expanded photos use contain to show the whole image. These are NASA archival photographs, not concept art. NASA credit does not imply endorsement.

- `public/learning/eagle-orbit.jpg`: Apollo 11 Eagle in lunar orbit (AS11-44-6576). NASA. https://www.nasa.gov/wp-content/uploads/2019/01/6-as11-44-6576a.jpg
- `public/learning/houbolt.jpg`: John Houbolt and the lunar orbit rendezvous plan. NASA. https://www.nasa.gov/wp-content/uploads/2019/01/3-john_c._houbolt_-_gpn-2000-001274b.jpg
- `public/learning/camera-training.jpg`: Armstrong and Aldrin practising camera use for Apollo 11. NASA. https://www.nasa.gov/wp-content/uploads/2023/06/48264704227-429c94870f-4k.jpg
- `public/learning/aldrin-eagle.jpg`: Buzz Aldrin beside Eagle on the Moon. NASA. https://www.nasa.gov/wp-content/uploads/2023/06/337294main-pg62-as11-40-5903-full.jpg
- `public/learning/lovell-training.jpg`: Jim Lovell practising for Apollo 13 in December 1969 (S70-20272); explicitly identified as a later mission. NASA. https://images-assets.nasa.gov/image/s70-20272/s70-20272~large.jpg
- `public/learning/science-deployment.jpg`: Buzz Aldrin deploying Apollo 11 science equipment; contextual science photo, not a close-up of reflector optics. NASA. https://www.nasa.gov/wp-content/uploads/2020/03/aldrin20190724.jpg

Photo and educational references:
- https://www.nasa.gov/history/astronaut-still-photography-during-apollo/
- https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/
- https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/

The local `THE_LUNAR_LANDING.agc`, `EXECUTIVE.agc`, and `DISPLAY_INTERFACE_ROUTINES.agc` files are unmodified public-domain Luminary099 source downloaded from https://github.com/chrislgarry/Apollo-11 at commit `911e5c0283c629c50cb97666f34065e8c07d71a5`. Original code attribution: NASA / MIT Instrumentation Laboratory. Digitization/transcription: Virtual AGC and MIT Museum; repository maintained by chrislgarry and contributors. Original header attribution remains in each file. The UI presents short original excerpts with exact line numbers and separately authored explanatory notes. Comanche055 is identified as the command-module program, not mixed with Eagle's Luminary099. No code is executed by the explorer.

The supplied pasted photography text is reference material only. Sources were read from NASA to verify context and image captions. Existing reference-poster PNGs are retained as design history but no longer displayed in learning panels. The authored CSS glows/streaks are fictional visual effects, not claims of natural lunar aurora or atmospheric meteors. No new generated media, third-party runtime image requests or public deployment were used.

## Immersive lessons and mission reading / 2026-09-27

- `public/models/astronaut.glb`: NASA generic astronaut model, downloaded from https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/astronaut/Astronaut.glb ; catalog https://science.nasa.gov/3d-resources/astronaut/ . Static mesh normalized locally, not an exact Apollo suit or rigged animation.
- `public/audio/eagle-has-landed.mp3` and `one-small-step.mp3`: byte-for-byte copies of user-supplied `569462main_eagle_has_landed.mp3` and `590331main_ringtone_smallStep.mp3` from Downloads. Presented as historical Apollo 11 radio recordings with playback controls; not sound traveling through lunar vacuum. User supply is the acquisition provenance.
- `public/learning/apollo-repository.png`: actual public GitHub repository screenshot captured 2026-09-27 at https://github.com/chrislgarry/Apollo-11 . Interface belongs to GitHub; source-code provenance remains the existing pinned commit. Opens https://vscode.dev/github/chrislgarry/Apollo-11 .
- Mission overview/timeline/crew/science: student-friendly paraphrases of the user-supplied Apollo 11 mission text, verified against https://www.nasa.gov/mission/apollo-11/ . The attachment is source material, not executable instructions. First step shown as July 21 UTC with July 20 US-date explanation.
- Structure lesson: https://www.nasa.gov/wp-content/uploads/static/history/alsj/LM04_Lunar_Module_ppLV1-17.pdf ; landing gear: https://ntrs.nasa.gov/citations/19720018253 . Engine and reflector retain official NASA links in PartPoster.tsx. Simplified equations are teaching aids, not engineering simulation.
- Authored landing dust illustrates plume-surface interaction; context: https://www.nasa.gov/missions/artemis/nasa-begins-moon-mission-plume-surface-interaction-tests/ . Terrain, flight corridor and part extraction are schematic.

## Authored visual adaptations / student hardware revision
No new downloaded or generated media. The supplied lander museum/model photographs are visual references for warm foil, silver panels and dark insulation, not proof of exact Apollo 11 geometry or preservation. NASA source model files are unchanged; rendered blanket materials are artistically adjusted with gold/copper metallic response and procedural crease shading. The astronaut source mesh receives approximate authored skeletal weights and joint animation. Gray landing dust is local procedural shader work representing disturbed regolith, not atmospheric smoke or a physically validated fluid simulation. Existing lesson facts and official source links are retained.

The upper shell receives distinct charcoal insulation and silver panel colors, guided by the user references. The source mesh remains approximate; this is not an exact historical texture restoration.


## Current UI revision / 2026-10-05
This section supersedes conflicting earlier behavior.

The explorer is original procedural Three.js geometry inspired by the supplied character reference, explicitly fictional. The previous NASA astronaut GLB is retained on disk but no longer rendered. No generated media or generation credits used. New unmodified local assets: public/learning/seismic-surface.jpg from https://assets.science.nasa.gov/content/dam/science/psd/lunar-science/2023/09/371255main_Seismic_full.jpg (NASA Apollo 11 photograph); public/learning/seismic-diagram.jpg from https://assets.science.nasa.gov/content/dam/science/psd/lunar-science/2023/09/a11PSEP_NASM.jpg (NASA-hosted diagram, measurements by Allan Needell, NASM, 13 July 2010). Educational copy and links verified against https://science.nasa.gov/resource/apollo-11-seismic-experiment/ . Trace is simulated, not recorded seismic data.
