# Script — EP 01: Every car has the flap now
Runtime target: 36 s   Takeaway: In 2026 every car opens its wings on the straights, so the wing stopped being an edge; the 1-second gap now earns Overtake Mode, which lets the chaser harvest more and deploy full electric power longer.

## Hook options
1. EVERY CAR OPENS ITS *WINGS* NOW. / SO WHO PASSES? (6 + 3 words)
2. DRS IS GONE. THE 1-SECOND GAP *ISN'T*.
3. 15 SEASONS OF DRS. NOW *EVERYONE* HAS THE FLAP.
4. THE 2026 PASS IS IN THE *BATTERY*.
5. SAME WINGS. *0.5 MJ*. THAT'S THE PASS.

Picked: **1**. The first line is a flat claim that contradicts what every fan knows about DRS (the flap was the chaser's privilege), so it works muted and alone inside 2 s. The question underneath only lands at ~1.5 s, after the claim has done the work. Two cars opening their wings together is drawable on frame 1, so the visual says it before the viewer finishes reading. It also gives the cleanest loop: the last line ends on "BECAUSE…", and the hook finishes the sentence. Option 2 is a strong runner-up, but it needs the viewer to know what "the 1-second gap" means. Option 4 is vague. Option 5 leans toward the "extra energy" framing the research says to avoid.

## Beats
| # | Time | On-screen headline | Body line | Visual | Facts |
|---|---|---|---|---|---|
| 1 | 0.0–3.0 | EVERY CAR OPENS ITS *WINGS* NOW | SO WHO PASSES? (second slam, display size, at ~1.5 s) | Hook slam (`in: slam`, `shake: 10`, text by frame 5). Below it, two `car_top` side by side on the same straight, chaser slightly back, both with `show: drs` and `drs` animating 0→1 together at ~0.4 s. No chip, so the claim stands alone. | F3 |
| 2 | 3.0–8.0 | DRS: *15* SEASONS | Within 1 s, the chaser opened a flap the leader couldn't. | `chip` "2011–2025" at y≈420. `car_side`, `highlight: drs`, `drs` animating 0→1 (rear flap only). Front flaps stay shut (`front_flap: 0`). | F1, F2 |
| 3 | 8.0–13.0 | EVERY CAR. EVERY ZONE. *BOTH* WINGS. | Straight Mode saves energy. It isn't a passing aid. | `chip` "2026". `car_side`, `highlight: front_flap, drs`, `show: airflow_over`. `drs` and `front_flap` both use `keys`: open together on the straight (~0.6 s), snap shut together under braking (~3.8 s). No driver-button graphic and no "automatic" wording. | F3, F4 |
| 4 | 13.0–18.0 | THE *1-SECOND* GAP SURVIVED | Within 1 s at the detection line: Overtake Mode, next lap. | Two `car_top`, chaser behind with `show: slipstream`. A dashed `line` across the track marks the detection line. An `arrow` bracket between the cars shows the gap (no label; the headline names it). As the chaser's nose crosses the line, it gets `highlight: body`. | F7 |
| 5 | 18.0–23.0 | HARVEST *MORE* | The chaser may recover 0.5 MJ more energy per lap. | Stat layout. `chip` "OVERTAKE MODE" at y≈420, `counter` to 0.5, `decimals: 1`, `prefix: "+"`, `suffix: " MJ"`, size ~300, then the body line under it. No battery-fill graphic, because the 0.5 MJ raises the harvest limit and is not a top-up. | F8 |
| 6 | 23.0–29.4 | THEN DEPLOY FULL POWER *LONGER* | — | `chart` with `note: "ILLUSTRATIVE"`. x = speed (`xlabel: "SPEED"`, xrange 200–360 km/h), y = MGU-K power (yrange 0–400). **Overtake Mode** series: `[[200,350],[337,350],[355,0]]`, accent colour. **Normal** series: `[[200,350],[290,350]]` in faint ink, then a short dashed falling stub with an arrowhead that ends well above zero, with no end value and no zero point. Labels: "NORMAL", "OVERTAKE MODE", a callout "290 KM/H" at the first knee, a callout "ABOUT 337 KM/H" at the second, and "UP TO 350 KW" on the flat top. | F9, F10, F11 |
| 7 | 29.4–33.8 | ONLY THE CHASER KEEPS FULL ELECTRIC POWER | Between 290 and about 337 km/h. | The same chart holds (`transition: cut`, `camera: none`). A `shape` rect band, accent fill at low opacity, grows right from x=290 to x=337 between the two lines. The normal stub dims, and `ILLUSTRATIVE` stays. The headline carries no accent, because the band is this frame's one accent. | F9, F10 |
| 8 | 33.8–36.0 | THE WING ISN'T THE EDGE. *BECAUSE…* | — | The hook framing returns: two `car_top`, both `drs` held open. The cut to the hook is hard, so the hook slam completes the sentence. | F3, F4 |

Word check (headline + body + chip/labels ÷ duration): 1: 9/3.0 = 3.0 · 2: 15/5.0 = 3.0 · 3: 15/5.0 = 3.0 · 4: 15/5.0 = 3.0 · 5: 15/5.0 = 3.0 · 6: 19/6.4 = 3.0 · 7: 13/4.4 = 3.0 · 8: 6/2.2 = 2.7. All headlines are ≤ 10 words and all bodies ≤ 16. The hook scene is ≤ 3.2 s, and every scene runs 2.2–6.4 s.

Notes for storyboard:
- Beat 3 is the episode's one use of the new `front_flap` key. Keep `front_flap` at 0 in beat 2, so the "rear only, then both" contrast reads.
- Beat 6: plot only the five sourced points listed. The normal stub is a direction ("fading"), not data. Its slope and end point carry no values, and they sit under the ILLUSTRATIVE note.
- No km/h counter in the payoff, since a speed gap in km/h has no source. The band shows the range, and the body line names both ends.
- The Verstappen Monza "like a turtle" quote (F14) is **cut**. It names no lap, it would cost ~6 words and 2 s (pushing the runtime past 36 s), and beats 6–7 already land the mechanism with sourced numbers. Keep it for "The energy duel" episode.
- QA before lock: the research flags F3/F7/F8 as resting on search extracts of FIA PDFs, and F9/F10 as resting on PU regs Issue 6. Check C5.18 in Section C Issue 15 or later, and the Miami and Monza PU information documents.

## Loop
Beat 8 ends on an unfinished sentence: "THE WING ISN'T THE EDGE. BECAUSE…", over the same two-car top view the hook uses, with both flaps open. The hard cut lands on the hook slam, "EVERY CAR OPENS ITS WINGS NOW", which completes the sentence ("…because every car opens its wings now"). On a rewatch, "SO WHO PASSES?" is no longer a question. The viewer already knows the answer: the car within 1 s, through the battery, not the wing.

## Optional voiceover (for the owner to record, ~2.3 words/s)
Every car opens its wings now. So who passes?
For 15 seasons, the car within a second opened a flap the leader couldn't.
Now every car opens both wings, every straight. That's no passing aid.
The one-second gap survived. Within it at the detection line, you get Overtake Mode next lap.
The chaser may harvest half a megajoule more per lap, and deploy full power longer.
Between 290 and about 337 kilometres an hour, only the chaser keeps full electric power.
So the wing isn't the edge. Because…

## Art direction notes
Storyboard: `storyboard.json`, 8 scenes, 40.0 s, lint 0 errors / 0 warnings. Durations follow the rule of words ÷ 3 + 0.6 s, so the cut runs 40.0 s, not 36 s. That is the top of the 25–40 s band.

| # | Time | Dur | Transition | Facts |
|---|---|---|---|---|
| 1 Hook | 0.0–3.2 | 3.2 | none | F3 |
| 2 DRS era | 3.2–9.5 | 6.3 | whip | F1, F2 |
| 3 Straight Mode | 9.5–15.4 | 5.9 | push | F3, F4 |
| 4 1-second gap | 15.4–21.0 | 5.6 | cut | F7 |
| 5 +0.5 MJ | 21.0–25.9 | 4.9 | whip | F8 |
| 6 Deploy longer | 25.9–32.5 | 6.6 | cut | F9, F10, F11 |
| 7 Payoff band | 32.5–37.4 | 4.9 | cut (camera none) | F9, F10 |
| 8 Loop | 37.4–40.0 | 2.6 | push | F3, F4 |

Changes from the script, and why:
- **Hook is 3.2 s, not 3.6 s.** The timing rule gives 3.6 s, but the hook is capped at 3.2 s. "SO WHO PASSES?" slams at 1.5 s, which still leaves 1.7 s to read it. Cover frame: 2.2 s.
- **Beat 2 gets a "REAR FLAP" callout** (2 words, +0.7 s). On its own the flap was a 60 px sliver, so the frame had no clear focal point. Naming the part also sets up "BOTH WINGS" in beat 3. I dropped the accent on "15" so that the flap is the one accent. The body line comes in two pieces ("...opened a flap" / "the leader couldn't.") set on one line, so something new lands every 2–3 s.
- **Beat 3:** the body is split into its two sentences, for the same reason. Both flaps open at about 1.2 s and shut together at about 3.9 s. In the stills, closed is steep and open is flat for both the front and rear elements.
- **Beat 4:** the track is drawn horizontally (`rot: 90`, noses pointing right) so the two cars, the detection line and the gap bracket all fit at a readable size. **The slipstream is drawn on the leader, not the chaser.** The engine draws a wake behind the car that carries it, and the chaser sits inside the leader's wake. The gap is an unlabelled dimension bracket made from a `line`, under the track. The chaser turns accent (with a beep) once its nose reaches the detection line. "1-SECOND" lost its accent so the highlighted chaser is the one focal point.
- **Beat 5: I cut the headline "HARVEST MORE".** It repeated the body line, and dropping it pays for the beat-2 callout and keeps the total at 40 s. The counter is now 220 px, because at 300 px "+0.5 MJ" ran off the right edge. The S4 track pair sits under the stat so the lower half isn't empty. Both cars are plain there, so the counter is the one accent. "per lap." comes in as a second beat at the end of the body line.
- **Beat 6:** the series are plotted with `curve: false`, using only the sourced points. The normal stub is a dashed `line` with an arrowhead and no end value. Labels are 34 px mono text elements: UP TO 350 KW, OVERTAKE MODE (accent), NORMAL, SPEED. The two km/h values are drop lines (a `callout` with no text) with right-aligned labels to their left, because a callout label always sits to the right of its anchor and would run past x 950 at 337 km/h.
- **Beat 7 holds the chart with no redraw.** The chart, the stub and the labels are re-declared with `at: -2`, so they are fully drawn on the first frame of the scene. The 32.6 s still confirms there is no blink. Scenes 6 and 7 both use `camera: none`, so there is no zoom jump at the cut. The headline slams (payoff) with no shake, so the chart doesn't wobble. Words on screen came to 26 (the lint warned that it's too much to read), so UP TO 350 KW, NORMAL and SPEED drop out at this cut.
- **Beat 8 is 2.6 s, not 2.2 s** (timing rule). The rear wings are plain there, as opposed to accent in the hook, because "the wing isn't the edge". BECAUSE… lands at 1.1 s.

