# Wireframes and Interaction Contracts

These wireframes describe layout regions and interaction relationships only. All visible content is supplied dynamically by localized messages or canonical content data.

## Desktop shell

```text
+----------------------+-----------------------------------------------+
| SITE BRAND           | Main content                                  |
|                      |                                               |
| Navigation           | +--------------------+--------------------+ |
| - Works              | | HERO IMAGE         | ARTIST_NAME        | |
| - Collections        | |                    | BIOGRAPHY_TEXT     | |
| - Journal            | |                    | [Explore] [Works]  | |
| - About              | +--------------------+--------------------+ |
| - Contact            |                                               |
|                      | Selected content carousel                    |
| Locale / Theme       |                                               |
|                      | Featured collections                         |
| Copyright            |                                               |
+----------------------+-----------------------------------------------+
```

## Mobile shell

```text
+----------------------------------+
| MENU                         BRAND|
+----------------------------------+
| HERO IMAGE                       |
|                                  |
| ARTIST_NAME                      |
| BIOGRAPHY_TEXT                   |
| [Explore] [Works]                |
|                                  |
| Selected content                 |
| [<] [Card] [Card] [>]            |
|                                  |
| Featured collections             |
| [<] [Card] [>]                   |
|                                  |
| Journal preview                  |
| Contact                          |
+----------------------------------+
```

## Collection archive

```text
+----------------------------------+
| Page heading                     |
| Introductory text                |
|                                  |
| +-----------+ +-----------+      |
| | Cover     | | Cover     |      |
| | Title     | | Title     |      |
| | Summary   | | Summary   |      |
| +-----------+ +-----------+      |
|                                  |
| Page size / pagination           |
+----------------------------------+
```

## Detail viewer

```text
+----------------------------------+
| Close                             |
|                                  |
| Previous | Image | Next          |
|                                  |
| CONTENT_TITLE                    |
| CONTENT_DESCRIPTION              |
+----------------------------------+
```

## Interaction contracts

- Navigation links resolve to locale-prefixed routes.
- The mobile menu opens as an accessible dialog/drawer and restores focus when closed.
- Locale switching preserves equivalent content identity where a translation exists.
- Carousel controls are keyboard accessible and disabled at the relevant boundaries.
- Viewer controls navigate only within the active context.
- Pagination state is reflected in the URL.
- Dismissible announcements persist dismissal only according to the documented session behavior.
- All layouts adapt to variable content and varying record counts.

## Notes

The diagrams intentionally use generic labels and do not define artist identity, contact details, production titles, asset filenames, or editorial record counts.
