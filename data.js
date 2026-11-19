/*
 * Base de données de Popote.
 *
 * Ingrédients : valeurs pour 100 g (kcal, protéines p, glucides c, lipides f),
 * prix moyen en €/kg (supermarché, France), allergènes, et si c'est de la
 * viande / du poisson (pour le mode végétarien). Valeurs moyennes arrondies,
 * proches des tables nutritionnelles courantes : ce sont des estimations.
 */

export const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "lactose", label: "Lactose" },
  { id: "oeufs", label: "Œufs" },
  { id: "arachides", label: "Arachides" },
  { id: "fruits_coque", label: "Fruits à coque" },
  { id: "poisson", label: "Poisson" },
  { id: "crustaces", label: "Crustacés" },
  { id: "soja", label: "Soja" },
];

export const APPLIANCES = [
  { id: "poele", label: "Poêle", emoji: "🍳" },
  { id: "casserole", label: "Casserole", emoji: "🥘" },
  { id: "four", label: "Four", emoji: "🔥" },
  { id: "airfryer", label: "Air fryer", emoji: "💨" },
  { id: "micro", label: "Micro-ondes", emoji: "📡" },
  { id: "mixeur", label: "Mixeur / blender", emoji: "🌀" },
];

// unit : pour afficher en pièces (ex. 2 œufs) au lieu de grammes
export const INGREDIENTS = {
  poulet: { name: "Blanc de poulet", kcal: 110, p: 23, c: 0, f: 1.5, eur: 11, meat: true },
  boeuf: { name: "Bœuf haché 5 %", kcal: 125, p: 21, c: 0, f: 5, eur: 12, meat: true },
  jambon: { name: "Jambon blanc", kcal: 115, p: 20, c: 1, f: 3.5, eur: 12, meat: true },
  oeuf: { name: "Œuf", kcal: 140, p: 12.5, c: 0.7, f: 9.5, eur: 4.5, allergens: ["oeufs"], unit: { one: "œuf", many: "œufs", g: 60 } },
  thon: { name: "Thon au naturel (égoutté)", kcal: 110, p: 25, c: 0, f: 1, eur: 14, meat: true, allergens: ["poisson"] },
  saumon: { name: "Pavé de saumon", kcal: 200, p: 20, c: 0, f: 13, eur: 25, meat: true, allergens: ["poisson"] },
  crevettes: { name: "Crevettes décortiquées", kcal: 85, p: 19, c: 0, f: 1, eur: 20, meat: true, allergens: ["crustaces"] },
  tofu: { name: "Tofu ferme", kcal: 120, p: 13, c: 2, f: 7, eur: 8, allergens: ["soja"] },
  lentilles: { name: "Lentilles corail (sèches)", kcal: 330, p: 24, c: 50, f: 1.5, eur: 3 },
  poischiches: { name: "Pois chiches (conserve, égouttés)", kcal: 130, p: 7, c: 17, f: 2.5, eur: 3 },
  haricots: { name: "Haricots rouges (conserve, égouttés)", kcal: 110, p: 7, c: 15, f: 0.5, eur: 3 },
  riz: { name: "Riz (sec)", kcal: 350, p: 7, c: 78, f: 0.6, eur: 2 },
  pates: { name: "Pâtes (sèches)", kcal: 355, p: 12.5, c: 71, f: 1.5, eur: 1.8, allergens: ["gluten"] },
  avoine: { name: "Flocons d'avoine", kcal: 370, p: 13, c: 60, f: 7, eur: 2, allergens: ["gluten"] },
  pain: { name: "Pain complet", kcal: 250, p: 9, c: 45, f: 3, eur: 4, allergens: ["gluten"], unit: { one: "tranche", many: "tranches", g: 30 } },
  tortilla: { name: "Tortilla de blé", kcal: 300, p: 8, c: 50, f: 7, eur: 6, allergens: ["gluten"], unit: { one: "tortilla", many: "tortillas", g: 60 } },
  pdt: { name: "Pommes de terre", kcal: 80, p: 2, c: 17, f: 0.1, eur: 1.5 },
  patatedouce: { name: "Patate douce", kcal: 86, p: 1.6, c: 20, f: 0.1, eur: 3 },
  skyr: { name: "Skyr / fromage blanc 0 %", kcal: 60, p: 10.5, c: 4, f: 0.2, eur: 4, allergens: ["lactose"] },
  lait: { name: "Lait demi-écrémé", kcal: 46, p: 3.3, c: 4.8, f: 1.6, eur: 1, allergens: ["lactose"] },
  cottage: { name: "Cottage cheese", kcal: 100, p: 11, c: 3, f: 4.5, eur: 7, allergens: ["lactose"] },
  emmental: { name: "Emmental râpé", kcal: 380, p: 28, c: 0, f: 29, eur: 10, allergens: ["lactose"] },
  mozzarella: { name: "Mozzarella", kcal: 250, p: 18, c: 1, f: 19, eur: 9, allergens: ["lactose"] },
  whey: { name: "Whey (protéine en poudre)", kcal: 380, p: 78, c: 8, f: 6, eur: 25, allergens: ["lactose"] },
  beurrecacahuete: { name: "Beurre de cacahuète", kcal: 600, p: 25, c: 14, f: 50, eur: 8, allergens: ["arachides"] },
  amandes: { name: "Amandes", kcal: 600, p: 21, c: 10, f: 50, eur: 15, allergens: ["fruits_coque"] },
  banane: { name: "Banane", kcal: 90, p: 1.1, c: 21, f: 0.3, eur: 2, unit: { one: "banane", many: "bananes", g: 120 } },
  fruitsrouges: { name: "Fruits rouges surgelés", kcal: 50, p: 1, c: 10, f: 0.3, eur: 7 },
  brocoli: { name: "Brocoli (surgelé)", kcal: 35, p: 3, c: 4, f: 0.4, eur: 3 },
  epinards: { name: "Épinards", kcal: 25, p: 3, c: 1.5, f: 0.4, eur: 4 },
  poivron: { name: "Poivron", kcal: 30, p: 1, c: 5, f: 0.3, eur: 4 },
  oignon: { name: "Oignon", kcal: 40, p: 1.2, c: 9, f: 0.1, eur: 2 },
  tomate: { name: "Tomates concassées (conserve)", kcal: 30, p: 1.3, c: 5, f: 0.2, eur: 2 },
  legumes: { name: "Poêlée de légumes surgelée", kcal: 50, p: 3, c: 7, f: 0.5, eur: 3 },
  courgette: { name: "Courgette", kcal: 17, p: 1.2, c: 3, f: 0.3, eur: 2.5 },
  mais: { name: "Maïs (conserve)", kcal: 80, p: 2.5, c: 15, f: 1, eur: 3 },
  avocat: { name: "Avocat", kcal: 160, p: 2, c: 2, f: 15, eur: 8 },
  huile: { name: "Huile d'olive", kcal: 900, p: 0, c: 0, f: 100, eur: 9 },
  coco: { name: "Lait de coco", kcal: 180, p: 2, c: 3, f: 18, eur: 6 },
  soja: { name: "Sauce soja", kcal: 60, p: 8, c: 6, f: 0, eur: 8, allergens: ["soja", "gluten"] },
  miel: { name: "Miel", kcal: 300, p: 0, c: 82, f: 0, eur: 10 },
  citron: { name: "Jus de citron", kcal: 25, p: 0.4, c: 7, f: 0.2, eur: 4 },
};

