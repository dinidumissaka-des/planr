import math
import os
import re

import numpy as np
import skia

from anim import EASINGS, clamp, in_out_cubic as in_out, lerp, out_back, out_cubic, out_expo, out_quart, progress

WEIGHTS = {
    "black": "Black", "extrabold": "ExtraBold", "bold": "Bold", "semibold": "SemiBold",
    "medium": "Medium", "regular": "Regular", "light": "Light",
}


class Brand:
    def __init__(self, data):
        self.data = data
        self.colors = data["colors"]
        self.fonts = data["fonts"]
        self.safe = data["safe_zone"]
        self._tf = {}

    def color(self, value, alpha=1.0):
        if value is None:
            value = "ink"
        if isinstance(value, str) and value in self.colors:
            value = self.colors[value]
        h = value.lstrip("#")
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return skia.Color(r, g, b, int(255 * clamp(a * alpha)))

    def typeface(self, family="display", weight="black"):
        key = (family, weight)
        if key not in self._tf:
            if family == "mono":
                path = self.fonts["mono"].format(mono_weight="-Bold" if weight in ("bold", "black", "extrabold") else "")
            else:
                path = self.fonts[family].format(weight=WEIGHTS.get(weight, "Bold"))
            if not os.path.exists(path):
                raise FileNotFoundError(path)
            self._tf[key] = skia.Typeface.MakeFromFile(path)
        return self._tf[key]

    def font(self, family, weight, size):
        f = skia.Font(self.typeface(family, weight), size)
        f.setSubpixel(True)
        f.setEdging(skia.Font.Edging.kSubpixelAntiAlias)
        return f


def paint(color, stroke=None, cap="round", join="round"):
    p = skia.Paint(AntiAlias=True, Color=color)
    if stroke is not None:
        p.setStyle(skia.Paint.kStroke_Style)
        p.setStrokeWidth(stroke)
        p.setStrokeCap({"round": skia.Paint.kRound_Cap, "butt": skia.Paint.kButt_Cap, "square": skia.Paint.kSquare_Cap}[cap])
        p.setStrokeJoin({"round": skia.Paint.kRound_Join, "miter": skia.Paint.kMiter_Join}[join])
    return p


def poly_path(points, close=False):
    path = skia.Path()
    for i, (x, y) in enumerate(points):
        if i == 0:
            path.moveTo(x, y)
        else:
            path.lineTo(x, y)
    if close:
        path.close()
    return path


def smooth_path(points, close=False, tension=0.5):
    if len(points) < 3:
        return poly_path(points, close)
    pts = list(points)
    if close:
        pts = [pts[-1]] + pts + [pts[0], pts[1]]
    else:
        pts = [pts[0]] + pts + [pts[-1]]
    path = skia.Path()
    path.moveTo(*pts[1])
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) * tension / 3, p1[1] + (p2[1] - p0[1]) * tension / 3)
        c2 = (p2[0] - (p3[0] - p1[0]) * tension / 3, p2[1] - (p3[1] - p1[1]) * tension / 3)
        path.cubicTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
    if close:
        path.close()
    return path


def partial(path, start_frac, end_frac):
    pm = skia.PathMeasure(path, False)
    total = 0.0
    lengths = []
    while True:
        lengths.append(pm.getLength())
        total += lengths[-1]
        if not pm.nextContour():
            break
    out = skia.Path()
    if total <= 0:
        return out, 0.0
    a, b = start_frac * total, end_frac * total
    pm = skia.PathMeasure(path, False)
    acc = 0.0
    for seg_len in lengths:
        lo, hi = max(a - acc, 0), min(b - acc, seg_len)
        if hi > lo:
            pm.getSegment(lo, hi, out, True)
        acc += seg_len
        pm.nextContour()
    return out, total


def pos_tan(path, frac):
    pm = skia.PathMeasure(path, False)
    length = pm.getLength()
    pos, tan = pm.getPosTan(clamp(frac) * length)
    return (pos.x(), pos.y()), (tan.x(), tan.y())


def arrow_head(canvas, tip, direction, size, color):
    dx, dy = direction
    n = math.hypot(dx, dy) or 1
    dx, dy = dx / n, dy / n
    px, py = -dy, dx
    base = (tip[0] - dx * size, tip[1] - dy * size)
    pts = [tip, (base[0] + px * size * 0.55, base[1] + py * size * 0.55), (base[0] - px * size * 0.55, base[1] - py * size * 0.55)]
    canvas.drawPath(poly_path(pts, True), paint(color))


RUN_RE = re.compile(r"(\*[^*]+\*|\[[^\]]+\])")


def parse_runs(text):
    words = []
    for line_i, line in enumerate(text.split("\n")):
        if line_i > 0:
            words.append(("\n", "break"))
        for chunk in RUN_RE.split(line):
            if not chunk:
                continue
            style = "plain"
            if chunk.startswith("*") and chunk.endswith("*"):
                style, chunk = "accent", chunk[1:-1]
            elif chunk.startswith("[") and chunk.endswith("]"):
                style, chunk = "box", chunk[1:-1]
            for w in chunk.split():
                words.append((w, style))
    return words


def text_style(brand, el):
    family = el.get("font", "display")
    weight = el.get("weight", "black" if family == "display" else "medium")
    size = el.get("size", 96)
    font = brand.font(family, weight, size)
    return font, size


def layout_text(brand, el):
    font, size = text_style(brand, el)
    text = el.get("text", "")
    if el.get("upper", el.get("font", "display") == "display"):
        text = re.sub(r"(?<!\\)[a-z]", lambda m: m.group(0).upper(), text)
    tracking = el.get("tracking", -0.02 * size if el.get("font", "display") == "display" else 0)
    width = el.get("width", brand.safe["right"] - brand.safe["left"])
    space = font.measureText(" ") + tracking
    lines, cur, cur_w = [], [], 0.0

    def word_w(w):
        return font.measureText(w) + tracking * max(len(w) - 1, 0)

    for w, style in parse_runs(text):
        if style == "break":
            lines.append(cur)
            cur, cur_w = [], 0.0
            continue
        ww = word_w(w)
        add = ww if not cur else space + ww
        if cur and cur_w + add > width:
            lines.append(cur)
            cur, cur_w = [], 0.0
            add = ww
        cur.append([w, style, ww])
        cur_w += add
    if cur:
        lines.append(cur)
    m = font.getMetrics()
    line_h = size * el.get("leading", 0.98 if el.get("font", "display") == "display" else 1.25)
    widths = [sum(w[2] for w in ln) + space * max(len(ln) - 1, 0) for ln in lines]
    block_w = max(widths) if widths else 0
    block_h = line_h * (len(lines) - 1) + (-m.fAscent) + m.fDescent * 0.3
    return {
        "font": font, "size": size, "lines": lines, "widths": widths, "space": space,
        "line_h": line_h, "ascent": -m.fAscent, "cap": m.fCapHeight, "tracking": tracking,
        "block_w": block_w, "block_h": block_h,
    }


def text_bbox(brand, el):
    lay = layout_text(brand, el)
    x, y = el.get("x", brand.safe["left"]), el.get("y", 800)
    align = el.get("align", "left")
    if align == "center":
        x0 = x - lay["block_w"] / 2
    elif align == "right":
        x0 = x - lay["block_w"]
    else:
        x0 = x
    return x0, y, x0 + lay["block_w"], y + lay["block_h"]


def draw_tracked(canvas, word, x, y, font, tracking, p):
    if abs(tracking) < 0.01:
        canvas.drawString(word, x, y, font, p)
        return
    for ch in word:
        canvas.drawString(ch, x, y, font, p)
        x += font.measureText(ch) + tracking


class Scene:
    def __init__(self, brand, data, index, start):
        self.brand = brand
        self.data = data
        self.index = index
        self.start = start
        self.dur = data["dur"]
        self.elements = data.get("elements", [])


