/**
 * The Little Roots plan (ages 3 to 4): one topic of six activities per area of learning each term, and the
 * rhymes for the term. `slug` is the activity's slug once it is built (backend make_starters_little.py);
 * a slug that has no activity yet shows as "coming". Made from the Bright Roots curriculum plan.
 */
import type { TermSlug } from "@/lib/terms";

export type LittleActivity = { title: string; slug: string };
export type LittleTopic = { area: string; title: string; summary: string; activities: LittleActivity[] };

/** The areas of learning, in menu order. Each is a Little Roots activity `category`. */
export const LITTLE_AREA_PAGES = [
  { name: "Talk", slug: "talk", emoji: "💬" },
  { name: "Early maths", slug: "early-maths", emoji: "➕" },
  { name: "Letters and sounds", slug: "letters-and-sounds", emoji: "👂" },
  { name: "Moving", slug: "moving", emoji: "🏃" },
  { name: "Creating", slug: "creating", emoji: "🎨" },
  { name: "The world around us", slug: "the-world-around-us", emoji: "🌍" },
  { name: "Feelings and friends", slug: "feelings-and-friends", emoji: "💛" },
];
export const RHYMES = "Rhymes and songs";

export const LITTLE_PLAN: Record<TermSlug, { topics: LittleTopic[]; rhymes: LittleActivity[] }> = {
  autumn: {
    topics: [
      { area: "Talk", title: "Let's pretend", summary: "Children build speaking and listening through role play, stories and chatting with a grown-up.", activities: [{ title: "Little shop", slug: "little-little-shop" }, { title: "Story basket", slug: "little-story-basket" }, { title: "Teddy's phone call", slug: "little-teddys-phone-call" }, { title: "What's in the picture?", slug: "little-whats-in-the-picture" }, { title: "Puppet hello", slug: "little-puppet-hello" }, { title: "Tell me about your day", slug: "little-tell-me-about-your-day" }] },
      { area: "Early maths", title: "Counting, colours and shapes", summary: "Children count small groups, match colours and notice shapes in everyday play.", activities: [{ title: "Teddy's tea party", slug: "little-teddys-tea-party" }, { title: "Rainbow hunt", slug: "little-rainbow-hunt" }, { title: "Box castle", slug: "little-box-castle" }, { title: "Conker counting", slug: "little-conker-counting" }, { title: "Big and little", slug: "little-big-and-little" }, { title: "Shape spotters", slug: "little-shape-spotters" }] },
      { area: "Letters and sounds", title: "Listening ears", summary: "Children tune in to everyday sounds, rhythm and rhyme, the first step towards phonics.", activities: [{ title: "The mystery bag", slug: "little-mystery-bag" }, { title: "Who's that sound?", slug: "little-whos-that-sound" }, { title: "Sound walk", slug: "little-sound-walk" }, { title: "Clap your name", slug: "little-clap-your-name" }, { title: "Drum it loud, drum it soft", slug: "little-drum-it-loud-drum-it-soft" }, { title: "Rhyme time pairs", slug: "little-rhyme-time-pairs" }] },
      { area: "Moving", title: "Moving like animals", summary: "Children practise running, jumping, crawling and balancing through playful animal moves.", activities: [{ title: "Animal moves", slug: "little-animal-moves" }, { title: "Rocket blast off", slug: "little-rocket-blast-off" }, { title: "Leaf pile jumps", slug: "little-leaf-pile-jumps" }, { title: "Beanbag balance", slug: "little-beanbag-balance" }, { title: "Crawl through the tunnel", slug: "little-crawl-through-the-tunnel" }, { title: "Stop and go", slug: "little-stop-and-go" }] },
      { area: "Creating", title: "Autumn art", summary: "Children explore paint, natural materials and simple sounds to make their own creations.", activities: [{ title: "Water painting", slug: "little-water-painting" }, { title: "Leaf faces", slug: "little-leaf-faces" }, { title: "Conker rolling paint", slug: "little-conker-rolling-paint" }, { title: "Bark rubbings", slug: "little-bark-rubbings" }, { title: "Shakers and rattles", slug: "little-shakers-and-rattles" }, { title: "Playdough hedgehogs", slug: "little-playdough-hedgehogs" }] },
      { area: "The world around us", title: "Little explorers", summary: "Children look closely at creatures, light and the changing season around their home.", activities: [{ title: "Minibeast hunt", slug: "little-minibeast-hunt" }, { title: "Shadow play", slug: "little-shadow-play" }, { title: "Autumn treasure basket", slug: "little-autumn-treasure-basket" }, { title: "Where do squirrels go?", slug: "little-where-do-squirrels-go" }, { title: "Floating or sinking", slug: "little-floating-or-sinking" }, { title: "My family photos", slug: "little-my-family-photos" }] },
      { area: "Feelings and friends", title: "All about me", summary: "Children talk about themselves and their feelings and practise taking turns and saying hello.", activities: [{ title: "Happy and sad faces", slug: "little-happy-and-sad-faces" }, { title: "This is me", slug: "little-this-is-me" }, { title: "Taking turns", slug: "little-taking-turns" }, { title: "Helping hands", slug: "little-helping-hands" }, { title: "Saying hello", slug: "little-saying-hello" }, { title: "My calm corner", slug: "little-my-calm-corner" }] },
    ],
    rhymes: [{ title: "Five little stars", slug: "little-five-little-stars" }, { title: "The bumpity bus", slug: "little-bumpity-bus" }, { title: "Wiggle your toes", slug: "little-wiggle-your-toes" }, { title: "Knock knock, who's there?", slug: "little-knock-knock" }],
  },
  winter: {
    topics: [
      { area: "Talk", title: "Cosy stories", summary: "Children retell familiar tales, predict what happens next and share their own news.", activities: [{ title: "Three bears' breakfast", slug: "little-three-bears-breakfast" }, { title: "What happens next?", slug: "little-what-happens-next" }, { title: "Winter word basket", slug: "little-winter-word-basket" }, { title: "Talk about the weather", slug: "little-talk-about-the-weather" }, { title: "Little red hen's bread", slug: "little-little-red-hens-bread" }, { title: "Show and tell", slug: "little-show-and-tell" }] },
      { area: "Early maths", title: "Numbers to five", summary: "Children count reliably to five, find one more and match pairs.", activities: [{ title: "Snowball counting", slug: "little-snowball-counting" }, { title: "One more mitten", slug: "little-one-more-mitten" }, { title: "Pairs of socks", slug: "little-pairs-of-socks" }, { title: "Gingerbread buttons", slug: "little-gingerbread-buttons" }, { title: "Count the candles", slug: "little-count-the-candles" }, { title: "Hide and count", slug: "little-hide-and-count" }] },
      { area: "Letters and sounds", title: "Sounds all around", summary: "Children hear the first sounds in words and enjoy early mark making.", activities: [{ title: "I spy a sound", slug: "little-i-spy-a-sound" }, { title: "Snap the sound", slug: "little-snap-the-sound" }, { title: "Silly soup", slug: "little-silly-soup" }, { title: "Animal noises game", slug: "little-animal-noises-game" }, { title: "Name in the snow", slug: "little-name-in-the-snow" }, { title: "Mark making in salt", slug: "little-mark-making-in-salt" }] },
      { area: "Moving", title: "Winter warm-ups", summary: "Children keep active indoors with dancing, throwing, catching and stopping on cue.", activities: [{ title: "Snowflake dance", slug: "little-snowflake-dance" }, { title: "Penguin waddle", slug: "little-penguin-waddle" }, { title: "Indoor obstacle course", slug: "little-indoor-obstacle-course" }, { title: "Throw and catch socks", slug: "little-throw-and-catch-socks" }, { title: "Freeze!", slug: "little-freeze" }, { title: "Wobbly jelly stretch", slug: "little-wobbly-jelly-stretch" }] },
      { area: "Creating", title: "Lights and sparkle", summary: "Children make seasonal decorations, prints and music using simple materials.", activities: [{ title: "Salt dough decorations", slug: "little-salt-dough-decorations" }, { title: "Paper lanterns", slug: "little-paper-lanterns" }, { title: "Snowflake printing", slug: "little-snowflake-printing" }, { title: "Calm-down glitter jar", slug: "little-calm-down-glitter-jar" }, { title: "Pots and pans band", slug: "little-pots-and-pans-band" }, { title: "Torchlight dancing", slug: "little-torchlight-dancing" }] },
      { area: "The world around us", title: "Cold, ice and light", summary: "Children explore melting, freezing and how people celebrate light in winter.", activities: [{ title: "Melting ice", slug: "little-melting-ice" }, { title: "Ice treasures", slug: "little-ice-treasures" }, { title: "Who lives where it's cold?", slug: "little-who-lives-where-its-cold" }, { title: "Festivals of light", slug: "little-festivals-of-light" }, { title: "Winter bird watch", slug: "little-winter-bird-watch" }, { title: "Hot and cold", slug: "little-hot-and-cold" }] },
      { area: "Feelings and friends", title: "Being kind", summary: "Children learn to share, wait, say sorry and notice how others feel.", activities: [{ title: "Kindness jar", slug: "little-kindness-jar" }, { title: "Sharing toys", slug: "little-sharing-toys" }, { title: "Saying sorry", slug: "little-saying-sorry" }, { title: "How does teddy feel?", slug: "little-how-does-teddy-feel" }, { title: "A gift for a friend", slug: "little-a-gift-for-a-friend" }, { title: "Waiting my turn", slug: "little-waiting-my-turn" }] },
    ],
    rhymes: [{ title: "Snowflake, snowflake, falling down", slug: "little-snowflake-snowflake-falling-down" }, { title: "Ten little candles", slug: "little-ten-little-candles" }, { title: "Mitten counting song", slug: "little-mitten-counting-song" }, { title: "Cosy cocoa clap", slug: "little-cosy-cocoa-clap" }],
  },
  spring: {
    topics: [
      { area: "Talk", title: "Growing words", summary: "Children learn new words, follow simple instructions and ask questions.", activities: [{ title: "Puppet questions", slug: "little-puppet-questions" }, { title: "Tell a seed story", slug: "little-tell-a-seed-story" }, { title: "Shopping list talk", slug: "little-shopping-list-talk" }, { title: "Big words, little words", slug: "little-big-words-little-words" }, { title: "Listen and do", slug: "little-listen-and-do" }, { title: "Retell with spoons", slug: "little-retell-with-spoons" }] },
      { area: "Early maths", title: "Patterns and sizes", summary: "Children make repeating patterns and compare size, length and capacity.", activities: [{ title: "Bead patterns", slug: "little-bead-patterns" }, { title: "Tallest tower", slug: "little-tallest-tower" }, { title: "Measuring with hands", slug: "little-measuring-with-hands" }, { title: "Full or empty", slug: "little-full-or-empty" }, { title: "Egg box counting", slug: "little-egg-box-counting" }, { title: "Shape pictures", slug: "little-shape-pictures" }] },
      { area: "Letters and sounds", title: "First sounds", summary: "Children link some letters to their sounds and blend simple sounds by ear.", activities: [{ title: "Sound of the week", slug: "little-sound-of-the-week" }, { title: "Sound treasure basket", slug: "little-sound-treasure-basket" }, { title: "Robot talk", slug: "little-robot-talk" }, { title: "Fishing for letters", slug: "little-fishing-for-letters" }, { title: "Finger tracing in sand", slug: "little-finger-tracing-in-sand" }, { title: "Mud pie mark making", slug: "little-mud-pie-mark-making" }] },
      { area: "Moving", title: "Spring into action", summary: "Children hop, balance, roll and kick, building strength and coordination.", activities: [{ title: "Hopping like bunnies", slug: "little-hopping-like-bunnies" }, { title: "Balance beam walk", slug: "little-balance-beam-walk" }, { title: "Rolling balls", slug: "little-rolling-balls" }, { title: "Puddle jumps", slug: "little-puddle-jumps" }, { title: "Scarf dancing", slug: "little-scarf-dancing" }, { title: "Kick the ball", slug: "little-kick-the-ball" }] },
      { area: "Creating", title: "Colour and paint", summary: "Children mix colours and try printing, collage and modelling.", activities: [{ title: "Colour mixing", slug: "little-colour-mixing" }, { title: "Flower printing", slug: "little-flower-printing" }, { title: "Blow painting", slug: "little-blow-painting" }, { title: "Collage butterflies", slug: "little-collage-butterflies" }, { title: "Clay nests", slug: "little-clay-nests" }, { title: "Rain music", slug: "little-rain-music" }] },
      { area: "The world around us", title: "Growing things", summary: "Children plant seeds, watch them grow and notice spring animals and weather.", activities: [{ title: "Plant a bean", slug: "little-plant-a-bean" }, { title: "Watch it grow", slug: "little-watch-it-grow" }, { title: "Worm hunt", slug: "little-worm-hunt" }, { title: "Spring walk", slug: "little-spring-walk" }, { title: "Baby animals", slug: "little-baby-animals" }, { title: "Weather watching", slug: "little-weather-watching" }] },
      { area: "Feelings and friends", title: "Me and my friends", summary: "Children name feelings, play together and learn simple ways to calm down.", activities: [{ title: "Feelings in the mirror", slug: "little-feelings-in-the-mirror" }, { title: "Being a good friend", slug: "little-being-a-good-friend" }, { title: "Play together game", slug: "little-play-together-game" }, { title: "Calm breathing", slug: "little-calm-breathing" }, { title: "I can do it!", slug: "little-i-can-do-it" }, { title: "Washing my hands", slug: "little-washing-my-hands" }] },
    ],
    rhymes: [{ title: "Little seed, little seed", slug: "little-little-seed-little-seed" }, { title: "Splish splash puddles", slug: "little-splish-splash-puddles" }, { title: "Hop, little bunny", slug: "little-hop-little-bunny" }, { title: "Busy bees buzzing", slug: "little-busy-bees-buzzing" }],
  },
  summer: {
    topics: [
      { area: "Talk", title: "Holiday stories", summary: "Children describe places, share memories and enjoy jokes and chatter.", activities: [{ title: "Pack a suitcase", slug: "little-pack-a-suitcase" }, { title: "Beach talk", slug: "little-beach-talk" }, { title: "Postcard to Granny", slug: "little-postcard-to-granny" }, { title: "Picnic chatter", slug: "little-picnic-chatter" }, { title: "Tell me a joke", slug: "little-tell-me-a-joke" }, { title: "What did you see?", slug: "little-what-did-you-see" }] },
      { area: "Early maths", title: "Counting at the seaside", summary: "Children count to ten, sort objects and compare heavy and light.", activities: [{ title: "Shell sorting", slug: "little-shell-sorting" }, { title: "Sandcastle sizes", slug: "little-sandcastle-sizes" }, { title: "Ice-cream shop", slug: "little-ice-cream-shop" }, { title: "Ten little fish", slug: "little-ten-little-fish" }, { title: "Heavy and light", slug: "little-heavy-and-light" }, { title: "Number hunt in the garden", slug: "little-number-hunt-in-the-garden" }] },
      { area: "Letters and sounds", title: "Ready for reading", summary: "Children spot letters, sounds in their name and rhymes, getting ready for school.", activities: [{ title: "Story pointing", slug: "little-story-pointing" }, { title: "Letter hunt", slug: "little-letter-hunt" }, { title: "Sounds in my name", slug: "little-sounds-in-my-name" }, { title: "Rhyme bingo", slug: "little-rhyme-bingo" }, { title: "Shaving foam letters", slug: "little-shaving-foam-letters" }, { title: "Listening walk in the park", slug: "little-listening-walk-in-the-park" }] },
      { area: "Moving", title: "Sports day fun", summary: "Children run, aim, throw and play simple team games outdoors.", activities: [{ title: "Egg and spoon race", slug: "little-egg-and-spoon-race" }, { title: "Beanbag throw", slug: "little-beanbag-throw" }, { title: "Running races", slug: "little-running-races" }, { title: "Hoop jumping", slug: "little-hoop-jumping" }, { title: "Skittles", slug: "little-skittles" }, { title: "Parachute play", slug: "little-parachute-play" }] },
      { area: "Creating", title: "Summer making", summary: "Children make pictures, models and music with summer materials.", activities: [{ title: "Shell pictures", slug: "little-shell-pictures" }, { title: "Chalk murals", slug: "little-chalk-murals" }, { title: "Ice painting", slug: "little-ice-painting" }, { title: "Paper plate fish", slug: "little-paper-plate-fish" }, { title: "Junk model boats", slug: "little-junk-model-boats" }, { title: "Make a band", slug: "little-make-a-band" }] },
      { area: "The world around us", title: "Sun, sea and sand", summary: "Children explore floating, sand, sunshine and day and night.", activities: [{ title: "Rock pool pictures", slug: "little-rock-pool-pictures" }, { title: "Boats that float", slug: "little-boats-that-float" }, { title: "Sun safety", slug: "little-sun-safety" }, { title: "Wet sand, dry sand", slug: "little-wet-sand-dry-sand" }, { title: "Day and night", slug: "little-day-and-night" }, { title: "Where in the world?", slug: "little-where-in-the-world" }] },
      { area: "Feelings and friends", title: "Growing up", summary: "Children celebrate what they can do, manage changes and get ready for school.", activities: [{ title: "Things I can do now", slug: "little-things-i-can-do-now" }, { title: "How I have changed", slug: "little-how-i-have-changed" }, { title: "Getting dressed myself", slug: "little-getting-dressed-myself" }, { title: "Staying safe", slug: "little-staying-safe" }, { title: "Saying goodbye", slug: "little-saying-goodbye" }, { title: "Ready for school", slug: "little-ready-for-school" }] },
    ],
    rhymes: [{ title: "Sandy toes song", slug: "little-sandy-toes-song" }, { title: "Row to the island", slug: "little-row-to-the-island" }, { title: "Sunshine wake-up", slug: "little-sunshine-wake-up" }, { title: "Five little fishes splashing", slug: "little-five-little-fishes-splashing" }],
  },
};

