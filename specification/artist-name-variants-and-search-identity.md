# Artist Name Variants and Search Identity — SEO Specification

**Status:** Active technical specification  
**Scope:** Bilingual artist identity discovery (English and Persian)  
**Locales:** `en`, `fa`  
**Repository:** `mrcode-tech/nasoodi.art`  
**Branch for implementation:** `feature` only

## 1. Purpose

Define a safe, maintainable way for search engines and visitors to discover the same artist when they use legitimate alternative romanizations, spacing conventions, or Persian orthographic forms.

Persian names are commonly transliterated into English in more than one way. Differences can arise from vowel representation, consonant conventions, optional transliteration endings, word boundaries, hyphenation, and inconsistent use of Arabic/Persian characters. A visitor may also remember only one or two name components.

The objective is to associate genuine name variants with one artist entity while preserving one canonical public identity. This is an identity-resolution and editorial-data concern, not an instruction to publish keyword lists or create duplicate pages.

This document is technical documentation. It intentionally uses placeholders and synthetic examples. Actual artist identity values and approved aliases belong only in canonical editorial content.

## 2. Non-goals and governing principles

- Do not change, replace, or silently normalize the artist's approved display name.
- Do not create a landing page, route, title, heading, hidden text block, or metadata description for every spelling variant.
- Do not stuff every generated permutation into page copy, image alt text, titles, descriptions, or headings.
- Do not assume that adding an alias guarantees indexing, ranking, autocomplete, a Knowledge Panel, or a rich result.
- Do not treat arbitrary misspellings, unrelated names, or phonetic guesses as approved aliases.
- Do not infer identity facts, biography, location, career history, or affiliations from a spelling variant.
- Do not use aliases as a substitute for useful bilingual editorial content, authoritative references, or consistent entity information.
- Keep technical examples synthetic and all production identity data in the canonical content layer.

The canonical identity is authoritative. An alias is a recognized alternate written form that may reasonably refer to that same person; it is not a second identity.

## 3. Terminology

| Term | Meaning |
|---|---|
| Canonical name | The owner-approved public display name for a locale |
| Alias | An owner-approved alternate spelling or transliteration of the same name |
| Name component | A separately maintained part of a personal name, such as given, middle/patronymic, or family name |
| Transliteration | Rendering a name written in one script using another script |
| Orthographic variant | A spelling difference within the same writing system |
| Formatting variant | A difference in spaces, half-spaces, hyphens, or joining |
| Search normalization | A deterministic transformation used to compare input strings |
| Search alias inventory | The curated set of genuine alternate forms maintained with canonical artist content |
| Synthetic fixture | Non-production sample data used by automated tests |

## 4. Canonical identity and editorial source of truth

The existing artist profile record remains the single source of truth for the artist's canonical identity and biography. Before implementation, inspect the current content schema and repository adapters.

The alias inventory must be stored with the canonical artist identity in the existing artist profile data model, or in a narrowly scoped child structure owned and resolved by that same artist repository if the current schema cannot represent it cleanly.

Do not introduce a second independent artist identity record. Do not let route components, metadata helpers, JSON-LD components, or tests read the editorial JSON directly.

Required conceptual fields:

- Canonical display name for each supported locale.
- Optional curated aliases grouped by locale and name component.
- Optional complete-name aliases when the full form is a known, owner-approved variant.
- Optional alias classification and editorial notes for maintenance; these must not be rendered publicly by default.

Use the existing localized content conventions and types. Do not add fields that duplicate canonical names or create competing sources of truth.

### 4.1 Alias record model

The implementation may use a typed shape equivalent to the following. Adapt names to the actual content model rather than copying this example blindly:

```ts
type ArtistNameAlias = {
  value: string;
  locale: "en" | "fa";
  kind:
    | "transliteration"
    | "orthographic"
    | "spacing"
    | "hyphenation"
    | "component"
    | "complete-name";
  components?: Array<"given" | "middle" | "family">;
};

type ArtistIdentity = {
  canonicalName: {
    en: string;
    fa: string;
  };
  aliases: ArtistNameAlias[];
};
```

The type is illustrative, not a mandate to create a parallel model. If the current content schema already expresses localized strings and structured arrays, extend that schema minimally.

## 5. Alias taxonomy and inventory method

Build the inventory component by component, then curate complete-name forms. Do not take the full Cartesian product of every component spelling.

