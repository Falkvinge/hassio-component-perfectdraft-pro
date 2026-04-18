export interface PerfectDraftCardConfig {
  type?: string;
  device_id: string;
  beer_name?: string;
  glass_size?: number;
  beer_entity?: string;
  custom_beers?: CustomBeerEntry[];
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
