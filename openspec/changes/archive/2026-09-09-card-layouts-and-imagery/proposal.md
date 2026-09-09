## Why

The PerfectDraft Card ships a single fixed landscape layout (built for the NSPanel Pro 120) and shows a beer's keg photo in only one small spot, falling back to a bare first letter when no photo exists. Now that other people are installing the card on phones, tablets, and portrait wall panels, one layout no longer fits everyone — and ~23 of ~75 catalog beers still render as a lonely letter. This change makes the display shape user-selectable and makes every beer look intentional, whether or not we have its photo.

## What Changes

- Add a `layout` config option letting users explicitly choose how the card displays, with five variants: **landscape** (current), **portrait**, **compact**, **hero**, **vessel**.
- **Default stays `landscape`** so existing installs are visually unchanged — this change is non-breaking.
- The visual card editor gains a **Layout** dropdown.
- Make the emoji matrix **width-tolerant**: it shrinks to fit narrow card placements instead of forcing a min-width wider than the available space — emoji sized relative to the card (not the viewport), flex zones allowed to shrink, and a relaxed Home Assistant placement floor.
- Add explicit **emoji-matrix display options** — `matrix_columns` (`auto` or a fixed column count) and `max_matrix_width` (cap + center the matrix on wide cards) — for the HA/modding crowd who prefer knobs over magic.
- Expand bundled keg product imagery toward full coverage of currently-sold beers, sourced from PerfectDraft regional stores (product images used as references to the product they depict).
- Introduce a **tiered visual fallback**: keg photo → brewery logo → generated keg/glass silhouette tinted with the beer's brand palette → first letter. No beer renders as a bare letter on a plain box anymore.
- Add bundled **brewery logo** assets that cover several variants of a brand at once (e.g., one Leffe logo serves every Leffe entry that lacks its own keg shot).
- Decide and apply an image **sizing/encoding** policy (design.md): hero/vessel layouts can use higher resolution, small-logo layouts cannot, and HACS download weight matters.

## Capabilities

### New Capabilities
- `card-layouts`: User-selectable card layout. Defines the `layout` config option, the five layout variants and their behavior, layout-aware Home Assistant sizing (`getCardSize`/`getGridOptions`), and a backward-compatible default.
- `beer-imagery`: Expanded keg product images plus a tiered visual fallback (keg photo → brewery logo → generated tinted silhouette → letter), brewery logo assets, and the image sourcing/optimization approach.

### Modified Capabilities
- (none as delta files) New requirements are additive and build on the in-flight `card-core`, `card-config`, `beer-catalog`, and `beer-label` capabilities from the `perfectdraft-card` change. The `landscape` layout preserves today's behavior, so no existing requirement is removed or contradicted. When `perfectdraft-card` archives into `openspec/specs/`, these capabilities reconcile there.

## Impact

- **Config / types** (`src/types.ts`): `PerfectDraftCardConfig` gains optional `layout` (enum, default `landscape`), `matrix_columns` (`"auto"` | number), and `max_matrix_width` (CSS length).
- **Card render** (`src/perfectdraft-card.ts`): `render()` dispatches per layout; shared sub-renderers (emoji grid, freshness, dialogs) are reused; `getCardSize()`/`getGridOptions()` vary per layout. New fallback renderer (brewery logo / generated silhouette). The emoji matrix is made width-tolerant via `min-width: 0` on the flex zones, container-relative emoji sizing (replacing `min(7vw, 5em)`), and a lower `getGridOptions().min_columns`.
- **Catalog** (`src/beer-catalog.ts`): add a brewery→logo mapping and an optional `breweryLogo`/`brewery_slug` field; wire new `imagePath`s for newly sourced beers.
- **Assets**: new files under `src/assets/kegs/` (more keg photos) and a new `src/assets/breweries/` (brewery logos), copied to `dist/` by Rollup. Possible re-encode/resize pass; watch HACS download weight and keep the JS bundle out of it (~50 KB budget unaffected — images are external).
- **Editor** (`src/editor.ts`): a Layout dropdown plus an Advanced section for `matrix_columns` and `max_matrix_width`.
- **Docs / HACS**: README layout gallery + version bump; release ships the new `dist/` assets.
- **Targets**: NSPanel Pro 120 remains the primary design target; new layouts broaden phone / tablet / portrait support. Each layout enlarges the manual test matrix (empty keg × freshness tiers × dialogs × long beer names).
