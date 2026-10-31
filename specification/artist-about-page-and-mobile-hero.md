# Artist About Experience, CV, and Homepage Hero Responsive Specification

**Status:** Proposed design and implementation contract; implementation requires artist/site-owner content approval  
**Scope:** Homepage hero biography preview and expansion, global About navigation, localized About page, CV section and PDF download, and mobile hero content order  
**Working branch:** `feature`  
**Locales:** Persian (`fa`, RTL) and English (`en`, LTR)  
**Related authorities:** `AGENTS.md`, `specification/README.md`, `design-engineering-skills.md`, `design-direction-and-system-refinement.md`, `site-wide-design-system-and-section-specification.md`, `homepage-artwork-hero-and-featured-works.md`, `navigation-and-mobile-sidebar.md`, `content-model.md`, `localization-and-editorial-governance.md`, `accessibility-performance-security.md`, `seo-and-discovery.md`, `testing-qa-and-release.md`

---

## 1. Purpose

This specification defines two connected improvements requested by the site owner:

1. Introduce an artist biography directly beneath the artist's name in the homepage hero. Long biographies must initially appear as a concise preview with an ellipsis and a **Read more** control. Activating Read more reveals the complete biography in place. The global sidebar must also contain an **About** destination that opens a dedicated page with the artist image, complete biography, and a CV section ending with a downloadable, artist-approved PDF.
2. Correct the mobile homepage hero order so the artist image and the artist's text form one uninterrupted introduction. The two existing hero action buttons must appear after the biography and its Read more/Show less interaction, never between the image and the text.

The experience should make the artist easier to understand without turning the homepage into a long résumé or changing the site's established quiet, editorial gallery identity.

## 2. Authority and reconciliation with existing specifications

This is a specialized contract for the artist introduction and About/CV experience.

- `AGENTS.md` remains the repository-wide engineering and design authority.
- `design-engineering-skills.md` and `design-direction-and-system-refinement.md` remain mandatory project-wide design authorities.
- `navigation-and-mobile-sidebar.md` remains authoritative for the global sidebar/drawer mechanics, locale-dependent placement, focus management, language/theme controls, and mobile navigation behavior. This document adds About as a required destination; it does not replace the navigation system.
- `content-model.md` remains authoritative for artist profile fields, localized statement/biography, approval state, CV facts, and publication eligibility. This document adds the PDF asset and download contract without creating a competing artist-profile model.
- `homepage-artwork-hero-and-featured-works.md` remains authoritative for artwork fidelity, the finished-artwork hero requirement, and the image treatment of paintings. This document changes the order and behavior of the artist identity/biography/actions within the existing hero content area; it does not authorize changing, cropping, filtering, or replacing the hero artwork.
- Where older homepage or site-wide prose places a separate Artist Introduction after Selected Works, do not duplicate the same biography. The short biography belongs directly under the artist's name in the hero as requested here. A later introduction section may remain only when it contains distinct, approved material and has a clear purpose.
- The existing site-wide navigation model already includes About and conditionally includes CV/Exhibitions. This specification makes About a first-class route/navigation item and defines the CV as a section at the end of About. Do not add a separate CV navigation item unless the owner separately approves it and the route/content are ready.
- Existing hero action labels, destinations, and behavior must be inspected and preserved. This document changes their position on mobile, not their meaning.

If the implementation reveals a direct contradiction in current code or a higher-level approved contract, record the evidence and reconcile the documents before changing behavior. Do not silently choose an interpretation.

## 3. Experience goals

- Explain who the artist is and what her practice is about in the first homepage introduction.
- Keep the initial hero concise and visually calm.
- Let visitors reveal the complete biography without leaving the homepage.
- Provide a separate, durable About destination for visitors who want the full profile and CV.
- Make About discoverable from the global sidebar on desktop and from the existing mobile drawer.
- Present the approved artist portrait/photo and full biography in a readable editorial page.
- Provide a working PDF download only when a real, approved CV document is available.
- Preserve the image-led portfolio, existing hero actions, artwork discovery, and the established navigation behavior.

## 4. Information architecture and routes

### 4.1 About destination

Use the site's existing localized App Router conventions. The intended public route is the localized equivalent of:

- `/[locale]/about`
- Examples: `/en/about` and `/fa/about`

Before implementation, inspect the actual route tree and locale routing. Reuse an existing About route if present; do not create a duplicate route or a parallel routing mechanism.

