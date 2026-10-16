# QA — EP 01   Verdict: REVISE

Round 1 (36.4 s cut): REVISE. 3 blockers (the S7 band cut through "ABOUT 337 KM/H", ILLUSTRATIVE at 24 px, the camera push put text at x 77–79). Hook, Clarity and Readability were 7 and Visual craft was 6.

Round 2 reviewed: `publish/master.mp4` (37.30 s, 1119 frames; full-size frames pulled from the master at 0.0, 0.033, 0.5, 0.8, 0.9, 1.2, 2.2, 2.8, 22.5, 28.5, 33.5, 35.0, 36.0, 36.6 s and the last frame), a new `review/qa-sheet.png` (113 frames, 0.33 s), `publish/cover.jpg`, `storyboard.json` (lint: 0 errors, 0 warnings), `01-research.md`, `02-script.md` including Revision 1.

| Axis | Score | Evidence |
|---|---|---|
| Hook | 8 | The slam lands at 0.0 s. At 0.7 s both rear wings turn accent with a pop, they open by 1.0 s, and SO WHO PASSES? slams at 1.5 s. That is three visible beats in 1.5 s, and it works muted. The wing beat is still a small element (about 150×20 px per car), so this is an 8, not a 9. |
| Clarity | 8 | "Recover" replaces "harvest". The S5 bars give 0.5 MJ a scale (8.5 vs 9.0 MJ). S6 names its y-axis "ELECTRIC POWER". DRS → Straight Mode → 1 s → Overtake → deploy longer is a chain a casual fan could repeat. The remaining gap: at 30.1 s the S7 payoff drops the NORMAL label, so the grey dashed arrow inside the band is unnamed. |
| Accuracy | 8 | Every on-screen line traces to a row and stays within its safe wording (table below). I re-checked the new S5 bar figures today: search extracts of the FIA Miami PU document give 8.5 MJ (race, Overtake off) and 9.0 MJ (Overtake on). One soft spot: the label omits "race", and Miami qualifying was 8.0 MJ (see notes). |
| Visual craft | 7 | All three round-1 blockers are fixed. Text sits at x 96–104 throughout, the S7 band stops at y 1010 and clears "ABOUT", and ILLUSTRATIVE is 34 px. But the hook's one accent element now crosses the bottom of the safe zone (blocker 1), and it sits on the cover too. |
| Pacing | 8 | Something new appears at least every 2.8 s. The longest hold is the payoff, 32.1 → 34.9 s, and it earns it. The loop seam is clean (below). S5 is tight: the 9.0 MJ bar finishes growing at about 22.6 s and the whip comes at 24.1 s, which leaves about 1.5 s to read the comparison. |
| Originality | 8 | The filler car pair in S5 is gone, replaced by a real FIA comparison. The taper formulas, the "rear only → both wings" contrast and the BECAUSE… loop all feel authored. |
| Readability | 8 | Body text is 48–56 px, labels 34–38 px, contrast is high and ILLUSTRATIVE is 34 px. S5 is dense: the lint counts 18 words, but with the counter and the bar values there are 22 visible tokens in 5.2 s, about 4.2 per second. See notes. |

Pass bar not met. One blocker remains, and Visual craft is 7 because of it. Fix the blocker and this passes.

## Blockers
- [owner: art-director] at 0.9–2.9 s (S1) and on the cover (2.2 s): the accented open rear wing of the right-hand car (x 700, y 1245). Its lowest accent pixel measures y 1479 at 0.9 s, 1484 at 2.2 s (the cover) and 1487 at 2.8 s as the push zooms in. STYLE's fixed safe zone ends at y 1480, and below that line the app caption and UI sit. This is the hook's one accent, the beat added in Revision 1. The lint checks only text, so it didn't catch it. S8 has the same problem: the plain car reaches y 1488 at 35.0 s (S8 starts at 1.025× during the push transition). Fix: move every `car_top` in S1 and S8 up by 30 px. That is all four S1 cars (y 1170 → 1140, 1245 → 1215) and both S8 cars (same values), so the loop seam still matches. Measured gap from "SO WHO PASSES?" (ink bottom y 850) to the left car's front wing (ink top y 929) is 79 px today and will be 49 px after the move, which is still clear. Re-render the master and the cover afterwards.

