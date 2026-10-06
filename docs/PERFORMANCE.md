# Chapter switching profile ? October 6, 2026

## Findings

The expensive path was chapter replacement inside the persistent Canvas, not the archive dialog itself. `ArchiveIndex.close()` called the Zustand `visitChapter()` action in the click handler. `World.Scene` then conditionally replaced entire R3F trees. The Canvas survived, but most of its expensive children did not.

- **GLTF loading:** Drei already cached parsed source GLTFs. Revisits did not download/redecode the GLBs, but Apollo rebuilt wrapper groups, copied geometry and cloned its authored materials; Spirit regrouped meshes. Full Apollo and Spirit were not both preloaded.
- **Geometry/materials:** Both Mars worlds reconstructed procedural terrain, ridges, rock instances and hundreds of JSX meshes. Spirit eagerly rebuilt blue edge geometry even on the wide surface view where it was invisible. The readable dev CPU profile attributed about 324 ms of cold Spirit samples and 454 ms of its warm revisit samples directly to `EdgesGeometry`, excluding its callers and buffer access. Pathfinder also regenerated 40 line geometries on parent updates.
- **GPU work:** CPU sampling found substantial waits in `getProgramInfoLog` (approximately 616 ms cold Apollo, 1,039 ms cold Sojourner and 3,175 ms cold Spirit in the separate dev profiling run). This is evidence of synchronous shader/program readiness waits, not a measurement of GPU execution time. Spirit also regenerated its HDR/PMREM environment on every mount. New or disposed materials meant revisits still initialized programs and render resources.
- **React:** Whole-store subscriptions updated scene and DOM trees for unrelated scan/travel changes. Parent renders also rebuilt static JSX. `startTransition(() => visitChapter())` alone would not fix this: external-store updates remain synchronous. The implementation instead yields the navigation task and transitions the React-owned scene-mount state.
- **GSAP:** `ScanTransition.tsx` is unused historical code. It is the only source creating a ScrollTrigger; the chapter-switch path creates none. No GSAP/ScrollTrigger initialization was found in that path.

## Changes

The implementation keeps one Canvas, one renderer and the same camera, retaining visited scene graphs in R3F portals. Inactive graphs are neither rendered nor raycast, and their simulation/camera controls do not run. Portal-local lighting, fog and environments preserve the original composition. The index closes and focus returns before deferred navigation. Missing scene mounts run separately and await `WebGLRenderer.compileAsync()` before display. Opening the archive preloads existing Apollo and Spirit assets. The last composited frame remains visible without redundant GPU draws while a cold destination prepares; a late result cannot override the latest destination.

Spirit's unchanged Three.js edge algorithm now runs in a Web Worker, using copied input arrays and cached results. Immutable Apollo geometry is shared, static subtrees and Pathfinder lines are stable, and selectors keep unrelated store changes out of most React trees. CSS, visual assets, model detail, lighting and DPR are unchanged.