### 4.2 Sidebar placement

- About is a first-class primary navigation destination alongside the site's existing primary routes.
- It must be available on desktop/tablet sidebar and through the existing mobile off-canvas menu.
- Follow `navigation-and-mobile-sidebar.md` for physical placement, locale behavior, active state, menu close behavior, and focus restoration.
- The About item must use the localized approved label and point to the current locale's About route.
- Do not add a separate CV item for this change. The CV belongs at the end of the About page.
- Do not expose links to unavailable, empty, or unapproved content as if it were complete.

### 4.3 Homepage Read more destination relationship

The homepage **Read more** control is an in-place expansion control, not a navigation link. It reveals the complete biography in the hero.

The dedicated About page remains reachable through the sidebar. After the biography has expanded, an optional understated **Visit About page** link may be shown if it helps users discover the full portrait/CV experience; it must not replace or alter the requested Read more behavior. Do not add this optional link if it creates redundant or cluttered controls.

## 5. Homepage hero biography

### 5.1 Content order

Within the existing hero text/content region, the required logical order is:

1. Artist's approved public name.
2. Existing discipline/role label, if currently part of the hero.
3. About label or heading (subordinate to the artist name).
4. Artist-approved short biography or the beginning of the full biography.
5. Ellipsis and **Read more** control when the biography is truncated.
6. The two existing hero action buttons, in their existing order.

The biography is directly associated with the artist identity. It must not become a detached promotional card or a competing hero headline.

### 5.2 Source of biography text

- Use the artist's approved localized biography from the canonical artist profile/content source.
- The biography is factual, normally third person, and distinct from a first-person artist statement as defined in `content-model.md` and `localization-and-editorial-governance.md`.
- Do not invent, embellish, rewrite, summarize, translate, or infer artist facts.
- If an artist-approved short introduction already exists and is explicitly intended for the homepage, it may be used as the collapsed preview. The expanded state must reveal the complete approved biography.
- If only a full biography exists, derive the collapsed preview from that same localized value. Do not maintain a second manually edited copy that can drift from the canonical biography.
- Persian and English content must be separately approved. Missing locale content must not be silently filled with machine translation or the other locale's text.

### 5.3 Collapsed state

- Short biography: show the complete text and do not show Read more.
- Long biography: show a concise preview, initially targeting approximately 3–4 lines on desktop and 3–5 lines on mobile. Tune against the actual hero width and typography.
- Truncate at a natural word/grapheme boundary. Never split a word, Persian joining sequence, emoji, or composed Unicode grapheme.
- Display an ellipsis (`…`) only when content is actually omitted.
- Show a localized, keyboard-accessible **Read more** button/control immediately after the preview.
- Avoid a fixed character-count truncation as the primary mechanism. Prefer measured line clamping or a robust content-aware approach that behaves correctly in both scripts.
- The collapsed layout must not reserve a large empty area for the hidden text.

### 5.4 Expanded state

When the visitor activates Read more:

- Reveal the complete biography in the same hero text region.
- Preserve paragraph boundaries and approved formatting.
- Change the control label to the localized **Show less**.
- Expose the state accessibly (for example, `aria-expanded` and an association with the controlled content).
- Keep the two existing hero actions after the complete biography and Show less control.
- Do not move the portrait/image, overlay text on it, or create horizontal overflow.
- Allow natural page-height growth and scrolling. Do not constrain the expanded content to the original hero height.
- Do not automatically scroll the page in a way that disorients the visitor.
- If expansion causes a large layout change, use no animation or a restrained height/opacity treatment only if it is robust, interruptible, and respects reduced motion. Do not use `transition: all`.

The expanded state is local UI state. It does not need to change the URL or create a second route.

### 5.5 State persistence

Default to collapsed on a fresh homepage visit. Do not persist expansion in local storage, cookies, or a cross-session profile unless a later product decision explicitly requires it. A route navigation or page reload may return the hero to its collapsed state.

### 5.6 Hero action buttons

- Preserve the two existing actions' labels, destinations, semantic roles, visual variants, and relative order.
- On desktop, place both actions after the biography controls in the hero text column.
- On mobile, both actions must appear after the biography content, including its expanded state and Show less control.
- Do not insert either action between the image and artist name/biography.
- Do not turn the biography into a CTA or change the action destinations as part of this task.

## 6. Dedicated About page

### 6.1 Page purpose and hierarchy

The About page is the complete artist profile, not a second homepage or a corporate résumé template.