Engine limitations (I designed around them and did not edit the engine):
- **No opacity on `shape` or `line`.** `alpha` is not a documented key. The payoff band is a faint fill with a dashed accent outline instead of a low-opacity accent fill. The normal stub can't dim either, because "faint" vanished on the band, so it stays muted. The S7 cut removes the NORMAL label instead.
- **The chart's `note` (ILLUSTRATIVE) is drawn at 24 px,** under the 34 px minimum, and there is no key to change that. The chart's own `xlabel` and series labels are also 24 px, so I left them out and used 34 px text elements.
- **`car_top` has no front-wing movement and only draws the rear slot.** That is fine for the top view.
- **Highlight on a car can't be animated.** For the chaser turning accent in beat 4, I lay a second highlighted `car_top` over the first one, fading in at the same position.

## Edit notes
Final runtime: **36.4 s** (was 40.0 s), 8 scenes, 1092 frames. Lint: 0 errors, 0 warnings. Master: H.264 High 1080×1920, 30 fps, AAC 48 kHz. Integrated loudness −13.6 LUFS, true peak −0.6 dBFS. Cover at 2.2 s.

Retimed (only `dur` changed; no `at` values moved). Each scene keeps every text block at or under 3.6 words/s, with at least 1.3 s on its last line:

| # | Scene | Dur | Time | Last text in → hold |
|---|---|---|---|---|
| 1 | Hook | 3.2 → 2.9 | 0.0–2.9 | SO WHO PASSES? 1.5 → 1.4 s |
| 2 | DRS era | 6.3 → 5.6 | 2.9–8.5 | "the leader couldn't." 4.3 → 1.3 s |
| 3 | Straight Mode | 5.9 → 5.3 | 8.5–13.8 | "It isn't a passing aid." 3.6 → 1.7 s (flaps shut at 3.45 s, still on screen) |
| 4 | 1-second gap | 5.6 → 5.1 | 13.8–18.9 | body 11 words over 3.5 s = 3.1 w/s; beep at 3.0 → 2.1 s |
| 5 | +0.5 MJ | 4.9 → 4.3 | 18.9–23.2 | "per lap." 3.0 → 1.3 s |
| 6 | Deploy longer | 6.6 → 6.0 | 23.2–29.2 | ABOUT 337 KM/H 4.05 → 1.95 s |
| 7 | Payoff band | 4.9 → 4.8 | 29.2–34.0 | body 2.0 → 2.8 s payoff hold. 20 words on screen, so 4.8 s is the floor before the "a lot to read" warning |
| 8 | Loop | 2.6 → 2.4 | 34.0–36.4 | BECAUSE… 1.1 → 1.3 s, then hard cut to the hook |

