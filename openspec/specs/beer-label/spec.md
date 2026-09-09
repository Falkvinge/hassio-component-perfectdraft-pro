# beer-label Specification

## Purpose
TBD - created by archiving change perfectdraft-card. Update Purpose after archive.
## Requirements
### Requirement: Beer logo display
The card SHALL display the selected beer's logo image in the upper portion of the left zone.

#### Scenario: Beer with logo image
- **WHEN** the selected beer has a logo image available (built-in or custom via `image_url`)
- **THEN** the card SHALL render the image in the label zone, sized to fit without distortion
- **THEN** the image SHALL be loaded as a static asset (no lazy loading or progressive enhancement needed)

#### Scenario: Beer without logo image
- **WHEN** the selected beer has no logo image (e.g., custom beer without `image_url`)
- **THEN** the card SHALL display the beer name in large text against the beer's brand color palette background

### Requirement: Temperature display
The card SHALL display the current beer temperature prominently in the left zone below the beer logo.

#### Scenario: Temperature available
- **WHEN** the temperature sensor reports a numeric value
- **THEN** the card SHALL display the temperature with a cold/frost icon (e.g., ❄) and the value followed by °C
- **THEN** the temperature SHALL be displayed in a large, easily readable font size

#### Scenario: Temperature unavailable
- **WHEN** the temperature sensor is unavailable or unknown
- **THEN** the card SHALL display a placeholder (e.g., "-- °C") instead of the temperature value

### Requirement: Beer name display
The card SHALL display the detected beer's name in the label zone below the temperature, using the card's own curated name where it has one.

#### Scenario: Beer detected
- **WHEN** a beer has been determined by detection or by the `beer_name` override
- **THEN** the card SHALL display that beer's full name as text in the label zone

#### Scenario: Detected by product ID
- **WHEN** the beer was matched by product ID
- **THEN** the displayed name SHALL be the card catalog entry's curated name, not the name reported by the integration

#### Scenario: No beer detected
- **WHEN** no beer could be determined
- **THEN** the label zone SHALL indicate that no keg is detected
- **THEN** the label zone SHALL NOT display the name of any catalog beer

### Requirement: Label zone reflects detection state
The label zone's styling SHALL follow the detection state so a user can tell a detected beer from an undetected one at a glance.

#### Scenario: Beer detected
- **WHEN** a beer has been determined
- **THEN** the label zone SHALL use that beer's brand color palette as its background gradient

#### Scenario: No beer detected
- **WHEN** no beer could be determined
- **THEN** the label zone SHALL use a neutral palette rather than any brand palette
- **THEN** the card SHALL NOT render a keg photograph or brewery logo

### Requirement: Label zone is not a beer picker
The label zone SHALL NOT act as a control for choosing a beer, since the beer is detected rather than chosen.

#### Scenario: Tapping the label zone
- **WHEN** the user taps the label zone in any layout
- **THEN** no beer selection dialog SHALL open