Required reading order:

1. About page heading/artist identity.
2. Approved artist portrait or approved artist/studio photograph.
3. Complete approved biography.
4. CV section.
5. Download CV (PDF) action, when a valid approved PDF exists.

The page may adapt the portrait and title arrangement to the existing editorial grid, but the DOM and keyboard reading order must remain logical.

### 6.2 Artist image

- Reuse the existing approved artist portrait/photograph when it is suitable and rights are confirmed.
- Inspect the actual current hero image and asset inventory before selecting the About image. Do not assume that a studio/process image is a portrait or that a hero asset is automatically approved for a second use.
- The image must be an artist-approved image of the artist or approved studio context. Do not use a finished painting as a substitute for a portrait unless the owner explicitly chooses that composition.
- Preserve original aspect ratio, orientation, color, and image integrity. Do not apply filters, AI enhancement, unapproved crop, recoloring, mirroring, or distortion.
- Prefer the natural image ratio and a restrained editorial frame. If a crop is necessary, it must use an approved derivative.
- Reserve intrinsic dimensions/aspect ratio to prevent layout shift.
- Provide concise, localized, factual alternative text. Do not infer identity details or emotional meaning.
- If no approved portrait is available, omit the image rather than using an unrelated or unapproved asset. The biography page must still work.

### 6.3 Full biography

- Render the complete artist-approved biography in the current locale.
- Preserve paragraph structure and editorial voice.
- Use the shared body typography and a comfortable reading measure. Target approximately 60–75 Latin characters per line where practical; validate Persian measure independently.
- Use appropriate paragraph spacing and line height for long-form reading.
- Avoid excessive bolding, decorative quote marks, cards, gradients, and unnecessary dividers.
- Do not merge the artist statement and biography into one text field. If both are approved and the page needs both, label and present them as distinct content types according to the content model.
- If the current locale's biography is absent or unapproved, follow the existing content publication contract: render the truthful pending-content experience, keep the page noindex, and exclude it from the sitemap. Do not expose draft content.

### 6.4 CV section placement and content

The CV section appears after the complete biography and is the final substantive section of the About page, before any global footer.

- Use the localized heading **Curriculum Vitae** or **CV**.
- If verified CV entries are already modeled and approved, the page may present a concise, curated CV summary using the existing content model. Keep categories/entries factual and chronologically consistent with that model.
- Omit empty categories and unknown facts. Do not invent education, exhibitions, awards, residencies, publications, venues, dates, locations, or qualifications.
- A PDF download is a separate deliverable from any HTML CV summary. Both must use the same approved source facts and must not contradict each other.
- If no verified CV entries exist but an approved PDF does, the page may show the CV heading and download action without fabricating an HTML timeline.
- If neither verified CV entries nor an approved PDF exists, do not show a fake or empty CV section. Keep the About biography usable and record the missing asset/content as a release dependency.

### 6.5 Downloadable CV PDF

A real artist-approved PDF is required before the download action can be published.

Asset contract:

- Use a stable, repository-managed public asset path consistent with the existing asset conventions (candidate pattern: `public/documents/artist-cv.pdf`; inspect repository conventions before choosing the actual path).
- Use a descriptive, stable filename. The preferred display/download name is `artist-cv.pdf` unless the artist supplies a preferred filename.
- Do not commit a placeholder PDF, generated résumé, empty PDF, or a PDF with invented details.
- Do not generate the artist's CV from inferred profile information.
- Confirm that the file is a valid PDF, readable, non-empty, and the exact artist-approved version.
- Check for accidental exposure of private contact information or metadata before publication; only the artist-approved public document may be served.
- Link directly to the stable public file. Use normal browser PDF behavior or the download attribute where appropriate to deliver the intended experience.
- Give the action a localized accessible name and visibly identify the format (PDF). If file size is known and useful, it may be displayed, but do not invent it.
- Verify the link returns a successful response and that the downloaded/opened file is the expected document.
- If the PDF is missing, unapproved, invalid, or inaccessible, do not render a broken download link. Keep the action absent and report the exact missing approval/asset as a blocker.

## 7. Responsive composition

The mobile layout correction is mandatory and applies to the existing hero image and text. It does not authorize changing the image's identity or treatment.

### 7.1 Desktop

