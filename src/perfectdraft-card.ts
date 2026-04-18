import { LitElement, html, css, nothing, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { PerfectDraftCardConfig } from "./types.js";
import {
  GLASS_SIZES,
  DEFAULT_GLASS_SIZE,
  KEG_TOTAL_VOLUME_ML,
  DOMAIN,
  getFreshnessTier,
  type FreshnessTier,
} from "./const.js";
import {
  type BeerEntry,
  resolveBeer,
  getAllBeers,
  searchBeers,
} from "./beer-catalog.js";
import "./editor.js";

const CARD_VERSION = "0.1.0";

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
  @state() private _beer!: BeerEntry;
  @state() private _glassSize = DEFAULT_GLASS_SIZE;
  @state() private _showGlassDialog = false;
  @state() private _showBeerDialog = false;
  @state() private _beerSearchQuery = "";

  private _entityIds: { temperature?: string; kegRemaining?: string; kegFreshness?: string } = {};

  public setConfig(config: PerfectDraftCardConfig): void {
    if (!config.device_id) {
      throw new Error(
        "PerfectDraft Card: No device configured. Please use the visual editor to select a PerfectDraft device.",
      );
    }
    this._config = { ...config };

    const savedGlass = localStorage.getItem(storageKey(config.device_id, "glass"));
    this._glassSize = savedGlass ? parseInt(savedGlass, 10) : (config.glass_size ?? DEFAULT_GLASS_SIZE);

    const savedBeer = localStorage.getItem(storageKey(config.device_id, "beer"));
    const beerName = savedBeer ?? config.beer_name;
    this._beer = resolveBeer(beerName, config.custom_beers);
  }

  public getCardSize(): number {
    return 5;
  }

  public getGridOptions() {
    return { columns: 4, rows: 3, min_columns: 2, min_rows: 2 };
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
    return { device_id: firstDevice, beer_name: "Stella Artois", glass_size: DEFAULT_GLASS_SIZE };
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

  private _selectBeer(beer: BeerEntry): void {
    this._beer = beer;
    this._showBeerDialog = false;
    this._beerSearchQuery = "";
    if (this._config?.device_id) {
      localStorage.setItem(storageKey(this._config.device_id, "beer"), beer.name);
    }
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html`<ha-card><div class="error">Loading...</div></ha-card>`;
    }

    if (!this._config.device_id) {
      return html`<ha-card><div class="error">No device configured. Please edit this card to select a PerfectDraft device.</div></ha-card>`;
    }

    // Check beer_entity override
    if (this._config.beer_entity) {
      const entityState = this._getState(this._config.beer_entity);
      if (entityState && entityState !== "unavailable" && entityState !== "unknown") {
        const resolved = resolveBeer(entityState, this._config.custom_beers);
        if (resolved.slug !== this._beer?.slug) {
          this._beer = resolved;
        }
      }
    }

    const temp = parseNumericState(this._getState(this._entityIds.temperature));
    const kegPct = parseNumericState(this._getState(this._entityIds.kegRemaining));
    const freshDays = parseNumericState(this._getState(this._entityIds.kegFreshness));
    const tier = getFreshnessTier(freshDays);

    const volumeMl = kegPct !== null ? (kegPct / 100) * KEG_TOTAL_VOLUME_ML : null;
    const glassCount = volumeMl !== null ? Math.floor(volumeMl / this._glassSize) : null;

    const beer = this._beer ?? resolveBeer(undefined);

    return html`
      <ha-card class="tier-${tier}">
        <div class="card-content">
          <div class="label-zone" @click=${() => { this._showBeerDialog = true; }}
               style="background: linear-gradient(135deg, ${beer.colors.primary}dd, ${beer.colors.primary}88);">
            <div class="beer-logo-area">
              ${beer.imagePath
                ? html`<img class="beer-logo" src="${beer.imagePath.startsWith("http") ? beer.imagePath : getCardBaseUrl() + beer.imagePath}" alt="${beer.name}" />`
                : html`<div class="beer-logo-text" style="color: ${beer.colors.text};">${beer.name.charAt(0)}</div>`
              }
            </div>
            <div class="temperature" style="color: ${beer.colors.text};">
              ❄ ${temp !== null ? `${Math.round(temp)}°C` : "--°C"}
            </div>
            <div class="beer-name" style="color: ${beer.colors.text};">
              ${beer.name}
            </div>
            <div class="beer-style" style="color: ${beer.colors.text}88;">
              ${beer.brewery} · ${beer.abv}%
            </div>
          </div>

          <div class="keg-zone" @click=${() => { this._showGlassDialog = true; }}>
            ${glassCount !== null && glassCount > 0
              ? this._renderEmojiGrid(glassCount)
              : glassCount === 0 || (kegPct !== null && kegPct === 0)
                ? this._renderEmptyKeg()
                : this._renderEmojiGrid(0)
            }
            <div class="count-label">
              ${glassCount !== null
                ? `${glassCount} × ${this._glassLabel()}`
                : `-- × ${this._glassLabel()}`
              }
            </div>
            ${this._renderFreshnessIndicator(freshDays, tier)}
          </div>
        </div>

        ${this._showGlassDialog ? this._renderGlassDialog() : nothing}
        ${this._showBeerDialog ? this._renderBeerDialog() : nothing}
      </ha-card>
    `;
  }

  private _renderEmojiGrid(count: number): TemplateResult {
    const maxGlasses = Math.floor(KEG_TOTAL_VOLUME_ML / this._glassSize);
    const cols = maxGlasses <= 10 ? 5 : 6;
    const slots = [];
    for (let i = 0; i < maxGlasses; i++) {
      slots.push(i < count
        ? html`<span class="glass full">🍺</span>`
        : html`<span class="glass empty">🍺</span>`
      );
    }
    return html`
      <div class="emoji-grid" style="grid-template-columns: repeat(${cols}, 1fr);">
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

  private _renderBeerDialog(): TemplateResult {
    const beers = this._beerSearchQuery
      ? searchBeers(this._beerSearchQuery)
      : getAllBeers();

    const customBeers = (this._config.custom_beers ?? []).filter(
      (cb) =>
        !this._beerSearchQuery ||
        cb.name.toLowerCase().includes(this._beerSearchQuery.toLowerCase()),
    );

    return html`
      <div class="dialog-overlay" @click=${() => { this._showBeerDialog = false; this._beerSearchQuery = ""; }}>
        <div class="dialog beer-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-title">Select Beer</div>
          <input
            class="beer-search"
            type="text"
            placeholder="Search beers..."
            .value=${this._beerSearchQuery}
            @input=${(e: InputEvent) => { this._beerSearchQuery = (e.target as HTMLInputElement).value; }}
          />
          <div class="beer-list">
            ${beers.map(
              (b) => html`
                <div class="dialog-option beer-option ${b.slug === this._beer?.slug ? "selected" : ""}"
                     @click=${() => this._selectBeer(b)}>
                  <span class="beer-color-dot" style="background: ${b.colors.primary};"></span>
                  <span class="option-label">${b.name}</span>
                  <span class="option-desc">${b.brewery} · ${b.abv}%</span>
                </div>
              `,
            )}
            ${customBeers.length > 0
              ? html`
                  <div class="custom-heading">Custom</div>
                  ${customBeers.map(
                    (cb) => html`
                      <div class="dialog-option beer-option"
                           @click=${() => this._selectBeer(resolveBeer(cb.name, this._config.custom_beers))}>
                        <span class="beer-color-dot" style="background: ${cb.color_primary ?? "#555"};"></span>
                        <span class="option-label">${cb.name}</span>
                        <span class="option-desc">${cb.brewery ?? "Custom"}</span>
                      </div>
                    `,
                  )}
                `
              : nothing
            }
          </div>
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

      /* === LAYOUT === */
      .card-content {
        display: flex;
        height: 100%;
        min-height: 300px;
      }

      .label-zone {
        flex: 1 1 25%;
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
        gap: 2px;
        justify-items: center;
        align-items: center;
        width: 100%;
        flex: 1;
        align-content: center;
        padding: 0;
        font-size: min(4.5vw, 3.5em);
      }
      .glass {
        line-height: 1;
        text-align: center;
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
