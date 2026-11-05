# Contact Experience

**Owner-approved implementation contract — 2026-11-05**

## Purpose

Present direct, simple contact methods in the homepage Contact section and the dedicated localized Contact page. Both surfaces use the same canonical JSON record and shared component.

## Contact methods

The canonical source is `src/content/data/contact.json`.

- Email: `g.nasoodi@gmail.com`
- Telegram: `@nasoodi` at `https://t.me/nasoodi`
- Instagram: `@ghazalenasoodi` at `https://www.instagram.com/ghazalenasoodi/`

Render all configured methods. Do not gate visibility on approval, verification, publication, or provenance flags. Do not substitute demo destinations or hide the email/Telegram details.

## Layout and behavior

- Homepage Contact appears after the editorial/gallery content and before the global footer.
- The dedicated page is available in English and Persian.
- Contact is reachable from desktop sidebar and mobile navigation.
- Desktop uses the existing asymmetric editorial composition; mobile uses one readable column.
- English is LTR and Persian is RTL. Contact values remain LTR where appropriate.
- Email uses a `mailto:` link. Telegram and Instagram open their supplied HTTPS profile destinations.
- Preserve existing typography, whitespace, theme behavior, and shared design tokens.
- Do not add a contact form, phone number, postal address, response-time promise, booking system, or commission availability.

## Accessibility

Links must be keyboard accessible, visibly focused, and have meaningful localized labels. Maintain adequate contrast and avoid horizontal overflow at supported widths.

## Automated tests

Test that the same three canonical methods appear on homepage and Contact page in both locales, with exact destinations. Test responsive composition and navigation. Tests must not expect contact methods to be hidden due to approval or verification status.

## Scope boundaries

This specification does not authorize deployment, merging to another branch, or changes to external services.
