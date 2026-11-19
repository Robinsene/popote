import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Check, Plus, X, Play } from "lucide-react";

/* Couleurs de Popote (mêmes valeurs que App.jsx) */
const K = {
  bg: "linear-gradient(180deg, #F7F5EF 0%, #F0EEE7 55%, #EBE9E1 100%)",
  surface: "#FFFFFF",
  line: "rgba(24,22,18,0.08)",
  text: "#1C1A16",
  muted: "#6E6B63",
  mutedDim: "#A8A49B",
  tomato: "#D15B3E",
  green: "#2E8E66",
  blue: "#3C6FA5",
  amber: "#C58A3A",
  plum: "#7A5AA6",
};

/* ---------------- animations ---------------- */
export const ANIMATIONS = [
  { id: "pan", label: "Dans la poêle", desc: "Les ingrédients tombent dans la poêle", color: K.tomato },
  { id: "type", label: "Machine à écrire", desc: "La phrase s'écrit lettre par lettre", color: K.blue },
  { id: "zoom", label: "Zoom + fondu", desc: "Ton prénom arrive en gros", color: K.green },
  { id: "count", label: "Compteur", desc: "Défile jusqu'à ta cible de protéines", color: K.text },
  { id: "countdown", label: "Compte à rebours", desc: "3, 2, 1, à table !", color: K.amber },
  { id: "drop", label: "Lettres qui tombent", desc: "Chaque lettre tombe et rebondit", color: K.plum },
  { id: "steam", label: "Plat fumant", desc: "La vapeur monte d'un bol chaud", color: K.tomato },
  { id: "wipe", label: "Balayage couleurs", desc: "Trois bandes dévoilent le texte", color: K.blue },
];

/* ---------------- phrases ---------------- */
// {name} = prénom, {people} = nombre de personnes, {greeting} = Bonjour / Bonsoir
export const BUILTIN_PHRASES = [
  { id: "whatcook", text: "Salut {name}, on cuisine quoi ?", group: "Accueil" },
  { id: "back", text: "Bon retour, {name} !", group: "Accueil" },
  { id: "greeting", text: "{greeting} {name}, à table ?", group: "Accueil" },
  { id: "chefhere", text: "Bienvenue {name}, le chef est là.", group: "Accueil" },
  { id: "eatwell", text: "{name}, aujourd'hui on mange bien.", group: "Motivation" },
  { id: "protein", text: "Des protéines et du goût, {name}.", group: "Motivation" },
  { id: "budget", text: "Petit budget, grands plats, {name}.", group: "Motivation" },
  { id: "homemade", text: "Le meilleur repas, c'est celui qu'on fait soi-même.", group: "Motivation" },
  { id: "chef", text: "Bonjour chef !", group: "Surnoms" },
  { id: "stove", text: "À tes fourneaux, chef.", group: "Surnoms" },
  { id: "cordonbleu", text: "Le cordon-bleu est de retour.", group: "Surnoms" },
  { id: "lunch", text: "C'est l'heure du déjeuner, {name}.", group: "Selon le moment", when: "lunch" },
  { id: "dinner", text: "On prépare le dîner, {name} ?", group: "Selon le moment", when: "dinner" },
  { id: "group", text: "Aujourd'hui on cuisine pour {people}, {name}.", group: "Selon le moment", when: "group" },
];

export const DEFAULT_SPLASH = {
  name: "",
  anim: "pan",
  phrases: ["whatcook", "greeting", "eatwell", "budget", "chef", "lunch", "dinner", "group"],
  custom: [],
};

export function allPhrases(settings) {
  return [...BUILTIN_PHRASES, ...(settings.custom || []).map((c) => ({ ...c, group: "Mes phrases" }))];
}

function moment() {
  const h = new Date().getHours();
  return h >= 11 && h < 15 ? "lunch" : h >= 17 && h < 23 ? "dinner" : null;
}

