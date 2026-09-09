## Context

PR #1 established the auto-detection mechanism and the right division of responsibility between the two repos: the **integration owns product ID → beer name** (via its bundled `keg_catalog.json`), and the **card owns product ID → visual identity** (brand colours, keg photography, style metadata). That split is worth preserving — the card is not duplicating the name table, it is joining against it on product ID.

What went wrong is entirely on the card's side of that join. The card's `kegId` coverage was built against an 86-entry snapshot of the integration catalogue; the integration has since grown to 114 entries with cleaned-up names (`3c4b9ca6`). Half the join keys are missing, and the failure modes are unhelpful: an unmatched ID silently renders as either grey "Custom Beer" or, worse, as Leffe Blonde.

Two constraints shape the design. First, the card ships a pre-built `dist/perfectdraft-card.js` and has no test harness, so correctness has to come from a checkable data invariant rather than from unit tests. Second, the integration catalogue is upstream and will keep growing, so any fix that is a one-time hand-transcription will drift again.

The full hand-verified mapping for all 57 unmapped IDs, plus the 12 label divergences, is in [`keg-id-mapping.md`](./keg-id-mapping.md).

## Goals / Non-Goals

**Goals:**

- Every one of the 114 product IDs the integration can report resolves to a catalogue entry with sensible branding.
- No unmapped or absent keg ever causes the card to display a beer that is not in the machine.
- A user can override detection when it is wrong, without editing YAML by hand.
- Mapping drift against the upstream catalogue becomes detectable rather than silent.
- The 20 already-shipped keg photos that are currently unreachable become reachable.

**Non-Goals:**

- New keg photography for the 35 new catalogue entries. They use existing brand-tinted fallback art; adding photos is a separate content change.
- Any modification to the integration. Its sensors and catalogue are treated as a fixed upstream contract.
- Reinstating the in-card beer *picker* dialog. PR #1 was right that tapping the label to choose a beer is the wrong primary interaction once detection works; the override belongs in the config editor.
- Auto-fetching the integration catalogue at runtime. The card must work with no extra network access and no assumptions about the integration's file layout.

## Decisions

### 1. Curated name wins the label whenever the product ID resolves

PR #1 chose `validName ?? live.name`, commented as "authoritative PerfectDraft name wins". The premise is wrong: the integration catalogue is closer to a product listing than a display name, carrying pack sizes and qualifiers ("Corona Cero (0.0% abv)", "Kopparberg Strawberry and Lime Cider"), and at the time PR #1 was written it also carried short-date and BBE strings.

Precedence becomes:

1. `beer_name` override, if set → resolve through the existing name/slug/custom path.
2. Product ID match → curated catalogue entry, **curated name used verbatim**.
3. No ID match but a usable reported name → generic palette carrying the reported name (existing `resolveBeer` behaviour).
4. Nothing usable → explicit no-keg state.

The integration's name is still valuable at step 3, where it is the only information available. Rejected alternative: normalising the integration's names by stripping suffixes with regexes. That is a guessing game against upstream copy changes, and the card already has a curated name for exactly these IDs.

### 2. Explicit no-keg state instead of a catalogue-order fallback

`resolveBeer(undefined)` returning `getAllBeers()[0]` is a latent bug that PR #1 promoted into a reachable state. The fix is to stop calling `resolveBeer(undefined)` for the not-detected case and render a distinct state instead: neutral palette, no keg photo, and a label that says no keg is detected rather than naming a beer.

`resolveBeer(undefined)` itself changes to return the neutral `custom` fallback rather than the first catalogue entry, so the trap cannot be re-entered from a future call site. Rejected alternative: keeping the card blank. Temperature and freshness are still meaningful with no keg tapped, and an empty card looks broken.

### 3. `beer_name` returns as an override, not a default

The config key comes back with inverted semantics. It was the primary source of truth; it becomes a last-resort override that wins over detection when present. This keeps three things working that PR #1 broke: users with existing YAML, the `custom_beers` feature that is currently orphaned in the types with no reachable entry point, and any keg the catalogue does not know.

The editor gets an optional override field that is empty by default and labelled as an override, so the normal path stays zero-configuration. Rejected alternative: a `beer_overrides` map keyed by product ID. More precise, but it is a new config surface for a rare case, and it cannot help when the ID is unresolved.

### 4. Product-ID lookup gets an index

`getBeerByKegId` is currently `CATALOG.find(...)`, a linear scan on every render, in a module that already builds `slugIndex` and `nameIndex` at load. It becomes a third `Map` built in the same loop. Minor performance point, but the real motivation is that building the index is where duplicate `kegId` values become detectable.

### 5. Drift detection as a build-time check, not a runtime feature

