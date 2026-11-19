/*
 * Supermarchés : recherche des magasins proches via OpenStreetMap
 * (Overpass pour les magasins, Nominatim pour chercher une ville) et
 * indice de prix approximatif par enseigne (1 = prix moyen).
 *
 * Les indices sont des ordres de grandeur tirés des comparatifs de prix
 * publiés en France (discount et hypers moins chers, proximité plus chère).
 * Ce ne sont pas des prix relevés en magasin.
 */

export const CHAINS = [
  { id: "lidl", label: "Lidl", re: /lidl/i, index: 0.86 },
  { id: "aldi", label: "Aldi", re: /aldi/i, index: 0.86 },
  { id: "netto", label: "Netto", re: /netto/i, index: 0.9 },
  { id: "leaderprice", label: "Leader Price", re: /leader ?price/i, index: 0.9 },
  { id: "leclerc", label: "E.Leclerc", re: /leclerc/i, index: 0.9 },
  { id: "intermarche", label: "Intermarché", re: /intermarch/i, index: 0.95 },
  { id: "auchan", label: "Auchan", re: /auchan/i, index: 0.95 },
  { id: "superu", label: "Super U / Hyper U", re: /(super|hyper|u express|marché u|^u\b|système u)/i, index: 0.97 },
  { id: "grandfrais", label: "Grand Frais", re: /grand ?frais/i, index: 0.98 },
  { id: "carrefourcity", label: "Carrefour City / Express", re: /carrefour (city|express|contact)/i, index: 1.15 },
  { id: "carrefourmarket", label: "Carrefour Market", re: /carrefour market/i, index: 1.03 },
  { id: "carrefour", label: "Carrefour", re: /carrefour/i, index: 0.98 },
  { id: "casino", label: "Casino / Géant", re: /(casino|géant|geant)/i, index: 1.05 },
  { id: "franprix", label: "Franprix", re: /franprix/i, index: 1.18 },
  { id: "monoprix", label: "Monoprix", re: /monop/i, index: 1.25 },
  { id: "picard", label: "Picard", re: /picard/i, index: 1.2 },
  { id: "bio", label: "Magasin bio", re: /(biocoop|naturalia|bio c'? ?bon|la vie claire)/i, index: 1.4 },
];

export function chainFor(name, brand) {
  const text = `${brand || ""} ${name || ""}`;
  return CHAINS.find((c) => c.re.test(text)) || null;
}

function distanceKm(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function currentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("La localisation n'est pas disponible sur cet appareil."));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => reject(new Error("Localisation refusée. Autorise-la dans les réglages du téléphone ou cherche une ville.")),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
  });
}

export async function geocode(query) {
  const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=fr&q=" + encodeURIComponent(query);
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("Recherche impossible pour le moment, réessaie dans un instant.");
  const j = await r.json();
  if (!j.length) throw new Error("Lieu introuvable. Essaie avec une ville ou un code postal.");
  return { lat: Number(j[0].lat), lon: Number(j[0].lon), label: j[0].display_name.split(",").slice(0, 2).join(",") };
}

export async function nearbySupermarkets(pos, radiusKm) {
  const r = Math.round(radiusKm * 1000);
  const q = `[out:json][timeout:25];(node["shop"="supermarket"](around:${r},${pos.lat},${pos.lon});way["shop"="supermarket"](around:${r},${pos.lat},${pos.lon}););out center 80;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(q),
  });
  if (!res.ok) throw new Error("Le service de cartes ne répond pas, réessaie dans un instant.");
  const j = await res.json();
  return (j.elements || [])
    .map((e) => {
      const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
      const t = e.tags || {};
      const chain = chainFor(t.name, t.brand);
      const street = [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" ");
      return {
        id: `${e.type}/${e.id}`,
        name: t.name || t.brand || "Supermarché",
        chainId: chain ? chain.id : null,
        chainLabel: chain ? chain.label : null,
        index: chain ? chain.index : 1,
        address: [street, t["addr:city"]].filter(Boolean).join(", "),
        lat, lon,
        dist: distanceKm(pos, { lat, lon }),
      };
    })
    .filter((s) => s.lat != null)
    .sort((a, b) => a.dist - b.dist);
}

export function mapsLink(store) {
  return `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`;
}
