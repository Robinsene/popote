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
  haricotsverts: { name: "Haricots verts (surgelés)", kcal: 25, p: 2, c: 3.5, f: 0.2, eur: 3 },
  courgette: { name: "Courgette", kcal: 17, p: 1.2, c: 3, f: 0.3, eur: 2.5 },
  mais: { name: "Maïs (conserve)", kcal: 80, p: 2.5, c: 15, f: 1, eur: 3 },
  avocat: { name: "Avocat", kcal: 160, p: 2, c: 2, f: 15, eur: 8 },
  huile: { name: "Huile d'olive", kcal: 900, p: 0, c: 0, f: 100, eur: 9 },
  coco: { name: "Lait de coco", kcal: 180, p: 2, c: 3, f: 18, eur: 6 },
  soja: { name: "Sauce soja", kcal: 60, p: 8, c: 6, f: 0, eur: 8, allergens: ["soja", "gluten"] },
  miel: { name: "Miel", kcal: 300, p: 0, c: 82, f: 0, eur: 10 },
  citron: { name: "Jus de citron", kcal: 25, p: 0.4, c: 7, f: 0.2, eur: 4 },
  dinde: { name: "Escalope de dinde", kcal: 105, p: 23, c: 0, f: 1.5, eur: 11, meat: true },
  porc: { name: "Filet mignon de porc", kcal: 120, p: 22, c: 0, f: 3.5, eur: 13, meat: true },
  lardons: { name: "Lardons", kcal: 250, p: 15, c: 0.5, f: 21, eur: 10, meat: true },
  cabillaud: { name: "Cabillaud (surgelé)", kcal: 80, p: 18, c: 0, f: 0.7, eur: 14, meat: true, allergens: ["poisson"] },
  maquereau: { name: "Maquereau (conserve)", kcal: 200, p: 19, c: 0, f: 14, eur: 12, meat: true, allergens: ["poisson"] },
  sardines: { name: "Sardines (conserve)", kcal: 210, p: 24, c: 0, f: 12, eur: 13, meat: true, allergens: ["poisson"] },
  feta: { name: "Feta", kcal: 265, p: 14, c: 1, f: 21, eur: 11, allergens: ["lactose"] },
  parmesan: { name: "Parmesan", kcal: 400, p: 33, c: 0, f: 29, eur: 20, allergens: ["lactose"] },
  creme: { name: "Crème fraîche légère", kcal: 160, p: 2.5, c: 4, f: 15, eur: 5, allergens: ["lactose"] },
  quinoa: { name: "Quinoa (sec)", kcal: 370, p: 14, c: 64, f: 6, eur: 8 },
  semoule: { name: "Semoule de blé", kcal: 360, p: 12.5, c: 72, f: 1.5, eur: 2.5, allergens: ["gluten"] },
  lentillesvertes: { name: "Lentilles vertes (sèches)", kcal: 330, p: 24, c: 50, f: 1.5, eur: 3.5 },
  haricotsblancs: { name: "Haricots blancs (conserve, égouttés)", kcal: 100, p: 7, c: 14, f: 0.5, eur: 2.5 },
  petitspois: { name: "Petits pois (surgelés)", kcal: 80, p: 5, c: 11, f: 0.4, eur: 3 },
  champignons: { name: "Champignons de Paris", kcal: 22, p: 3, c: 1, f: 0.3, eur: 5 },
  carottes: { name: "Carottes", kcal: 40, p: 0.9, c: 8, f: 0.2, eur: 1.5 },
  aubergine: { name: "Aubergine", kcal: 25, p: 1, c: 4, f: 0.2, eur: 3 },
  concombre: { name: "Concombre", kcal: 15, p: 0.7, c: 3, f: 0.1, eur: 2 },
  salade: { name: "Salade verte", kcal: 15, p: 1.3, c: 1.5, f: 0.2, eur: 6 },
  gnocchi: { name: "Gnocchi", kcal: 150, p: 4, c: 32, f: 0.5, eur: 4, allergens: ["gluten"] },
  bun: { name: "Pain à burger", kcal: 270, p: 9, c: 48, f: 5, eur: 6, allergens: ["gluten"], unit: { one: "pain à burger", many: "pains à burger", g: 60 } },
  pesto: { name: "Pesto", kcal: 450, p: 5, c: 5, f: 45, eur: 12, allergens: ["lactose", "fruits_coque"] },
};

