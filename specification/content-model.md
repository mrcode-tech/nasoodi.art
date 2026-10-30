# Nasoodi.art — Content and Artwork Model

**Status:** Proposed content contract

This document defines the minimum structured content required to publish a trustworthy artist portfolio. It intentionally separates verified facts from optional or unknown fields.

## 1. Content principles

- Artist-approved content is authoritative.
- Do not infer artwork titles, dates, dimensions, series, or availability.
- Missing values remain absent; do not render fake labels such as “2025” or “Oil on canvas” as defaults.
- English and Persian content are separate editorial values. Do not assume a literal translation is artist-approved.
- Original image assets and web derivatives must be traceable to their source.
- Every public image must have an approved usage basis and meaningful alternative text when informative.

## 2. Artist profile

| Field | Required to launch | Notes |
|---|---:|---|
| Public English name | Yes | Confirm exact transliteration with artist |
| Persian name | Yes for Persian experience | Supplied: غزاله عبداله زاده نسودی |
| Discipline | Yes | Supplied: oil painter |
| Location | Optional display | “Iran” supplied; no city/address inferred |
| Short introduction | Yes | Artist-approved, not fabricated |
| Artist statement | Recommended | First person, distinct from biography |
| Biography | Recommended | Factual, third person |
| Portrait/studio image | No | Only if supplied and approved |
| Instagram URL | Yes if social link displayed | Supplied profile URL |
| Contact email | Required only if email contact is offered | Must be confirmed |
| CV/exhibitions | Optional | Publish only verified entries |

## 3. Artwork record

A work may be published with only the fields that are known and approved. Suggested conceptual shape:

```ts
type LocalizedText = {
  fa?: string;
  en?: string;
};

type ArtworkAvailability =
  | "available"
  | "sold"
  | "reserved"
  | "not-for-sale"
  | "undisclosed";

type ArtworkImage = {
  src: string;
  alt: LocalizedText;
  role: "primary" | "detail" | "installation";
  width: number;
  height: number;
  credit?: string;
};

type Artwork = {
  slug: string;
  title: LocalizedText;
  year?: number;
  medium?: LocalizedText;
  dimensions?: {
    height: number;
    width: number;
    depth?: number;
    unit: "cm" | "mm" | "in";
  };
  seriesSlug?: string;
  description?: LocalizedText;
  availability?: ArtworkAvailability;
  images: ArtworkImage[];
  featured?: boolean;
  sortOrder?: number;
  rightsConfirmed: boolean;
};
```

This is a conceptual contract, not a requirement to adopt this exact TypeScript shape. Implementation must validate records and avoid exposing internal rights notes.

### Artwork validation rules

- `slug` must be unique, stable, URL-safe, and not derived from an unapproved title.
- At least one primary image is required for a public artwork.
- The primary image must have a meaningful localized alt text or an explicitly reviewed equivalent.
- Dimensions must be positive and use one declared unit.
- Year must be a valid year and must be artist-confirmed.
- Medium must describe the actual work; “oil painting” at artist level does not prove every work's substrate or exact medium.
- `rightsConfirmed` must be true before publication.
- An availability label is shown only when the artist wants it public and can keep it current.
- A sold work may remain in the archive if the artist approves.
- Never show a price field until pricing and currency policy are agreed.

## 4. Series record

```ts
type ArtworkSeries = {
  slug: string;
  title: LocalizedText;
  introduction?: LocalizedText;
  coverArtworkSlug?: string;
  artworkSlugs: string[];
  yearRange?: {
    start: number;
    end?: number;
  };
  sortOrder?: number;
};
```

Use series only when the artist recognizes a meaningful body of work. Do not create artificial categories solely to fill a navigation menu.

## 5. CV entries

Suggested categories:

- Solo exhibitions
- Group exhibitions
- Education
- Awards and grants
- Residencies
- Publications and press
- Collections

Each entry should include a date/year, title, organizer/venue, location, category, and optional source/reference. Include only fields that are known. Sort reverse chronologically. Do not create a CV page with invented entries.

## 6. Image asset workflow