### 5.1 English transliteration dimensions

For each name component, review the following dimensions:

1. **Vowel representation:** alternate rendering of long and short vowel sounds, including `a`, `aa`, `o`, `ou`, `u`, and `oo` where linguistically plausible.
2. **Consonant representation:** established alternatives for sounds that do not map one-to-one between Persian and Latin scripts.
3. **Transliteration endings:** optional final `h` or other endings only where the source pronunciation and established usage support them.
4. **Consonant doubling:** single versus doubled consonants only when a real transliteration convention or observed usage supports it.
5. **Word boundaries:** joined, separated, and hyphenated forms for multi-part components.
6. **Capitalization:** case is a search-normalization concern, not a reason to store duplicate aliases.
7. **Diacritics:** normally remove or fold diacritics for comparison where safe; do not create redundant content aliases solely for case or diacritic differences.

### 5.2 Persian orthographic dimensions

For Persian input, consider:

- Arabic kaf `ك` versus Persian kaf `ک`.
- Arabic yeh `ي` versus Persian yeh `ی`.
- ZWNJ/half-space versus ordinary space versus no separator.
- Joined versus separated components.
- Optional spacing around component boundaries.
- Arabic/Persian forms of characters where Unicode normalization alone does not make them equivalent.

Do not indiscriminately remove all Persian characters or punctuation. Preserve meaningful characters and use narrowly defined normalization rules.

### 5.3 Name-component coverage

For each component, maintain:

- One canonical value.
- A small curated set of high-confidence transliterations or orthographic variants.
- A classification for why each alias exists.
- A record of whether the variant is component-only or a known complete-name form.

Do not generate complete names by blindly combining every given-name, middle-name, and family-name alias. Such multiplication produces many implausible strings and can create false associations.

### 5.4 Complete-name coverage

Complete-name aliases should be explicitly curated from plausible combinations that are known or strongly supported by real usage. Include common order and spacing differences only if they are observed or linguistically defensible.

Also support discovery by partial name components through the search-normalization and matching layer. A partial query does not need to become a complete-name alias.

### 5.5 Confidence tiers

Use editorial confidence tiers during curation:

| Tier | Definition | Handling |
|---|---|---|
| Core | Canonical form or well-established alternate transliteration | Include in curated alias inventory |
| Supported | Plausible form supported by owner knowledge or observed search usage | Include after review |
| Exploratory | Rare, uncertain, or generated-only possibility | Keep out of production aliases until evidence or owner approval |
| Rejected | Typo, unrelated name, misleading form, or unsupported guess | Do not publish or match as an alias |

Confidence is editorial metadata. It must not be exposed as a public badge or used to claim that Google recognizes the variant.

## 6. Search normalization

Normalization is for matching text supplied to an internal search feature or for deterministic alias comparison. It must not rewrite visible canonical identity, page URLs, metadata, or editorial source values.

### 6.1 English normalization

A comparison key may:

1. Apply Unicode normalization (NFKC where appropriate).
2. Convert to locale-independent lowercase.
3. Trim leading and trailing whitespace.
4. Collapse repeated whitespace.
5. Normalize equivalent hyphen and apostrophe characters.
6. Compare joined, spaced, and hyphenated forms using token-aware matching.
7. Optionally compare a punctuation-free key while retaining the original tokens.

Do not remove all vowels, apply broad phonetic algorithms without evaluation, or use edit-distance matching as the sole identity test. Broad fuzzy matching can associate unrelated people.

### 6.2 Persian normalization

A Persian comparison key may:

1. Apply Unicode normalization.
2. Map Arabic yeh `ي` to Persian yeh `ی`.
3. Map Arabic kaf `ك` to Persian kaf `ک`.
4. Normalize ZWNJ and whitespace according to a documented comparison policy.
5. Collapse repeated spaces.
6. Preserve letters and meaningful token boundaries for a second token-aware comparison.

Keep the original user input and canonical display value unchanged. The normalized key is transient and must not replace the source value.

### 6.3 Matching order

If internal search is implemented, prefer this order:

1. Exact canonical match.
2. Exact curated complete-alias match.
3. Exact normalized canonical or alias match.
4. Token-aware partial component match.
5. Optional conservative fuzzy matching, only if separately justified and tested.

A fuzzy match should return a suggestion or result ranking, not silently assert that two people are the same. If multiple artists or entities could match, present disambiguation.

