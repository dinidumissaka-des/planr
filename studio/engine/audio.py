import subprocess
import wave

import numpy as np

SR = 48000


def _env(n, attack, release):
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 2
    e[-r:] *= np.linspace(1, 0, r) ** 2
    return e


def _onepole(x, cutoff):
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def _noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def whoosh(dur=0.32, seed=1):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    sweep = 400 + 5200 * np.sin(np.pi * t) ** 2
    x = _onepole(_noise(n, seed), sweep)
    x -= _onepole(x, 180)
    return x * _env(n, dur * 0.55, dur * 0.45) * 3.2


def swipe(seed=2):
    return whoosh(0.17, seed) * 0.7


def hit(seed=3):
    dur = 0.55
    n = int(dur * SR)
    t = np.arange(n) / SR
    freq = 42 + 78 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 7.5)
    click = _onepole(_noise(n, seed), 2500) * np.exp(-t * 90) * 2.2
    return np.tanh((body + click) * 1.6) * 0.9


def tick(seed=4):
    dur = 0.03
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 260) * 0.25


def pop(seed=5):
    dur = 0.09
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 520 + 420 * (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45) * 0.45


def beep(seed=6):
    dur = 0.16
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 880 * t) + 0.3 * np.sin(2 * np.pi * 1760 * t)
    return tone * _env(n, 0.004, 0.03) * 0.28


def riser(dur=0.9, seed=7):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    x = _onepole(_noise(n, seed), 300 + 6000 * t ** 2)
    f = 180 + 520 * t ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return (x * 1.6 + tone) * t ** 2 * 0.8


def thump(seed=8):
    return hit(seed) * 0.55


SOUNDS = {
    "whoosh": whoosh,
    "swipe": swipe,
    "hit": hit,
    "thump": thump,
    "tick": tick,
    "pop": pop,
    "beep": beep,
    "riser": riser,
}


def _load_music(path, seconds):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
        check=True, capture_output=True,
    ).stdout
    music = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(float)
    need = int(seconds * SR)
    if len(music) < need:
        music = np.tile(music, (need // len(music) + 1, 1))
    return music[:need]


def mix(events, seconds, out_path, music=None, music_db=-16.0, sfx_db=-3.0):
    n = int(seconds * SR) + SR
    bus = np.zeros(n)
    cache = {}
    for ev in events:
        name = ev["name"]
        if name not in SOUNDS:
            continue
        key = (name, ev.get("seed", 0))
        if key not in cache:
            cache[key] = SOUNDS[name](seed=ev.get("seed", 0) + 11)
        clip = cache[key] * 10 ** (ev.get("db", 0) / 20)
        start = int(max(0.0, ev["t"] - ev.get("pre", 0.0)) * SR)
        end = min(n, start + len(clip))
        bus[start:end] += clip[: end - start]
    bus = bus[: int(seconds * SR)] * 10 ** (sfx_db / 20)
    left = bus
    right = np.concatenate([np.zeros(24), bus[:-24]])
    stereo = np.stack([left, right], axis=1)
    if music:
        m = _load_music(music, seconds) * 10 ** (music_db / 20)
        fade = int(1.2 * SR)
        m[-fade:] *= np.linspace(1, 0, fade)[:, None]
        m[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]
        stereo = stereo + m
    stereo = np.tanh(stereo * 1.1) / np.tanh(1.1)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