export function fillPhrase(text, { name, people }) {
  const h = new Date().getHours();
  return text
    .replace(/\{greeting\}/g, h >= 5 && h < 18 ? "Bonjour" : "Bonsoir")
    .replace(/\{people\}/g, people > 1 ? `${people} personnes` : "toi")
    .replace(/\{name\}/g, name || "toi");
}

/** Tire une phrase au hasard parmi celles cochées et valables maintenant. */
export function pickPhrase(settings, people) {
  const selected = new Set(settings.phrases || []);
  const now = moment();
  const pool = allPhrases(settings).filter((p) => {
    if (!selected.has(p.id)) return false;
    if (p.when === "lunch" || p.when === "dinner") return p.when === now;
    if (p.when === "group") return people > 1;
    return true;
  });
  const p = pool.length ? pool[Math.floor(Math.random() * pool.length)] : { text: "Salut {name} !" };
  return p.text;
}

/* Découpe une phrase en morceaux, en marquant le prénom pour le colorer. */
function segments(template, vars) {
  const filled = fillPhrase(template.replace(/\{name\}/g, "\u0000"), vars);
  const parts = filled.split("\u0000");
  const out = [];
  parts.forEach((t, i) => {
    if (t) out.push({ t, hl: false });
    if (i < parts.length - 1) out.push({ t: vars.name || "toi", hl: true });
  });
  return out;
}

function Phrase({ template, vars, color, style }) {
  return (
    <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-.01em", textAlign: "center", ...style }}>
      {segments(template, vars).map((s, i) => (s.hl ? <span key={i} style={{ color }}>{s.t}</span> : <span key={i}>{s.t}</span>))}
    </div>
  );
}

const fade = (delay) => ({ opacity: 0, animation: `spFadeUp .45s ease ${delay}s forwards` });

/* ---------------- les 8 animations ---------------- */
function APan({ template, vars }) {
  const items = ["🥩", "🥚", "🍅", "🥦", "🧄"];
  return (
    <>
      <div style={{ position: "relative", width: 200, height: 150 }}>
        {items.map((e, i) => (
          <span key={i} style={{ position: "absolute", left: 38 + i * 26, top: 42, fontSize: 26, opacity: 0, animation: `spFall .55s cubic-bezier(.5,0,.75,0) ${0.1 + i * 0.12}s forwards` }}>{e}</span>
        ))}
        <span style={{ position: "absolute", left: 30, bottom: 0, fontSize: 100, lineHeight: 1, animation: "spShake .25s ease-in-out .8s 3" }}>🍳</span>
      </div>
      <div style={fade(1.05)}><Phrase template={template} vars={vars} color={K.tomato} /></div>
    </>
  );
}

function AType({ template, vars }) {
  const chars = segments(template, vars).flatMap((s) => [...s.t].map((c) => ({ c, hl: s.hl })));
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0, t;
    const start = setTimeout(() => {
      t = setInterval(() => { i += 1; setN(i); if (i >= chars.length) clearInterval(t); }, 42);
    }, 250);
    return () => { clearTimeout(start); clearInterval(t); };
  }, []);
  return (
    <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25, textAlign: "center", minHeight: "2.5em" }}>
      {chars.slice(0, n).map((ch, i) => <span key={i} style={ch.hl ? { color: K.blue } : null}>{ch.c}</span>)}
      <span style={{ display: "inline-block", width: 2, height: "1em", background: K.text, verticalAlign: "-0.12em", marginLeft: 2, animation: "spBlink .8s steps(1) infinite" }} />
    </div>
  );
}

function AZoom({ template, vars }) {
  return (
    <>
      <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-.03em", color: K.green, opacity: 0, animation: "spPop 1s cubic-bezier(.2,1.6,.4,1) .15s forwards" }}>
        {(vars.name || "chef").toUpperCase()}
      </div>
      <div style={fade(0.95)}><Phrase template={template} vars={vars} color={K.green} style={{ fontSize: 17 }} /></div>
    </>
  );
}

