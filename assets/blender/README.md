# Spirit authoring source

Open `spirit-refined.blend` in Blender 4.5 or newer. Textures are packed. The scene uses metres and Blender Z-up; export converts to glTF Y-up. The four assembly values are `body`, `power`, `mobility`, and `instruments`; the fixed body is not a lesson selection.

Rebuild from the repository root:

```powershell
blender --background --factory-startup --python scripts/build-spirit.py
```

The script reads the untouched `public/models/mer-rover.glb` NASA/VTAD source, adds reference-inspired mesh detail, merges per assembly/material, saves this editable source and exports `public/models/spirit-refined.glb` with Draco compression. `spirit-refined.json` records geometry totals. The app uses its own landscape and lighting rather than cameras or lights in this file.

Provenance: https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/

The user's reference renders guide appearance only. They are not embedded or redistributed. This is an interpretive teaching reconstruction; linkage placement, pose, disassembly and detail are not engineering measurements or an archaeological survey. See `docs/ASSETS.md` for current provenance.