1. Receive original source file and source/ownership confirmation.
2. Record artist, artwork slug, original filename, source dimensions, and usage approval.
3. Preserve an untouched master outside the generated web derivatives.
4. Create responsive derivatives; retain a high-quality detail source if approved.
5. Inspect crop, color, contrast, sharpness, and texture against the original.
6. Write localized alt text describing visible content; do not infer emotional meaning or symbolism.
7. Approve the final image and caption with the artist.
8. Publish and verify on mobile, tablet, and desktop.

Recommended capture practices for physical paintings:

- Photograph straight-on to avoid perspective distortion.
- Use even, neutral lighting and a consistent white balance.
- Avoid glare, reflections, strong shadows, and color casts.
- Include a clean full-work image; add close-up details only when useful.
- Do not use a social-media screenshot as the master when the original file is available.

## 7. Alt text guidance

Alt text should describe the visual content accurately and briefly. It should not be keyword stuffing, a full artist statement, or an interpretation presented as fact.

Examples below are format examples only, not descriptions of Ghazaleh's actual work:

- English: “Oil painting showing a seated figure beside a window, with warm ochre and muted blue tones.”
- Persian: «نقاشی رنگ‌روغن از پیکره‌ای نشسته کنار پنجره با طیف‌های اخرایی و آبی ملایم.»

For decorative interface imagery, use empty alt text. For a complex artwork, the visible caption and surrounding description may provide additional context.

## 8. Bilingual editorial rules

- Keep a Persian and English value for page titles, descriptions, artwork titles, series titles, and meaningful captions when available.
- Do not publish a blank or machine-generated translation as if it were approved.
- Preserve the artist's chosen spelling of her name across title tags, page headings, social links, and structured data.
- Use Persian numerals only if the artist prefers them; be consistent across the Persian experience.
- Keep dimensions and units unambiguous.
- Isolate Latin URLs, email addresses, and English names within RTL text to prevent bidirectional display errors.

## 9. Editorial states

Recommended internal workflow states:

- `draft` — incomplete, not public.
- `needs-artist-review` — content or image awaiting confirmation.
- `approved` — artist approved public presentation.
- `published` — publicly available.
- `archived` — removed from primary selection but retained if approved.

Only approved content may be published. The first implementation may represent these states through repository review rather than a CMS workflow.


## 10. Curated gallery record

A Gallery is a named, localized collection of published artwork. It is distinct from an artist-defined series, exhibition, or venue. One artwork may belong to multiple galleries without duplicating its canonical record.

```ts
type GalleryStatus = "draft" | "needs-artist-review" | "approved" | "published" | "archived";

type Gallery = {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  coverArtworkId: string;
  artworkIds: string[]; // curated order; no duplicates
  sortOrder: number;
  featuredOnHome?: boolean;
  status: GalleryStatus;
  seo?: { title?: LocalizedText; description?: LocalizedText };
};

type HomepageSelection = {
  heroArtworkId: string;
  featuredArtworkIds: string[];
  featuredGalleryIds: string[];
};
```

This is a conceptual contract; reconcile field names with the repository's existing types before implementation. Use one source of truth for artwork-gallery membership and preserve per-gallery order. Do not embed duplicate artwork records in galleries.

### Gallery publication validation

- IDs and slugs are unique and stable.
- A published gallery has approved localized title and short description for each exposed locale.
- Its cover artwork belongs to the gallery and is itself published, approved, and rights-cleared.
- It contains at least one valid published artwork.
- Every artwork reference resolves; no duplicate IDs occur within one gallery.
- The public page, sitemap, and metadata exclude draft, review, archived, and empty galleries.
- A gallery's removal or archival never deletes its artworks or original assets.

### Homepage selection validation

- Hero artwork, featured artwork, and featured gallery selections use canonical IDs, never filenames or array indexes.
- Every selected item must be published and rights-approved.
- Featured order is explicit and deterministic.
- A hero artwork should not repeat in Featured Works unless the editorial configuration explicitly permits it.
- A featured gallery must have a valid cover and at least one published artwork.

### Gallery editorial fields

Gallery title and description are separate approved Persian and English values. The description should be concise (normally one to three sentences), accurate, and written or approved by the artist. Do not invent titles, descriptions, themes, chronology, or artwork groupings from filenames or visual guesses.