- Preserve the established desktop hero composition and image/text relationship wherever possible.
- Place the biography immediately below the artist name in the hero text region.
- Place both existing actions after the biography controls.
- Do not force the desktop hero into a new full-width stacked layout if the current composition works.
- Allow the expanded biography to grow naturally without overlapping the image or adjacent sections.

### 7.2 Mobile portrait

Required visible and DOM order:

1. Existing hero image/photo.
2. Artist name.
3. Existing discipline/role label if applicable, following the established content hierarchy.
4. About label/heading.
5. Biography preview or full short biography.
6. Read more / Show less control when needed.
7. Existing hero action 1.
8. Existing hero action 2.

The image and text must be adjacent parts of one continuous hero introduction. Neither action button may appear between them.

- Use a single-column flow at the mobile breakpoint.
- Keep the image at a readable size and preserve its natural aspect ratio.
- Avoid fixed image heights that crop or distort the source.
- Use consistent spacing to make image, name, and biography feel connected.
- Stack the two actions in their existing order using the current mobile button treatment; do not introduce a new visual button system.
- Ensure the actions have comfortable touch targets and do not crowd the biography.
- The complete expanded biography must remain readable and scrollable.

### 7.3 Mobile landscape and short-height screens

- Preserve the same logical order as mobile portrait.
- Do not force the full hero into the first viewport.
- Let the page scroll naturally.
- Avoid fixed-height containers that clip biography or actions.
- Ensure the menu, image, text, and actions do not overlap.

### 7.4 Tablet

- Inspect the actual content width including the sidebar/drawer state.
- Preserve the desktop editorial composition when it remains readable; otherwise transition to the single-column sequence.
- Do not let the biography become an excessively narrow column or squeeze the action buttons.
- The DOM order must remain meaningful even if CSS layout changes.

### 7.5 Responsive behavior matrix

| Context | Required composition |
|---|---|
| Desktop | Existing image-led hero composition; name → About → biography → actions |
| Tablet | Responsive adaptation; biography remains directly under name; actions after biography |
| Mobile portrait | Image → name → About → biography → expansion control → action 1 → action 2 |
| Mobile landscape | Same logical order, natural scrolling |
| Short-height desktop | Same hierarchy, no forced clipping |

## 8. Visual design and system reuse

Follow the existing “artist's quiet gallery” direction.

- Use semantic tokens from the existing design system; do not copy raw hex values into new page styles.
- Reuse established display, page-title, section-title, body, metadata, and navigation typography roles.
- Maintain warm paper, warm ink, restrained mauve/taupe accents, generous whitespace, and fine rules where useful.
- The artist's image and approved content remain the focus.
- Do not introduce generic SaaS cards, nested cards, dashboard patterns, decorative gradients, glassmorphism, neon, heavy shadows, excessive pills, or unnecessary icons.
- Avoid a boxed biography card unless the existing hero design specifically requires a surface to preserve contrast.
- The Read more/Show less control should look like a quiet editorial text action, not a primary CTA.
- The CV download action should be clear and discoverable but visually subordinate to the artist's name and portrait.
- Reuse existing shadcn/ui and project primitives where they fit. Do not duplicate buttons, links, navigation primitives, or content components.

## 9. Localization and RTL/LTR

Support Persian and English as first-class experiences.

Required localized UI labels (final translations must follow the approved localization source):

- About
- About the artist
- Read more
- Show less
- Curriculum Vitae / CV
- Download CV (PDF)
- Optional Visit About page

Rules:

- Use the project's locale dictionaries and route helpers. Do not hardcode labels in components.
- Persian content uses correct RTL direction and natural Persian typography; English uses LTR.
- Use CSS logical properties for spacing and alignment.
- Do not reverse the portrait/image or physically mirror photography.
- Do not mechanically mirror the global sidebar; follow the navigation specification's locale-dependent physical placement.
- Keep mixed-script filenames/URLs and PDF metadata isolated appropriately in RTL contexts.
- Do not publish a locale alternate unless the corresponding approved biography and page content exist in that locale.
- Missing translation remains missing; do not display machine-translated or copied content as approved.

## 10. Accessibility and interaction contract

Target WCAG 2.2 AA under the repository's accessibility specification.

### Expand/collapse

- Use a semantic button for Read more / Show less.
- The button must be keyboard operable and have a visible focus state.
- Expose the expanded state with `aria-expanded` and associate it with the controlled biography content where practical.
- The visible label must clearly communicate the next action.
- Preserve a logical focus order; toggling must not unexpectedly move focus.
- The biography text must remain selectable and readable by assistive technology.
- Do not rely on color, icon, or ellipsis alone to convey truncation.