- The S6→S7 hold still works. Stills at 29.10, 29.20 and 29.25 s show the chart, stub and km/h labels fully drawn on the first frame of S7 with no blink. Only UP TO 350 KW, NORMAL and SPEED drop, as designed. The negative-`at` elements carry no SFX, so nothing leaks into S6.
- No dead stretches over 3 s; the longest static gap is 2.8 s (the payoff hold).
- The hook headline is 6 words and needs about 1.7 s to read at 3.6 w/s. It runs over the 1 s read target, but the cars opening at 0.3 s say it visually first. Shortening it is a content call for the writer, so it is not changed here.

SFX map (master timeline):

| t (s) | Sound | Visual event |
|---|---|---|
| 0.0 | hit | Hook slam (shake 10) |
| 1.5 | thump (was hit) | SO WHO PASSES? slam; changed so there is only one hit per 4 s |
| 2.9 | whoosh + pop | Whip into S2, 2011–2025 chip |
| 8.5 | whoosh + pop | Push into S3, 2026 chip |
| 16.8 | beep | Chaser crosses detection line, turns accent |
| 18.9 | whoosh | Whip into S5 (OVERTAKE MODE chip muted, `sfx: none`) |
| 19.2–20.0 | pop + 15 ticks | +0.5 MJ counter |
| 29.2 | hit | Payoff headline slam |
| 34.0 | whoosh | Push into loop scene |

