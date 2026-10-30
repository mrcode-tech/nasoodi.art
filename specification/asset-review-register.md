# Asset review register

**Purpose:** Track the actual repository assets before they are used publicly. Presence in the repository is not, by itself, proof of rights, final classification, or artist approval.

| Repository asset | Initial classification / inspection | Public-use status | Required next action |
|---|---|---|---|
| `specification/assets/artwork.JPG` | Named as the initial homepage hero candidate in the homepage specification; image pixels not independently verified in this implementation session | Pending | Inspect source image, verify it is a clean finished-painting reproduction, and obtain explicit hero/publication approval |
| `specification/assets/gallery/1.jpg`–`5.jpg` | Candidate gallery artwork files; individual images and identities not verified | Pending | Inspect each image; confirm artwork identity, rights, title/untitled treatment, metadata, alt text, order, and locale copy |
| `specification/assets/canvase.png` | Filename suggests a canvas/painting layer; exact image role not verified | Pending | Inspect and reconcile with the hero composition specification; do not present as a finished work without confirmation |
| `specification/assets/artist.png` | Inspected: transparent cutout showing a person from behind holding a brush; process/studio imagery, not a standalone painting | Pending | Confirm public use and approved placement; do not treat as a portrait or artwork |
| `specification/assets/easel.png` | Inspected: transparent cutout of a wooden easel | Pending | Confirm site-wide decorative use; validate original dimensions, document-relative sizing, contrast, and reduced-motion behavior |
| `specification/assets/oil-paint-brush.png` | File present; image pixels not inspected | Pending | Inspect role and approve any use |

## Publication rules

- Do not move or transform source masters as part of the review.
- Keep original aspect ratio, orientation, color, texture, canvas edges, and signature.
- Do not crop, recolor, mirror, filter, distort, or AI-enhance artwork.
- Generate web derivatives only from an approved master, then compare them visually with that master.
- Keep rights/approval notes private; do not expose them in public HTML or structured data.
- A public artwork requires confirmed rights, approved presentation, a primary image, localized title/alt text for each exposed locale, and verified metadata.
- A gallery requires artist-approved title, description, cover, and ordered membership.