/** More for each term, beside the areas: P.E., outdoors, life skills, cooking and crafts, three of each. */
export type LittleExtra = { kind: string; emoji: string; activities: LittleActivity[] };

export const LITTLE_EXTRAS: Record<TermSlug, LittleExtra[]> = {
  autumn: [
    { kind: "P.E.", emoji: "🤸", activities: [{ title: "Leaf catching", slug: "little-leaf-catching" }, { title: "Follow the leader walk", slug: "little-follow-the-leader-walk" }, { title: "Ball rolling to a friend", slug: "little-ball-rolling-to-a-friend" }] },
    { kind: "Outdoors", emoji: "🌳", activities: [{ title: "Conker and acorn collecting", slug: "little-conker-and-acorn-collecting" }, { title: "Puddle walk in wellies", slug: "little-puddle-walk-in-wellies" }, { title: "Autumn colour hunt", slug: "little-autumn-colour-hunt" }] },
    { kind: "Life skills", emoji: "🧺", activities: [{ title: "Putting on my coat", slug: "little-putting-on-my-coat" }, { title: "Tidy-up time song", slug: "little-tidy-up-time-song" }, { title: "Laying the table", slug: "little-laying-the-table" }] },
    { kind: "Cooking", emoji: "🍳", activities: [{ title: "Apple crumble stirring", slug: "little-apple-crumble-stirring" }, { title: "Pumpkin soup helper", slug: "little-pumpkin-soup-helper" }, { title: "Spread your own toast", slug: "little-spread-your-own-toast" }] },
    { kind: "Crafts", emoji: "✂️", activities: [{ title: "Leaf crowns", slug: "little-leaf-crowns" }, { title: "Pine cone animals", slug: "little-pine-cone-animals" }, { title: "Paper plate owls", slug: "little-paper-plate-owls" }] },
  ],
  winter: [
    { kind: "P.E.", emoji: "🤸", activities: [{ title: "Snowball (sock) throwing", slug: "little-snowball-sock-throwing" }, { title: "Tightrope walking", slug: "little-tightrope-walking" }, { title: "Teddy yoga", slug: "little-teddy-yoga" }] },
    { kind: "Outdoors", emoji: "🌳", activities: [{ title: "Frost and ice hunt", slug: "little-frost-and-ice-hunt" }, { title: "Animal tracks", slug: "little-animal-tracks" }, { title: "Torch walk at dusk", slug: "little-torch-walk-at-dusk" }] },
    { kind: "Life skills", emoji: "🧺", activities: [{ title: "Zipping and buttons", slug: "little-zipping-and-buttons" }, { title: "Wrapping a present", slug: "little-wrapping-a-present" }, { title: "Putting on socks and shoes", slug: "little-putting-on-socks-and-shoes" }] },
    { kind: "Cooking", emoji: "🍳", activities: [{ title: "Decorating biscuits", slug: "little-decorating-biscuits" }, { title: "Porridge toppings", slug: "little-porridge-toppings" }, { title: "Fruit kebabs", slug: "little-fruit-kebabs" }] },
    { kind: "Crafts", emoji: "✂️", activities: [{ title: "Handprint snowmen", slug: "little-handprint-snowmen" }, { title: "Paper chains", slug: "little-paper-chains" }, { title: "Pine cone bird feeders", slug: "little-pine-cone-bird-feeders" }] },
  ],
  spring: [
    { kind: "P.E.", emoji: "🤸", activities: [{ title: "Bunny hop races", slug: "little-bunny-hop-races" }, { title: "Bubble chasing", slug: "little-bubble-chasing" }, { title: "Crawling tunnels", slug: "little-crawling-tunnels" }] },
    { kind: "Outdoors", emoji: "🌳", activities: [{ title: "Planting a pot", slug: "little-planting-a-pot" }, { title: "Puddle jumping", slug: "little-puddle-jumping" }, { title: "Spot the first flowers", slug: "little-spot-the-first-flowers" }] },
    { kind: "Life skills", emoji: "🧺", activities: [{ title: "Watering plants", slug: "little-watering-plants" }, { title: "Brushing my teeth", slug: "little-brushing-my-teeth" }, { title: "Helping with the laundry", slug: "little-helping-with-the-laundry" }] },
    { kind: "Cooking", emoji: "🍳", activities: [{ title: "Cress egg heads", slug: "little-cress-egg-heads" }, { title: "Easy pancakes", slug: "little-easy-pancakes" }, { title: "Rainbow fruit salad", slug: "little-rainbow-fruit-salad" }] },
    { kind: "Crafts", emoji: "✂️", activities: [{ title: "Egg box caterpillars", slug: "little-egg-box-caterpillars" }, { title: "Tissue paper flowers", slug: "little-tissue-paper-flowers" }, { title: "Handprint chicks", slug: "little-handprint-chicks" }] },
  ],
  summer: [
    { kind: "P.E.", emoji: "🤸", activities: [{ title: "Mini sports day", slug: "little-mini-sports-day" }, { title: "Water balloon catch", slug: "little-water-balloon-catch" }, { title: "Hopscotch for beginners", slug: "little-hopscotch-for-beginners" }] },
    { kind: "Outdoors", emoji: "🌳", activities: [{ title: "Paddling pool play", slug: "little-paddling-pool-play" }, { title: "Picnic in the park", slug: "little-picnic-in-the-park" }, { title: "Sand pit digging", slug: "little-sand-pit-digging" }] },
    { kind: "Life skills", emoji: "🧺", activities: [{ title: "Putting on sun cream", slug: "little-putting-on-sun-cream" }, { title: "Packing my bag", slug: "little-packing-my-bag" }, { title: "Pouring my own drink", slug: "little-pouring-my-own-drink" }] },
    { kind: "Cooking", emoji: "🍳", activities: [{ title: "Fruit ice lollies", slug: "little-fruit-ice-lollies" }, { title: "Sandwich making", slug: "little-sandwich-making" }, { title: "Strawberry yoghurt pots", slug: "little-strawberry-yoghurt-pots" }] },
    { kind: "Crafts", emoji: "✂️", activities: [{ title: "Shell necklaces", slug: "little-shell-necklaces" }, { title: "Paper boats", slug: "little-paper-boats" }, { title: "Sun catchers", slug: "little-sun-catchers" }] },
  ],
};

