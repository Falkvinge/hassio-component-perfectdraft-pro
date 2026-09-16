export type CardLayout = "landscape" | "portrait" | "compact" | "hero" | "vessel";

export interface PerfectDraftCardConfig {
  type?: string;
  device_id: string;
  glass_size?: number;
  /**
   * Corrections keyed by the product ID the integration reports, so an entry
   * only applies while that keg is tapped and cannot outlive it.
   */
  beer_overrides?: Record<string, string>;
  custom_beers?: CustomBeerEntry[];
  layout?: CardLayout;
  matrix_columns?: number | "auto";
  max_matrix_width?: string;
}

export interface CustomBeerEntry {
  name: string;
  brewery?: string;
  style?: string;
  abv?: number;
  color_primary?: string;
  color_secondary?: string;
  color_text?: string;
  image_url?: string;
}
