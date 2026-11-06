# Testing, Visual QA, and Release Acceptance

## 1. Verification principles

Automated tests verify stable technical contracts and observable application behavior. They must not encode the current editorial dataset as a permanent product requirement.

Adding, removing, renaming, translating, reordering, or replacing an editorial record must not break unrelated application tests.

Separate:
- Content integrity tests: validate schema, types, required technical fields, stable IDs, safe asset references, uniqueness, valid relationships, publication mechanics, and route safety.
- Application behavior tests: validate rendering, navigation, localization, pagination, sorting, accessibility, responsive behavior, metadata, and interaction contracts.
- Editorial review: remains a content workflow, not a technical CI gate.

## 2. Test layers

- Static: ESLint, TypeScript, message-catalog parity, source audits, and content-independence audits.
- Unit: pure pagination, sorting, locale formatting, URL/path safety, metadata, and repository behavior using generated data.
- Integration: repositories, localized route resolution, metadata, and structured data using synthetic records.
- Browser: navigation, RTL/LTR, responsive layouts, pagination, carousel/viewer interactions, optional content, accessibility, and localized metadata.
- Build/smoke: production build and localized server responses.

## 3. Test-data policy

- Prefer deterministic synthetic fixtures and fixture factories based on production domain types.
- Use generic IDs and synthetic localized titles; never copy production editorial values into assertions.
- Generate datasets of different sizes to test boundaries and pagination.
- Cover empty, singleton, multi-record, missing-optional-field, published, and unpublished cases.
- Include long English and Persian text and varied image aspect ratios for layout tests.
- Do not create a parallel application content model or a production fallback dataset.
- Browser smoke tests may visit production-backed routes, but must assert structure and behavior rather than particular editorial values or fixed content counts.

## 4. Stable technical assertions

Assert observable behavior:
- A route returns the expected status.
- A page has one visible main landmark and a page heading.
- Locale and direction attributes match the route.
- A card renders a title from its bound data.
- A detail link resolves to the same canonical record.
- Pagination respects the selected page size and moves to a distinct slice.
- Sorting produces the expected order for generated records.
- A carousel or viewer navigates when multiple items exist.
- Metadata is present, valid, localized, and derived from the resolved route/content.
- Optional images and fields are handled gracefully.
- Layout does not overflow at supported viewport sizes.

Do not assert production artwork, collection, Journal, or CV counts; actual editorial titles, names, biography, contact values, or publication dates; specific production slugs, IDs, or image filenames; or the identity of the current newest record.

Exact counts remain appropriate for fixed UI contracts (for example, a defined set of page-size options or a two-line menu icon), not editorial collections.

## 5. Pagination and sorting coverage

Test pagination helpers with generated datasets smaller than, equal to, and larger than supported page sizes. Verify:
- Default page size is 6; supported sizes are 6, 10, and 20.
- Page indexes and slices are correct.
- No item is duplicated or omitted across pages.
- Invalid query values are handled safely.
- Changing page size resets or clamps the page according to the implementation contract.
- Query parameters are preserved or removed correctly.
- Sorting occurs before slicing and is stable for equal sort keys.

Browser tests verify URL state, selected page size, and distinct slices when enough records exist. They must not require a specific production dataset size.

## 6. Localization, accessibility, and responsive QA

Test both locales:
- English uses LTR; Persian uses RTL.
- Localized slugs resolve to stable content identities.
- Encoded and Unicode-normalized route segments are handled safely.
- Locale switching preserves the equivalent content route when a translation exists.
- Keyboard navigation, focus restoration, dialog behavior, and visible focus states work.
- Text wraps naturally, including long localized strings.
- No unintended horizontal overflow occurs at supported viewport sizes.
- Light and dark themes preserve contrast and theme-aware image-frame tokens.

## 7. SEO and metadata

Validate metadata structurally and dynamically:
- Canonical URLs match the current route.
- Alternate-language links are reciprocal when a translation exists.
- Descriptions and titles are present when required.
- Open Graph/social image metadata comes from the resolved record or is omitted when unavailable.
- Structured data is valid JSON and uses an appropriate schema type.
- Sitemap and robots endpoints are available and exclude unpublished or unknown routes.

Do not assert production titles, image filenames, names, or specific content slugs.

## 8. Visual QA

Review both locales across desktop, tablet, mobile, and short-height viewports. Check Persian shaping, RTL composition, image containment, responsive reflow, focus behavior, theme consistency, and horizontal overflow. Capture screenshots for materially changed surfaces. Prefer stable layout invariants over brittle pixel-perfect checks.

## 9. CI evidence and release workflow

Record the exact commit SHA, workflow URL, conclusion, and failed step details. Distinguish automated CI results from visual review. Do not claim a check passed unless the corresponding run completed successfully.

Keep checks deterministic. Do not skip, disable, or weaken meaningful assertions to obtain a green run. Work only on the authorized branch. CI completion does not authorize merging or deployment.

## 10. Image metadata verification

- Local development may generate image metadata from raster assets under the public image directory.
- Commit generated metadata with corresponding asset changes.
- The prebuild check is read-only and must fail for missing, unsupported/corrupt, or stale image metadata and invalid technical asset references.
- CI must not rewrite committed metadata.
- The generator validates technical file properties and references only; it does not determine rights, ownership, image identity, or editorial approval.
