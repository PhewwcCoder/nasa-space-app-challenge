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
