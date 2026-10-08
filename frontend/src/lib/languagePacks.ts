// Starter packs: short themed word sets for the languages page, read aloud in a native voice.
// Each word is [English, the word in that language, optional picture].

export type PackWord = [english: string, word: string, picture?: string];
export type Topic = { id: string; title: string; picture: string };
export type PackLanguage = { name: string; code: string; flag: string; packs: Record<string, PackWord[]> };

export const TOPICS: Topic[] = [
  { id: "greetings", title: "Greetings", picture: "👋" },
  { id: "numbers", title: "Numbers 1 to 10", picture: "🔢" },
  { id: "colours", title: "Colours", picture: "🎨" },
  { id: "animals", title: "Animals", picture: "🐶" },
  { id: "food", title: "Food and drink", picture: "🍎" },
  { id: "family", title: "Family", picture: "👪" },
  { id: "days", title: "Days of the week", picture: "📅" },
  { id: "weather", title: "Weather", picture: "☀️" },
];

const NUMBERS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const NUMBER_PICTURES = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const numbers = (words: string[]): PackWord[] => words.map((w, i) => [NUMBERS[i], w, NUMBER_PICTURES[i]]);

const COLOURS = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "black", "white", "brown"];
const COLOUR_PICTURES = ["🔴", "🔵", "🟢", "🟡", "🟠", "🟣", "🩷", "⚫", "⚪", "🟤"];
const colours = (words: string[]): PackWord[] => words.map((w, i) => [COLOURS[i], w, COLOUR_PICTURES[i]]);

const ANIMALS = ["dog", "cat", "horse", "cow", "pig", "bird", "fish", "rabbit", "mouse", "sheep"];
const ANIMAL_PICTURES = ["🐶", "🐱", "🐴", "🐮", "🐷", "🐦", "🐟", "🐰", "🐭", "🐑"];
const animals = (words: string[]): PackWord[] => words.map((w, i) => [ANIMALS[i], w, ANIMAL_PICTURES[i]]);

const FOOD = ["bread", "apple", "cheese", "milk", "water", "egg", "banana", "cake", "chicken", "juice"];
const FOOD_PICTURES = ["🍞", "🍎", "🧀", "🥛", "💧", "🥚", "🍌", "🎂", "🍗", "🧃"];
const food = (words: string[]): PackWord[] => words.map((w, i) => [FOOD[i], w, FOOD_PICTURES[i]]);

const FAMILY = ["mum", "dad", "brother", "sister", "grandma", "grandad", "baby", "family", "aunt", "uncle"];
const FAMILY_PICTURES = ["👩", "👨", "👦", "👧", "👵", "👴", "👶", "👪", "👩", "👨"];
const family = (words: string[]): PackWord[] => words.map((w, i) => [FAMILY[i], w, FAMILY_PICTURES[i]]);

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const days = (words: string[]): PackWord[] => words.map((w, i) => [DAYS[i], w]);

const WEATHER = ["it's sunny", "it's raining", "it's snowing", "it's windy", "it's cold", "it's hot", "it's cloudy", "nice weather", "bad weather", "it's foggy"];
const WEATHER_PICTURES = ["☀️", "🌧️", "❄️", "💨", "🥶", "🥵", "☁️", "😎", "⛈️", "🌫️"];
const weather = (words: string[]): PackWord[] => words.map((w, i) => [WEATHER[i], w, WEATHER_PICTURES[i]]);

const GREETINGS = ["hello", "good morning", "goodbye", "please", "thank you", "yes", "no", "good night", "how are you?", "my name is…"];
const GREETING_PICTURES = ["👋", "🌅", "👋", "🙏", "😊", "👍", "👎", "🌙", "❓", "📛"];
const greetings = (words: string[]): PackWord[] => words.map((w, i) => [GREETINGS[i], w, GREETING_PICTURES[i]]);

