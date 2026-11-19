import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Plus, Minus, Check, Heart, ShoppingCart, User, ChefHat, Clock, Trash2, Search, MapPin, Navigation, Store } from "lucide-react";
import { INGREDIENTS, RECIPES, ALLERGENS, APPLIANCES } from "./data.js";
import { currentPosition, geocode, nearbySupermarkets, mapsLink } from "./stores.js";

const STORAGE_KEY = "popote-data";

/* ---------------- thème (même style que l'appli muscu) ---------------- */
const C = {
  surface: "#FFFFFF",
  surfaceRaised: "#F0F0ED",
  line: "rgba(24,22,18,0.08)",
  text: "#1C1A16",
  muted: "#6E6B63",
  mutedDim: "#A8A49B",
  tomato: "#D15B3E", // couleur principale
  protein: "#2E8E66",
  kcal: "#3C6FA5",
  money: "#C58A3A",
  danger: "#D1503E",
};
const BG = "linear-gradient(180deg, #F7F5EF 0%, #F0EEE7 55%, #EBE9E1 100%)";

const GOALS = [
  { id: "masse", label: "Prise de masse", factor: 2.0, kcalPerKg: 38, desc: "Plus de calories, beaucoup de protéines" },
  { id: "maintien", label: "Maintien", factor: 1.6, kcalPerKg: 32, desc: "Équilibré" },
  { id: "seche", label: "Sèche", factor: 2.2, kcalPerKg: 26, desc: "Beaucoup de protéines, moins de calories" },
];
const TIME_FILTERS = [
  { id: "all", label: "Tout", max: Infinity },
  { id: "15", label: "≤ 15 min", max: 15 },
  { id: "25", label: "≤ 25 min", max: 25 },
];

const DEFAULT_PROFILE = {
  goal: "maintien",
  weight: 75,
  mealsPerDay: 4,
  proteinOverride: null, // nombre de g fixé à la main, sinon calcul auto
  budget: 4,
  appliances: ["poele", "casserole", "micro"],
  allergies: [],
  veg: false,
};
const DEFAULT_DATA = { profile: DEFAULT_PROFILE, favorites: [], shopping: [], onboarded: false, stores: [], activeStore: null };

/* ---------------- calculs ---------------- */
const eur = (v) => v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
const r5 = (g) => Math.max(5, Math.round(g / 5) * 5);

export function proteinTarget(profile) {
  if (profile.proteinOverride) return profile.proteinOverride;
  const goal = GOALS.find((g) => g.id === profile.goal) || GOALS[1];
  return Math.round((profile.weight * goal.factor) / profile.mealsPerDay);
}

/** Calories visées par repas, selon l'objectif (repère pour trier les recettes). */
export function kcalTarget(profile) {
  const goal = GOALS.find((g) => g.id === profile.goal) || GOALS[1];
  return Math.round((profile.weight * goal.kcalPerKg) / profile.mealsPerDay / 10) * 10;
}

function baseStats(recipe) {
  let kcal = 0, p = 0, c = 0, f = 0, cost = 0;
  const allergens = new Set();
  let meat = false;
  recipe.items.forEach(([id, g]) => {
    const ing = INGREDIENTS[id];
    kcal += (ing.kcal * g) / 100; p += (ing.p * g) / 100; c += (ing.c * g) / 100; f += (ing.f * g) / 100;
    cost += (ing.eur * g) / 1000;
    (ing.allergens || []).forEach((a) => allergens.add(a));
    if (ing.meat) meat = true;
  });
  return { kcal, p, c, f, cost: cost + 0.1 /* sel, épices */, allergens: [...allergens], meat };
}

/** Facteur de portion pour atteindre la cible de protéines. */
function scaleFor(recipe, base, target) {
  const k = target / Math.max(1, base.p);
  return Math.round(Math.min(2.2, Math.max(0.6, k)) * 20) / 20;
}

function analyse(recipe, profile, priceIndex) {
  const base = baseStats(recipe);
  const target = proteinTarget(profile);
  const k = scaleFor(recipe, base, target);
  const stats = { kcal: base.kcal * k, p: base.p * k, c: base.c * k, f: base.f * k, cost: base.cost * k * priceIndex };
  const reasons = [];
  const badAllergens = base.allergens.filter((a) => profile.allergies.includes(a));
  if (badAllergens.length) reasons.push("allergy");
  if (profile.veg && base.meat) reasons.push("veg");
  const okAppliances = recipe.needs.every((group) => group.some((a) => profile.appliances.includes(a)));
  if (!okAppliances) reasons.push("appliance");
  if (stats.cost > profile.budget + 1e-9) reasons.push("budget");
  return { recipe, base, k, stats, reasons, badAllergens };
}

