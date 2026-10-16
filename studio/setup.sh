#!/usr/bin/env bash
# Installs what the DOWNFORCE render engine needs. Safe to re-run.
set -euo pipefail

if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg is required (apt-get install ffmpeg / brew install ffmpeg)" >&2
  exit 1
fi

if ! python3 -c "import skia" 2>/dev/null; then
  if command -v apt-get >/dev/null && [ "$(id -u)" = "0" ]; then
    apt-get update -qq && apt-get install -y -qq libegl1 libgl1 fonts-inter fonts-dejavu-core >/dev/null || true
  fi
  python3 -m pip install -q skia-python numpy pillow 2>/dev/null \
    || python3 -m pip install -q --break-system-packages skia-python numpy pillow
fi

python3 -c "import skia, numpy; print('skia', skia.__version__, '| numpy', numpy.__version__)"
for f in /usr/share/fonts/opentype/inter/InterDisplay-Black.otf /usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf; do
  [ -f "$f" ] || echo "missing font: $f (update studio/brand/brand.json fonts)" >&2
done
