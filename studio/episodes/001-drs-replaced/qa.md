# QA — EP 01   Verdict: REVISE

Reviewed: `publish/master.mp4` (frames pulled from the master at full size), `review/qa-sheet.png` (111 frames, 0.33 s), `publish/cover.jpg`, `storyboard.json`, `01-research.md`, `02-script.md`.

| Axis | Score | Evidence |
|---|---|---|
| Hook | 7 | The flat claim lands on frame 5 at 130 px, and fans will feel the contradiction. But the only motion is each rear-wing bar splitting into two lines, about 150×35 px, at 0.3–0.8 s, while the eye is still on the headline. Muted, nothing in the picture *happens*. |
| Clarity | 7 | DRS → Straight Mode → 1 s → Overtake is a clean chain. It breaks at 18.9–23.2 s: "harvest" is jargon for this audience, and "+0.5 MJ" has no scale. A casual fan can't tell whether that is a lot. In the S6 chart (23.2 s) the y-axis has no label, so "power" has to be inferred. |
| Accuracy | 8 | Every on-screen line maps to a research row and its safe wording (table below). 290, 337, 0.5 MJ and 1 s are corroborated against FIA document extracts. Small overreach: "EVERY STRAIGHT" when Monaco had 0 zones (F5). |
| Visual craft | 6 | The payoff frame has text struck through by a line ("ABOUT 337 KM/H", 30.0–34.0 s). The camera push puts headlines at x 77–79, outside the safe zone. ILLUSTRATIVE is 24 px. "SO WHO PASSES?" sits about 30 px above the car's front wing (2.2–2.9 s). |
| Pacing | 8 | Something new appears at least every 2.8 s. The longest static hold is the 2.8 s payoff (31.2–34.0 s), and it earns it. The BECAUSE… → hook loop reads as one sentence. The loop seam blinks: both cars vanish at 0.0 s and fade back in. |
| Originality | 8 | The line-art system, the real taper formulas and the "BECAUSE…" loop feel authored. The S5 car pair (19.9–23.2 s) is a re-use of S4 as filler. |
| Readability | 7 | Body text is 48–56 px and labels 34 px, at about 3.1 w/s overall. The ILLUSTRATIVE note is 24 px, under the 34 px minimum. The hook needs 4 w/s locally (6 words before 1.5 s), which is acceptable (see notes). |

Pass bar not met. Four axes are under 8, and there are 3 blockers.

## Blockers
- [owner: art-director] at 30.0–34.0 s (S7 +0.8 s onward): "ABOUT 337 KM/H". The payoff band's dashed left edge (rect x=572.5, running y 680→1240) cuts through the word "ABOUT" between the O and the U. This is on the payoff frame, which the viewer holds for 2.8 s. Fix: in S7, change the `shape` rect `h` from 560.0 to 330 so the band ends at y=1010, level with the bottom of the 290 km/h drop line. That clears the label, whose glyph tops sit at about y 1085. It also brings the band closer to the true advantage region, the area between the two curves, instead of everything down to 0 kW.
- [owner: art-director] at 23.6–34.0 s (S6, S7): "ILLUSTRATIVE". It is drawn at 24 px by the chart `note`, which breaks the STYLE minimum of 34 px. The art director's notes show this was known, but it still breaks the rule. Fix: remove `note` from both `chart` elements. Add a `text` element "ILLUSTRATIVE", `font: mono`, `weight: bold`, `size: 34`, `color: muted`, x=100, y=1262. In S6 use `at: 0.4`. In S7 use `at: -2` with `in: none`. It doesn't collide with SPEED, which is right-aligned at 940, or with the S7 body at y=1372. Re-run lint to confirm that rule 9 still passes without the `note`.
- [owner: art-director] at 0.0–23.2 s and 34.0–36.4 s (S1–S5, S8, all `camera: push`): every block at x=90. The push scales the frame, so the leftmost text ink measures x=79 at 2.6 s, x=78 at 13.5 s, x=77 at 18.6 s and x=78 at 36.3 s. The counter reaches x=951 at 22.8 s. The safe zone is x 90–950. S6 and S7 (`camera: none`) measure 92, so the problem is the camera. Fix: set `"camera": "none"` on S2, S3, S4 and S5. In S1 and S8, keep the push and move both text blocks from x=90 to x=104 so the loop frames still match. Update the cover after the change.

