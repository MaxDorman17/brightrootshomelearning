/**
 * The SEN Support printables. Everything here is our own words and picture cards, so there is
 * nothing to licence. Pictures are emojis for now; when Bright Roots art exists for one, add it to
 * lib/illustrations.ts and it is used everywhere automatically.
 */

export type SenTool = { slug: string; name: string; emoji: string; blurb: string; art?: string };

export const SEN_TOOLS: SenTool[] = [
  { slug: "timetable", name: "Visual timetable", emoji: "🗓️", blurb: "Picture cards for the day, in order" },
  { slug: "now-next", name: "Now & Next", emoji: "➡️", blurb: "Two big cards: this, then that" },
  { slug: "feelings", name: "Feelings cards", emoji: "😊", blurb: "Name a feeling and pick what helps" },
  { slug: "breaks", name: "Movement breaks", emoji: "🤸", blurb: "Sensory and wriggle break cards" },
  { slug: "stories", name: "Picture stories", emoji: "📖", blurb: "Short stories for new or tricky things" },
  { slug: "sensory", name: "Sensory activities", emoji: "🫗", art: "/sensory/sensory-pack.png", blurb: "Touch, sound, sight, smell and movement play" },
];

export type Card = { emoji: string; label: string };

/** The day's activities, for the visual timetable and Now & Next. */
export const ACTIVITIES: Card[] = [
  { emoji: "🌅", label: "Wake up" },
  { emoji: "👕", label: "Get dressed" },
  { emoji: "🪥", label: "Brush teeth" },
  { emoji: "🥣", label: "Breakfast" },
  { emoji: "📚", label: "Reading" },
  { emoji: "✏️", label: "Writing" },
  { emoji: "🔢", label: "Maths" },
  { emoji: "🔬", label: "Science" },
  { emoji: "🎨", label: "Art" },
  { emoji: "🎵", label: "Music" },
  { emoji: "💻", label: "Computer" },
  { emoji: "⚽", label: "P.E." },
  { emoji: "🌳", label: "Outside" },
  { emoji: "🧸", label: "Play time" },
  { emoji: "🍎", label: "Snack" },
  { emoji: "🥪", label: "Lunch" },
  { emoji: "🍝", label: "Dinner" },
  { emoji: "🚗", label: "Car" },
  { emoji: "🛒", label: "Shopping" },
  { emoji: "🏞️", label: "Park" },
  { emoji: "🧑‍🍳", label: "Cooking" },
  { emoji: "🧹", label: "Tidy up" },
  { emoji: "🚽", label: "Toilet" },
  { emoji: "🧼", label: "Wash hands" },
  { emoji: "🛁", label: "Bath" },
  { emoji: "📺", label: "TV" },
  { emoji: "😌", label: "Quiet time" },
  { emoji: "🛏️", label: "Bed" },
];

/** Feelings, from comfortable to big. */
export const FEELINGS: Card[] = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😟", label: "Worried" },
  { emoji: "😨", label: "Scared" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😖", label: "Too much" },
  { emoji: "😕", label: "Confused" },
  { emoji: "🤒", label: "Poorly" },
];

/** "What helps me" choices for the calm-down board. */
export const HELPS: Card[] = [
  { emoji: "🫂", label: "A hug" },
  { emoji: "🌬️", label: "Deep breaths" },
  { emoji: "🎧", label: "Quiet please" },
  { emoji: "🚶", label: "Space" },
  { emoji: "💧", label: "A drink" },
  { emoji: "🧸", label: "Cuddly toy" },
  { emoji: "📖", label: "A story" },
  { emoji: "✋", label: "Stop" },
  { emoji: "🙋", label: "Help please" },
  { emoji: "⏸️", label: "A break" },
];

export type BreakCard = Card & { how: string; kind: "Move" | "Calm" | "Squeeze" };

export const BREAKS: BreakCard[] = [
  { emoji: "🦘", label: "Kangaroo jumps", how: "Jump on the spot 10 times.", kind: "Move" },
  { emoji: "🧱", label: "Wall push", how: "Push the wall hard with both hands. Count to 10.", kind: "Squeeze" },
  { emoji: "🐻", label: "Bear walk", how: "Walk on hands and feet across the room.", kind: "Move" },
  { emoji: "🌬️", label: "Balloon breaths", how: "Breathe in slowly, puff your tummy up like a balloon, then let it go.", kind: "Calm" },
  { emoji: "🤗", label: "Big squeeze", how: "Give yourself a tight hug for 5 seconds.", kind: "Squeeze" },
  { emoji: "🪑", label: "Chair push-ups", how: "Hands on the chair seat, lift your bottom up 5 times.", kind: "Squeeze" },
  { emoji: "🌯", label: "Burrito roll", how: "Roll up tight in a blanket with a grown-up's help.", kind: "Squeeze" },
  { emoji: "💃", label: "Dance break", how: "Dance to one song.", kind: "Move" },
  { emoji: "🌳", label: "Tree pose", how: "Stand on one leg with arms up like branches. Swap legs.", kind: "Calm" },
  { emoji: "🧘", label: "Stretch up", how: "Reach up high, then slowly touch your toes. Do it 5 times.", kind: "Calm" },
  { emoji: "🐢", label: "Turtle time", how: "Curl up small and quiet for a slow count of 20.", kind: "Calm" },
  { emoji: "🏃", label: "Run and back", how: "Run to the end of the garden or hall and back.", kind: "Move" },
  { emoji: "🖐️", label: "Five finger breathing", how: "Trace up and down your fingers, breathing in up and out down.", kind: "Calm" },
  { emoji: "🎒", label: "Heavy carry", how: "Carry a bag of books or the washing basket for a grown-up.", kind: "Squeeze" },
  { emoji: "🫧", label: "Bubbles", how: "Blow bubbles, or pretend to, slowly and gently.", kind: "Calm" },
  { emoji: "🐸", label: "Frog jumps", how: "Squat down low, then jump up high. Do 5.", kind: "Move" },
];