CAMERA_MAX_ZOOM = {"push": 1.025, "pull": 1.03, "drift": 1.02, "none": 1.0}


def window(el, scene_dur):
    t0 = el.get("at", 0.0)
    t1 = el.get("until", scene_dur + 10)
    return t0, t1


def exit_factor(el, t, scene_dur):
    _, t1 = window(el, scene_dur)
    if t1 > scene_dur:
        return 1.0
    return 1.0 - out_cubic(progress(t, t1 - 0.18, 0.18))


class Renderer:
    def __init__(self, brand, story, base_dir):
        self.brand = brand
        self.story = story
        self.base_dir = base_dir
        meta = story.get("meta", {})
        video = brand.data["video"]
        self.W, self.H = video["width"], video["height"]
        self.fps = meta.get("fps", video["fps"])
        self.scenes = []
        t = 0.0
        for i, sd in enumerate(story["scenes"]):
            self.scenes.append(Scene(brand, sd, i, t))
            t += sd["dur"]
        self.total = t
        self.main = skia.Surface(self.W, self.H)
        self.layer = skia.Surface(self.W, self.H)
        self.layer2 = skia.Surface(self.W, self.H)
        self._bg = self._make_background()
        self._grain = [self._make_grain(s) for s in range(6)]
        self._images = {}

    def _make_background(self):
        s = skia.Surface(self.W, self.H)
        c = s.getCanvas()
        c.clear(self.brand.color("bg"))
        shader = skia.GradientShader.MakeRadial(
            skia.Point(self.W * 0.5, self.H * 0.18), self.H * 0.75,
            [self.brand.color("bg_top"), self.brand.color("bg")],
        )
        p = skia.Paint(Shader=shader)
        c.drawRect(skia.Rect(0, 0, self.W, self.H), p)
        vig = skia.GradientShader.MakeRadial(
            skia.Point(self.W * 0.5, self.H * 0.48), self.H * 0.72,
            [skia.Color(0, 0, 0, 0), skia.Color(0, 0, 0, 0), skia.Color(0, 0, 0, 150)], [0, 0.55, 1.0],
        )
        c.drawRect(skia.Rect(0, 0, self.W, self.H), skia.Paint(Shader=vig))
        return s.makeImageSnapshot()

    def _make_grain(self, seed):
        rng = np.random.default_rng(seed)
        n = rng.integers(0, 255, (self.H // 2, self.W // 2), dtype=np.uint8)
        arr = np.stack([n, n, n, np.full_like(n, 9)], axis=-1)
        img = skia.Image.fromarray(arr, colorType=skia.ColorType.kRGBA_8888_ColorType)
        return img

    def scene_at(self, T):
        for s in self.scenes:
            if T < s.start + s.dur:
                return s
        return self.scenes[-1]

    def image(self, src):
        if src not in self._images:
            path = src if os.path.isabs(src) else os.path.join(self.base_dir, src)
            self._images[src] = skia.Image.MakeFromEncoded(skia.Data.MakeFromFileName(path))
        return self._images[src]

    def camera_matrix(self, scene, t):
        cam = scene.data.get("camera", "push")
        p = clamp(t / scene.dur)
        z, dx, dy = 1.0, 0.0, 0.0
        if cam == "push":
            z = lerp(1.0, CAMERA_MAX_ZOOM["push"], p)
        elif cam == "pull":
            z = lerp(CAMERA_MAX_ZOOM["pull"], 1.0, out_cubic(p))
        elif cam == "drift":
            z = 1.02
            dx = lerp(-10, 10, p)
        for el in scene.elements:
            amp = el.get("shake")
            if not amp:
                continue
            dt = t - el.get("at", 0.0) - 0.08
            if dt >= 0:
                k = amp * math.exp(-dt * 14)
                dx += k * math.sin(dt * 95)
                dy += k * math.cos(dt * 71)
        m = skia.Matrix()
        m.setTranslate(-self.W / 2, -self.H / 2)
        m.postScale(z, z)
        m.postTranslate(self.W / 2 + dx, self.H / 2 + dy)
        return m

    def draw_scene(self, surface, scene, t):
        c = surface.getCanvas()
        c.clear(skia.Color(0, 0, 0, 0))
        c.save()
        c.concat(self.camera_matrix(scene, t))
        for el in scene.elements:
            t0, t1 = window(el, scene.dur)
            if t < t0 or t >= t1:
                continue
            fn = ELEMENTS.get(el["type"])
            if fn is None:
                raise ValueError(f"unknown element type {el['type']!r} in scene {scene.index}")
            ex = exit_factor(el, t, scene.dur)
            if ex <= 0:
                continue
            if ex < 1:
                c.saveLayerAlpha(None, int(255 * ex))
                c.translate(0, -18 * (1 - ex))
            fn(self, c, el, t - t0, scene)
            if ex < 1:
                c.restore()
        c.restore()
        return surface.makeImageSnapshot()

    def draw_grid(self, c, T):
        if not self.story.get("meta", {}).get("grid", True):
            return
        p = paint(self.brand.color("faint", 0.35), stroke=1.2)
        step = 90
        off = (T * 6) % step
        for x in range(0, self.W + step, step):
            c.drawLine(x - off * 0.3, 0, x - off * 0.3, self.H, p)
        for y in range(0, self.H + step, step):
            c.drawLine(0, y + off, self.W, y + off, p)

    def draw_hud(self, c, T):
        meta = self.story.get("meta", {})
        safe = self.brand.safe
        if meta.get("progress", True):
            y = 238
            c.drawRect(skia.Rect(safe["left"], y, safe["right"], y + 5), paint(self.brand.color("faint")))
            c.drawRect(skia.Rect(safe["left"], y, lerp(safe["left"], safe["right"], clamp(T / self.total)), y + 5), paint(self.brand.color("accent")))
        if meta.get("brand_mark", True):
            f = self.brand.font("mono", "bold", 24)
            x, y = safe["left"], 290
            c.drawCircle(x + 7, y - 8, 7, paint(self.brand.color("accent")))
            draw_tracked(c, self.brand.data["name"], x + 26, y, f, 3, paint(self.brand.color("ink", 0.85)))
            tag = meta.get("series")
            if tag:
                tw = sum(f.measureText(ch) + 3 for ch in tag)
                draw_tracked(c, tag, safe["right"] - tw, y, f, 3, paint(self.brand.color("muted")))

    def frame(self, T):
        c = self.main.getCanvas()
        c.drawImage(self._bg, 0, 0)
        self.draw_grid(c, T)
        scene = self.scene_at(T)
        t = T - scene.start
        trans = scene.data.get("transition", "cut" if scene.index else "none")
        td = 0.2
        if scene.index > 0 and trans in ("whip", "push", "zoom") and t < td:
            prev = self.scenes[scene.index - 1]
            out_img = self.draw_scene(self.layer2, prev, prev.dur - 1 / self.fps)
            in_img = self.draw_scene(self.layer, scene, t)
            e = out_expo(t / td) if trans != "zoom" else out_cubic(t / td)
            if trans == "whip":
                blur = 40 * (1 - abs(2 * e - 1))
                bp = skia.Paint(ImageFilter=skia.ImageFilters.Blur(0.1, max(blur, 0.1)))
                c.drawImage(out_img, 0, -self.H * 0.35 * e, skia.SamplingOptions(), bp)
                c.drawImage(in_img, 0, self.H * 0.35 * (1 - e), skia.SamplingOptions(), bp)
            elif trans == "push":
                blur = 40 * (1 - abs(2 * e - 1))
                bp = skia.Paint(ImageFilter=skia.ImageFilters.Blur(max(blur, 0.1), 0.1))
                c.drawImage(out_img, -self.W * e, 0, skia.SamplingOptions(), bp)
                c.drawImage(in_img, self.W * (1 - e), 0, skia.SamplingOptions(), bp)
            else:
                pa = skia.Paint()
                pa.setAlphaf(1 - e)
                c.drawImage(out_img, 0, 0, skia.SamplingOptions(), pa)
                c.save()
                z = lerp(1.12, 1.0, e)
                c.translate(self.W / 2, self.H / 2)
                c.scale(z, z)
                c.translate(-self.W / 2, -self.H / 2)
                pb = skia.Paint()
                pb.setAlphaf(e)
                c.drawImage(in_img, 0, 0, skia.SamplingOptions(), pb)
                c.restore()
        else:
            c.drawImage(self.draw_scene(self.layer, scene, t), 0, 0)
        if trans == "flash" and t < 0.12:
            c.drawRect(skia.Rect(0, 0, self.W, self.H), paint(self.brand.color("ink", 0.55 * (1 - t / 0.12))))
        self.draw_hud(c, T)
        g = self._grain[int(T * self.fps / 4) % len(self._grain)]
        c.drawImageRect(g, skia.Rect(0, 0, self.W, self.H), skia.SamplingOptions())
        return self.main.makeImageSnapshot()

    def sfx_events(self):
        events = []
        for s in self.scenes:
            trans = s.data.get("transition", "cut" if s.index else "none")
            if s.index > 0 and trans in ("whip", "push"):
                events.append({"t": s.start, "name": "whoosh", "pre": 0.12, "seed": s.index, "db": -2})
            if s.data.get("sfx"):
                events.append({"t": s.start, "name": s.data["sfx"], "seed": s.index})
            for j, el in enumerate(s.elements):
                t0 = s.start + el.get("at", 0.0)
                name = el.get("sfx", DEFAULT_SFX.get((el["type"], el.get("in", ""))))
                if name and name != "none":
                    events.append({"t": t0, "name": name, "seed": s.index * 31 + j, "db": el.get("sfx_db", 0)})
                if el["type"] == "counter" and el.get("ticks", True):
                    d = el.get("count", 0.9)
                    for k in range(int(d / 0.06)):
                        events.append({"t": t0 + k * 0.06, "name": "tick", "db": -8})
        return events


DEFAULT_SFX = {
    ("text", "slam"): "hit",
    ("chip", ""): "pop",
    ("counter", ""): "pop",
}


# ---------------------------------------------------------------- elements

def el_text(r, c, el, t, scene):
    brand = r.brand
    lay = layout_text(brand, el)
    font = lay["font"]
    x, y = el.get("x", brand.safe["left"]), el.get("y", 800)
    align = el.get("align", "left")
    mode = el.get("in", "rise")
    color = brand.color(el.get("color", "ink"))
    accent = brand.color(el.get("accent", "accent"))
    box_bg = brand.color(el.get("box", "accent"))
    box_fg = brand.color(el.get("box_text", "bg"))
    stagger = el.get("stagger", {"words": 0.07, "rise": 0.09}.get(mode, 0.0))
    dur = el.get("in_dur", {"slam": 0.32, "words": 0.32, "rise": 0.45, "fade": 0.35, "wipe": 0.5, "type": 0.6}.get(mode, 0.0))
    total_chars = sum(len(w[0]) for ln in lay["lines"] for w in ln)
    shown_chars = total_chars * progress(t, 0, dur) if mode == "type" else total_chars

    c.save()
    if mode == "slam":
        p = progress(t, 0, dur)
        s = lerp(1.32, 1.0, out_back(p, 2.2)) if p < 1 else 1.0
        cx = x if align == "center" else x + lay["block_w"] / 2
        cy = y + lay["block_h"] / 2
        c.translate(cx, cy)
        c.scale(s, s)
        c.translate(-cx, -cy)
        if p < 0.25:
            c.saveLayerAlpha(None, int(255 * p / 0.25))
    if mode == "wipe":
        p = out_cubic(progress(t, 0, dur))
        x0 = x - lay["block_w"] / 2 if align == "center" else x
        c.clipRect(skia.Rect(x0 - 20, y - 40, x0 - 20 + (lay["block_w"] + 60) * p, y + lay["block_h"] + 40))
    if mode == "fade":
        c.saveLayerAlpha(None, int(255 * out_cubic(progress(t, 0, dur))))

    word_i = 0
    chars_done = 0
    for li, line in enumerate(lay["lines"]):
        lw = lay["widths"][li]
        lx = x - lw / 2 if align == "center" else x - lw if align == "right" else x
        base = y + lay["ascent"] + li * lay["line_h"]
        if mode == "rise":
            p = out_quart(progress(t, li * stagger, dur))
            if p <= 0:
                word_i += len(line)
                continue
            c.save()
            c.saveLayerAlpha(None, int(255 * clamp(p * 1.4)))
            c.translate(0, 46 * (1 - p))
        cx = lx
        i = 0
        while i < len(line):
            w, style, ww = line[i]
            if style == "box":
                j = i
                run_w = 0.0
                while j < len(line) and line[j][1] == "box":
                    run_w += line[j][2] + (lay["space"] if j > i else 0)
                    j += 1
                pad = lay["size"] * 0.12
                bp = out_expo(progress(t, (word_i if mode == "words" else 0) * stagger + 0.12, 0.35)) if mode != "none" else 1
                rect = skia.Rect(cx - pad, base - lay["cap"] - pad * 1.05, cx - pad + (run_w + 2 * pad) * bp, base + pad * 0.95)
                c.drawRoundRect(rect, pad * 0.5, pad * 0.5, paint(box_bg))
            if mode == "type":
                remaining = shown_chars - chars_done
                if remaining <= 0:
                    break
                vis = w[: int(math.ceil(remaining))] if remaining < len(w) else w
            else:
                vis = w
            col = box_fg if style == "box" else accent if style == "accent" else color
            if mode == "words":
                p = out_quart(progress(t, word_i * stagger, dur))
                if p > 0:
                    c.save()
                    c.saveLayerAlpha(None, int(255 * clamp(p * 1.6)))
                    c.translate(0, 28 * (1 - p))
                    draw_tracked(c, vis, cx, base, font, lay["tracking"], paint(col))
                    c.restore()
                    c.restore()
            else:
                draw_tracked(c, vis, cx, base, font, lay["tracking"], paint(col))
            chars_done += len(w)
            cx += ww + lay["space"]
            word_i += 1
            i += 1
        if mode == "rise":
            c.restore()
            c.restore()
    if mode == "slam" and progress(t, 0, dur) < 0.25:
        c.restore()
    if mode == "fade":
        c.restore()
    c.restore()


def fmt_number(v, decimals, sep=True):
    s = f"{v:,.{decimals}f}" if sep else f"{v:.{decimals}f}"
    return s


def el_counter(r, c, el, t, scene):
    brand = r.brand
    d = el.get("count", 0.9)
    p = EASINGS[el.get("ease", "out_expo")](progress(t, 0, d))
    v = lerp(el.get("from", 0), el["to"], p)
    txt = f"{el.get('prefix', '')}{fmt_number(v, el.get('decimals', 0), el.get('sep', True))}{el.get('suffix', '')}"
    font = brand.font(el.get("font", "display"), el.get("weight", "black"), el.get("size", 300))
    tracking = -0.03 * el.get("size", 300)
    final = f"{el.get('prefix', '')}{fmt_number(el['to'], el.get('decimals', 0), el.get('sep', True))}{el.get('suffix', '')}"
    width = font.measureText(final) + tracking * (len(final) - 1)
    x = el.get("x", brand.safe["left"])
    if el.get("align", "left") == "center":
        x -= width / 2
    y = el.get("y", 800) + font.getMetrics().fCapHeight
    s = lerp(0.85, 1.0, out_back(progress(t, 0, 0.35)))
    c.save()
    c.translate(x + width / 2, y)
    c.scale(s, s)
    c.translate(-(x + width / 2), -y)
    draw_tracked(c, txt, x, y, font, tracking, paint(brand.color(el.get("color", "ink"))))
    c.restore()


def el_chip(r, c, el, t, scene):
    brand = r.brand
    size = el.get("size", 30)
    font = brand.font("mono", "bold", size)
    text = el["text"].upper()
    tr = size * 0.12
    tw = sum(font.measureText(ch) + tr for ch in text) - tr
    padx, pady = size * 0.6, size * 0.42
    x, y = el.get("x", brand.safe["left"]), el.get("y", 400)
    if el.get("align") == "center":
        x -= (tw + 2 * padx) / 2
    p = out_back(progress(t, 0, 0.3), 2.0)
    w = (tw + 2 * padx) * clamp(p)
    h = size + 2 * pady
    bg = brand.color(el.get("bg", "accent"))
    outline = el.get("outline", False)
    rect = skia.Rect(x, y, x + max(w, h * 0.2), y + h)
    if outline:
        c.drawRoundRect(rect, h / 2, h / 2, paint(bg, stroke=3))
    else:
        c.drawRoundRect(rect, h / 2, h / 2, paint(bg))
    if p > 0.55:
        c.save()
        c.clipRect(rect)
        fg = brand.color(el.get("fg", "accent" if outline else "bg"))
        draw_tracked(c, text, x + padx, y + pady + font.getMetrics().fCapHeight + (size - font.getMetrics().fCapHeight) / 2, font, tr, paint(fg))
        c.restore()


def el_bars(r, c, el, t, scene):
    brand = r.brand
    items = el["items"]
    x, y = el.get("x", brand.safe["left"]), el.get("y", 700)
    width = el.get("width", brand.safe["right"] - brand.safe["left"])
    bar_h = el.get("bar_h", 64)
    gap = el.get("gap", 70)
    vmax = el.get("max", max(i["value"] for i in items))
    label_font = brand.font("text", "semibold", el.get("label_size", 38))
    val_font = brand.font("display", "black", el.get("value_size", 58))
    stagger = el.get("stagger", 0.18)
    grow = el.get("grow", 0.8)
    for k, it in enumerate(items):
        top = y + k * (bar_h + gap + 52)
        p = out_expo(progress(t, k * stagger, grow))
        if p <= 0:
            continue
        a = clamp(p * 2)
        c.drawString(it["label"], x, top + 38, label_font, paint(brand.color(it.get("label_color", "muted"), a)))
        bw = width * (it["value"] / vmax) * p
        col = brand.color(it.get("color", "accent" if k == 0 else "faint"))
        rect = skia.Rect(x, top + 56, x + max(bw, 6), top + 56 + bar_h)
        c.drawRoundRect(rect, 10, 10, paint(col))
        disp = it.get("display")
        if disp is None:
            disp = fmt_number(it["value"] * p, it.get("decimals", 0)) + it.get("suffix", "")
        tw = val_font.measureText(disp)
        inside = bw > tw + 60
        tx = x + bw - tw - 24 if inside else x + bw + 20
        tc = brand.color("bg" if inside and it.get("color", "accent" if k == 0 else "faint") not in ("faint",) else "ink", a)
        c.drawString(disp, tx, top + 56 + bar_h / 2 + val_font.getMetrics().fCapHeight / 2, val_font, paint(tc))


def el_line(r, c, el, t, scene):
    brand = r.brand
    pts = el["points"]
    path = smooth_path(pts) if el.get("curve") else poly_path(pts)
    d = el.get("draw", 0.6)
    p = EASINGS[el.get("ease", "out_cubic")](progress(t, 0, d)) if d > 0 else 1
    seg, _ = partial(path, 0, p)
    pa = paint(brand.color(el.get("color", "ink"), el.get("alpha", 1)), stroke=el.get("width", 6))
    if el.get("dash"):
        pa.setPathEffect(skia.DashPathEffect.Make(el["dash"], -t * el.get("flow", 0)))
    c.drawPath(seg, pa)
    if el.get("arrow") and p > 0.02:
        tip, tan = pos_tan(path, p)
        arrow_head(c, tip, tan, el.get("head", el.get("width", 6) * 4), brand.color(el.get("color", "ink")))


def el_arrow(r, c, el, t, scene):
    brand = r.brand
    (x0, y0), (x1, y1) = el["from"], el["to"]
    bend = el.get("bend", 0)
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    dx, dy = x1 - x0, y1 - y0
    n = math.hypot(dx, dy) or 1
    cx, cy = mx - dy / n * bend, my + dx / n * bend
    path = skia.Path()
    path.moveTo(x0, y0)
    path.quadTo(cx, cy, x1, y1)
    d = el.get("draw", 0.45)
    p = out_cubic(progress(t, 0, d))
    head = el.get("head", el.get("width", 8) * 3.6)
    seg, total = partial(path, 0, max(p - head * 0.6 / max(n, 1), 0))
    col = brand.color(el.get("color", "accent"))
    pa = paint(col, stroke=el.get("width", 8))
    if el.get("dash"):
        pa.setPathEffect(skia.DashPathEffect.Make(el["dash"], -t * el.get("flow", 0)))
    c.drawPath(seg, pa)
    if p > 0.05:
        tip, tan = pos_tan(path, p)
        arrow_head(c, tip, tan, head, col)
    if el.get("label") and p > 0.6:
        lab = dict(type="text", text=el["label"], font="mono", weight="bold", size=el.get("label_size", 30),
                   x=el.get("label_x", x1), y=el.get("label_y", y1 + 24), align=el.get("label_align", "center"),
                   color=el.get("label_color", "ink"), upper=True, tracking=2, **{"in": "fade"})
        el_text(r, c, lab, t - d * 0.6, scene)


def el_shape(r, c, el, t, scene):
    brand = r.brand
    kind = el.get("shape", "rect")
    p = out_back(progress(t, 0, el.get("in_dur", 0.35)), 1.6) if el.get("in", "pop") == "pop" else 1
    fill = el.get("fill")
    stroke = el.get("stroke")
    sw = el.get("stroke_width", 4)
    c.save()
    if kind == "circle" or kind == "ring":
        cx, cy, rad = el["x"], el["y"], el["r"]
        c.translate(cx, cy)
        c.scale(p, p)
        if fill:
            c.drawCircle(0, 0, rad, paint(brand.color(fill, el.get("alpha", 1))))
        if stroke:
            c.drawCircle(0, 0, rad, paint(brand.color(stroke), stroke=sw))
    elif kind == "arc":
        cx, cy, rad = el["x"], el["y"], el["r"]
        frac = el.get("value", 1.0) * out_cubic(progress(t, 0, el.get("draw", 0.9)))
        c.drawArc(skia.Rect(cx - rad, cy - rad, cx + rad, cy + rad), 0, 360, False, paint(brand.color("faint"), stroke=sw, cap="butt"))
        c.drawArc(skia.Rect(cx - rad, cy - rad, cx + rad, cy + rad), -90, 360 * frac, False, paint(brand.color(stroke or "accent"), stroke=sw))
    else:
        x, y, w, h = el["x"], el["y"], el["w"], el["h"]
        grow = el.get("grow")
        if grow == "right":
            w *= out_expo(progress(t, 0, el.get("in_dur", 0.5)))
        elif grow == "up":
            k = out_expo(progress(t, 0, el.get("in_dur", 0.5)))
            y, h = y + h * (1 - k), h * k
        elif p != 1:
            c.translate(x + w / 2, y + h / 2)
            c.scale(p, p)
            c.translate(-(x + w / 2), -(y + h / 2))
        rad = el.get("radius", 16)
        rect = skia.Rect(x, y, x + w, y + h)
        if fill:
            c.drawRoundRect(rect, rad, rad, paint(brand.color(fill, el.get("alpha", 1))))
        if stroke:
            pa = paint(brand.color(stroke), stroke=sw)
            if el.get("dash"):
                pa.setPathEffect(skia.DashPathEffect.Make(el["dash"], -t * el.get("flow", 0)))
            c.drawRoundRect(rect, rad, rad, pa)
    c.restore()


def el_callout(r, c, el, t, scene):
    brand = r.brand
    (px, py) = el["point"]
    (lx, ly) = el["label_at"]
    col = brand.color(el.get("color", "accent"))
    p_dot = out_back(progress(t, 0, 0.25), 2)
    c.drawCircle(px, py, 11 * p_dot, paint(col))
    pulse = (t * 1.2) % 1.0
    c.drawCircle(px, py, 11 + 26 * pulse, paint(brand.color(el.get("color", "accent"), 0.6 * (1 - pulse)), stroke=3))
    elbow = (lx, py) if el.get("elbow", "h") == "h" else (px, ly)
    path = poly_path([(px, py), elbow, (lx, ly)])
    seg, _ = partial(path, 0, out_cubic(progress(t, 0.12, 0.35)))
    c.drawPath(seg, paint(col, stroke=3))
    if t > 0.35:
        lab = dict(type="text", text=el["text"], font=el.get("font", "mono"), weight="bold", size=el.get("size", 32),
                   x=lx + el.get("dx", 14), y=ly - el.get("size", 32) * 0.55, align=el.get("align", "left"),
                   color=el.get("text_color", "ink"), upper=True, tracking=el.get("tracking", 2), width=el.get("width", 600),
                   **{"in": "wipe"})
        el_text(r, c, lab, t - 0.35, scene)


def el_image(r, c, el, t, scene):
    img = r.image(el["src"])
    x, y, w, h = el["x"], el["y"], el["w"], el["h"]
    z = lerp(1.0, el.get("zoom", 1.08), clamp(t / scene.dur))
    iw, ih = img.width(), img.height()
    s = max(w / iw, h / ih) * z
    sw, sh = w / s, h / s
    src = skia.Rect((iw - sw) / 2, (ih - sh) / 2, (iw + sw) / 2, (ih + sh) / 2)
    c.save()
    c.clipRRect(skia.RRect.MakeRectXY(skia.Rect(x, y, x + w, y + h), el.get("radius", 24), el.get("radius", 24)), True)
    pa = skia.Paint()
    pa.setAlphaf(out_cubic(progress(t, 0, 0.3)))
    c.drawImageRect(img, src, skia.Rect(x, y, x + w, y + h), skia.SamplingOptions(skia.FilterMode.kLinear), pa)
    c.restore()


# ---------------------------------------------------------------- F1 car, side view (units: x 0 rear .. 1000 nose, y up)

SIDE = {
    "body": [(58, 66), (70, 86), (180, 104), (330, 134), (430, 160), (462, 180), (506, 180), (518, 142), (606, 140),
             (690, 126), (790, 100), (885, 72), (978, 50), (990, 42), (978, 37), (880, 46), (760, 58), (700, 56),
             (700, 30), (330, 28), (250, 38), (200, 46), (120, 54)],
    "sidepod": [(580, 38), (580, 100), (548, 106), (430, 94), (318, 64), (270, 44)],
    "floor": [(232, 14), (735, 14), (742, 20), (232, 21)],
    "diffuser": [(232, 14), (232, 21), (90, 58), (72, 58), (80, 46)],
    "rear_wing_endplate": [(18, 62), (98, 62), (104, 150), (96, 186), (22, 186), (14, 150)],
    "rear_wing_main": [(100, 150), (60, 156), (22, 162), (24, 170), (62, 165), (100, 156)],
    "beam_wing": [(96, 82), (60, 86), (30, 92), (32, 97), (62, 92), (96, 87)],
    "front_wing": [[(1000, 14), (930, 15), (878, 20), (878, 24), (930, 21), (1000, 20)],
                   [(966, 26), (920, 28), (876, 36), (876, 41), (920, 34), (966, 31)],
                   [(936, 37), (900, 41), (874, 52), (874, 57), (902, 48), (936, 42)]],
    "front_wing_endplate": [(872, 8), (1000, 8), (1000, 22), (946, 46), (872, 62)],
    "rear_wheel": (165, 64, 64),
    "front_wheel": (808, 64, 64),
    "helmet": (548, 152, 18),
    "halo": [(512, 152), (528, 170), (568, 174), (604, 158), (612, 140)],
    "mirror": [(616, 128), (648, 128), (648, 138), (616, 138)],
    "suspension": [[(700, 92), (808, 84)], [(700, 66), (808, 54)], [(262, 84), (165, 84)], [(262, 58), (165, 52)]],
}
FLAP_PIVOT = (26, 187)
FLAP = [(94, 160), (60, 170), (26, 184), (28, 190), (62, 177), (94, 165)]


def _rotate(points, pivot, deg):
    ang = math.radians(deg)
    px, py = pivot
    out = []
    for x, y in points:
        dx, dy = x - px, y - py
        out.append((px + dx * math.cos(ang) - dy * math.sin(ang), py + dx * math.sin(ang) + dy * math.cos(ang)))
    return out


def _flap(open_frac):
    return _rotate(FLAP, FLAP_PIVOT, 24 * open_frac)


def animated(value, t, default=0.0):
    """A number, {"from","to","at","dur"}, or {"keys": [[t, v], ...]} eased between keys."""
    if value is None:
        return default
    if not isinstance(value, dict):
        return value
    if "keys" in value:
        keys = value["keys"]
        if t <= keys[0][0]:
            return keys[0][1]
        for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
            if t <= t1:
                return lerp(v0, v1, in_out(progress(t, t0, t1 - t0)))
        return keys[-1][1]
    return lerp(value.get("from", 0), value.get("to", 1), in_out(progress(t, value.get("at", 0), value.get("dur", 0.4))))


def el_car_side(r, c, el, t, scene):
    brand = r.brand
    s = el.get("scale", 0.8)
    cx, cy = el.get("x", 540), el.get("y", 900)
    flip = -1 if el.get("flip") else 1
    hl = set(el.get("highlight", []))
    show = set(el.get("show", []))

    enter = el.get("in", "drive")
    off = 0.0
    alpha = 1.0
    if enter == "drive":
        p = out_expo(progress(t, 0, 0.6))
        off = (1 - p) * 900 * flip
        alpha = clamp(p * 2)
    elif enter == "fade":
        alpha = out_cubic(progress(t, 0, 0.4))

    def T(pt):
        x, y = pt
        return (cx + (x - 500) * s * flip + off, cy - (y - 90) * s)

    def P(pts, close=True):
        return poly_path([T(p) for p in pts], close)

    ink = brand.color(el.get("color", "ink"), alpha)
    fill = brand.color(el.get("fill", "bg_top"), alpha)
    acc = brand.color(el.get("accent", "accent"), alpha)
    lw = el.get("line", 3.2)

    def part(name, pts, close=True):
        path = P(pts, close)
        c.drawPath(path, paint(acc if name in hl else fill))
        c.drawPath(path, paint(acc if name in hl else ink, stroke=lw))

    c.save()
    if el.get("rake"):
        c.rotate(-el["rake"] * flip, *T((500, 0)))

    ground_y = T((0, 0))[1]
    if el.get("ground", True):
        c.drawLine(brand.safe["left"] - 40, ground_y, brand.safe["right"] + 40, ground_y,
                   paint(brand.color("muted", 0.5 * alpha), stroke=2))

    if "airflow_over" in show or "airflow" in show:
        _flow_lines(r, c, T, [
            [(1150, 250), (900, 248), (650, 256), (450, 262), (250, 256), (-150, 250)],
            [(1150, 112), (1000, 104), (900, 112), (780, 150), (640, 202), (500, 222), (330, 212), (200, 200), (110, 196)],
            [(260, 190), (120, 192), (40, 205), (-40, 236), (-150, 280)],
        ], t, brand.color(el.get("flow_color", "cool"), alpha * 0.9), speed=1.0)
    if "airflow_under" in show or "airflow" in show:
        _flow_lines(r, c, T, [
            [(1150, 6), (900, 6), (740, 7), (480, 7), (232, 8), (110, 40), (-60, 80), (-150, 95)],
        ], t, brand.color(el.get("flow_under_color", "data"), alpha), speed=2.2, width=4.5)
    if "dirty_air" in show:
        _dirty_air(r, c, T, t, brand.color(el.get("wake_color", "muted"), alpha * 0.8))

    for a, b in SIDE["suspension"]:
        c.drawLine(*T(a), *T(b), paint(ink, stroke=lw * 0.8))
    part("diffuser", SIDE["diffuser"])
    part("floor", SIDE["floor"])
    part("body", SIDE["body"])
    part("sidepod", SIDE["sidepod"])
    part("beam_wing", SIDE["beam_wing"])
    c.drawLine(*T((58, 70)), *T((58, 152)), paint(ink, stroke=lw))
    part("rear_wing", SIDE["rear_wing_main"])
    part("drs", _flap(animated(el.get("drs"), t)))
    ep = P(SIDE["rear_wing_endplate"])
    c.drawPath(ep, paint(brand.color("bg_top", alpha * 0.35)))
    c.drawPath(ep, paint(acc if "rear_wing" in hl else ink, stroke=lw))
    part("front_wing_endplate", SIDE["front_wing_endplate"])
    front_open = animated(el.get("front_flap"), t)
    for k, fw in enumerate(SIDE["front_wing"]):
        if k and front_open:
            fw = _rotate(fw, fw[0], 9 * k * front_open)
        part("front_flap" if k and "front_flap" in hl else "front_wing", fw)
    c.drawPath(P(SIDE["mirror"]), paint(ink, stroke=lw * 0.8))
    hx, hy, hr = SIDE["helmet"]
    hp = T((hx, hy))
    c.drawCircle(*hp, hr * s, paint(acc if "driver" in hl else fill))
    c.drawCircle(*hp, hr * s, paint(acc if "driver" in hl else ink, stroke=lw))
    c.drawPath(P(SIDE["halo"], False), paint(acc if "halo" in hl else ink, stroke=lw * 2.2))
    for name in ("rear_wheel", "front_wheel"):
        wx, wy, wr = SIDE[name]
        wp = T((wx, wy))
        is_hl = "tyres" in hl
        c.drawCircle(*wp, wr * s, paint(brand.color("bg", alpha)))
        c.drawCircle(*wp, wr * s, paint(acc if is_hl else ink, stroke=lw * 1.4))
        c.drawCircle(*wp, wr * s * 0.62, paint(acc if is_hl else ink, stroke=lw * 0.8))
        spin = t * el.get("wheel_spin", 0)
        for k in range(5):
            a = spin + k * 2 * math.pi / 5
            c.drawLine(wp[0], wp[1], wp[0] + math.cos(a) * wr * s * 0.55, wp[1] + math.sin(a) * wr * s * 0.55,
                       paint(brand.color("muted", alpha * 0.6), stroke=lw * 0.6))

    if "downforce" in show:
        df = el.get("downforce", {})
        arrows = [(935, df.get("front", 0.8), "FRONT WING"), (480, df.get("floor", 1.4), "FLOOR"), (60, df.get("rear", 0.9), "REAR WING")]
        for k, (ux, mag, label) in enumerate(arrows):
            p = out_expo(progress(t, el.get("downforce_at", 0.5) + k * 0.15, 0.5))
            if p <= 0:
                continue
            top = T((ux, -10))
            ln = 150 * mag * s * p
            col = brand.color(el.get("force_color", "accent"))
            c.drawLine(top[0], top[1], top[0], top[1] + ln - 26, paint(col, stroke=10 * s + 4))
            arrow_head(c, (top[0], top[1] + ln), (0, 1), 34, col)
            if el.get("force_labels", True) and p > 0.7:
                f = brand.font("mono", "bold", 26)
                tw = sum(f.measureText(ch) + 2 for ch in label)
                lx = clamp(top[0] - tw / 2, brand.safe["left"], brand.safe["right"] - tw)
                draw_tracked(c, label, lx, top[1] + ln + 44, f, 2, paint(brand.color("ink", (p - 0.7) / 0.3)))
    c.restore()


def _flow_lines(r, c, T, lines, t, color, speed=1.0, width=3.5):
    for i, pts in enumerate(lines):
        path = smooth_path([T(p) for p in pts])
        pa = paint(color, stroke=width)
        pa.setPathEffect(skia.DashPathEffect.Make([46, 30], -t * 260 * speed - i * 23))
        p = out_cubic(progress(t, 0.1 + i * 0.08, 0.7))
        seg, _ = partial(path, 0, p)
        c.drawPath(seg, pa)


def _dirty_air(r, c, T, t, color):
    for i in range(7):
        y0 = 40 + i * 26
        pts = []
        for k in range(14):
            x = 10 - k * 55
            wob = math.sin(k * 0.9 + t * 7 + i * 1.7) * (6 + k * 3.2)
            pts.append((x, y0 + wob + k * (i - 3) * 2.2))
        path = smooth_path([T(p) for p in pts])
        pa = paint(color, stroke=3)
        pa.setPathEffect(skia.DashPathEffect.Make([18, 14], -t * 300 - i * 9))
        c.drawPath(path, pa)


# ---------------------------------------------------------------- F1 car, top view (units: x -180..180, y 0 nose .. 1000 rear)

TOP = {
    "floor": [(-60, 270), (-160, 330), (-176, 420), (-176, 740), (-125, 790), (125, 790), (176, 740), (176, 420), (160, 330), (60, 270)],
    "body": [(-14, 22), (14, 22), (30, 230), (46, 360), (54, 430), (118, 452), (126, 520), (116, 620), (86, 720), (56, 790),
             (44, 880), (-44, 880), (-56, 790), (-86, 720), (-116, 620), (-126, 520), (-118, 452), (-54, 430), (-46, 360), (-30, 230)],
    "cockpit": [(-26, 378), (26, 378), (30, 470), (-30, 470)],
    "front_wing": [(-178, 30), (178, 30), (180, 58), (120, 72), (40, 64), (-40, 64), (-120, 72), (-180, 58)],
    "rear_wing": [(-130, 900), (130, 900), (130, 958), (-130, 958)],
    "front_tyres": [(-150, 192), (150, 192)],
    "rear_tyres": [(-142, 835), (142, 835)],
}


def el_car_top(r, c, el, t, scene):
    brand = r.brand
    s = el.get("scale", 0.9)
    cx, cy = el.get("x", 540), el.get("y", 900)
    rot = el.get("rot", 0)
    hl = set(el.get("highlight", []))
    show = set(el.get("show", []))
    move = el.get("move")
    if move:
        p = EASINGS[move.get("ease", "in_out_cubic")](progress(t, move.get("at", 0), move.get("dur", 1)))
        cx = lerp(cx, move.get("x", cx), p)
        cy = lerp(cy, move.get("y", cy), p)
    enter = el.get("in", "fade")
    alpha = out_cubic(progress(t, 0, 0.35)) if enter == "fade" else 1
    if enter == "drive":
        p = out_expo(progress(t, 0, 0.6))
        cy += (1 - p) * 1200
        alpha = 1

    ink = brand.color(el.get("color", "ink"), alpha)
    fill = brand.color(el.get("fill", "bg_top"), alpha)
    acc = brand.color(el.get("accent", "accent"), alpha)
    lw = el.get("line", 3.2)

    c.save()
    c.translate(cx, cy)
    c.rotate(rot)
    c.scale(s, s)
    c.translate(0, -500)

    if "slipstream" in show:
        p = out_cubic(progress(t, el.get("show_at", 0.3), 0.6))
        length = el.get("wake_length", 900) * p
        wake = poly_path([(-120, 960), (120, 960), (230, 960 + length), (-230, 960 + length)], True)
        sh = skia.GradientShader.MakeLinear([skia.Point(0, 960), skia.Point(0, 960 + max(length, 1))],
                                            [brand.color(el.get("wake_color", "cool"), 0.35 * alpha), brand.color(el.get("wake_color", "cool"), 0.0)])
        c.drawPath(wake, skia.Paint(AntiAlias=True, Shader=sh))
        for i in range(-2, 3):
            pa = paint(brand.color(el.get("wake_color", "cool"), 0.8 * alpha), stroke=3 / s)
            pa.setPathEffect(skia.DashPathEffect.Make([40, 30], t * 300 + i * 17))
            path = poly_path([(i * 45, 970), (i * 85, 960 + length)])
            c.drawPath(path, pa)

    def part(name, pts, close=True):
        path = poly_path(pts, close)
        c.drawPath(path, paint(acc if name in hl else fill))
        c.drawPath(path, paint(acc if name in hl else ink, stroke=lw / s * 0.9))

    c.drawPath(poly_path(TOP["floor"], True), paint(acc if "floor" in hl else brand.color("faint", alpha * 0.6)))
    c.drawPath(poly_path(TOP["floor"], True), paint(acc if "floor" in hl else ink, stroke=lw / s * 0.6))
    for sx in (-1, 1):
        for a, b in [((40 * sx, 185), (124 * sx, 190)), ((44 * sx, 215), (124 * sx, 200)), ((52 * sx, 820), (106 * sx, 830)), ((50 * sx, 850), (106 * sx, 842))]:
            c.drawLine(a[0], a[1], b[0], b[1], paint(ink, stroke=lw / s * 0.7))
    part("body", TOP["body"])
    part("cockpit", TOP["cockpit"])
    c.drawCircle(0, 440, 19, paint(acc if "driver" in hl else ink))
    halo = skia.Path()
    halo.moveTo(-30, 474)
    halo.quadTo(-38, 398, 0, 384)
    halo.quadTo(38, 398, 30, 474)
    c.drawPath(halo, paint(acc if "halo" in hl else ink, stroke=lw / s * 1.6))
    part("front_wing", TOP["front_wing"])
    part("rear_wing", TOP["rear_wing"])
    if "drs" in show:
        open_frac = animated(el.get("drs", 1.0), t)
        gap = 18 * open_frac
        c.drawRect(skia.Rect(-128, 928 - gap / 2, 128, 928 + gap / 2), paint(brand.color("bg", alpha)))
    for (tx, ty), (w, h) in [(p, (54, 128)) for p in TOP["front_tyres"]] + [(p, (72, 128)) for p in TOP["rear_tyres"]]:
        rect = skia.Rect(tx - w / 2, ty - h / 2, tx + w / 2, ty + h / 2)
        col = brand.color(el.get("tyre", "bg"), alpha) if "tyres" not in hl else acc
        c.drawRoundRect(rect, 12, 12, paint(col))
        c.drawRoundRect(rect, 12, 12, paint(acc if "tyres" in hl else ink, stroke=lw / s))
        comp = el.get("compound")
        if comp:
            c.drawLine(tx - w / 2 + 6, ty - h / 2 + 12, tx - w / 2 + 6, ty + h / 2 - 12, paint(brand.color(comp, alpha), stroke=6))
            c.drawLine(tx + w / 2 - 6, ty - h / 2 + 12, tx + w / 2 - 6, ty + h / 2 - 12, paint(brand.color(comp, alpha), stroke=6))
    if el.get("label"):
        f = brand.font("mono", "bold", 30 / s)
        lab = el["label"].upper()
        tw = sum(f.measureText(ch) + 2 / s for ch in lab)
        draw_tracked(c, lab, -tw / 2, -40, f, 2 / s, paint(brand.color(el.get("label_color", "ink"), alpha)))
    c.restore()


# ---------------------------------------------------------------- tyre (side-on)

def el_tyre(r, c, el, t, scene):
    brand = r.brand
    x, y, rad = el["x"], el["y"], el.get("r", 180)
    p = out_back(progress(t, 0, 0.45), 1.4)
    spin = el.get("spin", 0) * t
    c.save()
    c.translate(x, y)
    c.scale(p, p)
    c.rotate(math.degrees(spin))
    c.drawCircle(0, 0, rad, paint(brand.color("#15181D")))
    c.drawCircle(0, 0, rad, paint(brand.color("ink", 0.9), stroke=4))
    comp_col = brand.color(el.get("compound", "soft"))
    c.drawCircle(0, 0, rad * 0.8, paint(comp_col, stroke=rad * 0.06))
    f = brand.font("display", "black", rad * 0.13)
    word = el.get("brand_text", el.get("compound", "soft").upper())
    circ = 2 * math.pi * rad * 0.8
    tw = f.measureText(word)
    for side in (0, math.pi):
        ang = side - (tw / circ) * math.pi
        for ch in word:
            cw = f.measureText(ch)
            a = ang + (cw / 2) / (rad * 0.8)
            c.save()
            c.rotate(math.degrees(a))
            c.drawString(ch, -cw / 2, -rad * 0.8 - rad * 0.06, f, paint(comp_col))
            c.restore()
            ang += cw / (rad * 0.8)
    c.drawCircle(0, 0, rad * 0.62, paint(brand.color("#22262D")))
    for k in range(10):
        a = k * 2 * math.pi / 10
        c.drawLine(math.cos(a) * rad * 0.2, math.sin(a) * rad * 0.2, math.cos(a) * rad * 0.58, math.sin(a) * rad * 0.58,
                   paint(brand.color("muted", 0.8), stroke=rad * 0.035))
    c.drawCircle(0, 0, rad * 0.18, paint(brand.color("muted")))
    wear = el.get("wear", 0)
    if wear:
        rng = np.random.default_rng(3)
        for k in range(int(60 * wear)):
            a = rng.uniform(0, 2 * math.pi)
            rr = rng.uniform(rad * 0.88, rad * 0.99)
            c.drawLine(math.cos(a) * rr, math.sin(a) * rr, math.cos(a + 0.05) * rr, math.sin(a + 0.05) * rr,
                       paint(brand.color("muted", 0.7), stroke=3))
    c.restore()


# ---------------------------------------------------------------- corner diagram (90-degree right-hander)

CORNER_CENTER = [(0.25, 1.15), (0.25, 0.45)]
CORNER_LINE = [(0.165, 1.15), (0.168, 0.74), (0.24, 0.47), (0.42, 0.335), (0.64, 0.12), (0.86, 0.068), (1.15, 0.068)]


def _corner_center(n=48):
    pts = [(0.25, 1.15), (0.25, 0.45)]
    for k in range(1, n + 1):
        a = math.pi + (math.pi / 2) * k / n
        pts.append((0.55 + 0.3 * math.cos(a), 0.45 + 0.3 * math.sin(a)))
    pts.append((1.15, 0.15))
    return pts


def el_corner(r, c, el, t, scene):
    brand = r.brand
    x, y, size = el.get("x", 90), el.get("y", 500), el.get("size", 860)
    show = set(el.get("show", ["line", "apex"]))
    mirror = el.get("mirror", False)

    def T(p):
        px, py = p
        if mirror:
            px = 1 - px
        return (x + px * size, y + py * size)

    road_w = 0.22 * size
    a = out_cubic(progress(t, 0, 0.4))
    center = poly_path([T(p) for p in _corner_center()])
    c.save()
    c.clipRect(skia.Rect(brand.safe["left"] - 90, brand.safe["top"] + 60, brand.safe["right"] + 130, brand.safe["bottom"]))
    c.drawPath(center, paint(brand.color("ink", 0.8 * a), stroke=road_w + 8, cap="butt"))
    c.drawPath(center, paint(brand.color("#1C2129", a), stroke=road_w, cap="butt"))
    if "kerb" in show or "apex" in show:
        inner = []
        for k in range(0, 33):
            ang = math.pi + (math.pi / 2) * (4 + k * 0.75) / 32
            rr = 0.3 - 0.11
            inner.append((0.55 + rr * math.cos(ang), 0.45 + rr * math.sin(ang)))
        kp = poly_path([T(p) for p in inner])
        pa = paint(brand.color("soft", a), stroke=16, cap="butt")
        pa.setPathEffect(skia.DashPathEffect.Make([22, 22], 0))
        c.drawPath(kp, paint(brand.color("ink", a), stroke=16, cap="butt"))
        c.drawPath(kp, pa)
    if "braking" in show:
        bp = out_cubic(progress(t, el.get("braking_at", 0.4), 0.4))
        bx0, by0 = T((0.25 - 0.11, 0.62))
        bx1, by1 = T((0.25 + 0.11, 0.98))
        c.drawRect(skia.Rect(bx0, by1 - (by1 - by0) * bp, bx1, by1), paint(brand.color("data", 0.22)))
        f = brand.font("mono", "bold", 26)
        if bp > 0.5:
            c.save()
            c.rotate(-90, bx1 + 34, (by0 + by1) / 2)
            draw_tracked(c, "BRAKING ZONE", bx1 + 34 - 100, (by0 + by1) / 2 + 9, f, 2, paint(brand.color("data")))
            c.restore()
    if "line" in show:
        lp = in_out(progress(t, el.get("line_at", 0.5), el.get("line_dur", 1.6)))
        path = smooth_path([T(p) for p in CORNER_LINE])
        seg, _ = partial(path, 0, lp)
        c.drawPath(seg, paint(brand.color(el.get("line_color", "accent")), stroke=9))
        if "dot" in show and lp > 0:
            pos, _ = pos_tan(path, lp)
            c.drawCircle(*pos, 15, paint(brand.color("ink")))
            c.drawCircle(*pos, 15, paint(brand.color(el.get("line_color", "accent")), stroke=5))
    if "apex" in show:
        ap = out_back(progress(t, el.get("apex_at", 1.2), 0.35), 2)
        ax, ay = T((0.42, 0.335))
        if ap > 0:
            c.drawCircle(ax, ay, 16 * ap, paint(brand.color("ink")))
            f = brand.font("mono", "bold", 30)
            draw_tracked(c, "APEX", ax + (34 if not mirror else -130), ay + 52, f, 3, paint(brand.color("ink", clamp(ap))))
    c.restore()


# ---------------------------------------------------------------- strategy stints

def el_stints(r, c, el, t, scene):
    brand = r.brand
    x, y = el.get("x", brand.safe["left"]), el.get("y", 700)
    width = el.get("width", brand.safe["right"] - brand.safe["left"])
    laps = el["laps"]
    rows = el["rows"]
    row_h = el.get("row_h", 70)
    gap = el.get("gap", 64)
    label_w = el.get("label_w", 0)
    p = in_out(progress(t, 0, el.get("draw", 1.6)))
    up_to = laps * p
    bar_x = x + label_w
    bar_w = width - label_w
    lf = brand.font("mono", "bold", 26)
    for k in range(0, laps + 1, el.get("tick", 10)):
        tx = bar_x + bar_w * k / laps
        c.drawLine(tx, y - 18, tx, y + len(rows) * (row_h + gap + 44), paint(brand.color("faint"), stroke=2))
        s = f"L{k}"
        draw_tracked(c, s, tx - lf.measureText(s) / 2, y - 30, lf, 0, paint(brand.color("muted")))
    nf = brand.font("text", "semibold", 34)
    cf = brand.font("display", "black", 34)
    for i, row in enumerate(rows):
        top = y + 30 + i * (row_h + gap + 44)
        c.drawString(row["label"], bar_x, top + 6, nf, paint(brand.color(row.get("color", "ink"))))
        for j, st in enumerate(row["stints"]):
            a, b = st["from"], min(st["to"], up_to)
            if b <= a:
                continue
            x0 = bar_x + bar_w * a / laps + (4 if j else 0)
            x1 = bar_x + bar_w * b / laps
            col = brand.color(st["compound"])
            rect = skia.Rect(x0, top + 26, max(x1, x0 + 2), top + 26 + row_h)
            c.drawRoundRect(rect, 10, 10, paint(col))
            letter = st["compound"][0].upper()
            if x1 - x0 > 60:
                c.drawString(letter, x0 + 20, top + 26 + row_h / 2 + 12, cf, paint(brand.color("bg")))
            if j > 0 and b > a:
                px = bar_x + bar_w * a / laps
                c.drawLine(px, top + 16, px, top + 36 + row_h, paint(brand.color("ink"), stroke=4))
                draw_tracked(c, f"PIT L{a}", px + 10, top + 6, lf, 1, paint(brand.color("ink")))
    for m in el.get("markers", []):
        if up_to < m["lap"]:
            continue
        mx = bar_x + bar_w * m["lap"] / laps
        h = len(rows) * (row_h + gap + 44)
        pa = paint(brand.color(m.get("color", "accent")), stroke=4)
        pa.setPathEffect(skia.DashPathEffect.Make([14, 10], 0))
        c.drawLine(mx, y - 10, mx, y + h, pa)
        draw_tracked(c, m["label"].upper(), mx + 12, y + h + 4, lf, 2, paint(brand.color(m.get("color", "accent"))))


# ---------------------------------------------------------------- line chart

def el_chart(r, c, el, t, scene):
    brand = r.brand
    x, y, w, h = el.get("x", brand.safe["left"]), el.get("y", 600), el.get("w", 860), el.get("h", 600)
    (x0, x1), (y0, y1) = el["xrange"], el["yrange"]

    def M(px, py):
        return (x + (px - x0) / (x1 - x0) * w, y + h - (py - y0) / (y1 - y0) * h)

    a = out_cubic(progress(t, 0, 0.3))
    axis = paint(brand.color("muted", a), stroke=2.5)
    c.drawLine(x, y + h, x + w, y + h, axis)
    c.drawLine(x, y, x, y + h, axis)
    lf = brand.font("mono", "bold", el.get("label_size", 28))
    if el.get("xlabel"):
        s = el["xlabel"].upper()
        draw_tracked(c, s, x + w - sum(lf.measureText(ch) + 2 for ch in s), y + h + 44, lf, 2, paint(brand.color("muted", a)))
    if el.get("ylabel"):
        draw_tracked(c, el["ylabel"].upper(), x + 14, y + 6, lf, 2, paint(brand.color("muted", a)))
    for k, sr in enumerate(el["series"]):
        path = poly_path([M(*p) for p in sr["points"]]) if not sr.get("curve", True) else smooth_path([M(*p) for p in sr["points"]])
        p = in_out(progress(t, 0.2 + k * el.get("stagger", 0.3), el.get("draw", 1.2)))
        seg, _ = partial(path, 0, p)
        col = brand.color(sr.get("color", "accent"))
        c.drawPath(seg, paint(col, stroke=sr.get("width", 7)))
        if p > 0:
            pos, _ = pos_tan(path, p)
            c.drawCircle(*pos, 10, paint(col))
            if sr.get("label") and p > 0.98:
                draw_tracked(c, sr["label"].upper(), pos[0] - sum(lf.measureText(ch) + 2 for ch in sr["label"]) , pos[1] - 26, lf, 2, paint(col))
    if el.get("note"):
        nf = brand.font("mono", "bold", el.get("note_size", 34))
        draw_tracked(c, el["note"].upper(), x, y + h + 96, nf, 2, paint(brand.color("muted", a)))


ELEMENTS = {
    "text": el_text,
    "counter": el_counter,
    "chip": el_chip,
    "bars": el_bars,
    "line": el_line,
    "arrow": el_arrow,
    "shape": el_shape,
    "callout": el_callout,
    "image": el_image,
    "car_side": el_car_side,
    "car_top": el_car_top,
    "tyre": el_tyre,
    "corner": el_corner,
    "stints": el_stints,
    "chart": el_chart,
}