### Fact check (every on-screen line)
| t (s) | On screen | Row | Status |
|---|---|---|---|
| 0.0 | EVERY CAR OPENS ITS WINGS NOW | F3 | OK, matches the safe wording "every car… both wings open". See note on Monaco/low grip |
| 1.5 | SO WHO PASSES? | — | Question, no claim |
| 2.9 | 2011–2025 / DRS: 15 SEASONS | F1 | OK |
| 5.1 | REAR FLAP | F2 | OK (rear wing only) |
| 5.5 / 7.2 | Within 1 s, the chaser opened a flap / the leader couldn't. | F2 | OK, matches the safe wording |
| 8.5 | 2026 / EVERY CAR. EVERY STRAIGHT. BOTH WINGS. | F3 | OK, matches the safe wording |
| 10.3 / 12.1 | Straight Mode saves energy. / It isn't a passing aid. | F4 | OK, word for word |
| 13.8 | THE 1-SECOND GAP SURVIVED | F7 | OK. Describes 2026 practice and doesn't claim "the rules say 1 s" |
| 15.4 | Within 1 s at the detection line: Overtake Mode, next lap. | F7 | OK, matches the safe wording |
| 18.9–21.9 | OVERTAKE MODE / +0.5 MJ / The chaser may harvest 0.5 MJ more / per lap. | F8 | OK |
| 23.2 | THEN DEPLOY FULL POWER LONGER | F10 | OK ("harvest more, deploy longer") |
| 24.3 | UP TO 350 KW | F11 | OK, the safe phrase |
| 25.2–27.3 | NORMAL / 290 KM/H / OVERTAKE MODE / ABOUT 337 KM/H / SPEED | F9, F10 | OK |
| 29.2 / 31.2 | ONLY THE CHASER KEEPS FULL ELECTRIC POWER / Between 290 and about 337 km/h. | F9+F10 | OK, matches the payoff safe wording |
| 34.0 / 35.1 | THE WING ISN'T THE EDGE. / BECAUSE… | F3, F4 | OK, a conclusion drawn from the misconception |

