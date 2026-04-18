## ADDED Requirements

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
The card SHALL display the selected beer's name in the left zone below the temperature.

#### Scenario: Beer selected
- **WHEN** a beer is selected (manually or via entity)
- **THEN** the card SHALL display the beer's full name as text in the label zone

### Requirement: Beer selection dialog
The card SHALL provide a modal dialog for selecting the current beer from the catalog.

#### Scenario: Opening the dialog
- **WHEN** the user taps anywhere in the label zone (left zone)
- **THEN** a modal dialog SHALL appear overlaying the card
- **THEN** the dialog SHALL display a scrollable list of all beers from the built-in catalog and any custom beers from config
- **THEN** the dialog SHALL include a text filter/search input at the top for quick navigation
- **THEN** the currently selected beer SHALL be visually highlighted in the list

#### Scenario: Selecting a beer
- **WHEN** the user taps a beer entry in the dialog list
- **THEN** the dialog SHALL close
- **THEN** the label zone SHALL immediately update to show the newly selected beer's logo, name, and color palette

#### Scenario: Filtering the beer list
- **WHEN** the user types in the search input
- **THEN** the list SHALL filter to show only beers whose name or brewery contains the search text (case-insensitive)

#### Scenario: Dismissing without change
- **WHEN** the user taps outside the dialog or taps a close/cancel control
- **THEN** the dialog SHALL close without changing the beer selection

### Requirement: Beer selection persistence
The selected beer SHALL persist across page refreshes on the same device.

#### Scenario: Persisting selection
- **WHEN** the user selects a beer via the dialog
- **THEN** the selection (beer slug) SHALL be saved to `localStorage` keyed by the card's primary entity ID

#### Scenario: Restoring selection
- **WHEN** the card loads and a beer slug exists in `localStorage` for this card
- **THEN** the card SHALL use the persisted beer instead of the config default

#### Scenario: No persisted selection
- **WHEN** the card loads and no beer slug exists in `localStorage` for this card
- **THEN** the card SHALL use the `beer_name` value from the card config

#### Scenario: Entity override takes precedence
- **WHEN** a `beer_entity` is configured and its state is valid
- **THEN** the entity-driven beer selection SHALL take precedence over both `localStorage` and config defaults