/** Les recettes les plus proches de la cible de calories passent en premier. */
function sortScore(a, profile) {
  return -Math.abs(a.stats.kcal - kcalTarget(profile));
}

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("recipes");
  const [openId, setOpenId] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let d = DEFAULT_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const j = JSON.parse(raw); d = { ...DEFAULT_DATA, ...j, profile: { ...DEFAULT_PROFILE, ...(j.profile || {}) } }; }
    } catch (e) { /* stockage indisponible */ }
    setData(d);
  }, []);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 1800); return () => clearTimeout(t); }, [toast]);

  function persist(next) {
    setData(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  }

  const activeStore = data ? (data.stores || []).find((s) => s.id === data.activeStore) || null : null;
  const priceIndex = activeStore ? activeStore.index : 1;
  const analysed = useMemo(() => (data ? RECIPES.map((r) => analyse(r, data.profile, priceIndex)) : []), [data && data.profile, priceIndex]);

  if (!data) return <div style={{ minHeight: "100vh", background: BG }} />;

  const profile = data.profile;
  const setProfile = (patch) => persist({ ...data, profile: { ...profile, ...patch }, onboarded: true });
  const isFav = (id) => data.favorites.includes(id);
  const toggleFav = (id) => persist({ ...data, favorites: isFav(id) ? data.favorites.filter((x) => x !== id) : [...data.favorites, id] });

  function addToShopping(a, servings) {
    const list = data.shopping.slice();
    a.recipe.items.forEach(([id, g]) => {
      const grams = g * a.k * servings;
      const i = list.findIndex((x) => x.id === id && !x.checked);
      if (i >= 0) list[i] = { ...list[i], g: list[i].g + grams, from: [...new Set([...list[i].from, a.recipe.name])] };
      else list.push({ id, g: grams, checked: false, from: [a.recipe.name] });
    });
    persist({ ...data, shopping: list });
    setToast("Ajouté à la liste de courses");
  }

  function goTab(t) { setTab(t); setOpenId(null); }

  let screen;
  if (openId) {
    const a = analysed.find((x) => x.recipe.id === openId);
    screen = <RecipeDetail a={a} target={proteinTarget(profile)} fav={isFav(openId)} onFav={() => toggleFav(openId)} onShop={(s) => addToShopping(a, s)} onBack={() => setOpenId(null)} />;
  } else if (tab === "recipes") {
    screen = <RecipeList analysed={analysed} profile={profile} store={activeStore} timeFilter={timeFilter} setTimeFilter={setTimeFilter} query={query} setQuery={setQuery}
      showHidden={showHidden} setShowHidden={setShowHidden} onOpen={setOpenId} isFav={isFav}
      onboarded={data.onboarded} onSetup={() => goTab("profile")} />;
  } else if (tab === "favorites") {
    screen = <Favorites analysed={analysed.filter((a) => isFav(a.recipe.id))} onOpen={setOpenId} />;
  } else if (tab === "shopping") {
    screen = <Shopping list={data.shopping} stores={data.stores || []} activeStore={activeStore} onChange={(list) => persist({ ...data, shopping: list })} />;
  } else {
    screen = <Profile profile={profile} setProfile={setProfile} stores={data.stores || []} activeStore={data.activeStore}
      onStores={(stores, activeId) => persist({ ...data, stores, activeStore: activeId, onboarded: true })} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "system-ui,-apple-system,sans-serif", color: C.text }}>
      <style>{`
        @keyframes pop {0%{transform:scale(.97);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes toastIn {0%{transform:translate(-50%,10px);opacity:0}100%{transform:translate(-50%,0);opacity:1}}
        .press{transition:transform .14s ease}
        .press:active{transform:scale(.96)}
        .hscroll::-webkit-scrollbar{display:none}
        *{-webkit-tap-highlight-color:transparent}
        input[type=range]{accent-color:${C.tomato}}
      `}</style>
      <div style={{ padding: "max(22px, env(safe-area-inset-top)) 16px 112px", maxWidth: 520, margin: "0 auto" }}>{screen}</div>
      {toast && <div style={{ position: "fixed", left: "50%", bottom: "calc(86px + env(safe-area-inset-bottom))", transform: "translateX(-50%)", background: C.text, color: "#fff", padding: "10px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, zIndex: 30, animation: "toastIn .2s ease" }}>{toast}</div>}
      <TabBar tab={tab} onTab={goTab} cartCount={data.shopping.filter((x) => !x.checked).length} favCount={data.favorites.length} />
    </div>
  );
}

/* ================= Recettes ================= */
const REASON_LABEL = { allergy: "allergie", veg: "végétarien", appliance: "appareil manquant", budget: "hors budget" };

function RecipeList({ analysed, profile, store, timeFilter, setTimeFilter, query, setQuery, showHidden, setShowHidden, onOpen, isFav, onboarded, onSetup }) {
  const q = query.trim().toLowerCase();
  const maxTime = TIME_FILTERS.find((t) => t.id === timeFilter).max;
  const inMeal = analysed.filter((a) => a.recipe.time <= maxTime && (!q || a.recipe.name.toLowerCase().includes(q)));
  const ok = inMeal.filter((a) => a.reasons.length === 0).sort((x, y) => sortScore(y, profile) - sortScore(x, profile));
  const overBudget = inMeal.filter((a) => a.reasons.length === 1 && a.reasons[0] === "budget");
  const hiddenCount = inMeal.length - ok.length;
  const target = proteinTarget(profile);
  const goal = GOALS.find((g) => g.id === profile.goal);

  return (
    <div style={{ animation: "pop .25s ease" }}>
      <div style={eyebrow}>POPOTE</div>
      <div style={h1}>Déjeuner & dîner</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 16px" }}>
        <Pill color={C.tomato}>{goal.label}</Pill>
        <Pill color={C.protein}>{target} g de protéines / repas</Pill>
        <Pill color={C.kcal}>≈ {kcalTarget(profile)} kcal / repas</Pill>
        <Pill color={C.money}>≤ {eur(profile.budget)}</Pill>
        <Pill color={C.text}>🛒 {store ? `Prix ${store.chainLabel || store.name}` : "Prix moyens"}</Pill>
      </div>

      {!onboarded && (
        <button className="press" onClick={onSetup} style={{ ...card, width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "center", marginBottom: 14, cursor: "pointer", border: `1.5px solid ${C.tomato}55`, background: `linear-gradient(135deg, ${C.tomato}12, #fff 70%)` }}>
          <span style={{ fontSize: 28 }}>🍳</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontWeight: 800, fontSize: 15 }}>Configure ton profil</span>
            <span style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 2 }}>Objectif, budget, appareils et allergies pour des recettes adaptées.</span>
          </span>
          <ChevronLeft size={18} style={{ transform: "rotate(180deg)" }} color={C.mutedDim} />
        </button>
      )}

      <div style={{ position: "relative", marginBottom: 10 }}>
        <Search size={16} color={C.mutedDim} style={{ position: "absolute", left: 12, top: 12 }} />
        <input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher une recette" style={{ ...inputStyle, paddingLeft: 36 }} />
      </div>
      <div className="hscroll" style={{ display: "flex", gap: 7, overflowX: "auto", margin: "0 -16px 16px", padding: "0 16px" }}>
        {TIME_FILTERS.map((m) => (
          <button key={m.id} className="press" onClick={() => setTimeFilter(m.id)} style={{ flexShrink: 0, cursor: "pointer", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, border: timeFilter === m.id ? "none" : `1px solid ${C.line}`, background: timeFilter === m.id ? C.text : C.surface, color: timeFilter === m.id ? "#fff" : C.text }}>{m.label}</button>
        ))}
      </div>

      {ok.length === 0 && <div style={{ ...card, color: C.muted, fontSize: 14, lineHeight: 1.5 }}>Aucune recette ne correspond à ton profil ici. Essaie d'augmenter un peu le budget ou d'ajouter un appareil dans ton profil.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ok.map((a) => <RecipeCard key={a.recipe.id} a={a} fav={isFav(a.recipe.id)} onOpen={onOpen} />)}
      </div>

      {hiddenCount > 0 && (
        <div style={{ marginTop: 18 }}>
          <button onClick={() => setShowHidden(!showHidden)} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>
            {hiddenCount} recette{hiddenCount > 1 ? "s" : ""} masquée{hiddenCount > 1 ? "s" : ""} · {showHidden ? "cacher" : "voir pourquoi"}
          </button>
          {showHidden && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {inMeal.filter((a) => a.reasons.length).map((a) => (
                <button key={a.recipe.id} className="press" onClick={() => onOpen(a.recipe.id)} style={{ ...card, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left", opacity: 0.75 }}>
                  <span style={{ fontSize: 20 }}>{a.recipe.emoji}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{a.recipe.name}</span>
                  <span style={{ fontSize: 11.5, color: C.danger, fontWeight: 700, textAlign: "right" }}>{a.reasons.map((r) => REASON_LABEL[r]).join(", ")}</span>
                </button>
              ))}
            </div>
          )}
          {!showHidden && overBudget.length > 0 && <div style={{ fontSize: 12, color: C.mutedDim, marginTop: 4 }}>dont {overBudget.length} juste au-dessus du budget</div>}
        </div>
      )}
    </div>
  );
}

