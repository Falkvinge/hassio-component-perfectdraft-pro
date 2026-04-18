# Agent Handoff — PerfectDraft Card

## Current State (2026-04-18)

The PerfectDraft Card custom Lovelace card is working and deployed on a Sonoff NSPanel Pro 120 in landscape mode. Current release is **v0.1.5** on GitHub via HACS.

## What's Done

- Full card implementation: two-zone layout (beer label left ~1/4, emoji grid right ~3/4)
- 72-beer catalog with brand color palettes
- 21 real keg product images (full resolution from PerfectDraft CDN)
- CSS Grid emoji layout with fixed slots (6×3 for 330mL, etc.)
- Glass size selection dialog (250/330/500/UK pint/US pint)
- Beer selection dialog with search
- Freshness warning system (CSS-only, 4 tiers)
- Visual card editor with HA device registry auto-discovery
- HACS-compatible, deployed via GitHub releases
- Screenshot in both repos' READMEs
- Editor version marker for debugging

## What Needs Doing Next (Immediate)

### 1. Add 31 newly downloaded beer images to catalog

**31 new keg images** were downloaded from the PerfectDraft store DOM and are sitting in:
```
.worktree/perfectdraft-card/src/assets/kegs/
```

These need to be wired into `src/beer-catalog.ts` by adding `imagePath: kegImage("slug")` to each beer entry that now has an image file. The beers that gained images are:

leffe-dete, hoegaarden, stella-artois-0, leffe-0, kwak, dupont, san-miguel, fruh-kolsch, castelain, lowenbrau, schneider, hasseroder, camden-pale, camden-hells, camden-ipa, camden-eazy, becks, trooper, northern-monk, st-austell, old-speckled-hen, anoesteke, vocation-hop-skip, vocation-life-death, franziskaner-royal, saint-feuillien, leffe-prestige, leffe-brune, hoegaarden-rosee, rousse-mont-blanc, ninkasi

Also discovered from the DOM:
- **New beers to add to catalog**: Castelain Ch'ti Blonde (slug: `castelain-chti`), Hertog Jan Grand Pilsener (slug: `hertog-jan-grand`), Anheuser-Busch Bud uses filename `keg-abb_2x.png` (already have as `bud.png`)
- **Leffe d'Été** image filename is `keg--leffe-summer-e_te__2x.png` (not `keg--leffe_d_ete`)
- **Haake-Beck** image is a JPG (`haake_beck.jpg`) at `/h/a/` path — the cached version is too small (9KB). May need to find from UK store DOM.
- **Diebels** image returned a placeholder — no real image found yet.

After updating the catalog: rebuild (`npm run build` in the worktree), commit, merge to main, push to both remotes, create GitHub release v0.1.6.

### 2. Test ghost emojis after D&D session

User will drink some beers and report back on how the greyed-out empty emoji slots look on the NSPanel Pro. Current implementation: `opacity: 0.15; filter: grayscale(1)`.

### 3. Test freshness warnings

Untested — will activate naturally as the keg approaches 14 days old.

### 4. Test tap dialogs on NSPanel Pro

Beer picker and glass size dialogs haven't been tested on the NSPanel Pro's touch screen yet.

## Architecture Notes

- **Worktree**: Implementation branch is at `.worktree/perfectdraft-card/` on branch `impl/perfectdraft-card`
- **Main branch**: Merged and pushed to both remotes after each release
- **Remotes**: `origin` = Gitea (git.falkvinge.net), `github` = GitHub (Falkvinge/hassio-component-perfectdraft-pro)
- **Credentials**: `.git/credentials` store file with PATs for both remotes
- **Build**: `npm run build` in worktree produces `dist/perfectdraft-card.js` + `dist/kegs/*.png`
- **HACS**: Downloads from GitHub release tags. `dist/` is committed (not gitignored).
- **Entity resolution**: Uses `hass.entities` registry with `platform === "perfectdraft"` and `translation_key` for sensor mapping. Entity IDs do NOT contain "perfectdraft" — they use user-chosen device names.
- **Editor version**: Shown in top-right of card editor. Keep in sync with GitHub release tags.
- **Image base URL**: Detected at runtime via `getCardBaseUrl()` scanning `<script>` tags for "perfectdraft-card".

## Sibling Project

The PerfectDraft Pro HA integration is at `/home/rick/Lab/Dev/Hassio-PerfectDraftPro`. The card reads its sensors via the HA entity registry. The integration's `DISCOVERY.md` has the full API documentation.

## OpenSpec

The change `perfectdraft-card` has all artifacts complete in `openspec/changes/perfectdraft-card/`. Tasks file tracks progress at 65/73 (remaining are manual testing tasks).
