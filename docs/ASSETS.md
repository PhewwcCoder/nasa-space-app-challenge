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
