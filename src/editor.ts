import { LitElement, html, css, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { PerfectDraftCardConfig } from "./types.js";
import { GLASS_SIZES, DEFAULT_GLASS_SIZE, DOMAIN, LAYOUTS, DEFAULT_LAYOUT } from "./const.js";

const EDITOR_VERSION = "0.2.0";

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

  private _updateConfig(key: string, value: unknown): void {
    this._config = { ...this._config, [key]: value };
    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
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
