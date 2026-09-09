## ADDED Requirements

### Requirement: Layout selection via configuration
The card SHALL support a `layout` configuration option that selects one of five named layouts, defaulting to `landscape` when unset.

#### Scenario: Layout explicitly configured
- **WHEN** the card config sets `layout` to one of `landscape`, `portrait`, `compact`, `hero`, or `vessel`
- **THEN** the card SHALL render using that layout

#### Scenario: No layout configured
- **WHEN** the card config has no `layout` value
- **THEN** the card SHALL render using the `landscape` layout
- **THEN** the rendered result SHALL be behaviorally identical to the card prior to this change

#### Scenario: Unrecognized layout value
- **WHEN** the card config sets `layout` to a value that is not a known layout
- **THEN** the card SHALL fall back to the `landscape` layout without throwing

#### Scenario: Layout selectable in the visual editor
- **WHEN** the visual card editor is displayed
- **THEN** it SHALL provide a Layout control listing the five layouts
- **THEN** changing the control SHALL fire a `config-changed` event updating `layout`
- **THEN** the card preview SHALL re-render in the chosen layout

### Requirement: Landscape layout
The card SHALL provide a `landscape` layout that preserves the existing two-zone horizontal arrangement: beer label zone on the left (~1/3) and keg emoji zone on the right (~2/3).

#### Scenario: Landscape rendering
- **WHEN** the active layout is `landscape`
- **THEN** the label zone SHALL occupy approximately one-third of the card width on the left
- **THEN** the keg emoji zone SHALL occupy approximately two-thirds on the right
- **THEN** both zones SHALL fill the full card height

### Requirement: Portrait layout
The card SHALL provide a `portrait` layout that stacks the beer label above the keg display for tall/narrow surfaces.

#### Scenario: Portrait rendering
- **WHEN** the active layout is `portrait`
- **THEN** the beer label (image/fallback, temperature, name) SHALL render in an upper band
- **THEN** the keg emoji display SHALL render below it
- **THEN** content SHALL remain legible at narrow widths typical of phones and portrait wall panels

### Requirement: Compact layout
The card SHALL provide a `compact` layout that presents keg status in a single low-height row suitable for dashboards containing many cards.

#### Scenario: Compact rendering
- **WHEN** the active layout is `compact`
- **THEN** the card SHALL render a single horizontal row containing the beer visual, name, temperature, a horizontal fill bar sized to the keg-remaining percentage, and the count text
- **THEN** the card SHALL NOT render the full multi-row emoji grid
- **THEN** overflowing beer names SHALL be truncated rather than wrapping the row

### Requirement: Hero layout
The card SHALL provide a `hero` layout that makes the beer visual the centerpiece with status overlaid.

#### Scenario: Hero rendering with image
- **WHEN** the active layout is `hero` and the beer has a keg photo
- **THEN** the photo SHALL be displayed as the dominant visual element
- **THEN** the photo SHALL fill the card (cover), and temperature, beer name, and remaining count SHALL sit on a gradient scrim so they remain legible against the image

#### Scenario: Hero rendering without image
- **WHEN** the active layout is `hero` and the beer has no keg photo
- **THEN** the card SHALL display the resolved fallback visual (brewery logo or generated silhouette) as the centerpiece

### Requirement: Vessel layout
The card SHALL provide a `vessel` layout that represents remaining keg volume as a single proportionally-filled beer glass instead of a grid of emoji.

#### Scenario: Vessel proportional fill
- **WHEN** the active layout is `vessel` and `keg_remaining` reports a percentage > 0
- **THEN** the card SHALL render one beer-glass vessel filled in proportion to the keg-remaining percentage
- **THEN** the remaining glasses count and glass size SHALL be shown as text

#### Scenario: Vessel empty keg
- **WHEN** the active layout is `vessel` and the keg is empty (0%)
- **THEN** the vessel SHALL render visibly empty
- **THEN** the card SHALL communicate the empty state consistently with other layouts

