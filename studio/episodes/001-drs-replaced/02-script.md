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
| 3 | 8.0–13.0 | EVERY CAR. EVERY STRAIGHT. *BOTH* WINGS. | Straight Mode saves energy. It isn't a passing aid. | `chip` "2026". `car_side`, `highlight: front_flap, drs`, `show: airflow_over`. `drs` and `front_flap` both use `keys`: open together on the straight (~0.6 s), snap shut together under braking (~3.8 s). No driver-button graphic and no "automatic" wording. | F3, F4 |
| 4 | 13.0–18.0 | THE *1-SECOND* GAP SURVIVED | Within 1 s at the detection line: Overtake Mode, next lap. | Two `car_top`, chaser behind with `show: slipstream`. A dashed `line` across the track marks the detection line. An `arrow` bracket between the cars shows the gap (no label; the headline names it). As the chaser's nose crosses the line, it gets `highlight: body`. | F7 |
| 5 | 18.0–23.0 | HARVEST *MORE* | The chaser may harvest 0.5 MJ more per lap. | Stat layout. `chip` "OVERTAKE MODE" at y≈420, `counter` to 0.5, `decimals: 1`, `prefix: "+"`, `suffix: " MJ"`, size ~300, then the body line under it. No battery-fill graphic, because the 0.5 MJ raises the harvest limit and is not a top-up. | F8 |
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