function RecipeCard({ a, fav, onOpen }) {
  const r = a.recipe;
  return (
    <button className="press" onClick={() => onOpen(r.id)} style={{ ...card, display: "flex", gap: 13, alignItems: "center", textAlign: "left", cursor: "pointer", color: C.text, width: "100%" }}>
      <div style={{ width: 54, height: 54, borderRadius: 15, background: C.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{r.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>{r.name}</div>
          {fav && <Heart size={13} fill={C.tomato} color={C.tomato} style={{ flexShrink: 0 }} />}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6, fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ color: C.protein }}>{Math.round(a.stats.p)} g prot.</span>
          <span style={{ color: C.kcal }}>{Math.round(a.stats.kcal)} kcal</span>
          <span style={{ color: C.money }}>{eur(a.stats.cost)}</span>
          <span style={{ color: C.muted, display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={11} />{r.time} min</span>
        </div>
      </div>
    </button>
  );
}

/* ================= Détail ================= */
function qtyLabel(id, g) {
  const ing = INGREDIENTS[id];
  if (ing.unit) {
    const n = Math.max(0.5, Math.round((g / ing.unit.g) * 2) / 2);
    const n2 = String(n).replace(".", ",");
    return `${n2} ${n > 1 ? ing.unit.many : ing.unit.one}`;
  }
  return g < 20 ? `${Math.max(1, Math.round(g))} g` : `${r5(g)} g`;
}

function RecipeDetail({ a, target, fav, onFav, onShop, onBack }) {
  const [servings, setServings] = useState(1);
  const r = a.recipe;
  const s = a.stats;
  const kcalTotal = s.p * 4 + s.c * 4 + s.f * 9 || 1;
  const goalP = target;
  const appliancesUsed = r.needs.map((group) => group.map((id) => APPLIANCES.find((x) => x.id === id).label).join(" ou "));

  return (
    <div style={{ animation: "pop .2s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <IconBtn onClick={onBack} label="Retour"><ChevronLeft size={19} /></IconBtn>
        <IconBtn onClick={onFav} label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}><Heart size={18} fill={fav ? C.tomato : "none"} color={fav ? C.tomato : C.text} /></IconBtn>
      </div>

      <div style={{ fontSize: 46, lineHeight: 1 }}>{r.emoji}</div>
      <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0 6px", textWrap: "balance" }}>{r.name}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12.5, color: C.muted, fontWeight: 600 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock size={13} />{r.time} min</span>
        <span>{appliancesUsed.length ? appliancesUsed.join(" + ") : "Sans cuisson"}</span>
      </div>

      {a.reasons.length > 0 && (
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 12, background: `${C.danger}12`, color: C.danger, fontSize: 12.5, fontWeight: 700 }}>
          Ne correspond pas à ton profil : {a.reasons.map((x) => REASON_LABEL[x]).join(", ")}
          {a.badAllergens.length > 0 && ` (${a.badAllergens.map((id) => ALLERGENS.find((x) => x.id === id).label).join(", ")})`}.
        </div>
      )}

      <div style={{ ...card, marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 6, textAlign: "center" }}>
          <Macro v={`${Math.round(s.p)} g`} l="Protéines" color={C.protein} />
          <Macro v={Math.round(s.kcal)} l="kcal" color={C.kcal} />
          <Macro v={`${Math.round(s.c)} g`} l="Glucides" color={C.text} />
          <Macro v={`${Math.round(s.f)} g`} l="Lipides" color={C.text} />
        </div>
        <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", marginTop: 12 }}>
          <span style={{ width: `${(s.p * 4 / kcalTotal) * 100}%`, background: C.protein }} />
          <span style={{ width: `${(s.c * 4 / kcalTotal) * 100}%`, background: C.money }} />
          <span style={{ width: `${(s.f * 9 / kcalTotal) * 100}%`, background: C.kcal }} />
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.45 }}>
          Par portion · {eur(s.cost)}. {a.k !== 1 ? <>Portion ajustée <b style={{ color: C.text }}>×{String(a.k).replace(".", ",")}</b> pour viser {goalP} g de protéines.</> : <>Portion de base, déjà proche de {goalP} g de protéines.</>}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
        <div style={label}>INGRÉDIENTS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconBtn small onClick={() => setServings(Math.max(1, servings - 1))} label="Moins de portions"><Minus size={14} /></IconBtn>
          <span style={{ fontSize: 13, fontWeight: 800, minWidth: 74, textAlign: "center" }}>{servings} portion{servings > 1 ? "s" : ""}</span>
          <IconBtn small onClick={() => setServings(Math.min(8, servings + 1))} label="Plus de portions"><Plus size={14} /></IconBtn>
        </div>
      </div>
      <div style={{ ...card, padding: "4px 14px" }}>
        {r.items.map(([id, g], i) => {
          const ing = INGREDIENTS[id];
          const grams = g * a.k * servings;
          return (
            <div key={id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: i < r.items.length - 1 ? `1px solid ${C.line}` : "none", fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>{ing.name}{(ing.allergens || []).length > 0 && <span style={{ color: C.mutedDim, fontSize: 11.5 }}> · {ing.allergens.map((x) => ALLERGENS.find((y) => y.id === x).label).join(", ")}</span>}</span>
              <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{qtyLabel(id, grams)}{ing.unit && <span style={{ color: C.mutedDim, fontWeight: 600 }}> ({r5(grams)} g)</span>}</span>
            </div>
          );
        })}
      </div>
      {servings > 1 && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Total pour {servings} portions : {eur(s.cost * servings)}</div>}

      <div style={{ ...label, margin: "22px 0 10px" }}>PRÉPARATION</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {r.steps.map((st, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <span style={{ width: 26, height: 26, borderRadius: 9, background: C.text, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.5, paddingTop: 2 }}>{st}</span>
          </div>
        ))}
      </div>

      <button className="press" onClick={() => onShop(servings)} style={{ ...primaryBtn, width: "100%", marginTop: 22 }}>
        <ShoppingCart size={17} /> Ajouter à la liste de courses
      </button>
      <div style={{ fontSize: 11.5, color: C.mutedDim, marginTop: 12, lineHeight: 1.45 }}>
        Valeurs nutritionnelles et prix estimés à partir de moyennes. En cas d'allergie, vérifie toujours les étiquettes des produits.
      </div>
    </div>
  );
}

function Macro({ v, l, color }) {
  return (
    <div>
      <div style={{ fontSize: 19, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>{v}</div>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{l}</div>
    </div>
  );
}

/* ================= Favoris ================= */
function Favorites({ analysed, onOpen }) {
  return (
    <div style={{ animation: "pop .25s ease" }}>
      <div style={eyebrow}>TES RECETTES</div>
      <div style={{ ...h1, marginBottom: 16 }}>Favoris</div>
      {analysed.length === 0 ? (
        <div style={{ ...card, color: C.muted, fontSize: 14, lineHeight: 1.5 }}>Touche le cœur sur une recette pour la retrouver ici.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{analysed.map((a) => <RecipeCard key={a.recipe.id} a={a} fav onOpen={onOpen} />)}</div>
      )}
    </div>
  );
}

/* ================= Courses ================= */
function Shopping({ list, stores, activeStore, onChange }) {
  const todo = list.filter((x) => !x.checked);
  const done = list.filter((x) => x.checked);
  const baseTotal = todo.reduce((n, x) => n + (INGREDIENTS[x.id].eur * x.g) / 1000, 0);
  const total = baseTotal * (activeStore ? activeStore.index : 1);
  const compare = stores.map((st) => ({ st, t: baseTotal * st.index })).sort((a, b) => a.t - b.t);
  const toggle = (item) => onChange(list.map((x) => (x === item ? { ...x, checked: !x.checked } : x)));
  const row = (x, i, arr) => (
    <button key={x.id + i} onClick={() => toggle(x)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "none", border: "none", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none", cursor: "pointer", color: C.text, textAlign: "left" }}>
      <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: x.checked ? "none" : `1.6px solid ${C.mutedDim}`, background: x.checked ? C.protein : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{x.checked && <Check size={14} color="#fff" strokeWidth={3.2} />}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, textDecoration: x.checked ? "line-through" : "none", color: x.checked ? C.mutedDim : C.text }}>{INGREDIENTS[x.id].name}</span>
        <span style={{ display: "block", fontSize: 11.5, color: C.mutedDim, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.from.join(", ")}</span>
      </span>
      <span style={{ fontSize: 13.5, fontWeight: 800, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: x.checked ? C.mutedDim : C.text }}>{qtyLabel(x.id, x.g)}</span>
    </button>
  );
  return (
    <div style={{ animation: "pop .25s ease" }}>
      <div style={eyebrow}>À ACHETER</div>
      <div style={h1}>Courses</div>
      {list.length === 0 ? (
        <div style={{ ...card, color: C.muted, fontSize: 14, lineHeight: 1.5, marginTop: 16 }}>Ta liste est vide. Ouvre une recette et touche « Ajouter à la liste de courses ».</div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: C.muted, margin: "6px 0 16px" }}>{todo.length} article{todo.length > 1 ? "s" : ""} · environ <b style={{ color: C.money }}>{eur(total)}</b>{activeStore ? ` chez ${activeStore.name}` : " (prix moyens)"}</div>
          {compare.length > 1 && todo.length > 0 && (
            <div style={{ ...card, marginBottom: 16, padding: "12px 14px" }}>
              <div style={{ ...label, marginBottom: 8 }}>ESTIMATION PAR MAGASIN</div>
              {compare.map(({ st, t }, i) => (
                <div key={st.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 13.5 }}>
                  <span style={{ fontWeight: st.id === (activeStore && activeStore.id) ? 800 : 600 }}>{st.name}{i === 0 && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: C.protein, background: `${C.protein}14`, borderRadius: 999, padding: "2px 7px" }}>le moins cher</span>}</span>
                  <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", color: i === 0 ? C.protein : C.text }}>{eur(t)}</span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.mutedDim, marginTop: 4 }}>Estimation à partir d'un indice de prix approximatif par enseigne.</div>
            </div>
          )}
          {todo.length > 0 && <div style={{ ...card, padding: 0, overflow: "hidden" }}>{todo.map(row)}</div>}
          {done.length > 0 && (
            <>
              <div style={{ ...label, margin: "20px 0 10px" }}>DANS LE PANIER</div>
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>{done.map(row)}</div>
            </>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {done.length > 0 && <button className="press" onClick={() => onChange(todo)} style={ghostBtn}><Check size={14} /> Retirer les cochés</button>}
            <button className="press" onClick={() => onChange([])} style={{ ...ghostBtn, color: C.danger }}><Trash2 size={14} /> Vider la liste</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= Profil ================= */
function Profile({ profile, setProfile, stores, activeStore, onStores }) {
  const target = proteinTarget(profile);
  const toggleIn = (key, id) => setProfile({ [key]: profile[key].includes(id) ? profile[key].filter((x) => x !== id) : [...profile[key], id] });
  return (
    <div style={{ animation: "pop .25s ease" }}>
      <div style={eyebrow}>RÉGLAGES</div>
      <div style={h1}>Profil</div>

      <div style={{ ...label, margin: "20px 0 10px" }}>OBJECTIF</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {GOALS.map((g) => {
          const on = profile.goal === g.id;
          return (
            <button key={g.id} className="press" onClick={() => setProfile({ goal: g.id })} style={{ ...card, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", color: C.text, padding: "12px 14px", border: on ? `1.8px solid ${C.tomato}` : `1px solid ${C.line}` }}>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 800, fontSize: 15 }}>{g.label}</span>
                <span style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 1 }}>{g.desc}</span>
              </span>
              {on && <Check size={17} color={C.tomato} strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      <div style={{ ...label, margin: "22px 0 10px" }}>PROTÉINES PAR REPAS</div>
      <div style={card}>
        <div style={{ display: "flex", gap: 10 }}>
          <Field id="weight" label="Poids (kg)" value={profile.weight} min={35} max={200} onChange={(v) => setProfile({ weight: v })} />
          <Field id="meals" label="Repas par jour (tous)" value={profile.mealsPerDay} min={2} max={7} onChange={(v) => setProfile({ mealsPerDay: v })} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 14 }}>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{profile.proteinOverride ? "Cible choisie à la main" : "Cible calculée"}</span>
          <span style={{ fontSize: 26, fontWeight: 800, color: C.protein, fontVariantNumeric: "tabular-nums" }}>{target} g</span>
        </div>
        <input type="range" id="protein" min={15} max={80} step={1} value={target} onChange={(e) => setProfile({ proteinOverride: Number(e.target.value) })} style={{ width: "100%", marginTop: 6 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontSize: 11.5, color: C.mutedDim }}>{GOALS.find((g) => g.id === profile.goal).factor.toString().replace(".", ",")} g par kg de poids corporel et par jour, réparti sur tes repas. Repère calories : environ {kcalTarget(profile)} kcal par repas.</span>
          {profile.proteinOverride && <button onClick={() => setProfile({ proteinOverride: null })} style={{ background: "none", border: "none", color: C.tomato, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Recalculer</button>}
        </div>
      </div>

      <div style={{ ...label, margin: "22px 0 10px" }}>BUDGET PAR REPAS</div>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Maximum par portion</span>
          <span style={{ fontSize: 26, fontWeight: 800, color: C.money, fontVariantNumeric: "tabular-nums" }}>{eur(profile.budget)}</span>
        </div>
        <input type="range" id="budget" min={1} max={12} step={0.5} value={profile.budget} onChange={(e) => setProfile({ budget: Number(e.target.value) })} style={{ width: "100%", marginTop: 6 }} />
      </div>

      <StoresSection stores={stores} activeStore={activeStore} onStores={onStores} />

      <div style={{ ...label, margin: "22px 0 10px" }}>MES APPAREILS</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {APPLIANCES.map((a) => <Chip key={a.id} on={profile.appliances.includes(a.id)} onClick={() => toggleIn("appliances", a.id)} color={C.tomato}>{a.emoji} {a.label}</Chip>)}
      </div>
      <div style={{ fontSize: 11.5, color: C.mutedDim, marginTop: 8 }}>Les recettes sans cuisson sont toujours proposées.</div>

      <div style={{ ...label, margin: "22px 0 10px" }}>ALLERGIES ET INTOLÉRANCES</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {ALLERGENS.map((a) => <Chip key={a.id} on={profile.allergies.includes(a.id)} onClick={() => toggleIn("allergies", a.id)} color={C.danger}>{profile.allergies.includes(a.id) ? "Sans " + a.label.toLowerCase() : a.label}</Chip>)}
      </div>

      <div style={{ ...label, margin: "22px 0 10px" }}>RÉGIME</div>
      <button className="press" onClick={() => setProfile({ veg: !profile.veg })} style={{ ...card, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: C.text }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>🥦 Végétarien</span>
        <span style={{ width: 46, height: 28, borderRadius: 999, background: profile.veg ? C.protein : C.surfaceRaised, position: "relative", transition: "background .2s", border: `1px solid ${C.line}` }}>
          <span style={{ position: "absolute", top: 2, left: profile.veg ? 20 : 2, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)", transition: "left .2s" }} />
        </span>
      </button>
      <div style={{ fontSize: 11.5, color: C.mutedDim, marginTop: 14, lineHeight: 1.45 }}>Tout est enregistré sur ton téléphone uniquement. La recherche de supermarchés envoie seulement la position (ou la ville) au service de cartes OpenStreetMap.</div>
    </div>
  );
}

/* ================= Supermarchés ================= */
function StoresSection({ stores, activeStore, onStores }) {
  const [results, setResults] = useState(null);
  const [place, setPlace] = useState("");
  const [where, setWhere] = useState("");
  const [radius, setRadius] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const saved = new Set(stores.map((s) => s.id));

  async function search(getPos) {
    setBusy(true); setError(""); setResults(null);
    try {
      const pos = await getPos();
      setWhere(pos.label || "autour de toi");
      setResults(await nearbySupermarkets(pos, radius));
    } catch (e) { setError(e.message || "Recherche impossible."); }
    finally { setBusy(false); }
  }
  const toggle = (st) => {
    if (saved.has(st.id)) {
      const next = stores.filter((x) => x.id !== st.id);
      onStores(next, activeStore === st.id ? (next[0] ? next[0].id : null) : activeStore);
    } else {
      const { dist, ...keep } = st;
      onStores([...stores, keep], activeStore || st.id);
    }
  };
  const km = (d) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1).replace(".", ",")} km`);
  const idx = (i) => (i === 1 ? "prix moyens" : i < 1 ? `≈ ${Math.round((1 - i) * 100)} % moins cher` : `≈ ${Math.round((i - 1) * 100)} % plus cher`);

  return (
    <>
      <div style={{ ...label, margin: "22px 0 10px" }}>MES SUPERMARCHÉS</div>
      {stores.length > 0 && (
        <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 10 }}>
          {stores.map((st, i) => {
            const on = st.id === activeStore;
            return (
              <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: i < stores.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <button onClick={() => onStores(stores, st.id)} aria-label={`Faire mes courses chez ${st.name}`} style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer", border: on ? `7px solid ${C.tomato}` : `1.6px solid ${C.mutedDim}`, background: "#fff" }} />
                <span style={{ flex: 1, minWidth: 0 }} onClick={() => onStores(stores, st.id)}>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 800 }}>{st.name}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: C.muted, marginTop: 1 }}>{st.chainLabel ? idx(st.index) : "enseigne inconnue, prix moyens"}{st.address ? ` · ${st.address}` : ""}</span>
                </span>
                <a href={mapsLink(st)} target="_blank" rel="noreferrer" aria-label="Itinéraire" style={{ color: C.text, padding: 4, display: "flex" }}><Navigation size={16} /></a>
                <button onClick={() => toggle(st)} aria-label="Retirer" style={{ background: "none", border: "none", color: C.mutedDim, cursor: "pointer", padding: 4, display: "flex" }}><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ fontSize: 11.5, color: C.mutedDim, marginBottom: 10 }}>{stores.length ? "Le magasin coché sert au calcul des prix." : "Ajoute les supermarchés où tu fais tes courses pour adapter les prix."}</div>

      <div style={{ ...card }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="press" disabled={busy} onClick={() => search(currentPosition)} style={{ ...primaryBtn, padding: "11px 14px", fontSize: 14, flex: "1 1 160px", boxShadow: "none", opacity: busy ? 0.6 : 1 }}>
            <MapPin size={16} /> Autour de moi
          </button>
          <div style={{ display: "flex", gap: 6, flex: "1 1 200px" }}>
            <input id="store-place" value={place} onChange={(e) => setPlace(e.target.value)} onKeyDown={(e) => e.key === "Enter" && place.trim() && search(() => geocode(place))} placeholder="Ville ou code postal" style={{ ...inputStyle, flex: 1, minWidth: 0 }} />
            <button className="press" disabled={busy || !place.trim()} onClick={() => search(() => geocode(place))} aria-label="Chercher" style={{ background: C.text, border: "none", borderRadius: 12, width: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: busy || !place.trim() ? 0.5 : 1 }}><Search size={16} color="#fff" /></button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12.5, color: C.muted, fontWeight: 600 }}>
          Rayon
          {[1, 2, 5].map((r) => (
            <button key={r} onClick={() => setRadius(r)} style={{ borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", border: radius === r ? "none" : `1px solid ${C.line}`, background: radius === r ? C.text : C.surface, color: radius === r ? "#fff" : C.text }}>{r} km</button>
          ))}
        </div>
        {busy && <div style={{ fontSize: 13, color: C.muted, marginTop: 12 }}>Recherche des supermarchés…</div>}
        {error && <div style={{ fontSize: 13, color: C.danger, marginTop: 12, fontWeight: 600 }}>{error}</div>}
        {results && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 6 }}>{results.length} supermarché{results.length > 1 ? "s" : ""} {where ? `· ${where}` : ""}</div>
            {results.length === 0 && <div style={{ fontSize: 13, color: C.muted }}>Aucun supermarché trouvé dans ce rayon. Essaie un rayon plus grand.</div>}
            {results.slice(0, 30).map((st) => {
              const on = saved.has(st.id);
              return (
                <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: `1px solid ${C.line}` }}>
                  <Store size={16} color={C.muted} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{st.name}</span>
                    <span style={{ display: "block", fontSize: 11.5, color: C.muted }}>{km(st.dist)}{st.address ? ` · ${st.address}` : ""}</span>
                  </span>
                  <button className="press" onClick={() => toggle(st)} style={{ flexShrink: 0, cursor: "pointer", borderRadius: 10, padding: "6px 10px", fontSize: 12, fontWeight: 700, border: on ? `1.4px solid ${C.protein}` : `1px solid ${C.line}`, background: on ? `${C.protein}14` : "transparent", color: on ? C.protein : C.text, display: "flex", alignItems: "center", gap: 4 }}>
                    {on ? <><Check size={13} strokeWidth={3} /> Ajouté</> : <><Plus size={13} strokeWidth={3} /> Ajouter</>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ fontSize: 10.5, color: C.mutedDim, marginTop: 10 }}>Magasins : © contributeurs OpenStreetMap.</div>
      </div>
    </>
  );
}

function Field({ id, label: l, value, min, max, onChange }) {
  return (
    <label htmlFor={id} style={{ flex: 1, minWidth: 0 }}>
      <span style={{ display: "block", fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 5 }}>{l}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <IconBtn small onClick={(e) => { e.preventDefault(); onChange(Math.max(min, value - 1)); }} label="Moins"><Minus size={14} /></IconBtn>
        <input id={id} type="number" inputMode="numeric" value={value} min={min} max={max}
          onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v) && v > 0) onChange(Math.min(max, v)); }}
          onBlur={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
          style={{ ...inputStyle, textAlign: "center", padding: "8px 4px", fontSize: 16, fontWeight: 800 }} />
        <IconBtn small onClick={(e) => { e.preventDefault(); onChange(Math.min(max, value + 1)); }} label="Plus"><Plus size={14} /></IconBtn>
      </div>
    </label>
  );
}

/* ================= éléments communs ================= */
function Pill({ color, children }) {
  return <span style={{ fontSize: 12, fontWeight: 700, color, background: `${color}14`, borderRadius: 999, padding: "5px 10px" }}>{children}</span>;
}
function Chip({ on, onClick, color, children }) {
  return (
    <button className="press" onClick={onClick} aria-pressed={on} style={{ cursor: "pointer", borderRadius: 999, padding: "9px 13px", fontSize: 13.5, fontWeight: 700, border: on ? `1.6px solid ${color}` : `1px solid ${C.line}`, background: on ? `${color}14` : C.surface, color: on ? color : C.text }}>
      {children}
    </button>
  );
}
function IconBtn({ onClick, label: l, small, children }) {
  const s = small ? 30 : 38;
  return (
    <button className="press" onClick={onClick} aria-label={l} style={{ width: s, height: s, borderRadius: small ? 9 : 12, background: C.surface, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.text, flexShrink: 0, boxShadow: "0 2px 6px -3px rgba(24,22,18,0.15)" }}>
      {children}
    </button>
  );
}

function TabBar({ tab, onTab, cartCount, favCount }) {
  const items = [
    { id: "recipes", label: "Recettes", Icon: ChefHat },
    { id: "favorites", label: "Favoris", Icon: Heart, badge: favCount },
    { id: "shopping", label: "Courses", Icon: ShoppingCart, badge: cartCount },
    { id: "profile", label: "Profil", Icon: User },
  ];
  return (
    <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 20, background: "rgba(247,245,239,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: `1px solid ${C.line}`, padding: "9px 10px calc(9px + env(safe-area-inset-bottom))" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", justifyContent: "space-around" }}>
        {items.map(({ id, label: l, Icon, badge }) => {
          const on = tab === id;
          return (
            <button key={id} onClick={() => onTab(id)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 10px", color: on ? C.text : C.mutedDim }}>
              <Icon size={22} strokeWidth={on ? 2.5 : 2} />
              <span style={{ fontSize: 10.5, fontWeight: on ? 800 : 600 }}>{l}</span>
              {badge > 0 && <span style={{ position: "absolute", top: 0, right: 4, minWidth: 17, height: 17, borderRadius: 999, background: C.tomato, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* styles */
const card = { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 16px", boxShadow: "0 4px 14px -8px rgba(24,22,18,0.12)", boxSizing: "border-box" };
const eyebrow = { fontSize: 11, letterSpacing: ".16em", color: C.muted, fontWeight: 700 };
const h1 = { fontSize: 29, fontWeight: 800, letterSpacing: "-.02em" };
const label = { fontSize: 11, letterSpacing: ".12em", color: C.muted, fontWeight: 700 };
const inputStyle = { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, color: C.text, padding: "10px 12px", fontSize: 14, fontWeight: 600, outline: "none", width: "100%", boxSizing: "border-box" };
const primaryBtn = { background: C.tomato, border: "none", borderRadius: 14, color: "#fff", padding: "14px 18px", fontSize: 15, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", boxShadow: `0 10px 22px -10px ${C.tomato}` };
const ghostBtn = { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 999, color: C.text, padding: "8px 13px", fontSize: 12.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" };
