## ADDED Requirements

### Requirement: Expanded keg image coverage
The built-in catalog SHALL provide keg product images for the PerfectDraft beers currently sold across the regional storefronts, closing the gap left by beers that previously had no image.

#### Scenario: Previously-missing current beer gains an image
- **WHEN** a currently-sold catalog beer that previously had no `imagePath` is displayed
- **THEN** the card SHALL display its keg product image
- **THEN** the image SHALL be a bundled static asset, not fetched at runtime

#### Scenario: Discontinued or unavailable beer
- **WHEN** a catalog beer has no keg image because it is seasonal, discontinued, or otherwise unavailable from any storefront
- **THEN** the card SHALL present it via the tiered visual fallback rather than a bare placeholder

### Requirement: Tiered visual fallback
When a beer's keg photo is unavailable, the card SHALL resolve its visual through an ordered fallback chain so that no beer renders as a bare letter on a plain background.

#### Scenario: Keg photo available
- **WHEN** a beer has a keg photo (`imagePath`, or a custom beer's `image_url`)
- **THEN** the card SHALL display the keg photo

#### Scenario: Brewery logo fallback
- **WHEN** a beer has no keg photo but its brewery has a bundled logo
- **THEN** the card SHALL display the brewery logo

#### Scenario: Generated silhouette fallback
- **WHEN** a beer has neither a keg photo nor a brewery logo
- **THEN** the card SHALL display a generated keg/glass silhouette tinted from the beer's brand color palette

#### Scenario: Runtime image load failure
- **WHEN** a resolved image asset fails to load in the browser
- **THEN** the card SHALL degrade to the next tier in the chain rather than showing a broken image

### Requirement: Generated silhouette is asset-free and palette-tinted
The generated fallback silhouette SHALL be rendered without any downloaded image asset and SHALL derive its appearance from data already present on the beer entry.

#### Scenario: Silhouette uses brand palette
- **WHEN** the generated silhouette is shown
- **THEN** its fill SHALL be derived from the beer's `colors` palette
- **THEN** it SHALL remain legible across light and dark palettes via a contrasting outline or accent

#### Scenario: Silhouette scales with layout
- **WHEN** the generated silhouette is shown in any layout
- **THEN** it SHALL render crisply at that layout's size (including the large `hero` and `vessel` sizes) without pixelation

### Requirement: Brewery logo assets
The card SHALL bundle brewery logo assets that can serve as the fallback visual for multiple beers from the same brewery.

#### Scenario: One logo covers multiple variants
- **WHEN** several catalog beers share a brewery and lack individual keg photos
- **THEN** a single bundled brewery logo SHALL be usable as the fallback visual for all of them

#### Scenario: Brewery logo resolution
- **WHEN** a brewery logo is displayed
- **THEN** it SHALL be loaded as a bundled static asset resolved against the card's install base URL, consistent with keg image resolution

### Requirement: Images sourced as bundled product references
Keg and brewery images SHALL be sourced once from the products' own storefront/brand imagery and committed as bundled static assets; the card SHALL NOT fetch or scrape imagery at runtime.

#### Scenario: No runtime fetching
- **WHEN** the card renders any beer visual
- **THEN** it SHALL reference only bundled assets (or a user-provided `image_url`) and SHALL NOT perform network scraping of external storefronts

#### Scenario: Assets copied into the distribution
- **WHEN** the card is built
- **THEN** keg images and brewery logos SHALL be copied into `dist/` alongside the card JS so HACS and manual installs receive them

### Requirement: Optimized image encoding
Bundled keg images SHALL be encoded to keep download weight reasonable while remaining sharp in the image-forward layouts.

#### Scenario: Optimized assets
- **WHEN** keg images are bundled
- **THEN** they SHALL be encoded in an efficient web format and capped at a dimension suitable for the largest layout, rather than shipped at full source resolution

#### Scenario: Sharp in hero and vessel layouts
- **WHEN** a keg image is shown in the `hero` or `vessel` layout
- **THEN** it SHALL render without visible pixelation at that size
