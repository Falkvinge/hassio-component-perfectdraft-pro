## Context

The PerfectDraft Card (`src/perfectdraft-card.ts`, Lit + TypeScript, bundled via Rollup) currently renders exactly one layout: a fixed two-zone landscape view (beer label left ~25-30%, emoji keg grid right ~75%) tuned for the Sonoff NSPanel Pro 120 (1334×750). Imagery is used in a single place — a small logo in the label zone — with a first-letter-of-name fallback when no image exists.

Asset state today: 52 of ~75 catalog beers have a keg photo. The photos are 1200×1200 PNGs totalling ~13 MB, shipped in `dist/` and downloaded wholesale by HACS, yet rendered at ~120 px. The ~23 beers without a photo render as a single grey letter on a gradient box. Copyright concern flagged in the original design is now considered settled: using a product's own image as a reference to that product is an established exception to exclusive rights.

Constraints carried over from the original card design: CSS-driven animations only (no JS animation loops), minimal re-render path, ~50 KB JS budget (images are external assets, not bundled). NSPanel Pro 120 landscape remains the owner's primary target, but the card now has external installs on phones, tablets, and portrait panels.

## Goals / Non-Goals

**Goals:**
- Let users **explicitly choose** a layout via card config and the visual editor.
- Ship five layouts: `landscape` (today), `portrait`, `compact`, `hero`, `vessel`.
- Keep `landscape` the default so every existing install is byte-for-byte unchanged in behavior (non-breaking).
- Raise image coverage toward complete for currently-sold beers.
- Replace the bare-letter fallback with a tiered chain so every beer looks intentional.
- Preserve NSPanel performance: layout selection is CSS-class driven, no new animation loops.

**Non-Goals:**
- Automatic/responsive layout switching by viewport (container queries / `ResizeObserver`). Deferred — explicit pick only this round.
- Free-form per-layout theming beyond the five presets.
- Runtime fetching or scraping of images at card load — images remain bundled static assets.
- Multi-device picker (still deferred to a later change).
- Animated emoji/SVG or video imagery.

## Decisions

### D1: Layout is an explicit config enum, default `landscape`
Add `layout?: "landscape" | "portrait" | "compact" | "hero" | "vessel"` to `PerfectDraftCardConfig`, defaulting to `landscape`. The editor exposes a Layout dropdown.

**Alternatives considered:**
- *Auto-responsive via container queries / `ResizeObserver`* — "just works" but unpredictable, harder to test, and adds a JS observation path on the weak NSPanel. Rejected for now; revisit as a future `auto` value once the explicit presets are proven.
- *Separate card types (`perfectdraft-card-compact`, …)* — fragments config, editor, and the HA card picker. Rejected.

**Rationale:** Explicit pick is predictable and keeps the default identical to today, which is what protects existing installs.

### D2: One component, render dispatch by layout
`render()` selects a per-layout template (`_renderLandscape()`, `_renderPortrait()`, …) and sets a `layout-<name>` class on `ha-card`. Shared sub-renderers — `_renderEmojiGrid()`, `_renderEmptyKeg()`, `_renderFreshnessIndicator()`, both dialogs, and the new fallback renderer — are reused unchanged across layouts. Layout differences are primarily CSS (zone arrangement, sizes) over the same data.

**Rationale:** Maximizes reuse, keeps one config/editor/registration, and confines most of the work to CSS.

### D3: The five layouts
- **`landscape`** (default): current two-zone horizontal view. Unchanged.
- **`portrait`**: stacked — label band on top (image + temp + name), emoji grid below. For phones and portrait wall panels.
- **`compact`**: a single low-height row (image thumbnail + name + temp + inline remaining indicator) for dashboards where the card is one of many. Emoji grid collapses to a compact count or mini-bar.
- **`hero`**: image-forward — the keg photo is the centerpiece/background with temperature, name, and count overlaid. Leans on image quality (see D7/D8).
- **`vessel`**: a single glass/keg vessel that fills proportionally to keg %, replacing the N-emoji grid with one calm gauge. Count shown as text.