/*
 * Recettes, quantités pour UNE portion de base.
 * needs : liste de groupes d'appareils ; il faut au moins un appareil de
 * chaque groupe (ex. [["four", "airfryer"]] = four OU air fryer).
 * Uniquement des plats pour le déjeuner et le dîner.
 */
export const RECIPES = [
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

  {
    id: "steak-puree", name: "Steak haché, purée maison et haricots verts", emoji: "🥩", meal: "meal", time: 25, needs: [["poele"], ["casserole"]],
    items: [["boeuf", 150], ["pdt", 250], ["lait", 50], ["haricotsverts", 150]],
    steps: [
      "Épluche et coupe les pommes de terre, fais-les cuire 15 à 20 min dans l'eau salée avec les haricots verts les 8 dernières minutes.",
      "Égoutte, écrase les pommes de terre avec le lait chaud, sel, poivre.",
      "Fais cuire le steak haché 3 à 4 min de chaque côté dans la poêle bien chaude.",
    ],
  },
  {
    id: "tortilla-espagnole", name: "Tortilla espagnole (omelette aux pommes de terre)", emoji: "🥔", meal: "meal", time: 30, needs: [["poele"]],
    items: [["oeuf", 180], ["pdt", 200], ["oignon", 50], ["huile", 10]],
    steps: [
      "Coupe les pommes de terre en fines rondelles et l'oignon en lamelles.",
      "Fais-les cuire à feu doux 15 min dans la poêle avec l'huile, en remuant, jusqu'à ce qu'elles soient tendres.",
      "Bats les œufs avec sel et poivre, verse sur les pommes de terre.",
      "Cuis 5 min à feu doux, retourne à l'aide d'une assiette et cuis encore 3 min.",
    ],
  },
  {
    id: "quiche-sans-pate", name: "Quiche sans pâte jambon-courgette", emoji: "🥧", meal: "meal", time: 40, needs: [["four"]],
    items: [["oeuf", 150], ["lait", 100], ["jambon", 80], ["emmental", 30], ["courgette", 120]],
    steps: [
      "Préchauffe le four à 180 °C.",
      "Coupe la courgette en petits dés et le jambon en morceaux.",
      "Bats les œufs avec le lait, sel, poivre, ajoute courgette, jambon et emmental.",
      "Verse dans un plat huilé et enfourne 30 min jusqu'à ce que ce soit doré et pris.",
    ],
  },
  {
    id: "poulet-coco", name: "Poulet au curry et lait de coco", emoji: "🍲", meal: "meal", time: 25, needs: [["poele"], ["casserole"]],
    items: [["poulet", 150], ["coco", 70], ["oignon", 50], ["epinards", 60], ["riz", 80]],
    steps: [
      "Fais cuire le riz.",
      "Fais revenir l'oignon puis le poulet en morceaux 5 min dans la poêle.",
      "Ajoute 1 c. à café de curry, le lait de coco et laisse mijoter 8 min.",
      "Ajoute les épinards 2 min avant la fin et sers avec le riz.",
    ],
  },
  {
    id: "bowl-saumon", name: "Bowl saumon, riz, avocat et maïs", emoji: "🍣", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["saumon", 120], ["riz", 80], ["avocat", 50], ["mais", 50], ["soja", 10]],
    steps: [
      "Fais cuire le riz et laisse-le tiédir.",
      "Fais cuire le saumon 4 min de chaque côté dans la poêle, puis émiette-le.",
      "Dispose dans un bol le riz, le saumon, l'avocat en tranches et le maïs.",
      "Arrose de sauce soja.",
    ],
  },
  {
    id: "croque", name: "Croque-monsieur maison", emoji: "🥪", meal: "meal", time: 15, needs: [["four", "airfryer", "poele"]],
    items: [["pain", 120], ["jambon", 80], ["emmental", 40]],
    steps: [
      "Garnis 2 tranches de pain avec le jambon et la moitié de l'emmental, referme avec les 2 autres tranches.",
      "Parsème le reste d'emmental sur le dessus.",
      "Four 200 °C 10 min, air fryer 180 °C 6 min, ou poêle à couvert 3 min par face.",
    ],
  },
  {
    id: "oeufs-patates", name: "Pommes de terre sautées et œufs au plat", emoji: "🍳", meal: "meal", time: 25, needs: [["poele"]],
    items: [["pdt", 250], ["oeuf", 120], ["huile", 10], ["epinards", 60]],
    steps: [
      "Coupe les pommes de terre en petits cubes et fais-les dorer 15 à 18 min dans la poêle avec l'huile, en remuant.",
      "Ajoute les épinards 2 min, pousse le tout sur le côté.",
      "Casse les œufs dans la poêle et cuis 3 min jusqu'à ce que le blanc soit pris.",
    ],
  },
  {
    id: "shakshuka", name: "Shakshuka (œufs à la tomate)", emoji: "🍅", meal: "meal", time: 20, needs: [["poele"]],
    items: [["oeuf", 180], ["tomate", 200], ["poivron", 80], ["oignon", 50], ["pain", 60], ["huile", 5]],
    steps: [
      "Fais revenir l'oignon et le poivron 5 min dans l'huile.",
      "Ajoute les tomates, cumin, paprika, sel, et laisse mijoter 5 min.",
      "Creuse des puits, casse les œufs dedans, couvre et cuis 5 à 6 min.",
      "Sers avec le pain.",
    ],
  },
  {
    id: "nouilles-boeuf", name: "Nouilles sautées au bœuf", emoji: "🍜", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["pates", 100], ["boeuf", 130], ["legumes", 150], ["soja", 15], ["huile", 8]],
    steps: [
      "Fais cuire les pâtes (ou nouilles) et égoutte-les.",
      "Fais dorer le bœuf dans la poêle avec l'huile, ajoute les légumes et fais sauter 5 min.",
      "Ajoute les pâtes et la sauce soja, fais sauter 2 min à feu vif.",
    ],
  },
  {
    id: "dinde-creme", name: "Escalope de dinde crème-champignons et riz", emoji: "🍄", meal: "meal", time: 25, needs: [["poele"], ["casserole"]],
    items: [["dinde", 150], ["champignons", 100], ["creme", 40], ["riz", 80]],
    steps: [
      "Fais cuire le riz.",
      "Fais dorer l'escalope 4 min de chaque côté dans la poêle, réserve.",
      "Fais revenir les champignons émincés 5 min, ajoute la crème, sel, poivre.",
      "Remets la dinde 2 min dans la sauce et sers avec le riz.",
    ],
  },
  {
    id: "porc-moutarde", name: "Filet mignon à la moutarde et haricots verts", emoji: "🐖", meal: "meal", time: 30, needs: [["poele"], ["casserole"]],
    items: [["porc", 150], ["pdt", 220], ["creme", 30], ["haricotsverts", 120]],
    steps: [
      "Fais cuire les pommes de terre en morceaux 15 min dans l'eau salée, avec les haricots verts les 8 dernières minutes.",
      "Coupe le filet mignon en médaillons et fais-les dorer 3 min de chaque côté.",
      "Ajoute la crème et 1 c. à café de moutarde, laisse épaissir 2 min.",
      "Sers avec les légumes.",
    ],
  },
  {
    id: "cabillaud-citron", name: "Cabillaud citron, riz et brocoli", emoji: "🐟", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["cabillaud", 170], ["riz", 80], ["brocoli", 150], ["huile", 8], ["citron", 10]],
    steps: [
      "Fais cuire le riz avec le brocoli les 5 dernières minutes.",
      "Fais cuire le cabillaud décongelé 4 min de chaque côté dans l'huile.",
      "Arrose de citron, sale, poivre, sers avec le riz et le brocoli.",
    ],
  },
  {
    id: "papillote-cabillaud", name: "Papillote de cabillaud aux courgettes", emoji: "🫕", meal: "meal", time: 30, needs: [["four"], ["micro", "casserole"]],
    items: [["cabillaud", 170], ["courgette", 150], ["pdt", 200], ["huile", 8], ["citron", 10]],
    steps: [
      "Préchauffe le four à 200 °C.",
      "Sur une feuille de papier cuisson, pose la courgette en rondelles, le cabillaud, l'huile, le citron, sel et herbes. Ferme bien.",
      "Enfourne 20 min.",
      "Pendant ce temps, cuis les pommes de terre (micro-ondes 8 min dans un bol couvert, ou 15 min dans l'eau).",
    ],
  },
  {
    id: "couscous-poulet", name: "Couscous poulet et légumes", emoji: "🥘", meal: "meal", time: 30, needs: [["casserole"]],
    items: [["poulet", 140], ["semoule", 80], ["carottes", 100], ["courgette", 100], ["poischiches", 60], ["tomate", 80]],
    steps: [
      "Dans une casserole, fais dorer le poulet en morceaux, ajoute carottes et courgette en morceaux, tomates, pois chiches, 300 ml d'eau et des épices à couscous.",
      "Laisse mijoter 20 min.",
      "Verse autant d'eau bouillante salée que de semoule, couvre 5 min puis égrène à la fourchette.",
      "Sers la semoule avec le bouillon, la viande et les légumes.",
    ],
  },
  {
    id: "taboule-quinoa", name: "Taboulé de quinoa, feta et pois chiches", emoji: "🥗", meal: "meal", time: 20, needs: [["casserole"]],
    items: [["quinoa", 70], ["feta", 50], ["poischiches", 100], ["concombre", 80], ["poivron", 60], ["huile", 8], ["citron", 10]],
    steps: [
      "Fais cuire le quinoa 12 min dans l'eau salée, égoutte et laisse refroidir.",
      "Coupe le concombre, le poivron et la feta en dés.",
      "Mélange tout avec les pois chiches, l'huile, le citron, sel, poivre et menthe si tu en as.",
    ],
  },
  {
    id: "salade-lentilles-thon", name: "Salade de lentilles vertes au thon", emoji: "🥫", meal: "meal", time: 25, needs: [["casserole"]],
    items: [["lentillesvertes", 70], ["thon", 80], ["carottes", 60], ["oignon", 20], ["huile", 8]],
    steps: [
      "Fais cuire les lentilles 20 min dans l'eau non salée, égoutte.",
      "Râpe la carotte, émince l'oignon.",
      "Mélange les lentilles tièdes, le thon, la carotte et l'oignon avec l'huile, un peu de vinaigre, sel et poivre.",
    ],
  },
  {
    id: "gnocchi-pesto", name: "Gnocchi poêlés au pesto et poulet", emoji: "🍃", meal: "meal", time: 15, needs: [["poele"]],
    items: [["gnocchi", 200], ["poulet", 120], ["pesto", 20], ["epinards", 50]],
    steps: [
      "Fais dorer le poulet en dés 6 min dans la poêle, réserve.",
      "Fais dorer les gnocchi 5 min dans la même poêle (sans les faire bouillir).",
      "Ajoute les épinards, le poulet et le pesto, mélange 1 min.",
    ],
  },
  {
    id: "burger-maison", name: "Burger maison et frites au four", emoji: "🍔", meal: "meal", time: 30, needs: [["poele"], ["airfryer", "four"]],
    items: [["bun", 60], ["boeuf", 130], ["emmental", 20], ["oignon", 20], ["salade", 15], ["pdt", 200], ["huile", 5]],
    steps: [
      "Coupe les pommes de terre en frites, mélange avec l'huile et le sel. Air fryer 200 °C 18 min ou four 220 °C 30 min.",
      "Forme un steak avec le bœuf haché et cuis-le 3 min de chaque côté, ajoute l'emmental à la fin.",
      "Toaste le pain, garnis de salade, steak et oignon.",
    ],
  },
  {
    id: "carbonara", name: "Pâtes carbonara", emoji: "🥓", meal: "meal", time: 15, needs: [["poele"], ["casserole"]],
    items: [["pates", 100], ["lardons", 60], ["oeuf", 60], ["parmesan", 20]],
    steps: [
      "Fais cuire les pâtes.",
      "Fais dorer les lardons à sec dans la poêle.",
      "Bats l'œuf avec le parmesan et beaucoup de poivre.",
      "Hors du feu, mélange les pâtes égouttées (avec 2 c. à soupe d'eau de cuisson), les lardons et l'œuf, en remuant vite pour que ce soit crémeux.",
    ],
  },
  {
    id: "risotto-poulet", name: "Risotto poulet-champignons", emoji: "🍚", meal: "meal", time: 30, needs: [["casserole"]],
    items: [["riz", 80], ["poulet", 120], ["champignons", 100], ["parmesan", 15], ["oignon", 30]],
    steps: [
      "Fais revenir l'oignon et le poulet en dés dans une casserole, ajoute les champignons.",
      "Ajoute le riz, mélange 1 min, puis verse du bouillon chaud louche par louche en remuant, pendant 18 min.",
      "Hors du feu, ajoute le parmesan, mélange et sers.",
    ],
  },
  {
    id: "hachis", name: "Hachis parmentier", emoji: "🥔", meal: "meal", time: 45, needs: [["four"], ["casserole"]],
    items: [["boeuf", 130], ["pdt", 250], ["lait", 50], ["emmental", 20], ["oignon", 30]],
    steps: [
      "Fais cuire les pommes de terre 20 min, écrase-les avec le lait.",
      "Fais revenir l'oignon et le bœuf haché, sale et poivre.",
      "Dans un plat, mets la viande puis la purée et l'emmental.",
      "Gratine 15 min à 200 °C.",
    ],
  },
  {
    id: "gratin-pates", name: "Gratin de pâtes au jambon", emoji: "🧀", meal: "meal", time: 30, needs: [["four"], ["casserole"]],
    items: [["pates", 90], ["jambon", 80], ["creme", 30], ["emmental", 30]],
    steps: [
      "Fais cuire les pâtes 2 min de moins qu'indiqué.",
      "Mélange avec le jambon en dés et la crème, sale, poivre.",
      "Verse dans un plat, couvre d'emmental et gratine 15 min à 200 °C.",
    ],
  },
  {
    id: "aubergine-farcie", name: "Aubergines farcies au bœuf", emoji: "🍆", meal: "meal", time: 45, needs: [["four"]],
    items: [["aubergine", 250], ["boeuf", 120], ["tomate", 100], ["emmental", 20], ["oignon", 30]],
    steps: [
      "Coupe l'aubergine en deux, creuse la chair et enfourne les coques 15 min à 200 °C.",
      "Fais revenir l'oignon, le bœuf et la chair d'aubergine hachée, ajoute les tomates.",
      "Remplis les coques, couvre d'emmental et enfourne encore 20 min.",
    ],
  },
  {
    id: "chili-sin-carne", name: "Chili sin carne", emoji: "🫘", meal: "meal", time: 30, needs: [["casserole"]],
    items: [["haricots", 150], ["lentilles", 40], ["tomate", 150], ["mais", 60], ["oignon", 40], ["riz", 70]],
    steps: [
      "Fais cuire le riz.",
      "Fais revenir l'oignon, ajoute les lentilles corail, les tomates, 150 ml d'eau, cumin et paprika.",
      "Laisse mijoter 15 min, ajoute les haricots et le maïs 5 min avant la fin.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "curry-poischiches", name: "Curry de pois chiches aux épinards", emoji: "🍛", meal: "meal", time: 25, needs: [["casserole"]],
    items: [["poischiches", 200], ["coco", 60], ["epinards", 80], ["tomate", 100], ["riz", 70]],
    steps: [
      "Fais cuire le riz.",
      "Dans une casserole, fais chauffer les tomates avec 1 c. à café de curry, ajoute les pois chiches et le lait de coco.",
      "Laisse mijoter 10 min, ajoute les épinards 2 min.",
      "Sers avec le riz.",
    ],
  },
  {
    id: "tofu-teriyaki", name: "Tofu teriyaki, riz et brocoli", emoji: "🍱", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["tofu", 200], ["riz", 80], ["brocoli", 120], ["soja", 15], ["miel", 10]],
    steps: [
      "Fais cuire le riz avec le brocoli les 5 dernières minutes.",
      "Fais dorer le tofu en cubes 6 min dans la poêle.",
      "Ajoute la sauce soja et le miel, laisse caraméliser 1 min.",
      "Sers sur le riz et le brocoli.",
    ],
  },
  {
    id: "wok-porc", name: "Wok de porc aux légumes et nouilles", emoji: "🥢", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["porc", 140], ["pates", 90], ["legumes", 150], ["soja", 15], ["huile", 8]],
    steps: [
      "Fais cuire les pâtes, égoutte.",
      "Saisis le porc en lamelles 4 min dans la poêle bien chaude avec l'huile.",
      "Ajoute les légumes 5 min, puis les pâtes et la sauce soja, fais sauter 2 min.",
    ],
  },
  {
    id: "fajitas", name: "Fajitas au poulet", emoji: "🌮", meal: "meal", time: 20, needs: [["poele"]],
    items: [["tortilla", 120], ["poulet", 140], ["poivron", 100], ["oignon", 40], ["huile", 5]],
    steps: [
      "Coupe le poulet, le poivron et l'oignon en lanières.",
      "Fais-les sauter 8 min avec l'huile, du paprika et du cumin.",
      "Garnis les tortillas chaudes et roule-les.",
    ],
  },
  {
    id: "quesadillas", name: "Quesadillas haricots-fromage", emoji: "🫓", meal: "meal", time: 15, needs: [["poele"]],
    items: [["tortilla", 120], ["haricots", 120], ["emmental", 40], ["mais", 50]],
    steps: [
      "Écrase grossièrement les haricots, ajoute le maïs et des épices.",
      "Étale sur une tortilla, parsème d'emmental, couvre d'une 2e tortilla.",
      "Fais dorer 2 à 3 min de chaque côté dans la poêle, coupe en parts.",
    ],
  },
  {
    id: "pates-sardines", name: "Pâtes aux sardines et citron", emoji: "🐠", meal: "meal", time: 15, needs: [["casserole"]],
    items: [["pates", 100], ["sardines", 90], ["epinards", 50], ["citron", 10], ["huile", 5]],
    steps: [
      "Fais cuire les pâtes, ajoute les épinards dans l'eau les 30 dernières secondes.",
      "Égoutte et mélange avec les sardines émiettées, l'huile, le citron, du poivre et un peu d'ail.",
    ],
  },
  {
    id: "bowl-maquereau", name: "Bowl maquereau, riz et concombre", emoji: "🍙", meal: "meal", time: 15, needs: [["casserole"]],
    items: [["maquereau", 100], ["riz", 80], ["concombre", 80], ["carottes", 50], ["soja", 10]],
    steps: [
      "Fais cuire le riz.",
      "Coupe le concombre, râpe la carotte.",
      "Dispose le riz, le maquereau émietté et les légumes, arrose de sauce soja.",
    ],
  },
  {
    id: "riz-cantonais", name: "Riz cantonais", emoji: "🍳", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["riz", 80], ["oeuf", 120], ["jambon", 60], ["petitspois", 80], ["soja", 10], ["huile", 8]],
    steps: [
      "Fais cuire le riz (idéalement la veille).",
      "Brouille les œufs dans la poêle avec un peu d'huile, réserve.",
      "Fais sauter les petits pois et le jambon en dés 3 min, ajoute le riz et la sauce soja.",
      "Remets les œufs, mélange et sers.",
    ],
  },
  {
    id: "soupe-lentilles", name: "Soupe de lentilles corail et carottes", emoji: "🥣", meal: "meal", time: 30, needs: [["casserole"]],
    items: [["lentilles", 80], ["carottes", 120], ["coco", 40], ["oignon", 30], ["pain", 60]],
    steps: [
      "Fais revenir l'oignon, ajoute les carottes en rondelles, les lentilles, 500 ml d'eau, cumin et sel.",
      "Laisse cuire 20 min, ajoute le lait de coco.",
      "Mixe si tu veux une soupe lisse (mixeur plongeant ou blender), sers avec le pain.",
    ],
  },
  {
    id: "poulet-tikka", name: "Poulet façon tikka et riz", emoji: "🔥", meal: "meal", time: 25, needs: [["poele"], ["casserole"]],
    items: [["poulet", 150], ["skyr", 80], ["tomate", 80], ["oignon", 40], ["riz", 80]],
    steps: [
      "Mélange le poulet en morceaux avec la moitié du skyr et 1 c. à café d'épices tandoori.",
      "Fais cuire le riz.",
      "Fais dorer le poulet 6 min avec l'oignon, ajoute les tomates et laisse mijoter 5 min.",
      "Hors du feu, ajoute le reste du skyr et sers avec le riz.",
    ],
  },
  {
    id: "cesar", name: "Salade César au poulet", emoji: "🥬", meal: "meal", time: 15, needs: [["poele"]],
    items: [["poulet", 140], ["salade", 100], ["pain", 40], ["parmesan", 15], ["skyr", 40], ["huile", 5]],
    steps: [
      "Fais dorer le poulet en lanières 6 min, puis les cubes de pain dans la même poêle.",
      "Mélange le skyr avec un peu de parmesan, de citron et de moutarde pour la sauce.",
      "Mélange la salade, le poulet, les croûtons, la sauce et le reste du parmesan.",
    ],
  },
  {
    id: "poke-tofu", name: "Poke bowl au tofu", emoji: "🥑", meal: "meal", time: 20, needs: [["poele"], ["casserole"]],
    items: [["tofu", 150], ["riz", 80], ["avocat", 50], ["concombre", 60], ["mais", 40], ["soja", 10]],
    steps: [
      "Fais cuire le riz et laisse-le tiédir.",
      "Fais dorer le tofu en cubes 6 min avec la sauce soja.",
      "Dispose le riz, le tofu, l'avocat, le concombre et le maïs dans un bol.",
    ],
  },
  {
    id: "haricots-oeufs", name: "Haricots blancs à la tomate et œufs", emoji: "🍲", meal: "meal", time: 20, needs: [["poele"]],
    items: [["haricotsblancs", 200], ["tomate", 150], ["oeuf", 120], ["pain", 60]],
    steps: [
      "Fais chauffer les tomates avec paprika, sel et poivre, ajoute les haricots 5 min.",
      "Creuse deux puits, casse les œufs, couvre et cuis 5 min.",
      "Sers avec le pain.",
    ],
  },
  {
    id: "bolo-lentilles", name: "Spaghetti bolognaise aux lentilles", emoji: "🍝", meal: "meal", time: 30, needs: [["casserole"]],
    items: [["pates", 100], ["lentilles", 50], ["tomate", 150], ["carottes", 60], ["parmesan", 15]],
    steps: [
      "Fais cuire les lentilles corail 12 min avec les tomates, la carotte râpée, 150 ml d'eau, origan et sel.",
      "Fais cuire les pâtes.",
      "Sers la sauce sur les pâtes avec le parmesan.",
    ],
  },
  {
    id: "brochettes-dinde", name: "Brochettes de dinde et semoule", emoji: "🍢", meal: "meal", time: 25, needs: [["airfryer", "four"], ["casserole", "micro"]],
    items: [["dinde", 160], ["semoule", 80], ["poivron", 100], ["courgette", 80], ["huile", 8]],
    steps: [
      "Coupe la dinde, le poivron et la courgette en cubes, enfile-les sur des pics, badigeonne d'huile et d'épices.",
      "Air fryer 200 °C 12 min (ou four 220 °C 20 min), en retournant à mi-cuisson.",
      "Prépare la semoule : même volume d'eau bouillante salée, couvre 5 min, égrène.",
    ],
  },
];
