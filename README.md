# PerfectDraft Card

A custom Lovelace card for the [PerfectDraft Pro Home Assistant integration](https://github.com/Falkvinge/hassio-integration-perfectdraft-pro). Displays your keg status at a glance — what beer is on tap, its temperature, and how many glasses remain — using a beer emoji pictogram.

Designed and optimised for the Sonoff NSPanel Pro 120 in landscape mode, but works on any HA dashboard.

![PerfectDraft Card showing Leffe Blonde at 3°C with 18 glasses remaining](docs/screenshot.png)

## Features

- **Beer emoji pictogram** — see how many glasses remain in your keg at a glance
- **Built-in beer catalog** — 45+ PerfectDraft beers with brand color palettes
- **Glass size selector** — tap the emoji zone to choose between 250 mL, 330 mL, 500 mL, UK pint, or US pint
- **Beer selector** — tap the label zone to pick your current beer from the catalog
- **Freshness warnings** — escalating CSS-animated alerts as your keg approaches its 30-day expiry
- **UI-driven configuration** — no YAML editing required; everything is set up through the visual card editor

## Requirements

- [PerfectDraft Pro integration](https://github.com/Falkvinge/hassio-integration-perfectdraft-pro) installed and configured
- Home Assistant 2024.8 or later

## Installation

### HACS (recommended)

1. Open HACS → Frontend
2. Click the three dots menu → **Custom repositories**
3. Add `https://github.com/Falkvinge/hassio-component-perfectdraft-pro` with category **Dashboard**
4. Search for "PerfectDraft Card" and install it
5. Refresh your browser

### Manual

1. Download `perfectdraft-card.js` from the [latest release](https://github.com/Falkvinge/hassio-component-perfectdraft-pro/releases)
2. Copy it to your Home Assistant `config/www/perfectdraft-card/` directory
3. Go to **Settings → Dashboards → Resources** and add `/local/perfectdraft-card/perfectdraft-card.js` as a JavaScript Module
4. Refresh your browser

## Configuration

**No YAML editing required.** Add the card through the HA dashboard UI:

1. Edit your dashboard → Add Card → search for "PerfectDraft Card"
2. The editor auto-discovers your PerfectDraft device(s)
3. Select your default beer and glass size
4. Done!

### YAML reference (for power users)

```yaml
type: custom:perfectdraft-card
device_id: "perfectdraft_pro"
beer_name: "Leffe Blonde"
glass_size: 330
# beer_entity: sensor.perfectdraft_pro_keg_name  # future: auto beer detection
# custom_beers:
#   - name: "My Homebrew IPA"
#     brewery: "Home"
#     color_primary: "#4A7C2E"
#     color_secondary: "#F0F7E8"
#     image_url: "/local/images/my-ipa.png"
```

### On-card interactions

| Action | What happens |
|--------|-------------|
| Tap the **left zone** (beer label) | Opens beer selection dialog |
| Tap the **right zone** (emoji grid) | Opens glass size selection dialog |

Selections persist in your browser across page refreshes.

## Supported glass sizes

| Size | Description |
|------|-------------|
| 250 mL | Small glass |
| 330 mL | Bottle / standard |
| 500 mL | Half litre |
| 568 mL | Pint (UK) |
| 473 mL | Pint (US) |

## Sensor entities used

The card reads these sensors from the PerfectDraft integration:

| Sensor | Used for |
|--------|----------|
| `*_temperature` | Beer temperature display |
| `*_keg_remaining` | Glasses remaining calculation |
| `*_keg_freshness` | Freshness warning system |

## License

This project was AI-generated. Human involvement did not meet the bar for substantial originality required for copyright protection. This work is in the public domain where applicable, or otherwise not subject to copyright protection.
