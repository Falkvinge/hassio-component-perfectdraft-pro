## ADDED Requirements

### Requirement: Glasses-remaining emoji pictogram
The card SHALL display the number of remaining glasses in the keg as a grid of 🍺 emoji characters in the right zone.

#### Scenario: Normal keg level
- **WHEN** the `keg_remaining` sensor reports a percentage > 0
- **THEN** the card SHALL calculate glasses remaining as `floor((keg_remaining% / 100 × 6.0L × 1000) / glass_size_mL)`
- **THEN** the card SHALL render that many 🍺 emoji characters in a wrapping grid layout
- **THEN** a text label SHALL display the count and glass size (e.g., "18 × 330 mL")

#### Scenario: Dynamic emoji sizing
- **WHEN** the number of glasses to display changes
- **THEN** the emoji font-size SHALL scale inversely with count — fewer glasses render larger, more glasses render smaller
- **THEN** the maximum count (24 glasses at 250mL from a full keg) SHALL fit within the right zone without scrolling

#### Scenario: Full keg at each glass size
- **WHEN** the keg is 100% full (6.0L)
- **THEN** at 250 mL the card SHALL display 24 emoji
- **THEN** at 330 mL the card SHALL display 18 emoji
- **THEN** at 500 mL the card SHALL display 12 emoji
- **THEN** at 568 mL (UK pint) the card SHALL display 10 emoji
- **THEN** at 473 mL (US pint) the card SHALL display 12 emoji

### Requirement: Empty keg state
The card SHALL display a distinct visual state when the keg is empty.

#### Scenario: Keg at zero
- **WHEN** the `keg_remaining` sensor reports 0% (or the calculated glass count is 0)
- **THEN** the emoji grid SHALL be replaced with an empty-keg disaster scene visual
- **THEN** the disaster scene SHALL clearly communicate that the keg is empty

### Requirement: Glass size selection dialog
The card SHALL provide a modal dialog for selecting the glass volume used in the pictogram calculation.

#### Scenario: Opening the dialog
- **WHEN** the user taps anywhere in the keg emoji zone (right zone)
- **THEN** a modal dialog SHALL appear overlaying the card
- **THEN** the dialog SHALL list five glass size options: 250 mL, 330 mL, 500 mL, 568 mL (UK pint), 473 mL (US pint)
- **THEN** the currently selected size SHALL be visually highlighted

#### Scenario: Selecting a glass size
- **WHEN** the user taps a glass size option in the dialog
- **THEN** the dialog SHALL close
- **THEN** the emoji grid SHALL immediately recalculate and re-render with the new glass size
- **THEN** the count label SHALL update to reflect the new size

#### Scenario: Dismissing without change
- **WHEN** the user taps outside the dialog or taps a close/cancel control
- **THEN** the dialog SHALL close without changing the glass size

### Requirement: Glass size persistence
The selected glass size SHALL persist across page refreshes on the same device.

#### Scenario: Persisting selection
- **WHEN** the user selects a glass size via the dialog
- **THEN** the selection SHALL be saved to `localStorage` keyed by the card's primary entity ID

#### Scenario: Restoring selection
- **WHEN** the card loads and a glass size exists in `localStorage` for this card
- **THEN** the card SHALL use the persisted glass size instead of the config default

#### Scenario: No persisted selection
- **WHEN** the card loads and no glass size exists in `localStorage` for this card
- **THEN** the card SHALL use the `glass_size` value from the card config (defaulting to 330 mL if not specified)
