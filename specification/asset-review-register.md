# Asset review register

**Purpose:** Track the actual repository assets before they are used publicly. Presence in the repository is not, by itself, proof of rights, final classification, or artist approval.

| Repository asset | Initial classification / inspection | Public-use status | Required next action |
|---|---|---|---|
| `public/images/artist/artist-at-work.jpg` | Studio/process photograph showing the artist from behind, facing a canvas with a brush; not a standalone finished-painting reproduction. It was byte-identical to the former specification and root-level public copies. | Owner-selected for the feature-branch Hero preview; production rights/artist-approval gate remains open. | Describe it factually as an artist-at-work photograph, never as an individual painting. Confirm rights before production release; do not add it to the artwork registry. |
| `public/images/artworks/artwork-quiet-place.jpg` through `artwork-blue-hour-within.jpg` | Five artwork images associated with canonical artwork records in `approved-artwork-content-inventory.md`. | Owner-approved for the portfolio content represented by those records. | Preserve source bytes and aspect ratio; complete populated responsive visual review before release. |
| `specification/assets/canvase.png` | Filename suggests a canvas/painting layer; exact image role not verified. | Design reference only; not served by the application. | Inspect and reconcile with the hero composition specification; do not present as a finished work without inspection. |
| `specification/assets/artist.png` | Transparent cutout showing a person from behind holding a brush; process/studio imagery, not a conventional portrait. | Design reference only; not served by the application. | Confirm public-use rights and intended placement before moving it into `public/images/artist/`. |
| `specification/assets/easel.png` | Transparent cutout of a wooden easel. | Design reference only; not served by the application. | Confirm public-use rights and intended decorative placement before publication. |
| `specification/assets/oil-paint-brush.png` | Isolated oil-paint brush cutout; a studio/process prop, not a finished artwork or artist portrait. | Design reference only; not served by the application. | Confirm public-use rights and intended placement before publication. |

## Publication rules

- Do not move or transform source masters as part of the review.
- Keep original aspect ratio, orientation, color, texture, canvas edges, and signature.
- Do not crop, recolor, mirror, filter, distort, or AI-enhance artwork.
- Generate web derivatives only from an approved master, then compare them visually with that master.
- Keep rights/approval notes private; do not expose them in public HTML or structured data.
- A public artwork requires confirmed rights, approved presentation, a primary image, localized title/alt text for each exposed locale, and verified metadata.
- A gallery requires artist-approved title, description, cover, and ordered membership.


## Artwork approval reconciliation — 2026-10-31

The earlier pending classification for `public/images/artworks/artwork-quiet-place.jpg`–`5.jpg` is superseded by the later, explicit owner-approval record in [approved-artwork-content-inventory.md](./approved-artwork-content-inventory.md). That inventory records the five canonical artwork IDs, public image paths, localized titles/descriptions/alt text, and the site owner's approval basis. Use that inventory as the current artwork-content authority.

The remaining review requirement is visual QA of the rendered responsive presentation and final owner review of the composition; do not misstate that carousel UI implementation or its visual approval is already complete. Other assets (studio/process photographs, easel, canvas, and brush props) retain their separate classifications and must not be treated as finished artwork.
