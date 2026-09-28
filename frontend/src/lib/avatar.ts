export type AvatarChoice = { emoji: string; bg: string; frame: string };

// Must match AVATAR_EMOJIS / AVATAR_BACKGROUNDS / AVATAR_FRAMES in backend/routers/profile.py.
export const AVATAR_EMOJIS = [
  "🦊", "🐼", "🦄", "🐸", "🐯", "🐶", "🐱", "🐵", "🦁", "🐨", "🐰", "🐧", "🦉", "🐢", "🐙", "🦖",
  "🐝", "🦋", "🐬", "🦈", "🚀", "⚽", "🎨", "🎸", "🌈", "⭐", "🌻", "🍓", "🤖", "👾", "🧙", "🦸",
  "🧜", "🐲", "🏀", "🎮",
];

export const AVATAR_BACKGROUNDS: Record<string, { label: string; className: string }> = {
  sky: { label: "Sky", className: "bg-sky-200" },
  mint: { label: "Mint", className: "bg-emerald-200" },
  lemon: { label: "Lemon", className: "bg-yellow-200" },
  peach: { label: "Peach", className: "bg-orange-200" },
  rose: { label: "Rose", className: "bg-rose-200" },
  lilac: { label: "Lilac", className: "bg-violet-200" },
  sand: { label: "Sand", className: "bg-amber-100" },
  slate: { label: "Slate", className: "bg-slate-300" },
};

export const AVATAR_FRAMES: Record<string, { label: string; className: string }> = {
  none: { label: "None", className: "" },
  ring: { label: "Ring", className: "ring-4 ring-brand-sage ring-offset-2" },
  star: { label: "Gold", className: "ring-4 ring-amber-400 ring-offset-2" },
  rainbow: { label: "Rainbow", className: "avatar-rainbow" },
};

export const DEFAULT_AVATAR: AvatarChoice = { emoji: "🦊", bg: "sky", frame: "none" };

// Subject colours a child can choose. Must match SUBJECT_COLOURS in backend/routers/profile.py.
export const SUBJECT_COLOUR_OPTIONS: Record<string, { label: string; dot: string; card: string }> = {
  blue: { label: "Blue", dot: "bg-blue-400", card: "bg-blue-50 border-blue-200 text-blue-900" },
  purple: { label: "Purple", dot: "bg-purple-400", card: "bg-purple-50 border-purple-200 text-purple-900" },
  green: { label: "Green", dot: "bg-green-400", card: "bg-green-50 border-green-200 text-green-900" },
  yellow: { label: "Yellow", dot: "bg-yellow-400", card: "bg-yellow-50 border-yellow-200 text-yellow-900" },
  cyan: { label: "Cyan", dot: "bg-cyan-400", card: "bg-cyan-50 border-cyan-200 text-cyan-900" },
  indigo: { label: "Indigo", dot: "bg-indigo-400", card: "bg-indigo-50 border-indigo-200 text-indigo-900" },
  orange: { label: "Orange", dot: "bg-orange-400", card: "bg-orange-50 border-orange-200 text-orange-900" },
  pink: { label: "Pink", dot: "bg-pink-400", card: "bg-pink-50 border-pink-200 text-pink-900" },
  red: { label: "Red", dot: "bg-red-400", card: "bg-red-50 border-red-200 text-red-900" },
  teal: { label: "Teal", dot: "bg-teal-400", card: "bg-teal-50 border-teal-200 text-teal-900" },
  rose: { label: "Rose", dot: "bg-rose-400", card: "bg-rose-50 border-rose-200 text-rose-900" },
  slate: { label: "Grey", dot: "bg-slate-400", card: "bg-slate-50 border-slate-200 text-slate-900" },
};