function ACount({ template, vars, stat }) {
  const [v, setV] = useState(0);
  const target = stat ? stat.value : 0;
  useEffect(() => {
    let raf;
    const t0 = performance.now() + 150;
    const step = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 900));
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const done = v >= target;
  return (
    <>
      <div style={{ fontSize: 11, letterSpacing: ".14em", fontWeight: 700, color: K.muted, textAlign: "center", textTransform: "uppercase" }}>{stat ? stat.label : ""}</div>
      <div style={{ fontSize: 58, fontWeight: 900, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: done ? K.green : K.text }}>
        {Math.round(v)}<span style={{ fontSize: 20, fontWeight: 800, color: K.muted, marginLeft: 5 }}>{stat ? stat.unit : ""}</span>
      </div>
      <div style={fade(1.15)}><Phrase template={template} vars={vars} color={K.green} style={{ fontSize: 19 }} /></div>
    </>
  );
}

function ACountdown({ template, vars }) {
  const steps = ["3", "2", "1", "À table !"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const ts = steps.map((_, k) => setTimeout(() => setI(k + 1), 120 + k * 380));
    return () => ts.forEach(clearTimeout);
  }, []);
  const cur = i >= 1 && i <= steps.length ? steps[i - 1] : null;
  const last = cur === steps[steps.length - 1];
  return (
    <>
      <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {cur && (
          <div key={cur} style={{ fontSize: last ? 46 : 80, fontWeight: 900, letterSpacing: "-.03em", color: last ? K.amber : K.text, animation: last ? "spPop .45s cubic-bezier(.2,1.6,.4,1) forwards" : "spBeat .38s ease-out forwards" }}>
            {cur}
          </div>
        )}
      </div>
      <div style={fade(1.7)}><Phrase template={template} vars={vars} color={K.amber} /></div>
    </>
  );
}

function ADrop({ template, vars }) {
  let k = 0;
  return (
    <div style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.3, textAlign: "center" }}>
      {segments(template, vars).map((s, si) => (
        <span key={si} style={s.hl ? { color: K.plum } : null}>
          {[...s.t].map((c, ci) => {
            const d = 0.15 + (k++) * 0.035;
            return c === " "
              ? <span key={ci}> </span>
              : <span key={ci} style={{ display: "inline-block", opacity: 0, animation: `spDrop .55s cubic-bezier(.3,1.6,.5,1) ${d}s forwards` }}>{c}</span>;
          })}
        </span>
      ))}
    </div>
  );
}

