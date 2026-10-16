#!/usr/bin/env python3
"""Mechanical quality gate for a storyboard. Errors block rendering; warnings go to QA."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from draw import CAMERA_MAX_ZOOM, ELEMENTS, Brand, text_bbox  # noqa: E402

STUDIO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BANNED = [
    "dive in", "dive into", "deep dive", "game changer", "game-changer", "in the world of", "buckle up",
    "you won't believe", "mind-blowing", "mind blowing", "let's", "lets go", "did you know", "unleash",
    "revolutionary", "secret sauce", "ever wondered", "here's why", "here's the thing", "smash that",
    "like and subscribe", "the answer will shock you", "insane", "crazy", "literally", "epic",
]
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿️]")
MAX_WPS = 3.6
DISPLAY_MAX_WORDS = 10
BODY_MAX_WORDS = 16


def words(text):
    return len(re.sub(r"[*\[\]]", "", text).split())


def element_texts(el):
    if el["type"] in ("text", "chip", "callout"):
        yield el.get("text", "")
    if el["type"] == "arrow" and el.get("label"):
        yield el["label"]
    if el["type"] == "bars":
        for it in el["items"]:
            yield it["label"]


def zoomed(box, camera, w=1080, h=1920):
    z = CAMERA_MAX_ZOOM.get(camera, 1.0)
    pad = 10 if camera == "drift" else 0
    x0, y0, x1, y1 = box
    return (w / 2 + (x0 - w / 2) * z - pad, h / 2 + (y0 - h / 2) * z,
            w / 2 + (x1 - w / 2) * z + pad, h / 2 + (y1 - h / 2) * z)


def drawing_bbox(el):
    """Approximate extents of non-text drawings, from the engine's unit geometry."""
    kind = el["type"]
    if kind == "car_top" and not el.get("rot") and not el.get("move") and "slipstream" not in el.get("show", []):
        s, cx, cy = el.get("scale", 0.9), el.get("x", 540), el.get("y", 900)
        return cx - 180 * s, cy - 500 * s, cx + 180 * s, cy + 465 * s
    if kind == "car_side" and not el.get("rake"):
        s, cx, cy = el.get("scale", 0.8), el.get("x", 540), el.get("y", 900)
        bottom = cy + 90 * s + (190 * s if "downforce" in el.get("show", []) else 0)
        return cx - 500 * s, cy - 100 * s, cx + 500 * s, bottom
    if kind == "bars":
        n = len(el["items"])
        y = el.get("y", 700)
        h = n * (el.get("bar_h", 64) + 56) + (n - 1) * (el.get("gap", 70) - 4)
        return el.get("x", 90), y, el.get("x", 90) + el.get("width", 860), y + h
    return None


def lint(path):
    with open(os.path.join(STUDIO, "brand", "brand.json")) as f:
        brand = Brand(json.load(f))
    with open(path) as f:
        story = json.load(f)
    safe = brand.safe
    errors, warnings = [], []
    scenes = story.get("scenes", [])
    if not scenes:
        return ["no scenes"], []
    total = sum(s["dur"] for s in scenes)
    if not 15 <= total <= 60:
        errors.append(f"total length {total:.1f}s is outside 15-60s")
    elif not 22 <= total <= 45:
        warnings.append(f"total length {total:.1f}s is outside the 22-45s sweet spot")

    first = scenes[0]
    if first["dur"] > 3.2:
        errors.append(f"hook scene is {first['dur']}s; the hook must land and move on within 3.2s")
    if not any(e["type"] in ("text", "counter") and e.get("at", 0) <= 0.15 for e in first.get("elements", [])):
        errors.append("first frame has no text: the hook must be on screen by 0.15s (no fade from black)")

    t_cursor = 0.0
    for i, s in enumerate(scenes):
        where = f"scene {i} @ {t_cursor:.1f}s"
        if not 0.8 <= s["dur"] <= 7.0:
            errors.append(f"{where}: duration {s['dur']}s outside 0.8-7s")
        beats = sorted({0.0, s["dur"]} | {e.get("at", 0.0) for e in s.get("elements", [])} | {e["until"] for e in s.get("elements", []) if "until" in e})
        longest = max(b - a for a, b in zip(beats, beats[1:])) if len(beats) > 1 else s["dur"]
        if longest > 3.0:
            warnings.append(f"{where}: nothing new appears for {longest:.1f}s - add a beat or cut")
        scene_words = 0
        for j, el in enumerate(s.get("elements", [])):
            w_el = f"{where} el {j} ({el['type']})"
            if el["type"] not in ELEMENTS:
                errors.append(f"{w_el}: unknown element type")
                continue
            for txt in element_texts(el):
                low = txt.lower()
                for b in BANNED:
                    if re.search(r"\b" + re.escape(b) + r"\b", low):
                        errors.append(f"{w_el}: banned phrase '{b}' in {txt!r}")
                if EMOJI.search(txt):
                    errors.append(f"{w_el}: emoji in on-screen text {txt!r}")
                scene_words += words(txt)
            if el["type"] == "text":
                n = words(el["text"])
                limit = DISPLAY_MAX_WORDS if el.get("font", "display") == "display" else BODY_MAX_WORDS
                if n > limit:
                    errors.append(f"{w_el}: {n} words in one text block (max {limit}) - split it")
                visible = min(el.get("until", s["dur"]), s["dur"]) - el.get("at", 0.0)
                if visible > 0 and n / visible > MAX_WPS:
                    errors.append(f"{w_el}: {n} words visible for {visible:.2f}s = {n / visible:.1f} words/s (max {MAX_WPS})")
                x0, y0, x1, y1 = zoomed(text_bbox(brand, el), s.get("camera", "push"))
                if x0 < safe["left"] - 2 or x1 > safe["right"] + 2 or y0 < safe["top"] + 60 or y1 > safe["bottom"]:
                    errors.append(f"{w_el}: text box ({x0:.0f},{y0:.0f})-({x1:.0f},{y1:.0f}) leaves the safe zone {safe}")
                if el.get("size", 96) < 34:
                    errors.append(f"{w_el}: text size {el.get('size')} is unreadable on a phone (min 34)")
            box = drawing_bbox(el)
            if box:
                x0, y0, x1, y1 = zoomed(box, s.get("camera", "push"))
                if x0 < safe["left"] - 40 or x1 > safe["right"] + 40 or y0 < safe["top"] + 60 or y1 > safe["bottom"]:
                    errors.append(f"{w_el}: drawing ({x0:.0f},{y0:.0f})-({x1:.0f},{y1:.0f}) leaves the safe zone {safe}")
            if el["type"] == "chart" and not el.get("note") and not el.get("source"):
                errors.append(f"{w_el}: chart needs a 'note' (e.g. 'illustrative') or a 'source'")
        if scene_words / s["dur"] > MAX_WPS + 0.6:
            warnings.append(f"{where}: {scene_words} words in {s['dur']}s is a lot to read")
        t_cursor += s["dur"]

    meta = story.get("meta", {})
    if "cover_time" not in meta:
        warnings.append("meta.cover_time not set - cover will use 0.6s")
    if not meta.get("loop"):
        warnings.append("meta.loop not set - say how the last frame loops back into the first")
    return errors, warnings


def main():
    errors, warnings = lint(sys.argv[1])
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    print(f"{len(errors)} errors, {len(warnings)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
