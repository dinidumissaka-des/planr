#!/usr/bin/env python3
"""Render a storyboard.json into a vertical MP4, stills, a contact sheet and a cover."""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import time

import numpy as np
import skia

sys.path.insert(0, os.path.dirname(__file__))
from audio import mix  # noqa: E402
from draw import Brand, Renderer  # noqa: E402

STUDIO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(story_path):
    with open(os.path.join(STUDIO, "brand", "brand.json")) as f:
        brand = Brand(json.load(f))
    with open(story_path) as f:
        story = json.load(f)
    return Renderer(brand, story, os.path.dirname(os.path.abspath(story_path)))


def save_png(img, path):
    img.save(path, skia.kPNG)


def render_video(r, out, draft=False):
    music = r.story.get("meta", {}).get("music")
    if music and not os.path.isabs(music):
        music = os.path.join(r.base_dir, music)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "mix.wav")
        mix(r.sfx_events(), r.total, wav, music=music,
            music_db=r.story.get("meta", {}).get("music_db", -15), sfx_db=r.story.get("meta", {}).get("sfx_db", -3))
        cmd = [
            "ffmpeg", "-y", "-v", "error",
            "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{r.W}x{r.H}", "-r", str(r.fps), "-i", "-",
            "-i", wav,
            "-c:v", "libx264", "-preset", "veryfast" if draft else "slow", "-crf", "26" if draft else "18",
            "-maxrate", "12M", "-bufsize", "24M",
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.2",
            "-x264-params", "keyint=60:min-keyint=30",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
            "-af", "loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.84:level=false",
            "-movflags", "+faststart", "-shortest", out,
        ]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        frames = int(round(r.total * r.fps))
        t0 = time.time()
        for i in range(frames):
            img = r.frame(i / r.fps)
            proc.stdin.write(img.toarray().tobytes())
        proc.stdin.close()
        if proc.wait() != 0:
            raise SystemExit("ffmpeg failed")
    print(f"rendered {frames} frames ({r.total:.1f}s) in {time.time() - t0:.1f}s -> {out}")


def contact_sheet(r, out, every=0.5, cols=6, thumb_w=270):
    times = list(np.arange(0.05, r.total, every))
    thumb_h = int(thumb_w * r.H / r.W)
    rows = (len(times) + cols - 1) // cols
    label_h = 34
    sheet = skia.Surface(cols * thumb_w, rows * (thumb_h + label_h))
    c = sheet.getCanvas()
    c.clear(skia.Color(30, 30, 30))
    f = skia.Font(r.brand.typeface("mono", "bold"), 22)
    for k, T in enumerate(times):
        img = r.frame(float(T))
        x, y = (k % cols) * thumb_w, (k // cols) * (thumb_h + label_h)
        c.drawImageRect(img, skia.Rect(x, y, x + thumb_w, y + thumb_h), skia.SamplingOptions(skia.FilterMode.kLinear))
        scene = r.scene_at(float(T))
        c.drawString(f"{T:5.2f}s  s{scene.index}", x + 8, y + thumb_h + 25, f, skia.Paint(AntiAlias=True, Color=skia.ColorWHITE))
    save_png(sheet.makeImageSnapshot(), out)
    print(f"contact sheet {len(times)} frames -> {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("storyboard")
    ap.add_argument("--out", help="MP4 output path")
    ap.add_argument("--draft", action="store_true", help="fast low-quality encode")
    ap.add_argument("--stills", help="comma-separated times, writes PNGs next to the storyboard in stills/")
    ap.add_argument("--sheet", help="write a contact sheet PNG to this path")
    ap.add_argument("--every", type=float, default=0.5)
    ap.add_argument("--cover", help="write cover JPG to this path (uses meta.cover_time)")
    args = ap.parse_args()

    r = load(args.storyboard)
    if args.stills:
        d = os.path.join(r.base_dir, "stills")
        os.makedirs(d, exist_ok=True)
        for s in args.stills.split(","):
            T = float(s)
            p = os.path.join(d, f"t{T:05.2f}.png")
            save_png(r.frame(T), p)
            print(p)
    if args.sheet:
        contact_sheet(r, args.sheet, args.every)
    if args.cover:
        T = r.story.get("meta", {}).get("cover_time", 0.6)
        r.frame(T).save(args.cover, skia.kJPEG, 92)
        print(f"cover @ {T}s -> {args.cover}")
    if args.out:
        render_video(r, args.out, args.draft)


if __name__ == "__main__":
    main()