### Fact check (every on-screen line)
| t (s) | On screen | Row | Status |
|---|---|---|---|
| 0.0 | EVERY CAR OPENS ITS WINGS NOW | F3 | OK. "Opens" doesn't claim automatic. Top view animates only the rear wing; S3 shows both |
| 1.5 | SO WHO PASSES? | — | Question, no claim |
| 2.9 | 2011–2025 / DRS: 15 SEASONS | F1 | OK |
| 5.1 | REAR FLAP | F2 | OK (rear wing only) |
| 5.5 / 7.2 | Within 1 s, the chaser opened a flap / the leader couldn't. | F2 | OK, the safe wording |
| 8.5 | 2026 / EVERY CAR. EVERY ZONE. BOTH WINGS. | F3, F5 | OK. "Every zone" now matches F3's "designated zones" exactly. The low-grip partial activation (F6) is an exception, but the research rules it out of scope and the safe wording says "both wings open" |
| 10.3 / 12.1 | Straight Mode saves energy. / It isn't a passing aid. | F4 | OK, word for word |
| 13.8 | THE 1-SECOND GAP SURVIVED | F7 | OK as 2026 practice; doesn't say "the rules say 1 s" |
| 15.4 | Within 1 s at the detection line: Overtake Mode, next lap. | F7 | OK, the safe wording |
| 18.9–21.3 | OVERTAKE MODE / +0.5 MJ / The chaser may recover 0.5 MJ more energy / per lap. | F8 | OK. "May recover … more" describes a raised limit, not a top-up, as the research asks |
| 21.8 / 22.2 | MIAMI: NORMAL LIMIT 8.5 MJ / IN OVERTAKE MODE 9.0 MJ | F8 | OK. These are the FIA Miami PU document's race figures, re-confirmed by search extract today (the WebFetch to fia.com still fails with ENOTFOUND). See the note on "race" |
| 24.1 | THEN DEPLOY FULL POWER LONGER | F10 | OK ("harvest more, deploy longer") |
| 24.5 / 25.2 | ELECTRIC POWER / UP TO 350 KW | F9–F11 | OK. Axis name, plus F11's safe phrase |
| 25.4–28.2 | NORMAL / OVERTAKE MODE / 290 KM/H / ABOUT 337 KM/H / SPEED / ILLUSTRATIVE | F9, F10 | OK. Only sourced points are plotted, with no zero on the normal line |
| 30.1 / 32.1 | ONLY THE CHASER KEEPS FULL ELECTRIC POWER / Between 290 and about 337 km/h. | F9+F10 | OK, the payoff safe wording |
| 34.9 / 36.0 | THE WING ISN'T THE EDGE. / BECAUSE… | F3, F4 | OK, a conclusion from the misconception section |

### Diagram truth
- S1/S8: the cars point nose up and the rear wing sits at the bottom. The accent and the opening are on the rear wing. Correct.
- S2: only the rear flap opens and turns accent; the front flap stays shut. S3: front and rear open together (flat) and shut together (steep). Correct.
- S4: the noses point right, the chaser turns accent only once its nose reaches the detection line, and the bracket runs from the line to the leader's rear. Correct.
- S5 bars: the scale starts at zero with `max: 9.0`. At rest the bars measure about 808 and 856 px, a ratio of 0.944, which equals 8.5/9.0. **The scale is honest.** For about 0.3 s while it grows (22.2–22.5 s) the 9.0 bar is shorter than the 8.5 bar, but that is the animation, not a data error. It is clear enough to read as "a small raise in the limit", which matches the research's "not a free battery" framing.
- S6: the axis label is placed correctly, above the y-axis at x 114. 290 → x 572.5, 337 → x 819.2 and 350 kW → y 680 are exact. The normal stub's slope matches 1800 − 5v. The OVERTAKE MODE label now arrives with its line (26.1 s). Correct.
- S7 band: x runs 572.5–819.2 (290 to about 337 km/h), the top is the 350 kW line and the bottom is y 1010. It doesn't touch "ABOUT 337 KM/H" (glyph tops at about y 1085). The 0.18-alpha fill reads as a region. The rectangle's bottom edge (about 144 kW) is a framing choice, not data, and the ILLUSTRATIVE note covers it. Correct.
- **Loop seam (last frame 37.27 s vs frame 0):** same car positions, same scale (S8 `pull` ends at 1.0×, S1 `push` starts at 1.0×), wings closed and plain in both. A pixel diff of the car region shows only grain-level differences. Frame 0 has no headline yet (the slam starts transparent), and the ghosted slam is visible from frame 1. The progress bar resetting from full to empty is expected. **The seam is clean, and the blink is gone.**

