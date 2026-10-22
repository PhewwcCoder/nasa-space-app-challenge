## Mars departure for Voyager / 2026-10-23 - current precedence

Chapter 2/3/4 to Voyager uses the existing deep-space transition, with an animated shuttle lifting from the current Mars scene. The departure retains the source chapter until arrival; source cameras yield to the travel camera. Scene readiness pauses the transit clock. Pause, skip and reduced-motion arrival remain. Museum-to-Voyager stays direct.

## Direct arrivals / 2026-10-23 - current precedence

Museum and Voyager departures to Chapters 2/3/4 start direct playable Mars landing in the selected destination world, without lunar takeoff or transit. Touchdown and Skip landing enter that chapter walking approach. Apollo retains direct lunar landing. Museum to Voyager opens normal exploration immediately. Mars-to-Mars selection retains the rocky surface shuttle. Shared landing state, controls and original canvas remain.

## Mars selector routing / 2026-10-23 - current precedence

Switching between Chapters 2, 3 and 4 from a Mars surface or surface shuttle uses startShuttle and the existing rocky Mars course in either direction. Selecting the current Mars chapter returns to that site without a Moon departure. Other entries retain the existing arrival flows.

## Unified selector departures and local navigation / 2026-10-23 - current precedence

Mission-selector choices for Chapters 2-5 start the existing fictional Moon departure and spaceflight, then open the selected destination (Sojourner continues into manual Mars landing). Every Apollo chapter entry starts its lunar landing. Skip, pause, reduced motion, museum scroll restoration and session discoveries remain. Museum Spirit/Opportunity surface-search routes and Mars map flights are retained.

The Moon map returns only during spaceship landing; walking, exploration and inspection remain map-free. Landing instruments include the rendered approach corridor's forward displacement, so a distant craft cannot be reported inside the ring. Landing maps use local scene metres with explicit X/Z axes, not planetary latitude/longitude or surveyed positions. Existing source links and non-survey limitations remain.

## Student UI simplification / 2026-10-21 - current precedence

Apollo's expedition/log sidebar is replaced with a compact optional Field Guide entrance. Separate hardware is the first Eagle control, emphasized by a light border over a neutral dark surface. Buttons lift on hover and show keyboard focus; reduced motion removes movement.

The notebook now contains only student-authored opinions and curiosity questions, autosaved locally with an in-memory fallback when storage is unavailable. Discovery completion remains separate session progress; the old generated-log notebook and its counter are removed. Notebook exit restores focus to its opener.

Chapters 2-4 offer their optional question after completing or skipping the walking approach; Voyager offers it after Approach the distant traveler. Chapter opening never shows the question. Completed approaches remain complete on revisits without another opening question. Inspection and skip dismiss it for the visit. Artifact identification still happens directly on inspection, without a new scan gate.

## Astronaut walking on Mars / 2026-10-20 - current precedence

Each Mars Approach action now invites an astronaut walk before the existing clue dock. Sojourner?s playable landing also hands over to walking. Hold W/up or Hold to walk, pause/resume with Escape, or Skip walk. Navigation cancels an unfinished walk and releases input; discoveries persist. Reduced motion arrives directly. Miso?s optional introduction closes for the visit when skipped, when approaching hardware, or when inspecting. It never reopens on walking completion or inspection exit; a new chapter visit offers a fresh question. The fictional EVA visitor and footprints are distinct from NASA rover history and surveyed site coordinates.

## Inspection map clearance / 2026-10-20

Evidence-inspection maps use the bottom-left corner with no expandable travel menu. Hardware inspection (Sojourner, Pathfinder, Spirit, Opportunity) and MER mission-record views omit the map to reserve the model and control area. This supersedes earlier persistent inspection-map placement. Apollo and Voyager remain map-free.

## Student exploration refinement / 2026-10-20 - current precedence

Apollo maps are removed everywhere, superseding earlier visibility requirements. Static Mars maps show a regional north-up view; shuttle travel uses a destination-up schematic, so advancing always moves toward the top even on reverse journeys. Geographic latitude/east-positive longitude values retain their original calculation and are not reversed. The route and checkpoint layout describes fictional course progress, not a geographic bearing or surveyed terrain. Optional five-question pools for each of Chapters 2-5 invite prediction, offer sourced feedback, and avoid the immediately previous displayed question. Explore other missions remains freely available.

## Playable Chapter 2 arrival / 2026-10-19 - current precedence

Sojourner model-click and Explore now launch Moon departure, spaceflight and manual Mars landing. Apollo completion uses the same route. Skip travel advances to the landing; Skip landing advances to the visible Chapter 2 clues. Reduced motion omits the cinematic only. Direct Mission selector revisits still open the exploration site, and inter-site Mars shuttle routes are unchanged. The ship, route, landing pad and flight handling are fictional; Pathfinder historical landing photographs and lessons remain distinct.

## Interface refinement / 2026-10-19 ? current precedence

Current presentation supersedes the older short-fact and always-visible-map wording below: five longer question-led exhibit paragraphs, a grayscale gradient gallery, Moon map only outside inspection, and no Voyager map. Mars inspection maps and fictional shuttle navigation remain unchanged. Source links stay beside each exhibit.

# Sol-3 / a universe of questions

Current redesign: October 18, 2026. The museum is a fictional learning space presenting real human missions. Students become explorers, with Miso as an inquisitive alien copilot. They do not need to understand an archaeological archive system before playing.

## The five-question story

