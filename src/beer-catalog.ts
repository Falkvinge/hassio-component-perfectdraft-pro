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

function kegImage(slug: string): string {
  return `kegs/${slug}.png`;
}

const CATALOG: BeerEntry[] = [
  // === LEFFE ===
  { slug: "leffe-blonde", name: "Leffe Blonde", brewery: "Abbaye de Leffe", style: "Belgian Blonde", abv: 6.6, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" }, imagePath: kegImage("leffe-blonde") },
  { slug: "leffe-brune", name: "Leffe Brune", brewery: "Abbaye de Leffe", style: "Belgian Dubbel", abv: 6.5, colors: { primary: "#4A2810", secondary: "#F5E6D0", text: "#FFFFFF" }, imagePath: kegImage("leffe-brune") },
  { slug: "leffe-amber", name: "Leffe Ambrée", brewery: "Abbaye de Leffe", style: "Belgian Amber", abv: 6.6, colors: { primary: "#B5651D", secondary: "#FFF0D6", text: "#1A0F00" }, imagePath: kegImage("leffe-amber") },
  { slug: "leffe-ruby", name: "Leffe Ruby", brewery: "Abbaye de Leffe", style: "Belgian Fruit Beer", abv: 5.0, colors: { primary: "#8B1A4A", secondary: "#FFE6F0", text: "#FFFFFF" }, imagePath: kegImage("leffe-ruby") },
  { slug: "leffe-blanche", name: "Leffe Blanche", brewery: "Abbaye de Leffe", style: "Belgian Witbier", abv: 5.0, colors: { primary: "#E8DCC8", secondary: "#FFFDF5", text: "#2C2C2C" }, imagePath: kegImage("leffe-blanche") },
  { slug: "leffe-winter", name: "Leffe Winter", brewery: "Abbaye de Leffe", style: "Belgian Winter Ale", abv: 6.6, colors: { primary: "#1B3A5C", secondary: "#E0ECF8", text: "#FFFFFF" }, imagePath: kegImage("leffe-winter") },
  { slug: "leffe-noel", name: "Leffe Noël", brewery: "Abbaye de Leffe", style: "Belgian Winter Ale", abv: 6.6, colors: { primary: "#1B3A5C", secondary: "#E0ECF8", text: "#FFFFFF" }, imagePath: kegImage("leffe-winter") },
  { slug: "leffe-dete", name: "Leffe d'Été", brewery: "Abbaye de Leffe", style: "Belgian Summer Ale", abv: 5.2, colors: { primary: "#F5C242", secondary: "#FFFBE6", text: "#1A0F00" }, imagePath: kegImage("leffe-dete") },
  { slug: "leffe-rituel", name: "Leffe Rituel 9°", brewery: "Abbaye de Leffe", style: "Belgian Strong Ale", abv: 9.0, colors: { primary: "#2C1A00", secondary: "#F5E6D0", text: "#C8922A" }, imagePath: kegImage("leffe-rituel") },
  { slug: "leffe-prestige", name: "Leffe Prestige 1240", brewery: "Abbaye de Leffe", style: "Belgian Strong Blonde", abv: 8.5, colors: { primary: "#1A3366", secondary: "#E0E8F5", text: "#C8922A" }, imagePath: kegImage("leffe-prestige") },
  { slug: "leffe-0", name: "Leffe Blonde 0.0%", brewery: "Abbaye de Leffe", style: "Non-Alcoholic Blonde", abv: 0.0, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" }, imagePath: kegImage("leffe-0") },

  // === BELGIAN CLASSICS ===
  { slug: "hoegaarden", name: "Hoegaarden", brewery: "Brouwerij van Hoegaarden", style: "Belgian Witbier", abv: 4.9, colors: { primary: "#F0E4C8", secondary: "#FFFDF2", text: "#2A4B1E" }, imagePath: kegImage("hoegaarden") },
  { slug: "hoegaarden-rosee", name: "Hoegaarden Rosée", brewery: "Brouwerij van Hoegaarden", style: "Fruit Witbier", abv: 3.0, colors: { primary: "#E87D9F", secondary: "#FFF0F5", text: "#4A0028" }, imagePath: kegImage("hoegaarden-rosee") },
  { slug: "jupiler", name: "Jupiler", brewery: "AB InBev Belgium", style: "Belgian Pilsner", abv: 5.2, colors: { primary: "#D4001A", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("jupiler") },
  { slug: "kwak", name: "Pauwel Kwak", brewery: "Brouwerij Bosteels", style: "Belgian Strong Ale", abv: 8.4, colors: { primary: "#B34700", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("kwak") },
  { slug: "kwak-blonde", name: "Kwak Blonde", brewery: "Brouwerij Bosteels", style: "Belgian Blonde", abv: 7.4, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#2C1A00" }, imagePath: kegImage("kwak-blonde") },
  { slug: "tripel-karmeliet", name: "Tripel Karmeliet", brewery: "Brouwerij Bosteels", style: "Belgian Tripel", abv: 8.4, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#2C1A00" }, imagePath: kegImage("tripel-karmeliet") },
  { slug: "gulden-draak", name: "Gulden Draak", brewery: "Brouwerij Van Steenberge", style: "Belgian Strong Dark", abv: 10.5, colors: { primary: "#1A1A2E", secondary: "#E8E0F0", text: "#C9A24D" }, imagePath: kegImage("gulden-draak") },
  { slug: "saint-feuillien", name: "Saint-Feuillien Blonde", brewery: "Brasserie St-Feuillien", style: "Belgian Blonde", abv: 7.5, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" }, imagePath: kegImage("saint-feuillien") },
  { slug: "dupont", name: "Saison Dupont Dry Hop", brewery: "Brasserie Dupont", style: "Belgian Saison", abv: 6.5, colors: { primary: "#8B6914", secondary: "#FFF8E0", text: "#1A0F00" }, imagePath: kegImage("dupont") },

  // === STELLA ARTOIS ===
  { slug: "stella-artois", name: "Stella Artois", brewery: "Brouwerij Artois", style: "Belgian Lager", abv: 5.2, colors: { primary: "#0E4C1E", secondary: "#F0F8E8", text: "#FFFFFF" }, imagePath: kegImage("stella-artois") },
  { slug: "stella-artois-unfiltered", name: "Stella Artois Unfiltered", brewery: "Brouwerij Artois", style: "Unfiltered Lager", abv: 5.0, colors: { primary: "#D4A547", secondary: "#FFFCE8", text: "#0E4C1E" }, imagePath: kegImage("stella-artois-unfiltered") },
  { slug: "stella-artois-0", name: "Stella Artois 0.0%", brewery: "Brouwerij Artois", style: "Non-Alcoholic Lager", abv: 0.0, colors: { primary: "#0E4C1E", secondary: "#F0F8E8", text: "#FFFFFF" }, imagePath: kegImage("stella-artois-0") },

  // === LAGERS & PILSNERS ===
  { slug: "budweiser", name: "Budweiser", brewery: "Anheuser-Busch", style: "American Lager", abv: 5.0, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("budweiser") },
  { slug: "bud", name: "Anheuser-Busch Bud", brewery: "Anheuser-Busch", style: "American Lager", abv: 5.0, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("bud") },
  { slug: "bud-light", name: "Bud Light", brewery: "Anheuser-Busch", style: "Light Lager", abv: 3.5, colors: { primary: "#004B8D", secondary: "#E8F4FF", text: "#FFFFFF" }, imagePath: kegImage("bud-light") },
  { slug: "corona", name: "Corona Extra", brewery: "Grupo Modelo", style: "Mexican Lager", abv: 4.5, colors: { primary: "#FDB913", secondary: "#FFFCE5", text: "#00205B" }, imagePath: kegImage("corona") },
  { slug: "corona-cero", name: "Corona Cero", brewery: "Grupo Modelo", style: "Non-Alcoholic Lager", abv: 0.0, colors: { primary: "#0073B1", secondary: "#E5F3FF", text: "#FFFFFF" }, imagePath: kegImage("corona-cero") },
  { slug: "becks", name: "Beck's", brewery: "Brauerei Beck & Co", style: "German Pilsner", abv: 4.8, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("becks") },
  { slug: "becks-gold", name: "Beck's Gold", brewery: "Brauerei Beck & Co", style: "German Lager", abv: 4.9, colors: { primary: "#D4A547", secondary: "#FFF8E0", text: "#006838" }, imagePath: kegImage("becks-gold") },
  { slug: "peroni", name: "Peroni Nastro Azzurro", brewery: "Birra Peroni", style: "Italian Lager", abv: 5.1, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("peroni") },
  { slug: "hertog-jan", name: "Hertog Jan", brewery: "AB InBev Netherlands", style: "Dutch Pilsner", abv: 5.1, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#D4A547" }, imagePath: kegImage("hertog-jan") },
  { slug: "tennents", name: "Tennent's Lager", brewery: "Wellpark Brewery", style: "Scottish Lager", abv: 5.0, colors: { primary: "#D4001A", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("tennents") },
  { slug: "la-virgen", name: "La Virgen Lager", brewery: "Cervezas La Virgen", style: "Spanish Lager", abv: 5.0, colors: { primary: "#1E6B3A", secondary: "#E8F5E0", text: "#FFFFFF" }, imagePath: kegImage("la-virgen") },
  { slug: "san-miguel", name: "San Miguel", brewery: "San Miguel", style: "Spanish Lager", abv: 5.4, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("san-miguel") },
  { slug: "victoria", name: "Victoria", brewery: "Victoria", style: "Spanish Lager", abv: 4.8, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#D4A547" }, imagePath: kegImage("victoria") },
  { slug: "samson", name: "Samson 11", brewery: "Samson", style: "Czech Lager", abv: 4.7, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("samson") },

  // === GERMAN BEERS ===
  { slug: "franziskaner", name: "Franziskaner Weissbier", brewery: "Spaten-Franziskaner-Bräu", style: "Hefeweizen", abv: 5.0, colors: { primary: "#2E5090", secondary: "#E8F0FF", text: "#F5C242" }, imagePath: kegImage("franziskaner") },
  { slug: "franziskaner-royal", name: "Franziskaner Royal", brewery: "Spaten-Franziskaner-Bräu", style: "Weissbier", abv: 6.0, colors: { primary: "#1A1A5C", secondary: "#E0E0F8", text: "#F5C242" }, imagePath: kegImage("franziskaner-royal") },
  { slug: "franziskaner-kellerbier", name: "Franziskaner Kellerbier", brewery: "Spaten-Franziskaner-Bräu", style: "Kellerbier", abv: 5.2, colors: { primary: "#6B4423", secondary: "#F5E6D0", text: "#F5C242" }, imagePath: kegImage("franziskaner-kellerbier") },
  { slug: "spaten", name: "Spaten", brewery: "Spaten-Franziskaner-Bräu", style: "Munich Helles", abv: 5.2, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#FFFFFF" }, imagePath: kegImage("spaten") },
  { slug: "lowenbrau", name: "Löwenbräu", brewery: "Löwenbräu", style: "Munich Helles", abv: 5.2, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("lowenbrau") },
  { slug: "hasseroder", name: "Hasseröder Premium", brewery: "Hasseröder Brauerei", style: "German Pilsner", abv: 4.9, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("hasseroder") },
  { slug: "diebels", name: "Diebels Alt", brewery: "Brauerei Diebels", style: "Altbier", abv: 4.9, colors: { primary: "#4A2810", secondary: "#F5E6D0", text: "#FFFFFF" }, imagePath: kegImage("diebels") },
  { slug: "schneider", name: "Schneider Bayrisch Hell", brewery: "G. Schneider & Sohn", style: "Bavarian Helles", abv: 5.2, colors: { primary: "#006838", secondary: "#E8F5E0", text: "#FFFFFF" }, imagePath: kegImage("schneider") },
  { slug: "haake-beck", name: "Haake-Beck", brewery: "Brauerei Beck & Co", style: "German Pilsner", abv: 4.9, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("haake-beck") },
  { slug: "fruh-kolsch", name: "Früh Kölsch", brewery: "Cölner Hofbräu Früh", style: "Kölsch", abv: 4.8, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("fruh-kolsch") },

  // === CRAFT & IPA ===
  { slug: "goose-island-ipa", name: "Goose Island IPA", brewery: "Goose Island", style: "India Pale Ale", abv: 5.9, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("goose-island-ipa") },
  { slug: "goose-island-hazy", name: "Goose Island Hazy Beer Hug", brewery: "Goose Island", style: "Hazy IPA", abv: 6.4, colors: { primary: "#F5A623", secondary: "#FFFAE5", text: "#2C1A00" }, imagePath: kegImage("goose-island-hazy") },
  { slug: "goose-midway", name: "Goose Midway Session IPA", brewery: "Goose Island", style: "Session IPA", abv: 4.1, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("goose-midway") },
  { slug: "brewdog-punk-ipa", name: "BrewDog Punk IPA", brewery: "BrewDog", style: "India Pale Ale", abv: 5.4, colors: { primary: "#00A3E0", secondary: "#E5F5FF", text: "#FFFFFF" }, imagePath: kegImage("brewdog-punk-ipa") },
  { slug: "brewdog-elvis-juice", name: "BrewDog Elvis Juice", brewery: "BrewDog", style: "Grapefruit IPA", abv: 6.5, colors: { primary: "#FF6B1A", secondary: "#FFF3E5", text: "#1A1A1A" }, imagePath: kegImage("brewdog-elvis-juice") },
  { slug: "camden-hells", name: "Camden Hells", brewery: "Camden Town Brewery", style: "Helles Lager", abv: 4.6, colors: { primary: "#000000", secondary: "#F5F0E0", text: "#F5C242" }, imagePath: kegImage("camden-hells") },
  { slug: "camden-pale", name: "Camden Pale Ale", brewery: "Camden Town Brewery", style: "Pale Ale", abv: 4.0, colors: { primary: "#E87D00", secondary: "#FFF5E5", text: "#000000" }, imagePath: kegImage("camden-pale") },
  { slug: "camden-ipa", name: "Camden IPA", brewery: "Camden Town Brewery", style: "India Pale Ale", abv: 5.8, colors: { primary: "#2E8B57", secondary: "#E5F5EC", text: "#FFFFFF" }, imagePath: kegImage("camden-ipa") },
  { slug: "camden-eazy", name: "Camden Eazy", brewery: "Camden Town Brewery", style: "Session Pale", abv: 4.0, colors: { primary: "#F5C242", secondary: "#FFFCE5", text: "#000000" }, imagePath: kegImage("camden-eazy") },
  { slug: "tiny-rebel-clwb", name: "Tiny Rebel Clwb Tropicana", brewery: "Tiny Rebel", style: "Tropical IPA", abv: 5.5, colors: { primary: "#FF3399", secondary: "#FFE5F2", text: "#1A1A1A" }, imagePath: kegImage("tiny-rebel-clwb") },
  { slug: "vocation-life-death", name: "Vocation Life & Death", brewery: "Vocation Brewery", style: "India Pale Ale", abv: 6.5, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#D4001A" }, imagePath: kegImage("vocation-life-death") },
  { slug: "vocation-hop-skip", name: "Vocation Hop, Skip & Juice", brewery: "Vocation Brewery", style: "Pale Ale", abv: 5.7, colors: { primary: "#F5A623", secondary: "#FFFAE5", text: "#1A1A1A" }, imagePath: kegImage("vocation-hop-skip") },
  { slug: "thornbridge-jaipur", name: "Thornbridge Jaipur", brewery: "Thornbridge Brewery", style: "India Pale Ale", abv: 5.9, colors: { primary: "#8B4513", secondary: "#FFF5EB", text: "#FFFFFF" }, imagePath: kegImage("thornbridge-jaipur") },
  { slug: "ninkasi", name: "Ninkasi IPA", brewery: "Ninkasi Brasserie", style: "India Pale Ale", abv: 5.4, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("ninkasi") },

  // === ENGLISH & SCOTTISH ===
  { slug: "fullers-london-pride", name: "Fuller's London Pride", brewery: "Fuller's", style: "English Bitter", abv: 4.7, colors: { primary: "#7B241C", secondary: "#F5E6E0", text: "#FFFFFF" }, imagePath: kegImage("fullers-london-pride") },
  { slug: "hawkstone", name: "Hawkstone Lager", brewery: "Hawkstone Brewing", style: "English Lager", abv: 4.8, colors: { primary: "#3D6B35", secondary: "#E8F0E0", text: "#F5E6C8" }, imagePath: kegImage("hawkstone") },
  { slug: "old-peculier", name: "Theakston Old Peculier", brewery: "Theakston Brewery", style: "Old Ale", abv: 5.6, colors: { primary: "#2C0A1E", secondary: "#F0E0E8", text: "#C8922A" }, imagePath: kegImage("old-peculier") },
  { slug: "adnams", name: "Adnams Ghost Ship", brewery: "Adnams", style: "Pale Ale", abv: 4.5, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("adnams") },
  { slug: "old-speckled-hen", name: "Old Speckled Hen", brewery: "Greene King", style: "English Bitter", abv: 5.0, colors: { primary: "#8B4513", secondary: "#FFF5EB", text: "#FFFFFF" }, imagePath: kegImage("old-speckled-hen") },
  { slug: "northern-monk", name: "Northern Monk A Little Faith", brewery: "Northern Monk", style: "Session Pale", abv: 4.0, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#F5C242" }, imagePath: kegImage("northern-monk") },
  { slug: "st-austell", name: "St Austell Proper Job IPA", brewery: "St Austell", style: "India Pale Ale", abv: 5.5, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("st-austell") },
  { slug: "trooper", name: "Trooper Original", brewery: "Robinsons", style: "English Bitter", abv: 4.7, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#C8102E" }, imagePath: kegImage("trooper") },

  // === FRENCH ===
  { slug: "castelain", name: "Castelain Grand Cru", brewery: "Brasserie Castelain", style: "Bière de Garde", abv: 6.2, colors: { primary: "#8B6914", secondary: "#FFF8E0", text: "#FFFFFF" }, imagePath: kegImage("castelain") },
  { slug: "meteor", name: "Meteor White IPA", brewery: "Brasserie Meteor", style: "White IPA", abv: 5.6, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("meteor") },
  { slug: "anoesteke", name: "Anosteké Blonde", brewery: "Brasserie du Pays Flamand", style: "French Blonde", abv: 8.0, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#1A0F00" }, imagePath: kegImage("anoesteke") },
  { slug: "rousse-mont-blanc", name: "Rousse du Mont Blanc", brewery: "Brasserie du Mont Blanc", style: "French Amber", abv: 6.5, colors: { primary: "#B5651D", secondary: "#FFF0D6", text: "#FFFFFF" }, imagePath: kegImage("rousse-mont-blanc") },

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