### Navigation and page

- About uses a real localized link.
- Current-page state is exposed semantically (for example, `aria-current="page"`) and visually.
- The mobile drawer retains its existing focus trap/restoration and Escape behavior.
- Heading hierarchy is logical; do not skip levels for visual sizing.

### PDF

- Use a real anchor link with an accessible name identifying the CV and PDF format.
- Do not use a click handler on a non-semantic element.
- Ensure focus indication and sufficient contrast.
- The file must be accessible without requiring JavaScript.

### Motion

- No animation is required for expansion.
- If animation is introduced, it must pass the motion decision gate in `design-engineering-skills.md`, be interruptible, and respect `prefers-reduced-motion`.
- The full experience must work with motion disabled.

## 11. Content model and implementation guidance

Extend the existing artist profile/content model only as necessary. Do not introduce a duplicate profile store.

The existing conceptual profile contract includes localized statement, biography, optional portrait with localized alt text and dimensions, publication status, approved locales, and artist approval. Preserve it.

Add a CV document reference only if the current repository model has no equivalent. The conceptual extension may be:

```ts
type ArtistCvDocument = {
  src: string;
  downloadName: string;
  mediaType: "application/pdf";
  locale?: "fa" | "en" | "universal";
  approved: boolean;
};

type ArtistProfile = {
  // Existing canonical profile fields remain authoritative.
  cvDocument?: ArtistCvDocument;
};
```

This is a conceptual contract, not a command to adopt this exact type. Inspect the actual implementation and use its established schema/validation conventions.

Validation/publication rules:

- A CV download is rendered only when the file exists, is a valid PDF, and is explicitly approved for public download.
- Validate the path is a safe local public asset path; do not allow arbitrary external URLs or path traversal.
- Do not expose internal approval fields or private source metadata to the browser.
- A CV file's existence does not imply that the HTML CV entries are complete or approved.
- The biography preview and full About biography must resolve from one canonical localized source.

## 12. SEO and indexing

- Use localized title and description based only on approved artist facts and biography.
- Follow existing canonical URL, locale alternate, robots, sitemap, and structured-data contracts.
- An About page with approved localized biography may be indexable according to the existing artist-profile publication contract.
- Pending or unapproved biography content remains noindex and excluded from the sitemap.
- Do not add unsupported Person schema fields, awards, affiliations, education, or occupation details.
- The homepage expansion state does not create a separate URL or duplicate indexable page.
- A PDF may be directly accessible as a public document; do not expose a private/draft file through the public path.

## 13. Performance and robustness

- Preserve intrinsic image dimensions/aspect ratio and avoid layout shift.
- Reuse existing optimized image delivery; do not add a new image service.
- Do not preload a large image or PDF without evidence that it improves the user experience.
- The biography expansion must not require a network request if the full approved biography is already part of the page data.
- The PDF should be fetched only when the visitor activates the link.
- Handle absent portrait, absent biography, absent translation, and absent CV without broken layout or dead controls.
- Avoid client-side state or JavaScript for navigation and PDF access when native browser behavior is sufficient.

## 14. Testing and visual QA

Inspect the actual package scripts, tests, browser tooling, route conventions, and CI workflows before choosing commands. Add tests in the repository's existing test architecture.

### 14.1 Unit/component tests

Cover:

- Short biography: full text visible, no Read more control.
- Long biography: collapsed preview and Read more control.
- Read more: complete text revealed in place.
- Show less: returns to the collapsed preview.
- Unicode-safe truncation for Persian and English.
- Correct localized labels and direction.
- No duplicate biography source.
- Missing/unapproved biography: no fabricated content.
- CV section conditions for verified entries, approved PDF only, and neither available.
- Invalid/missing PDF does not produce a broken link.

### 14.2 Browser/E2E tests

Cover:

- About is present in desktop sidebar and mobile drawer.
- About opens the correct localized route.
- Current About navigation state is correct.
- Homepage Read more expands the full biography without navigating away.
- Show less collapses it again.
- Existing hero actions remain functional and in the same relative order.
- On mobile, image → name → biography → expansion control → both actions is the rendered order.
- Neither action button appears between the image and artist text.
- About page shows approved portrait when available, full biography, and CV section at the end.
- CV PDF link returns a successful response and references the expected approved asset.
- RTL Persian and LTR English layouts have no overflow or overlap.
- Keyboard operation and visible focus work.

