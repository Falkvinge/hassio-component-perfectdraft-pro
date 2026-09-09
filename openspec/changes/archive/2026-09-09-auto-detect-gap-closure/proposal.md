## Why

PR #1 (merged as `d0748e7`) made the card auto-detect the tapped beer from the integration's `keg_product_id` / `keg_name` sensors, and in the same commit deleted the manual beer picker along with the `beer_name` and `beer_entity` config options. The detection mechanism is correct, but its data coverage is not, and with the picker gone there is no longer any way for a user to correct a miss.

Concretely, against the integration's current 114-entry `keg_catalog.json`:

- The card maps only **57 of 114** product IDs. The other 57 fall through to name matching, and most of those fail too, landing on the grey "Custom Beer" placeholder.
- **20 of those unmapped IDs correspond to beers whose keg photography already ships in this repo** — a Kwak keg renders as a grey box while `kegs/kwak.webp` sits unused, purely because the integration says "Kwak" and the card says "Pauwel Kwak".
- When detection fails entirely, `resolveBeer(undefined)` returns `getAllBeers()[0]`, so the card confidently displays **Leffe Blonde** — a specific, wrong beer with full Leffe branding. Previously this path was unreachable because the editor forced a beer selection.
- On 12 IDs the card *does* recognise, it still prefers the integration's catalogue name for the label, so curated names regress into product-listing strings: "Corona Cero" becomes "Corona Cero (0.0% abv)", "Thatchers Gold" becomes "Thatchers Gold Cider".

The integration is the upstream source of truth and has already moved on — commit `3c4b9ca6` grew its catalogue from 86 to 114 entries and cleaned up the names *after* PR #1 was authored. The card's copy was built against the older 86-entry table and is drifting. `README.md` still documents the removed picker and both removed config keys.

## What Changes

- Complete the product-ID coverage to all 114 IDs in the integration catalogue: add `kegId` to 22 existing catalogue entries, and add 35 new entries for beers the card does not yet know.
- Prefer the card's own curated beer name for the label whenever the product ID resolves, falling back to the integration-reported name only for unrecognised IDs.
- Replace the Leffe Blonde fallback with an explicit, honest "no keg detected" state so the card never invents a beer.
- **BREAKING (repair)** — reinstate `beer_name` as an optional manual override for unrecognised or mis-detected kegs, restoring the escape hatch PR #1 removed and re-enabling the `custom_beers` config that is currently unreachable.
- Surface a clear message when the paired integration is too old to expose the keg sensors, instead of silently showing a wrong or empty beer.
- Fix the `_resolveEntities` latch so keg sensors appearing after first resolve are still discovered.
- Establish a repeatable way to check the card's mapping against the integration catalogue, so this drift is detectable rather than silent.
- Update `README.md` to match the shipped behaviour and bump the card version.

## Capabilities

Note: `openspec/specs/` is currently empty — capability specs for this project live in the unarchived `perfectdraft-card` and `card-layouts-and-imagery` changes. The modified capabilities below refer to those established capability names.

### New Capabilities
- `keg-auto-detection`: How the card resolves the tapped beer from the integration's keg sensors — product-ID-first matching, name fallback, manual override precedence, the no-keg and stale-integration states, and entity discovery lifecycle. This behaviour shipped in PR #1 with no spec covering it.

### Modified Capabilities
- `beer-catalog`: Catalogue entries gain a `kegId` product-ID field, coverage becomes a stated requirement tied to the integration catalogue, and lookup by product ID is added alongside lookup by name and slug.
- `beer-label`: The label's name source becomes explicitly defined (curated name preferred over integration-reported name), and the no-beer-detected label state is specified.
- `card-config`: `beer_name` returns as an optional manual override rather than a required default; the removed `beer_entity` key stays removed; the unknown-`beer_name` scenario is restated in terms of override rather than primary selection.

## Impact

- `src/beer-catalog.ts` — `kegId` on 57 entries (22 existing, 35 new), product-ID index instead of the current linear scan.
- `src/perfectdraft-card.ts` — detection precedence, label name source, no-keg render state, `_resolveEntities` latch.
- `src/editor.ts` / `src/types.ts` — reinstate the optional `beer_name` override field.
- `README.md` — remove the stale beer-selector and `beer_entity` documentation, document auto-detection and the override.
- `package.json` / `dist/perfectdraft-card.js` — version bump and rebuilt bundle.
- Upstream dependency: requires PerfectDraft integration **0.4.0+** (the release that added `keg_product_id` / `keg_name`). The 114-entry `custom_components/perfectdraft/keg_catalog.json` in that repo is the reference data for this change.
- No new runtime dependencies. Artwork for the 35 new catalogue entries is out of scope; they get brand-tinted fallback art via the existing tiered-visual path.