### Re-check of the figures the writer asked about (WebSearch, extended; WebFetch to fia.com fails with ENOTFOUND here too)
- **0.5 MJ: acceptable.** Search extracts of 4 separate FIA Power Unit Information documents show Overtake raising the race recharge limit by 0.5 MJ: Melbourne 8.0→8.5, Miami 8.5→9.0, Zandvoort 8.5→9.0, and Monza 7.0→7.5 (Monza is the research's own extract). RaceFans and Total Motorsport report the same Melbourne and Miami figures from those documents. Corroborated by ≥2 independent extracts that quote primary FIA documents.
- **290 km/h: acceptable.** The PU Technical Regulations Issue 6 extract shows "1800 – 5 * car speed (kph) when the car speed is below 340kph" (with 1850 struck out), and the Issue 7 (11 Jun 2024) extract shows the same 1800 formula cleanly. 1800 − 5v = 350 kW at exactly 290 km/h. An explainer of Issue 18 describes the same shape: 5 kW per km/h, four times as steep from 340, zero at 345. Caveat: the Issue 1, 3 and 5 drafts used 1850, which gives 300 km/h, so the 290 figure holds only from Issue 6 onwards. Corroborated by ≥2 FIA extracts.
- **About 337 km/h: acceptable.** The Issue 6 extract and RaceFans both quote the override as "7100 – 20 × car speed below 355 kph", zero at 355. That gives 350 kW at 337.5 km/h, and "ABOUT 337" is honest rounding. No extract showed the override clause in an issue later than 7, so the formula is corroborated through Issue 7 only, and no change has been reported.
- **1-second detection rule: acceptable as 2026 practice.** Search extracts of the FIA China and Japan PU documents show "Detection Gap 1.0 s". Total Motorsport quotes the FIA Miami document (1 s, detection line 4,908 m, activation line 5,057 m). The Canada report gives 1.0 s. Sportrules (Sporting Regs Issue 08) confirms that the gap is set per event, not fixed in the rules. The video never says "the rules say 1 s", so no change is needed.

### Diagram truth
- S2: the side view faces right. Only the rear flap opens and turns accent, and the front flap stays shut. Correct.
- S3: both elements are steep when closed and flat when open, front and rear, and they open and close together. Correct.
- S4: the noses point right (front wing at the right end, rear wing block at the left), and the chaser moves right toward the detection line. The chaser turns accent only once its front wing reaches the line. The bracket runs from the line to the leader's rear wing. Correct.
- S6: the scale positions are exact (290→x 572.5, 337→x 819.2, 350 kW→y 680). The NORMAL stub's slope, 350→225 kW over 290→315 km/h, matches 1800 − 5v, and it has no zero point, as the research asks. Correct.
- S7: the band's x-range is right, but its height is not (see blocker 1).

### Master (ffprobe/ebur128 on `publish/master.mp4`)
H.264 High at level 4.2, 1080×1920, 30 fps, 1092 frames, 36.40 s, about 9.9 Mb/s. AAC LC 48 kHz stereo. Integrated −14.4 LUFS, true peak −2.4 dBFS, LRA 13.6 LU. All match the stated re-export and the spec.

## Notes (non-blocking; but Hook, Clarity and Readability must reach 8 to pass)
- **Editor's hook-reading concern: not a real problem.** STYLE caps reading at 3.6 w/s and sets no 1 s target. S1 carries 9 words in 2.9 s, which is 3.1 w/s. The 6-word headline gets 1.5 s before the second slam (4 w/s locally), but they are short, common words at 130 px with one accent word. A glance reader gets "EVERY CAR… WINGS" in under 1 s. Don't cut words. The hook's real weakness is the visual (next note).
- [art-director] Hook at 0.25–0.8 s: the wing opening is too small to read as an event, and it plays while the eye is on the slam. Move both `drs.at` values to 0.7 and 0.75, set `dur` to 0.3 and add `sfx: "click"` to the first car_top. The opening then becomes a second beat between the headline (0.0 s) and SO WHO PASSES? (1.5 s). It also needs a clear gap: either drop both car_top `scale` from 0.55 to 0.5, or move SO WHO PASSES? up from y=748 to y=730. The gap from the text to the front wing is about 30 px at 2.2 s (cover) and is nearly touching at 2.6 s.
- [writer] at 20.3 s: "The chaser may harvest 0.5 MJ more per lap." Change "harvest" to "recover", which is plain English for this audience, giving "The chaser may recover 0.5 MJ more energy per lap." That is 10 words, and it keeps "per lap." as the second beat. [art-director] at 19.9–23.2 s: replace the decorative S4 car pair (y 1078–1302) with two 34 px-labelled bars, "MIAMI: 8.5 MJ" (muted) and "OVERTAKE: 9.0 MJ" (accent), so the 0.5 MJ has a scale. Both figures are in F8, from the FIA Miami document. This fixes the Clarity score.
- [art-director] at 23.6 s: the S6 y-axis has no name. Add "ELECTRIC POWER" in 34 px mono muted at x=114, y=574, in S6 only, since the S7 headline needs that space. Also, the Overtake series is drawn over the normal series from 200 to 290, so for 23.6–26.3 s the viewer sees an unlabelled red line, and the grey "normal" line reads as only the dashed stub. Move the OVERTAKE MODE label from `at: 3.1` to `at: 1.6` so the label arrives with its line.
- [writer] at 8.5 s: "EVERY STRAIGHT". F3's own wording is "every designated zone", and Monaco had 0 zones (F5). It is within the research's safe wording, so it is not a blocker. If you want it watertight, "EVERY CAR. EVERY ZONE. *BOTH* WINGS." costs no words.
- [art-director] at 0.0–2.9 s and 34.0–36.4 s: the headline says "WINGS" (plural), but the top view animates only the rear wing (an engine limit). S3 then shows both, so this is acceptable, but don't add front-wing claims to the top-view scenes.
- [editor] Loop seam at 36.4 → 0.0 s: S8 ends with both cars fully drawn, then the hook's frame 0 has no cars (`at: 0.1/0.15`, `in: fade`). On replay that reads as a blink. Set both S1 car_top elements to `at: 0`, `in: "none"`. The closed→open wing animation still plays.
- [art-director] at 13.8–18.9 s: the leader's slipstream cone is widest at the leader's rear and narrows toward the chaser, so it can read as a beam coming *from* the chaser. If the engine allows, reverse the taper. Otherwise leave it.
- [art-director] at 11.7–11.95 s: the flaps snap shut mid-straight with the wheels still spinning and no braking cue. That's fine without the "under braking" wording, but a `wheel_spin` slow-down at 3.2 s would make the shut motivated.
- [editor] `02-script.md` → Edit notes still say "−13.6 LUFS, true peak −0.6 dBFS". Update them to −14.4 LUFS and −2.4 dBTP to match the re-exported master. `stills/` still holds t39.10.png from the 40 s cut; delete it so nobody reviews a stale frame.
- [researcher] The "current Section C text" item under Unverified can be narrowed: 1800 − 5v is confirmed through Issue 7, and the Issue 18 description is consistent with it. The override (7100 − 20v) is confirmed only through Issue 7. Record that in the sheet.