Hits fall at 0.0 and 29.2 s (7.2 s apart across the loop). Scene 6 has no sound, so the chart draw has room under a music track.

## Revision 1 (art direction, after QA REVISE)
Runtime 36.4 → **37.3 s** (S5 4.3 → 5.2 s for the new bars). Lint: 0 errors, 0 warnings. Master and cover re-rendered; cover still at 2.2 s.
- **Safe zone (camera push now 1.025×, lint checks zoomed text).** S2–S5 → `camera: none`. S1 and S8 keep the same framing: both text blocks moved to x=104, the 130 px headline to y=356 (at y=330 the zoomed box broke the top margin), the 90 px second line to y=765. S8 now uses `camera: pull` instead of `push`: it ends at 1.0×, which is exactly S1's first frame, so the loop seam has no 2.5 % scale jump. The cars, wings and text column are identical across the cut.
- **S1 hook, wing beat.** The cars are on screen at 0.0 s with `in: none`, plain, wings closed. At 0.7 s both rear wings open (0.3 s) and turn accent, with a `pop`. That gives a second visible beat between the slam (0.0 s) and SO WHO PASSES? (1.5 s). The engine can't animate a highlight, so the accent is a highlighted car_top overlay entering at 0.7 s. Car scale 0.55 → 0.5. Gap from SO WHO PASSES? to the front wing is now about 75 px.
- **S8 loop.** The wings start open and close at 1.7–2.0 s, so the last frame (plain cars, closed wings) matches S1 frame 0. The hook then reopens them. The cars no longer blink.
- **S5.** Body text now matches the writer's line: "The chaser may recover 0.5 MJ more energy" + "per lap." as a second beat on the same line. The decorative car pair is replaced by `bars` from F8 (FIA Miami document): "MIAMI: NORMAL LIMIT" 8.5 MJ and "IN OVERTAKE MODE" 9.0 MJ, values printed on the bars. The scale starts at zero with `max: 9.0`, so the bars are true to length: the difference is about 48 px of 860, a small edge, which is the honest reading. The counter keeps the accent; the Overtake bar is ink and the normal bar muted, so there's still one accent in the frame. "Miami" is in the label because 8.5/9.0 are that event's numbers (Melbourne was 8.0/8.5).
- **S6.** Added the "ELECTRIC POWER" y-axis label (34 px mono, muted, x=114, y=574). The Overtake series now starts at 2.0 s (stagger 1.4 → 1.6) and the OVERTAKE MODE label comes in with it at 2.0 s. The normal stub and NORMAL label moved earlier (1.3/1.5 s) so the grey line is named before the red line covers it. The 290 drop line and label moved to 2.6/2.9 s.
- **ILLUSTRATIVE.** Kept as the chart `note`, now 34 px through the engine's `note_size` default. The lint rule requires a `note` or `source` on a chart, so the separate text element QA suggested isn't needed. It sits at y≈1310 in S6 and S7, clear of SPEED and of the S7 body line.
- **S7 band.** `h` 560 → 330. The band ends at y=1010, level with the bottom of the 290 drop line, and no longer cuts "ABOUT". Fill is now `accent` at `alpha: 0.18` with the dashed accent outline, which reads as the region instead of an outline box.
- Not changed: the S4 slipstream taper (the engine has no key to reverse it), and the S3 wheel slow-down (`wheel_spin` isn't animatable in ENGINE.md). Old stills, including the stale t39.10.png, were deleted and replaced with the current set.

## Revision 2 (producer)
- QA round 2 blocker: S1 and S8 `car_top` moved up 30 px (y 1170→1140, 1245→1215) so the accent wing clears the y 1480 UI line. Lint now checks car, bar and text extents after camera zoom.
- S5: bars `at` 2.6, `stagger` 0.25, scene 5.2→5.6 s; label "MIAMI RACE: NORMAL LIMIT".
- Final master: 37.7 s, 1131 frames, −14.4 LUFS, −1.9 dBTP. (Supersedes the runtime and loudness in the Edit notes above.)
