export const categories = [
  {
    id: 1,
    name: "Obst & Gemüse",
    slug: "obst-gemuese",
    subcategories: [
      { id: 11, name: "Obst", slug: "obst" },
      { id: 12, name: "Gemüse", slug: "gemuese" },
      { id: 13, name: "Kräuter", slug: "kraeuter" },
      { id: 14, name: "Bio-Produkte", slug: "bio-produkte" },
    ],
  },
  {
    id: 2,
    name: "Fleisch, Geflügel & Fisch",
    slug: "fleisch-gefluegel-fisch",
    subcategories: [
      { id: 21, name: "Rindfleisch", slug: "rindfleisch" },
      { id: 22, name: "Lammfleisch", slug: "lammfleisch" },
      { id: 23, name: "Hähnchen", slug: "haehnchen" },
      { id: 24, name: "Hackfleisch", slug: "hackfleisch" },
      { id: 25, name: "Wurstwaren", slug: "wurstwaren" },
      { id: 26, name: "Fisch", slug: "fisch" },
    ],
  },
  {
    id: 3,
    name: "Milchprodukte & Eier",
    slug: "milchprodukte-eier",
    subcategories: [
      { id: 31, name: "Milch", slug: "milch" },
      { id: 32, name: "Joghurt", slug: "joghurt" },
      { id: 33, name: "Käse", slug: "kaese" },
      { id: 34, name: "Butter & Margarine", slug: "butter-margarine" },
      { id: 35, name: "Eier", slug: "eier" },
    ],
  },
  {
    id: 4,
    name: "Frühstück",
    slug: "fruehstueck",
    subcategories: [
      { id: 41, name: "Brot & Backwaren", slug: "brot-backwaren" },
      { id: 42, name: "Müsli & Cerealien", slug: "muesli-cerealien" },
      { id: 43, name: "Honig & Marmelade", slug: "honig-marmelade" },
      { id: 44, name: "Aufstriche", slug: "aufstriche" },
    ],
  },
  {
    id: 5,
    name: "Grundnahrungsmittel",
    slug: "grundnahrungsmittel",
    subcategories: [
      { id: 51, name: "Reis", slug: "reis" },
      { id: 52, name: "Nudeln", slug: "nudeln" },
      { id: 53, name: "Mehl", slug: "mehl" },
      { id: 54, name: "Zucker & Salz", slug: "zucker-salz" },
      { id: 55, name: "Hülsenfrüchte", slug: "huelsenfruechte" },
    ],
  },
  {
    id: 6,
    name: "Getränke",
    slug: "getraenke",
    subcategories: [
      { id: 61, name: "Wasser", slug: "wasser" },
      { id: 62, name: "Säfte", slug: "saefte" },
      { id: 63, name: "Softdrinks", slug: "softdrinks" },
      { id: 64, name: "Tee", slug: "tee" },
      { id: 65, name: "Kaffee", slug: "kaffee" },
    ],
  },
  {
    id: 7,
    name: "Snacks & Süßwaren",
    slug: "snacks-suesswaren",
    subcategories: [
      { id: 71, name: "Chips", slug: "chips" },
      { id: 72, name: "Schokolade", slug: "schokolade" },
      { id: 73, name: "Kekse", slug: "kekse" },
      { id: 74, name: "Nüsse", slug: "nuesse" },
    ],
  },
  {
    id: 8,
    name: "Tiefkühlprodukte",
    slug: "tiefkuehlprodukte",
    subcategories: [
      { id: 81, name: "Tiefkühlgemüse", slug: "tiefkuehlgemuese" },
      { id: 82, name: "Tiefkühlpizza", slug: "tiefkuehlpizza" },
      { id: 83, name: "Eiscreme", slug: "eiscreme" },
    ],
  },
  {
    id: 9,
    name: "Reinigungsmittel",
    slug: "reinigungsmittel",
    subcategories: [
      { id: 91, name: "Waschmittel", slug: "waschmittel" },
      { id: 92, name: "Spülmittel", slug: "spuelmittel" },
      { id: 93, name: "Haushaltsreiniger", slug: "haushaltsreiniger" },
      { id: 94, name: "Papierprodukte", slug: "papierprodukte" },
    ],
  },
];

export const brands = [
  { id: 101, name: "Pınar", slug: "pinar" },
  { id: 102, name: "Banvit", slug: "banvit" },
  { id: 103, name: "Sütaş", slug: "sutas" },
  { id: 104, name: "Ülker", slug: "ulker" },
  { id: 105, name: "Dardanel", slug: "dardanel" },

  { id: 106, name: "Torku", slug: "torku" },
  { id: 107, name: "Eti", slug: "eti" },
  { id: 108, name: "Tat", slug: "tat" },
  { id: 109, name: "Sek", slug: "sek" },
  { id: 110, name: "Namet", slug: "namet" },

  { id: 111, name: "Yayla", slug: "yayla" },
  { id: 112, name: "Beypazarı", slug: "beypazari" },
  { id: 113, name: "Doğuş", slug: "dogus" },
  { id: 114, name: "Çaykur", slug: "caykur" },
  { id: 115, name: "Dr. Oetker", slug: "dr-oetker" },

  { id: 116, name: "Bifa", slug: "bifa" },
  { id: 117, name: "Sera", slug: "sera" },
  { id: 118, name: "Öncü", slug: "oncu" },
  { id: 119, name: "Komili", slug: "komili" },
  { id: 120, name: "Kent", slug: "kent" },

  { id: 121, name: "Haribo", slug: "haribo" },
  { id: 122, name: "Ferrero", slug: "ferrero" },
  { id: 123, name: "Milka", slug: "milka" },
  { id: 124, name: "Nescafé", slug: "nescafe" },
  { id: 125, name: "Knorr", slug: "knorr" },
];
