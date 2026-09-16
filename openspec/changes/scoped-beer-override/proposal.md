## Why

The `beer_name` override reinstated in 0.3.1 has no connection to the keg it corrects, so it outlives that keg and silently misidentifies every later one. This is not hypothetical: a user upgrading from 0.2.0 reported the card showing "Leffe Blonde" while the machine's `keg_name` sensor read "Leffe Ruby". The cause was a dormant `beer_name: Leffe Blonde` in their card YAML, written by the ≤0.2.0 editor — whose "Default Beer" select had no auto option and always wrote the key, with `getStubConfig` seeding `beer_name: "Stella Artois"` on card creation. Every card configured before 0.3.0 therefore carries a value that 0.3.1 promoted into a permanent, invisible detection override.

Dropping the legacy value alone would not fix this. A global override is stale by construction: a user who legitimately sets one today to correct a mis-detected keg gets a wrong card the moment they swap kegs, with nothing on screen explaining why. The card cannot self-heal, because `config-changed` is only honoured while the editor dialog is open — a card cannot rewrite its own Lovelace config. Staleness must therefore be made structurally impossible rather than cleaned up after the fact.

## What Changes

- Scope the manual override to the product ID it corrects, via a new `beer_overrides` map keyed by product ID (e.g. `{ "1095": "Leffe Ruby" }`). An override applies only while the machine reports that ID, so swapping kegs makes it inert with no writes required.
- **BREAKING (repair)** — `beer_name` is removed as a config key and ignored when present, joining `beer_entity` in the ignored-keys list. Auto-detection becomes the default for every existing card, which is the behaviour users upgrading from ≤0.2.0 expect.
- Surface disagreement instead of resolving it silently: when an active override names a different beer than detection resolved, the card SHALL indicate that an override is in effect.
- An override SHALL NOT apply in the no-keg state. With no keg reported there is no ID to match, so the honest "no keg detected" state introduced in 0.3.1 is preserved rather than being papered over by a stale name.
- Replace the editor's 120-entry "Beer override" dropdown with an action scoped to the currently detected keg — "this keg is detected wrongly" — which captures the reported product ID and writes the map entry. Unrecognised IDs are still valid keys, so this covers kegs the catalogue does not know.
- `custom_beers` stays reachable, now as an override target resolved through the same name/slug/custom path.

## Capabilities

### New Capabilities

None. This change modifies the requirements of existing capabilities.

### Modified Capabilities

- `keg-auto-detection`: Detection precedence changes. The unconditional `beer_name` override at rung 1 is replaced by a product-ID-scoped override that applies only when the reported ID matches an entry in `beer_overrides`. The "Override wins over successful detection" scenario is restated in scoped terms, override behaviour in the no-keg state is specified, and a requirement is added to surface an override that contradicts detection.
- `card-config`: `beer_name` moves from a supported key to an ignored legacy key. `beer_overrides` is added as a product-ID-keyed map. The unknown-override-name scenario is restated against the new key, `custom_beers` is redocumented as an override target, and the editor's beer field is respecified as a keg-scoped correction action.

## Impact

- `src/types.ts` — remove `beer_name`, add `beer_overrides?: Record<string, string>`.
- `src/perfectdraft-card.ts` — `_updateDetectedBeer` precedence, override-conflict state for the label, no-keg interaction.
- `src/editor.ts` — replace the beer dropdown with the keg-scoped correction action; needs the live product-ID state, which the editor does not read today.
- `src/beer-catalog.ts` — no change expected; `resolveBeer` already handles name, slug and custom entries.
- `README.md` — document `beer_overrides`, state that `beer_name` is ignored, and add an upgrade note for users coming from ≤0.2.0 whose cards carry the key.
- `package.json` / `dist/perfectdraft-card.js` — minor version bump to 0.4.0 (config-breaking) and rebuilt bundle. The bundle's console banner is the only way a user can confirm which build is running, and 0.3.0 shipped without a bump, so the bump is load-bearing for supportability.
- No integration dependency change: still PerfectDraft integration 0.4.0+ for the keg sensors.
