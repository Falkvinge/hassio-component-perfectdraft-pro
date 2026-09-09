## ADDED Requirements

### Requirement: UI-driven device selection
The card SHALL identify its PerfectDraft device via a visual editor — no manual YAML editing SHALL be required to configure the card.

#### Scenario: Auto-discovery of PerfectDraft devices
- **WHEN** the visual card editor is opened
- **THEN** the editor SHALL scan `hass` state for entities belonging to the `perfectdraft` integration
- **THEN** it SHALL group discovered entities by their HA device registry entry
- **THEN** it SHALL present discovered PerfectDraft devices as selectable options

#### Scenario: Single device auto-selection
- **WHEN** exactly one PerfectDraft device is discovered
- **THEN** the editor SHALL auto-select that device
- **THEN** the user SHALL see the device name displayed but not need to make a selection

#### Scenario: No devices found
- **WHEN** no PerfectDraft devices are discovered in `hass`
- **THEN** the editor SHALL display a clear message: the PerfectDraft integration must be installed and configured first

### Requirement: Device-based entity resolution
The card SHALL derive its sensor entity IDs from the configured device, not from manually entered entity IDs or prefixes.

#### Scenario: Entity resolution at runtime
- **WHEN** the card has a `device_id` in its config
- **THEN** the card SHALL resolve the temperature, keg_remaining, and keg_freshness sensor entities associated with that device
- **THEN** the card SHALL use those resolved entities for all display values

#### Scenario: Device removed or unavailable
- **WHEN** the configured `device_id` no longer exists in HA or has no associated entities
- **THEN** the card SHALL display an error indicating the device is not found
- **THEN** the error SHALL suggest re-configuring the card via the editor

### Requirement: Configuration validation
The card SHALL validate its configuration and display clear errors for invalid config.

#### Scenario: Missing device configuration
- **WHEN** the card config has no `device_id`
- **THEN** the card SHALL throw an error during `setConfig()` that triggers HA's built-in error card display
- **THEN** the error message SHALL instruct the user to configure the card via the visual editor

#### Scenario: Invalid glass_size value
- **WHEN** the card config specifies a `glass_size` that is not one of the supported values (250, 330, 500, 568, 473)
- **THEN** the card SHALL fall back to the default of 330 mL

#### Scenario: Unknown beer_name
- **WHEN** the card config specifies a `beer_name` that does not match any beer in the catalog (built-in or custom)
- **THEN** the card SHALL treat it as a custom beer with that name and use a generic color palette

### Requirement: Visual card editor
The card SHALL provide a graphical configuration editor as the primary means of configuration.

#### Scenario: Editor registration
- **WHEN** `getConfigElement()` is called on the card class
- **THEN** it SHALL return a custom element that renders a configuration form
- **THEN** `getStubConfig()` SHALL return a minimal valid configuration for new card creation (auto-selecting the sole device if only one exists)

#### Scenario: Editor fields
- **WHEN** the visual editor is displayed
- **THEN** it SHALL provide: a device picker (dropdown of discovered PerfectDraft devices), beer selection (dropdown from catalog), glass size (dropdown of five options), and an option to add custom beers
- **THEN** all fields SHALL be UI controls — no freeform text input for entity IDs

#### Scenario: Editor fires config-changed events
- **WHEN** the user changes any editor field
- **THEN** the editor SHALL fire a `config-changed` custom event with the updated config
- **THEN** the card preview SHALL update to reflect the change

### Requirement: Custom beers configuration
The card SHALL support extending the beer catalog via the `custom_beers` config array, configurable through the visual editor.

#### Scenario: Custom beer entry structure
- **WHEN** a `custom_beers` array entry is provided in config
- **THEN** it SHALL require at minimum a `name` field (string)
- **THEN** it SHALL accept optional fields: `color_primary` (CSS color), `color_secondary` (CSS color), `color_text` (CSS color), `image_url` (URL string), `brewery` (string), `style` (string), `abv` (number)

#### Scenario: Custom beers in selection dialog
- **WHEN** the beer selection dialog is opened
- **THEN** custom beers SHALL appear in the list after built-in catalog entries
- **THEN** custom beers SHALL be visually distinguishable (e.g., grouped under a "Custom" heading)

### Requirement: YAML remains valid for power users
While not required, the YAML config SHALL remain a valid and complete representation so power users can edit it directly if they choose.

#### Scenario: YAML round-trip
- **WHEN** a card is configured via the visual editor
- **THEN** the resulting YAML SHALL contain all settings as readable key-value pairs
- **THEN** editing that YAML directly and saving SHALL produce the same card behaviour as the editor
