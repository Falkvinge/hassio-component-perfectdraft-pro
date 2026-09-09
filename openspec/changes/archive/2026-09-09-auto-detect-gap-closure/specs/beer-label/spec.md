## MODIFIED Requirements

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

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Beer selection dialog
**Reason**: The beer is now detected from the integration's keg sensors rather than chosen by the user, so a modal picker on the label zone is redundant and misleading — a selection made there would be overwritten on the next update. The dialog, its search field, and its custom-beer grouping were removed when auto-detection landed.

**Migration**: Users who need to correct or force the displayed beer should set the `beer_name` override in the card's visual editor, which takes precedence over detection. Users whose keg is not recognised should expect this to be fixed by extending the catalog's product ID coverage rather than by selecting manually.

### Requirement: Beer selection persistence
**Reason**: There is no longer a user selection to persist. Persisting a beer choice in `localStorage` would also actively conflict with detection, since a stale stored value could contradict the keg actually in the machine. The `beer_entity` precedence scenario this requirement described no longer applies, as that config key was removed.

**Migration**: The `localStorage` beer key is no longer read or written and can be ignored; it is orphaned data on existing installations. Glass size persistence is unaffected and continues to work as before. A durable preference for a specific beer is expressed as the `beer_name` override in config, which persists as part of the dashboard configuration rather than per-browser.
