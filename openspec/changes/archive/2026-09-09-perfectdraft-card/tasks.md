## 1. Project scaffolding

- [x] 1.1 Initialise `package.json` with project name `perfectdraft-card`, version `0.1.0`, and scripts for build/dev
- [x] 1.2 Add dependencies: `lit` (^3.0), `custom-card-helpers`; devDependencies: `typescript` (^5.0), `rollup`, `@rollup/plugin-typescript`, `@rollup/plugin-node-resolve`, `@rollup/plugin-terser`, `rollup-plugin-copy` (for static assets)
- [x] 1.3 Create `tsconfig.json` targeting ES2021 with strict mode, decorators, and module resolution for Lit
- [x] 1.4 Create `rollup.config.mjs` bundling `src/perfectdraft-card.ts` → `dist/perfectdraft-card.js` as a single ES module with tree-shaking and minification (HACS expects `.js` files in `dist/` matching the repo name)
- [x] 1.5 Create `src/perfectdraft-card.ts` as the entry point with a stub LitElement that registers `perfectdraft-card` and adds to `window.customCards`
- [x] 1.6 Create `.gitignore` additions for `node_modules/`, `dist/`
- [x] 1.7 Verify build produces a single `.js` file under 50KB (stub)

## 2. Card configuration and validation

- [x] 2.1 Define TypeScript interfaces for card config: `PerfectDraftCardConfig` with `device_id`, `beer_name`, `glass_size`, `beer_entity`, `custom_beers`
- [x] 2.2 Implement `setConfig(config)` with validation: require `device_id`; throw on missing with descriptive error instructing user to configure via the visual editor
- [x] 2.3 Implement device-based entity resolution: given a `device_id`, resolve temperature, keg_remaining, and keg_freshness sensor entity IDs by querying `hass` for entities belonging to that device
- [x] 2.4 Implement `getCardSize()` and `getGridOptions()` returning values for full-width landscape card
- [x] 2.5 Implement `getStubConfig(hass)` that auto-discovers PerfectDraft devices and auto-selects the sole device if only one exists

## 3. Beer catalog data

- [x] 3.1 Create `src/beer-catalog.ts` with the `BeerEntry` interface: slug, name, brewery, style, abv, colors (primary, secondary, text), optional image path, optional keg_id
- [x] 3.2 Populate the catalog with ~45 PerfectDraft beers: Leffe variants (Blonde, Brune, Amber, Ruby, Blanche), Stella Artois, Jupiler, Hoegaarden, Kwak, Tripel Karmeliet, Budweiser, Corona, BrewDog, Camden variants, Goose Island variants, Franziskaner, Tiny Rebel variants, Tennent's, Fuller's London Pride, Peroni, Hertog Jan, Hawkstone, and US-market entries (Michelob Ultra, Kona Big Wave, Golden Road Mango Cart, Elysian Space Dust)
- [x] 3.3 Define brand color palettes for each beer (primary, secondary, text colors derived from brand guidelines)
- [x] 3.4 Add a "Custom" fallback entry with generic colors for unlisted beers
- [x] 3.5 Implement catalog lookup functions: `getBeerBySlug(slug)`, `getBeerByName(name)`, `getAllBeers()`, `searchBeers(query)`

## 4. Static beer logo images

- [x] 4.1 Create `src/assets/` directory structure for beer logo images
- [ ] 4.2 Source or create placeholder logo images for the initial catalog beers (optimised PNG/WebP, ~100×150px)
- [x] 4.3 Configure Rollup to copy static assets from `src/assets/` to `dist/assets/` during build
- [x] 4.4 Wire catalog entries to reference their image paths relative to the card's install location

## 5. Core card rendering — two-zone layout

- [x] 5.1 Implement the `render()` method with two-zone CSS Grid/Flexbox layout: label zone (~1/3) and keg zone (~2/3)
- [x] 5.2 Add CSS custom properties for layout breakpoints and zone proportions
- [x] 5.3 Implement the `hass` property setter with device-based entity resolution and change detection — only trigger re-render when temperature, keg_remaining, or keg_freshness values actually change
- [x] 5.4 Handle entity states: extract numeric values from state strings, handle `unavailable`/`unknown` with fallback display (`--`)
- [x] 5.5 Handle device resolution failure: display error message when the configured device or its entities are missing

## 6. Beer label zone (left)

- [x] 6.1 Render the beer logo image (from catalog or custom `image_url`) in the upper portion of the left zone, sized to fit proportionally
- [x] 6.2 Render the temperature display below the logo: frost icon (❄) + value + °C, large readable font
- [x] 6.3 Render the beer name text below the temperature
- [x] 6.4 Apply the beer's brand color palette as the zone's background tinting
- [x] 6.5 Implement the color-only fallback for beers without logo images

## 7. Keg emoji zone (right)

- [x] 7.1 Implement the glasses-remaining calculation: `floor((keg_remaining% / 100 * 6000) / glass_size_mL)`
- [x] 7.2 Render the 🍺 emoji grid using a CSS flex-wrap container with emoji count from the calculation
- [x] 7.3 Implement dynamic font-size scaling based on emoji count (fewer → larger, more → smaller, max 24 must fit)
- [x] 7.4 Render the count label below the grid: "{count} × {size} mL" (or "pint UK"/"pint US" for pint sizes)
- [x] 7.5 Implement the empty keg disaster scene: replace emoji grid with empty-state visual when count is 0