export type Story = { slug: string; title: string; emoji: string; pages: Card[] };

/** Picture stories: short, calm, in the first person, one idea per page. */
export const STORIES: Story[] = [
  {
    slug: "doctor",
    title: "Going to the doctor",
    emoji: "🩺",
    pages: [
      { emoji: "🚗", label: "Today I am going to see the doctor." },
      { emoji: "🪑", label: "We will wait in the waiting room. I can bring a book or a toy." },
      { emoji: "🗣️", label: "When it is my turn, someone will say my name." },
      { emoji: "👩‍⚕️", label: "The doctor will say hello. They help people feel better." },
      { emoji: "👂", label: "The doctor might look in my ears or listen to my chest. It does not hurt." },
      { emoji: "🙋", label: 'If I feel worried, I can hold my grown-up\'s hand or say "stop please".' },
      { emoji: "🏠", label: "When we are finished, we go home. I did a good job." },
    ],
  },
  {
    slug: "haircut",
    title: "Having a haircut",
    emoji: "💇",
    pages: [
      { emoji: "💈", label: "Sometimes my hair gets long and I need a haircut." },
      { emoji: "🪑", label: "I sit in a special chair. It might go up and down." },
      { emoji: "🧥", label: "I might wear a cape so hair does not get on my clothes." },
      { emoji: "✂️", label: "The scissors or clippers might make a noise. Cutting hair does not hurt." },
      { emoji: "🙋", label: "If it feels too much, I can ask for a break." },
      { emoji: "🪞", label: "When it is finished, I can look in the mirror. All done!" },
    ],
  },
  {
    slug: "new-food",
    title: "Trying a new food",
    emoji: "🥦",
    pages: [
      { emoji: "🍽️", label: "Sometimes there is a new food on my plate." },
      { emoji: "👀", label: "First I can look at it. What colour is it?" },
      { emoji: "👃", label: "I can smell it if I want to." },
      { emoji: "👆", label: "I can touch it, or lick it, or take a tiny bite." },
      { emoji: "🙂", label: 'If I don\'t like it, I can say "no thank you" and put it on the side.' },
      { emoji: "⭐", label: "Trying is brave, even if I don't eat it." },
    ],
  },
  {
    slug: "plans-change",
    title: "When plans change",
    emoji: "🔄",
    pages: [
      { emoji: "🗓️", label: "I like to know what is happening today." },
      { emoji: "🌧️", label: "Sometimes plans change. It might rain, or someone might be poorly." },
      { emoji: "😟", label: "When plans change I might feel cross or worried. That is OK." },
      { emoji: "🌬️", label: "I can take three big breaths." },
      { emoji: "🗣️", label: "My grown-up will tell me the new plan." },
      { emoji: "👍", label: "New plans can be OK too." },
    ],
  },
  {
    slug: "loud-places",
    title: "Busy and loud places",
    emoji: "🎧",
    pages: [
      { emoji: "🛒", label: "Some places are busy and loud, like the shops or a party." },
      { emoji: "😖", label: "Lots of noise can make me feel funny inside." },
      { emoji: "🎧", label: "I can wear my ear defenders or headphones." },
      { emoji: "✋", label: "I can tell my grown-up when it is too much." },
      { emoji: "🚪", label: "We can go somewhere quiet for a little while." },
      { emoji: "😌", label: "When I feel calm again, we can carry on or go home." },
    ],
  },
  {
    slug: "taking-turns",
    title: "Taking turns",
    emoji: "🎲",
    pages: [
      { emoji: "🧸", label: "When I play with other people, we take turns." },
      { emoji: "👉", label: "Sometimes it is my turn." },
      { emoji: "⏳", label: "Sometimes I wait for my turn. Waiting can be hard." },
      { emoji: "🔢", label: "I can count or watch while I wait." },
      { emoji: "😊", label: "Then it will be my turn again." },
      { emoji: "🤝", label: "Taking turns makes playing fun for everyone." },
    ],
  },
];
