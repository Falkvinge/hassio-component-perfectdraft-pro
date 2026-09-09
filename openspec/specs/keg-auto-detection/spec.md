# keg-auto-detection Specification

## Purpose
TBD - created by archiving change auto-detect-gap-closure. Update Purpose after archive.
## Requirements
### Requirement: Tapped beer detected from integration sensors
The card SHALL determine the tapped beer from the PerfectDraft integration's keg sensors without requiring the user to select it.

#### Scenario: Keg sensors resolved for the configured device
- **WHEN** the card has a `device_id` and the device exposes sensors with translation keys `keg_product_id` and `keg_name`
- **THEN** the card SHALL resolve both entity IDs and read their states on every `hass` update
- **THEN** the card SHALL NOT require any beer-related configuration for detection to work

#### Scenario: Product ID matches a catalog entry
- **WHEN** the `keg_product_id` sensor reports a state consisting only of digits that matches the `kegId` of a catalog entry
- **THEN** the card SHALL use that catalog entry for the beer's name, brand colors, style, ABV, and keg artwork

#### Scenario: Product ID does not match but a name is reported
- **WHEN** the `keg_product_id` state is absent, non-numeric, or matches no catalog entry, AND the `keg_name` sensor reports a state other than `unavailable` or `unknown`
- **THEN** the card SHALL resolve the beer by that reported name against the catalog
- **THEN** if the reported name matches no catalog entry, the card SHALL display that name against the generic color palette

### Requirement: Detection precedence
The card SHALL apply a single, defined precedence order when determining which beer to display.

#### Scenario: Precedence order
- **WHEN** the card determines the beer to display
- **THEN** it SHALL apply the first applicable source in this order: (1) the `beer_name` config override, (2) a catalog entry matched by reported product ID, (3) a beer resolved from the reported keg name, (4) the no-keg-detected state
- **THEN** no later source SHALL override an earlier one

#### Scenario: Override wins over successful detection
- **WHEN** `beer_name` is set in config AND the product ID resolves to a different catalog entry
- **THEN** the card SHALL display the beer named by `beer_name`
- **THEN** the card SHALL NOT silently substitute the detected beer

### Requirement: Curated name preferred for the label
When the card recognises the reported product ID, it SHALL use its own catalog name for display rather than the name reported by the integration.

#### Scenario: Product ID resolves and names differ
- **WHEN** the product ID matches a catalog entry AND the `keg_name` sensor reports a different string for the same keg
- **THEN** the card SHALL display the catalog entry's curated name
- **THEN** the card SHALL NOT display the integration-reported name

#### Scenario: Product ID does not resolve
- **WHEN** the product ID matches no catalog entry AND a usable `keg_name` state is reported
- **THEN** the card SHALL display the integration-reported name, as it is the only name available

### Requirement: No-keg-detected state
The card SHALL never display a specific beer that it has not detected, and SHALL make the absence of a detected beer visible.

#### Scenario: Sensors present but no keg reported
- **WHEN** both keg sensors are resolved but neither yields a beer, for example because both report `unknown` or `unavailable`
- **THEN** the card SHALL render a neutral palette with no keg photograph and no brewery logo
- **THEN** the card SHALL display a label indicating that no keg is detected
- **THEN** the card SHALL NOT display the name or branding of any catalog beer

#### Scenario: Detection never falls back to an arbitrary catalog entry
- **WHEN** no beer can be determined from any source in the precedence order
- **THEN** the card SHALL NOT select a beer by catalog position, insertion order, or any other arbitrary rule

#### Scenario: Other sensor values still shown
- **WHEN** the card is in the no-keg-detected state AND the temperature or freshness sensors report usable values
- **THEN** the card SHALL continue to display those values

### Requirement: Integration version guidance
The card SHALL distinguish an out-of-date integration from an empty machine and guide the user accordingly.

#### Scenario: Device resolved but keg sensors absent
- **WHEN** the configured device resolves and a temperature sensor is found, but no sensor with translation key `keg_product_id` or `keg_name` exists for that device
- **THEN** the card SHALL display a message stating that the PerfectDraft integration must be updated to a version that provides the keg sensors
- **THEN** that message SHALL be distinct from the no-keg-detected state

#### Scenario: Keg sensors present but idle
- **WHEN** the keg sensors exist for the device but report no usable value
- **THEN** the card SHALL show the no-keg-detected state and SHALL NOT suggest updating the integration

### Requirement: Entity resolution completes as entities appear
The card SHALL continue attempting entity resolution until the expected sensors are found, so that sensors registered after the card first renders are still discovered.

#### Scenario: Keg sensors appear after initial resolution
- **WHEN** the card has already resolved a temperature entity for its device AND the keg sensors are subsequently added to that device, for example because the user updated the integration
- **THEN** the card SHALL resolve the keg entities on a following `hass` update without requiring a browser reload

#### Scenario: Resolution stops once complete
- **WHEN** all expected sensor entities for the device have been resolved
- **THEN** the card SHALL NOT repeat the registry scan on subsequent `hass` updates

#### Scenario: Configured device changes
- **WHEN** the card's configured `device_id` changes, for example because the user picked a different device in the editor
- **THEN** the card SHALL discard the previously resolved entity IDs and the previously detected beer
- **THEN** the card SHALL resolve entities afresh for the newly configured device
- **THEN** the card SHALL NOT display values read from the previous device

