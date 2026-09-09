# Reference: integration product ID → card catalogue mapping

Source of truth: `custom_components/perfectdraft/keg_catalog.json` in
[hassio-integration-perfectdraft-pro](https://github.com/Falkvinge/hassio-integration-perfectdraft-pro),
114 entries as of integration commit `3c4b9ca6` ("Complete the keg name catalog: 86 -> 114 kegs").

Baseline: the card catalogue after PR #1 (`d0748e7`) maps 57 of those 114 IDs.
The three tables below cover the remaining 57 IDs plus the 12 label divergences.
Every mapping in table A was checked by hand; a naive fuzzy match got five of
them wrong (see the notes under the table).

## A. Add `kegId` to an existing card catalogue entry — 22 IDs

| Product ID | Integration name | Card slug | Card curated name | Ships keg art? |
|---|---|---|---|---|
| `797` | Leffe Rituel | `leffe-rituel` | Leffe Rituel 9° | yes |
| `2565` | Hoegaarden Rose | `hoegaarden-rosee` | Hoegaarden Rosée | yes |
| `3550` | Leffe Winter | `leffe-winter` | Leffe Winter | no |
| `29775` | Goose Island Midway | `goose-midway` | Goose Midway Session IPA | yes |
| `29896` | Kwak | `kwak` | Pauwel Kwak | yes |
| `31718` | Leffe Summer | `leffe-dete` | Leffe d'Été | yes |
| `32864` | Leffe Amber | `leffe-amber` | Leffe Ambrée | yes |
| `33515` | La Virgen Madrid | `la-virgen` | La Virgen Lager | yes |
| `33917` | Tiny Rebel Clwb Tropica | `tiny-rebel-clwb` | Tiny Rebel Clwb Tropicana | yes |
| `41588` | Schneider's Bayrisch Hell | `schneider` | Schneider Bayrisch Hell | yes |
| `42352` | St Feuillien Blonde | `saint-feuillien` | Saint-Feuillien Blonde | yes |
| `42527` | Castelain Grand Cru | `castelain` | Castelain Grand Cru | yes |
| `42703` | Brewdog Elvis Juice | `brewdog-elvis-juice` | BrewDog Elvis Juice | yes |
| `42920` | Adnams Ghost Ship | `adnams` | Adnams Ghost Ship | no |
| `44040` | Hertog Jan Grand Pilsener | `hertog-jan-grand` | Hertog Jan Grand Pilsener | yes |
| `44387` | Mont Blanc La Rousse | `rousse-mont-blanc` | Rousse du Mont Blanc | yes |
| `44425` | Camden IPA | `camden-ipa` | Camden IPA | yes |
| `47362` | Leffe Prestige | `leffe-prestige` | Leffe Prestige 1240 | yes |
| `47389` | Northern Monk A Little Faith | `northern-monk` | Northern Monk A Little Faith | yes |
| `47494` | Proper Job | `st-austell` | St Austell Proper Job IPA | yes |
| `47523` | Anosteké Blonde | `anoesteke` | Anosteké Blonde | yes |
| `47774` | Old Speckled Hen | `old-speckled-hen` | Old Speckled Hen | yes |
Notes on the non-obvious rows:

- `29775` "Goose Island Midway" is the card's `goose-midway` (Goose Midway Session IPA), **not** `goose-island-ipa`.
- `31718` "Leffe Summer" is the card's `leffe-dete` (Leffe d'Été).
- `44387` "Mont Blanc La Rousse" is the card's `rousse-mont-blanc` (Rousse du Mont Blanc).
- `47494` "Proper Job" is the card's `st-austell` (St Austell Proper Job IPA).
- `3550` and `42920` map to existing entries that carry no keg photo; they will use fallback art.

## B. Requires a new card catalogue entry — 35 IDs

None of these have a plausible existing entry. They need `slug`, `name`, `brewery`,
`style`, `abv`, brand `colors` and a `kegId`. No keg photography is expected — the
tiered-visual path will render brand-tinted fallback art.

`42863` "1L Stein" is merchandise rather than a beer, but the machine can report it,
so it needs an entry to avoid an unresolved-ID state.

| Product ID | Integration name |
|---|---|
| `759` | Diekirch Grand Cru |
| `760` | Diekirch Premium |
| `1470` | Diekirch Christmas |
| `2167` | Leffe Spring |
| `2452` | Leffe Royal Whitbread Golding |
| `9156` | Leffe Royal Cascade |
| `29745` | Lowenbrau Oktoberfestbier |
| `32814` | Romola |
| `33642` | Ginette Bio Refreshing Blonde |
| `33918` | Spaten Oktoberfestbier |
| `34944` | Leffe La Légère |
| `35168` | Goose Island Golden Goose |
| `35344` | Ginette Bio White |
| `36703` | Tiny Rebel Pineapple Express IPA |
| `37005` | Tiny Rebel Cali Pale |
| `37038` | Crew Republic Drunken Sailor |
| `41832` | Mikkeller Heated Seats |
| `42415` | Chernigivske |
| `42528` | Palm |
| `42641` | Kwak Rouge |
| `42756` | Innis & Gunn Lager Beer |
| `42778` | Mikkeller Game of Thrones |
| `42863` | 1L Stein |
| `42876` | Orchard Pig Reveller Cider |
| `43033` | Hertog Jan Bockbier |
| `43806` | Magic Rock Magic Orange |
| `43807` | Brewdog Lost Lager |
| `44238` | BrewDog Hopped in Harmony |
| `44331` | Ninkasi Flower Lager |
| `44474` | Camden Marzen |
| `44536` | Tiny Rebel Stay Puft |
| `44543` | Via Roma |
| `47429` | Camden Lager Top |
| `47816` | Corona Ligera |
| `48134` | Kopparberg Crisp Apple |
## C. Label divergence on IDs the card already maps — 12 IDs

The card recognises these product IDs but currently displays the integration's
catalogue name. Once the label prefers the curated name, these revert to the
left-hand column. Listed so the change in rendered output is reviewable.

| Product ID | Card curated name (will be shown) | Integration name (shown today) |
|---|---|---|
| `456` | Diebels Alt | Diebels |
| `500` | Hasseröder Premium | Hasseroder |
| `43006` | Camden Hells | Camden Hells Lager |
| `43235` | Corona Cero | Corona Cero (0.0% abv) |
| `44059` | San Miguel | San Miguel Especial |
| `44090` | Kopparberg Strawberry & Lime | Kopparberg Strawberry and Lime Cider |
| `47144` | Haake-Beck | Haake Beck |
| `47440` | Ninkasi IPA | Ninkasi French IPA |
| `47629` | Camden Eazy | Camden Eazy IPA |
| `47974` | Castelain Ch'ti Blonde | Ch'ti Blonde |
| `47999` | Thatchers Gold | Thatchers Gold Cider |
| `48061` | Northern Monk A Little Faith | Northern Monk Faith |