function ASteam({ template, vars }) {
  const wisp = (x, delay) => (
    <path d={`M${x} 70 C ${x - 10} 55, ${x + 10} 45, ${x} 30 S ${x - 10} 10, ${x} 0`} fill="none" stroke={K.mutedDim} strokeWidth="4" strokeLinecap="round"
      style={{ strokeDasharray: 90, strokeDashoffset: 90, opacity: 0.9, animation: `spSteam 1.2s ease-out ${delay}s infinite` }} />
  );
  return (
    <>
      <div style={{ position: "relative", width: 140, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
        <svg viewBox="0 0 100 70" style={{ width: 90, height: 64, position: "absolute", top: 4 }} aria-hidden="true">
          {wisp(30, 0.2)}{wisp(50, 0.45)}{wisp(70, 0.7)}
        </svg>
        <span style={{ fontSize: 86, lineHeight: 1, opacity: 0, animation: "spPop .6s cubic-bezier(.2,1.6,.4,1) .05s forwards" }}>🍲</span>
      </div>
      <div style={fade(0.9)}><Phrase template={template} vars={vars} color={K.tomato} /></div>
    </>
  );
}

function AWipe({ template, vars }) {
  const band = (color, delay) => ({
    position: "absolute", top: 0, bottom: 0, left: 0, width: "100%", background: color,
    transform: "translateX(-101%)", animation: `spWipe .75s cubic-bezier(.7,0,.3,1) ${delay}s forwards`,
  });
  return (
    <>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={band(K.tomato, 0.05)} />
        <div style={band(K.amber, 0.15)} />
        <div style={band(K.green, 0.25)} />
      </div>
      <div style={fade(0.75)}><Phrase template={template} vars={vars} color={K.tomato} style={{ fontSize: 24 }} /></div>
    </>
  );
}

const VIEWS = { pan: APan, type: AType, zoom: AZoom, count: ACount, countdown: ACountdown, drop: ADrop, steam: ASteam, wipe: AWipe };

function lengthOf(variant, template, vars) {
  const len = fillPhrase(template, vars).length;
  switch (variant) {
    case "type": return 250 + len * 42 + 800;
    case "drop": return 150 + len * 35 + 900;
    case "count": return 2300;
    case "countdown": return 2600;
    case "pan": return 2500;
    case "steam": return 2300;
    case "wipe": return 2000;
    default: return 2100;
  }
}

/* ---------------- écran d'accueil ---------------- */
export function Splash({ variant, template, name, people, stat, onDone }) {
  const vars = { name, people };
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    setTimeout(onDone, 450);
  };
  useEffect(() => {
    const t = setTimeout(finish, lengthOf(variant, template, vars));
    return () => clearTimeout(t);
  }, []);
  const View = VIEWS[variant] || AZoom;
  return (
    <div onClick={finish} role="button" aria-label="Passer l'animation" className="splash"
      style={{ position: "fixed", inset: 0, zIndex: 100, background: K.bg, color: K.text, fontFamily: "system-ui,-apple-system,sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px", overflow: "hidden",
        transform: leaving ? "translateY(-100%)" : "none", transition: "transform .45s cubic-bezier(.2,.8,.2,1)" }}>
      <style>{`
        @keyframes spFadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        @keyframes spPop { 0% { opacity: 0; transform: scale(.3) } 55% { opacity: 1; transform: scale(1.12) } 100% { opacity: 1; transform: scale(1) } }
        @keyframes spBlink { 50% { opacity: 0 } }
        @keyframes spBeat { 0% { opacity: 0; transform: scale(1.8) } 35% { opacity: 1; transform: scale(1) } 100% { opacity: .15; transform: scale(.85) } }
        @keyframes spDrop { 0% { opacity: 0; transform: translateY(-60px) } 100% { opacity: 1; transform: none } }
        @keyframes spFall { 0% { opacity: 1; transform: translateY(-140px) rotate(-20deg) } 85% { opacity: 1 } 100% { opacity: 0; transform: translateY(30px) rotate(15deg) } }
        @keyframes spShake { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-5deg) } 75% { transform: rotate(5deg) } }
        @keyframes spSteam { 0% { stroke-dashoffset: 90; opacity: 0 } 30% { opacity: .9 } 100% { stroke-dashoffset: -90; opacity: 0 } }
        @keyframes spWipe { 0% { transform: translateX(-101%) } 45% { transform: translateX(0) } 100% { transform: translateX(101%) } }
        @media (prefers-reduced-motion: reduce) { .splash * { animation-duration: .01ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important } }
      `}</style>
      <View template={template} vars={vars} stat={stat} />
      <div style={{ position: "absolute", bottom: "calc(24px + env(safe-area-inset-bottom))", fontSize: 11, color: K.mutedDim, fontWeight: 600 }}>Touche pour passer</div>
    </div>
  );
}

/* ---------------- 1re ouverture : prénom + nombre de personnes ---------------- */
export function Welcome({ onSave }) {
  const [v, setV] = useState("");
  const [people, setPeople] = useState(1);
  const submit = (e) => { e.preventDefault(); if (v.trim()) onSave(v.trim(), people); };
  const step = (d) => setPeople(Math.min(10, Math.max(1, people + d)));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, background: K.bg, color: K.text, fontFamily: "system-ui,-apple-system,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}>🍳</div>
        <div style={{ fontSize: 11, letterSpacing: ".16em", color: K.muted, fontWeight: 700 }}>BIENVENUE SUR POPOTE</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.15 }}>Comment tu t'appelles ?</div>
        <input id="first-name" autoFocus value={v} onChange={(e) => setV(e.target.value)} maxLength={20} placeholder="Ton prénom"
          style={{ background: K.surface, border: `1px solid ${K.line}`, borderRadius: 12, color: K.text, padding: "13px 14px", fontSize: 17, fontWeight: 700, outline: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: K.surface, border: `1px solid ${K.line}`, borderRadius: 12, padding: "10px 12px" }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Vous êtes combien à table ?</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={() => step(-1)} aria-label="Moins de personnes" style={stepBtn}>−</button>
            <span style={{ fontSize: 18, fontWeight: 800, minWidth: 18, textAlign: "center" }}>{people}</span>
            <button type="button" onClick={() => step(1)} aria-label="Plus de personnes" style={stepBtn}>+</button>
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: K.muted }}>On te le demande une seule fois. Tu pourras tout changer dans le Profil.</div>
        <button type="submit" disabled={!v.trim()} style={{ background: v.trim() ? K.tomato : K.mutedDim, border: "none", borderRadius: 12, color: "#fff", padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
          C'est parti
        </button>
      </form>
    </div>
  );
}
const stepBtn = { width: 32, height: 32, borderRadius: 9, border: `1px solid ${K.line}`, background: "#F0F0ED", fontSize: 18, fontWeight: 800, color: K.text, cursor: "pointer", lineHeight: 1 };

