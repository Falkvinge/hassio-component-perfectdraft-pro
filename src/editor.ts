import { LitElement, html, css, nothing, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { PerfectDraftCardConfig } from "./types.js";
import { GLASS_SIZES, DEFAULT_GLASS_SIZE, DOMAIN, LAYOUTS, DEFAULT_LAYOUT } from "./const.js";
import { getAllBeers, getBeerByKegId } from "./beer-catalog.js";

const EDITOR_VERSION = "0.4.1";

interface DiscoveredDevice {
  deviceId: string;
  name: string;
  entities: Map<string, string>;
}

@customElement("perfectdraft-card-editor")
export class PerfectDraftCardEditor extends LitElement {
  @property({ attribute: false }) public hass: any;
  @state() private _config!: PerfectDraftCardConfig;
  @state() private _devices: DiscoveredDevice[] = [];

  public setConfig(config: PerfectDraftCardConfig): void {
    this._config = { ...config };
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass) {
      this._discoverDevices();
    }
  }

  private _discoverDevices(): void {
    if (!this.hass) return;

    const entityReg: Record<string, any> = this.hass.entities || {};
    const deviceReg: Record<string, any> = this.hass.devices || {};
    const deviceMap = new Map<string, DiscoveredDevice>();

    for (const [entityId, entry] of Object.entries(entityReg)) {
      if (entry.platform !== DOMAIN) continue;
      const devId = entry.device_id;
      if (!devId) continue;

      if (!deviceMap.has(devId)) {
        const device = deviceReg[devId];
        const name = device?.name_by_user || device?.name || devId;
        deviceMap.set(devId, { deviceId: devId, name, entities: new Map() });
      }

      const key = entry.translation_key || entry.original_name?.toLowerCase()?.replace(/\s+/g, "_") || entityId;
      deviceMap.get(devId)!.entities.set(key, entityId);
    }

    this._devices = [...deviceMap.values()];

    if (this._devices.length === 1 && !this._config.device_id) {
      this._updateConfig("device_id", this._devices[0].deviceId);
    }
  }

  /** The product ID the configured device reports right now, if any. */
  private _currentProductId(): string | undefined {
    const device = this._devices.find((d) => d.deviceId === this._config?.device_id);
    const entityId = device?.entities.get("keg_product_id");
    if (!entityId) return undefined;
    const state = this.hass?.states[entityId]?.state;
    return state && state !== "unavailable" && state !== "unknown" ? state : undefined;
  }

  /** Writes or clears one correction, keyed by the keg it corrects. */
  private _setOverride(productId: string, beerName: string): void {
    const next = { ...(this._config.beer_overrides ?? {}) };
    if (beerName) {
      next[productId] = beerName;
    } else {
      delete next[productId];
    }
    this._updateConfig("beer_overrides", Object.keys(next).length > 0 ? next : undefined);
  }

  private _updateConfig(key: string, value: unknown): void {
    this._config = { ...this._config, [key]: value };
    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * A correction is recorded against the product ID currently in the machine, so
   * it stops applying when that keg is swapped. Saved corrections are listed so
   * an entry left over from an earlier keg is visible and removable.
   */
  private _renderOverrideSection(): TemplateResult {
    const productId = this._currentProductId();
    const active = productId ? (this._config.beer_overrides?.[productId] ?? "") : "";
    const detected = productId ? getBeerByKegId(productId) : undefined;
    const entries = Object.entries(this._config.beer_overrides ?? {});

    return html`
      <div class="advanced-heading">Beer detection</div>

      <div class="field">
        <label>Correct the beer for the keg in the machine</label>
        <select
          .value=${active}
          ?disabled=${!productId}
          @change=${(e: Event) => {
            if (productId) this._setOverride(productId, (e.target as HTMLSelectElement).value);
          }}
        >
          <option value="" ?selected=${!active}>Use auto-detection</option>
          ${getAllBeers().map(
            (b) => html`
              <option value=${b.name} ?selected=${active === b.name}>${b.name} (${b.brewery})</option>
            `,
          )}
          ${(this._config.custom_beers ?? []).map(
            (cb) => html`<option value=${cb.name} ?selected=${active === cb.name}>${cb.name} (custom)</option>`,
          )}
        </select>
        <div class="hint">
          ${productId
            ? html`
                Applies only to the keg now in the machine — product ID ${productId}${detected
                  ? `, detected as ${detected.name}`
                  : ", not in the catalog"}. Swap kegs and it stops applying.
              `
            : "No keg detected right now. A correction is saved against the keg it corrects, so tap a keg first."}
        </div>
      </div>

      ${entries.length > 0
        ? html`
            <div class="field">
              <label>Saved corrections</label>
              <div class="override-list">
                ${entries.map(([id, name]) => {
                  const catalog = getBeerByKegId(id);
                  return html`
                    <div class="override-row">
                      <div class="override-text">
                        <span class="override-beer">${name}</span>
                        <span class="override-meta">
                          ID ${id}${catalog ? ` · detected as ${catalog.name}` : ""}${id === productId
                            ? " · applying now"
                            : ""}
                        </span>
                      </div>
                      <button
                        class="override-remove"
                        title="Remove this correction"
                        @click=${() => this._setOverride(id, "")}
                      >
                        ✕
                      </button>
                    </div>
                  `;
                })}
              </div>
              <div class="hint">
                Entries for kegs that are not in the machine have no effect. Remove them if you no longer want them.
              </div>
            </div>
          `
        : nothing}
    `;
  }

  protected render(): TemplateResult {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <div class="editor">
        <div class="version">PerfectDraft Card Editor v${EDITOR_VERSION} · ${this._devices.length} device(s) found</div>
        ${this._devices.length === 0
          ? html`<div class="warning">No PerfectDraft devices found. Please install and configure the PerfectDraft integration first.</div>`
          : html`
              <div class="field">
                <label>Device</label>
                <select
                  .value=${this._config.device_id ?? ""}
                  @change=${(e: Event) => this._updateConfig("device_id", (e.target as HTMLSelectElement).value)}
                >
                  <option value="" ?selected=${!this._config.device_id}>Select device...</option>
                  ${this._devices.map(
                    (d) => html`
                      <option value=${d.deviceId} ?selected=${this._config.device_id === d.deviceId}>
                        ${d.name}
                      </option>
                    `,
                  )}
                </select>
              </div>
            `
        }

        <div class="field">
          <label>Default Glass Size</label>
          <select
            .value=${String(this._config.glass_size ?? DEFAULT_GLASS_SIZE)}
            @change=${(e: Event) => this._updateConfig("glass_size", parseInt((e.target as HTMLSelectElement).value, 10))}
          >
            ${GLASS_SIZES.map(
              (gs) => html`
                <option value=${String(gs.value)} ?selected=${(this._config.glass_size ?? DEFAULT_GLASS_SIZE) === gs.value}>
                  ${gs.label} — ${gs.description}
                </option>
              `,
            )}
          </select>
        </div>

        <div class="field">
          <label>Layout</label>
          <select
            .value=${this._config.layout ?? DEFAULT_LAYOUT}
            @change=${(e: Event) => this._updateConfig("layout", (e.target as HTMLSelectElement).value)}
          >
            ${LAYOUTS.map(
              (l) => html`
                <option value=${l.value} ?selected=${(this._config.layout ?? DEFAULT_LAYOUT) === l.value}>
                  ${l.label}
                </option>
              `,
            )}
          </select>
        </div>

        ${this._renderOverrideSection()}

        <div class="advanced-heading">Emoji matrix (advanced)</div>

        <div class="field">
          <label>Matrix columns</label>
          <select
            .value=${this._config.matrix_columns ? String(this._config.matrix_columns) : "auto"}
            @change=${(e: Event) => {
              const v = (e.target as HTMLSelectElement).value;
              this._updateConfig("matrix_columns", v === "auto" ? undefined : parseInt(v, 10));
            }}
          >
            <option value="auto" ?selected=${!this._config.matrix_columns}>Auto</option>
            ${[3, 4, 5, 6, 7, 8].map(
              (n) => html`
                <option value=${String(n)} ?selected=${this._config.matrix_columns === n}>${n} columns</option>
              `,
            )}
          </select>
        </div>

        <div class="field">
          <label>Max matrix width (e.g. 480px or 60%)</label>
          <input
            type="text"
            .value=${this._config.max_matrix_width ?? ""}
            placeholder="(unset — fill the zone)"
            @input=${(e: InputEvent) => this._updateConfig("max_matrix_width", (e.target as HTMLInputElement).value || undefined)}
          />
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .editor {
        padding: 16px;
      }
      .field {
        margin-bottom: 16px;
      }
      .field label {
        display: block;
        font-weight: 500;
        margin-bottom: 4px;
        font-size: 0.9em;
      }
      .field select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .override-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .override-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border: 1px solid var(--divider-color, #333);
        border-radius: 4px;
      }
      .override-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .override-beer {
        font-size: 0.95em;
      }
      .override-meta {
        font-size: 0.75em;
        opacity: 0.55;
      }
      .override-remove {
        flex: 0 0 auto;
        background: none;
        border: none;
        color: inherit;
        opacity: 0.6;
        font-size: 1em;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
      }
      .override-remove:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.08);
      }
      .field select,
      .field input {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color, #333);
        border-radius: 4px;
        background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
        color: var(--primary-text-color, #fff);
        font-size: 1em;
        box-sizing: border-box;
      }
      .version {
        font-size: 0.75em;
        opacity: 0.4;
        text-align: right;
        margin-bottom: 12px;
      }
      .hint {
        font-size: 0.8em;
        opacity: 0.55;
        margin-top: 4px;
      }
      .advanced-heading {
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.5;
        margin: 4px 0 8px;
        border-top: 1px solid var(--divider-color, #333);
        padding-top: 12px;
      }
      .warning {
        padding: 12px;
        background: rgba(245, 166, 35, 0.15);
        border-radius: 8px;
        color: #f5a623;
        margin-bottom: 16px;
      }
    `;
  }
}
