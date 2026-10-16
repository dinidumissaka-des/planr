# QA — EP 01   Verdict: PASS

Round 1 (36.4 s cut): REVISE. 3 blockers: the S7 band cut through "ABOUT 337 KM/H", ILLUSTRATIVE was 24 px, and the camera push put text at x 77–79. Hook, Clarity and Readability were 7; Visual craft was 6.
Round 2 (37.3 s): REVISE. 1 blocker: the S1/S8 rear wings and the cover crossed the y 1480 UI line (lowest pixel 1479–1488). Visual craft was 7 and every other axis was 8.

Round 3 reviewed `publish/master.mp4`: 37.70 s, 1131 frames, newer than `storyboard.json`. I pulled full-size frames from the master at 0.0, 0.033, 0.5, 0.8, 0.9, 1.2, 1.6, 2.2, 2.8 and 2.88 s, every frame from 2.5 to 2.93 s, every frame from 21.3 to 22.6 s, and at 22.0–24.6, 30.6, 33.5, 35.3, 35.4, 36.0, 36.6, 37.0 s and the last frame. I also reviewed a new `review/qa-sheet.png` (115 frames at 0.33 s), `publish/cover.jpg`, and the storyboard lint (0 errors, 0 warnings). As a negative test, I put the old y 1245 back in a copy of the storyboard and the lint raised 3 car_top safe-zone errors. The new check works.

| Axis | Score | Evidence |
|---|---|---|
| Hook | 8 | Unchanged and still works muted: the slam at 0.0 s, the accent rear wings pop and open at 0.7–1.0 s, and SO WHO PASSES? slams at 1.5 s. The wing beat is still a small element, so this is an 8, not a 9. |
| Clarity | 8 | The chain still reads in order: DRS, then Straight Mode for everyone, then the 1 s gap, then Overtake Mode, then +0.5 MJ, then deploying longer. The bars now stay on screen long enough to register as a scale. The S7 payoff still drops the NORMAL label, so the dashed arrow inside the band is unnamed (note). |
| Accuracy | 8 | Every on-screen line traces to a row (table below). "MIAMI RACE: NORMAL LIMIT 8.5 MJ" now matches F8 word for word ("maximum recharge in the race is 8.5 MJ"), so the round-2 soft spot is closed. Not a 9: the PlanetF1 "up to 9 MJ" discrepancy is still unrecorded in the sheet. |
| Visual craft | 8 | The blocker is fixed. The lowest accent pixel is now y 1457 at its worst, 23 px clear of the line. Headline to front wing is 48 px, still clear. The bars measure 811 and 859 px, a ratio of 0.944, which equals 8.5 / 9.0. Not higher: S5 is still the only scene with non-mono labels. |
| Pacing | 8 | The S5 comparison is fully settled by about 22.2 s and holds until the whip at 24.5 s, about 2.3 s at rest (round 2 was about 1.5 s). The longest gap with nothing new on screen is the payoff hold, 32.5 → 35.3 s, and it earns it. The loop seam is clean. |
| Originality | 8 | Unchanged. It uses a real FIA comparison instead of filler, the taper chart is sourced, and the BECAUSE… loop feels authored. |
| Readability | 8 | Body text is 48–56 px, labels 34–38 px, contrast is high. S5 now has about 22 visible tokens over 5.6 s, about 3.9 per second (round 2 was 4.2), and the bars arrive after the body line has finished. The lint word count is within 3.6 words/s. |

Every axis is ≥ 8 and there are 0 blockers. This passes.

## Blockers
None.

### Blocker 1 re-measure (accent pixels #FF3B1F, region x 150–1000, y 880–1800)
| t (s) | Lowest accent pixel | Lowest car ink | vs y 1480 |
|---|---|---|---|
| 0.8 | 1447 | 1448 | clear by 33 px |
| 0.9 | 1448 | 1449 | clear by 32 px |
| 1.2 | 1449 | 1450 | clear by 31 px |
| 1.6 | 1451 | 1452 | clear by 29 px |
| 2.2 | 1453 | 1454 | clear by 27 px |
| 2.8 | 1455 | 1457 | clear by 25 px |
| 2.88 (last S1 frame, maximum push) | 1457 | 1457 | clear by 23 px |
| cover.jpg | 1453 | 1454 | clear by 27 px |
| 35.4 (S8 entry, 1.025× push) | no accent | 1458 | clear by 22 px |
| 36.0 / 36.6 / 37.0 / last | no accent | 1450 / 1446 / 1445 / 1445 | clear |

Other edges: "SO WHO PASSES?" ink bottom is y 850 and the left car's front wing top is y 898, a 48 px gap (the predicted 49). The leftmost ink across S1 is x 95–106. The only x < 90 reading is x 89, on the first S2 frame (2.90 s): whip motion blur on the side-view car, lasting 1 frame. Ignore it.

