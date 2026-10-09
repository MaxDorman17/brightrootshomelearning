/**
 * The Sensory Activities Pack. Each activity's picture lives at public/sensory/<slug>.png; until it
 * arrives, list the activity without `art` and its emoji is shown instead. To add a picture, drop
 * the file in and set `art: true`.
 */

export const SENSES = ["Touch", "Sound", "Sight", "Smell", "Movement", "Calming"] as const;
export type Sense = (typeof SENSES)[number];

export const SENSE_HELP: Record<Sense, string> = {
  Touch: "for hands that need something to do",
  Sound: "listening, shaking and tapping",
  Sight: "watching, shining and sorting",
  Smell: "gentle smells to explore",
  Movement: "heavy work and big movements that help the body settle",
  Calming: "slow, cosy and quiet",
};

export type SensoryActivity = {
  slug: string;
  title: string;
  sense: Sense;
  emoji: string;
  art?: boolean;
  need: string;
  how: string;
  windDown: string;
  safety: string;
};

export const sensoryArt = (a: SensoryActivity) => (a.art ? `/sensory/${a.slug}.png` : null);

export const SENSORY: SensoryActivity[] = [
  {
    slug: "sensory-tray",
    title: "Sensory tray",
    sense: "Touch",
    emoji: "🍚",
    art: true,
    need: "A tray, dry rice, oats or pasta, scoops and small toys.",
    how: "Hide the toys in the tray. Scoop, pour and dig to find them.",
    windDown: "Count the toys back into a pot, one by one.",
    safety: "Stay close with small children, as dry food and small toys can be a choking risk.",
  },
  {
    slug: "play-dough",
    title: "Play dough",
    sense: "Touch",
    emoji: "🫓",
    art: true,
    need: "Play dough (shop-bought or homemade), a rolling pin and cutters.",
    how: "Squash, roll, pinch and cut. Try making a snake, a ball or a pancake.",
    windDown: "Roll it into one big ball and squeeze it slowly five times.",
    safety: "Homemade dough is very salty, so it isn't for eating. Check for wheat allergies.",
  },
  {
    slug: "texture-hunt",
    title: "Texture hunt",
    sense: "Touch",
    emoji: "🪶",
    art: true,
    need: "A bag and things that feel different: soft, rough, bumpy and smooth.",
    how: "Reach into the bag without looking. Feel one thing and guess what it is.",
    windDown: "Sort them into a soft pile and a rough pile.",
    safety: "Check nothing is sharp, and watch small parts with little ones.",
  },
  {
    slug: "shaving-foam",
    title: "Foam drawing",
    sense: "Touch",
    emoji: "☁️",
    art: true,
    need: "A tray and unscented shaving foam, or whipped cream for little ones.",
    how: "Spread it out and draw shapes, letters or faces with a finger.",
    windDown: "Smooth it flat and wipe hands on a warm cloth.",
    safety: "Keep foam away from eyes and mouths. Use whipped cream if your child puts things in their mouth.",
  },
  {
    slug: "water-play",
    title: "Water play",
    sense: "Touch",
    emoji: "🫗",
    art: true,
    need: "A bowl or tray of water, cups, jugs, a sponge and a towel.",
    how: "Pour, fill, squeeze and splash. What floats and what sinks?",
    windDown: "Squeeze the sponge out slowly and dry hands with the towel.",
    safety: "Always stay with a child near water, even a little bowl.",
  },
  {
    slug: "sound-walk",
    title: "Sound walk",
    sense: "Sound",
    emoji: "🐦",
    art: true,
    need: "Nothing, just a walk inside or outside.",
    how: "Walk slowly and stop to listen. Count the different sounds you hear.",
    windDown: "Sit still for a moment and name your favourite sound.",
    safety: "Hold hands near roads.",
  },
  {
    slug: "shaker-bottles",
    title: "Shaker bottles",
    sense: "Sound",
    emoji: "🫙",
    art: true,
    need: "Small plastic bottles, and rice, beans or bells to fill them.",
    how: "Shake them loud, then quiet. Can you guess what's inside each one?",
    windDown: "Shake one very slowly, then put it down and listen to the quiet.",
    safety: "Tape the lids on tightly.",
  },
  {
    slug: "quiet-loud",
    title: "Quiet and loud",
    sense: "Sound",
    emoji: "🥁",
    art: true,
    need: "Something to tap, like a pan and a wooden spoon.",
    how: "Tap very loud, then very quiet. Take turns being the leader.",
    windDown: "Finish with the quietest tap you can, then silence.",
    safety: "Stop if the noise becomes too much. Ear defenders are fine to wear.",
  },
  {
    slug: "calm-bottle",
    title: "Calm bottle",
    sense: "Sight",
    emoji: "✨",
    need: "A plastic bottle, water, clear glue and glitter.",
    how: "Shake it, then watch the glitter swirl and slowly settle.",
    windDown: "Breathe slowly until all the glitter has landed.",
    safety: "Glue the lid on, and a grown-up makes it.",
  },
  {
    slug: "torch-play",
    title: "Torch play",
    sense: "Sight",
    emoji: "🔦",
    need: "A torch and a dark room or a blanket den.",
    how: "Shine the torch on the wall. Follow the light, or make shadow animals with your hands.",
    windDown: "Switch the torch off and count slowly to ten in the dark.",
    safety: "Don't shine the torch into anyone's eyes.",
  },
  {
    slug: "colour-sort",
    title: "Colour sort",
    sense: "Sight",
    emoji: "🎨",
    need: "A muffin tin or bowls, and small things in different colours.",
    how: "Sort everything by colour. Find something else in the room that matches.",
    windDown: "Put each colour back, starting with your favourite.",
    safety: "Watch small parts with little ones.",
  },
  {
    slug: "smell-pots",
    title: "Smell pots",
    sense: "Smell",
    emoji: "🍋",
    need: "Small pots with lids, and things to smell like lemon, cinnamon, mint and orange peel.",
    how: "Open one at a time, sniff and guess. Which do you like best?",
    windDown: "Close your eyes and take one slow sniff of your favourite.",
    safety: "No strong oils, and stop if a smell feels too much.",
  },
  {
    slug: "herb-garden",
    title: "Herb garden",
    sense: "Smell",
    emoji: "🌿",
    need: "Fresh herbs, like mint, rosemary, lavender or basil.",
    how: "Rub a leaf gently and smell your fingers. Does it smell sweet, fresh or strong?",
    windDown: "Pick one leaf to keep in your pocket.",
    safety: "Only use herbs you know are safe.",
  },
  {
    slug: "crash-cushions",
    title: "Crash cushions",
    sense: "Movement",
    emoji: "🛋️",
    need: "A pile of cushions or a mattress on the floor.",
    how: "Jump or tumble onto the cushions. Then build the pile up again.",
    windDown: "Lie on the cushions and take three big breaths.",
    safety: "Clear the space, and one child at a time.",
  },
  {
    slug: "wheelbarrow-walk",
    title: "Wheelbarrow walk",
    sense: "Movement",
    emoji: "🛞",
    need: "A grown-up and a soft floor or grass.",
    how: "Walk on your hands while a grown-up holds your legs. Try five steps.",
    windDown: "Lie on your back like a starfish.",
    safety: "Hold near the knees for smaller children, and go slowly.",
  },
  {
    slug: "rocking-boat",
    title: "Rocking boat",
    sense: "Movement",
    emoji: "🚣",
    need: "A grown-up to hold hands with.",
    how: 'Sit facing each other, hold hands and rock forwards and back. Sing "Row, row, row your boat".',
    windDown: "Rock slower and slower until you stop.",
    safety: "Go at the child's pace.",
  },
  {
    slug: "weighted-lap",
    title: "Heavy lap",
    sense: "Calming",
    emoji: "🧸",
    need: "A heavy cushion, a beanbag or a folded blanket.",
    how: "Rest it on your lap or shoulders while you read or listen to a story.",
    windDown: "Take it off slowly and stretch.",
    safety: "Never over the face or head.",
  },
  {
    slug: "cosy-den",
    title: "Cosy den",
    sense: "Calming",
    emoji: "⛺",
    need: "Blankets, chairs, cushions and a torch or soft light.",
    how: "Build a den together. Make it quiet, soft and dim inside.",
    windDown: "Stay inside for a story or some quiet time.",
    safety: "Keep lights cool and battery powered.",
  },
];
