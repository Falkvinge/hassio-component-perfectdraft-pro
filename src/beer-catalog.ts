export interface BeerEntry {
  slug: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  imagePath?: string;
  kegId?: string;
}

const CATALOG: BeerEntry[] = [
  // === LEFFE VARIANTS ===
  { slug: "leffe-blonde", name: "Leffe Blonde", brewery: "Abbaye de Leffe", style: "Belgian Blonde", abv: 6.6, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" } },
  { slug: "leffe-brune", name: "Leffe Brune", brewery: "Abbaye de Leffe", style: "Belgian Dubbel", abv: 6.5, colors: { primary: "#4A2810", secondary: "#F5E6D0", text: "#FFFFFF" } },
  { slug: "leffe-amber", name: "Leffe Amber", brewery: "Abbaye de Leffe", style: "Belgian Amber", abv: 6.6, colors: { primary: "#B5651D", secondary: "#FFF0D6", text: "#1A0F00" } },
  { slug: "leffe-ruby", name: "Leffe Ruby", brewery: "Abbaye de Leffe", style: "Belgian Fruit Beer", abv: 5.0, colors: { primary: "#8B1A4A", secondary: "#FFE6F0", text: "#FFFFFF" } },
  { slug: "leffe-blanche", name: "Leffe Blanche", brewery: "Abbaye de Leffe", style: "Belgian Witbier", abv: 5.0, colors: { primary: "#E8DCC8", secondary: "#FFFDF5", text: "#2C2C2C" } },
  { slug: "leffe-winter", name: "Leffe Winter", brewery: "Abbaye de Leffe", style: "Belgian Winter Ale", abv: 6.6, colors: { primary: "#1B3A5C", secondary: "#E0ECF8", text: "#FFFFFF" } },
  { slug: "leffe-dete", name: "Leffe d'Été", brewery: "Abbaye de Leffe", style: "Belgian Summer Ale", abv: 5.2, colors: { primary: "#F5C242", secondary: "#FFFBE6", text: "#1A0F00" } },

  // === BELGIAN CLASSICS ===
  { slug: "hoegaarden", name: "Hoegaarden", brewery: "Brouwerij van Hoegaarden", style: "Belgian Witbier", abv: 4.9, colors: { primary: "#F0E4C8", secondary: "#FFFDF2", text: "#2A4B1E" } },
  { slug: "hoegaarden-rosee", name: "Hoegaarden Rosée", brewery: "Brouwerij van Hoegaarden", style: "Fruit Witbier", abv: 3.0, colors: { primary: "#E87D9F", secondary: "#FFF0F5", text: "#4A0028" } },
  { slug: "jupiler", name: "Jupiler", brewery: "AB InBev Belgium", style: "Belgian Pilsner", abv: 5.2, colors: { primary: "#D4001A", secondary: "#FFF0F0", text: "#FFFFFF" } },
  { slug: "kwak", name: "Pauwel Kwak", brewery: "Brouwerij Bosteels", style: "Belgian Strong Ale", abv: 8.4, colors: { primary: "#B34700", secondary: "#FFF2E5", text: "#FFFFFF" } },
  { slug: "tripel-karmeliet", name: "Tripel Karmeliet", brewery: "Brouwerij Bosteels", style: "Belgian Tripel", abv: 8.4, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#2C1A00" } },
  { slug: "gulden-draak", name: "Gulden Draak", brewery: "Brouwerij Van Steenberge", style: "Belgian Strong Dark", abv: 10.5, colors: { primary: "#1A1A2E", secondary: "#E8E0F0", text: "#C9A24D" } },

  // === STELLA ARTOIS ===
  { slug: "stella-artois", name: "Stella Artois", brewery: "Brouwerij Artois", style: "Belgian Lager", abv: 5.2, colors: { primary: "#0E4C1E", secondary: "#F0F8E8", text: "#FFFFFF" } },
  { slug: "stella-artois-unfiltered", name: "Stella Artois Unfiltered", brewery: "Brouwerij Artois", style: "Unfiltered Lager", abv: 5.0, colors: { primary: "#D4A547", secondary: "#FFFCE8", text: "#0E4C1E" } },

  // === LAGERS & PILSNERS ===
  { slug: "budweiser", name: "Budweiser", brewery: "Anheuser-Busch", style: "American Lager", abv: 5.0, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" } },
  { slug: "bud-light", name: "Bud Light", brewery: "Anheuser-Busch", style: "Light Lager", abv: 3.5, colors: { primary: "#004B8D", secondary: "#E8F4FF", text: "#FFFFFF" } },
  { slug: "corona", name: "Corona Extra", brewery: "Grupo Modelo", style: "Mexican Lager", abv: 4.5, colors: { primary: "#FDB913", secondary: "#FFFCE5", text: "#00205B" } },
  { slug: "corona-cero", name: "Corona Cero", brewery: "Grupo Modelo", style: "Non-Alcoholic Lager", abv: 0.0, colors: { primary: "#0073B1", secondary: "#E5F3FF", text: "#FFFFFF" } },
  { slug: "becks", name: "Beck's", brewery: "Brauerei Beck & Co", style: "German Pilsner", abv: 4.8, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" } },
  { slug: "peroni", name: "Peroni Nastro Azzurro", brewery: "Birra Peroni", style: "Italian Lager", abv: 5.1, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" } },
  { slug: "hertog-jan", name: "Hertog Jan", brewery: "AB InBev Netherlands", style: "Dutch Pilsner", abv: 5.1, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#D4A547" } },
  { slug: "tennents", name: "Tennent's Lager", brewery: "Wellpark Brewery", style: "Scottish Lager", abv: 5.0, colors: { primary: "#D4001A", secondary: "#FFF0F0", text: "#FFFFFF" } },
  { slug: "la-virgen", name: "La Virgen Lager", brewery: "Cervezas La Virgen", style: "Spanish Lager", abv: 5.0, colors: { primary: "#1E6B3A", secondary: "#E8F5E0", text: "#FFFFFF" } },

  // === CRAFT & IPA ===
  { slug: "goose-island-ipa", name: "Goose Island IPA", brewery: "Goose Island", style: "India Pale Ale", abv: 5.9, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" } },
  { slug: "goose-island-hazy", name: "Goose Island Hazy Beer Hug", brewery: "Goose Island", style: "Hazy IPA", abv: 6.4, colors: { primary: "#F5A623", secondary: "#FFFAE5", text: "#2C1A00" } },
  { slug: "brewdog-punk-ipa", name: "BrewDog Punk IPA", brewery: "BrewDog", style: "India Pale Ale", abv: 5.4, colors: { primary: "#00A3E0", secondary: "#E5F5FF", text: "#FFFFFF" } },
  { slug: "brewdog-elvis-juice", name: "BrewDog Elvis Juice", brewery: "BrewDog", style: "Grapefruit IPA", abv: 6.5, colors: { primary: "#FF6B1A", secondary: "#FFF3E5", text: "#1A1A1A" } },
  { slug: "camden-hells", name: "Camden Hells", brewery: "Camden Town Brewery", style: "Helles Lager", abv: 4.6, colors: { primary: "#000000", secondary: "#F5F0E0", text: "#F5C242" } },
  { slug: "camden-pale", name: "Camden Pale Ale", brewery: "Camden Town Brewery", style: "Pale Ale", abv: 4.0, colors: { primary: "#E87D00", secondary: "#FFF5E5", text: "#000000" } },
  { slug: "camden-ipa", name: "Camden IPA", brewery: "Camden Town Brewery", style: "India Pale Ale", abv: 5.8, colors: { primary: "#2E8B57", secondary: "#E5F5EC", text: "#FFFFFF" } },
  { slug: "tiny-rebel-clwb", name: "Tiny Rebel Clwb Tropicana", brewery: "Tiny Rebel", style: "Tropical IPA", abv: 5.5, colors: { primary: "#FF3399", secondary: "#FFE5F2", text: "#1A1A1A" } },
  { slug: "tiny-rebel-cali", name: "Tiny Rebel Cali Pale", brewery: "Tiny Rebel", style: "American Pale Ale", abv: 4.6, colors: { primary: "#FFD700", secondary: "#FFFCE5", text: "#1A1A1A" } },
  { slug: "thornbridge-jaipur", name: "Thornbridge Jaipur", brewery: "Thornbridge Brewery", style: "India Pale Ale", abv: 5.9, colors: { primary: "#8B4513", secondary: "#FFF5EB", text: "#FFFFFF" } },
  { slug: "vocation-life-death", name: "Vocation Life & Death", brewery: "Vocation Brewery", style: "India Pale Ale", abv: 6.5, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#D4001A" } },
  { slug: "fullers-london-pride", name: "Fuller's London Pride", brewery: "Fuller's", style: "English Bitter", abv: 4.7, colors: { primary: "#7B241C", secondary: "#F5E6E0", text: "#FFFFFF" } },
  { slug: "hawkstone", name: "Hawkstone Lager", brewery: "Hawkstone Brewing", style: "English Lager", abv: 4.8, colors: { primary: "#3D6B35", secondary: "#E8F0E0", text: "#F5E6C8" } },

  // === WHEAT & SPECIALTY ===
  { slug: "franziskaner", name: "Franziskaner Weissbier", brewery: "Spaten-Franziskaner-Bräu", style: "Hefeweizen", abv: 5.0, colors: { primary: "#2E5090", secondary: "#E8F0FF", text: "#F5C242" } },
  { slug: "old-peculier", name: "Theakston Old Peculier", brewery: "Theakston Brewery", style: "Old Ale", abv: 5.6, colors: { primary: "#2C0A1E", secondary: "#F0E0E8", text: "#C8922A" } },

  // === US-MARKET SPECIFIC ===
  { slug: "michelob-ultra", name: "Michelob Ultra", brewery: "Anheuser-Busch", style: "Light Lager", abv: 4.2, colors: { primary: "#0047AB", secondary: "#E8F0FF", text: "#C0C0C0" } },
  { slug: "kona-big-wave", name: "Kona Big Wave", brewery: "Kona Brewing", style: "Golden Ale", abv: 4.4, colors: { primary: "#0077B6", secondary: "#E5F5FF", text: "#FDB913" } },
  { slug: "golden-road-mango", name: "Golden Road Mango Cart", brewery: "Golden Road Brewing", style: "Fruit Wheat Ale", abv: 4.0, colors: { primary: "#FF8C00", secondary: "#FFF5E5", text: "#1A1A1A" } },
  { slug: "elysian-space-dust", name: "Elysian Space Dust", brewery: "Elysian Brewing", style: "India Pale Ale", abv: 8.2, colors: { primary: "#2C1654", secondary: "#E8E0F5", text: "#F5A623" } },

  // === CUSTOM / FALLBACK ===
  { slug: "custom", name: "Custom Beer", brewery: "Unknown", style: "Beer", abv: 5.0, colors: { primary: "#555555", secondary: "#F0F0F0", text: "#FFFFFF" } },
];

const slugIndex = new Map<string, BeerEntry>();
const nameIndex = new Map<string, BeerEntry>();
for (const beer of CATALOG) {
  slugIndex.set(beer.slug, beer);
  nameIndex.set(beer.name.toLowerCase(), beer);
}

export function getBeerBySlug(slug: string): BeerEntry | undefined {
  return slugIndex.get(slug);
}

export function getBeerByName(name: string): BeerEntry | undefined {
  return nameIndex.get(name.toLowerCase());
}

export function getAllBeers(): BeerEntry[] {
  return CATALOG.filter((b) => b.slug !== "custom");
}

export function searchBeers(query: string): BeerEntry[] {
  const q = query.toLowerCase();
  return CATALOG.filter(
    (b) =>
      b.slug !== "custom" &&
      (b.name.toLowerCase().includes(q) || b.brewery.toLowerCase().includes(q)),
  );
}

export function getCustomFallback(): BeerEntry {
  return slugIndex.get("custom")!;
}

export function resolveBeer(
  beerName: string | undefined,
  customBeers?: Array<{ name: string; color_primary?: string; color_secondary?: string; color_text?: string; image_url?: string; brewery?: string; style?: string; abv?: number }>,
): BeerEntry {
  if (beerName) {
    const byName = getBeerByName(beerName);
    if (byName) return byName;
    const bySlug = getBeerBySlug(beerName);
    if (bySlug) return bySlug;

    if (customBeers) {
      const custom = customBeers.find((c) => c.name.toLowerCase() === beerName.toLowerCase());
      if (custom) {
        return {
          slug: custom.name.toLowerCase().replace(/\s+/g, "-"),
          name: custom.name,
          brewery: custom.brewery ?? "Custom",
          style: custom.style ?? "Beer",
          abv: custom.abv ?? 5.0,
          colors: {
            primary: custom.color_primary ?? "#555555",
            secondary: custom.color_secondary ?? "#F0F0F0",
            text: custom.color_text ?? "#FFFFFF",
          },
          imagePath: custom.image_url,
        };
      }
    }

    return {
      ...getCustomFallback(),
      name: beerName,
      slug: beerName.toLowerCase().replace(/\s+/g, "-"),
    };
  }
  return getAllBeers()[0];
}