| Exhibit | Question | What the student does | Story connection |
| --- | --- | --- | --- |
| Apollo 11 | How do you land on another world? | Fly the opening landing, follow footprints, inspect landing hardware and experiments. | Exploration starts with a small step and a difficult engineering problem. |
| Sojourner | What can a tiny explorer discover? | Explore a small rover, its power, wheels, instruments and Pathfinder relay. | Humans send a robot where they cannot yet walk. |
| Spirit | Can a broken wheel make a discovery? | Investigate exposed soil and compare it with historical chemistry evidence. | A setback can reveal a useful question; a water clue is not proof of life. |
| Opportunity | What if you kept going? | Investigate mineral spheres, a meteorite, and recovery from a dune. | Patient observation and engineering tests can extend an expedition. |
| Voyager 1 | How would you say hello to the universe? | Examine communications, the record cover, Earth’s portrait, and a greeting. | The journey ends by asking what we would share about our own world. |

Each museum exhibit has its name, one short NASA-backed fact, a source link, and an Explore action beside the shared 3D hardware rendering. The labeled previews are museum teaching exhibits; encountered objects keep their unknown labels until selecting the object opens its inspection and identifies it. Optional Miso questions and field guides remain, and wrong answers retain explanatory feedback. Completion is expressed as discoveries saved in a notebook, not a scientific confidence score. Existing within-chapter learning gates remain; mission choice is always free.

This design uses curiosity, agency and clear tasks as design intentions. No student study, measured improvement, psychological credential, or challenge award is claimed.

## Museum and exploration

Five tabs select native-scroll stories. GSAP ScrollTrigger keeps the displayed model in sync with the reading position. Each exhibit floats above a simple plinth inside the original shared canvas. The pale gallery puts the model on the left and a white fact card on the right. ApolloModel (including foil materials), SpiritModel (also used by Opportunity and Voyager), and SojournerModel are shared with exploration, not separate raw-GLB previews. Both clicking the model and Explore launch the same mission entry. Apollo starts the landing game; the mission selector still supports direct revisits. Museum return restores the exhibit and scroll position. Reduced motion stops decorative rotation and bobbing. There is no timed departure.

The reference-inspired explorer is original modeled geometry: off-white suit, black visor, red bands, chest control box and hose, pleated sleeves/legs, gloves, boots and a large backpack. It follows the supplied image’s recognizable features, but is a stylized interpretation, not the photographed production mesh or an exact historical Apollo suit.

## Flight and coordinates

The three Mars sites are linked by a fictional shuttle. Use **Fly to another site** in the always-visible minimap, choose another landing site, and hold W/up or the touch Thrust button to advance. A/D or left/right changes lateral course; Space/brake stops progress. Optional cruise completes the compressed route in roughly 20 seconds of simulation time. Pause/resume and Escape stop/resume the journey. Skip and Return to departure are always available. Reduced motion opens the destination directly. Routes work in both directions, without erasing discoveries. Existing chapter-completion cinematics remain alternative routes.

The compact on-screen minimap remains visible during surface exploration and inspection without pausing play or opening a dialog. The map separates historical site references from the shuttle’s locally calculated simulated position. Markers use north-positive latitude and 0–360° east longitude. The rectangular graticule is schematic; the route line interpolates latitude and the shorter wrapped longitude difference. It is not a great-circle calculation, realistic flight dynamics, geographic rover movement, or live telemetry. Steering offset tapers to zero at each endpoint. Lesson stations are composites of events from different places and years, so site coordinates do not certify their depicted positions.

| Location | Reference coordinates | Official source |
| --- | --- | --- |
| Apollo 11 / Tranquility Base | 0.67409° N, 23.47298° E | [NASA Lunar Surface Journal](https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11ov.html) |
| Pathfinder / Ares Vallis | 19.47° N, 326.75° E | [NASA GISS Mars24](https://www.giss.nasa.gov/tools/mars24/help/landers.html) |
| Spirit / Gusev Crater | 14.57° S, 175.48° E | [NASA GISS Mars24](https://www.giss.nasa.gov/tools/mars24/help/landers.html) |
| Opportunity / Meridiani Planum | 1.95° S, 354.47° E | [NASA GISS Mars24](https://www.giss.nasa.gov/tools/mars24/help/landers.html) |
| Voyager encounter | No planetary surface coordinates | [NASA Voyager 1](https://science.nasa.gov/mission/voyager/voyager-1/) |

Checked October 18, 2026. Different historical publications can report different coordinate frames and precision. The Mars markers consistently use the one named source above. The UI rounds to two decimal degrees and does not claim survey precision. Voyager’s encounter is fictional; no current distance, present spacecraft condition or actual alien discovery is invented.

## Delivery and maintenance

Application files remain in `src/`, runtime assets in `public/`, and presentation-video production in `pitch-video/`. The entire video production workspace is Git-ignored; existing final movies, sources, scripts and storyboards remain intact. Local `output/` and `tmp/` folders are also ignored. Runtime historical Apollo audio stays in `public/audio/`.

`tests/museum-shuttle.spec.ts` checks five-mission browsing, scroll restoration, sources, persistent canvas, persistent minimap visibility, model-click landing entry, keyboard steering, pause/resume, skipped/natural arrival, reverse routes, reduced motion and Moon/deep-space semantics. Existing suites continue checking inspection, guides, zoom, progress, flight, and renderer lifetime. Actual validation results and remaining limits are recorded at the top of [STATUS.md](STATUS.md). This revision does not imply a public deployment.

### Chapter 3 / 4 entry revision

The museum starts Spirit from Sojourner's Ares Vallis site and Opportunity from Spirit's Gusev site. Fly low, follow guide lights, and steer around rocks to acquire the next hardware signal. Rock contact stops the craft; retry restores the last checkpoint without changing discoveries. Optional cruise steers the course, while skip and reduced motion immediately open the destination. Ares, Gusev and Meridiani are widely separated: the playable course is a fictional compression, not a representation of their true spacing or a historical rover traverse.