### D4: Layout-aware HA sizing
`getCardSize()` and `getGridOptions()` return values per layout (e.g., `compact` → 1-2 rows, `hero`/`portrait` → taller, `landscape` → today's values). This keeps masonry and sections views placing each shape sensibly.

### D5: Tiered visual fallback
Resolve a beer's visual in priority order:
1. Keg photo (`imagePath`)
2. Brewery logo (shared asset for the beer's brewery)
3. Generated keg/glass silhouette rendered as **inline SVG**, tinted from the beer's existing `colors` palette
4. First letter of the name (final fallback)

The generated silhouette is inline SVG: zero downloaded asset, scales crisply at any layout size, and themes from data already present. This is what guarantees "every beer looks intentional" even for seasonals, brand-new releases, and custom beers we will never have art for.

**Alternatives considered:** keeping the bare letter (rejected — the original complaint); a single generic keg PNG (rejected — not tinted, looks identical for every unknown beer).

### D6: Brewery logos as shared assets
Add `src/assets/breweries/<brewery-slug>.<ext>` and a brewery→logo map (plus an optional `breweryLogo`/`brewery_slug` hint on `BeerEntry`). One Leffe logo covers Leffe Ambrée/Winter/Noël; one BrewDog logo covers Punk + Elvis Juice; etc. High coverage for few assets, and tier 2 of D5.

### D7: Image sourcing — PerfectDraft regional stores, bundled once
Source the missing keg photos from the PerfectDraft regional storefronts whose catalogs carry them (UK for BrewDog/Tiny Rebel/Fuller's/Adnams/Theakston/Thornbridge/Tennent's; DE for Diebels/Haake-Beck; ES/IT for La Virgen/Peroni; FR for Castelain Ch'ti; plus Hertog Jan Grand). Download once and commit as static assets — same approach used for the existing 52, not runtime scraping. Some beers are seasonal/discontinued and may have no store image; those rely on D5.

### D8: Image sizing / encoding policy
Re-encode bundled keg photos to **WebP** and cap the longest edge at a hero-suitable size (target ~600-800 px) rather than shipping 1200×1200 PNGs. Small layouts downscale via CSS; `hero`/`vessel` still look sharp. This is expected to cut the ~13 MB asset payload substantially while improving the image-forward layouts. Provide a single optimized asset per beer (not multiple resolutions) to keep the pipeline simple.

**Alternatives considered:** keep 1200 px PNG (wasteful for a card that shows one image at a time); per-beer responsive image sets (complexity not justified at this scale).

### D9: Backward compatibility
A missing or unrecognized `layout` value resolves to `landscape`. Existing YAML and editor-produced configs keep working untouched.

### D10: Width-tolerant emoji matrix (no enforced min-width)
The emoji matrix currently imposes an *emergent* minimum width: the flex children (`.label-zone`, `.keg-zone`) default to `min-width: auto`, and the emoji is sized to the viewport (`font-size: min(7vw, 5em)`), so on a wide window the glyphs stay ~5em and a 5-6 wide row cannot shrink below ~480px. `getGridOptions().min_columns: 2` and `min-height: 300px` reserve further space. The card therefore overflows when placed in a column narrower than ~700px.

Confirmed in the field: `assets/cropped-viewport.png` shows a 568 mL grid (5 columns) clipped to ~3.5 columns by the viewport — and because `ha-card` sets `overflow: hidden`, the excess is cropped rather than scrollable. (The same card shows the bare-letter "S" fallback that D5 addresses.)

The fix is CSS-only and applies across all layouts:
- Set `min-width: 0` on the flex zones so they can shrink below their content's intrinsic width.
- Size the emoji relative to the card using container-query units, e.g. `clamp(0.6em, 14cqi, 5em)`, instead of `7vw`.
- Lower `getGridOptions().min_columns` to 1 and relax `min-height` so HA *permits* narrower/shorter slots — without changing the default landscape size at normal widths.

The grid keeps its fixed 5-6 column shape (preserving the greyed ghost-slot design) and simply shrinks to fit.

**Alternatives considered:**
- *An explicit `max_matrix_width` knob* (the original framing) — not the *primary* fix (the real defect is a too-rigid *minimum*, not a missing *maximum*), but added as an additive option in D11 since explicit knobs are welcome.
- *Pure `vw`/`em` sizing* — rejected; it tracks the window, not the card.
- *Column reflow via `auto-fit`* — more tolerant but shifts slot positions as width changes; superseded by the explicit `matrix_columns` knob (D11), which gives the same control without surprising slot movement.
- *`ResizeObserver` setting a `--emoji-size` var* — kept only as a fallback if container-query units prove unavailable on the NSPanel WebView (it fires on resize, not as an animation loop, so it respects the performance rule).

### D11: Explicit emoji-matrix display options
Community preference (HA/modding) favors explicit knobs over magic, so the matrix exposes two optional, layout-independent options:
- `matrix_columns`: `"auto"` (default — the existing 5/6 heuristic, now width-tolerant per D10) or a fixed integer to force a column count. Rows wrap to hold the full-keg slot count.
- `max_matrix_width`: an optional CSS length (e.g., `"480px"`, `"60%"`). When set, the matrix is capped to that width and centered within the keg zone so it does not spread on ultra-wide cards. Default unset.

This also resolves the fixed-vs-reflow question: the default stays fixed-columns-that-shrink (stable ghost slots), and anyone wanting a different shape sets `matrix_columns` explicitly instead of relying on surprising `auto-fit` reflow.

### D12: Secondary layout details (resolved — all backward-compatible)
Parked as open questions; resolved here with defaults that never change an existing `landscape` install (each is opt-in or only engages when space-constrained):
- **`vessel` shape**: a **beer glass** that fills proportionally (reuses the D5 silhouette shape), matching the card's "glasses remaining" metaphor and the 🍺 motif.
- **`hero` treatment**: **full-bleed** beer visual (`object-fit: cover`) with a bottom gradient **scrim** carrying temperature/name/count; the resolved fallback visual fills the same frame when there is no photo.
- **`compact` indicator**: a horizontal **fill bar** sized to keg-remaining %, plus the `"N × size"` count text — no emoji grid (avoids re-introducing the width pressure D10 fixes).
- **`layout` persistence**: **config-only**. `layout`, `matrix_columns`, and `max_matrix_width` are dashboard-authoring settings, not per-session toggles, so they are not written to `localStorage` (beer and glass-size selection remain the only persisted per-device values).
- **Matrix knobs in the editor**: **yes** — exposed in an Advanced section.
- **Container-query units**: use `cqi`; if unavailable on the NSPanel WebView, fall back to the `ResizeObserver` `--emoji-size` path (tasks 2.6 / 9.6) — a verification item, not a design fork.

## Risks / Trade-offs

- **[Test-matrix growth]** Five layouts × empty-keg × five freshness tiers × two dialogs × long beer names is a large manual surface. → Mitigate by sharing sub-renderers (one code path to verify), shipping a layout/state checklist, and prioritizing `landscape` + `portrait` for hardware testing first.
- **[NSPanel performance]** New layouts must not regress the weak panel. → No JS-driven layout *switching*; layout is a static CSS class and width-tolerance is CSS-only (container-query units). A resize-driven `--emoji-size` var is a last-resort fallback only (fires on resize, not an animation loop).
- **[Edge content in tight layouts]** `compact` and `vessel` have little room for long names or 24-glass counts. → Define truncation/min font rules; count shown as text in `vessel`.
- **[Generated silhouette legibility]** Some palettes have light `secondary` or low contrast. → Silhouette uses `primary` fill with a derived contrasting outline/letter; verify against the existing palette set.
- **[Re-encode quality]** WebP/resize could soften hero imagery. → Pick a quality target validated on the `hero` layout; keep original downloads out of `dist/`.
- **[Coverage still imperfect]** A few discontinued beers may remain photo-less. → Acceptable; D5 makes them presentable.

## Open Questions

- **Final D8 numbers**: the exact max image dimension and WebP quality — set by eyeballing a re-encoded sample in the `hero` layout during implementation.

All other previously-parked questions are resolved in **D12** with backward-compatible defaults.