/*
 * Recettes, quantités pour UNE portion de base.
 * needs : liste de groupes d'appareils ; il faut au moins un appareil de
 * chaque groupe (ex. [["four", "airfryer"]] = four OU air fryer).
 * meal : "breakfast" | "meal" | "snack"
 */
export const RECIPES = [
  // ---------- Petits-déjeuners ----------
  {
    id: "overnight-oats", name: "Overnight oats protéinés", emoji: "🥣", meal: "breakfast", time: 5, needs: [],
    items: [["avoine", 60], ["skyr", 150], ["lait", 100], ["fruitsrouges", 80], ["miel", 10]],
    steps: [
      "Dans un bocal, mélange les flocons d'avoine, le skyr et le lait.",
      "Ajoute les fruits rouges et le miel par-dessus.",
      "Ferme et laisse au frigo toute la nuit (au moins 4 h). Se mange froid.",
    ],
  },
  {
    id: "pancakes", name: "Pancakes banane-avoine", emoji: "🥞", meal: "breakfast", time: 15, needs: [["poele"], ["mixeur"]],
    items: [["avoine", 50], ["oeuf", 120], ["banane", 120], ["skyr", 60], ["huile", 3]],
    steps: [
      "Mixe les flocons d'avoine, les œufs et la banane jusqu'à obtenir une pâte lisse.",
      "Fais chauffer la poêle à feu moyen avec un peu d'huile.",
      "Verse des petites louches de pâte, retourne quand des bulles apparaissent (1 à 2 min par face).",
      "Sers avec le skyr par-dessus.",
    ],
  },
  {
    id: "omelette", name: "Omelette épinards-fromage", emoji: "🍳", meal: "breakfast", time: 10, needs: [["poele"]],
    items: [["oeuf", 180], ["epinards", 60], ["emmental", 20], ["pain", 60], ["huile", 5]],
    steps: [
      "Fais revenir les épinards 2 min dans la poêle avec l'huile.",
      "Bats les œufs avec une pincée de sel et verse-les sur les épinards.",
      "Quand le dessous est pris, ajoute l'emmental, plie l'omelette en deux.",
      "Sers avec le pain grillé.",
    ],
  },
  {
    id: "smoothie-masse", name: "Smoothie prise de masse", emoji: "🥤", meal: "breakfast", time: 5, needs: [["mixeur"]],
    items: [["lait", 300], ["banane", 120], ["avoine", 40], ["beurrecacahuete", 25], ["whey", 30]],
    steps: ["Mets tout dans le blender.", "Mixe 30 à 45 secondes jusqu'à ce que ce soit bien lisse. Bois tout de suite."],
  },
  {
    id: "bowl-skyr", name: "Bowl skyr, avoine et amandes", emoji: "🍓", meal: "breakfast", time: 3, needs: [],
    items: [["skyr", 250], ["avoine", 40], ["amandes", 15], ["fruitsrouges", 80], ["miel", 10]],
    steps: ["Verse le skyr dans un bol.", "Ajoute l'avoine, les fruits rouges, les amandes concassées et le miel."],
  },
  {
    id: "oeufs-brouilles", name: "Œufs brouillés, jambon et toasts", emoji: "🍞", meal: "breakfast", time: 8, needs: [["poele", "micro"]],
    items: [["oeuf", 180], ["jambon", 60], ["pain", 60], ["lait", 30]],
    steps: [
      "Bats les œufs avec le lait, sel et poivre.",
      "Poêle : cuis à feu doux en remuant sans arrêt 3 à 4 min. Micro-ondes : 1 min, remue, puis 30 s par 30 s jusqu'à ce que ce soit pris.",
      "Sers avec le jambon et le pain grillé.",
    ],
  },

  // ---------- Repas ----------
  {
    id: "poulet-riz", name: "Poulet, riz et brocoli sauce soja", emoji: "🍗", meal: "meal", time: 25, needs: [["poele"], ["casserole"]],
    items: [["poulet", 150], ["riz", 80], ["brocoli", 150], ["huile", 8], ["soja", 10]],
    steps: [
      "Fais cuire le riz dans une casserole d'eau salée (environ 12 min), ajoute le brocoli les 5 dernières minutes.",
      "Coupe le poulet en morceaux et fais-le dorer 6 à 8 min dans la poêle avec l'huile.",
      "Ajoute la sauce soja en fin de cuisson et mélange.",
      "Sers le poulet sur le riz et le brocoli.",
    ],
  },
  {
    id: "bolo", name: "Pâtes bolognaise express", emoji: "🍝", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["boeuf", 130], ["pates", 100], ["tomate", 150], ["oignon", 50], ["huile", 5], ["emmental", 15]],
    steps: [
      "Lance les pâtes dans l'eau bouillante salée.",
      "Fais revenir l'oignon émincé dans l'huile, ajoute le bœuf haché et fais-le dorer.",
      "Ajoute les tomates concassées, sel, poivre, laisse mijoter 8 min.",
      "Égoutte les pâtes, nappe de sauce et parsème d'emmental.",
    ],
  },
  {
    id: "wrap-poulet", name: "Wrap poulet-avocat", emoji: "🌯", meal: "meal", time: 15, needs: [["poele"]],
    items: [["tortilla", 60], ["poulet", 120], ["avocat", 50], ["poivron", 50], ["emmental", 15]],
    steps: [
      "Fais cuire le poulet en lamelles avec le poivron dans la poêle, 7 à 8 min.",
      "Écrase l'avocat sur la tortilla.",
      "Ajoute le poulet, le poivron et l'emmental, roule bien serré.",
      "Passe le wrap 1 min de chaque côté dans la poêle pour le dorer.",
    ],
  },
  {
    id: "curry-lentilles", name: "Curry de lentilles corail au coco", emoji: "🍛", meal: "meal", time: 25, needs: [["casserole"]],
    items: [["lentilles", 80], ["coco", 80], ["tomate", 100], ["oignon", 50], ["epinards", 50], ["riz", 60]],
    steps: [
      "Fais cuire le riz à part.",
      "Dans une casserole, fais revenir l'oignon, ajoute les lentilles rincées, les tomates, le lait de coco, 200 ml d'eau et du curry.",
      "Laisse mijoter 15 min en remuant, jusqu'à ce que les lentilles soient fondantes.",
      "Ajoute les épinards 2 min avant la fin. Sers avec le riz.",
    ],
  },
  {
    id: "chili", name: "Chili con carne", emoji: "🌶️", meal: "meal", time: 30, needs: [["casserole"]],
    items: [["boeuf", 130], ["haricots", 120], ["tomate", 150], ["oignon", 50], ["mais", 50], ["riz", 70]],
    steps: [
      "Fais cuire le riz à part.",
      "Dans une casserole, fais dorer l'oignon puis le bœuf haché.",
      "Ajoute tomates, haricots rouges, maïs, cumin, paprika, sel. Laisse mijoter 15 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "saumon-patate", name: "Saumon, patate douce et brocoli", emoji: "🐟", meal: "meal", time: 30, needs: [["four", "airfryer"]],
    items: [["saumon", 130], ["patatedouce", 200], ["brocoli", 120], ["huile", 8]],
    steps: [
      "Coupe la patate douce en cubes, mélange avec l'huile, sel, paprika.",
      "Four 200 °C : 15 min, puis ajoute le saumon et le brocoli et poursuis 12 min. Air fryer 200 °C : patate 12 min, puis saumon et brocoli 8 min.",
      "Vérifie que le saumon se détache en lamelles, c'est prêt.",
    ],
  },
  {
    id: "poulet-airfryer", name: "Poulet et pommes de terre au air fryer", emoji: "🍟", meal: "meal", time: 30, needs: [["airfryer", "four"]],
    items: [["poulet", 160], ["pdt", 250], ["courgette", 100], ["huile", 8]],
    steps: [
      "Coupe les pommes de terre en quartiers, la courgette en rondelles et le poulet en morceaux.",
      "Mélange tout avec l'huile, sel, poivre, herbes de Provence.",
      "Air fryer 200 °C pendant 20 à 22 min (secoue à mi-cuisson), ou four 210 °C pendant 30 min.",
    ],
  },
  {
    id: "tofu-saute", name: "Tofu sauté aux légumes et riz", emoji: "🥢", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["tofu", 180], ["riz", 80], ["legumes", 150], ["soja", 15], ["huile", 8]],
    steps: [
      "Fais cuire le riz.",
      "Coupe le tofu en cubes, fais-le dorer 6 min dans l'huile bien chaude.",
      "Ajoute les légumes surgelés, fais sauter 5 min.",
      "Ajoute la sauce soja, mélange et sers sur le riz.",
    ],
  },
  {
    id: "thon-pates", name: "Pâtes thon-tomate", emoji: "🥫", meal: "meal", time: 15, needs: [["casserole"]],
    items: [["thon", 120], ["pates", 100], ["tomate", 150], ["oignon", 40], ["huile", 5]],
    steps: [
      "Fais cuire les pâtes.",
      "Dans une autre casserole, fais revenir l'oignon dans l'huile, ajoute les tomates et laisse réduire 5 min.",
      "Ajoute le thon émietté hors du feu, mélange avec les pâtes égouttées.",
    ],
  },
  {
    id: "bowl-poischiches", name: "Bowl pois chiches, riz et avocat", emoji: "🥗", meal: "meal", time: 15, needs: [["casserole"]],
    items: [["poischiches", 200], ["riz", 70], ["poivron", 80], ["avocat", 50], ["huile", 8], ["citron", 10]],
    steps: [
      "Fais cuire le riz et laisse-le tiédir.",
      "Rince les pois chiches, coupe le poivron et l'avocat.",
      "Assemble le bol et assaisonne avec l'huile, le citron, sel et poivre.",
    ],
  },
  {
    id: "crevettes-riz", name: "Riz sauté aux crevettes et à l'œuf", emoji: "🍤", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["crevettes", 150], ["riz", 80], ["legumes", 150], ["oeuf", 60], ["soja", 15], ["huile", 8]],
    steps: [
      "Fais cuire le riz (idéalement la veille, il saute mieux froid).",
      "Dans la poêle chaude avec l'huile, saisis les crevettes 3 min, réserve.",
      "Fais sauter les légumes 4 min, pousse-les sur le côté et brouille l'œuf.",
      "Ajoute le riz, les crevettes et la sauce soja, fais sauter 2 min.",
    ],
  },
  {
    id: "gratin-jambon", name: "Gratin pommes de terre-jambon", emoji: "🧀", meal: "meal", time: 40, needs: [["four"], ["casserole"]],
    items: [["pdt", 250], ["jambon", 100], ["lait", 100], ["emmental", 30]],
    steps: [
      "Coupe les pommes de terre en rondelles et précuis-les 8 min dans l'eau bouillante.",
      "Dans un plat, alterne pommes de terre et jambon en dés, sale, poivre.",
      "Verse le lait, parsème d'emmental.",
      "Enfourne 25 min à 200 °C jusqu'à ce que ce soit doré.",
    ],
  },
  {
    id: "patate-micro", name: "Patate douce au micro-ondes, thon et cottage", emoji: "🍠", meal: "meal", time: 12, needs: [["micro"]],
    items: [["patatedouce", 250], ["thon", 100], ["cottage", 100], ["mais", 50]],
    steps: [
      "Pique la patate douce partout avec une fourchette.",
      "Micro-ondes 7 à 9 min à pleine puissance, retourne-la à mi-cuisson.",
      "Ouvre-la en deux et garnis de cottage cheese, thon et maïs. Sel, poivre.",
    ],
  },
  {
    id: "pizza-wrap", name: "Pizza wrap jambon-mozza", emoji: "🍕", meal: "meal", time: 12, needs: [["four", "airfryer"]],
    items: [["tortilla", 60], ["tomate", 60], ["mozzarella", 60], ["jambon", 50]],
    steps: [
      "Étale les tomates concassées sur la tortilla, ajoute origan, sel.",
      "Ajoute le jambon et la mozzarella en morceaux.",
      "Four 220 °C 8 à 10 min, ou air fryer 180 °C 5 à 6 min.",
    ],
  },

  // ---------- Snacks ----------
  {
    id: "mug-cake", name: "Mug cake protéiné", emoji: "🧁", meal: "snack", time: 4, needs: [["micro"]],
    items: [["avoine", 30], ["whey", 30], ["oeuf", 60], ["lait", 50]],
    steps: ["Dans un grand mug, mélange tous les ingrédients à la fourchette.", "Micro-ondes 1 min 15 à 1 min 30. Laisse tiédir 1 min."],
  },
  {
    id: "skyr-cacahuete", name: "Skyr, banane et beurre de cacahuète", emoji: "🍌", meal: "snack", time: 2, needs: [],
    items: [["skyr", 200], ["banane", 120], ["beurrecacahuete", 20]],
    steps: ["Verse le skyr dans un bol, ajoute la banane en rondelles et le beurre de cacahuète."],
  },
  {
    id: "houmous", name: "Houmous maison et pain", emoji: "🫘", meal: "snack", time: 8, needs: [["mixeur"]],
    items: [["poischiches", 150], ["huile", 10], ["citron", 15], ["pain", 60]],
    steps: [
      "Mixe les pois chiches avec l'huile, le citron, une pincée de sel, de cumin et 2 c. à soupe d'eau.",
      "Mixe jusqu'à ce que ce soit crémeux. Sers avec le pain.",
    ],
  },
  {
    id: "poischiches-grilles", name: "Pois chiches grillés croustillants", emoji: "🫛", meal: "snack", time: 20, needs: [["airfryer", "four"]],
    items: [["poischiches", 150], ["huile", 5]],
    steps: [
      "Sèche bien les pois chiches dans un torchon.",
      "Mélange avec l'huile, sel, paprika fumé.",
      "Air fryer 200 °C 12 à 15 min en secouant, ou four 200 °C 25 min.",
    ],
  },
  {
    id: "cottage-fruits", name: "Cottage cheese, fruits rouges et amandes", emoji: "🫐", meal: "snack", time: 2, needs: [],
    items: [["cottage", 200], ["fruitsrouges", 80], ["amandes", 15]],
    steps: ["Mets le cottage cheese dans un bol, ajoute les fruits rouges et les amandes."],
  },
  {
    id: "shake-whey", name: "Shake whey et lait", emoji: "🥛", meal: "snack", time: 2, needs: [],
    items: [["lait", 300], ["whey", 30]],
    steps: ["Secoue la whey et le lait froid dans un shaker pendant 20 secondes."],
  },
];