/** The activities in each term's plan that are best done outside, for the Outdoors page. */
const OUTDOOR_SLUGS = new Set([
  "little-sound-walk", "little-leaf-pile-jumps", "little-water-painting", "little-leaf-faces", "little-bark-rubbings",
  "little-minibeast-hunt", "little-autumn-treasure-basket",
  "little-name-in-the-snow", "little-ice-treasures", "little-winter-bird-watch",
  "little-mud-pie-mark-making", "little-puddle-jumps", "little-kick-the-ball", "little-worm-hunt", "little-spring-walk",
  "little-weather-watching",
  "little-picnic-chatter", "little-number-hunt-in-the-garden", "little-listening-walk-in-the-park",
  "little-egg-and-spoon-race", "little-running-races", "little-parachute-play", "little-chalk-murals", "little-wet-sand-dry-sand",
]);

/** The Rhymes and songs and Outdoors pages, which sit beside the areas in the menu and look like them. */
export const LITTLE_EXTRA_PAGES = [
  { name: RHYMES, slug: "rhymes-and-songs", emoji: "🎵" },
  { name: "Outdoors", slug: "outdoors", emoji: "🌳" },
];

/** What a Little Roots page (an area, Rhymes and songs, or Outdoors) has for one term. */
export function littleTermSection(pageSlug: string, term: TermSlug): { title: string; summary: string; activities: LittleActivity[] } | null {
  const plan = LITTLE_PLAN[term];
  if (pageSlug === "rhymes-and-songs") {
    return { title: "Rhymes to learn", summary: "Short rhymes and songs to say, sing and act out together.", activities: plan.rhymes };
  }
  if (pageSlug === "outdoors") {
    const outdoorExtras = LITTLE_EXTRAS[term].filter((e) => e.kind === "Outdoors").flatMap((e) => e.activities);
    const activities = [...plan.topics.flatMap((t) => t.activities).filter((a) => OUTDOOR_SLUGS.has(a.slug)), ...outdoorExtras];
    return { title: "Out and about", summary: "Activities from every area that are best in the garden, the park or on a walk.", activities };
  }
  const area = LITTLE_AREA_PAGES.find((a) => a.slug === pageSlug);
  return plan.topics.find((t) => t.area === area?.name) ?? null;
}
