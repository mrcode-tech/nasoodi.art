# Localization and Editorial Content

## Canonical localized content

Editorial content is stored in the canonical JSON records under `src/content/data/`. English and Persian values belong to the same record. Interface labels remain in next-intl message resources.

## Locale behavior

- English pages render LTR; Persian pages render RTL.
- Use the existing locale routing and next-intl infrastructure.
- Preserve the meaning of the content in both languages.
- If an optional localized value is absent, omit that value or section gracefully. Do not block the whole record or silently substitute unrelated text.

## Editorial editing

The owner controls the content and may revise the JSON records at any time. Current entries are intended to populate the website as its initial editable content. Do not require a separate artist approval, verification, factuality, provenance, or editorial status flag before displaying them.

Do not create parallel approved/unapproved, verified/unverified, sample/real, preview/production, or temporary/permanent copies of editorial content. Do not hide CV, Contact, exhibition, activity, or Journal records based on such flags.

## Writing and translation quality

Use clear, natural English and Persian. Preserve artist names, dates, titles, and proper nouns consistently. Persian copy must be natural Persian, with correct punctuation and RTL behavior. UI text is translated in message resources; editorial text is localized in content JSON.

## Technical boundaries

Automated checks may test message-key parity, type compatibility, route safety, URL safety, and correct rendering. They must not attempt to decide whether an artist fact is true or whether the owner has approved a piece of editorial content.
