import { photos, type Photo } from "./photos";

export const site = {
  name: "NOIR",
  city: "Lyon",
  district: "Croix-Rousse",
  street: "7 Montée des Ombres",
  postcode: "69004 Lyon, France",
  email: "bonsoir@noir.example",
  seats: 24,
  url: "https://noir-lyon.vercel.app",
};

export const nav = [
  { id: "menu", label: "The Menu" },
  { id: "philosophy", label: "Philosophy" },
  { id: "chef", label: "The Chef" },
  { id: "room", label: "The Room" },
  { id: "gallery", label: "Gallery" },
  { id: "reserve", label: "Reserve" },
  { id: "visit", label: "Visit" },
] as const;

export const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** Frame shapes for the menu stage, as clip-path insets of the same box so they can morph. */
export const shapes = {
  ellipse: "inset(11% 9% 11% 9% round 50% 50% 50% 50%)",
  tall: "inset(0% 16% 0% 0% round 0% 0% 0% 0%)",
  arch: "inset(3% 13% 0% 13% round 50% 50% 0% 0%)",
  small: "inset(25% 25% 25% 25% round 0% 0% 0% 0%)",
  wide: "inset(19% 0% 19% 0% round 0% 0% 0% 0%)",
  porthole: "inset(19% 19% 19% 19% round 50% 50% 50% 50%)",
  pillar: "inset(0% 27% 0% 27% round 0% 0% 0% 0%)",
} as const;

export type Shape = keyof typeof shapes;

export type Course = {
  name: string;
  line: string;
  text: string;
  parts: { item: string; from: string }[];
  pairing: string;
  photo: Photo;
  shape: Shape;
  /** object-position for the photo inside the stage frame */
  focus?: string;
  /** centre of the macro loupe, as background-position */
  detail: string;
  /** roughly when the course reaches the table */
  time: string;
};

export const courses: Course[] = [
  {
    name: "Salt",
    line: "Oyster, frozen buttermilk, sea fennel",
    text: "One oyster from the bay of Quiberon, opened to order, under a shaving of frozen buttermilk and a few drops of sea fennel oil. Cold, saline, over in a single breath.",
    parts: [
      { item: "Oyster", from: "Quiberon, Brittany" },
      { item: "Buttermilk", from: "Cultured in house, three days" },
      { item: "Sea fennel", from: "Picked on the Atlantic coast" },
    ],
    pairing: "Muscadet sur lie",
    photo: photos.oyster,
    shape: "ellipse",
    focus: "50% 45%",
    detail: "48% 46%",
    time: "19:20",
  },
  {
    name: "Tide",
    line: "Langoustine, roasted pumpkin, beech-smoked roe",
    text: "Raw langoustine dressed with brown butter and lemon thyme, a purée of pumpkin roasted in the embers, trout roe smoked over beech. The sweetness of the sea meets the sweetness of October.",
    parts: [
      { item: "Langoustine", from: "Day boats, Le Guilvinec" },
      { item: "Pumpkin", from: "Ferme des Sablons, Ain" },
      { item: "Trout roe", from: "Smoked over beech in our cellar" },
    ],
    pairing: "Chenin blanc, Anjou",
    photo: photos.langoustine,
    shape: "porthole",
    focus: "52% 50%",
    detail: "50% 42%",
    time: "19:45",
  },
  {
    name: "Saffron",
    line: "Scallops, oscietra, beurre au safran",
    text: "Hand-dived scallops seared on one side only, a spoon of oscietra, Rhône valley asparagus and a saffron beurre blanc finished at the table. The most classical plate of the night, and the one we change least.",
    parts: [
      { item: "Scallops", from: "Hand-dived, bay of Saint-Brieuc" },
      { item: "Oscietra", from: "Aquitaine" },
      { item: "Saffron", from: "A grower in the Quercy" },
    ],
    pairing: "Savagnin ouillé, Jura",
    photo: photos.saffron,
    shape: "arch",
    focus: "38% 60%",
    detail: "36% 58%",
    time: "20:15",
  },
  {
    name: "Still",
    line: "Consommé of black onion, chamomile, aged Comté",
    text: "Onions roasted black for eight hours, clarified into a consommé the colour of old amber and poured over one chamomile flower and a shaving of Comté. The quiet in the middle of the menu.",
    parts: [
      { item: "Sweet onions", from: "Cévennes" },
      { item: "Chamomile", from: "Dried in our attic" },
      { item: "Comté", from: "Thirty months, Jura" },
    ],
    pairing: "A small glass of vin jaune",
    photo: photos.consomme,
    shape: "small",
    detail: "50% 46%",
    time: "20:45",
  },
  {
    name: "Ember",
    line: "Charolais beef, vine embers, ash-baked potato",
    text: "Charolais beef aged sixty days and cooked over vine cuttings in the hearth, with charred beans, a potato baked in the ashes and a purée of celeriac. The only course cooked entirely on the fire.",
    parts: [
      { item: "Beef", from: "Charolais, aged sixty days" },
      { item: "Vine cuttings", from: "A Beaujolais grower" },
      { item: "Celeriac", from: "Ferme des Sablons, Ain" },
    ],
    pairing: "Morgon, Beaujolais",
    photo: photos.ember,
    shape: "wide",
    focus: "60% 50%",
    detail: "66% 46%",
    time: "21:10",
  },
  {
    name: "Last Heat",
    line: "Plums dried in the hearth, blackcurrant leaf",
    text: "After service, plums from the Monts du Lyonnais go into the cooling hearth overnight. By morning they are wrinkled, smoky and sweet. Served whole with a granita of blackcurrant leaf, a pause before dessert.",
    parts: [
      { item: "Plums", from: "Monts du Lyonnais" },
      { item: "Blackcurrant leaf", from: "Our courtyard" },
      { item: "Smoke", from: "Oak and vine embers" },
    ],
    pairing: "Poiré, Domfrontais",
    photo: photos.plums,
    shape: "tall",
    focus: "48% 45%",
    detail: "44% 38%",
    time: "21:45",
  },
  {
    name: "Nuit",
    line: "Raspberry, roasted beetroot, frozen milk",
    text: "A dome of raspberry and roasted beetroot under a snowfall of frozen milk, on a buckwheat sablé. Sweet, earthy and cold: the last thing the kitchen sends before the lights go down.",
    parts: [
      { item: "Raspberries", from: "Late harvest, Ardèche" },
      { item: "Beetroot", from: "Ferme des Sablons, Ain" },
      { item: "Buckwheat", from: "A mill in Brittany" },
    ],
    pairing: "Maury, Roussillon",
    photo: photos.raspberry,
    shape: "pillar",
    focus: "50% 58%",
    detail: "50% 52%",
    time: "22:05",
  },
];

