## ADDED Requirements

### Requirement: Built-in PerfectDraft beer database
The card SHALL include a built-in catalog of PerfectDraft beers with metadata for display purposes.

#### Scenario: Catalog data structure
- **WHEN** the card is loaded
- **THEN** each beer entry in the catalog SHALL contain: a unique slug (kebab-case), display name, brewery name, style, ABV (number), and a brand color palette (primary color, secondary color, text color)

#### Scenario: Catalog coverage
- **WHEN** the card is loaded
- **THEN** the catalog SHALL include entries for the commonly available PerfectDraft beers across European and US markets (at least 40 entries)

### Requirement: Beer logo images
The card SHALL include static logo images for beers in the built-in catalog.

#### Scenario: Image availability
- **WHEN** a beer from the built-in catalog is selected
- **THEN** the card SHALL display the beer's logo image in the label zone
- **THEN** images SHALL be optimised static assets (PNG or WebP) bundled with the card

#### Scenario: Image fallback
- **WHEN** a beer has no logo image available (custom beer or missing asset)
- **THEN** the card SHALL display the beer's brand color palette as the visual background instead of an image

### Requirement: Custom beer entries via configuration
The card SHALL support user-defined beer entries that extend or override the built-in catalog.

#### Scenario: Custom beer defined in config
- **WHEN** the card config includes a `custom_beers` array with entries containing at minimum a `name` field
- **THEN** those beers SHALL appear in the beer selection dialog alongside built-in entries
- **THEN** custom entries SHALL support optional fields: `color_primary`, `color_secondary`, `image_url`

#### Scenario: Custom beer overrides built-in
- **WHEN** a custom beer entry has the same slug as a built-in beer
- **THEN** the custom entry SHALL override the built-in entry's fields

### Requirement: Future automatic beer identification support
The card SHALL support an optional entity-driven beer selection that overrides manual selection.

#### Scenario: beer_entity configured and available
- **WHEN** the card config includes a `beer_entity` field pointing to a valid sensor entity
- **THEN** the card SHALL use that entity's state value to look up the beer in the catalog (by name or by keg_id)
- **THEN** the manually selected beer SHALL be used as a fallback when the entity is unavailable

#### Scenario: beer_entity not configured
- **WHEN** the card config does not include a `beer_entity` field
- **THEN** the card SHALL use the manual beer selection (from `beer_name` config or UI dialog)
