## Why

There is no visual companion for the PerfectDraft Pro Home Assistant integration. The sibling project (`Hassio-PerfectDraftPro`) exposes 9 sensors (temperature, keg remaining %, connection, door, pours, last pour, firmware, mode, keg freshness) but there is no purpose-built way to display this data. Users mounting a Sonoff NSPanel Pro 120 in their kitchen or bar area want a glanceable, full-screen card that shows what matters: what beer is on tap, how cold it is, and how many glasses are left.

## What Changes

- **New custom Lovelace card** (`perfectdraft-card`) built with Lit + TypeScript, bundled as a single JS file for installation via HACS or manual copy to `/config/www/`.
- **Beer catalog**: Built-in list of ~45 PerfectDraft beers with names, brewery, style, ABV, brand color palettes, and static logo images. Extensible via card config for custom/unlisted beers. Future-proofed for automatic keg identification if the sibling integration cracks the API's product ID mapping.
- **Glasses-remaining pictogram**: The card's centrepiece — a grid of beer emojis (🍺) representing how many glasses remain in the keg, derived from the `keg_remaining` percentage sensor and a user-selected glass volume.
- **Glass size selector**: Tap-to-dialog on the emoji zone opens a modal to choose between 250 mL, 330 mL, 500 mL, 568 mL (UK pint), or 473 mL (US pint). Selection persists in `localStorage`.
- **Beer selector**: Tap-to-dialog on the label zone opens a scrollable list of PerfectDraft beers. Selected beer determines the displayed name, logo image, and color palette.
- **Freshness warning**: Escalating CSS-driven visual alerts when keg freshness drops below 14 days — subtle amber hint at 14d, pulsing orange at 7d, aggressive red pulse at 3d, "expired" overlay at 0d. All via CSS `@keyframes`, no JS animation loops.
- **Empty keg state**: When `keg_remaining` is 0%, the emoji grid is replaced with a "disaster scene" empty state.
- **NSPanel Pro 120 optimised**: Layout designed for 1334×750 landscape, lightweight JS, CSS-driven animations, static images only. Tested against the limited hardware of the Sonoff NSPanel Pro running HA Companion on rooted Android.
- **Display-only by default**: No controls visible on screen — all interaction is via tap (beer picker) and tap (glass size dialog). Clean, glanceable display.

## Capabilities

### New Capabilities
- `card-core`: Card registration, configuration schema, LitElement lifecycle, entity subscription, and rendering pipeline. The structural skeleton of the custom card.
- `beer-catalog`: Built-in PerfectDraft beer database with names, breweries, styles, ABV, color palettes, and static logo images. Supports user-extensible entries via card config and future automatic identification from integration entities.
- `keg-display`: Glasses-remaining emoji pictogram derived from keg volume sensor and selected glass size. Dynamic emoji sizing based on count. Includes the glass size selection dialog.
- `beer-label`: Left-zone display showing beer logo/image, name, and live temperature reading. Includes the beer selection dialog.
- `freshness-warning`: Escalating CSS-driven visual alerts based on keg freshness sensor value, from subtle amber through pulsing red to expired overlay.
- `card-config`: YAML configuration schema and visual card editor for entity mapping, beer selection, glass size default, and custom beer entries.
- `hacs-packaging`: Repository structure, hacs.json manifest, README, and build output conforming to HACS plugin (Dashboard) requirements for one-click installation.

### Modified Capabilities

(none — greenfield project)

## Impact

- **New files**: Entire project is new — TypeScript source, Rollup build config, beer catalog data, static image assets, package.json, README.
- **Dependencies**: Lit 3.x, TypeScript 5.x, Rollup for bundling, custom-card-helpers for HA types.
- **Integration dependency**: Requires the `perfectdraft` custom integration from the sibling project to be installed, providing sensor entities (`sensor.perfectdraft_pro_temperature`, `sensor.perfectdraft_pro_keg_remaining`, `sensor.perfectdraft_pro_keg_freshness`, etc.).
- **Distribution**: Single bundled `.js` file, installable via HACS custom repository or manual copy to `/config/www/`.
- **Target hardware**: Sonoff NSPanel Pro 120 (1334×750, Android, HA Companion app, limited CPU/RAM). Must stay under ~50KB JS bundle (excluding images). All animations CSS-only.
- **Multi-device**: The integration supports multiple PerfectDraft Pro machines. This version assumes a single device (one card instance = one machine, configured via entity prefix). Multi-device selection (device picker when deviceCount > 1) is deferred to v0.2.
