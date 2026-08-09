# Medicarians Vegas 2027 — prototype

Static, click-through prototype of the Medicarians Vegas 2027 landing page, built from the
[Figma design](https://www.figma.com/design/6wbPIuKFZEt5jGwWaKqKVC/Untitled?node-id=11-1498)
(node `11:1498`). Copy is the design's placeholder copy, unchanged.

## Running it

No build step and no dependencies — open the file:

```
open index.html
```

Or serve it if you prefer a real origin:

```
python3 -m http.server 8000
```

## Layout

```
index.html      all ten sections
styles.css      tokens, section styles, breakpoints at 1180 / 900 / 640px
script.js       mobile nav, sticky-header state, newsletter no-op
assets/img/     hero, venue and speaker photography + the two logo SVGs
assets/fonts/   drop the licensed Articulat CF woff2 files here (see its README)
```

## Fonts

Both Articulat CF display weights are installed and loading — Extra Bold (800) for section
headings and card titles, Heavy (900) for the hero headline, nav, buttons and eyebrows. Served
as OTF (~68KB each); [assets/fonts/README.md](assets/fonts/README.md) has the woff2 recipe if
you want them smaller for production.

## Where this departs from the Figma

The Figma is a rough export with fixed pixel widths, absolute positioning and a few frame
artifacts, and it has no mobile board. These were corrected:

**Layout bugs**

- Hero CTA was `width: 100%` (would stretch ~783px); the render shows a hug-width pill.
- Hero stats bar was absolutely positioned at `top: 755px` in a fixed 995px section — now in
  normal flow, so it can't collide with the headline as the viewport narrows.
- Fixed widths throughout (864px headline, 783px hero copy, 587.13px section headers, 313.33px
  card copy, 471px newsletter) replaced with `max-width` + fluid type.
- The agenda was two independent frames with a rigid 268px gutter and rows whose heights
  disagreed between columns. It's now one 2-column grid in source order 01–10, matching the
  design's left-to-right reading order, so rows align and mobile stacking stays sequential.
- Each of the six audience cards carried its own 1px border, so every shared seam rendered 2px.
  Now a 1px-gap grid over a hairline background — every seam is exactly 1px.
- The logo wall's 7th column was hardcoded to 208px against 188.16px for the other six.
- Section gutters were inconsistent (48px in most sections, 32px in sponsor and footer);
  normalized to one container gutter, so the sponsor banner no longer sits wider than the
  content above it.
- The footer's bottom bar had `padding-top: 88px` — an artifact of a fixed-height frame —
  leaving a large void under the divider. Now 24px.
- The footer divider was solid white; softened to a low-opacity rule to match the render.
- Dropped an empty 37px placeholder paragraph under the logo wall (node `11:1597`).
- Removed `white-space: nowrap` from card headings that need to wrap ("Agency Owners &
  Principals", "Regulators & Compliance").
- Body copy alternated between Helvetica Neue and Inter with no apparent rule; unified.

**Mobile** (the Figma has desktop only)

- Header: seven links plus a CTA can't fit, so below 1180px they collapse into a hamburger and
  a slide-down panel that closes on link click, outside click and <kbd>Esc</kbd>.
- Stats 4 → 2 → 1 column. Audience cards 3 → 2 → 1. Speakers 5 → 4 → 3 → 2.
- Logo wall 7 → 2 columns. The hairlines are drawn by a 1px grid gap over a tinted background,
  so the column count has to divide the 14 cells exactly — 4 columns left a half-empty last row
  that rendered as a solid grey block.
- Agenda, banners, venue and newsletter go from side-by-side to stacked, with full-width CTAs.
- Footer 4 → 2 → 1 column.

**Prototype behaviour** — no copy added: smooth scrolling to anchors, the header switching from
transparent to solid navy past the hero, hover/focus states throughout, and the newsletter form
calling `preventDefault()`. The newsletter field is a real labelled `<input type="email">` rather
than the Figma's static text.

## Verified

No horizontal overflow at 320, 375, 390, 430, 540, 640, 768, 900, 1024, 1180, 1280, 1440 or
1920px (`document.scrollWidth === viewport` at every width, zero elements crossing the edge).
