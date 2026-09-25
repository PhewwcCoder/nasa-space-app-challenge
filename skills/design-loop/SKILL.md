---
name: design-loop
description: Takes a goal and a real-world reference, extracts what makes the reference good, then runs a builder and three fresh-context critics on each piece until all three pass. Use for "/design-loop", "design loop", "run the critic loop", or "loop this against" requests.
---

# Design Loop

Four phases: interview, preflight, teardown, loop. Do not skip ahead. Do not start building during phases 1 to 3.

## Phase 1: Interview

Ask exactly these three, together, then stop and wait.

1. What are you building, and how long or how big?
2. Name something that already does this brilliantly. A site, a video, a doc, anything I can open. If nothing comes to mind, say skip.
3. Any files I should work from? Design system, brand doc, script, existing draft.

If they name something vague ("Apple's website", "good SaaS design"), push once for the specific page or file. A vague bar makes critics invent comparisons and approve too easily.

If they say skip on question 2, propose three candidate bars, one line each on why, and wait. If they do not answer, take the hardest one.

## Phase 2: Preflight

A check, not a question. Run it before any work and report in one block.

- Fetch the bar now. Screenshot the URL or read the file. If blocked or missing, say so and ask for another.
- Confirm you can render our output: screenshots for a site, a filmstrip for animation, a PDF render for a document. No render means no craft critic.
- Name any generation tools the goal needs (image, video, voice) and confirm they are connected.
- Confirm the input files exist: design-system.md, brand document, script. Resolve actual supplied filenames rather than inventing missing inputs.

Print what works, what is missing, and which critic goes blind if something is missing. Never carry on quietly with a critic that cannot see.

## Phase 3: Teardown

Read the reference properly and write 5 to 7 mechanisms to bar.md.

Mechanisms, not adjectives. Examples:
- Headline is 5x body size, three type sizes total.
- One accent colour, used at most twice per screen.
- Motion always resolves in one direction.
- Nothing animates for under 400ms.
- Whitespace above the fold is at least 40% of the frame.

Every line must be checkable by looking. Show bar.md to the user before continuing.

## Phase 4: Loop

Split the goal into the smallest independently improvable and judgeable pieces. Choose three or four unless told otherwise.

For each piece, delegate to a builder, then three fresh-context critics who do not know how the builder worked.

- Brief critic: stated goal only. Does it do the thing? Ignore aesthetics.
- System critic: design-system.md only. Objective adherence.
- Craft critic: bar.md and rendered output only. Compare ours and the reference blind with labels stripped; choose the better result and name the single biggest gap.

Write each critic's task brief yourself, adapted to this specific goal. Do not reuse generic briefs across different goals.

Rules:
- Critics are harsh. Praise is not useful.
- Critics judge rendered output, never implementation code. Reading implementation biases toward intent rather than result.
- Binary verdicts, not scores.
- All three must pass. Any failure returns to the builder with the single biggest gap.
- No fixed round count. Exit when all three pass or the user stops the run.
- Keep a live progress page with piece status, each critic's verdict, gap history, and round count.

## Cost

Do not claim reliable self-reported token costs. Show round count and elapsed pieces instead.

If the user names a ceiling, treat it as a checkpoint: pause and ask before continuing past it. Explain that the user watching and stopping the run is the practical brake.

## What breaks this

Vague references; builder self-review; soft critics; drifting numerical scores; a fixed round count; instructions so prescriptive that no design judgment remains.
