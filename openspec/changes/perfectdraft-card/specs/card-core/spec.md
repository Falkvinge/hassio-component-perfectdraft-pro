## ADDED Requirements

### Requirement: Card registration as custom element
The card SHALL register itself as a custom HTML element named `perfectdraft-card` and appear in the HA card picker.

#### Scenario: Card loaded in Home Assistant
- **WHEN** the card's JS file is loaded as a dashboard resource
- **THEN** `customElements.get('perfectdraft-card')` SHALL return the card class
- **THEN** `window.customCards` SHALL contain an entry with `type: "perfectdraft-card"`, `name: "PerfectDraft Card"`, and a description

#### Scenario: Card added to dashboard
- **WHEN** a user adds `type: custom:perfectdraft-card` to a dashboard view
- **THEN** the card SHALL render without errors given valid configuration

### Requirement: Entity state subscription
The card SHALL subscribe to and reactively display state from the PerfectDraft integration's sensor entities.

#### Scenario: State updates from integration
- **WHEN** the `hass` property is set by Home Assistant with updated entity states
- **THEN** the card SHALL resolve the temperature, keg_remaining, and keg_freshness sensor entities for its configured device
- **THEN** the card SHALL update its display to reflect the new values

#### Scenario: Entity unavailable
- **WHEN** any resolved entity has state `unavailable` or `unknown`
- **THEN** the card SHALL display a fallback indicator (e.g., `--`) for that value instead of crashing

#### Scenario: Device entity resolution failure
- **WHEN** the configured device's sensor entities cannot be resolved from `hass`
- **THEN** the card SHALL display an error message indicating the device or its entities are missing

### Requirement: Two-zone landscape layout
The card SHALL render a two-column layout with the beer label zone on the left (~1/3 width) and the keg emoji zone on the right (~2/3 width).

#### Scenario: Card rendered on NSPanel Pro 120 landscape
- **WHEN** the card renders in a viewport of 1334×750 or similar landscape dimensions
- **THEN** the left zone SHALL occupy approximately one-third of the card width
- **THEN** the right zone SHALL occupy approximately two-thirds of the card width
- **THEN** both zones SHALL fill the full card height

#### Scenario: Card rendered on desktop browser
- **WHEN** the card renders in a standard HA dashboard grid on a desktop viewport
- **THEN** the two-zone layout SHALL scale proportionally to the card's allocated width
- **THEN** content SHALL remain legible at typical card widths (400-800px)

### Requirement: Minimal JS execution footprint
The card SHALL minimise JavaScript execution to perform well on the NSPanel Pro's limited hardware.

#### Scenario: State change handling
- **WHEN** the `hass` property is updated
- **THEN** the card SHALL only re-render DOM elements whose backing data has actually changed
- **THEN** the card SHALL NOT trigger full component re-renders on every hass update

### Requirement: Card sizing for HA layout engines
The card SHALL report its size to HA's layout engines for proper grid placement.

#### Scenario: Masonry view sizing
- **WHEN** `getCardSize()` is called
- **THEN** the card SHALL return a size value appropriate for a full-width, medium-height card

#### Scenario: Sections view grid options
- **WHEN** `getGridOptions()` is called
- **THEN** the card SHALL return grid options indicating it prefers full-width placement
