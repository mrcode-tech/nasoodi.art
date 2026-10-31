# Asset review register

**Purpose:** Track the actual repository assets before they are used publicly. Presence in the repository is not, by itself, proof of rights, final classification, or artist approval.

| Repository asset | Initial classification / inspection | Public-use status | Required next action |
|---|---|---|---|
| `specification/assets/artwork.JPG` | Visually reviewed in rendered Hero QA: a 4:3 studio/process photograph showing the artist from behind, facing a canvas with a brush; it is not a standalone finished-painting reproduction. It is byte-identical to `public/images/homepage-hero.jpg` and was selected by the site owner for the initial Hero. | Owner-selected for feature-branch Hero preview; public release remains approval-gated | Describe it as an artist-at-work photograph, never as an individual painting. Confirm artist/rightsholder publication permission before production release; do not add it to the artwork registry. |
| `specification/assets/gallery/1.jpg`–`5.jpg` | Candidate gallery artwork files; individual images and identities not verified | Pending | Inspect each image; confirm artwork identity, rights, title/untitled treatment, metadata, alt text, order, and locale copy |
| `specification/assets/canvase.png` | Filename suggests a canvas/painting layer; exact image role not verified | Pending | Inspect and reconcile with the hero composition specification; do not present as a finished work without confirmation |
| `specification/assets/artist.png` | Inspected: transparent cutout showing a person from behind holding a brush; process/studio imagery, not a standalone painting | Pending | Confirm public use and approved placement; do not treat as a portrait or artwork |
| `specification/assets/easel.png` | Inspected: transparent cutout of a wooden easel | Pending | Confirm site-wide decorative use; validate original dimensions, document-relative sizing, contrast, and reduced-motion behavior |
| `specification/assets/oil-paint-brush.png` | Inspected: isolated oil-paint brush cutout; it is a studio/process prop, not a finished artwork or artist portrait | Pending | Confirm public-use rights and intended placement before use |

## Publication rules

- Do not move or transform source masters as part of the review.
- Keep original aspect ratio, orientation, color, texture, canvas edges, and signature.
- Do not crop, recolor, mirror, filter, distort, or AI-enhance artwork.
- Generate web derivatives only from an approved master, then compare them visually with that master.
- Keep rights/approval notes private; do not expose them in public HTML or structured data.
- A public artwork requires confirmed rights, approved presentation, a primary image, localized title/alt text for each exposed locale, and verified metadata.
- A gallery requires artist-approved title, description, cover, and ordered membership.


## Artwork approval reconciliation — 2026-10-31

The earlier pending classification for `specification/assets/gallery/1.jpg`–`5.jpg` is superseded by the later, explicit owner-approval record in [approved-artwork-content-inventory.md](./approved-artwork-content-inventory.md). That inventory records the five canonical artwork IDs, public image paths, localized titles/descriptions/alt text, and the site owner's approval basis. Use that inventory as the current artwork-content authority.

The remaining review requirement is visual QA of the rendered responsive presentation and final owner review of the composition; do not misstate that carousel UI implementation or its visual approval is already complete. Other assets (studio/process photographs, easel, canvas, and brush props) retain their separate classifications and must not be treated as finished artwork.
