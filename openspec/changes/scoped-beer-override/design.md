## Context

0.3.1 resolves the displayed beer through four rungs: the `beer_name` config override, a catalogue entry matched on the `keg_product_id` sensor, a beer resolved from the `keg_name` sensor, then the no-keg state. Rung 1 is unconditional and permanent, and that is the defect. The override records "the beer currently in my machine is detected wrongly" but stores it as a global config value with no link to that keg, so it keeps asserting itself after the keg is gone.

Two populations hit this. Cards configured before 0.3.0 all carry a `beer_name`, because the ≤0.2.0 editor's "Default Beer" select had no auto option and `getStubConfig` seeded `beer_name: "Stella Artois"`. 0.3.0 deleted the key and ignored it; 0.3.1 revived the same key with inverted semantics, reactivating those dormant values as detection overrides. The second population is anyone who sets an override correctly today — their card goes wrong at the next keg change.

The binding constraint on any fix: a Lovelace card cannot rewrite its own config. `config-changed` is only honoured while the editor dialog is open, so the card cannot expire or clean up a stale override even when it can prove one is stale. Staleness has to be structurally impossible, or visible enough that the user clears it.

## Goals / Non-Goals

**Goals:**

- A stale override becomes inert without anyone editing config.
- Auto-detection is what an upgraded card does, regardless of what earlier versions wrote into its YAML.
- The escape hatch survives: a keg the catalogue maps to the wrong beer, or does not know at all, can still be corrected without hand-editing YAML.
- The card never silently displays a beer that contradicts what the machine reports.
- The 0.3.1 no-keg honesty property is preserved: no configured value can make the card name a beer that is not in the machine.

**Non-Goals:**

- Correcting the catalogue itself. A mis-mapped product ID should still be reported upstream and fixed in `beer-catalog.ts`; the override is a local stopgap, not a substitute.
- Any change to the integration. Its sensors and `keg_catalog.json` remain a fixed upstream contract.
- Reinstating the in-card beer picker dialog. Corrections belong in the config editor, as decided in the previous change.
- Migrating legacy `beer_name` values to the new key. See decision 2.
- Per-keg glass size, freshness or layout scoping. Only beer identity is keg-scoped.

## Decisions

### 1. The override is keyed by product ID

`beer_overrides` is a map from the product ID string the integration reports to a beer name resolved through the existing `resolveBeer` path (catalogue name, slug, or `custom_beers` entry):

```yaml
beer_overrides:
  "1095": "Leffe Ruby"
```

An entry applies only while `keg_product_id` reports that ID. Swap the keg and the key stops matching, so the correction expires on its own with no writes — which is what makes it viable under the can't-persist constraint. A stale entry costs nothing but a line of YAML, and it becomes useful again if that keg is ever tapped a second time.

The previous change considered and rejected this shape as "a new config surface for a rare case, and it cannot help when the ID is unresolved." The first half is now outweighed: the global key's unbounded lifetime is a correctness bug, not a convenience question. The second half was too quick — an ID that the *catalogue* does not recognise is still a perfectly good map key, and that is precisely the common case for a new beer. The genuine gap is narrower: a machine whose `keg_product_id` is missing or unavailable cannot be corrected this way. Rung 3 (the reported name) already covers that case, and the no-keg state covers the rest.

Rejected alternatives:

- **Keep the global key, gate it with a `config_version` stamp.** Distinguishes legacy values from deliberate ones, which solves the migration but not the recurrence: a deliberate override still goes stale at the next keg change. It also adds a config field whose only purpose is to compensate for a key having had two meanings.
- **Rename the global key** (e.g. `beer_override`). Same objection — it fixes the name collision and nothing about lifetime.
- **Demote `beer_name` to a fallback that applies only when nothing is detected.** Cheap, and stale values become harmless. Rejected because it discards the escape hatch entirely — a keg detected as the wrong beer cannot be corrected at all — and it regresses the no-keg state back to naming a beer that is not in the machine.

### 2. Legacy `beer_name` is ignored, not migrated

Reading the old value into the new map is impossible to do correctly: `beer_name` carries no record of which keg it was for, so there is no ID to key it under. Guessing the currently reported ID would silently manufacture an override the user never asked for, which is the present bug wearing a new key name.

So `beer_name` joins `beer_entity` as a key the card ignores without throwing. There is a precedent for exactly this in `card-config`: `beer_entity` was removed in the same commit that removed `beer_name`, and it got the ignore treatment while `beer_name` was resurrected instead. This restores the symmetry.

The cost falls on anyone who set an override deliberately during 0.3.1's lifetime: their card reverts to auto-detection. That is a short window, the reverted behaviour is correct for most of them (the catalogue now covers all 114 upstream IDs), and re-applying the correction is one editor action. A README upgrade note covers it.

### 3. An override that contradicts detection is shown, not hidden

