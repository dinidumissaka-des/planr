# DOWNFORCE — F1 explainer studio

A studio of AI agents that turns a one-line F1 idea into an upload-ready short explainer video for Instagram Reels, TikTok and YouTube Shorts.

**Your job:** give the idea, then publish. **The studio's job:** everything in between.

## Make an episode

In Claude Code, from the repo root:

```
/f1-studio why DRS is so powerful
```

About 20–40 minutes later you get, in `studio/episodes/<NNN-slug>/publish/`:

| File | What it is |
|---|---|
| `master.mp4` | 1080×1920, 30 fps, 25–40 s, with sound effects, ready for all 3 apps |
| `cover.jpg` | Cover frame (title inside Instagram's 3:4 grid crop) |
| `POSTING.md` | Captions, YouTube title, hashtags, first comment, music advice, posting time, checklist |

## The team

| Role | Agent | Output |
|---|---|---|
| Producer | `/f1-studio` skill | Runs the pipeline, enforces the gates |
| Creative strategist | `studio-strategist` | `00-brief.md` — 3 angles scored, 1 picked |
| Researcher | `studio-researcher` | `01-research.md` — every fact double-sourced |
| Scriptwriter | `studio-writer` | `02-script.md` — beat sheet and optional voiceover |
| Art director | `studio-art-director` | `storyboard.json` and stills |
| Editor | `studio-editor` | master MP4, cover, pacing and sound |
| Head of quality | `studio-qa` | `qa.md` — PASS or precise fixes (up to 3 rounds) |
| Distribution | `studio-publisher` | `POSTING.md` |

## How quality is enforced

- `studio/STYLE.md` — the brand bible every agent follows, including the anti-slop rules.
- `studio/engine/lint.py` — mechanical gate: hook on screen by 0.15 s, reading speed, safe zones, banned phrases, length.
- QA scores 7 axes and only passes at ≥ 8 on every one, with zero fact blockers.
- Visuals are drawn by our own engine (`studio/engine/`): no stock footage, no AI images, no F1 trademarks.

## Music

The master has a sound-effects bed, not music. Add a trending sound inside each app at about 15–25% volume — that helps reach and keeps you clear of music licensing. To bake a track you own into the master, set `meta.music` in the storyboard to its path.

## Change the brand

Edit `studio/brand/brand.json` (name, handle, colours, fonts) and the voice in `studio/STYLE.md`.