A `npm run check:catalog` script compares the card's `kegId` set against a copy of the integration catalogue committed under `docs/` or `scripts/` as reference data, and fails on: an ID in the integration catalogue with no card entry, a `kegId` not present in the integration catalogue, or a duplicate `kegId`.

This is the substitute for the tests the repo does not have, and it turns "the catalogues have drifted" into a failing command. Committing a snapshot of the upstream catalogue is deliberate: it keeps the check hermetic and makes each upstream sync an explicit, reviewable diff. Rejected alternative: fetching the catalogue from GitHub during the check. Non-hermetic and offline-hostile.

### 6. Stale-integration detection reuses the existing entity resolution

If the device resolves and a temperature sensor is found but neither keg sensor exists, the integration predates 0.4.0. That is distinguishable from "no keg tapped" (sensors exist, states are unknown/unavailable) and deserves its own message pointing at the integration update, because no amount of card configuration will fix it.

This also forces a fix to the `_resolveEntities` early return, `if (this._entityIds.temperature) return;`. That latch predates PR #1 but is now consequential: a user who updates the card before the integration latches on temperature alone and never discovers the keg sensors for the life of the card element. Resolution instead completes when the expected set is found, and re-runs while any are missing.

## Risks / Trade-offs

- **The 35 new catalogue entries need brewery, style, ABV and brand colours researched by hand, and errors there are invisible without the real keg.** → Table B of the mapping reference fixes the ID and name from upstream, so only the cosmetic metadata is judgement. Wrong brand colours degrade to slightly-off tinting, not a wrong beer name. Keep the palettes conservative where the brand is unfamiliar.

- **Table A's mappings are human judgement about which product corresponds to which catalogue entry, and a naive fuzzy match got 5 of 22 wrong.** → Those five are called out explicitly in the reference file. The residual risk is a beer rendering with a close sibling's artwork, which is visibly wrong to the owner of that keg and cheap to correct.

- **Reinstating `beer_name` risks re-normalising manual selection and undoing the point of PR #1.** → It is absent from `getStubConfig`, empty by default in the editor, and labelled as an override. A user who never touches it never sees it.

- **The committed upstream catalogue snapshot will itself go stale.** → It is reference data for a check, not runtime data, so a stale snapshot degrades to a weaker check rather than wrong behaviour. The check's own output names the missing IDs when it is re-synced.

- **Changing 12 existing labels is a visible change for users who currently see the integration's names.** → Table C lists every one so the diff is reviewable. All 12 move toward the more accurate curated name.

## Migration Plan

1. Land the catalogue and lookup changes first (tables A and B). Coverage rises to 100% with no behaviour change beyond more beers resolving.
2. Land the detection precedence, label source and no-keg state. This is where the 12 labels from table C change and where the Leffe Blonde fallback disappears.
3. Reinstate the `beer_name` override in types, editor and detection.
4. Add the catalogue drift check and wire it alongside `npm run lint`.
5. Update `README.md`, bump `package.json` and `EDITOR_VERSION`, rebuild `dist/`.

Rollback is per-step and low-risk: every step is additive to the merged state except step 2, which is the one behavioural change and is revertable on its own.

Users on integration < 0.4.0 see the new stale-integration message. That is a strict improvement over today, where they silently get Leffe Blonde.

## Open Questions

All three were resolved during implementation:

- **Glass matrix in the no-keg state** — shows an empty grid with a `--` count rather than hiding. This falls out of the existing `_renderKegContent` path when keg percentage is unknown, and reads as "machine is empty" rather than "card is broken". Still worth a second look on a real dashboard.
- **`42863` "1L Stein"** — given its own catalogue entry under a `NON-BEER` section, presented as brewery "PerfectDraft", style "Merchandise", 0% ABV, on a neutral grey palette. The ID resolves, and it is not dressed up as a beer.
- **Snapshot location** — `scripts/keg-catalog.reference.json`, next to the check that consumes it, with `_source` and `_upstreamCommit` keys recording provenance.

### Raised by implementation

- `kegId` is modelled as one ID per catalogue entry, which assumes a bijection between upstream product IDs and card entries. That held for all 114 IDs, but only after splitting Northern Monk into two entries. If PerfectDraft ever issues two IDs for a genuinely identical product, this model forces a duplicate entry rather than a list of aliases. Worth revisiting as `kegIds?: string[]` if that case appears; not worth the churn across 114 entries today.
- Brand colours for the 36 new entries are researched judgement, not verified against physical kegs. Wrong values degrade to slightly-off tinting rather than a wrong beer name, and the least familiar brands (`romola`, `via-roma`) were given deliberately conservative palettes.
