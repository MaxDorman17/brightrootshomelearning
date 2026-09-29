/**
 * Emojis that have a Bright Roots illustration. Anywhere the site shows one of these emojis through <Emoji>
 * or <EmojiText>, the illustration is shown instead. Add a line here when a new illustration arrives.
 */
const ILLUSTRATIONS: Record<string, string> = {
  "🎁": "gift",
  "🥽": "vr",
  "📺": "tv",
  "🍦": "ice-cream",
  "🍕": "pizza",
  "🍿": "popcorn",
  "🧁": "cake",
  "🏞": "park",
  "🚲": "bike",
  "🌙": "bedtime",
  "🍽": "dinner",
  "🏆": "trophy",
  "🪙": "pocket-money",
  "💷": "pocket-money",
  "🎉": "party",
  "📚": "books",
  "🎯": "target",
  "⭐": "star",
  "🚀": "rocket",
  "🎨": "paint",
  "🧠": "brain",
  "📸": "camera",
  "📝": "notepad",
  "🔥": "fire",
  "🏅": "medal",
  "🎮": "games",
  "🕹": "games",
  "🌟": "star",
  // Page banner pictures that also suit these emojis
  "🛒": "/home/icons/shopping.png",
  "🏠": "/home/icons/account.png",
  "📖": "/home/icons/reading.png",
  "🌈": "/home/icons/lessons.png",
  "📋": "/home/icons/extra-work.png",
  "📂": "/home/icons/resources.png",
  "🗓": "/home/plan.png",
  "🔤": "/home/icons/spellings.png",
  "🌍": "/home/icons/languages.png",
  "💻": "/home/icons/coding.png",
  "🔔": "/home/icons/reminders.png",
  "⏱": "/home/icons/timer.png",
  "✉": "/home/icons/newsletter.png",
};

/** Emoji variation selectors (the invisible "show as emoji" marks) don't change which picture we use. */
const clean = (emoji: string) => emoji.replace(/️/g, "").trim();

export function illustrationFor(emoji: string | null | undefined): string | null {
  if (!emoji) return null;
  const name = ILLUSTRATIONS[clean(emoji)];
  if (!name) return null;
  return name.startsWith("/") ? name : `/illustrations/${name}.png`;
}

/** Splits text into plain parts and emojis that have an illustration. */
export function splitIllustrated(text: string): (string | { emoji: string; src: string })[] {
  const keys = Object.keys(ILLUSTRATIONS);
  const pattern = new RegExp(`(${keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\uFE0F?`, "gu");
  const out: (string | { emoji: string; src: string })[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push({ emoji: m[0], src: illustrationFor(m[0])! });
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
