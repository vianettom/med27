# Next steps

Status: the Figma implementation and the content audit against <https://medicarians.com/> are
both **done**. What's left is mostly assets and real numbers — things that need sourcing rather
than building.

## Done

- **Programs** section ("There Is More to Medicarians Than Medicare") — 3-up card row.
- **Schedule** section — all four days, from the live schedule.
- **Sponsors** section — Title / Platinum / Gold / Silver tiers, held as 37 blank placeholder
  chips at the real tier counts, plus a placeholder "View All Sponsors" CTA (see below).
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
- **Sponsor names and logos.** The whole tier wall is blank chips by choice — the layout and
  counts are right, the content isn't filled in. The company names from the live site are
  recorded below so they don't have to be re-scraped; dropping them into `.tier__item` in place
  of `.tier__chip` restores the named version. Real logos would need an SVG per company.

  The **Category** tier (FMO / AI / Dental / VBC Provider) has been removed from the page but
  is kept below in case it comes back; it needs a `.tier__cat` label style, which was deleted
  along with it.

  - **Title (1):** Advocate Health Advisors LLC
  - **Platinum (17):** Aetna · Amerilife · Brock · CareCycle · E123 · Empower Brokerage ·
    EnrollHere · Guardian · Gyde · Humana · Innovative Financial Group · Integrity ·
    Physicians Mutual · Senior Market Sales · Spark · SunFireMatrix Inc. · UnitedHealthcare
  - **Gold (10):** Agent Boost · AgentSync · Ambetter Health · CenterWell Senior Primary Care &
    Conviva Care Center · Golden Outlook Insurance Services · Heathos · Mutual of Omaha ·
    Ringba · Seven Figure Medicare Agent · The Baldwin Group Health Insurance
  - **Silver (9):** Medicare Answers Now · Bankers Fidelity · Compass Insurance Advisors LLC ·
    National Contracting Center · Oak Street Health · Pinnacle Financial Services · Sagility ·
    Vanillasoft · VSP Individual Vision Plans
  - **Category (4, removed from the page):** FMO → Brock · AI → CareCycle · Dental → Guardian ·
    VBC Provider → Oak Street Health

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
