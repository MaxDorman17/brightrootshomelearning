import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";
import { SUPPORT_EMAIL } from "@/lib/site";
import Emoji from "@/components/Emoji";

export const metadata: Metadata = {
  title: "Your privacy: a guide for children",
  description: "A simple guide for children about what Bright Roots knows about them and how it keeps it safe.",
};

const cards = [
  {
    emoji: "👋",
    title: "Who we are",
    text: "Bright Roots is a website that helps your family plan and keep track of your learning at home. Your grown-up set up your account for you.",
  },
  {
    emoji: "📝",
    title: "What we know about you",
    text: "Your name or nickname, your password (kept secret, even from us), your picture and colours, and your learning: lessons, reading, spellings, scores, stars, notes and anything you upload. If your grown-up adds your email address, we know that too.",
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

export default function ChildPrivacyPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">For children</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Your privacy on Bright Roots</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6E5A46]">
          This page tells you what Bright Roots knows about you, and how we keep it safe. If you&apos;re little, ask a
          grown-up to read it with you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
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

        <div className="mt-10 rounded-3xl bg-[#E3E7D9] p-6 text-[#4A3B2C]">
          <p className="font-bold">For grown-ups</p>
          <p className="mt-1 text-sm leading-6">
            This is a simplified version of our <Link href="/privacy" className="font-semibold underline">privacy policy</Link>.
            You can download or delete your family&apos;s information from the Account page, or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