### 6.4 Scope

Do not build an internal search engine solely to support Google discovery. Implement normalization only where there is a real product use case, such as a site search field or a reusable identity resolver. SEO metadata and structured data should use canonical and curated identity values without requiring runtime fuzzy matching.

## 7. Google Search and entity signals

### 7.1 Visible content

Use the canonical artist name naturally in relevant visible locations, such as the homepage introduction and About page. Use the approved Persian name on Persian pages and the approved English name on English pages.

Where editorially appropriate, the About page may explain that the artist's name is transliterated in multiple ways. Do not publish a long list of variants merely to target queries. The copy must remain useful to visitors and must be approved as editorial content.

### 7.2 Page metadata

- Page titles and descriptions use the canonical localized identity.
- Keep metadata unique, accurate, concise, and readable.
- Do not append alias lists to every title or description.
- Do not create duplicate pages or query-parameter routes for aliases.
- Canonical URLs remain the existing locale-specific URLs.
- Do not redirect a spelling query to a fabricated alias route.

### 7.3 Person structured data

The existing global Person graph is the appropriate place to represent the artist entity. Extend its data source through the artist repository.

Use:
- `name` for the canonical name in the graph's selected language/context.
- `alternateName` only for a curated, defensible set of genuine alternate names.
- `url` for the canonical artist profile URL.
- `sameAs` only for owner-confirmed official profiles or authoritative identity pages.

Do not put every generated spelling, typo, partial name, or speculative form into `alternateName`. Do not emit duplicate Person entities for each locale or spelling. Preserve stable entity identity across English and Persian pages and avoid conflicting graphs.

Structured data is a machine-readable description of visible, truthful identity information. It is not a keyword field and does not guarantee a Knowledge Panel, rich result, indexing, or ranking.

### 7.4 Cross-platform consistency

Where the artist controls a public profile, use the same canonical identity and link the official profile consistently. Never claim an external profile is official without owner confirmation. Use stable links and avoid creating new social profiles simply to cover spelling variants.

### 7.5 Search engine limitations

Search engines may understand transliteration and spelling variants without explicit alias markup, and may ignore some aliases. There is no supported mechanism that guarantees a page will rank for every spelling. Evaluate outcomes using observed query data rather than assumptions.

## 8. Content architecture and implementation boundaries

- Canonical identity and aliases are editorial data owned by the artist profile content model.
- The artist repository is the only application boundary that resolves this data.
- Structured-data generation consumes the repository result, not raw JSON.
- Route components do not import artist JSON directly.
- UI translation messages do not contain identity aliases.
- Alias data is not duplicated in page components, metadata files, constants, or tests.
- Do not create a separate SEO keyword list disconnected from the artist entity.
- Preserve the current English/Persian locale route architecture and canonical URL rules.

Before implementation, inspect the actual artist profile schema, repository functions, Person JSON-LD helper, metadata generation, and existing tests. Extend existing behavior instead of adding parallel systems.

## 9. Privacy, safety, and editorial governance

A name alias is personal identity data. Treat it as owner-controlled editorial content.

- Add only variants supplied, confirmed, or explicitly approved by the site owner/artist.
- Do not use third-party data brokers, leaked data, private records, or sensitive inferences to expand the alias list.
- Do not infer aliases from unrelated people with similar names.
- Keep private editorial notes out of rendered HTML and structured data.
- Do not add contact information, birth details, addresses, or other personal facts to improve entity matching.
- Changes to canonical identity require explicit owner approval and a review of all visible and machine-readable references.

## 10. Testing strategy

Use synthetic names and generated fixtures. Never place the production artist's actual identity or aliases in technical tests or test snapshots.

### 10.1 Unit tests

Test:

- Canonical identity is preserved exactly for display.
- Alias values are unique after normalization.
- Alias locale is valid and consistent with its script/content contract.
- Empty strings and whitespace-only aliases are rejected.
- Normalization is deterministic and idempotent.
- English case, whitespace, and hyphen variants compare as expected.
- Persian Arabic/Persian yeh and kaf variants compare as expected.
- Persian ZWNJ and spacing variants compare according to the documented policy.
- Canonical and alias values remain unchanged in source data.
- Component aliases do not automatically expand into a Cartesian product.
- Unsupported or exploratory aliases are not emitted in production structured data.
- Partial matching does not create false positive identity assertions.

