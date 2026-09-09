## 1. Catalog coverage

- [ ] 1.1 Commit a snapshot of the integration's 114-entry `keg_catalog.json` as reference data for the drift check, and note the upstream commit it came from
- [ ] 1.2 Add `kegId` to the 22 existing catalog entries listed in table A of `keg-id-mapping.md`, taking care with the five hand-corrected rows called out beneath that table
- [ ] 1.3 Add the 35 new catalog entries from table B, each with slug, curated name, brewery, style, ABV, brand colors and `kegId`; no `imagePath`, so they fall through to brand-tinted fallback art
- [ ] 1.4 Give `42863` "1L Stein" an entry so the ID resolves, and decide whether it presents as merchandise rather than as a beer
- [ ] 1.5 Replace the linear scan in `getBeerByKegId` with a `kegIdIndex` map built at module load alongside `slugIndex` and `nameIndex`

## 2. Catalog drift check

- [ ] 2.1 Add a `scripts/check-catalog.mjs` that loads the catalog snapshot and the card catalog and reports unmapped integration IDs, card `kegId` values absent upstream, and duplicate `kegId` values
- [ ] 2.2 Wire it as `npm run check:catalog` with a non-zero exit on any finding, and confirm it passes against the completed catalog from section 1
- [ ] 2.3 Verify the check actually fails when a `kegId` is temporarily removed, so it is not silently passing

## 3. Detection precedence and label source

- [ ] 3.1 Change `resolveBeer(undefined)` to return the neutral `custom` fallback instead of `getAllBeers()[0]`, removing the Leffe Blonde trap at its source
- [ ] 3.2 Rework the detection block in `render()` to apply the precedence order from the `keg-auto-detection` spec: override, then product ID, then reported name, then no-keg
- [ ] 3.3 Use the curated catalog name for the label when the product ID resolves, keeping the integration-reported name only for unresolved IDs; this changes the 12 labels in table C
- [ ] 3.4 Move the detection assignment out of `render()` so `_beer` is not mutated during rendering, and confirm no Lit change-in-update warning appears in the console

## 4. No-keg and stale-integration states

- [ ] 4.1 Add an explicit no-keg-detected render state with a neutral palette, no keg photo and no brewery logo, and make sure temperature and freshness still display
- [ ] 4.2 Resolve the open question on whether the glass matrix hides or shows zero in the no-keg state, against a real dashboard
- [ ] 4.3 Detect the case where the device resolves and a temperature sensor exists but neither keg sensor does, and show a message telling the user to update the integration
- [ ] 4.4 Confirm the stale-integration message is visually and textually distinct from the no-keg-detected state

## 5. Manual override

- [ ] 5.1 Reinstate `beer_name` as an optional field in `PerfectDraftCardConfig`, leaving `beer_entity` removed
- [ ] 5.2 Wire the override into detection as the highest-precedence source, including resolution against `custom_beers`
- [ ] 5.3 Add an optional, empty-by-default override field to the editor, labelled as a correction for when detection is wrong, and confirm clearing it removes the key from config
- [ ] 5.4 Confirm `getStubConfig()` does not populate `beer_name`, so new cards start on detection only

## 6. Entity resolution lifecycle

- [ ] 6.1 Replace the `if (this._entityIds.temperature) return;` latch in `_resolveEntities` with a condition that only stops once the expected sensor set is resolved
- [ ] 6.2 Verify that keg sensors added after first render are picked up on a later `hass` update without a browser reload, and that the scan stops once complete

## 7. Documentation and release

- [ ] 7.1 Rewrite the README's beer sections: drop the beer-selector feature bullet, the "select your default beer" setup step and the `beer_entity` YAML line; document auto-detection and the `beer_name` override
- [ ] 7.2 State the PerfectDraft integration 0.4.0+ requirement in the README's Requirements section
- [ ] 7.3 Bump `package.json` and `EDITOR_VERSION`, and refresh the lockfile with the project's normal npm version to avoid unrelated churn
- [ ] 7.4 Run `npm run lint`, `npm run check:catalog` and `npm run build`, and commit the rebuilt `dist/perfectdraft-card.js`
- [ ] 7.5 Confirm the committed bundle is reproducible from source with a clean `npm ci && npm run build`

## 8. Verification against real hardware

- [ ] 8.1 Confirm a recognised keg shows the curated name and correct artwork, checking at least one of the 20 table A entries whose photo was previously unreachable
- [ ] 8.2 Confirm an empty machine shows the no-keg state and never names a beer
- [ ] 8.3 Confirm the override wins over a detected keg, and that removing it returns the card to detection
