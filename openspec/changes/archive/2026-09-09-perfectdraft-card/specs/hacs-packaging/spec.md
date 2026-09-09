## ADDED Requirements

### Requirement: HACS plugin manifest
The repository SHALL include a `hacs.json` manifest in the root that conforms to HACS plugin (Dashboard) requirements.

#### Scenario: hacs.json present and valid
- **WHEN** HACS scans the repository
- **THEN** a `hacs.json` file SHALL exist in the repository root
- **THEN** it SHALL contain a `name` field with a human-readable display name (e.g., "PerfectDraft Card")
- **THEN** it SHALL contain a `filename` field pointing to the built JS file name (e.g., `perfectdraft-card.js`)
- **THEN** it SHALL set `content_in_root` to `false` (build output lives in `dist/`)

### Requirement: dist/ directory with built assets
The repository SHALL contain a `dist/` directory with the built card JS file and any co-located static assets.

#### Scenario: JS file in dist/
- **WHEN** HACS downloads the card
- **THEN** `dist/` SHALL contain a `.js` file whose name matches the repository name (with or without the `lovelace-` prefix)
- **THEN** the JS file SHALL be a self-contained ES module that registers the `perfectdraft-card` custom element

#### Scenario: Static assets in dist/
- **WHEN** the card references static assets (beer logo images)
- **THEN** those assets SHALL be co-located in `dist/` (e.g., `dist/assets/`) so HACS downloads them alongside the JS file

### Requirement: README with installation instructions
The repository SHALL include a `README.md` in the root with complete installation and usage documentation.

#### Scenario: README contents
- **WHEN** a user views the repository or the HACS listing
- **THEN** the README SHALL include: a brief description of what the card does, a screenshot or visual preview, HACS installation steps (add custom repository, install, add resource), manual installation steps (copy to `www/`, add resource), minimal and full YAML configuration examples, a list of required sensor entities from the PerfectDraft integration, and a list of supported glass sizes

### Requirement: GitHub releases for versioning
The repository SHALL use GitHub releases with semantic version tags for HACS version tracking.

#### Scenario: Tagged release
- **WHEN** a new version of the card is published
- **THEN** a GitHub release SHALL be created with a semantic version tag (e.g., `v0.1.0`)
- **THEN** the release SHALL include the built `dist/` assets
- **THEN** HACS SHALL be able to detect and offer the update to users

### Requirement: Repository metadata for HACS discoverability
The repository SHALL include GitHub metadata to support HACS discovery and display.

#### Scenario: GitHub repository settings
- **WHEN** the repository is added to HACS as a custom repository of type "Dashboard" (plugin)
- **THEN** the repository SHALL have a description set on GitHub
- **THEN** the repository SHALL have relevant GitHub topics (e.g., `home-assistant`, `hacs`, `lovelace`, `custom-card`, `perfectdraft`)

### Requirement: Resource registration for HA dashboard
The built JS file SHALL be loadable as a dashboard resource in Home Assistant.

#### Scenario: Resource loaded
- **WHEN** a user adds `/hacsfiles/perfectdraft-card/perfectdraft-card.js` (HACS path) or `/local/perfectdraft-card.js` (manual path) as a dashboard resource with type `module`
- **THEN** the card SHALL register itself and be available for use in dashboard views
- **THEN** the card SHALL appear in the HA card picker with its name and description