export const pricing = [
  { label: "Le Menu Noir, seven courses", price: "€165" },
  { label: "Wine pairing", price: "€110" },
  { label: "Pairing without alcohol", price: "€70" },
];

export const principles = [
  {
    title: "Season",
    text: "The menu is written on Monday and rewritten by Thursday. When the chanterelles stop, the course stops with them.",
  },
  {
    title: "Producers",
    text: "Eleven farms, two fishing boats and one forager, none more than a morning's drive from the door. Their names are printed on the bill.",
  },
  {
    title: "Technique",
    text: "Smoke, ferment, slow fire, cold. Old European methods used with care, and no more equipment than a dish needs.",
  },
  {
    title: "Texture",
    text: "Every plate is built on contrast: crisp against yielding, warm against frozen, sweetness set against salt.",
  },
  {
    title: "Experiment",
    text: "Tuesday is closed to guests and open to the kitchen. Most of what we try that day never reaches a table.",
  },
  {
    title: "Memory",
    text: "The smell of a grandmother's kitchen, the cold of a cellar in October. We cook towards what people remember, not what they photograph.",
  },
];

export const day = [
  { time: "06:00", title: "The knives", text: "One whetstone, twenty minutes, before anyone speaks.", photo: photos.chefKnife },
  { time: "06:40", title: "The starter is fed", text: "Rye and buckwheat sourdough, baked twice a day.", photo: photos.chefSalt },
  { time: "16:30", title: "The hearth is lit", text: "Vine cuttings first, then oak. It takes two hours to be ready.", photo: photos.chefFire },
  { time: "18:45", title: "Stock, smoke, steam", text: "The last reductions go down while the room is lit.", photo: photos.chefSteam },
  { time: "19:30", title: "First plates", text: "Every course leaves the pass under Aurèle's hand.", photo: photos.chefTweezers },
];

export type GalleryItem = { photo: Photo; caption: string; layout: string };

export const gallery: GalleryItem[] = [
  { photo: photos.plate, caption: "Roots, flowers, brown butter. Summer sequence", layout: "g1" },
  { photo: photos.crudo, caption: "Mackerel, green tomato, nasturtium", layout: "g2" },
  { photo: photos.knife, caption: "The paring knife, sharpened every morning", layout: "g3" },
  { photo: photos.pan, caption: "Chanterelles, flamed with marc du Bugey", layout: "g4" },
  { photo: photos.lantern, caption: "The lantern above the cellar door", layout: "g5" },
  { photo: photos.oysters, caption: "Quiberon, Tuesday delivery", layout: "g6" },
  { photo: photos.pavlova, caption: "Meringue, blackberry, sour cream. Late summer", layout: "g7" },
  { photo: photos.smoke, caption: "Fruit resting in hearth smoke", layout: "g8" },
  { photo: photos.finger, caption: "The last adjustment", layout: "g9" },
  { photo: photos.table, caption: "Staff meal, eleven at night", layout: "g10" },
  { photo: photos.garlic, caption: "Garlic, day thirty of forty", layout: "g11" },
  { photo: photos.sauce, caption: "Venison, beetroot, red wine. Winter sequence", layout: "g12" },
  { photo: photos.darkDessert, caption: "Chocolate, buckwheat, burnt meringue", layout: "g13" },
];

export const hours = [
  { day: "Wednesday to Saturday", time: "Seatings 19:00 to 21:00" },
  { day: "Sunday to Tuesday", time: "Closed" },
];

/** Seatings offered by the reservation demo. */
export const seatings = ["19:00", "19:30", "20:30", "21:00"];