### Fact check (every on-screen line; times shift +0.4 s from S6 onward)
| t (s) | On screen | Row | Status |
|---|---|---|---|
| 0.0 | EVERY CAR OPENS ITS WINGS NOW | F3 | OK |
| 1.5 | SO WHO PASSES? | — | Question, no claim |
| 2.9 | 2011–2025 / DRS: 15 SEASONS | F1 | OK |
| 5.1 | REAR FLAP | F2 | OK |
| 5.5 / 7.2 | Within 1 s, the chaser opened a flap / the leader couldn't. | F2 | OK |
| 8.5 | 2026 / EVERY CAR. EVERY ZONE. BOTH WINGS. | F3, F5 | OK |
| 10.3 / 12.1 | Straight Mode saves energy. / It isn't a passing aid. | F4 | OK |
| 13.8 | THE 1-SECOND GAP SURVIVED | F7 | OK as 2026 practice |
| 15.4 | Within 1 s at the detection line: Overtake Mode, next lap. | F7 | OK, the safe wording |
| 18.9–21.3 | OVERTAKE MODE / +0.5 MJ / The chaser may recover 0.5 MJ more energy / per lap. | F8 | OK, framed as a raised limit |
| 21.5 / 21.75 | MIAMI RACE: NORMAL LIMIT 8.5 MJ / IN OVERTAKE MODE 9.0 MJ | F8 | OK. The race qualifier now matches the FIA Miami PU document as recorded in F8 |
| 24.5 | THEN DEPLOY FULL POWER LONGER | F10 | OK |
| 24.9 / 25.6 | ELECTRIC POWER / UP TO 350 KW | F9–F11 | OK |
| 25.8–28.6 | NORMAL / OVERTAKE MODE / 290 KM/H / ABOUT 337 KM/H / SPEED / ILLUSTRATIVE | F9, F10 | OK |
| 30.5 / 32.5 | ONLY THE CHASER KEEPS FULL ELECTRIC POWER / Between 290 and about 337 km/h. | F9 + F10 | OK |
| 35.3 / 36.4 | THE WING ISN'T THE EDGE. / BECAUSE… | F3, F4 | OK |

### Diagram truth
- S1/S8: the 30 px move keeps the geometry. The noses point up, and the accent and the opening are on the rear wing only. S8 uses the same car_top y values as S1 (1140 / 1215).
- S5 bars, measured per frame: the 8.5 bar starts at 21.50 s and is settled at 901 px by about 22.2 s. The 9.0 bar starts at 21.77 s and is settled at 949 px by about 22.6 s. At rest the lengths are 811 and 859 px from x 90, a ratio of 0.944, which equals 8.5 / 9.0, on a zero-based scale. The animation still has the 9.0 bar shorter than the 8.5 bar for about 0.3 s (21.77–22.08 s). That is the stagger, not a data error.
- S6 and S7 are unchanged from round 2 apart from the +0.4 s shift. The coordinates are still exact, and the band (x 572.5–819.2, bottom y 1010) clears "ABOUT 337 KM/H".
- **Loop seam:** I compared the last frame (37.67 s) with frames 0 and 1. The bright car ink has an identical bounding box in all three (y 900–1444, x 289–790), and the mean luma difference in the car region is 1.9–2.2 (grain and antialiasing). The wings are closed and plain in both, and the scale is 1.0× at both ends. The seam is clean.

### Master (ffprobe / ebur128 on `publish/master.mp4`)
H.264 High, 1080×1920, 30 fps, 1131 frames, 37.70 s, about 9.5 Mb/s. AAC LC 48 kHz stereo. Integrated −14.4 LUFS, true peak −1.9 dBFS, LRA 13.6 LU. These match the Revision 2 numbers and the spec.

## Notes (non-blocking)
- [art-director] S5 at 21.5–24.5 s: the bar labels ("MIAMI RACE: NORMAL LIMIT", "IN OVERTAKE MODE") still render in Inter SemiBold. Every other label in the episode is DejaVu Mono Bold, as STYLE requires. Set `font: mono` and `weight: bold` on the bars labels in the next episode, or in the engine default.
- [art-director] S7 at 30.5–35.3 s: NORMAL is still dropped on the payoff, so the grey dashed arrow inside the band is unnamed. Optional fix: add NORMAL at (629.8, 904), `at: -2`, `in: none`, colour muted.
- [writer] S5 at 21.75 s: "IN OVERTAKE MODE" could be "OVERTAKE MODE", because the chip above already says it. That cuts 1 token from the densest scene. Optional.
- [researcher] F8: record the PlanetF1 "up to 9 MJ in practice and the race" quote and its conflict with the Miami PU document's 8.5 MJ. The on-screen figures stand on the primary document. Carried over from round 2 and still not done.
- [editor] `02-script.md`: the Edit notes and scene table above Revision 2 still show the old runtime and loudness. Revision 2 says it supersedes them, which is acceptable, but before archiving, update the scene start times in the table to S5 18.9, S6 24.5, S7 30.5, S8 35.3 s.
- [art-director] at 0.0–0.1 s and 36.6–37.7 s: the slam overscale transient and the uncued S8 wing close are unchanged from round 2 and acceptable.