export const PACK_LANGUAGES: PackLanguage[] = [
  {
    name: "French",
    code: "fr-FR",
    flag: "🇫🇷",
    packs: {
      greetings: greetings(["salut", "bonjour", "au revoir", "s'il vous plaît", "merci", "oui", "non", "bonne nuit", "ça va ?", "je m'appelle…"]),
      numbers: numbers(["un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"]),
      colours: colours(["rouge", "bleu", "vert", "jaune", "orange", "violet", "rose", "noir", "blanc", "marron"]),
      animals: animals(["le chien", "le chat", "le cheval", "la vache", "le cochon", "l'oiseau", "le poisson", "le lapin", "la souris", "le mouton"]),
      food: food(["le pain", "la pomme", "le fromage", "le lait", "l'eau", "l'œuf", "la banane", "le gâteau", "le poulet", "le jus"]),
      family: family(["maman", "papa", "le frère", "la sœur", "mamie", "papi", "le bébé", "la famille", "la tante", "l'oncle"]),
      days: days(["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]),
      weather: weather(["il y a du soleil", "il pleut", "il neige", "il y a du vent", "il fait froid", "il fait chaud", "il y a des nuages", "il fait beau", "il fait mauvais", "il y a du brouillard"]),
    },
  },
  {
    name: "Spanish",
    code: "es-ES",
    flag: "🇪🇸",
    packs: {
      greetings: greetings(["hola", "buenos días", "adiós", "por favor", "gracias", "sí", "no", "buenas noches", "¿qué tal?", "me llamo…"]),
      numbers: numbers(["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"]),
      colours: colours(["rojo", "azul", "verde", "amarillo", "naranja", "morado", "rosa", "negro", "blanco", "marrón"]),
      animals: animals(["el perro", "el gato", "el caballo", "la vaca", "el cerdo", "el pájaro", "el pez", "el conejo", "el ratón", "la oveja"]),
      food: food(["el pan", "la manzana", "el queso", "la leche", "el agua", "el huevo", "el plátano", "la tarta", "el pollo", "el zumo"]),
      family: family(["mamá", "papá", "el hermano", "la hermana", "la abuela", "el abuelo", "el bebé", "la familia", "la tía", "el tío"]),
      days: days(["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]),
      weather: weather(["hace sol", "llueve", "nieva", "hace viento", "hace frío", "hace calor", "está nublado", "hace buen tiempo", "hace mal tiempo", "hay niebla"]),
    },
  },
  {
    name: "German",
    code: "de-DE",
    flag: "🇩🇪",
    packs: {
      greetings: greetings(["hallo", "guten Morgen", "auf Wiedersehen", "bitte", "danke", "ja", "nein", "gute Nacht", "wie geht's?", "ich heiße…"]),
      numbers: numbers(["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"]),
      colours: colours(["rot", "blau", "grün", "gelb", "orange", "lila", "rosa", "schwarz", "weiß", "braun"]),
      animals: animals(["der Hund", "die Katze", "das Pferd", "die Kuh", "das Schwein", "der Vogel", "der Fisch", "das Kaninchen", "die Maus", "das Schaf"]),
      food: food(["das Brot", "der Apfel", "der Käse", "die Milch", "das Wasser", "das Ei", "die Banane", "der Kuchen", "das Hähnchen", "der Saft"]),
      family: family(["Mama", "Papa", "der Bruder", "die Schwester", "die Oma", "der Opa", "das Baby", "die Familie", "die Tante", "der Onkel"]),
      days: days(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]),
      weather: weather(["es ist sonnig", "es regnet", "es schneit", "es ist windig", "es ist kalt", "es ist heiß", "es ist wolkig", "schönes Wetter", "schlechtes Wetter", "es ist neblig"]),
    },
  },
  {
    name: "Italian",
    code: "it-IT",
    flag: "🇮🇹",
    packs: {
      greetings: greetings(["ciao", "buongiorno", "arrivederci", "per favore", "grazie", "sì", "no", "buonanotte", "come stai?", "mi chiamo…"]),
      numbers: numbers(["uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci"]),
      colours: colours(["rosso", "blu", "verde", "giallo", "arancione", "viola", "rosa", "nero", "bianco", "marrone"]),
      animals: animals(["il cane", "il gatto", "il cavallo", "la mucca", "il maiale", "l'uccello", "il pesce", "il coniglio", "il topo", "la pecora"]),
      food: food(["il pane", "la mela", "il formaggio", "il latte", "l'acqua", "l'uovo", "la banana", "la torta", "il pollo", "il succo"]),
      family: family(["mamma", "papà", "il fratello", "la sorella", "la nonna", "il nonno", "il bebè", "la famiglia", "la zia", "lo zio"]),
      days: days(["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"]),
      weather: weather(["c'è il sole", "piove", "nevica", "c'è vento", "fa freddo", "fa caldo", "è nuvoloso", "fa bel tempo", "fa brutto tempo", "c'è nebbia"]),
    },
  },
  {
    name: "Polish",
    code: "pl-PL",
    flag: "🇵🇱",
    packs: {
      greetings: greetings(["cześć", "dzień dobry", "do widzenia", "proszę", "dziękuję", "tak", "nie", "dobranoc", "jak się masz?", "mam na imię…"]),
      numbers: numbers(["jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć", "dziesięć"]),
      colours: colours(["czerwony", "niebieski", "zielony", "żółty", "pomarańczowy", "fioletowy", "różowy", "czarny", "biały", "brązowy"]),
      animals: animals(["pies", "kot", "koń", "krowa", "świnia", "ptak", "ryba", "królik", "mysz", "owca"]),
      food: food(["chleb", "jabłko", "ser", "mleko", "woda", "jajko", "banan", "ciasto", "kurczak", "sok"]),
      family: family(["mama", "tata", "brat", "siostra", "babcia", "dziadek", "niemowlę", "rodzina", "ciocia", "wujek"]),
      days: days(["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"]),
      weather: weather(["jest słonecznie", "pada deszcz", "pada śnieg", "jest wietrznie", "jest zimno", "jest gorąco", "jest pochmurno", "ładna pogoda", "brzydka pogoda", "jest mgła"]),
    },
  },
  {
    name: "Welsh",
    code: "cy-GB",
    flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    packs: {
      greetings: greetings(["helo", "bore da", "hwyl fawr", "os gwelwch yn dda", "diolch", "ie", "na", "nos da", "sut wyt ti?", "fy enw i yw…"]),
      numbers: numbers(["un", "dau", "tri", "pedwar", "pump", "chwech", "saith", "wyth", "naw", "deg"]),
      colours: colours(["coch", "glas", "gwyrdd", "melyn", "oren", "porffor", "pinc", "du", "gwyn", "brown"]),
      animals: animals(["ci", "cath", "ceffyl", "buwch", "mochyn", "aderyn", "pysgodyn", "cwningen", "llygoden", "dafad"]),
      food: food(["bara", "afal", "caws", "llaeth", "dŵr", "wy", "banana", "cacen", "cyw iâr", "sudd"]),
      family: family(["mam", "dad", "brawd", "chwaer", "mam-gu", "tad-cu", "babi", "teulu", "modryb", "ewythr"]),
      days: days(["dydd Llun", "dydd Mawrth", "dydd Mercher", "dydd Iau", "dydd Gwener", "dydd Sadwrn", "dydd Sul"]),
      weather: weather(["mae hi'n heulog", "mae hi'n bwrw glaw", "mae hi'n bwrw eira", "mae hi'n wyntog", "mae hi'n oer", "mae hi'n boeth", "mae hi'n gymylog", "tywydd braf", "tywydd gwael", "mae hi'n niwlog"]),
    },
  },
];

/** The words as they're spoken: "je m'appelle…" is read as "je m'appelle". */
export const spokenForm = (word: string) => word.replace(/…/g, "").trim();

/** How a finished pack is written in the practice diary, and how it's found again for the tick. */
export const packNote = (topic: Topic, score: number, total: number) => `Starter pack: ${topic.title} (${score}/${total})`;
export const packDone = (note: string | null | undefined, topic: Topic) => !!note && note.includes(`Starter pack: ${topic.title} (`);
