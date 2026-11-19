/*
 * Enseignes de supermarché et indice de prix approximatif (1 = prix moyen).
 * Les indices sont des ordres de grandeur tirés des comparatifs de prix
 * publiés en France (discount et hypers moins chers, proximité plus chère).
 * Ce ne sont pas des prix relevés en magasin.
 */
export const CHAINS = [
  { id: "lidl", label: "Lidl", index: 0.86, kind: "Discount" },
  { id: "aldi", label: "Aldi", index: 0.86, kind: "Discount" },
  { id: "netto", label: "Netto", index: 0.9, kind: "Discount" },
  { id: "leclerc", label: "E.Leclerc", index: 0.9, kind: "Hyper et supermarché" },
  { id: "intermarche", label: "Intermarché", index: 0.95, kind: "Hyper et supermarché" },
  { id: "auchan", label: "Auchan", index: 0.95, kind: "Hyper et supermarché" },
  { id: "superu", label: "Super U / Hyper U", index: 0.97, kind: "Hyper et supermarché" },
  { id: "carrefour", label: "Carrefour", index: 0.98, kind: "Hyper et supermarché" },
  { id: "grandfrais", label: "Grand Frais", index: 0.98, kind: "Hyper et supermarché" },
  { id: "carrefourmarket", label: "Carrefour Market", index: 1.03, kind: "Hyper et supermarché" },
  { id: "casino", label: "Casino", index: 1.05, kind: "Proximité" },
  { id: "carrefourcity", label: "Carrefour City / Express", index: 1.15, kind: "Proximité" },
  { id: "franprix", label: "Franprix", index: 1.18, kind: "Proximité" },
  { id: "picard", label: "Picard", index: 1.2, kind: "Spécialisé" },
  { id: "monoprix", label: "Monoprix", index: 1.25, kind: "Proximité" },
  { id: "bio", label: "Magasin bio (Biocoop, Naturalia…)", index: 1.4, kind: "Spécialisé" },
];

export const CHAIN_KINDS = ["Discount", "Hyper et supermarché", "Proximité", "Spécialisé"];

export function storeFromChain(c) {
  return { id: c.id, name: c.label, chainLabel: c.label, index: c.index };
}

/** Ouvre Google Maps sur les magasins de l'enseigne les plus proches. */
export function mapsLink(store) {
  return `https://www.google.com/maps/search/${encodeURIComponent((store.chainLabel || store.name).split(" (")[0].split(" /")[0])}`;
}