### Requirement: Consistent behavior across layouts
All layouts SHALL share the same data, interactions, and warning behavior; only the visual arrangement differs.

#### Scenario: Interactions available in every layout
- **WHEN** any layout is active
- **THEN** the user SHALL be able to open the beer selection dialog and the glass size selection dialog from the card
- **THEN** selecting a beer or glass size SHALL update the display and persist exactly as in the landscape layout

#### Scenario: Freshness warnings in every layout
- **WHEN** the keg freshness tier is `warning` or worse
- **THEN** the active layout SHALL surface the freshness indicator and the card-level freshness styling
- **THEN** freshness animations SHALL remain CSS-driven with no added JavaScript animation loop

#### Scenario: Glasses calculation is layout-independent
- **WHEN** the layout changes
- **THEN** the remaining-glasses value SHALL be computed identically (`floor((keg_remaining% / 100 × 6000) / glass_size_mL)`) regardless of layout

### Requirement: Layout-aware card sizing
The card SHALL report sizing to Home Assistant layout engines appropriate to the active layout.

#### Scenario: Sizing reflects layout
- **WHEN** `getCardSize()` or `getGridOptions()` is called
- **THEN** the returned values SHALL reflect the active layout (e.g., `compact` reports a short height; `hero` and `portrait` report taller placements; `landscape` reports its existing values)

### Requirement: Width-tolerant emoji matrix
The emoji matrix SHALL shrink to fit the available card width without overflowing, and SHALL NOT impose a minimum width wider than its container.

#### Scenario: Narrow placement
- **WHEN** the card is placed in a container narrower than its natural content width (e.g., a narrow dashboard column, or a phone in a multi-column view)
- **THEN** the label and keg zones SHALL shrink to fit
- **THEN** the emoji matrix SHALL remain fully visible without horizontal overflow or clipping

#### Scenario: Emoji size tracks the card, not the viewport
- **WHEN** the card is narrow while the browser viewport is wide
- **THEN** the emoji SHALL be sized relative to the card's own width
- **THEN** the emoji SHALL become smaller as the card narrows rather than retaining a fixed viewport-derived size

#### Scenario: Placement floor allows narrow slots
- **WHEN** Home Assistant queries the card's grid options for placement
- **THEN** the card SHALL permit placement in a single grid column and SHALL NOT require a minimum of two columns

#### Scenario: Fixed slot shape preserved
- **WHEN** the matrix shrinks to fit a narrow card
- **THEN** the full-keg slot count and the greyed empty/ghost slots SHALL remain in their fixed grid positions (the grid shrinks to fit rather than changing its column count)

### Requirement: Emoji matrix display options
The card SHALL provide optional configuration to control the emoji matrix's column count and maximum width, independent of the selected layout.

#### Scenario: Default column behavior
- **WHEN** `matrix_columns` is unset or set to `auto`
- **THEN** the card SHALL choose the column count automatically using its built-in heuristic
- **THEN** the matrix SHALL remain width-tolerant

#### Scenario: Explicit column count
- **WHEN** `matrix_columns` is set to a positive integer N
- **THEN** the matrix SHALL render N columns, wrapping the full-keg slot count across as many rows as needed

#### Scenario: Maximum matrix width
- **WHEN** `max_matrix_width` is set to a CSS length
- **THEN** the matrix SHALL NOT exceed that width
- **THEN** the matrix SHALL be centered within the keg zone

#### Scenario: No maximum width configured
- **WHEN** `max_matrix_width` is unset
- **THEN** the matrix SHALL fill the available zone width, subject to the width-tolerant behavior

#### Scenario: Invalid option values
- **WHEN** `matrix_columns` or `max_matrix_width` has a malformed value
- **THEN** the card SHALL ignore the malformed option and fall back to its default (auto columns / no maximum width) without throwing

#### Scenario: Matrix options in the editor
- **WHEN** the visual card editor is displayed
- **THEN** it SHALL provide controls for `matrix_columns` and `max_matrix_width`
- **THEN** changing either control SHALL fire a `config-changed` event and update the card preview
