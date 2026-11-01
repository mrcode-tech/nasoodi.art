#!/usr/bin/env python3
"""Render and validate the hand-authored Journal sticker SVG for CI review."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "specification/assets/journal-announcement-sticker.svg"
OUTPUT = ROOT / "artifacts/journal-announcement-sticker.png"
WIDTH, HEIGHT = 1260, 840
EXPECTED_VIEWBOX = "0 0 420 280"

svg = SOURCE.read_text(encoding="utf-8")
root = ET.fromstring(svg)
if root.tag.split("}")[-1] != "svg":
    raise SystemExit("Canonical sticker source must have an SVG root element.")
if root.attrib.get("viewBox") != EXPECTED_VIEWBOX:
    raise SystemExit(f"Expected viewBox {EXPECTED_VIEWBOX}, got {root.attrib.get('viewBox')!r}.")
if root.attrib.get("preserveAspectRatio") != "none":
    raise SystemExit("Sticker SVG must stretch to the responsive paper container with preserveAspectRatio=none.")
if re.search(r"<(?:text|image)\b", svg, flags=re.IGNORECASE):
    raise SystemExit("Sticker SVG must not contain baked text or raster images.")
if any(node.tag.split("}")[-1] in {"text", "image"} for node in root.iter()):
    raise SystemExit("Sticker SVG must not contain baked text or raster images.")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
cairosvg.svg2png(url=str(SOURCE), write_to=str(OUTPUT), output_width=WIDTH, output_height=HEIGHT)

with Image.open(OUTPUT) as image:
    image.load()
    if image.mode != "RGBA":
        raise SystemExit(f"Expected RGBA PNG with alpha channel, got {image.mode}.")
    if image.size != (WIDTH, HEIGHT):
        raise SystemExit(f"Unexpected output dimensions: {image.size}.")
    alpha = image.getchannel("A")
    if alpha.getextrema()[0] != 0 or alpha.getextrema()[1] != 255:
        raise SystemExit("PNG must preserve transparent canvas and opaque paper.")
    if alpha.getbbox() is None or alpha.getbbox() == (0, 0, WIDTH, HEIGHT):
        raise SystemExit("Sticker must be visible with transparent canvas around its silhouette.")

print(f"Rendered {OUTPUT.relative_to(ROOT)} ({WIDTH}x{HEIGHT} RGBA, transparent canvas).")
