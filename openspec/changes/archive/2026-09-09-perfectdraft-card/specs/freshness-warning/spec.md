## ADDED Requirements

### Requirement: Tiered freshness warning system
The card SHALL display escalating visual warnings based on the keg freshness sensor value, using four severity tiers.

#### Scenario: Fresh keg (more than 14 days remaining)
- **WHEN** the `keg_freshness` sensor reports a value greater than 14
- **THEN** the card SHALL display no freshness warning indicators
- **THEN** the card SHALL use its normal color scheme and no animation

#### Scenario: Warning tier (7-14 days remaining)
- **WHEN** the `keg_freshness` sensor reports a value between 7 and 14 (inclusive)
- **THEN** the card SHALL display a subtle amber-tinted border
- **THEN** a freshness text indicator SHALL appear showing the days remaining (e.g., "⏳ 12d fresh")

#### Scenario: Urgent tier (3-6 days remaining)
- **WHEN** the `keg_freshness` sensor reports a value between 3 and 6 (inclusive)
- **THEN** the card SHALL display an orange pulsing border via CSS `@keyframes` animation
- **THEN** a warning message SHALL appear (e.g., "⚠ 5 days left — drink up!")

#### Scenario: Critical tier (1-2 days remaining)
- **WHEN** the `keg_freshness` sensor reports a value between 1 and 2 (inclusive)
- **THEN** the card SHALL display an aggressive red pulsing border via CSS `@keyframes` animation
- **THEN** an urgent message SHALL appear (e.g., "🚨 2 days left!")

#### Scenario: Expired (0 days remaining)
- **WHEN** the `keg_freshness` sensor reports 0
- **THEN** the card SHALL display a persistent red overlay or border (no pulsing — static danger state)
- **THEN** an expired message SHALL appear (e.g., "Keg expired")

### Requirement: CSS-only animation implementation
All freshness warning animations SHALL be implemented using CSS only, with no JavaScript animation loops.

#### Scenario: Animation technique
- **WHEN** a freshness tier requires pulsing or fading animation
- **THEN** the animation SHALL be implemented via CSS `@keyframes` and `animation` properties
- **THEN** the card's JavaScript SHALL only set CSS custom properties or CSS classes based on the freshness value
- **THEN** no `requestAnimationFrame`, `setInterval`, or `setTimeout` SHALL be used for animation

### Requirement: Freshness sensor unavailable handling
The card SHALL handle the keg freshness sensor being unavailable gracefully.

#### Scenario: Freshness sensor unavailable
- **WHEN** the `keg_freshness` sensor has state `unavailable` or `unknown`
- **THEN** the card SHALL display no freshness warning indicators
- **THEN** the card SHALL use its normal color scheme (same as >14 days)
