import Emoji from "@/components/Emoji";

const cards = [
  {
    emoji: "👋",
    title: "Who we are",
    text: "Bright Roots is a website that helps your family plan and keep track of your learning at home. Your grown-up set up your account for you.",
  },
  {
    emoji: "📝",
    title: "What we know about you",
    text: "Your name or nickname, the login name you type, your password (kept secret, even from us), your picture and colours, and your learning: lessons, reading, spellings, languages, scores, stars, badges, notes from your grown-ups and anything you upload. Your grown-up also chooses which activities you see. If your grown-up adds your email address, we know that too.",
  },
  {
    emoji: "🎯",
    title: "Why we keep it",
    text: "Only so Bright Roots can work for you and your family: showing your lessons, keeping your stars, and helping your grown-up see how you're getting on.",
  },
  {
    emoji: "👀",
    title: "Who can see it",
    text: "You and the grown-ups in your family who look after your account. Your grown-up can see your work, scores and notes, so they can help you. Nobody outside your family can see it.",
  },
  {
    emoji: "🚫",
    title: "What we never do",
    text: "We never sell your information, show you adverts, share it with other children, or use it to try to make you spend money. There's no chat, and nobody outside your family can message you.",
  },
  {
    emoji: "🔒",
    title: "How we keep it safe",
    text: "Bright Roots uses a secure connection, keeps passwords scrambled, and makes sure each family can only see their own things.",
  },
  {
    emoji: "🙋",
    title: "Your choices",
    text: "You can ask to see what we know about you, fix anything that's wrong, or have it deleted. Ask your grown-up to help, or email us yourself.",
  },
  {
    emoji: "💬",
    title: "If something worries you",
    text: "Tell a grown-up you trust. You can also talk to Childline for free, any time, on 0800 1111 or at childline.org.uk.",
  },
];

/** The child-friendly privacy cards, shared by the public page and the page inside the children's area. */
export default function ChildPrivacyCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((c) => (
        <section key={c.title} className="rounded-3xl border border-brand-line bg-[#FFFDF8] p-6">
          <p className="text-4xl" aria-hidden>
            <Emoji e={c.emoji} />
          </p>
          <h2 className="mt-3 text-xl font-black">{c.title}</h2>
          <p className="mt-2 text-base leading-7 text-[#6E5A46]">{c.text}</p>
        </section>
      ))}
    </div>
  );
}