### 14.3 Visual QA viewports and states

Capture and inspect actual rendered screenshots for:

- Desktop wide.
- Desktop short-height.
- Tablet.
- Mobile portrait.
- Mobile landscape.
- English LTR.
- Persian RTL.
- Biography collapsed and expanded.
- CV available and CV unavailable.

Record viewport, locale, state, artifact path, and findings. A generated screenshot that has not been inspected is not visual verification.

### 14.4 Regression coverage

- Existing two hero actions keep their labels, destinations, order, and behavior.
- Homepage artwork identity and image fidelity remain unchanged.
- Selected Works, Galleries, Journal, artwork detail, and existing navigation behavior remain unchanged except for the About destination.
- Existing mobile sidebar focus/close behavior remains intact.
- No global layout or locale regressions are introduced.

## 15. Acceptance criteria

### Homepage biography

- [ ] Artist-approved About/biography content appears directly below the artist's name in the hero text region.
- [ ] A short biography is shown in full without a redundant control.
- [ ] A long biography is initially clamped to a concise preview.
- [ ] Truncation respects word/grapheme boundaries in Persian and English.
- [ ] An ellipsis appears only when content is hidden.
- [ ] Read more expands the complete biography in place.
- [ ] The control changes to Show less and collapses the biography.
- [ ] The two existing actions remain after the biography in desktop and mobile layouts.

### About navigation and page

- [ ] About is a first-class sidebar item on desktop/tablet.
- [ ] About is available through the existing mobile drawer.
- [ ] The localized About route follows existing route conventions.
- [ ] Active navigation state and browser navigation work.
- [ ] The approved artist image appears near the top when available.
- [ ] The complete approved biography is readable.
- [ ] The CV section is at the end of the substantive page content.
- [ ] A real approved PDF downloads/opens correctly when available.
- [ ] Missing/unapproved CV assets never create broken links or placeholder content.

### Mobile hero

- [ ] The hero image appears first.
- [ ] Artist name and About text follow the image directly.
- [ ] The biography appears before both existing action buttons.
- [ ] No action button separates image and text.
- [ ] The two existing actions retain their original order and behavior.
- [ ] Expanded biography remains readable and does not overlap/crop adjacent content.

### Quality

- [ ] English LTR and Persian RTL are correct.
- [ ] Keyboard and screen-reader interactions are meaningful.
- [ ] Reduced-motion behavior is correct.
- [ ] Desktop, tablet, mobile portrait, mobile landscape, and short-height layouts are visually inspected.
- [ ] Automated tests, lint, typecheck, and production build pass.
- [ ] CI evidence and visual artifacts are recorded.
- [ ] Artist/site-owner content and PDF approval gates are explicitly recorded.

## 16. Non-goals and preservation

This task does not authorize:

- A complete homepage redesign.
- Changing the identity, crop, color, or treatment of the existing hero image/artwork.
- Changing the labels, destinations, or behavior of the two existing hero actions.
- Replacing or redesigning the global sidebar/drawer.
- Adding a separate CV route or top-level CV navigation item.
- Publishing invented biography, CV, education, exhibition, award, or contact information.
- Generating a synthetic CV PDF.
- Changing Works, Galleries, Selected Works, Journal, artwork detail, or collection behavior.
- Adding analytics, external embeds, or third-party services.

## 17. Implementation readiness and owner inputs

Before public release, verify and record:

- Artist-approved full biography in English.
- Artist-approved full biography in Persian, or an explicit decision that the Persian About page remains pending/noindex until supplied.
- Artist-approved portrait/studio image and usage rights, if one is to appear on About.
- Artist-approved CV PDF and its public-download permission.
- Confirmation that any HTML CV highlights are factually consistent with the PDF.
- Approved Persian translations for the new interface labels.

Do not block implementation of the structural experience on unavailable content if the repository can represent the pending state safely. Do block publication of unapproved biography or CV facts/assets.

---

## 18. Final experience summary

The homepage hero becomes a concise, expandable artist introduction: artist name, About, biography preview, Read more, then the two existing actions. Read more reveals the complete biography in place.

The sidebar's About item opens a dedicated localized page with the approved artist image, full biography, and a CV section at the bottom. A direct PDF download is shown only when the real artist-approved CV is available.

On mobile, the hero is one continuous vertical story: image, artist identity, biography, and finally the two existing actions. The image and text are never separated by those buttons.
