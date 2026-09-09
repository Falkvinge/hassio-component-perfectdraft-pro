export type CardLayout = "landscape" | "portrait" | "compact" | "hero" | "vessel";

export interface PerfectDraftCardConfig {
  type?: string;
  device_id: string;
  glass_size?: number;
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
