import math


def clamp(v, lo=0.0, hi=1.0):
    return lo if v < lo else hi if v > hi else v


def lerp(a, b, t):
    return a + (b - a) * t


def progress(t, start, dur):
    if dur <= 0:
        return 1.0 if t >= start else 0.0
    return clamp((t - start) / dur)


def out_cubic(t):
    return 1 - (1 - t) ** 3


def out_quart(t):
    return 1 - (1 - t) ** 4


def out_expo(t):
    return 1.0 if t >= 1 else 1 - 2 ** (-10 * t)


def in_out_cubic(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def in_cubic(t):
    return t ** 3


def out_back(t, s=1.70158):
    t -= 1
    return t * t * ((s + 1) * t + s) + 1


def out_elastic(t):
    if t <= 0 or t >= 1:
        return clamp(t)
    return 2 ** (-10 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi) / 3) + 1


EASINGS = {
    "linear": lambda t: t,
    "out_cubic": out_cubic,
    "out_quart": out_quart,
    "out_expo": out_expo,
    "in_out_cubic": in_out_cubic,
    "in_cubic": in_cubic,
    "out_back": out_back,
    "out_elastic": out_elastic,
}