See [architecture](ARCHITECTURE.md) for ownership and lifecycle details. Technical references: [React external-store transition caveat](https://react.dev/reference/react/useSyncExternalStore), [R3F performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls), [Three.js compileAsync](https://threejs.org/docs/pages/WebGLRenderer.html#compileAsync).

## Measurement method

`scripts/profile-chapters.mjs` launches installed headless Chrome, collects Event Timing entries (16 ms reporting threshold), long tasks, local resource requests and user-timing preparation measures, and writes a CPU profile and screenshot per switch. Use a production preview for latency; dev mode is a separate run for readable stack names. Chrome 154.0.8037.98 / Windows / ANGLE Intel UHD Graphics (Direct3D11); `KHR_parallel_shader_compile` is available. No CPU/network throttling. Default viewport: 1440?900, DPR 1, reduced motion for repeatable compositions. Each browser context starts fresh, then visits Apollo ? Sojourner ? Spirit twice. Warm means already visited in that context. GPU/driver caches are not forcibly purged. Values are local interaction samples, **not field INP percentiles** or guarantees for another device.

The supplied `Recording 06_10_2026 at 11_36_08.json` is a Chrome Recorder action export, not a Performance trace: it contains thirteen steps and no event durations or stack samples. Its 802?911 viewport and Apollo-footprints/Escape ? Spirit ? Sojourner ? Spirit ? Apollo sequence are reproduced locally. Its production URL is reference data; this work does not modify or deploy that site.

Baseline production interactions (maximum Event Timing duration for each selection, ms):

| Chapter | First visit | Warm revisit |
| --- | ---: | ---: |
| Apollo 11 | 144 | 576 |
| Sojourner | 1,232 | 336 |
| Spirit | 72 | 488 |

Spirit's first click appears deceptively short because its uncached load suspended: the same cold entry subsequently produced a 2,843 ms long task. Apollo and Sojourner cold windows reached 643 and 1,102 ms. Measuring only the handler would miss much of the shader/render work.

Final optimized production results across two fresh contexts (`after-frozen`, `after-confirm`), maximum event duration per selection, ms:

| Chapter | First visit, two runs | Warm revisit, two runs | Baseline warm |
| --- | ---: | ---: | ---: |
| Apollo 11 | 24 / 24 | 24 / 72 | 576 |
| Sojourner | 24 / 112 | 24 / 48 | 336 |
| Spirit | 24 / 48 | 56 / 56 | 488 |

All twelve chapter selections were below 200 ms. The measured click processing portions were 1.1?4.3 ms. All six warm revisit windows had **zero long tasks**, no new model/texture/Draco requests, and no repeated preparation measures. The matching final surface PNGs for all three warm chapters are pixel-identical to the baseline (mean per-channel absolute difference 0.0 at 1440?900, reduced motion).

The exact supplied Recorder sequence at 802?911 (`recorded-final`) measured **40 ms Spirit, 24 ms Sojourner, 24 ms Spirit revisit, 24 ms Apollo revisit**. There were no browser page errors.

Cold preparation is not free: final full-size runs still had maximum long tasks of 155?185 ms for Apollo, 187?631 ms for Sojourner and 136?1,038 ms for Spirit, after the immediate input response. Spirit's async preparation measure ranged from 399?757 ms. The small-viewport recorded run's cold Spirit and Sojourner windows reached 162 and 126 ms respectively. These variations are why the report does not equate short click latency with eliminating all later stalls. Avoiding redundant draws of the previous world reduces GPU competition while the new shaders prepare, but driver synchronization, uploads and PMREM/shadow setup remain initial-load costs.

## Validation

Typecheck, production build and pure flight simulation checks pass. The full desktop suite passed **16/16** (4.7 minutes). After the assembly-reset refinement, all five focused resource/race/zoom checks passed (51.3 seconds). After the final retained-frame scheduling adjustment, all four replay/race and natural/skipped transit cases passed (30.6 seconds). The replay asserts that extracted parts reset on leaving, resources remain identical on revisits, keyboard entry restores archive focus, and a delayed Spirit load cannot override a newer Prologue request. Existing tests cover normal/reduced-motion transit, scan gates, discovery persistence, inspection and guide exits, note-scroll reset, zoom bounds and refresh.

Reviewed desktop surface, Spirit hardware/outline and recorded-viewport captures. No CSS or visual asset changes. Mobile/Safari/physical-device profiling remains deferred; existing pointer/touch handlers are preserved. The existing Vite large-vendor-chunk advisory remains.

## Reproduce

Start Vite on 5173 for behavioral tests, and build/serve production separately on 4173:

```powershell
npm run dev
# Separate terminal:
npm run build
npx vite preview --host 127.0.0.1 --port 4173
# Another terminal, with other browser workloads idle:
node scripts/profile-chapters.mjs after http://127.0.0.1:4173
node scripts/profile-chapters.mjs recorded http://127.0.0.1:4173 'C:\Users\Aryan\Downloads\Recording 06_10_2026 at 11_36_08.json'
npx playwright test --project=desktop
```

Local raw evidence lives under `docs/qa/performance/` (JSON, `.cpuprofile`, PNG). Import `.cpuprofile` into Chrome's JavaScript Profiler to inspect the captured call stacks. The automated replay additionally checks first-render-opportunity ordering, exact scene/geometry/material identity on revisits, Canvas/renderer/camera identity, keyboard entry, focus restoration and stale asynchronous completion.

## Limits

Retaining visited worlds deliberately increases resident session GPU memory (bounded to the four built chapters plus the transit scene). Initial GLTF decoding, GPU texture uploads, PMREM creation and shadow initialization still cost time outside the selection's immediate response. `compileAsync` benefits from the browser's parallel shader compilation extension; it cannot make every GPU initialization step nonblocking. Physical mobile hardware, Safari and low-end GPUs require separate profiling. No public deployment was performed.


## Chapter 4 extension / 2026-10-06

Opportunity uses the same retained-world, deferred mount, cached GLTF and asynchronous shader preparation path. The resource-identity test now covers all four surface chapters and verifies the original Canvas/renderer/camera. No second Canvas or scene-wide remount key is introduced.

A final production Chrome sample at 1440x900, DPR 1 and reduced motion recorded Opportunity selection at 56 ms on first entry and 24 ms on the warm revisit. Its cold shader preparation measure was 244.7 ms and the largest later cold long task was 186 ms. Warm selections across Apollo, Sojourner, Spirit and Opportunity were 24-56 ms, with no long tasks or repeated preparation. These are Event Timing interaction samples on this machine, not a field INP guarantee. Cold GPU/asset work remains observable after the initial UI response. Profiles, screenshots and exact results are in `docs/qa/performance/opportunity-final/`; reproduce with `node scripts/profile-chapters.mjs opportunity-final http://127.0.0.1:4173` against the built preview.
