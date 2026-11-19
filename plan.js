/*
 * Planification de la semaine : choisit un plat pour chaque déjeuner et dîner
 * parmi les recettes compatibles avec le profil, en variant les plats et la
 * source de protéines d'un repas à l'autre.
 */
import { INGREDIENTS } from "./data.js";

export const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const MEAL_SLOTS = [
  { id: "lunch", label: "Déjeuner" },
  { id: "dinner", label: "Dîner" },
];
export const DEFAULT_PLAN_SETTINGS = { days: [0, 1, 2, 3, 4, 5, 6], meals: ["lunch", "dinner"], quickLunch: false };
export const QUICK_LUNCH_MAX = 20;

const pad = (n) => String(n).padStart(2, "0");
const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Lundi de la semaine en cours, au format AAAA-MM-JJ. */
export function weekStart(d = new Date()) {
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return toStr(m);
}

export function dayDate(week, i) {
  const [y, mo, d] = week.split("-").map(Number);
  return new Date(y, mo - 1, d + i);
}

/** Ingrédient qui apporte le plus de protéines : sert à varier les plats. */
export function mainProtein(recipe) {
  let best = null, bestP = -1;
  recipe.items.forEach(([id, g]) => {
    const p = (INGREDIENTS[id].p * g) / 100;
    if (p > bestP) { bestP = p; best = id; }
  });
  return best;
}

export function slotKeys(settings) {
  const keys = [];
  for (let d = 0; d < 7; d++) {
    if (!settings.days.includes(d)) continue;
    MEAL_SLOTS.forEach((m) => { if (settings.meals.includes(m.id)) keys.push(`${d}-${m.id}`); });
  }
  return keys;
}

/**
 * Choisit un plat pour un créneau.
 * candidates : recettes compatibles déjà triées (les mieux adaptées d'abord).
 */
function pickFor(key, candidates, used, prevMain, settings) {
  const isLunch = key.endsWith("lunch");
  let pool = candidates;
  if (isLunch && settings.quickLunch) {
    const quick = pool.filter((a) => a.recipe.time <= QUICK_LUNCH_MAX);
    if (quick.length) pool = quick;
  }
  const fresh = pool.filter((a) => !used.has(a.recipe.id));
  if (fresh.length) pool = fresh;
  const varied = pool.filter((a) => mainProtein(a.recipe) !== prevMain);
  if (varied.length) pool = varied;
  // Tirage au hasard parmi la meilleure moitié, pour garder des plats adaptés
  const top = pool.slice(0, Math.max(3, Math.ceil(pool.length * 0.6)));
  return top[Math.floor(Math.random() * top.length)] || null;
}

/** Génère (ou complète) le planning. Les plats validés sont gardés. */
export function generatePlan(candidates, settings, previous) {
  const week = weekStart();
  const keep = previous && previous.week === week ? previous.slots : {};
  const slots = {};
  const used = new Set();
  Object.entries(keep).forEach(([k, v]) => { if (v && v.ok) used.add(v.id); });
  let prevMain = null;
  slotKeys(settings).forEach((key) => {
    const kept = keep[key];
    if (kept && kept.ok) {
      slots[key] = kept;
    } else {
      const a = pickFor(key, candidates, used, prevMain, settings);
      slots[key] = a ? { id: a.recipe.id, ok: false } : null;
    }
    if (slots[key]) {
      used.add(slots[key].id);
      const a = candidates.find((x) => x.recipe.id === slots[key].id);
      prevMain = a ? mainProtein(a.recipe) : null;
    }
  });
  return { week, slots };
}

/** Remplace le plat d'un créneau par un autre, différent du reste de la semaine. */
export function swapSlot(plan, key, candidates, settings) {
  const used = new Set(Object.values(plan.slots).filter(Boolean).map((s) => s.id));
  const current = plan.slots[key] && plan.slots[key].id;
  const others = candidates.filter((a) => a.recipe.id !== current);
  const keys = Object.keys(plan.slots);
  const prevKey = keys[keys.indexOf(key) - 1];
  const prev = prevKey && plan.slots[prevKey] ? candidates.find((x) => x.recipe.id === plan.slots[prevKey].id) : null;
  const a = pickFor(key, others, used, prev ? mainProtein(prev.recipe) : null, settings);
  if (!a) return plan;
  return { ...plan, slots: { ...plan.slots, [key]: { id: a.recipe.id, ok: false } } };
}
