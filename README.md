# Medicarians Vegas 2027 — prototype

Static, click-through prototype of the Medicarians Vegas 2027 landing page, built from the
[Figma design](https://www.figma.com/design/6wbPIuKFZEt5jGwWaKqKVC/Untitled?node-id=11-1498)
(node `11:1498`), with copy taken from the live site at <https://medicarians.com/>.

The working rule where the two disagree: **Figma wins on layout and styling, the live site wins
on content.** See [NEXT-STEPS.md](NEXT-STEPS.md) for what's still outstanding.

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
index.html      all thirteen sections
styles.css      tokens, section styles, breakpoints at 1180 / 900 / 640px
script.js       mobile nav, sticky-header state, stat count-up, schedule tabs,
                newsletter no-op
assets/img/     hero, venue and speaker photography, the two logo SVGs and the
                three programme logo lockups
assets/fonts/   drop the licensed Articulat CF woff2 files here (see its README)
```

Section order: hero → logo wall → audience → agenda → programs → speakers → schedule →
sponsors → sponsor CTA → venue → newsletter → footer.

## Content

Three sections exist on the live site but not in the Figma, so they were designed against the
existing patterns (`.section-head`, hairline card grids, `.eyebrow`/`.h2`):

- **Programs** — the three sub-programs included with a pass (Agent Symposium, ACA Health
  Summit, Life & Annuities Forum), as a 3-up card row. Each card's heading is the programme's
  own logo lockup; the `h3` takes its accessible name from the image `alt`. The lockups are
  normalised on width rather than height — two of the three share the Medicarians wordmark, and
  matching heights across their different aspect ratios rendered it at two different sizes.
- **Schedule** — the four-day timetable, as day blocks with a label column and time/event rows.
  Weekdays check out against the 2027 calendar: April 11–14 really is Sunday–Wednesday.
- **Sponsors** — Title / Platinum / Gold / Silver tiers, closed by a "View All Sponsors" CTA.
  Deliberately still a placeholder: 37 blank chips, sized by tier so the ranking reads without
  any names. The tier counts are real (1 / 17 / 10 / 9) and each list carries an `aria-label`
  naming its count, since the chips themselves have no text.

Note the live site's own homepage summary transposes Monday's and Wednesday's schedule content;
the order here follows the live schedule proper, where the Kick-Off Party closes Monday, the
pre-conference day.

Placeholder copy that has since been replaced with real content: the logo wall (30 named
companies, 10 per marquee row), the speaker grid (26 real speakers), the audience cards (2–3 bullets each rather
than one paragraph), and the footer's three contact addresses. The sponsor tiers are the one
section left intentionally blank.

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

**Content-driven changes**

- Nav dropped Tracks and Pass (not on the live site) and picked up Schedule, Sponsors and
  Contact — still seven links, so the header's collapse behaviour is unchanged. Contact targets
  the footer, which now carries the three real addresses. Video Library has no section to
  anchor to, so it sits in the footer.
- The speaker grid moved from CSS grid to flex. 26 speakers don't divide evenly by any sensible
  column count, and flex centres the short final row instead of orphaning it hard-left. Only
  `--cols` changes at the breakpoints.
- `speaker.png` is an identifiable photo of one real person (Isaac Bledsoe). Repeating it under
  25 other real people's names would misrepresent them, so it stays on his card only and the
  rest get a monogram. Sourcing the other 25 headshots is still outstanding.

**Mobile** (the Figma has desktop only)

- Header: seven links plus a CTA can't fit, so below 1180px they collapse into a hamburger and
  a slide-down panel that closes on link click, outside click and <kbd>Esc</kbd>.
- Stats 4 → 2 columns, staying 2×2 rather than dropping to one — four stacked stats pushed the
  hero CTA well below the fold. Below 640px the notes are hidden (they ran to three lines each
  in a half-width column) and the figure shrinks to `clamp(22px, 6vw, 30px)` so "6,000+" still
  fits a 108px cell at 320px. The notes are hidden visually, not removed, so a screen reader
  still gets the same content as on desktop.
- Audience cards 3 → 2 → 1. Speakers 5 → 4 → 3 → 2. Programs 3 → 1.
- Schedule: the day label sits beside its rows down to 900px, then stacks above them; each row
  splits time-over-event below 640px.
- Logo wall: the marquee needs no breakpoints — the rows just show fewer cards. Cards shrink
  from 200×84 to 150×68 below 640px.
- Agenda, banners, venue and newsletter go from side-by-side to stacked, with full-width CTAs.
- Footer 4 → 2 → 1 column.

**Prototype behaviour** — no copy added: smooth scrolling to anchors, hover/focus states
throughout, and the newsletter form calling `preventDefault()`. The newsletter field is a real
labelled `<input type="email">` rather than the Figma's static text.

## Glass

The header and the hero stat block use the iOS material recipe: heavy `backdrop-filter` blur
plus `saturate(180%)` (the saturation is what keeps the backdrop from going flat and grey), a
low-alpha fill, a hairline border, and an inset top highlight for the specular edge.

- **The header is `position: fixed` from the first pixel** rather than swapping absolute → fixed
  past the hero, so it's sticky the whole way down. `.is-stuck` now only deepens the glass once
  there's page content behind it instead of the hero.
- **Both blocks have an opaque `@supports not (backdrop-filter)` fallback** — translucent
  *without* blur is unreadable over photography.
- **The mobile nav panel gained `max-height` + scroll.** With a permanently fixed header it
  would otherwise run off the bottom of a short screen with no way to reach the last links.
- **The stat glass is tinted dark rather than neutral.** A white-weighted fill dropped the coral
  stat label to 4.30:1 at 390px, under the 4.5 AA floor. Mixing navy into the fill instead of
  changing the brand coral brings it back to 4.92:1 on mobile and 5.19:1 on desktop.

## Bloom plates

The three flat navy surfaces — agenda, schedule and footer — carry the brand guidelines' **Bloom
Plates** device: two or three soft-edged radial colour fields over ink. Implemented as a
`.section--bloom` modifier with a `::before` layer, tunable per section via `--bloom-a/b/c`,
`--bloom-a-at/b-at/c-at` and `--bloom-strength`.

The existing palette already matched the brand exactly (`#051135`, `#0281fb`, `#00cafc`,
`#fb98b4`, `#043ca7`); only teal `#5ecba1` and magenta `#d949b3` had to be added, and they're
used nowhere except the blooms.

