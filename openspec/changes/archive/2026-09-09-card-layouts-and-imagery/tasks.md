## 1. Config and types

- [x] 1.1 Add `layout?: "landscape" | "portrait" | "compact" | "hero" | "vessel"` to `PerfectDraftCardConfig` in `src/types.ts`
- [x] 1.2 In `setConfig()`, resolve the active layout: use `config.layout` when valid, otherwise default to `landscape` (unrecognized values fall back without throwing)
- [x] 1.3 Add a `LAYOUTS` constant (value + label) in `src/const.ts` for use by the card and editor
- [x] 1.4 Update `getStubConfig()` so new cards default to (or omit) `layout: landscape`
- [x] 1.5 Add optional `matrix_columns` (`"auto"` | positive integer) and `max_matrix_width` (CSS length string) to `PerfectDraftCardConfig`; validate and ignore malformed values (fall back to `auto` / unset)

## 2. Render dispatch and shared scaffolding

- [x] 2.1 Set a `layout-<name>` class on the `ha-card` root and have `render()` dispatch to a per-layout template method
- [x] 2.2 Extract the current markup into `_renderLandscape()` with no behavioral change (verify visual parity with today)
- [x] 2.3 Confirm `_renderEmojiGrid()`, `_renderEmptyKeg()`, `_renderFreshnessIndicator()`, `_renderGlassDialog()`, and `_renderBeerDialog()` are reused unchanged across layouts
- [x] 2.4 Ensure both dialogs are reachable in every layout (beer dialog + glass size dialog tap targets defined per layout)
- [x] 2.5 Make the keg/label flex zones width-tolerant: add `min-width: 0` so they can shrink below their content width
- [x] 2.6 Replace the viewport-relative emoji size (`min(7vw, 5em)`) with a card-relative size using container-query units (e.g., `clamp(0.6em, 14cqi, 5em)`); establish the container context on the card/keg zone (with a `ResizeObserver` `--emoji-size` fallback if `cqi` is unsupported on the NSPanel WebView)
- [x] 2.7 Support the matrix display options in `_renderEmojiGrid()`: honor an explicit `matrix_columns` count (else keep the auto 5/6 heuristic), and apply `max_matrix_width` as a `max-width` + centering on the grid container

## 3. Tiered visual fallback

- [x] 3.1 Add a brewery→logo mapping and an optional `breweryLogo`/`brewery_slug` field on `BeerEntry` in `src/beer-catalog.ts`
- [x] 3.2 Implement a `resolveBeerVisual(beer)` helper returning the chosen tier: keg photo → brewery logo → generated silhouette → letter
- [x] 3.3 Implement the generated keg/glass silhouette as inline SVG tinted from `beer.colors`, with a contrasting outline/accent for low-contrast palettes
- [x] 3.4 Replace the label-zone image block with the tiered resolver; on `<img>` error, degrade to the next tier instead of showing a broken image
- [x] 3.5 Verify custom beers (no image, default palette) resolve to a tinted silhouette rather than a bare letter

## 4. Layout implementations

- [x] 4.1 `portrait`: stacked label band over keg grid; legible at narrow widths
- [x] 4.2 `compact`: single low-height row (visual + name + temp + remaining indicator); truncate long names; no full grid
- [x] 4.3 `hero`: beer visual as centerpiece/background with overlaid temp/name/count; uses the tiered visual when no photo
- [x] 4.4 `vessel`: single proportionally-filled glass/keg gauge (CSS fill from keg %); count shown as text; visible empty state
- [x] 4.5 Verify freshness styling/indicator and empty-keg state render correctly in each new layout

## 5. Layout-aware sizing

- [x] 5.1 Make `getCardSize()` return a per-layout value (compact short; hero/portrait taller; landscape unchanged)
- [x] 5.2 Make `getGridOptions()` return per-layout columns/rows/min sizes
- [x] 5.3 Relax the placement floor: lower `getGridOptions().min_columns` to 1 and revisit `.card-content` `min-height` so HA offers narrow/short slots

## 6. Imagery sourcing and assets

- [x] 6.1 Source missing keg photos from the regional PerfectDraft storefronts per design D7 (UK: BrewDog Punk/Elvis, Tiny Rebel, Fuller's, Adnams, Theakston, Thornbridge, Tennent's; DE: Diebels, Haake-Beck; ES/IT: La Virgen, Peroni; FR: Castelain Ch'ti; NL: Hertog Jan Grand)
- [x] 6.2 Add sourced keg photos to `src/assets/kegs/` and wire `imagePath: kegImage(slug)` for each newly covered beer
- [x] 6.3 Create `src/assets/breweries/` and add brewery logos covering variant-heavy brands without keg shots (e.g., Leffe seasonals, Gulden Draak, Bud/Bud Light, Goose Island Hazy, Stella Unfiltered)
- [x] 6.4 Note in the catalog which beers remain photo-less by design (seasonal/discontinued) so they intentionally use the silhouette

## 7. Image optimization pipeline

- [x] 7.1 Re-encode bundled keg images to WebP and cap the longest edge per design D8 (target ~600-800px); pick a quality validated in the `hero` layout
- [x] 7.2 Update `kegImage()`/paths and `rollup.config.mjs` copy globs for the new format/locations (kegs + breweries)
- [x] 7.3 Verify `dist/` contains the optimized kegs and brewery logos after build and that total asset weight dropped versus the 1200px PNG set

## 8. Editor and documentation

- [x] 8.1 Add a Layout dropdown to `src/editor.ts` bound to `layout`, firing `config-changed`; bump the editor version marker
- [x] 8.2 Add an Advanced editor section exposing `matrix_columns` and `max_matrix_width`, firing `config-changed`
- [x] 8.3 Update `README.md` with a layout gallery/screenshots and a `layout` / matrix-options YAML reference; note `landscape` is the default
- [x] 8.4 Bump `CARD_VERSION`/`EDITOR_VERSION` and `package.json` version for the release

## 9. Build and verification

- [x] 9.1 Build and confirm the JS bundle stays within budget (images excluded) and there are no console errors
- [x] 9.2 Walk the manual test matrix: each of the 5 layouts × {normal, near-empty, empty} × {normal + each freshness tier} × long beer name × both dialogs
- [x] 9.3 Verify backward compatibility: an existing config with no `layout` renders identically to the pre-change landscape card
- [ ] 9.4 Test `landscape` and `portrait` on the NSPanel Pro 120 first (primary target), then spot-check the others
- [x] 9.5 Cut a release with the new `dist/` assets and update HACS notes
- [x] 9.6 Verify width tolerance: place the card in a narrow column on a wide viewport and confirm no overflow/clipping, emoji shrink with the card, and ghost slots stay fixed; confirm `cqi` works on the NSPanel WebView (else wire the `--emoji-size` fallback)
