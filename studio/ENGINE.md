# Engine Reference — storyboard.json

The engine turns `storyboard.json` into the master MP4. Coordinates are pixels on a 1080×1920 canvas. Keep everything inside the safe zone: x 90–950, y 260–1480. Times are seconds, relative to the start of the scene.

## Commands

```bash
python3 studio/engine/lint.py   studio/episodes/<ep>/storyboard.json           # must pass with 0 errors
python3 studio/engine/render.py studio/episodes/<ep>/storyboard.json --stills 0.5,3.2,8   # PNGs in <ep>/stills/
python3 studio/engine/render.py studio/episodes/<ep>/storyboard.json --sheet <ep>/review/sheet.png --every 0.5
python3 studio/engine/render.py studio/episodes/<ep>/storyboard.json --out <ep>/publish/master.mp4 --cover <ep>/publish/cover.jpg
```

Add `--draft` for a fast, lower-quality encode while iterating. Run `studio/setup.sh` once per fresh machine.

## File shape

```json
{
  "meta": {
    "title": "Why F1 cars could drive upside down",
    "series": "EP 01",
    "cover_time": 0.9,
    "loop": "last line 'so yes - upside down' cuts back to the hook",
    "music": null,
    "progress": true,
    "grid": true
  },
  "scenes": [
    { "dur": 2.4, "transition": "none", "camera": "push", "sfx": null, "elements": [ ... ] }
  ]
}
```

**Scene keys**
- `dur` — 0.8–7 s.
- `transition` — how this scene enters: `cut` (default), `whip` (vertical motion blur and whoosh), `push` (horizontal), `zoom` (scale and crossfade), `flash`.
- `camera` — `push` (slow zoom in to 1.025×, default), `pull`, `drift`, `none`. Zoom scales around the frame centre, so pushed text drifts outward; lint checks the zoomed position. Left-aligned text at x=90 fails under `push`: use x ≥ 102, or `camera: none` on dense frames.
- `sfx` — a sound at scene start: `hit`, `thump`, `whoosh`, `swipe`, `pop`, `tick`, `beep`, `riser`.

**Keys every element accepts**
- `at` — when it appears. `until` — when it leaves, with a quick fade. Leave it out to stay until the cut.
- `sfx` — sound on entry, or `"none"` to mute a default. `sfx_db` — gain offset.
- `shake` — camera shake amplitude in px on entry (8–14 for a slam).

## Elements

### text
`text`, `x`, `y` (top of block), `size` (px), `align` (`left` | `center` | `right`; with center, x is the centre), `width` (wrap width), `font` (`display` | `text` | `mono`), `weight` (`black` … `regular`), `color`, `accent`, `leading`, `upper` (display is uppercase by default), `in` (`slam` | `rise` | `words` | `type` | `fade` | `wipe` | `none`), `in_dur`, `stagger`.
Markup: `*word*` accent colour, `[word]` accent box. `\n` forces a line break.
Sizes: hook 130–170, headline 90–120, sub-headline 60–80, body 44–56 (`font: text`, `weight: semibold`), labels 28–34 (`font: mono`).

### counter
A number that counts up. `to`, `from` (0), `decimals`, `prefix`, `suffix`, `count` (seconds, 0.9), `size` (300), `x`, `y`, `align`, `color`. Ticks and a pop play automatically.

### chip
A pill label. `text`, `x`, `y`, `align`, `bg`, `fg`, `outline` (bool), `size` (30).

### bars
Horizontal comparison. `items: [{label, value, display, color}]`, `x`, `y`, `width`, `bar_h` (64), `gap`, `max`, `stagger`, `grow`. The first bar is accent by default and the rest are faint.

### car_side
F1 car in side profile, nose to the right. `x`, `y` (centre), `scale` (0.8 fills the safe width), `flip`, `in` (`drive` | `fade` | `none`), `highlight` (any of `front_wing`, `front_flap`, `rear_wing`, `drs`, `floor`, `diffuser`, `sidepod`, `body`, `beam_wing`, `halo`, `driver`, `tyres`), `show` (any of `airflow`, `airflow_over`, `airflow_under`, `downforce`, `dirty_air`), `downforce: {front, floor, rear}` arrow lengths, `downforce_at`, `drs` (rear flap, 0 closed – 1 open), `front_flap` (front wing upper flaps, 0–1; 2026 cars move both). Both accept a number, `{from, to, at, dur}`, or `{keys: [[t, v], ...]}` for open/close cycles, `wheel_spin` (rad/s, 20 looks fast), `rake` (deg), `ground`.

### car_top
F1 car from above, nose up. `x`, `y`, `scale` (0.9), `rot` (deg), `in` (`fade` | `drive`), `move: {x, y, at, dur, ease}`, `highlight` (`front_wing`, `rear_wing`, `floor`, `body`, `cockpit`, `halo`, `driver`, `tyres`), `show` (`slipstream`, `drs`), `drs` (slot opening 0–1, animatable like car_side), `compound` (stripe on the tyres), `label`, `wake_length`.

### tyre
Side-on tyre. `x`, `y`, `r` (180), `compound`, `spin` (rad/s), `wear` (0–1 graining marks), `brand_text`.

### corner
A 90° corner from above with the racing line. `x`, `y`, `size` (860 px box), `mirror` (left-hander), `show` (any of `line`, `apex`, `braking`, `dot`, `kerb`), `line_at`, `line_dur`, `apex_at`, `braking_at`, `line_color`.

### stints
Race strategy stints. `laps`, `rows: [{label, stints: [{compound, from, to}]}]`, `markers: [{lap, label, color}]`, `x`, `y`, `width`, `draw` (seconds to reveal), `tick`.

### chart
Line chart. `x`, `y`, `w`, `h`, `xrange`, `yrange`, `series: [{points, color, label, curve}]`, `xlabel`, `ylabel`, `label_size` (28), `note_size` (34), `draw`, `stagger`. **Requires** `note` (e.g. `"illustrative"`) or `source`.

### arrow
`from: [x,y]`, `to: [x,y]`, `bend` (px), `width`, `color`, `head`, `draw`, `dash`, `flow`, `label`, `label_x`, `label_y`.

### line
`points`, `curve`, `width`, `color`, `alpha`, `draw`, `dash`, `flow` (dash speed), `arrow`.

### callout
A pulsing point with a leader line and a label. `point: [x,y]`, `label_at: [x,y]`, `text`, `elbow` (`h` | `v`), `color`, `size`.

### shape
`shape` (`rect` | `circle` | `ring` | `arc`), `x`, `y`, `w`, `h` / `r`, `fill`, `stroke`, `stroke_width`, `radius`, `grow` (`right` | `up`), `value` (arc 0–1), `dash`, `alpha` (fill opacity 0–1).

### image
Only for images the owner has rights to. `src` (path relative to the storyboard), `x`, `y`, `w`, `h`, `radius`, `zoom`.

## Layout recipes

- **Hook:** chip at y≈420, hook text at y≈520, size 140–160, `in: slam`, `shake: 10`. Fill the space; don't leave the bottom half empty when a diagram can sit there.
- **Diagram + caption:** the diagram in y 520–1150, one text line at y≈1220–1300, size 70–84, `in: words`.
- **Stat:** chip or label at y≈420, counter at y≈480–560 centred, size 280–340, body line under it, optional bars below.
- **Callout labels:** keep the whole label left of x=950. Put labels on the side with more room.
