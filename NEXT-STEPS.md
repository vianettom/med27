# Next steps

Status: the Figma implementation and the content audit against <https://medicarians.com/> are
both **done**. What's left is mostly assets and real numbers — things that need sourcing rather
than building.

## Done

- **Programs** section ("There Is More to Medicarians Than Medicare") — 3-up card row.
- **Schedule** section — all four days, from the live schedule.
- **Sponsors** section — reworked to match the live site: each tier is a bordered plate with a
  colour badge and white logo cards inside it. Title (18), Gold (10) and Silver (9) carry the
  real logos, pulled from medicarians.com into `assets/img/sponsors/`. Bronze and Category are
  still placeholder cards and fold away behind the "View All Sponsors" CTA.
- **Logo wall** — 30 named companies, live subheading, "See all who attended" CTA.
- **Speakers** — 26 real speakers with titles and organisations.
- **Audience cards** — the live site's 2–3 bullets per category.
- **Nav** — Tracks and Pass out, Schedule / Sponsors / Contact in.
- **Footer** — the three real contact addresses, Video Library, `#contact` target.
- Fixed a pre-existing dead `#speak` anchor.

## Outstanding

### Needs assets
- **Speaker headshots.** 25 of the 26 cards show a monogram. `assets/img/speaker.png` is a real
  photo of Isaac Bledsoe and is used only on his own card — do not reuse it as a generic
  placeholder, it puts his face under other people's names.
- **Sponsor logos below silver.** Title / Gold / Silver are real logos. The Bronze plate is 12
  blank cards at a guessed count, and the Category plate (FMO / AI / Dental Insurance / VBC
  Provider) is four blank cards with real labels — both are behind the fold. The live site maps
  Category as FMO → Brock · AI → CareCycle · Dental → Guardian · VBC Provider → Oak Street
  Health, so those logos are already downloaded if the tier gets filled in.
- **Logo provenance.** The 37 files in `assets/img/sponsors/` are the live site's WebP exports
  (324 KB total), filenames slugged from each company name. They're the sponsors' own marks —
  fine for a prototype, worth confirming for anything public-facing.

- **"View All Sponsors" CTA** points at `#sponsors` — it needs a real destination, same as
  "See All Who Attended" on the logo wall and "View All Speakers".
- **Company logos on the logo wall.** Same — 30 names currently set in type.

### Needs real data
- **Venue pricing.** `$XX` per night and the `XX/XX` booking cutoff are still Figma
  placeholders. The live site doesn't publish these; it just links "BOOK YOUR ROOM". Either fill
  them in or drop the `.venue-stats` block.
- **Hero stats.** 6,000+ / 3,000+ / 325+ / 100+ came from the Figma and haven't been checked
  against anything. Note the live audience copy says "Network with 4,000+ like-minded players",
  which doesn't obviously reconcile with 3,000+ agents.

### Open questions
- **Video Library** is a real page on the live site with no equivalent here; it's a footer link
  pointing at `#insider`. Either build the section or point it at the live URL.
- **Speaker roster is 2026.** The section is headed "2026 Speaker Spotlight" and the live site
  says the 2027 roster is TBD, so this needs revisiting once 2027 speakers are announced.
- **Footer says © 2027, live says © 2026.** Left as the Figma has it, since the site is for a
  2027 event.
- The live homepage's schedule summary transposes Monday's and Wednesday's content against its
  own schedule page. This follows the schedule page. Worth confirming with whoever owns the
  content.

## Not doing unless asked

- Real form handling — the newsletter still calls `preventDefault()`.
- Any routing. Every CTA is an in-page anchor.
