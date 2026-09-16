# card-config Specification

## Purpose
TBD - created by archiving change perfectdraft-card. Update Purpose after archive.
## Requirements
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

#### Scenario: Unknown beer name in an override entry
- **WHEN** a `beer_overrides` entry whose key matches the reported product ID names a beer that matches nothing in the catalog (built-in or custom)
- **THEN** the card SHALL treat it as a custom beer with that name and use a generic color palette
- **THEN** the card SHALL NOT fall back to auto-detection, since a matching override signals the user's intent

#### Scenario: Override entry with a malformed key
- **WHEN** a `beer_overrides` key does not correspond to any product ID the machine reports
- **THEN** the card SHALL ignore that entry without throwing
- **THEN** the card SHALL resolve the beer by detection

#### Scenario: Removed configuration keys ignored
- **WHEN** the card config contains `beer_entity` or `beer_name`, neither of which is supported
- **THEN** the card SHALL ignore them without throwing
- **THEN** the card SHALL resolve the beer by detection as though the key were absent

### Requirement: Visual card editor
The card SHALL provide a graphical configuration editor as the primary means of configuration.

#### Scenario: Editor registration
- **WHEN** `getConfigElement()` is called on the card class
- **THEN** it SHALL return a custom element that renders a configuration form
- **THEN** `getStubConfig()` SHALL return a minimal valid configuration for new card creation (auto-selecting the sole device if only one exists)

#### Scenario: Editor fields
- **WHEN** the visual editor is displayed
- **THEN** it SHALL provide: a device picker (dropdown of discovered PerfectDraft devices), glass size (dropdown of five options), layout selection, and a correction control scoped to the currently detected keg
- **THEN** all fields SHALL be UI controls — no freeform text input for entity IDs or product IDs
- **THEN** the editor SHALL NOT present beer selection as a required or default setting
- **THEN** the editor SHALL NOT offer a beer setting that applies regardless of which keg is tapped

#### Scenario: Editor fires config-changed events
- **WHEN** the user changes any editor field
- **THEN** the editor SHALL fire a `config-changed` custom event with the updated config
- **THEN** the card preview SHALL update to reflect the change

### Requirement: Custom beers configuration
The card SHALL support extending the beer catalog via the `custom_beers` config array, reachable through a `beer_overrides` entry.

#### Scenario: Custom beer entry structure
- **WHEN** a `custom_beers` array entry is provided in config
- **THEN** it SHALL require at minimum a `name` field (string)
- **THEN** it SHALL accept optional fields: `color_primary` (CSS color), `color_secondary` (CSS color), `color_text` (CSS color), `image_url` (URL string), `brewery` (string), `style` (string), `abv` (number)

#### Scenario: Custom beer selected by a matching override
- **WHEN** a `beer_overrides` entry matching the reported product ID names the same string as the `name` of a `custom_beers` entry
- **THEN** the card SHALL display that custom beer using its configured colors and image

### Requirement: YAML remains valid for power users
While not required, the YAML config SHALL remain a valid and complete representation so power users can edit it directly if they choose.

#### Scenario: YAML round-trip
- **WHEN** a card is configured via the visual editor
- **THEN** the resulting YAML SHALL contain all settings as readable key-value pairs
- **THEN** editing that YAML directly and saving SHALL produce the same card behaviour as the editor

### Requirement: Keg-scoped beer overrides configuration
The card SHALL accept an optional `beer_overrides` config map, keyed by the product ID the integration reports, so a correction is bound to the keg it corrects.

#### Scenario: Map shape
- **WHEN** a `beer_overrides` value is provided in config
- **THEN** each key SHALL be the product ID string as reported by the `keg_product_id` sensor
- **THEN** each value SHALL be a beer name resolvable against the catalog, a catalog slug, or the `name` of a `custom_beers` entry

#### Scenario: Overrides absent
- **WHEN** the card config has no `beer_overrides`
- **THEN** the card SHALL rely entirely on auto-detection
- **THEN** `getStubConfig()` SHALL NOT populate `beer_overrides`, so newly created cards start with detection only

#### Scenario: Entry recorded against the currently tapped keg
- **WHEN** the user corrects the detected beer from the visual editor
- **THEN** the editor SHALL write a single `beer_overrides` entry keyed by the product ID currently reported for the configured device
- **THEN** the editor SHALL NOT write an entry that is not keyed by a reported product ID

#### Scenario: No product ID currently reported
- **WHEN** the visual editor is displayed AND the configured device reports no usable `keg_product_id` state
- **THEN** the correction control SHALL be shown in a disabled state with an explanation that a keg must be detected first
- **THEN** the editor SHALL NOT be prevented from displaying or removing existing entries

#### Scenario: Existing entries are reviewable and removable
- **WHEN** the visual editor is displayed AND `beer_overrides` contains entries
- **THEN** the editor SHALL list each entry with the product ID and the beer it names
- **THEN** the editor SHALL provide a control to remove an individual entry
- **THEN** removing the last entry SHALL remove `beer_overrides` from the config

