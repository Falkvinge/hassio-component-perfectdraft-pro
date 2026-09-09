## Context

The PerfectDraft Pro HA integration (sibling project `Hassio-PerfectDraftPro`) cloud-polls `api.perfectdraft.com` every 15 minutes and exposes 9 sensor entities under the `perfectdraft` domain: temperature (°C), keg_remaining (%), connection, door, pours, last_pour (mL), firmware, mode, and keg_freshness (days). The API does not expose the beer name, brand, or product imagery — `GET /api/products/{id}` returns only `{id}`. Investigation of the keg product ID is ongoing in the sibling project.

The target display is a wall-mounted Sonoff NSPanel Pro 120 (4.7" screen, 1334×750 in landscape, rooted Android running HA Companion app). The device has limited CPU/RAM — community reports confirm CSS animations perform well but JS-heavy re-renders cause lag. The card will also work on standard HA dashboards (desktop, tablet) but the NSPanel is the primary design target.

Home Assistant custom cards are Web Components registered via `customElements.define()`, extending `LitElement`. The `hass` object is injected by HA with entity states on every state change. Cards are distributed as single bundled JS files loaded via `/local/` resource references.

## Goals / Non-Goals

**Goals:**
- Glanceable, full-screen display of what beer is on tap, its temperature, and how many glasses remain
- Optimised for NSPanel Pro 120 landscape (1334×750) with minimal JS, CSS-only animations
- Beer identification via manual selection from a built-in catalog, with a clean upgrade path to automatic identification when/if the integration exposes keg product IDs
- Interactive glass size selection via modal dialog (not cycle-tap) to prevent accidental changes
- Escalating visual freshness warnings driven entirely by CSS
- HACS-installable distribution

**Non-Goals:**
- Controlling the PerfectDraft machine (no write operations — the API doesn't support them anyway)
- Displaying all 9 sensors simultaneously — secondary sensors (connection, door, pours, last_pour, firmware, mode) are deprioritised; they can be shown via long-press or a future detail view
- Supporting the NSPanel Pro 86 (480×480 square) — may work but not optimised
- Server-side beer catalog fetching or scraping the PerfectDraft website
- Animated emoji/SVG pictograms — static rendering, recalculated on state change only
- Multi-device picker — the integration supports multiple PerfectDraft Pro machines, but this version assumes one device per card instance (configured via entity prefix). A device selector dialog (shown only when deviceCount > 1) is deferred to v0.2

## Decisions

### D1: Lit 3 + TypeScript with Rollup bundle

**Choice**: Use Lit 3 (LitElement) with TypeScript, bundled via Rollup into a single ES module JS file.

**Alternatives considered**:
- *Vanilla Web Components (no framework)* — more boilerplate, no reactive properties, harder to maintain
- *React/Preact* — heavier runtime, not what HA uses internally, potential conflicts
- *Webpack* — heavier build output, Rollup produces smaller bundles for library-style outputs

**Rationale**: Lit is HA's own framework. The ecosystem expects it. Rollup produces minimal bundles. TypeScript gives type safety for the `hass` object and card config without runtime cost.

### D2: Two-zone layout (label 1/3, keg 2/3)

**Choice**: Fixed two-column layout with the beer label zone on the left (~1/3 width) and the keg emoji grid on the right (~2/3 width).

**Rationale**: Temperature and beer identity are read at a glance from the left. The emoji count — the most dynamic and visually engaging element — gets the majority of screen real estate. On 1334×750, the left zone is ~445px and the right zone is ~889px, both generous for their content.

### D3: Beer emojis (🍺) as native Unicode, not SVG

**Choice**: Use the native 🍺 emoji character for the glasses-remaining pictogram, rendered at dynamic `font-size` via CSS.

**Alternatives considered**:
- *SVG beer glass icons* — controllable styling (partial fill, greyed out), but heavier DOM, more complex rendering, and the NSPanel runs Android which renders Google/Noto emoji well
- *CSS-drawn shapes* — fragile, hard to maintain, not recognisable at small sizes

**Rationale**: Native emoji is zero-weight (no assets), renders natively on Android's Noto emoji set, and scales via `font-size`. The emoji count never exceeds 24 (full keg at 250mL), so DOM node count is trivial. Dynamic font-size based on count: fewer glasses = bigger emoji, more glasses = smaller.

### D4: Beer catalog as static TypeScript data with bundled images

**Choice**: Ship a `beer-catalog.ts` containing ~45 PerfectDraft beer entries with name, brewery, style, ABV, and a brand color palette. Beer logo images are bundled as optimised static assets (PNG/WebP, ~100×150px each) referenced by slug. A "Custom" entry allows free-text beer name with a generic fallback image.

**Alternatives considered**:
- *Fetch catalog from GitHub-hosted JSON* — adds network dependency, fails offline, complicates HACS install
- *Color palette only (no images)* — works but visually flat; user confirmed static images are fine on the NSPanel
- *User-provided image URLs only* — no out-of-box experience

**Rationale**: Only one image is loaded at a time (the current beer). Static bundling avoids network requests and works offline. The color palette remains as a fallback and for the card background tinting. Users can add custom beers with image URLs in the card config.

### D5: Glass size via modal dialog, persisted in localStorage

**Choice**: Tapping the keg emoji zone opens a modal dialog listing the five glass sizes (250mL, 330mL, 500mL, 568mL UK pint, 473mL US pint) with the current selection highlighted. Selection persists in `localStorage` keyed by card entity ID.

**Alternatives considered**:
- *Tap-to-cycle* — too easy to accidentally change without noticing on a wall-mounted panel
- *Config-only (YAML)* — inconvenient to change, requires editing dashboard config
- *HA browser_mod variables* — adds an external dependency

**Rationale**: Dialog prevents accidental changes. `localStorage` survives page refreshes on the same device, which is the NSPanel use case. The config YAML sets a default glass size; `localStorage` overrides it per-device.

### D6: Beer selection via modal dialog with scrollable catalog list

**Choice**: Tapping the label zone opens a modal dialog with a scrollable list of all beers from the catalog. The dialog includes a search/filter input at the top for quick navigation. Selected beer persists in `localStorage` keyed by card entity ID, with the card config's `beer_name` as the initial default.

**Rationale**: Same modal pattern as the glass size dialog for consistency. The catalog is ~45 items — a scrollable list with search is appropriate. Persisting in `localStorage` means different NSPanels can show different beers for the same machine (e.g., if someone wants to test display with different beers), while YAML config sets the default.

### D7: Freshness warning via CSS custom properties and @keyframes

**Choice**: The card sets CSS custom properties (`--freshness-level`) based on the keg_freshness sensor value. CSS rules use these to drive border color, background tint, and pulsing animations entirely through `@keyframes` and `transition`. Four tiers: normal (>14d), warning (7-14d), urgent (3-7d), critical (0-3d), expired (0d).

**Alternatives considered**:
- *JS-driven animation with requestAnimationFrame* — performant on desktop but community reports indicate JS animation loops cause lag on the NSPanel Pro
- *Lit reactive properties driving class toggles* — still causes re-render; CSS custom properties avoid DOM updates entirely

**Rationale**: CSS `@keyframes` animations run on the compositor thread and perform well even on the NSPanel Pro's limited hardware (confirmed by user's experience with other cards). The card's JS only needs to set a CSS variable on state change — no animation loop.

### D8: UI-first card configuration — no manual YAML editing required

**Choice**: All card configuration SHALL be driven through the visual card editor. The editor auto-discovers PerfectDraft devices from `hass.states` and presents them as a dropdown. The user never needs to type entity IDs or edit YAML.

The editor scans `hass.states` for entities matching the `perfectdraft` domain pattern (sensors with `perfectdraft` in their entity ID) and groups them by HA device. If exactly one PerfectDraft device exists, it is auto-selected. If multiple devices exist, the editor presents a device picker dropdown (multi-device selection UI is deferred to v0.2 but the config structure supports it from day one).

The underlying YAML config stores a `device_id` (the HA device registry ID) from which the card derives all entity IDs at runtime. Power users can still edit YAML directly if they choose, but it is never required.

```yaml
type: custom:perfectdraft-card
device_id: "abc123..."              # HA device registry ID (set by editor)
beer_name: "Leffe Blonde"          # default beer (overridable via UI)
glass_size: 330                     # default mL (overridable via UI)
# Future: beer_entity: sensor.perfectdraft_pro_keg_name
custom_beers:                       # extend the built-in catalog
  - name: "My Homebrew IPA"
    color_primary: "#4A7C2E"
    color_secondary: "#F0F7E8"
    image_url: "/local/images/my-ipa.png"
```

**Alternatives considered**:
- *entity_prefix text input* — requires the user to know HA entity naming conventions; error-prone, violates UI-first principle
- *Explicit entity ID mapping* — even worse UX; three entity IDs to type by hand
- *Auto-detect only (no config)* — breaks when multiple devices exist

**Rationale**: The PerfectDraft integration registers a proper HA device per machine. The card editor can query `hass.devices` and `hass.entities` to discover PerfectDraft devices and their associated sensor entities. This means zero manual entity typing. The device_id approach also future-proofs for v0.2 multi-device support — the card already stores which device it's bound to.

### D9: HACS-compatible repository structure

**Choice**: The repository SHALL conform to HACS plugin (Dashboard) requirements: `dist/` directory containing the built JS file named to match the repository (e.g., `perfectdraft-card.js` matching repo `perfectdraft-card` or `Hassio-PerfectDraftPro-Component`), `hacs.json` manifest in the root, `README.md` with installation and configuration instructions, and GitHub releases with tagged versions.

**Alternatives considered**:
- *Content in root* (`content_in_root: true`) — simpler but mixes source and distribution; HACS prefers `dist/` for plugin repos with build steps
- *No HACS support (manual install only)* — limits adoption, makes updates painful

**Rationale**: HACS is the de facto standard for HA community distribution. The `dist/` approach keeps source and build output separate. HACS scans `dist/` first for `.js` files matching the repo name. Non-JS assets (beer logo images) co-located in `dist/` are downloaded alongside the card file. The `hacs.json` manifest provides the display name and filename hint.

### D10: Future-proofing for automatic beer identification

**Choice**: The card config supports an optional `beer_entity` field pointing to a sensor that provides the beer name or product ID. When present and the entity has a valid state, it overrides the manual `beer_name` selection. The beer catalog includes an optional `keg_id` field per entry for future mapping.

**Rationale**: The sibling integration is exploring the API's product ID. If cracked, a new sensor entity would expose the keg identity. The card should be ready to consume it without a redesign — just add `beer_entity` to the config.

## Risks / Trade-offs

**[Beer catalog goes stale]** → PerfectDraft rotates seasonal beers. The hardcoded catalog will miss new releases. Mitigation: the "Custom" entry and `custom_beers` config let users add any beer. Catalog updates ship with card version bumps. Could add a GitHub-hosted JSON fetch as a future enhancement.

**[Emoji rendering varies across Android versions]** → The NSPanel Pro runs a specific Android version; the 🍺 emoji should render consistently via Noto. If a future Android update changes the emoji, the visual impact is cosmetic only. Mitigation: could add an option to use an SVG beer icon instead of native emoji in a future version.

**[localStorage cleared on browser/app update]** → Glass size and beer selection would reset to config defaults. Acceptable — these are quick to re-select via the dialog. The config YAML values serve as the persistent fallback.

**[NSPanel Pro performance unknown for this specific card]** → While the user confirms CSS animations work and static images are fine, the specific combination hasn't been tested. Mitigation: keep the JS render path minimal, avoid frequent DOM updates, profile on the device during development.

**[50KB JS budget may be tight with beer catalog]** → ~45 beer entries with metadata is small (~5KB JSON), but bundled Lit adds ~15-20KB. Images are separate static assets, not in the JS bundle. Should be achievable.

**[Copyright of beer logos]** → Bundling beer brand logos may raise trademark concerns for a publicly distributed card. Mitigation: start with color palettes as the guaranteed visual; logos can be provided separately or by the user via `image_url`. Evaluate fair use / community card precedent before including brand logos in the distribution.
