# Fonts

Both display weights the design uses are installed and wired up in `../../styles.css`:

| File | Weight | Figma name | Used for |
| --- | --- | --- | --- |
| `Articulat_CF_Extra_Bold.otf` | 800 | Extra Bold | section headings (`.h2`), card titles, speaker names, hero stat figures |
| `Articulat_CF_Heavy.otf` | 900 | Heavy | hero headline, nav links, buttons, most eyebrows, footer headings |

Nothing further to do.

## Format

Served as OTF (~68KB each) because that's what was supplied and there's no converter installed
here. Fine for a prototype. To roughly halve them for production:

```
brew install woff2
woff2_compress Articulat_CF_Extra_Bold.otf
woff2_compress Articulat_CF_Heavy.otf
```

then in `../../styles.css` change each `format("opentype")` to `format("woff2")` and the `.otf`
extensions to `.woff2`.
