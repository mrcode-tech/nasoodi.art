# Content Announcement Sticker — Visual Direction

**Status:** General-purpose content behavior approved; existing paper-sticker visual direction retained  
**Project:** Nasoodi.art  
**Branch:** feature  
**Technical contract:** journal-announcement-specification.md  
**Implementation prompt:** journal-announcement-implementation-prompt.md

## 1. Purpose

The edge-attached paper sticker is a general content-discovery element. It can feature one configured artwork, gallery, Journal post, or event. It is not limited to upcoming exhibitions and does not select content automatically.

The sticker should feel like a small editorial paper notice attached to an artist's gallery—not a discount promotion, modal, toast, or commercial campaign banner. The paintings remain the primary visual content.

## 2. Configuration and interaction

One JSON file controls the sticker. Its `active` boolean determines visibility; `type` and `contentId` select the referenced content; localized title and description supply the copy; optional metadata supplies a short label or contextual detail.

The main content links to the canonical localized destination derived from the content type and localized slug. No destination URL is duplicated in JSON. A separate close control dismisses the sticker without navigation.

There is at most one configured announcement. No upcoming event is required. The Journal preview and archive remain independent.

## 3. Visual direction

Retain the existing edge-attached paper concept:
- Warm paper surface and restrained neutral outline.
- Subtle irregular inward-facing edge.
- Optional restrained attachment/tape detail.
- Compact typography and enough room for a short description.
- Independent, accessible close control.

No sale colors, prices, percentage marks, loud gradients, glossy effects, countdowns, oversized shadows, or promotional urgency language.

English attaches to the physical left edge; Persian attaches to the physical right edge. Mirror only the decorative SVG. Text and controls retain their natural reading order.

## 4. Responsive placement

Preserve the existing viewport, desktop sidebar, and mobile drawer placements. The component must remain secondary to artwork and navigation, respect safe areas and focus, and reserve no space when inactive or dismissed.

## 5. Asset contract

The canonical hand-authored SVG remains `public/images/journal/journal-announcement-sticker.svg`. It is decorative only; title, description, optional metadata, and controls remain localized HTML. Serve the SVG directly. Do not create a PNG derivative or conversion pipeline.

See the visual design contract and technical specification for implementation and acceptance criteria.
