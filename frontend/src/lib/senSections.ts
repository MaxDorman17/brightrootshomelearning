/**
 * The SEN Support sections, shown as the SEN Support menu and as tiles on /make/sen. Each one has its own page
 * at /make/sen/<slug> listing the tools from lib/sen.ts that belong to it (a tool can sit in more than one).
 * A section with no tools yet says new things are on the way. To fill one, add the tool to SEN_TOOLS in
 * lib/sen.ts and its slug to `tools` here. Kept apart from lib/sen.ts so the menu doesn't load all the cards.
 */
export type SenSection = { slug: string; name: string; emoji: string; blurb: string; tools: string[] };

export const SEN_SECTIONS: SenSection[] = [
  { slug: "speech-and-communication", name: "Speech & Communication", emoji: "💬", blurb: "Boards and cards to help your child tell you what they need", tools: ["talk", "choice"] },
  { slug: "calm-corner", name: "Calm Corner Toolkit", emoji: "🧸", blurb: "Things to help settle big feelings and find calm", tools: ["breaks", "feelings"] },
  { slug: "emotions-and-wellbeing", name: "Emotions & Wellbeing", emoji: "😊", blurb: "Naming feelings, and stories for new or worrying things", tools: ["feelings", "stories"] },
  { slug: "sensory-and-motor", name: "Sensory & Motor Skills", emoji: "🤸", blurb: "Sensory play and movement for busy bodies", tools: ["sensory", "breaks"] },
  { slug: "social-and-life-skills", name: "Social & Life Skills", emoji: "🤝", blurb: "Everyday jobs in small steps, and getting on with others", tools: ["steps", "stories"] },
  { slug: "learning-and-visual-supports", name: "Learning & Visual Supports", emoji: "🗓️", blurb: "Visual timetables, Now & Next and learning your way", tools: ["timetable", "now-next", "learning"] },
  { slug: "topic-packs", name: "Topic Packs", emoji: "📚", blurb: "Whole topics written to be easier to take part in", tools: [] },
  { slug: "adapted-cooking", name: "Adapted Cooking & Baking", emoji: "🧁", blurb: "Recipes with picture steps and simpler jobs", tools: [] },
  { slug: "adapted-arts-and-crafts", name: "Adapted Arts & Crafts", emoji: "🎨", blurb: "Makes with fewer steps and easier ways to hold and cut", tools: [] },
];

export const senSection = (slug: string) => SEN_SECTIONS.find((s) => s.slug === slug);
