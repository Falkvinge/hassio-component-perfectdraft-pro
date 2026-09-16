## ADDED Requirements

### Requirement: Manual override scoped to the reported keg
A manual override SHALL apply only while the machine reports the product ID that override was recorded against, so that a correction cannot outlive the keg it corrects.

#### Scenario: Override applies to the keg it was recorded for
- **WHEN** `beer_overrides` contains an entry whose key equals the state of the `keg_product_id` sensor
- **THEN** the card SHALL display the beer resolved from that entry's value, resolved by catalog name, slug, or matching `custom_beers` entry
- **THEN** the card SHALL use that beer for the name, brand colors, style, ABV, and artwork

#### Scenario: Override does not apply to a different keg
- **WHEN** `beer_overrides` contains entries AND none of their keys equals the reported `keg_product_id` state
- **THEN** the card SHALL ignore every entry and resolve the beer by detection
- **THEN** the card SHALL NOT display any beer named by a non-matching entry

#### Scenario: Override for an unrecognised product ID
- **WHEN** the reported `keg_product_id` matches no catalog entry's `kegId` AND `beer_overrides` contains an entry for that ID
- **THEN** the card SHALL display the beer named by that entry
- **THEN** the card SHALL NOT fall back to the integration-reported keg name

#### Scenario: No override applies when no keg is reported
- **WHEN** the `keg_product_id` sensor reports no usable state AND `beer_overrides` contains entries
- **THEN** the card SHALL enter the no-keg-detected state
- **THEN** the card SHALL NOT display any beer named by `beer_overrides`

#### Scenario: Override entry naming an unknown beer
- **WHEN** a matching `beer_overrides` entry names a beer present in neither the catalog nor `custom_beers`
- **THEN** the card SHALL display that name against the generic color palette
- **THEN** the card SHALL NOT fall back to detection, since a matching override signals the user's intent for this keg

### Requirement: Active override is visible
When the card displays a beer because of an override rather than detection, it SHALL make that visible, so a user can tell an override from a detection result without reading config.

#### Scenario: Override applied
- **WHEN** the card displays a beer resolved from a matching `beer_overrides` entry
- **THEN** the card SHALL render an indication that an override is in effect

#### Scenario: Override contradicts detection
- **WHEN** an override is applied AND detection would have resolved a different beer for the same keg
- **THEN** the indication SHALL identify the beer that detection resolved
- **THEN** the card SHALL NOT silently present the override as a detection result

#### Scenario: No override applied
- **WHEN** the card displays a beer resolved by detection with no matching override
- **THEN** the card SHALL NOT render an override indication

## MODIFIED Requirements

### Requirement: Detection precedence
The card SHALL apply a single, defined precedence order when determining which beer to display.

#### Scenario: Precedence order
- **WHEN** the card determines the beer to display
- **THEN** it SHALL apply the first applicable source in this order: (1) a `beer_overrides` entry whose key matches the reported product ID, (2) a catalog entry matched by reported product ID, (3) a beer resolved from the reported keg name, (4) the no-keg-detected state
- **THEN** no later source SHALL override an earlier one

#### Scenario: Matching override wins over successful detection
- **WHEN** a `beer_overrides` entry matches the reported product ID AND that same product ID also resolves to a different catalog entry
- **THEN** the card SHALL display the beer named by the override entry
- **THEN** the card SHALL indicate that an override is in effect rather than substituting silently

#### Scenario: No configured value can precede detection unconditionally
- **WHEN** the card determines the beer to display
- **THEN** no config value SHALL take precedence over detection except by matching the currently reported product ID
- **THEN** a config value that names a beer without reference to a product ID SHALL NOT affect the displayed beer
