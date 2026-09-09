import { LitElement, html, css, nothing, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { PerfectDraftCardConfig, CardLayout } from "./types.js";
import {
  GLASS_SIZES,
  DEFAULT_GLASS_SIZE,
  KEG_TOTAL_VOLUME_ML,
  DOMAIN,
  DEFAULT_LAYOUT,
  resolveLayout,
  getFreshnessTier,
  type FreshnessTier,
} from "./const.js";
import {
  type BeerEntry,
  resolveBeer,
  getBeerByKegId,
  getBreweryLogo,
} from "./beer-catalog.js";
import "./editor.js";

const CARD_VERSION = "0.2.0";

interface RenderCtx {
  beer: BeerEntry;
  temp: number | null;
  kegPct: number | null;
  freshDays: number | null;
  tier: FreshnessTier;
  glassCount: number | null;
}

function getCardBaseUrl(): string {
  const scripts = document.querySelectorAll("script[src]");
  for (const s of scripts) {
    const src = (s as HTMLScriptElement).src;
    if (src.includes("perfectdraft-card")) {
      return src.substring(0, src.lastIndexOf("/") + 1);
    }
  }
  return "/hacsfiles/perfectdraft-card/";
}

function storageKey(deviceId: string, suffix: string): string {
  return `perfectdraft-card:${deviceId}:${suffix}`;
}

function parseNumericState(stateStr: string | undefined): number | null {
  if (!stateStr || stateStr === "unavailable" || stateStr === "unknown") return null;
  const n = parseFloat(stateStr);
  return isNaN(n) ? null : n;
}

@customElement("perfectdraft-card")
export class PerfectDraftCard extends LitElement {
  @property({ attribute: false }) public hass: any;
  @state() private _config!: PerfectDraftCardConfig;
  @state() private _beer?: BeerEntry;
  @state() private _glassSize = DEFAULT_GLASS_SIZE;
  @state() private _layout: CardLayout = DEFAULT_LAYOUT as CardLayout;
  @state() private _matrixColumns?: number;
  @state() private _maxMatrixWidth?: string;
  @state() private _showGlassDialog = false;
  @state() private _failedImages = new Set<string>();

  private _entityIds: { temperature?: string; kegRemaining?: string; kegFreshness?: string; kegProduct?: string; kegName?: string } = {};

  public setConfig(config: PerfectDraftCardConfig): void {
    if (!config.device_id) {
      throw new Error(
        "PerfectDraft Card: No device configured. Please use the visual editor to select a PerfectDraft device.",
      );
    }
    this._config = { ...config };

    this._layout = resolveLayout(config.layout) as CardLayout;

    const mc = config.matrix_columns;
    this._matrixColumns =
      typeof mc === "number" && Number.isFinite(mc) && mc > 0 ? Math.floor(mc) : undefined;

    this._maxMatrixWidth =
      typeof config.max_matrix_width === "string" && config.max_matrix_width.trim()
        ? config.max_matrix_width.trim()
        : undefined;

    const savedGlass = localStorage.getItem(storageKey(config.device_id, "glass"));
    this._glassSize = savedGlass ? parseInt(savedGlass, 10) : (config.glass_size ?? DEFAULT_GLASS_SIZE);
  }

  public getCardSize(): number {
    switch (this._layout) {
      case "compact":
        return 1;
      case "vessel":
        return 4;
      case "portrait":
        return 6;
      default:
        return 5;
    }
  }

  public getGridOptions() {
    switch (this._layout) {
      case "compact":
        return { rows: 1, columns: 12, min_columns: 2, min_rows: 1 };
      case "portrait":
        return { rows: 5, columns: 6, min_columns: 1, min_rows: 3 };
      case "vessel":
        return { rows: 4, columns: 6, min_columns: 1, min_rows: 2 };
      case "hero":
        return { rows: 5, columns: 8, min_columns: 1, min_rows: 2 };
      default:
        return { columns: 4, rows: 3, min_columns: 1, min_rows: 2 };
    }
  }

  public static getStubConfig(hass: any): Record<string, unknown> {
    const entityReg: Record<string, any> = hass.entities || {};
    const deviceIds = new Set<string>();
    for (const entry of Object.values(entityReg)) {
      if (entry.platform === DOMAIN && entry.device_id) {
        deviceIds.add(entry.device_id);
      }
    }
    const firstDevice = deviceIds.size === 1 ? [...deviceIds][0] : "";
    return { device_id: firstDevice, glass_size: DEFAULT_GLASS_SIZE, layout: DEFAULT_LAYOUT };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement("perfectdraft-card-editor");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._resolveEntities();
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass")) {
      this._resolveEntities();
    }
  }

  private _resolveEntities(): void {
    if (!this.hass || !this._config?.device_id) return;

    if (this._entityIds.temperature) return;

    const entityReg: Record<string, any> = this.hass.entities || {};

    for (const [entityId, entry] of Object.entries(entityReg)) {
      if (entry.platform !== DOMAIN || entry.device_id !== this._config.device_id) continue;

      const key = entry.translation_key;
      if (key === "temperature") {
        this._entityIds.temperature = entityId;
      } else if (key === "keg_remaining") {
        this._entityIds.kegRemaining = entityId;
      } else if (key === "keg_freshness") {
        this._entityIds.kegFreshness = entityId;
      } else if (key === "keg_product_id") {
        this._entityIds.kegProduct = entityId;
      } else if (key === "keg_name") {
        this._entityIds.kegName = entityId;
      }
    }
  }

  private _getState(entityId: string | undefined): string | undefined {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId]?.state;
  }

  private _selectGlass(size: number): void {
    this._glassSize = size;
    this._showGlassDialog = false;
    if (this._config?.device_id) {
      localStorage.setItem(storageKey(this._config.device_id, "glass"), String(size));
    }
  }

  private _imgError(src: string): void {
    this._failedImages = new Set(this._failedImages).add(src);
  }

  private _openGlassDialog = (): void => {
    this._showGlassDialog = true;
  };

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html`<ha-card><div class="error">Loading...</div></ha-card>`;
    }

    if (!this._config.device_id) {
      return html`<ha-card><div class="error">No device configured. Please edit this card to select a PerfectDraft device.</div></ha-card>`;
    }

    // Auto-detect the tapped beer from the PerfectDraft integration: product ID first, name second.
    const idState = this._getState(this._entityIds.kegProduct);
    const nameState = this._getState(this._entityIds.kegName);
    const validName = nameState && nameState !== "unavailable" && nameState !== "unknown" ? nameState : undefined;
    let live: BeerEntry | undefined;
    if (idState && /^\d+$/.test(idState)) live = getBeerByKegId(idState);
    if (!live && validName) live = resolveBeer(validName, this._config.custom_beers);
    if (live) {
      const label = validName ?? live.name; // authoritative PerfectDraft name wins for the label
      if (live.slug !== this._beer?.slug || this._beer?.name !== label) {
        this._beer = { ...live, name: label };
      }
    }

    const temp = parseNumericState(this._getState(this._entityIds.temperature));
    const kegPct = parseNumericState(this._getState(this._entityIds.kegRemaining));
    const freshDays = parseNumericState(this._getState(this._entityIds.kegFreshness));
    const tier = getFreshnessTier(freshDays);

    const volumeMl = kegPct !== null ? (kegPct / 100) * KEG_TOTAL_VOLUME_ML : null;
    const glassCount = volumeMl !== null ? Math.floor(volumeMl / this._glassSize) : null;

    const beer = this._beer ?? resolveBeer(undefined);
    const ctx: RenderCtx = { beer, temp, kegPct, freshDays, tier, glassCount };

    const body =
      this._layout === "portrait"
        ? this._renderPortrait(ctx)
        : this._layout === "compact"
          ? this._renderCompact(ctx)
          : this._layout === "hero"
            ? this._renderHero(ctx)
            : this._layout === "vessel"
              ? this._renderVessel(ctx)
              : this._renderLandscape(ctx);

    return html`
      <ha-card class="tier-${tier} layout-${this._layout}">
        ${body}
        ${this._showGlassDialog ? this._renderGlassDialog() : nothing}
      </ha-card>
    `;
  }

  private _labelStyle(beer: BeerEntry): string {
    return `background: linear-gradient(135deg, ${beer.colors.primary}dd, ${beer.colors.primary}88);`;
  }

  private _tempText(temp: number | null): string {
    return temp !== null ? `${Math.round(temp)}°C` : "--°C";
  }

  private _countText(glassCount: number | null): string {
    return glassCount !== null ? `${glassCount} × ${this._glassLabel()}` : `-- × ${this._glassLabel()}`;
  }

  /** Tiered visual: keg photo -> brewery logo -> generated tinted silhouette. */
  private _renderVisual(beer: BeerEntry): TemplateResult {
    const kegSrc = beer.imagePath
      ? beer.imagePath.startsWith("http")
        ? beer.imagePath
        : getCardBaseUrl() + beer.imagePath
      : undefined;
    if (kegSrc && !this._failedImages.has(kegSrc)) {
      return html`<img class="beer-logo" src="${kegSrc}" alt="${beer.name}" @error=${() => this._imgError(kegSrc)} />`;
    }

    const logoRel = beer.breweryLogo ?? getBreweryLogo(beer.brewery);
    const logoSrc = logoRel
      ? logoRel.startsWith("http")
        ? logoRel
        : getCardBaseUrl() + logoRel
      : undefined;
    if (logoSrc && !this._failedImages.has(logoSrc)) {
      return html`<img class="beer-logo brewery-logo" src="${logoSrc}" alt="${beer.name}" @error=${() => this._imgError(logoSrc)} />`;
    }

    return this._renderKegSilhouette(beer);
  }

  /** Generated, asset-free keg silhouette tinted from the beer palette, with its initial. */
  private _renderKegSilhouette(beer: BeerEntry): TemplateResult {
    const initial = (beer.name.charAt(0) || "?").toUpperCase();
    const { primary, secondary } = beer.colors;
    return html`
      <svg class="gen-svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${beer.name}">
        <rect x="28" y="12" width="64" height="18" rx="6" fill="${primary}" opacity="0.85" />
        <rect x="20" y="26" width="80" height="104" rx="16" fill="${primary}" />
        <rect x="20" y="66" width="80" height="40" fill="${secondary}" />
        <text x="60" y="95" text-anchor="middle" font-size="30" font-weight="700"
              fill="${primary}" font-family="system-ui, -apple-system, sans-serif">${initial}</text>
        <rect x="28" y="122" width="64" height="18" rx="6" fill="${primary}" opacity="0.85" />
      </svg>
    `;
  }

  /** Beer glass that fills proportionally — used by the vessel layout. */
  private _renderGlassVessel(beer: BeerEntry, fillPct: number): TemplateResult {
    const p = Math.max(0, Math.min(100, fillPct));
    const top = 16;
    const bottom = 128;
    const height = bottom - top;
    const fillTop = bottom - (height * p) / 100;
    const cid = `pdfill-${beer.slug.replace(/[^a-z0-9]/gi, "")}`;
    const outline = `M24 ${top} H76 L70 ${bottom - 6} Q70 ${bottom} 64 ${bottom} H36 Q30 ${bottom} 30 ${bottom - 6} Z`;
    return html`
      <svg class="vessel-svg" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="${beer.name} ${Math.round(p)}% remaining">
        <defs><clipPath id="${cid}"><path d="${outline}" /></clipPath></defs>
        <g clip-path="url(#${cid})">
          <rect x="22" y="${top}" width="56" height="${height}" fill="${beer.colors.secondary}" opacity="0.2" />
          <rect x="22" y="${fillTop}" width="56" height="${bottom - fillTop}" fill="${beer.colors.primary}" />
          ${p > 0 && p < 100
            ? html`<rect x="22" y="${fillTop - 4}" width="56" height="5" fill="#ffffff" opacity="0.85" />`
            : nothing}
        </g>
        <path d="${outline}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" />
      </svg>
    `;
  }

  private _renderLabelInner(beer: BeerEntry, temp: number | null): TemplateResult {
    return html`
      <div class="beer-logo-area">${this._renderVisual(beer)}</div>
      <div class="temperature" style="color: ${beer.colors.text};">❄ ${this._tempText(temp)}</div>
      <div class="beer-name" style="color: ${beer.colors.text};">${beer.name}</div>
      <div class="beer-style" style="color: ${beer.colors.text}88;">${beer.brewery} · ${beer.abv}%</div>
    `;
  }

  private _renderKegContent(c: RenderCtx): TemplateResult {
    return html`
      ${c.glassCount !== null && c.glassCount > 0
        ? this._renderEmojiGrid(c.glassCount)
        : c.glassCount === 0 || (c.kegPct !== null && c.kegPct === 0)
          ? this._renderEmptyKeg()
          : this._renderEmojiGrid(0)}
      <div class="count-label">${this._countText(c.glassCount)}</div>
      ${this._renderFreshnessIndicator(c.freshDays, c.tier)}
    `;
  }

  private _renderLandscape(c: RenderCtx): TemplateResult {
    return html`
      <div class="card-content layout-landscape-content">
        <div class="label-zone" style="${this._labelStyle(c.beer)}">
          ${this._renderLabelInner(c.beer, c.temp)}
        </div>
        <div class="keg-zone" @click=${this._openGlassDialog}>${this._renderKegContent(c)}</div>
      </div>
    `;
  }

  private _renderPortrait(c: RenderCtx): TemplateResult {
    return html`
      <div class="card-content layout-portrait-content">
        <div class="label-zone label-zone-top" style="${this._labelStyle(c.beer)}">
          ${this._renderLabelInner(c.beer, c.temp)}
        </div>
        <div class="keg-zone" @click=${this._openGlassDialog}>${this._renderKegContent(c)}</div>
      </div>
    `;
  }

  private _renderCompact(c: RenderCtx): TemplateResult {
    const pct = c.kegPct ?? 0;
    return html`
      <div class="card-content layout-compact-content">
        <div class="compact-visual">${this._renderVisual(c.beer)}</div>
        <div class="compact-main">
          <div class="compact-name">${c.beer.name}</div>
          <div class="compact-bar">
            <div class="compact-bar-fill" style="width: ${pct}%; background: ${c.beer.colors.primary};"></div>
          </div>
        </div>
        <div class="compact-side" @click=${this._openGlassDialog}>
          <div class="compact-temp">❄ ${this._tempText(c.temp)}</div>
          <div class="compact-count">${this._countText(c.glassCount)}</div>
        </div>
      </div>
    `;
  }

  private _renderHero(c: RenderCtx): TemplateResult {
    return html`
      <div class="card-content layout-hero-content"
           style="background: radial-gradient(circle at 50% 38%, ${c.beer.colors.primary}33, ${c.beer.colors.primary}0d);">
        <div class="hero-visual">${this._renderVisual(c.beer)}</div>
        <div class="hero-scrim" @click=${this._openGlassDialog}>
          <div class="hero-line">
            <span class="hero-name">${c.beer.name}</span>
            <span class="hero-temp">❄ ${this._tempText(c.temp)}</span>
          </div>
          <div class="hero-count">${this._countText(c.glassCount)}</div>
        </div>
        ${this._renderFreshnessIndicator(c.freshDays, c.tier)}
      </div>
    `;
  }

  private _renderVessel(c: RenderCtx): TemplateResult {
    const pct = c.kegPct ?? 0;
    return html`
      <div class="card-content layout-vessel-content">
        <div class="vessel-top">
          <span class="vessel-name">${c.beer.name}</span>
          <span class="vessel-temp">❄ ${this._tempText(c.temp)}</span>
        </div>
        <div class="vessel-mid" @click=${this._openGlassDialog}>${this._renderGlassVessel(c.beer, pct)}</div>
        <div class="vessel-count" @click=${this._openGlassDialog}>${this._countText(c.glassCount)}</div>
        ${this._renderFreshnessIndicator(c.freshDays, c.tier)}
      </div>
    `;
  }

  private _renderEmojiGrid(count: number): TemplateResult {
    const maxGlasses = Math.floor(KEG_TOTAL_VOLUME_ML / this._glassSize);
    const cols =
      this._matrixColumns && this._matrixColumns > 0
        ? Math.min(this._matrixColumns, maxGlasses)
        : maxGlasses <= 10
          ? 5
          : 6;
    const rows = Math.ceil(maxGlasses / cols);
    const slots = [];
    for (let i = 0; i < maxGlasses; i++) {
      slots.push(i < count ? html`<span class="glass full">🍺</span>` : html`<span class="glass empty">🍺</span>`);
    }
    const widthStyle = this._maxMatrixWidth
      ? `max-width: ${this._maxMatrixWidth}; margin-left: auto; margin-right: auto;`
      : "";
    return html`
      <div class="emoji-grid" style="grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, 1fr); ${widthStyle}">
        ${slots}
      </div>
    `;
  }

  private _renderEmptyKeg(): TemplateResult {
    return html`
      <div class="empty-keg">
        <div class="empty-icon">🫗</div>
        <div class="empty-title">Keg Empty</div>
        <div class="empty-subtitle">Time to reload!</div>
      </div>
    `;
  }

  private _renderFreshnessIndicator(days: number | null, tier: FreshnessTier): TemplateResult {
    if (tier === "normal" || days === null) return html``;
    const messages: Record<string, string> = {
      warning: `⏳ ${days}d fresh`,
      urgent: `⚠ ${days} days left — drink up!`,
      critical: `🚨 ${days} days left!`,
      expired: "Keg expired",
    };
    return html`<div class="freshness-indicator freshness-${tier}">${messages[tier] ?? ""}</div>`;
  }

  private _glassLabel(): string {
    const gs = GLASS_SIZES.find((g) => g.value === this._glassSize);
    return gs ? gs.label : `${this._glassSize} mL`;
  }

  private _renderGlassDialog(): TemplateResult {
    return html`
      <div class="dialog-overlay" @click=${() => { this._showGlassDialog = false; }}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-title">Glass Size</div>
          ${GLASS_SIZES.map(
            (gs) => html`
              <div class="dialog-option ${gs.value === this._glassSize ? "selected" : ""}"
                   @click=${() => this._selectGlass(gs.value)}>
                <span class="option-label">${gs.label}</span>
                <span class="option-desc">${gs.description}</span>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        overflow: hidden;
        background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
        color: var(--primary-text-color, #fff);
        border: 2px solid transparent;
        transition: border-color 0.5s ease, box-shadow 0.5s ease;
      }

      /* === FRESHNESS TIERS === */
      ha-card.tier-warning {
        border-color: #f5a623;
      }
      ha-card.tier-urgent {
        animation: pulse-orange 2s ease-in-out infinite;
      }
      ha-card.tier-critical {
        animation: pulse-red 1s ease-in-out infinite;
      }
      ha-card.tier-expired {
        border-color: #db4437;
        box-shadow: inset 0 0 30px rgba(219, 68, 55, 0.2);
      }

      @keyframes pulse-orange {
        0%, 100% { border-color: #f5a62366; box-shadow: none; }
        50% { border-color: #f5a623; box-shadow: 0 0 15px #f5a62344; }
      }
      @keyframes pulse-red {
        0%, 100% { border-color: #db443766; box-shadow: none; }
        50% { border-color: #db4437; box-shadow: 0 0 20px #db443744; }
      }

      /* === LAYOUT (landscape default) === */
      .card-content {
        display: flex;
        height: 100%;
        min-height: 300px;
      }

      .label-zone {
        flex: 1 1 25%;
        min-width: 0;
        max-width: 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px 20px;
        cursor: pointer;
        user-select: none;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
        transition: filter 0.2s;
      }
      .label-zone:active {
        filter: brightness(0.9);
      }

      .keg-zone {
        flex: 3;
        min-width: 0;
        container-type: inline-size;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px 20px;
        cursor: pointer;
        user-select: none;
        position: relative;
      }
      .keg-zone:active {
        background: rgba(255, 255, 255, 0.03);
      }

      /* === BEER LABEL === */
      .beer-logo-area {
        flex: 1;
        width: 80%;
        max-height: 55%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }
      .beer-logo {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .gen-svg, .vessel-svg {
        width: 100%;
        height: 100%;
        max-height: 100%;
      }
      .beer-logo-text {
        font-size: 5em;
        font-weight: bold;
        opacity: 0.4;
      }
      .temperature {
        font-size: 3em;
        font-weight: 300;
        margin-bottom: 6px;
      }
      .beer-name {
        font-size: 1.6em;
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
      }
      .beer-style {
        font-size: 0.95em;
        margin-top: 4px;
        text-align: center;
      }

      /* === KEG EMOJI GRID === */
      .emoji-grid {
        display: grid;
        justify-items: center;
        align-items: center;
        align-content: stretch;
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 0;
      }
      .glass {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: min(7vw, 4.5em);
        font-size: clamp(0.5em, 14cqi, 4.5em);
      }
      .glass.empty {
        opacity: 0.15;
        filter: grayscale(1);
      }
      .count-label {
        margin-top: 8px;
        font-size: 1.3em;
        opacity: 0.6;
        flex-shrink: 0;
      }

      /* === PORTRAIT === */
      .layout-portrait-content {
        flex-direction: column;
      }
      .layout-portrait-content .label-zone {
        flex: 0 0 auto;
        max-width: none;
        width: 100%;
        padding: 18px 16px;
        border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
      }
      .layout-portrait-content .label-zone .beer-logo-area {
        max-height: 120px;
      }
      .layout-portrait-content .keg-zone {
        flex: 1 1 auto;
        width: 100%;
      }

      /* === COMPACT === */
      .layout-compact-content {
        min-height: 0;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
      }
      .compact-visual {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .compact-visual .beer-logo,
      .compact-visual .gen-svg {
        max-width: 44px;
        max-height: 44px;
      }
      .compact-main {
        flex: 1 1 auto;
        min-width: 0;
        cursor: pointer;
      }
      .compact-name {
        font-weight: bold;
        font-size: 1.05em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .compact-bar {
        margin-top: 6px;
        height: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .compact-bar-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.4s ease;
      }
      .compact-side {
        flex: 0 0 auto;
        text-align: right;
        cursor: pointer;
        white-space: nowrap;
      }
      .compact-temp {
        font-size: 1.1em;
        font-weight: 300;
      }
      .compact-count {
        font-size: 0.8em;
        opacity: 0.6;
      }

      /* === HERO === */
      .layout-hero-content {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 320px;
        cursor: pointer;
      }
      .hero-visual {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 0;
        padding: 18px 18px 0;
        box-sizing: border-box;
      }
      .hero-visual .beer-logo,
      .hero-visual .gen-svg {
        max-height: 100%;
        max-width: 80%;
        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
      }
      .hero-scrim {
        width: 100%;
        box-sizing: border-box;
        padding: 28px 20px 16px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
        text-align: center;
      }
      .hero-line {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
      }
      .hero-name {
        font-size: 1.5em;
        font-weight: bold;
      }
      .hero-temp {
        font-size: 1.3em;
        font-weight: 300;
      }
      .hero-count {
        font-size: 1.05em;
        opacity: 0.7;
        margin-top: 2px;
      }

      /* === VESSEL === */
      .layout-vessel-content {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 16px;
        min-height: 280px;
      }
      .vessel-top {
        display: flex;
        align-items: baseline;
        gap: 12px;
        cursor: pointer;
        flex-wrap: wrap;
        justify-content: center;
      }
      .vessel-name {
        font-size: 1.4em;
        font-weight: bold;
      }
      .vessel-temp {
        font-size: 1.2em;
        font-weight: 300;
        opacity: 0.85;
      }
      .vessel-mid {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .vessel-count {
        font-size: 1.2em;
        opacity: 0.7;
        cursor: pointer;
      }

      /* === EMPTY KEG === */
      .empty-keg {
        text-align: center;
        opacity: 0.7;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .empty-icon {
        font-size: 6em;
        margin-bottom: 8px;
      }
      .empty-title {
        font-size: 2em;
        font-weight: bold;
        color: #db4437;
      }
      .empty-subtitle {
        font-size: 1.2em;
        opacity: 0.6;
        margin-top: 4px;
      }

      /* === FRESHNESS INDICATOR === */
      .freshness-indicator {
        margin-top: 12px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.9em;
        font-weight: 500;
      }
      .freshness-warning {
        background: rgba(245, 166, 35, 0.15);
        color: #f5a623;
      }
      .freshness-urgent {
        background: rgba(255, 152, 0, 0.2);
        color: #ff9800;
        animation: text-pulse-orange 2s ease-in-out infinite;
      }
      .freshness-critical {
        background: rgba(219, 68, 55, 0.2);
        color: #db4437;
        animation: text-pulse-red 1s ease-in-out infinite;
      }
      .freshness-expired {
        background: rgba(219, 68, 55, 0.3);
        color: #db4437;
        font-weight: bold;
      }

      @keyframes text-pulse-orange {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      @keyframes text-pulse-red {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      /* === DIALOGS === */
      .dialog-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .dialog {
        background: var(--ha-card-background, var(--card-background-color, #2c2c2c));
        border-radius: 12px;
        padding: 16px;
        min-width: 260px;
        max-width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }
      .dialog-title {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
      }
      .dialog-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .dialog-option:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .dialog-option.selected {
        background: rgba(255, 255, 255, 0.12);
        font-weight: bold;
      }
      .option-label {
        flex: 1;
      }
      .option-desc {
        font-size: 0.8em;
        opacity: 0.5;
        margin-left: 8px;
      }

      /* === BEER DIALOG === */
      .beer-dialog {
        max-height: 80%;
        display: flex;
        flex-direction: column;
      }
      .beer-search {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        color: inherit;
        font-size: 1em;
        margin-bottom: 8px;
        box-sizing: border-box;
        outline: none;
      }
      .beer-search:focus {
        border-color: rgba(255, 255, 255, 0.3);
      }
      .beer-search::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
      .beer-list {
        overflow-y: auto;
        max-height: 50vh;
        -webkit-overflow-scrolling: touch;
      }
      .beer-option {
        gap: 8px;
      }
      .beer-color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .custom-heading {
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        opacity: 0.4;
        padding: 12px 12px 4px;
      }

      .error {
        padding: 16px;
        color: var(--error-color, #db4437);
      }
    `;
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "perfectdraft-card",
  name: "PerfectDraft Card",
  description: "Display PerfectDraft Pro keg status with beer emojis",
  preview: true,
  documentationURL: "https://github.com/Falkvinge/hassio-component-perfectdraft-pro",
});

console.info(
  `%c PERFECTDRAFT-CARD %c v${CARD_VERSION} `,
  "background: #f5a623; color: #000; font-weight: bold;",
  "background: #333; color: #f5a623;",
);