When an override is active, the card SHALL indicate it, and the indication SHALL carry the name detection resolved so the two are comparable. This is what turns a future stale override from an unexplainable wrong card into something a user can diagnose without reading YAML.

Keep it small: a compact marker adjacent to the beer name, not a dialog. The marker appears whenever an override is applied — including when it agrees with detection, since an agreeing override is still a value the user should know is there. Rejected alternative: show the marker only on disagreement. Slightly quieter, but it hides the override in exactly the case where it is redundant and should be deleted.

The existing `freshness-indicator` element is the styling precedent for a compact status pill on the card.

### 4. Overrides do not apply in the no-keg state

With no keg reported there is no product ID, so no map entry can match and the card falls through to "no keg detected". This is a property of decision 1 rather than a rule to implement, and it is worth stating as a requirement so a future refactor cannot quietly reintroduce a configured value that names an absent beer.

### 5. Overrides live in config, not `localStorage`

Glass size is stored per-browser in `localStorage` because it is a personal preference. A keg correction is a fact about the machine and the catalogue, so it belongs in config: shared across every browser and dashboard, visible in YAML, reviewable, and portable. Storing it per-browser would make two people looking at the same dashboard see different beers.

### 6. The editor writes the override from the live product ID

`_discoverDevices` already builds a `translation_key → entityId` map per device, so `entities.get("keg_product_id")` gives the editor the sensor directly and `hass.states[...]` gives the live value. The 120-entry dropdown is replaced by an action scoped to what is currently tapped — "this keg is detected wrongly" — plus a beer selector, writing a single `beer_overrides` entry keyed by that ID.

The editor also lists existing entries with the beer each names and a remove control, which is how a stale entry from a previous keg becomes visible and clearable. When no product ID is currently reported, the action is disabled with a short explanation rather than hidden, so the feature is discoverable before it is needed.

## Risks / Trade-offs

- **A machine that reports no usable `keg_product_id` cannot be corrected.** → Rung 3 already renders the integration-reported name, and the honest no-keg state covers the rest. Accepted as a documented limitation rather than adding a second, name-keyed override surface for a case that may not exist in practice.

- **`beer_overrides` is a nested map, which is harder to hand-write than a flat string and easy to get wrong** (unquoted numeric keys, wrong ID). → The editor is the supported path and writes the ID itself. An entry whose key never matches is inert, so the failure mode of a typo is "override does nothing", not a wrong beer.

- **Users who set `beer_name` deliberately in 0.3.1 lose their setting on upgrade.** → Ignored rather than erroring, called out in the README upgrade note, and re-applied with one editor action. Weighed against leaving every pre-0.3.0 card silently misidentifying its keg.

- **Stale entries accumulate in config over time.** → They are inert and small. The editor's list makes them visible, and the alternative — the card pruning them — is precluded by the can't-persist constraint.

- **The override marker adds visual noise to a card whose layouts are already dense**, particularly `compact`. → It is a small pill following the `freshness-indicator` precedent, and it only renders when an override is actually applied, which is rare by design.

- **The keg-scoped editor action reads live sensor state, coupling the editor to entity resolution that currently lives in the card.** → The editor already resolves the same entities by `translation_key` for device discovery; this reads one more key from a map it has already built. If that duplication grows, extracting a shared resolver is a separate refactor.

## Migration Plan

1. Types and detection: add `beer_overrides`, remove `beer_name`, ignore it when present, and rewrite the precedence in `_updateDetectedBeer`. At this point every existing card reverts to auto-detection — the behaviour fix lands here on its own.
2. The override marker in the label and the layouts that show beer identity.
3. The editor: keg-scoped correction action plus the existing-overrides list, replacing the dropdown.
4. Spec deltas, README (`beer_overrides`, ignored `beer_name`, upgrade note), version bump to 0.4.0 and rebuilt bundle.

Rollback is a bundle revert. Since step 1 only ignores a key, a card configured under 0.4.0 stays loadable on 0.3.1 — `beer_overrides` is unknown there and ignored, and the card falls back to detection, which is the same behaviour minus the correction.

## Open Questions

- ~~Exact wording and placement of the override marker per layout, especially `compact` and `vessel`, where horizontal space is tight.~~ Resolved in implementation: `landscape` and `portrait` carry the pill in the label zone, `hero` in the scrim, `vessel` under the count. `compact` has no room for a pill, so it prefixes the name with a `⚙` glyph carrying the same explanation in its tooltip. The pill is `inline-block` with a `currentColor` border so it shrink-wraps and reads against both the dark card and the light end of the label palettes.
- Whether the editor's beer selector for a correction should offer the full catalogue or bias toward the detected beer's brewery, which is where sibling mis-mappings cluster.
- Whether a mis-mapping corrected locally should prompt the user to report it upstream, given the fix belongs in the catalogue rather than in every affected user's config.
