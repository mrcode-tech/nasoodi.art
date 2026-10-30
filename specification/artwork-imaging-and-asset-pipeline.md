# Artwork Imaging, Asset Governance, and Delivery

**Status:** Proposed implementation contract

## Purpose
The paintings are the portfolio's primary evidence of the artist's practice. Image fidelity, provenance, and approval take priority over decorative presentation or aggressive optimization.

## Asset classes
| Class | Role | Rule |
|---|---|---|
| Artwork master | Full painting reproduction | Preserve untouched archival original |
| Artwork derivative | Gallery/detail delivery | Generate from master; compare visually |
| Artwork detail | Brushwork, impasto, signature, surface | Link to parent artwork and label as detail |
| Installation image | Painting in a room/frame | Context only; never substitute for full work |
| Studio/process | Artist at work, easel, studio | Separate from artwork catalogue |
| Artist portrait | Approved portrait | Do not infer portrait status from process image |
| Social/press crop | Approved promotional use | Review crop and usage rights separately |

The repository currently contains artist, easel, brush, canvas, artwork, and gallery assets. Presence in the repository does not prove ownership, publication rights, final classification, or artist approval. Inspect and approve every asset individually.

## Capture standards
- Photograph paintings straight-on with the camera sensor parallel to the artwork.
- Use even, neutral, high-CRI lighting; avoid glare, reflections, mixed color temperature, and hard shadows.
- Use a tripod, accurate focus, low ISO, and a lens that avoids perspective distortion.
- Include all canvas edges and signature where present.
- Capture a color reference/grey card when practical; document any color correction.
- Capture separate close-ups when brushwork or impasto materially benefits from detail viewing.
- Retain original capture files and known color profiles.

Do not claim calibration unless a documented calibration process occurred. Phone photographs may be temporary editorial sources after review, not silently designated archival masters.

## Intake and provenance record
For every asset, record:
- Stable asset ID and linked artwork/studio record.
- Original filename, source, dimensions, format, color profile if known.
- Creator/photographer and ownership or license basis.
- Allowed uses: site, artwork detail, social preview, press download, etc.
- Artist approval state, approver, date, and any restrictions.
- Crop/retouch notes, derivative settings, output paths, and source checksum where practical.
- Localized alt text and informative/decorative classification.

Keep internal rights notes and private source metadata out of public HTML and structured data.

## Derivative and delivery policy
Generate responsive AVIF/WebP derivatives from the approved master, with a suitable fallback. Starting widths may include roughly 480 px, 800 px, and 1400–1800 px, adjusted to actual display sizes and source resolution. Never upscale unnecessarily or use a derivative as the source for another derivative.

For oil paintings, compare output against the master at 100% and normal display size. Reject visible banding, ringing, color shifts, lost brush texture, crushed shadows, or clipped highlights. Increase quality or use a less aggressive format when needed.

- Preserve aspect ratio and provide intrinsic dimensions/aspect ratio to prevent layout shift.
- Prioritize only the actual above-the-fold hero asset.
- Lazy-load below-the-fold artwork.
- Do not download full-resolution masters for every gallery thumbnail.
- Use semantic image elements for meaningful art; avoid CSS backgrounds for content images.
- Use neutral placeholders and honest unavailable states.
- Never apply filters, overlays, blend modes, AI enhancement, generative fill, or artificial sharpening to artwork.

## Display and alt text
Do not crop signatures, canvas edges, frames, or meaningful composition without approval. Do not mirror, tint, or distort artwork in Persian RTL. Alt text briefly describes visible content; it is not a title, interpretation, or keyword list. Keep title/caption and alt text distinct. Decorative hero layers may use empty alt when one accessible composite description or nearby text conveys the meaning.

## Suggested asset organization
Adapt to the repository's real conventions; do not move existing assets without checking references.

~~~text
public/images/
  studio/
  artworks/<stable-artwork-id>/
  artist/
  social/
~~~

Use stable IDs independent of artist-facing titles. Avoid ambiguous names such as final-final2.jpg.

## Approval checklist
- [ ] Source and public-use rights confirmed.
- [ ] Asset class and related content record confirmed.
- [ ] Artist approves image, crop, caption, and public use.
- [ ] Derivatives generated from original master.
- [ ] Color and texture fidelity reviewed.
- [ ] Alt text reviewed for each published locale.
- [ ] Responsive crop and loading behavior checked.
- [ ] No private metadata or rights notes exposed.
- [ ] Missing-image state tested.

## Design-engineering and presentation refinement

The image pipeline must support the visual quality contract in design-engineering-skills.md and design-direction-and-system-refinement.md.

- Artworks are the dominant content; presentation must preserve source color, texture, orientation, signature, ratio, and approved crop.
- The layout must adapt to portrait, landscape, square, and unusually long artwork without forcing a uniform crop or distorted thumbnail.
- Use responsive derivatives with explicit dimensions and stable aspect-ratio reservation to prevent layout shift.
- Do not animate, zoom, tilt, filter, blur, or parallax artwork for decoration.
- Image loading priority must reflect actual visual prominence; do not eagerly load every gallery image.
- Validate derivatives against the approved master at realistic display sizes and across high-density/mobile displays.
- If a composition cannot preserve the complete artwork, use contain or an alternative editorial layout rather than cropping the work.


## Runtime source-path contract

Published artwork image records must resolve to root-relative paths served by the Nasoodi.art application. Remote absolute/protocol-relative URLs, path traversal, encoded separators, backslashes, query strings, fragments, and control characters are not valid image sources. The runtime publication gate enforces this for the primary image; derivative generation and source-to-derivative comparison must continue to use the approved local master. This validation does not establish image rights or artist approval.
