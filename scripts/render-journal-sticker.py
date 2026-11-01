#!/usr/bin/env python3
"""Render and validate the hand-authored Journal sticker SVG for CI review."""
from pathlib import Path
import re

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "specification/assets/journal-announcement-sticker.svg"
OUTPUT = ROOT / "artifacts/journal-announcement-sticker.png"
WIDTH = 1260

svg = SOURCE.read_text(encoding="utf-8")
if re.search(r"<(?:text|image)\b", svg, flags=re.IGNORECASE):
    raise SystemExit("Sticker SVG must not contain baked text or raster images.")
if not re.search(r"<svg[^>]*viewBox=", svg):
    raise SystemExit("Sticker SVG must declare a viewBox.")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
cairosvg.svg2png(url=str(SOURCE), write_to=str(OUTPUT), output_width=WIDTH)

with Image.open(OUTPUT) as image:
    image.load()
    if image.mode != "RGBA":
        raise SystemExit(f"Expected RGBA PNG with alpha channel, got {image.mode}.")
    if image.width != WIDTH or image.height != 840:
        raise SystemExit(f"Unexpected output dimensions: {image.size}.")
    alpha = image.getchannel("A")
    if alpha.getextrema()[0] != 0 or alpha.getextrema()[1] != 255:
        raise SystemExit("PNG must preserve transparent canvas and opaque paper.")
    if alpha.getbbox() is None:
        raise SystemExit("Rendered sticker is empty.")

print(f"Rendered {OUTPUT.relative_to(ROOT)} ({WIDTH}x840 RGBA, transparent background).")