## 8. Glass size selection dialog

- [x] 8.1 Create a modal dialog component (or template part) with the five glass size options: 250 mL, 330 mL, 500 mL, 568 mL (UK pint), 473 mL (US pint)
- [x] 8.2 Highlight the currently selected size in the dialog
- [x] 8.3 Wire tap on keg zone to open the dialog, tap on option to select and close, tap outside to dismiss
- [x] 8.4 Implement `localStorage` persistence: save on select, restore on load, keyed by primary entity ID
- [x] 8.5 Apply config default (`glass_size`) when no `localStorage` value exists

## 9. Beer selection dialog

- [x] 9.1 Create a modal dialog component (or template part) with a scrollable list of all beers from the catalog + custom beers
- [x] 9.2 Add a text filter/search input at the top of the dialog that filters by beer name and brewery (case-insensitive)
- [x] 9.3 Highlight the currently selected beer in the list
- [x] 9.4 Group custom beers separately under a "Custom" heading
- [x] 9.5 Wire tap on label zone to open the dialog, tap on beer to select and close, tap outside to dismiss
- [x] 9.6 On selection: update the label zone (image, name, colors) immediately
- [x] 9.7 Implement `localStorage` persistence: save beer slug on select, restore on load, keyed by primary entity ID
- [x] 9.8 Implement `beer_entity` override: when configured and entity is valid, use entity state to select beer, ignoring localStorage/config

## 10. Freshness warning system

- [x] 10.1 Define CSS custom properties for freshness tiers: `--freshness-border-color`, `--freshness-bg-tint`, `--freshness-animation`
- [x] 10.2 Create CSS `@keyframes` for amber pulse (warning tier), orange pulse (urgent tier), and red pulse (critical tier)
- [x] 10.3 In the `hass` setter, compute the freshness tier from the sensor value and set the corresponding CSS class on the card root element
- [x] 10.4 Render the freshness text indicator in the keg zone when tier is warning or worse: "⏳ Xd fresh", "⚠ X days left — drink up!", "🚨 X days left!", "Keg expired"
- [x] 10.5 Implement the expired state: static red overlay/border with "Keg expired" message
- [x] 10.6 Handle freshness sensor unavailable: no warning indicators, normal color scheme

## 11. Visual card editor (primary configuration UI)

- [x] 11.1 Create `src/editor.ts` with a LitElement that renders the card configuration form
- [x] 11.2 Implement PerfectDraft device auto-discovery: scan `hass` state for `perfectdraft` integration entities, group by HA device, populate a device picker dropdown
- [x] 11.3 Implement single-device auto-selection: when exactly one PerfectDraft device is found, auto-select it and show its name (no action needed from user)
- [x] 11.4 Implement no-device-found state: display a message that the PerfectDraft integration must be installed and configured first
- [x] 11.5 Add remaining editor fields: beer selection (dropdown from catalog), glass size (dropdown of five options), and custom beers section
- [x] 11.6 Fire `config-changed` custom events on all form input changes
- [x] 11.7 Wire `getConfigElement()` in the main card class to return the editor element
- [ ] 11.8 Verify the entire card can be configured from add-card to working display without any YAML editing

## 12. HACS packaging and repository structure

- [x] 12.1 Create `hacs.json` in repository root with `name: "PerfectDraft Card"`, `filename: "perfectdraft-card.js"`, `content_in_root: false`
- [x] 12.2 Verify Rollup outputs to `dist/perfectdraft-card.js` (matching the repo name pattern expected by HACS)
- [x] 12.3 Verify Rollup copies static assets (beer logos) to `dist/assets/` alongside the JS file
- [x] 12.4 Create `README.md` in repository root with: card description, screenshot/preview, HACS installation steps (add as custom repository type Dashboard, install, add resource), manual installation steps (copy `dist/` contents to `www/perfectdraft-card/`, add resource as module), note that configuration is UI-driven (no YAML editing required), YAML reference for power users, required PerfectDraft integration dependency, supported glass sizes
- [ ] 12.5 Add GitHub topics to repository: `home-assistant`, `hacs`, `lovelace`, `custom-card`, `perfectdraft`
- [ ] 12.6 Verify the card loads correctly from both HACS path (`/hacsfiles/perfectdraft-card/perfectdraft-card.js`) and manual path (`/local/perfectdraft-card/perfectdraft-card.js`) as a `module` resource type

## 13. Build verification and testing

- [x] 13.1 Verify final build: single `perfectdraft-card.js` under 50KB (excluding images), no runtime errors in browser console
- [ ] 13.2 Test on a HA dashboard in a desktop browser with mock/real PerfectDraft entities
- [ ] 13.3 Test on NSPanel Pro 120 in landscape: verify layout, emoji rendering, dialog interactions, CSS animations, and overall responsiveness
- [ ] 13.4 Create initial GitHub release tagged `v0.1.0` with built `dist/` contents