/* ---------------- Réglages de l'écran d'accueil ---------------- */
const card = { background: K.surface, border: `1px solid ${K.line}`, borderRadius: 16, boxShadow: "0 4px 14px -8px rgba(24,22,18,0.12)" };
const label = { fontSize: 11, letterSpacing: ".12em", color: K.muted, fontWeight: 700, margin: "22px 0 10px" };

export function SplashSettings({ settings, people, onChange, onPreview, onBack }) {
  const [draft, setDraft] = useState("");
  const set = (patch) => onChange({ ...settings, ...patch });
  const selected = new Set(settings.phrases || []);
  const toggle = (id) => set({ phrases: selected.has(id) ? settings.phrases.filter((x) => x !== id) : [...settings.phrases, id] });
  const addCustom = () => {
    const t = draft.trim().replace(/\{pr[ée]nom\}/gi, "{name}");
    if (!t) return;
    const id = `c-${Date.now()}`;
    set({ custom: [...(settings.custom || []), { id, text: t }], phrases: [...settings.phrases, id] });
    setDraft("");
  };
  const removeCustom = (id) => set({ custom: settings.custom.filter((c) => c.id !== id), phrases: settings.phrases.filter((x) => x !== id) });
  const vars = { name: settings.name || "Robin", people: Math.max(2, people) };
  const phrases = allPhrases(settings);
  const groups = [...new Set(phrases.map((p) => p.group))];
  const whenLabel = { lunch: "le midi", dinner: "le soir", group: "à plusieurs" };
  const animChoices = [...ANIMATIONS, { id: "random", label: "Aléatoire", desc: "Une différente à chaque ouverture", color: K.muted }, { id: "none", label: "Aucune", desc: "Ouvre directement l'appli", color: K.mutedDim }];

  return (
    <div style={{ animation: "pop .2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <button className="press" onClick={onBack} aria-label="Retour" style={{ background: K.surface, border: `1px solid ${K.line}`, borderRadius: 11, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: K.text, flexShrink: 0 }}><ChevronLeft size={19} /></button>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Écran d'accueil</div>
      </div>

      <div style={label}>PRÉNOM</div>
      <input id="settings-name" value={settings.name} onChange={(e) => set({ name: e.target.value.slice(0, 20) })} placeholder="Ton prénom"
        style={{ width: "100%", boxSizing: "border-box", background: K.surface, border: `1px solid ${K.line}`, borderRadius: 12, color: K.text, padding: "12px 14px", fontSize: 16, fontWeight: 700, outline: "none" }} />

      <div style={{ ...label, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>ANIMATION</span>
        {settings.anim !== "none" && (
          <button className="press" onClick={() => onPreview(settings.anim)} style={{ display: "flex", alignItems: "center", gap: 5, background: K.text, color: "#fff", border: "none", borderRadius: 999, padding: "6px 11px", fontSize: 11.5, fontWeight: 700, letterSpacing: 0, cursor: "pointer" }}>
            <Play size={11} fill="#fff" /> Aperçu
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
        {animChoices.map((a) => {
          const on = settings.anim === a.id;
          return (
            <button key={a.id} className="press" onClick={() => { set({ anim: a.id }); if (a.id !== "none") onPreview(a.id); }}
              style={{ ...card, textAlign: "left", padding: "11px 12px", cursor: "pointer", color: K.text, border: on ? `1.8px solid ${a.color}` : `1px solid ${K.line}`, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, paddingRight: 16 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 800 }}>{a.label}</span>
              </div>
              <div style={{ fontSize: 11.5, color: K.muted, marginTop: 3, lineHeight: 1.3 }}>{a.desc}</div>
              {on && <Check size={15} color={a.color} strokeWidth={3} style={{ position: "absolute", top: 10, right: 10 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 11.5, color: K.mutedDim, marginTop: 8 }}>Toucher une animation la choisit et la montre.</div>

      <div style={label}>PHRASES ({selected.size} cochée{selected.size > 1 ? "s" : ""})</div>
      <div style={{ fontSize: 12.5, color: K.muted, marginTop: -4, marginBottom: 10 }}>Une phrase cochée est tirée au hasard à chaque ouverture.</div>
      {groups.map((g) => (
        <div key={g} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: K.text, margin: "0 2px 6px" }}>{g}</div>
          <div style={{ ...card, overflow: "hidden" }}>
            {phrases.filter((p) => p.group === g).map((p, i, arr) => {
              const on = selected.has(p.id);
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderBottom: i < arr.length - 1 ? `1px solid ${K.line}` : "none" }}>
                  <button onClick={() => toggle(p.id)} aria-pressed={on} aria-label={on ? "Décocher" : "Cocher"}
                    style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, cursor: "pointer", border: on ? "none" : `1.6px solid ${K.mutedDim}`, background: on ? K.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {on && <Check size={14} color="#fff" strokeWidth={3.2} />}
                  </button>
                  <span onClick={() => toggle(p.id)} style={{ flex: 1, fontSize: 14, fontWeight: 600, color: on ? K.text : K.muted, cursor: "pointer" }}>
                    {fillPhrase(p.text, vars)}
                    {p.when && <span style={{ fontSize: 11, color: K.mutedDim, fontWeight: 600 }}> · {whenLabel[p.when]}</span>}
                  </span>
                  {p.group === "Mes phrases" && (
                    <button onClick={() => removeCustom(p.id)} aria-label="Supprimer la phrase" style={{ background: "none", border: "none", color: K.mutedDim, cursor: "pointer", padding: 2 }}><X size={16} /></button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <input id="custom-phrase" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} placeholder="Ta phrase ({prénom} = ton prénom)"
          style={{ flex: 1, minWidth: 0, background: K.surface, border: `1px solid ${K.line}`, borderRadius: 10, color: K.text, padding: "10px 12px", fontSize: 14, fontWeight: 600, outline: "none" }} />
        <button className="press" onClick={addCustom} aria-label="Ajouter la phrase" style={{ background: K.green, border: "none", borderRadius: 10, width: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Plus size={18} color="#fff" strokeWidth={3} /></button>
      </div>
    </div>
  );
}
