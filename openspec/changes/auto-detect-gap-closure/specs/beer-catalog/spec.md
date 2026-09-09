## ADDED Requirements

### Requirement: Product ID mapping to the integration catalog
Each catalog entry SHALL be able to carry the PerfectDraft product ID of its keg, so the card can join against the product ID reported by the integration.

#### Scenario: Entry carries a product ID
- **WHEN** a catalog entry corresponds to a keg listed in the integration's `keg_catalog.json`
- **THEN** the entry SHALL carry a `kegId` field holding that product ID as a string

#### Scenario: Full coverage of the integration catalog
- **WHEN** the card is loaded
- **THEN** every product ID present in the integration's bundled keg catalog SHALL be carried by exactly one card catalog entry
- **THEN** no `kegId` SHALL appear on more than one entry
- **THEN** no `kegId` SHALL reference a product ID absent from the integration catalog

#### Scenario: Lookup by product ID
- **WHEN** the card looks up a beer by product ID
- **THEN** the lookup SHALL resolve without scanning the catalog linearly, using an index built once at module load alongside the existing slug and name indexes

### Requirement: Catalog coverage is verifiable
The project SHALL provide a repeatable check that the card's product ID mapping agrees with the integration's keg catalog, so drift is detected rather than discovered by users.

#### Scenario: Check detects a missing mapping
- **WHEN** the integration catalog contains a product ID that no card catalog entry carries
- **THEN** the check SHALL fail and SHALL name the unmapped product ID and its integration-reported name

#### Scenario: Check detects a stale or duplicate mapping
- **WHEN** a card catalog entry carries a `kegId` that is absent from the integration catalog, or two entries carry the same `kegId`
- **THEN** the check SHALL fail and SHALL name the offending entries

#### Scenario: Check is offline
- **WHEN** the check runs
- **THEN** it SHALL compare against a committed snapshot of the integration catalog and SHALL NOT require network access

## MODIFIED Requirements

### Requirement: Built-in PerfectDraft beer database
The card SHALL include a built-in catalog of PerfectDraft beers with metadata for display purposes.

#### Scenario: Catalog data structure
- **WHEN** the card is loaded
- **THEN** each beer entry in the catalog SHALL contain: a unique slug (kebab-case), display name, brewery name, style, ABV (number), and a brand color palette (primary color, secondary color, text color)
- **THEN** each entry MAY additionally carry a `kegId` product ID, a keg image path, and a brewery logo reference

#### Scenario: Catalog coverage
- **WHEN** the card is loaded
- **THEN** the catalog SHALL include an entry for every keg the paired integration can identify, and MAY include further entries for beers the integration does not list

### Requirement: Custom beer entries via configuration
The card SHALL support user-defined beer entries that extend or override the built-in catalog, reachable through the `beer_name` override.

#### Scenario: Custom beer defined in config
- **WHEN** the card config includes a `custom_beers` array with entries containing at minimum a `name` field
- **THEN** those beers SHALL be resolvable by the `beer_name` override alongside built-in entries
- **THEN** custom entries SHALL support optional fields: `color_primary`, `color_secondary`, `color_text`, `image_url`, `brewery`, `style`, `abv`

#### Scenario: Custom beer overrides built-in
- **WHEN** a custom beer entry has the same slug as a built-in beer
- **THEN** the custom entry SHALL override the built-in entry's fields

## REMOVED Requirements

### Requirement: Future automatic beer identification support
**Reason**: This requirement described automatic identification as a future possibility driven by a user-supplied `beer_entity` pointing at an arbitrary sensor. Automatic identification is now the card's primary behaviour, driven by entities the card resolves itself from the configured device, and the `beer_entity` config key no longer exists. The replacement requirements live in the `keg-auto-detection` capability.

**Migration**: Users who set `beer_entity` should remove it; detection now happens without configuration. Users who relied on it to point at a non-standard entity should use the `beer_name` override instead. The `keg_id` lookup this requirement anticipated is now specified as the `kegId` product ID mapping above.