### Master (ffprobe / ebur128 on `publish/master.mp4`)
H.264 High at level 4.2, 1080×1920, 30 fps, 1119 frames, 37.30 s, about 9.5 Mb/s. AAC LC 48 kHz stereo. Integrated −14.3 LUFS, true peak −1.0 dBFS, LRA 13.6 LU. All match the stated re-export and the spec.

## Notes (non-blocking)
- [art-director] S5 at 21.8–24.1 s: the bars come in at local 2.9 s and 3.3 s, and the scene ends at 5.2 s, so the finished comparison stays on screen for only about 1.5 s. Set the bars to `at: 2.6` and `stagger: 0.25`, and give S5 +0.4 s (5.2 → 5.6; runtime 37.7 s). That gives the comparison about 2.2 s at rest.
- [writer] at 21.8 s: "MIAMI: NORMAL LIMIT". Miami qualifying ran at 8.0 MJ; the 8.5 is the race figure. Change it to "MIAMI RACE: NORMAL LIMIT" (+1 word; bar labels are 38 px with room on the line). If you want the scene's word count back, "IN OVERTAKE MODE" can become "OVERTAKE MODE", because the chip above already says it.
- [art-director] S5: the bar labels render in Inter SemiBold (the engine default `label_size` 38). STYLE sets mono for labels and data, and every other label in the episode is mono. It's not a rule break worth a blocker, but S5 is the odd scene out.
- [art-director] S7 at 30.1–34.9 s: the NORMAL label is dropped at the cut, so the grey dashed arrow inside the band is unnamed on the payoff frame. If the word budget allows, keep NORMAL at (629.8, 904), `at: -2`, `in: none`. It sits inside the band and is muted, so it doesn't compete with the accent. Otherwise leave it.
- [art-director] at 0.0–0.1 s: on frames 1–3 the slam overscale puts the headline's leftmost ink at about x 36. It's a 3-frame transient, as in round 1, and acceptable.
- [art-director] at 36.6–37.3 s: the S8 wings close with no cue, so that the seam can match. It works for the loop and reads as "the wing goes away" under BECAUSE…. Leave it.
- [researcher] F8: PlanetF1's piece on the FIA clarification quotes the FIA as saying "up to 9 MJ in practice and the race", and PlanetF1 itself flags that this sits oddly with the Miami PU document's 8.5 MJ without Overtake. The document is primary, and Melbourne, Zandvoort, Monaco and Monza documents all show the same 0.5 MJ gap, so the on-screen figures stand. Record the discrepancy in the sheet.
- [editor] `02-script.md` → the Edit notes still say 36.4 s, −13.6 LUFS and −0.6 dBFS, and the scene table is the pre-Revision-1 timing. Update them to 37.3 s, −14.3 LUFS and −1.0 dBTP, with the current start times (S5 18.9, S6 24.1, S7 30.1, S8 34.9 s).
- [art-director / engine] The lint checks the safe zone for text only. Blocker 1 would have been caught if it also checked the bounding boxes of `car_top`, `car_side` and `bars`. Suggest adding that check.