Two adaptations, since the guidelines' plates are full-bleed artwork and these sit behind body
copy:

- **Strength is well below the reference.** 0.20 on the agenda, 0.15 on the schedule, 0.13 on
  the footer, which is nearly all 13–14px link text.
- **Bloom centres are pushed off the reading column**, following the guidelines' own rule to
  "place copy over the calm side". Copy runs top-left in both navy sections, so the centres sit
  right and low. The two sections use different spectrum pairs so they don't read as the same
  plate twice.

Contrast was measured rather than assumed — see Verified.

## Borrowed from Protectors Vegas

Two interactions were modelled on <https://protectorsvegas.com/>, rebuilt in Medicarians' own
tokens rather than ported:

- **Hero stat count-up.** Same easing as theirs (ease-out cubic, 1.6s) driven by
  `data-counter` / `data-counter-suffix` / `data-counter-duration`, but fired by an
  `IntersectionObserver` instead of a scroll handler. Two departures: the real figures are in
  the markup and only zeroed once the animation actually commits — theirs ships `0+` in the
  HTML, which is what a no-JS reader and a crawler see — and `prefers-reduced-motion` skips the
  animation entirely, leaving the numbers static.
- **Schedule day tabs.** One day visible at a time, the day label promoted to a tab, rows
  cascading in on a staggered delay. The active-tab underline reuses the cyan `scaleX` device
  already on the header nav. Built by progressive enhancement — the markup is four plain day
  blocks and `script.js` upgrades them, so with JS off all four days stay stacked and readable.
  Adds full keyboard support (arrow keys, Home/End, roving `tabindex`), which theirs doesn't
  have.
- **Logo wall marquee.** Replaced the hairline grid with three full-bleed rows, the middle one
  reversed, edges faded with a `mask-image` gradient. Pure CSS, no JS. Two fixes over the
  reference: they put the 16px gap on the flex track, which means two copies plus the seam
  between them aren't exactly twice one copy, so `translateX(-50%)` slips half a gap every lap —
  folding the gap into each item's `margin-right` makes the halves exact (measured drift:
  0.0000px on all three rows). And a marquee can't just have its duration zeroed under
  `prefers-reduced-motion`, which would park it mid-loop; it stops outright and the row becomes
  manually scrollable. Rows also pause on hover/focus so a name can actually be read, and the
  duplicate copy is `aria-hidden` so screen readers don't hear the list twice.

## Verified

Driven through headless Chrome over CDP at 320, 375, 390, 430, 540, 640, 768, 900, 1024, 1180,
1280, 1440 and 1920px:

- No horizontal overflow — `document.scrollWidth === viewport` at every width, zero elements
  crossing the edge.
- Every in-page `href="#…"` resolves to an element that exists (no dead anchors).
- No broken image requests.
- Element counts match the source data: 30 logo names across 3 marquee rows (each duplicated,
  60 cards), 26 speakers, 3 programs, 4 days / 26 schedule rows, 4 tiers / 37 sponsors
  (1 + 17 + 10 + 9).
- Marquee loop is seamless: one copy measures exactly half its track on every row, drift 0.0000px.
- Text contrast over the bloom plates: the page is screenshotted with text hidden, the PNG
  decoded, and the actual composited pixel behind each text run sampled. Every run clears WCAG
  AA — tightest is the inactive schedule tab date at 5.98:1 (needs 4.5), then the agenda topic
  number at 6.80:1. Nothing relies on the flat navy still being flat.
- Text contrast over the glass, sampled the same way. Nav links clear AA over every backdrop the
  fixed header passes: 16.93:1 on the hero, 9.18:1 on the cyan newsletter, 7.62:1 at its worst
  over the tinted marquee. Stat text: 13.5:1 figure, 5.19:1 coral label, 15.2:1 note.
- Header reports `top: 0` at scroll positions 0 / 3000 / 6200, and `.is-stuck` toggles at the
  hero boundary.
- Schedule tabs: correct `role`/`aria-selected`/`aria-controls` wiring, exactly one panel
  visible, roving `tabindex`, and arrow-key navigation moving both selection and focus.
- Degraded paths: with script execution disabled all four days and their labels render and all
  26 rows stay readable, and the stats show their real figures; under `prefers-reduced-motion`
  the stats never zero and the row cascade is neutralised.
