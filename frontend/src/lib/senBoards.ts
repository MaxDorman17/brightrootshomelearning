/**
 * Max's own picture cards for the SEN boards. Each card image already has its word printed on it, so
 * `label` is only used for alt text, the read-aloud voice and the print title.
 */

export type BoardCard = { slug: string; label: string };

const card = (label: string, slug = label.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-")): BoardCard => ({ slug, label });

export const cardArt = (folder: string, c: BoardCard) => `/sen/${folder}/${c.slug}.webp`;

/** Choice board: things a child can choose to do. */
export const CHOICES: BoardCard[] = [
  card("Reading"),
  card("Drawing"),
  card("Building"),
  card("Play dough"),
  card("Puzzle"),
  card("Music"),
  card("Outside"),
  card("Ball play"),
  card("Teddy play"),
  card("Cooking"),
  card("Sensory play"),
  card("Quiet time"),
];

/** Communication board: needs and feelings a child can point to. */
export const TALK: BoardCard[] = [
  card("Yes"),
  card("No"),
  card("Help"),
  card("Stop"),
  card("Break"),
  card("Finished"),
  card("More"),
  card("Again"),
  card("Drink"),
  card("Food"),
  card("Toilet"),
  card("Quiet"),
  card("I don't understand", "i-dont-understand"),
  card("It hurts"),
  card("Too loud"),
  card("I need space"),
];

/** Learning your way: how a child likes to learn and show what they know. */
export const LEARNING: BoardCard[] = [
  card("Point"),
  card("Speak"),
  card("Type"),
  card("Draw"),
  card("Use pictures"),
  card("Use objects"),
  card("Listen"),
  card("Watch an example"),
  card("One at a time"),
  card("Fewer questions"),
  card("Bigger print"),
  card("Work together"),
];

export type Routine = { slug: string; title: string; steps: BoardCard[] };

/** Step by step: everyday tasks broken into picture steps, in order. Images live in /sen/steps/<slug>/. */
export const ROUTINES: Routine[] = [
  {
    slug: "getting-dressed",
    title: "Getting dressed",
    steps: [card("Choose clothes"), card("Underwear"), card("Top"), card("Trousers"), card("Socks"), card("Shoes")],
  },
  {
    slug: "brushing-teeth",
    title: "Brushing teeth",
    steps: [card("Get toothbrush"), card("Add toothpaste"), card("Brush teeth"), card("Spit"), card("Rinse toothbrush"), card("Put away")],
  },
  {
    slug: "going-out",
    title: "Going out",
    steps: [card("Check what you need"), card("Put on shoes"), card("Get coat"), card("Collect bag")],
  },
  {
    slug: "packing-a-bag",
    title: "Packing a bag",
    steps: [card("Check picture list"), card("Collect items"), card("Put them in"), card("Close bag")],
  },
  {
    slug: "making-a-snack",
    title: "Making a snack",
    steps: [card("Choose snack"), card("Get plate"), card("Prepare"), card("Serve"), card("Tidy up")],
  },
  {
    slug: "cooking",
    title: "Cooking",
    steps: [
      card("Wash hands"),
      card("Get ingredients"),
      card("Get equipment"),
      card("Wash food"),
      card("Measure"),
      card("Cut"),
      card("Mix"),
      card("Cook with an adult"),
      card("Let it cool"),
      card("Serve"),
      card("Wash up"),
    ],
  },
  {
    slug: "activity-cards",
    title: "Drawing and making",
    steps: [card("Get paper"), card("Get pencils"), card("Look at the example"), card("Draw"), card("Colour"), card("Cut"), card("Glue"), card("Tidy up")],
  },
  {
    slug: "gardening",
    title: "Planting a seed",
    steps: [card("Get pot"), card("Add soil"), card("Plant seed"), card("Cover"), card("Water")],
  },
  {
    slug: "laundry",
    title: "Laundry",
    steps: [card("Collect clothes"), card("Sort clothes"), card("Load machine"), card("Adult starts machine"), card("Put clothes away")],
  },
  {
    slug: "playing-a-game",
    title: "Playing a game",
    steps: [card("Choose game"), card("Set up"), card("Take turns"), card("Put pieces away")],
  },
  {
    slug: "bedtime",
    title: "Bedtime",
    steps: [card("Put on pyjamas"), card("Brush teeth"), card("Choose a story"), card("Get into bed")],
  },
];

/** Cards that fit any routine, shown under the steps. Images live in /sen/steps/generic-cards/. */
export const HELPER_CARDS: BoardCard[] = [card("Ask for help"), card("Take a break"), card("Finished")];
