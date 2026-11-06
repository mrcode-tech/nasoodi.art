# Approved artwork and curated gallery content

**Status:** Implemented on `feature`; automated verification pending.
**Approval basis:** The site owner explicitly approved the five photographs in `specification/assets/gallery/` for public portfolio use and authorized editorial titles, descriptions, and multiple overlapping collections.

## Asset delivery

Each published image lives once in its final public location. The former specification-to-public copy step is retired. The five artwork JPEGs were moved byte-for-byte into `public/images/artworks/`; the artist-at-work hero photograph lives in `public/images/artist/`. Galleries, homepage selections, and Journal entries reuse canonical artwork IDs and do not duplicate image files.

| Canonical artwork ID | Public image path | Intended use |
|---|---|---|
| `artwork-quiet-place` | `/images/artworks/artwork-quiet-place.jpg` | Homepage, viewer, galleries, Journal references |
| `artwork-shape-of-remembering` | `/images/artworks/artwork-shape-of-remembering.jpg` | Homepage, viewer, galleries, Journal references |
| `artwork-where-light-rests` | `/images/artworks/artwork-where-light-rests.jpg` | Homepage, viewer, galleries, Journal references |
| `artwork-garden-small-moments` | `/images/artworks/artwork-garden-small-moments.jpg` | Homepage, viewer, galleries, Journal references |
| `artwork-blue-hour-within` | `/images/artworks/artwork-blue-hour-within.jpg` | Homepage, viewer, galleries, Journal references |

The studio/process hero image is stored at `/images/artist/artist-at-work.jpg`; it is not registered as a finished artwork. The editable Journal sticker SVG lives at `/images/journal/journal-announcement-sticker.svg`.

The local generator `scripts/generate-image-metadata.mjs` discovers raster images in `public/images/` and writes the path-keyed `src/content/data/image-metadata.json`. `npm run dev` runs it automatically through `predev`. Commit the generated JSON with image changes. `prebuild` runs the same script with `--check`, which verifies committed JSON against the actual files and content JSON references without modifying it. No image copying, approval inference, or fixed five-image list remains.

## Canonical artwork records

| Artwork ID | Slug | English title | Persian title |
|---|---|---|---|
| `artwork-quiet-place` | `a-quiet-place-between-seasons` | A Quiet Place Between Seasons | آرامش میان فصل‌ها |
| `artwork-shape-of-remembering` | `the-shape-of-remembering` | The Shape of Remembering | شکلِ خاطره |
| `artwork-where-light-rests` | `where-light-rests` | Where Light Rests | جایی که نور می‌آرامد |
| `artwork-garden-small-moments` | `a-garden-of-small-moments` | A Garden of Small Moments | باغ لحظه‌های کوچک |
| `artwork-blue-hour-within` | `the-blue-hour-within` | The Blue Hour Within | ساعت آبی درون |

All five records are published, rights-confirmed according to the owner's explicit approval, have English/Persian titles, descriptions, and alt text, and use one primary local image. The descriptions are concise editorial interpretations; they avoid claims about identifiable depicted subjects or unverified materials and dates. Titles and collection names are website editorial labels, not claims that the artist historically named or exhibited these series.

## Curated collections and ordered membership

| Gallery ID | Slug | English / Persian title | Ordered artwork IDs |
|---|---|---|---|
| `gallery-quiet-intervals` | `quiet-intervals` | Quiet Intervals / فاصله‌های آرام | quiet-place → where-light-rests → garden-small-moments |
| `gallery-color-conversation` | `color-in-conversation` | Color in Conversation / گفت‌وگوی رنگ‌ها | where-light-rests → shape-of-remembering → blue-hour-within |
| `gallery-fragments-memory` | `fragments-of-memory` | Fragments of Memory / پاره‌های خاطره | shape-of-remembering → garden-small-moments → blue-hour-within |
| `gallery-selected-works` | `selected-works` | Selected Works / گزیده آثار | quiet-place → shape-of-remembering → where-light-rests → garden-small-moments → blue-hour-within |

The shortened IDs in the table correspond to the full `artwork-...` IDs in the content model. Membership is stored as references to canonical artwork IDs; artworks are not duplicated. Each gallery's cover is a member of its own ordered sequence. The four collections are editorial navigation groupings created for this portfolio.

## Public routes and experience

- Homepage Selected Works uses all five canonical artwork IDs in their explicit order.
- Collection index: `/en/galleries` and `/fa/galleries`.
- Collection details: `/[locale]/galleries/quiet-intervals`, `/[locale]/galleries/color-in-conversation`, `/[locale]/galleries/fragments-of-memory`, and `/[locale]/galleries/selected-works`.
- Canonical artwork details: `/[locale]/works/[artworkSlug]`.
- The shared viewer remains `src/components/artwork-experience.tsx`; homepage and collection contexts pass their own ordered artwork arrays.

## Validation

- Content tests assert exactly five unique published artworks, all five approved source-to-public mappings, localized content, four unique published galleries, valid covers/memberships, overlap, and homepage selection.
- Browser tests cover populated English/Persian collection indexes, homepage artwork viewer opening and navigation, viewer history, collection-scoped navigation, canonical artwork detail routes, and mobile/short-height viewer visibility.
- The build pre-step copies source images before Next.js collects public assets. CI's asset audit and production route smoke test run after the build.

## Verification boundary

Automated publication and route checks can establish that the source files exist, are copied byte-for-byte, and render at the configured paths. They do not substitute for the site owner's visual review of each painting, editorial title/description, and final gallery grouping. The owner should inspect the populated pages before considering the editorial presentation finally accepted.
