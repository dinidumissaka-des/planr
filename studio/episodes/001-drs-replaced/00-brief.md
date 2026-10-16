# EP 01 — Every car has the flap now
Owner idea: "DRS is gone in 2026 — what replaced it?"
Season context: 2026 FIA Formula 1 Technical and Sporting Regulations (current season, as applied at 2026-10-16, including any in-season amendments)

The question a fan actually asks: "If every car can open its wings on the straight now, how does the car behind get past?"

## Angles
| # | One-sentence takeaway | Hook | Diagram | Curiosity | Clarity | Visual | Novelty | Accuracy | Total |
|---|---|---|---|---|---|---|---|---|---|
| 1 | In 2026 every car opens its wings on the straights, so the overtaking edge moved from a flap to the battery: within 1 s of the car ahead, you get extra electric energy. | Every car opens its wing now. So who gets past? | `car_top` x2 both showing `drs` (flap open for both = no edge), then a `chip` "WITHIN 1 S" + `counter` for the extra energy, then `chart` of power vs speed: normal deployment tapering off vs Overtake Mode holding power to a higher speed | 5 | 4 | 4 | 4 | 4 | 21 |
| 2 | The 2026 wings move on every straight for every driver, front and rear, and snap back to corner mode for grip. | Both wings move now. On every straight. | `car_side` with `drs` animated open/closed, `highlight: front_wing, rear_wing`, `show: airflow_over`; caption "STRAIGHT MODE" / "CORNER MODE" | 3 | 5 | 3 | 3 | 5 | 19 |
| 3 | In 2026 the car in front can spend its own battery to defend, so overtaking became an energy duel instead of a free pass. | The car in front can fight back now. | `car_top` pair with `slipstream`, `bars` comparing energy left in each car, `arrow` showing the gap closing then holding | 5 | 2 | 3 | 5 | 2 | 17 |

Chosen: **Angle 1.** It answers the owner's question directly and adds a twist (the "DRS" flap went to everyone, so it stopped being an advantage) that the first Google result doesn't frame.

## Chosen angle
Takeaway: In 2026 every car opens its wings on the straights, so the flap stopped being an advantage. The overtaking aid is now Overtake Mode: extra electric energy for the car within 1 s of the one ahead.
Hook: "EVERY CAR OPENS ITS WING NOW." / "SO WHO GETS PAST?" (8 words across two slams)
Why a fan cares: DRS was the overtaking story for 15 seasons. Every 2026 broadcast talks about "Overtake Mode" and "Straight Mode" but rarely says why the old one had to change: once the wing opens for everyone, the edge has to come from somewhere else.
Beat idea:
1. **Hook (0–3 s)** — two `car_top` side by side, both wings opening (`show: drs`). Slam: "EVERY CAR OPENS ITS WING NOW." Second line: "SO WHO GETS PAST?"
2. **Stakes (3–7 s)** — "DRS: 15 seasons. The car behind opened a flap the leader couldn't." `car_side` with rear flap open (`drs` animated), `highlight: drs`, chip "2011–2025".
3. **Mechanism A (7–13 s)** — "2026: Straight Mode. Every car, every straight." `car_side` flap animating open on the straight, closed in corner (`highlight: front_wing, rear_wing`). Line: "No gap rule. No edge."
4. **Mechanism B (13–20 s)** — "The edge moved to the battery." `chip` "WITHIN 1 S" at the detection point, `car_top` follower with `slipstream`, `counter` to the extra energy figure (MJ) once verified.
5. **Mechanism C (20–27 s)** — `chart` power vs speed: normal electric deployment fading out as speed rises; Overtake Mode holding it to a higher speed (km/h, verified). Label `ILLUSTRATIVE` unless the researcher finds the actual taper curve in the regulations.
6. **Payoff (27–32 s)** — counter on the speed where the follower still has full electric power and the leader doesn't. "Same wing. More power. That's the pass."
7. **Loop (32–35 s)** — "So yes, every car opens its wing." Cut back to the hook frame.

Engine note: `car_side`'s `drs` key animates the rear flap only. For the front wing we can only `highlight: front_wing`, not move it. That's fine: the beat is "the wings open for everyone", and a highlighted front wing plus a moving rear flap carries it. Don't script a moving front wing.

## Research questions
1. Under the 2026 rules (as amended in-season), what exactly is Overtake Mode? What extra energy (MJ per lap) or deployment does it give, and how does it change the electric power taper? Previews quote +0.5 MJ and full deployment held to 337 km/h. Confirm against the current FIA Sporting/Technical Regulations.
2. Where is the 1-second gap measured (one detection point per lap, e.g. before the final corner, or per zone), and when can the follower use it: the same lap, the next lap, or anywhere on the lap?
3. Without Overtake Mode, at what speed does electric (MGU-K) deployment start to taper, and from what peak (350 kW?)? This gives the two lines on the chart.
4. Straight Mode: is it available to every car in every designated zone regardless of gap, do both front and rear wing elements move, and who triggers it (driver or automatic)? Has the FIA changed zone counts or activation rules during the 2026 season?
5. Was DRS used from 2011 to 2025 inclusive (15 seasons), and what was its rule (within 1 s at the detection point, rear flap only)?
6. Is there a sourced 2026 example (a named race and lap) where an Overtake Mode pass is documented by the FIA, F1 or a team? Use it for the payoff if it is solid. If not, skip it.

## Avoid
- Calling Straight Mode "the new DRS". Straight Mode is the drag-reduction successor, but it isn't an overtaking aid. The overtaking aid is Overtake Mode. That distinction is the whole video.
- Saying "the 1-second rule is gone". It's gone from the wing and still exists for Overtake Mode.
- The old name "Manual Override Mode (MOM)". Use the current FIA term "Overtake Mode" and mention MOM at most as a label.
- Mixing in "Boost" (the driver-controlled energy deployment any car can use). It is a separate idea and would need "also". It goes under Future episodes.
- 2025 preview numbers that were revised before or during 2026. Every figure must hold for the 2026 rules as of Oct 2026.
- Overclaiming results ("overtaking is up X%") unless an FIA or F1 primary source gives the stat.
- Broadcast footage, onboard clips, team liveries, F1 logos or the "DRS"/"Overtake" graphics from the TV feed. Use engine line-art and our own chips only.
- Fake precision on the power chart. If the taper curve isn't published as a formula, label it `ILLUSTRATIVE` and show only the endpoints we can source.

## Future episodes
- **Boost vs Overtake Mode:** two energy buttons, one for everyone and one for the chaser.
- **The energy duel:** can the leader spend battery to defend against Overtake Mode? (Angle 3, which needs solid sourcing first.)
- **Corner Mode:** why 2026 wings have to snap back before the braking zone, and what happens if they don't.
- **Partial aero in the wet:** front wing in Straight Mode, rear in Corner Mode.
