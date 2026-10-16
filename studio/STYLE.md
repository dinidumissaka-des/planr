# DOWNFORCE — Style Bible

Every agent in the studio reads this file before doing anything. If an output breaks a rule here, it is not done.

## What we make

Faceless F1 explainers for Instagram Reels, TikTok and YouTube Shorts. Editorial motion graphics: bold type, clean technical line-art, real numbers. One idea per video. A viewer should finish it able to explain that one idea to a friend.

**Audience:** F1 fans who watch races but do not read technical articles. Assume they know who the drivers are and what a pit stop is. Do not assume they know what a diffuser, undercut or porpoising is.

**Promise:** "F1, explained in 30 seconds." Smart, quick, never condescending.

## Fixed constraints (decided — do not re-litigate per episode)

| Thing | Rule |
|---|---|
| Canvas | 1080×1920, 9:16, 30 fps, H.264 High, AAC 48 kHz, −14 LUFS |
| Length | 25–40 s. Lint fails outside 15–60 s |
| Voice | No voiceover in the master. On-screen text carries the story. The writer also delivers an optional VO read for the owner to record |
| Music | Not baked in. The owner adds a trending sound in-app (better reach). The master carries a designed SFX bed so it works muted or with music |
| Hook | Text on screen by frame 5. Hook scene ≤ 3.2 s. No logo intro, no fade from black |
| Pace | Something new appears at least every 2–3 s. Scenes 0.8–7 s |
| Reading | ≤ 3.6 words/s visible. Display text ≤ 10 words per block, body ≤ 16. Min size 34 px |
| Safe zone | x 90–950, y 260–1480. Bottom 440 px and right edge are covered by app UI |
| Ending | Loops back into the opening line, or lands a payoff that makes a rewatch reward |
| Series | `EP NN` chip top-right on every video |
| Cadence | 3 videos a week |

## Visual system

- **Colours** (`studio/brand/brand.json`): carbon background `bg`, off-white `ink`, one accent `accent` (signal red-orange). Data colours: `data` (amber), `cool` (airflow blue). Tyre compounds use their real colours: `soft` red, `medium` yellow, `hard` white, `inter` green, `wet` blue.
- **One accent per frame.** The accent marks the single thing the viewer should look at. If everything is highlighted, nothing is.
- **Type:** Inter Display Black, uppercase, tight, for headlines. Inter SemiBold for body lines. DejaVu Mono Bold, uppercase, tracked, for labels and data.
- `*word*` colours a word with the accent. `[word]` puts it in an accent box. Use one of these per text block at most.
- **Diagrams beat decoration.** Every visual must explain something: an arrow shows a force, a bar compares two real numbers, a line shows a path. No ornamental shapes.
- **Cars are generic line-art** drawn by the engine (`car_side`, `car_top`). Never team liveries, logos, driver faces, broadcast footage or F1 trademarks.
- Big numbers get their own scene with a `counter`. Numbers always carry a unit.

## Story shape (the default beat sheet)

1. **Hook (0–3 s)** — a claim, a contradiction or a number that creates a question. "An F1 car could drive upside down." Not "Did you know...?"
2. **Stakes (3–8 s)** — why it matters in a race. A position, a lap time, a crash.
3. **Mechanism (8–28 s)** — 2–4 beats, each one diagram plus one line of text. This is where people learn.
4. **Payoff (28–35 s)** — the number or consequence that makes it click.
5. **Loop / turn (last 2–4 s)** — return to the hook with new meaning, or one short line that sends people back to the start.

## Anti-slop rules (QA rejects on any of these)

1. **No unverified facts.** Every number and claim on screen traces to the research sheet with at least two independent sources, or one primary source (FIA regulations, team or Pirelli technical material). If sources disagree, show a range or say "up to".
2. **No fake precision.** "About 3.5×" if the sources say "3 to 4 times". Never invent decimals.
3. **No filler phrases.** The lint banned list is the minimum: "did you know", "let's dive in", "game changer", "in the world of", "buckle up", "mind-blowing", "insane". Also cut empty intensifiers like "really" and "very".
4. **No generic AI visuals.** No AI-generated images, no stock-looking gradients-as-content, no emojis in the video.
5. **No vague words where a number fits.** "A lot of downforce" is wrong; "over 3 times its weight" is right.
6. **One idea.** If the script needs "also", it is two videos.
7. **Specific over general.** A real example (a named race, lap or corner) beats a hypothetical, as long as it is sourced.
8. **Respect the viewer.** No "you won't believe". The content is the hook.
9. **Illustrative is labelled.** Any chart that is not real data carries the note `ILLUSTRATIVE`.

## Voice

Short, declarative sentences. Present tense. Second person only when it earns its place ("you'd feel 5 g"). British/F1 terms: tyres, kerb, pit wall. Write numbers as digits. Confident, a little dry, never shouty. Caps in the video come from the typography, not from shouting in the copy.
