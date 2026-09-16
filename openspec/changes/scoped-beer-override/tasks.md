## 1. Config surface and detection precedence

- [x] 1.1 In `src/types.ts`, remove `beer_name` from `PerfectDraftCardConfig` and add `beer_overrides?: Record<string, string>`
- [x] 1.2 In `src/perfectdraft-card.ts`, rewrite the first rung of `_updateDetectedBeer` to look up `_config.beer_overrides` by the reported `keg_product_id` state instead of reading `_config.beer_name`
- [x] 1.3 Resolve a matching override's value through the existing `resolveBeer(value, this._config.custom_beers)` path so catalog names, slugs and `custom_beers` entries all work
- [x] 1.4 Confirm no override is consulted when the product ID state is absent, `unknown` or `unavailable`, so the no-keg state is unreachable from config
- [x] 1.5 Track whether the displayed beer came from an override and what detection would have resolved, so the marker in group 2 has both names available
- [x] 1.6 Verify `beer_name` and `beer_entity` in a config load without throwing and leave the card on detection

## 2. Override visibility on the card

- [x] 2.1 Add an override marker element and styles, following the `freshness-indicator` pill precedent
- [x] 2.2 Include the detection-resolved name in the marker when it differs from the override
- [x] 2.3 Render the marker in the layouts that show beer identity: `landscape`, `portrait`, `hero`, `vessel`
- [x] 2.4 Decide and implement the `compact` layout treatment, where horizontal space is tight (open question in design.md)
- [x] 2.5 Confirm the marker is absent whenever no override is applied

## 3. Editor

- [x] 3.1 Remove the `beer_name` dropdown and its `getAllBeers()` import if it becomes unused
- [x] 3.2 Read the live `keg_product_id` state for the selected device from the `translation_key` map `_discoverDevices` already builds
- [x] 3.3 Add the keg-scoped correction control: a beer selector that writes one `beer_overrides` entry keyed by the currently reported product ID
- [x] 3.4 Disable the correction control with an explanation when no product ID is currently reported, without hiding it
- [x] 3.5 List existing `beer_overrides` entries with product ID and beer name, each with a remove control
- [x] 3.6 Remove the `beer_overrides` key entirely when its last entry is removed
- [x] 3.7 Confirm each editor mutation fires `config-changed` and the preview updates

## 4. Documentation and release

- [x] 4.1 Document `beer_overrides` in `README.md`, replacing the `beer_name` override section, including the YAML example
- [x] 4.2 Add an upgrade note stating that `beer_name` is ignored, why, and how to re-apply a correction
- [x] 4.3 State in the README how to confirm which bundle version is running, since the console banner is the only signal
- [x] 4.4 Bump `package.json`, `CARD_VERSION` and `EDITOR_VERSION` to 0.4.0 — all three, so the banner cannot disagree with the release again
- [x] 4.5 Rebuild `dist/perfectdraft-card.js` with `npm run build`

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run check:catalog` clean
- [x] 5.2 Reproduce the original report: a config carrying `beer_name: "Leffe Blonde"` with a keg reporting product ID `1095` SHALL display Leffe Ruby
- [x] 5.3 Verify the recurrence case: an override recorded for one product ID stops applying when the reported ID changes, with no config edit
- [x] 5.4 Verify an override on a product ID absent from the catalog displays the named beer rather than the integration-reported name
- [x] 5.5 Verify the no-keg state still renders "No keg detected" with `beer_overrides` populated
- [x] 5.6 Verify a 0.4.0 config loads on the 0.3.1 bundle without throwing, per the rollback path in design.md