### 10.2 Structured-data tests

Test:

- Exactly one stable Person entity is emitted for the artist.
- The canonical name is used for `name`.
- `alternateName` contains only approved, non-empty aliases.
- Duplicate aliases are removed using the documented comparison key.
- `sameAs` contains only explicitly configured official profiles.
- English and Persian pages refer to the same stable Person entity.
- JSON-LD is valid and safely serialized.
- Structured data agrees with the visible canonical identity.

### 10.3 Integration and browser tests

Use synthetic content to verify repository resolution and metadata output. Browser tests should assert structural behavior, not production spellings or editorial values.

Verify:

- The homepage and About page show the correct locale's canonical identity from the artist repository.
- Metadata uses canonical names and does not contain a keyword-stuffed alias list.
- The Person graph is present once and uses the stable identifier.
- Locale alternates and canonical URLs remain correct.
- No alias-specific duplicate routes are generated.
- No hidden keyword blocks are rendered.
- Existing artwork, gallery, Journal, Contact, and CV SEO behavior is unchanged.

### 10.4 Test independence

Tests must not depend on the current number of aliases, exact production spellings, or current editorial records. Build synthetic fixtures with zero, one, and multiple aliases. Keep content-integrity tests separate from behavior tests.

## 11. Measurement and maintenance

After launch authorization and Search Console property verification:

- Review actual queries in Google Search Console, including queries with partial name components and alternate transliterations.
- Record impressions, clicks, CTR, average position, and landing page for relevant queries.
- Compare English and Persian query patterns independently.
- Add a new alias only when it is a genuine variant supported by observed usage or owner confirmation.
- Remove aliases that are misleading, unrelated, or no longer approved.
- Revalidate Person JSON-LD after alias changes.
- Avoid reacting to small-volume query fluctuations or promising a ranking outcome.

Search Console query reports are sampled and may omit low-volume queries. Absence from a report does not prove that a variant is never searched.

## 12. Rollout and implementation sequence

1. Audit the existing artist profile schema and repository.
2. Audit the existing Person graph and all call sites.
3. Confirm the canonical name values and proposed alias inventory with the owner/artist in the editorial data layer.
4. Define a minimal typed alias structure that fits the existing content model.
5. Add curated aliases without changing canonical display values.
6. Extend the Person graph to emit a conservative `alternateName` set.
7. Add synthetic unit and integration tests.
8. Verify rendered English and Persian production HTML and JSON-LD.
9. Verify no duplicate routes, keyword blocks, or metadata stuffing were introduced.
10. After explicit launch authorization, monitor real query data and refine aliases based on evidence.

Do not combine this work with a redesign, route migration, broad SEO rewrite, analytics-provider change, or deployment.

## 13. Acceptance criteria

- [ ] Canonical English and Persian display names remain unchanged.
- [ ] Actual identity and alias values exist only in canonical editorial data, not technical specifications or tests.
- [ ] Aliases are curated and owner-approved, not generated from every possible permutation.
- [ ] Alias data is resolved through the existing artist repository.
- [ ] No second artist identity source is introduced.
- [ ] English and Persian normalization is deterministic and narrowly scoped.
- [ ] Normalization never rewrites visible identity, canonical URLs, or source data.
- [ ] Person JSON-LD uses one stable entity and a conservative `alternateName` list.
- [ ] `sameAs` includes only owner-confirmed official destinations.
- [ ] No alias-specific pages, hidden keyword blocks, or keyword-stuffed metadata are added.
- [ ] Synthetic tests cover normalization, alias curation, locale behavior, and JSON-LD.
- [ ] Existing localized canonical, hreflang, sitemap, and route behavior remains unchanged.
- [ ] Rendered English and Persian pages are inspected after implementation.
- [ ] Search performance claims are based on Search Console evidence, not assumptions.

## 14. References

- Google Search Central — SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central — Structured Data General Guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central — Introduction to Structured Data: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google Search Central — Localized Versions and hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Schema.org — Person: https://schema.org/Person
- Schema.org — alternateName: https://schema.org/alternateName
- Unicode — Normalization Forms: https://unicode.org/reports/tr15/
- Unicode — Persian language and script resources: https://www.unicode.org/faq/iranian.html
- Next.js — Metadata API: https://nextjs.org/docs/app/getting-started/metadata-and-og-images

