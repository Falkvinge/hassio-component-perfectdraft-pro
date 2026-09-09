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
  breweryLogo?: string;
  kegId?: string;
}

function kegImage(slug: string): string {
  return `kegs/${slug}.webp`;
}

// Tier-2 visual fallback: a brewery logo shown when a beer has no keg photo.
// Keyed by the exact brewery name used in the catalog entries below. Extensible.
const BREWERY_LOGOS: Record<string, string> = {};

export function getBreweryLogo(brewery: string | undefined): string | undefined {
  return brewery ? BREWERY_LOGOS[brewery] : undefined;
}

const CATALOG: BeerEntry[] = [
  // === LEFFE ===
  { slug: "leffe-blonde", name: "Leffe Blonde", brewery: "Abbaye de Leffe", style: "Belgian Blonde", abv: 6.6, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" }, imagePath: kegImage("leffe-blonde"), kegId: "509" },
  { slug: "leffe-brune", name: "Leffe Brune", brewery: "Abbaye de Leffe", style: "Belgian Dubbel", abv: 6.5, colors: { primary: "#4A2810", secondary: "#F5E6D0", text: "#FFFFFF" }, imagePath: kegImage("leffe-brune"), kegId: "2172" },
  { slug: "leffe-amber", name: "Leffe Ambrée", brewery: "Abbaye de Leffe", style: "Belgian Amber", abv: 6.6, colors: { primary: "#B5651D", secondary: "#FFF0D6", text: "#1A0F00" }, imagePath: kegImage("leffe-amber") },
  { slug: "leffe-ruby", name: "Leffe Ruby", brewery: "Abbaye de Leffe", style: "Belgian Fruit Beer", abv: 5.0, colors: { primary: "#8B1A4A", secondary: "#FFE6F0", text: "#FFFFFF" }, imagePath: kegImage("leffe-ruby"), kegId: "1095" },
  { slug: "leffe-blanche", name: "Leffe Blanche", brewery: "Abbaye de Leffe", style: "Belgian Witbier", abv: 5.0, colors: { primary: "#E8DCC8", secondary: "#FFFDF5", text: "#2C2C2C" }, imagePath: kegImage("leffe-blanche"), kegId: "44171" },
  { slug: "leffe-winter", name: "Leffe Winter", brewery: "Abbaye de Leffe", style: "Belgian Winter Ale", abv: 6.6, colors: { primary: "#1B3A5C", secondary: "#E0ECF8", text: "#FFFFFF" } },
  { slug: "leffe-noel", name: "Leffe Noël", brewery: "Abbaye de Leffe", style: "Belgian Winter Ale", abv: 6.6, colors: { primary: "#1B3A5C", secondary: "#E0ECF8", text: "#FFFFFF" } },
  { slug: "leffe-dete", name: "Leffe d'Été", brewery: "Abbaye de Leffe", style: "Belgian Summer Ale", abv: 5.2, colors: { primary: "#F5C242", secondary: "#FFFBE6", text: "#1A0F00" }, imagePath: kegImage("leffe-dete") },
  { slug: "leffe-rituel", name: "Leffe Rituel 9°", brewery: "Abbaye de Leffe", style: "Belgian Strong Ale", abv: 9.0, colors: { primary: "#2C1A00", secondary: "#F5E6D0", text: "#C8922A" }, imagePath: kegImage("leffe-rituel") },
  { slug: "leffe-prestige", name: "Leffe Prestige 1240", brewery: "Abbaye de Leffe", style: "Belgian Strong Blonde", abv: 8.5, colors: { primary: "#1A3366", secondary: "#E0E8F5", text: "#C8922A" }, imagePath: kegImage("leffe-prestige") },
  { slug: "leffe-0", name: "Leffe Blonde 0.0%", brewery: "Abbaye de Leffe", style: "Non-Alcoholic Blonde", abv: 0.0, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" }, imagePath: kegImage("leffe-0"), kegId: "48019" },

  // === BELGIAN CLASSICS ===
  { slug: "hoegaarden", name: "Hoegaarden", brewery: "Brouwerij van Hoegaarden", style: "Belgian Witbier", abv: 4.9, colors: { primary: "#F0E4C8", secondary: "#FFFDF2", text: "#2A4B1E" }, imagePath: kegImage("hoegaarden"), kegId: "679" },
  { slug: "hoegaarden-rosee", name: "Hoegaarden Rosée", brewery: "Brouwerij van Hoegaarden", style: "Fruit Witbier", abv: 3.0, colors: { primary: "#E87D9F", secondary: "#FFF0F5", text: "#4A0028" }, imagePath: kegImage("hoegaarden-rosee") },
  { slug: "jupiler", name: "Jupiler", brewery: "AB InBev Belgium", style: "Belgian Pilsner", abv: 5.2, colors: { primary: "#D4001A", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("jupiler"), kegId: "458" },
  { slug: "kwak", name: "Pauwel Kwak", brewery: "Brouwerij Bosteels", style: "Belgian Strong Ale", abv: 8.4, colors: { primary: "#B34700", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("kwak") },
  { slug: "kwak-blonde", name: "Kwak Blonde", brewery: "Brouwerij Bosteels", style: "Belgian Blonde", abv: 7.4, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#2C1A00" }, imagePath: kegImage("kwak-blonde"), kegId: "42640" },
  { slug: "tripel-karmeliet", name: "Tripel Karmeliet", brewery: "Brouwerij Bosteels", style: "Belgian Tripel", abv: 8.4, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#2C1A00" }, imagePath: kegImage("tripel-karmeliet"), kegId: "31896" },
  { slug: "gulden-draak", name: "Gulden Draak", brewery: "Brouwerij Van Steenberge", style: "Belgian Strong Dark", abv: 10.5, colors: { primary: "#1A1A2E", secondary: "#E8E0F0", text: "#C9A24D" } },
  { slug: "saint-feuillien", name: "Saint-Feuillien Blonde", brewery: "Brasserie St-Feuillien", style: "Belgian Blonde", abv: 7.5, colors: { primary: "#C8922A", secondary: "#FFF6E0", text: "#1A0F00" }, imagePath: kegImage("saint-feuillien") },
  { slug: "dupont", name: "Saison Dupont Dry Hop", brewery: "Brasserie Dupont", style: "Belgian Saison", abv: 6.5, colors: { primary: "#8B6914", secondary: "#FFF8E0", text: "#1A0F00" }, imagePath: kegImage("dupont"), kegId: "47978" },

  // === STELLA ARTOIS ===
  { slug: "stella-artois", name: "Stella Artois", brewery: "Brouwerij Artois", style: "Belgian Lager", abv: 5.2, colors: { primary: "#0E4C1E", secondary: "#F0F8E8", text: "#FFFFFF" }, imagePath: kegImage("stella-artois"), kegId: "457" },
  { slug: "stella-artois-unfiltered", name: "Stella Artois Unfiltered", brewery: "Brouwerij Artois", style: "Unfiltered Lager", abv: 5.0, colors: { primary: "#D4A547", secondary: "#FFFCE8", text: "#0E4C1E" }, imagePath: kegImage("stella-artois-unfiltered"), kegId: "43009" },
  { slug: "stella-artois-0", name: "Stella Artois 0.0%", brewery: "Brouwerij Artois", style: "Non-Alcoholic Lager", abv: 0.0, colors: { primary: "#0E4C1E", secondary: "#F0F8E8", text: "#FFFFFF" }, imagePath: kegImage("stella-artois-0"), kegId: "47972" },

  // === LAGERS & PILSNERS ===
  { slug: "budweiser", name: "Budweiser", brewery: "Anheuser-Busch", style: "American Lager", abv: 5.0, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, kegId: "31747" },
  { slug: "bud", name: "Anheuser-Busch Bud", brewery: "Anheuser-Busch", style: "American Lager", abv: 5.0, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("bud") },
  { slug: "bud-light", name: "Bud Light", brewery: "Anheuser-Busch", style: "Light Lager", abv: 3.5, colors: { primary: "#004B8D", secondary: "#E8F4FF", text: "#FFFFFF" }, imagePath: kegImage("bud-light"), kegId: "42377" },
  { slug: "corona", name: "Corona Extra", brewery: "Grupo Modelo", style: "Mexican Lager", abv: 4.5, colors: { primary: "#FDB913", secondary: "#FFFCE5", text: "#00205B" }, imagePath: kegImage("corona"), kegId: "34493" },
  { slug: "corona-cero", name: "Corona Cero", brewery: "Grupo Modelo", style: "Non-Alcoholic Lager", abv: 0.0, colors: { primary: "#0073B1", secondary: "#E5F3FF", text: "#FFFFFF" }, imagePath: kegImage("corona-cero"), kegId: "43235" },
  { slug: "becks", name: "Beck's", brewery: "Brauerei Beck & Co", style: "German Pilsner", abv: 4.8, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("becks"), kegId: "453" },
  { slug: "becks-gold", name: "Beck's Gold", brewery: "Brauerei Beck & Co", style: "German Lager", abv: 4.9, colors: { primary: "#D4A547", secondary: "#FFF8E0", text: "#006838" }, imagePath: kegImage("becks-gold"), kegId: "452" },
  { slug: "peroni", name: "Peroni Nastro Azzurro", brewery: "Birra Peroni", style: "Italian Lager", abv: 5.1, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("peroni"), kegId: "47384" },
  { slug: "hertog-jan", name: "Hertog Jan", brewery: "AB InBev Netherlands", style: "Dutch Pilsner", abv: 5.1, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#D4A547" }, imagePath: kegImage("hertog-jan"), kegId: "2073" },
  { slug: "hertog-jan-grand", name: "Hertog Jan Grand Pilsener", brewery: "AB InBev Netherlands", style: "Dutch Pilsner", abv: 5.1, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#D4A547" }, imagePath: kegImage("hertog-jan-grand") },
  { slug: "tennents", name: "Tennent's Lager", brewery: "Wellpark Brewery", style: "Scottish Lager", abv: 5.0, colors: { primary: "#D4001A", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("tennents"), kegId: "36302" },
  { slug: "la-virgen", name: "La Virgen Lager", brewery: "Cervezas La Virgen", style: "Spanish Lager", abv: 5.0, colors: { primary: "#1E6B3A", secondary: "#E8F5E0", text: "#FFFFFF" }, imagePath: kegImage("la-virgen") },
  { slug: "san-miguel", name: "San Miguel", brewery: "San Miguel", style: "Spanish Lager", abv: 5.4, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("san-miguel"), kegId: "44059" },
  { slug: "victoria", name: "Victoria", brewery: "Victoria", style: "Spanish Lager", abv: 4.8, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#D4A547" }, imagePath: kegImage("victoria"), kegId: "42223" },
  { slug: "samson", name: "Samson 11", brewery: "Samson", style: "Czech Lager", abv: 4.7, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("samson"), kegId: "47984" },

  // === GERMAN BEERS ===
  { slug: "franziskaner", name: "Franziskaner Weissbier", brewery: "Spaten-Franziskaner-Bräu", style: "Hefeweizen", abv: 5.0, colors: { primary: "#2E5090", secondary: "#E8F0FF", text: "#F5C242" }, imagePath: kegImage("franziskaner"), kegId: "455" },
  { slug: "franziskaner-royal", name: "Franziskaner Royal", brewery: "Spaten-Franziskaner-Bräu", style: "Weissbier", abv: 6.0, colors: { primary: "#1A1A5C", secondary: "#E0E0F8", text: "#F5C242" }, imagePath: kegImage("franziskaner-royal"), kegId: "30955" },
  { slug: "franziskaner-kellerbier", name: "Franziskaner Kellerbier", brewery: "Spaten-Franziskaner-Bräu", style: "Kellerbier", abv: 5.2, colors: { primary: "#6B4423", secondary: "#F5E6D0", text: "#F5C242" }, imagePath: kegImage("franziskaner-kellerbier"), kegId: "44452" },
  { slug: "spaten", name: "Spaten", brewery: "Spaten-Franziskaner-Bräu", style: "Munich Helles", abv: 5.2, colors: { primary: "#1A3C0A", secondary: "#E8F0E0", text: "#FFFFFF" }, imagePath: kegImage("spaten"), kegId: "29974" },
  { slug: "lowenbrau", name: "Löwenbräu", brewery: "Löwenbräu", style: "Munich Helles", abv: 5.2, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("lowenbrau"), kegId: "454" },
  { slug: "hasseroder", name: "Hasseröder Premium", brewery: "Hasseröder Brauerei", style: "German Pilsner", abv: 4.9, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("hasseroder"), kegId: "500" },
  { slug: "diebels", name: "Diebels Alt", brewery: "Brauerei Diebels", style: "Altbier", abv: 4.9, colors: { primary: "#4A2810", secondary: "#F5E6D0", text: "#FFFFFF" }, imagePath: kegImage("diebels"), kegId: "456" },
  { slug: "schneider", name: "Schneider Bayrisch Hell", brewery: "G. Schneider & Sohn", style: "Bavarian Helles", abv: 5.2, colors: { primary: "#006838", secondary: "#E8F5E0", text: "#FFFFFF" }, imagePath: kegImage("schneider") },
  { slug: "haake-beck", name: "Haake-Beck", brewery: "Brauerei Beck & Co", style: "German Pilsner", abv: 4.9, colors: { primary: "#006838", secondary: "#E0F5E8", text: "#FFFFFF" }, imagePath: kegImage("haake-beck"), kegId: "47144" },
  { slug: "fruh-kolsch", name: "Früh Kölsch", brewery: "Cölner Hofbräu Früh", style: "Kölsch", abv: 4.8, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("fruh-kolsch"), kegId: "47977" },

  // === CRAFT & IPA ===
  { slug: "goose-island-ipa", name: "Goose Island IPA", brewery: "Goose Island", style: "India Pale Ale", abv: 5.9, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("goose-island-ipa"), kegId: "32816" },
  { slug: "goose-island-hazy", name: "Goose Island Hazy Beer Hug", brewery: "Goose Island", style: "Hazy IPA", abv: 6.4, colors: { primary: "#F5A623", secondary: "#FFFAE5", text: "#2C1A00" } },
  { slug: "goose-midway", name: "Goose Midway Session IPA", brewery: "Goose Island", style: "Session IPA", abv: 4.1, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("goose-midway") },
  { slug: "brewdog-punk-ipa", name: "BrewDog Punk IPA", brewery: "BrewDog", style: "India Pale Ale", abv: 5.4, colors: { primary: "#00A3E0", secondary: "#E5F5FF", text: "#FFFFFF" }, imagePath: kegImage("brewdog-punk-ipa"), kegId: "41830" },
  { slug: "brewdog-elvis-juice", name: "BrewDog Elvis Juice", brewery: "BrewDog", style: "Grapefruit IPA", abv: 6.5, colors: { primary: "#FF6B1A", secondary: "#FFF3E5", text: "#1A1A1A" }, imagePath: kegImage("brewdog-elvis-juice") },
  { slug: "camden-hells", name: "Camden Hells", brewery: "Camden Town Brewery", style: "Helles Lager", abv: 4.6, colors: { primary: "#000000", secondary: "#F5F0E0", text: "#F5C242" }, imagePath: kegImage("camden-hells"), kegId: "43006" },
  { slug: "camden-pale", name: "Camden Pale Ale", brewery: "Camden Town Brewery", style: "Pale Ale", abv: 4.0, colors: { primary: "#E87D00", secondary: "#FFF5E5", text: "#000000" }, imagePath: kegImage("camden-pale"), kegId: "43805" },
  { slug: "camden-ipa", name: "Camden IPA", brewery: "Camden Town Brewery", style: "India Pale Ale", abv: 5.8, colors: { primary: "#2E8B57", secondary: "#E5F5EC", text: "#FFFFFF" }, imagePath: kegImage("camden-ipa") },
  { slug: "camden-eazy", name: "Camden Eazy", brewery: "Camden Town Brewery", style: "Session Pale", abv: 4.0, colors: { primary: "#F5C242", secondary: "#FFFCE5", text: "#000000" }, imagePath: kegImage("camden-eazy"), kegId: "47629" },
  { slug: "tiny-rebel-clwb", name: "Tiny Rebel Clwb Tropicana", brewery: "Tiny Rebel", style: "Tropical IPA", abv: 5.5, colors: { primary: "#FF3399", secondary: "#FFE5F2", text: "#1A1A1A" }, imagePath: kegImage("tiny-rebel-clwb") },
  { slug: "vocation-life-death", name: "Vocation Life & Death", brewery: "Vocation Brewery", style: "India Pale Ale", abv: 6.5, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#D4001A" }, imagePath: kegImage("vocation-life-death"), kegId: "42526" },
  { slug: "vocation-hop-skip", name: "Vocation Hop, Skip & Juice", brewery: "Vocation Brewery", style: "Pale Ale", abv: 5.7, colors: { primary: "#F5A623", secondary: "#FFFAE5", text: "#1A1A1A" }, imagePath: kegImage("vocation-hop-skip") },
  { slug: "thornbridge-jaipur", name: "Thornbridge Jaipur", brewery: "Thornbridge Brewery", style: "India Pale Ale", abv: 5.9, colors: { primary: "#8B4513", secondary: "#FFF5EB", text: "#FFFFFF" }, imagePath: kegImage("thornbridge-jaipur"), kegId: "34327" },
  { slug: "ninkasi", name: "Ninkasi IPA", brewery: "Ninkasi Brasserie", style: "India Pale Ale", abv: 5.4, colors: { primary: "#D45500", secondary: "#FFF2E5", text: "#FFFFFF" }, imagePath: kegImage("ninkasi"), kegId: "47440" },

  // === ENGLISH & SCOTTISH ===
  { slug: "fullers-london-pride", name: "Fuller's London Pride", brewery: "Fuller's", style: "English Bitter", abv: 4.7, colors: { primary: "#7B241C", secondary: "#F5E6E0", text: "#FFFFFF" }, imagePath: kegImage("fullers-london-pride"), kegId: "47943" },
  { slug: "bass", name: "Bass Pale Ale", brewery: "Bass", style: "English Pale Ale", abv: 4.4, colors: { primary: "#E31837", secondary: "#FFF2F2", text: "#FFFFFF" }, kegId: "47962" },
  { slug: "hawkstone", name: "Hawkstone Lager", brewery: "Hawkstone Brewing", style: "English Lager", abv: 4.8, colors: { primary: "#3D6B35", secondary: "#E8F0E0", text: "#F5E6C8" }, kegId: "43019" },
  { slug: "old-peculier", name: "Theakston Old Peculier", brewery: "Theakston Brewery", style: "Old Ale", abv: 5.6, colors: { primary: "#2C0A1E", secondary: "#F0E0E8", text: "#C8922A" }, imagePath: kegImage("old-peculier"), kegId: "47285" },
  { slug: "adnams", name: "Adnams Ghost Ship", brewery: "Adnams", style: "Pale Ale", abv: 4.5, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" } },
  { slug: "old-speckled-hen", name: "Old Speckled Hen", brewery: "Greene King", style: "English Bitter", abv: 5.0, colors: { primary: "#8B4513", secondary: "#FFF5EB", text: "#FFFFFF" }, imagePath: kegImage("old-speckled-hen") },
  { slug: "northern-monk", name: "Northern Monk A Little Faith", brewery: "Northern Monk", style: "Session Pale", abv: 4.0, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#F5C242" }, imagePath: kegImage("northern-monk"), kegId: "48061" },
  { slug: "st-austell", name: "St Austell Proper Job IPA", brewery: "St Austell", style: "India Pale Ale", abv: 5.5, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, imagePath: kegImage("st-austell") },
  { slug: "trooper", name: "Trooper Original", brewery: "Robinsons", style: "English Bitter", abv: 4.7, colors: { primary: "#1A1A1A", secondary: "#F0F0F0", text: "#C8102E" }, imagePath: kegImage("trooper"), kegId: "47973" },

  // === FRENCH ===
  { slug: "castelain", name: "Castelain Grand Cru", brewery: "Brasserie Castelain", style: "Bière de Garde", abv: 6.2, colors: { primary: "#8B6914", secondary: "#FFF8E0", text: "#FFFFFF" }, imagePath: kegImage("castelain") },
  { slug: "castelain-chti", name: "Castelain Ch'ti Blonde", brewery: "Brasserie Castelain", style: "Bière de Garde", abv: 6.4, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#1A0F00" }, imagePath: kegImage("castelain-chti"), kegId: "47974" },
  { slug: "meteor", name: "Meteor White IPA", brewery: "Brasserie Meteor", style: "White IPA", abv: 5.6, colors: { primary: "#003DA5", secondary: "#E8F0FF", text: "#FFFFFF" }, imagePath: kegImage("meteor"), kegId: "47486" },
  { slug: "anoesteke", name: "Anosteké Blonde", brewery: "Brasserie du Pays Flamand", style: "French Blonde", abv: 8.0, colors: { primary: "#D4A547", secondary: "#FFF8E8", text: "#1A0F00" }, imagePath: kegImage("anoesteke") },
  { slug: "rousse-mont-blanc", name: "Rousse du Mont Blanc", brewery: "Brasserie du Mont Blanc", style: "French Amber", abv: 6.5, colors: { primary: "#B5651D", secondary: "#FFF0D6", text: "#FFFFFF" }, imagePath: kegImage("rousse-mont-blanc") },

  // === CUSTOM / FALLBACK ===
  { slug: "modelo", name: "Modelo Especial", brewery: "Grupo Modelo", style: "Mexican Lager", abv: 4.5, colors: { primary: "#B8860B", secondary: "#FFF8E8", text: "#1A0F00" }, kegId: "47979" },
  { slug: "mahou", name: "Mahou", brewery: "Mahou", style: "Spanish Lager", abv: 4.8, colors: { primary: "#C8102E", secondary: "#FFF0F0", text: "#FFFFFF" }, kegId: "44526" },
  { slug: "la-chouffe", name: "La Chouffe Blonde", brewery: "Brasserie d'Achouffe", style: "Belgian Blonde", abv: 8.0, colors: { primary: "#C0392B", secondary: "#FFF2EE", text: "#FFFFFF" }, kegId: "47986" },
  { slug: "siren-lumina", name: "Siren Lumina IPA", brewery: "Siren Craft Brew", style: "Session IPA", abv: 4.2, colors: { primary: "#1F8A8A", secondary: "#E0F5F5", text: "#FFFFFF" }, kegId: "48024" },
  { slug: "singha", name: "Singha", brewery: "Boon Rawd Brewery", style: "Thai Lager", abv: 5.0, colors: { primary: "#8B1A1A", secondary: "#FFF3E0", text: "#E8C86E" }, kegId: "47418" },
  { slug: "thatchers-gold", name: "Thatchers Gold", brewery: "Thatchers", style: "Cider", abv: 4.8, colors: { primary: "#D4A017", secondary: "#FFFBEA", text: "#3A2A00" }, kegId: "47999" },
  { slug: "kopparberg-strawberry-lime", name: "Kopparberg Strawberry & Lime", brewery: "Kopparberg", style: "Fruit Cider", abv: 4.0, colors: { primary: "#E4405F", secondary: "#FFF0F3", text: "#FFFFFF" }, kegId: "44090" },
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

export function getBeerByKegId(kegId: string | undefined): BeerEntry | undefined {
  if (!kegId) return undefined;
  return CATALOG.find((b) => b.kegId === kegId);
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
