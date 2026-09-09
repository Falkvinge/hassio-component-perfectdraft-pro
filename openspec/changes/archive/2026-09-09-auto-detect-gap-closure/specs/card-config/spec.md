## ADDED Requirements

### Requirement: Optional manual beer override
The card SHALL accept an optional `beer_name` config value that overrides auto-detection, so a user is never stuck with a wrong or unrecognised beer.

#### Scenario: Override absent
- **WHEN** the card config has no `beer_name`
- **THEN** the card SHALL rely entirely on auto-detection
- **THEN** `getStubConfig()` SHALL NOT populate `beer_name`, so newly created cards start with detection only

#### Scenario: Override set
- **WHEN** the card config sets `beer_name`
- **THEN** the card SHALL display the beer resolved from that value regardless of what the keg sensors report

#### Scenario: Override presented as optional in the editor
- **WHEN** the visual editor is displayed
- **THEN** the beer override field SHALL be empty by default and SHALL be labelled as an override for when detection is wrong
- **THEN** clearing the field SHALL remove `beer_name` from the config and return the card to detection

## MODIFIED Requirements

### Requirement: Device-based entity resolution
The card SHALL derive its sensor entity IDs from the configured device, not from manually entered entity IDs or prefixes.

#### Scenario: Entity resolution at runtime
- **WHEN** the card has a `device_id` in its config
- **THEN** the card SHALL resolve the temperature, keg_remaining, keg_freshness, keg_product_id, and keg_name sensor entities associated with that device
- **THEN** the card SHALL use those resolved entities for all display values

#### Scenario: Device removed or unavailable
- **WHEN** the configured `device_id` no longer exists in HA or has no associated entities
- **THEN** the card SHALL display an error indicating the device is not found
- **THEN** the error SHALL suggest re-configuring the card via the editor

#### Scenario: Keg sensors missing from an otherwise valid device
- **WHEN** the device resolves and other sensors are found, but the keg_product_id and keg_name sensors are absent
- **THEN** the card SHALL indicate that the PerfectDraft integration needs updating rather than reporting a device error

### Requirement: Configuration validation
The card SHALL validate its configuration and display clear errors for invalid config.

#### Scenario: Missing device configuration
- **WHEN** the card config has no `device_id`
- **THEN** the card SHALL throw an error during `setConfig()` that triggers HA's built-in error card display
- **THEN** the error message SHALL instruct the user to configure the card via the visual editor

#### Scenario: Invalid glass_size value
- **WHEN** the card config specifies a `glass_size` that is not one of the supported values (250, 330, 500, 568, 473)
- **THEN** the card SHALL fall back to the default of 330 mL

#### Scenario: Unknown beer_name override
- **WHEN** the card config specifies a `beer_name` that does not match any beer in the catalog (built-in or custom)
- **THEN** the card SHALL treat it as a custom beer with that name and use a generic color palette
- **THEN** the card SHALL NOT fall back to auto-detection, since an explicit override signals the user's intent

#### Scenario: Removed configuration keys ignored
- **WHEN** the card config contains `beer_entity`, which is no longer supported
- **THEN** the card SHALL ignore it without throwing

### Requirement: Visual card editor
The card SHALL provide a graphical configuration editor as the primary means of configuration.

#### Scenario: Editor registration
- **WHEN** `getConfigElement()` is called on the card class
- **THEN** it SHALL return a custom element that renders a configuration form
- **THEN** `getStubConfig()` SHALL return a minimal valid configuration for new card creation (auto-selecting the sole device if only one exists)

#### Scenario: Editor fields
- **WHEN** the visual editor is displayed
- **THEN** it SHALL provide: a device picker (dropdown of discovered PerfectDraft devices), glass size (dropdown of five options), layout selection, and an optional beer override
- **THEN** all fields SHALL be UI controls — no freeform text input for entity IDs
- **THEN** the editor SHALL NOT present beer selection as a required or default setting

#### Scenario: Editor fires config-changed events
- **WHEN** the user changes any editor field
- **THEN** the editor SHALL fire a `config-changed` custom event with the updated config
- **THEN** the card preview SHALL update to reflect the change

### Requirement: Custom beers configuration
The card SHALL support extending the beer catalog via the `custom_beers` config array, reachable through the `beer_name` override.

#### Scenario: Custom beer entry structure
- **WHEN** a `custom_beers` array entry is provided in config
- **THEN** it SHALL require at minimum a `name` field (string)
- **THEN** it SHALL accept optional fields: `color_primary` (CSS color), `color_secondary` (CSS color), `color_text` (CSS color), `image_url` (URL string), `brewery` (string), `style` (string), `abv` (number)

#### Scenario: Custom beer selected by override
- **WHEN** `beer_name` matches the `name` of a `custom_beers` entry
- **THEN** the card SHALL display that custom beer using its configured colors and image
