"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import TopicQuiz from "@/components/TopicQuiz";
import { UNIT_TO_PLAN_KEY, type UnitToPlan } from "@/components/UnitAdder";
import { getRole, isAuthenticated } from "@/lib/auth";
import { kindOf, LEVEL_LABEL, sheetAnswers, sheetPdf, sheetPicture, sheetsIn } from "@/lib/colouring";
import { lessonAnchor, lessonArt, packBySlug, packCover, type TopicLesson, type TopicLink, type TopicPack } from "@/lib/topics";

const h2 = "text-2xl font-extrabold text-brand-charcoal";
const card = "rounded-3xl border border-brand-line bg-white p-5 shadow-sm sm:p-6";
const list = "mt-2 list-disc space-y-1.5 pl-5 leading-7 text-brand-earth";
const small = "text-xs font-extrabold uppercase tracking-[0.16em]";

/** One topic pack: everything a grown-up needs to teach the topic, with the child's quizzes at the end. */
export default function TopicPackPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const pack = packBySlug(slug);
  const [role, setRole] = useState<string | null>(null);
  const [openLessons, setOpenLessons] = useState<Set<number>>(new Set([1]));
  const [openQuiz, setOpenQuiz] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
    // Arriving from a planner lesson (…#lesson-3): open that lesson and scroll to it.
    const n = Number(window.location.hash.match(/^#lesson-(\d+)$/)?.[1]);
    if (n) {
      setOpenLessons(new Set([n]));
      setTimeout(() => document.getElementById(lessonAnchor(n))?.scrollIntoView({ block: "start" }), 50);
    }
  }, [router]);

  if (!pack) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <p className="text-brand-earth">We couldn&apos;t find that topic pack.</p>
          <Link href="/make/topics" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to the topic packs
          </Link>
        </main>
      </div>
    );
  }

  const isChild = role === "child";
  const cover = packCover(pack);
  const printables = pack.colouring ? sheetsIn(pack.colouring) : [];

  // Hands the lessons to the planner's Add a Unit box, each linking back to its part of this page.
  const planLessons = () => {
    const page = `${window.location.origin}/make/topics/${pack.slug}`;
    const unit: UnitToPlan = {
      title: pack.title,
      subject: pack.subject,
      scheme: "Bright Roots topic pack",
      url: page,
      lessons: pack.lessons.map((l, i) => `${pack.short} ${i + 1}: ${l.title} ${page}#${lessonAnchor(i + 1)}`),
    };
    try {
      sessionStorage.setItem(UNIT_TO_PLAN_KEY, JSON.stringify(unit));
    } catch {
      /* the planner simply opens without it filled in */
    }
    router.push("/parent");
  };

  const toggleLesson = (n: number) =>
    setOpenLessons((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const jump = isChild
    ? [["facts", "Key facts"], ["timeline", "Timeline"], ["words", "Words"], ["activities", "Things to do"], ...(printables.length ? [["colouring", "Colouring"]] : []), ["quizzes", "Quizzes"], ["books", "Books"]]
    : [["start", "Before you start"], ["facts", "Key facts"], ["timeline", "Timeline"], ["words", "Words"], ["lessons", "Lessons"], ["activities", "Activities"], ...(printables.length ? [["colouring", "Colouring & word searches"]] : []), ["quizzes", "Quizzes"], ["books", "Books & visits"]];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/make/topics" className="text-sm font-bold text-brand-sage hover:underline">
          ← All topic packs
        </Link>

        <header className="mt-3 overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm sm:flex">
          <div className="flex h-40 w-full shrink-0 items-center justify-center sm:h-auto sm:w-56" style={{ background: `${pack.color}1A` }}>
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <Emoji e={pack.emoji} className="h-24 w-24 text-7xl" />
            )}
          </div>
          <div className="min-w-0 p-5 sm:p-6">
            <p className={small} style={{ color: pack.color }}>
              Topic pack · {pack.subject} · ages {pack.ages}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight text-brand-charcoal sm:text-4xl">{pack.title}</h1>
            <p className="mt-2 text-base text-brand-earth">
              {isChild ? "The facts, the words, things to make, and quizzes to try. Ask a grown-up if you'd like to print anything." : pack.intro}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={`/make/topics/${pack.slug}/print`} className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark">
                🖨️ Print the pack
              </Link>
              {!isChild && role && (
                <button
                  type="button"
                  onClick={planLessons}
                  className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage hover:border-brand-softsage"
                >
                  📅 Put the lessons in my planner
                </button>
              )}
              {!isChild && <span className="text-sm font-bold text-brand-earth/70">{pack.length}</span>}
            </div>
          </div>
        </header>

        <nav aria-label="On this page" className="mt-5 flex flex-wrap gap-2">
          {jump.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full bg-brand-cream px-3.5 py-1.5 text-sm font-bold text-brand-earth hover:bg-brand-tint">
              {label}
            </a>
          ))}
        </nav>

        {!isChild && <Background pack={pack} />}

        <section id="facts" className="mt-10 scroll-mt-24">
          <h2 className={h2}>Key facts</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {pack.facts.map((f) => (
              <li key={f} className="flex gap-3 rounded-2xl border border-brand-line bg-white p-4 leading-6 text-brand-charcoal">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: pack.color }} aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section id="timeline" className="mt-10 scroll-mt-24">
          <h2 className={h2}>Timeline</h2>
          <ol className="mt-4 border-l-4 pl-5" style={{ borderColor: `${pack.color}55` }}>
            {pack.timeline.map((t) => (
              <li key={t.when} className="relative pb-4 last:pb-0">
                <span className="absolute -left-[1.85rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white" style={{ background: pack.color }} aria-hidden />
                <p className="font-extrabold" style={{ color: pack.color }}>
                  {t.when}
                </p>
                <p className="text-brand-charcoal">{t.what}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="words" className="mt-10 scroll-mt-24">
          <h2 className={h2}>Words to know</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {pack.words.map((w) => (
              <div key={w.word} className="rounded-2xl border border-brand-line bg-white p-4">
                <dt className="font-extrabold text-brand-charcoal">{w.word}</dt>
                <dd className="text-sm leading-6 text-brand-earth">{w.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="myths" className="mt-10 scroll-mt-24">
          <h2 className={h2}>True or not?</h2>
          <p className="mt-1 text-sm text-brand-earth/80">Things people often get wrong, and what really happened.</p>
          <ul className="mt-4 space-y-3">
            {pack.myths.map((m) => (
              <li key={m.myth} className="rounded-2xl border border-brand-line bg-white p-4">
                <p className="font-bold text-brand-charcoal">
                  <span className="mr-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold uppercase text-amber-800">Not quite</span>
                  {m.myth}
                </p>
                <p className="mt-1.5 leading-6 text-brand-earth">{m.truth}</p>
              </li>
            ))}
          </ul>
        </section>

        {!isChild && (
          <section id="lessons" className="mt-10 scroll-mt-24">
            <h2 className={h2}>The lessons</h2>
            <p className="mt-1 text-sm text-brand-earth/80">
              Do them in order, one or two a week. Read &ldquo;Tell the story&rdquo; first, then tell it in your own words.
            </p>
            <div className="mt-4 space-y-3">
              {pack.lessons.map((l, i) => (
                <Lesson key={l.title} pack={pack} lesson={l} n={i + 1} open={openLessons.has(i + 1)} onToggle={() => toggleLesson(i + 1)} />
              ))}
            </div>
          </section>
        )}

        <section id="activities" className="mt-10 scroll-mt-24">
          <h2 className={h2}>{isChild ? "Things to do" : "More activities"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {pack.activities.map((a) => (
              <div key={a.title} className="rounded-2xl border border-brand-line bg-white p-4">
                <p className={small} style={{ color: pack.color }}>
                  {a.kind}
                </p>
                <h3 className="mt-0.5 flex items-center gap-2 text-lg font-extrabold text-brand-charcoal">
                  <Emoji e={a.emoji} className="h-6 w-6 text-xl" /> {a.title}
                </h3>
                <p className="mt-1 leading-6 text-brand-earth">{a.text}</p>
                {a.steps && (
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-brand-earth">
                    {a.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </section>

        {printables.length > 0 && (
          <section id="colouring" className="mt-10 scroll-mt-24">
            <h2 className={h2}>Colouring &amp; word searches</h2>
            <p className="mt-1 text-sm text-brand-earth/80">
              {isChild ? "Pick one and ask a grown-up to print it." : "Open a sheet, then print it on A4. Each word search has an answer sheet for you."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {printables.map((s) => {
                const isSearch = kindOf(s) === "word-search";
                return (
                  <div key={s.slug} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
                    <a href={sheetPdf(s)} target="_blank" rel="noopener" className="block">
                      <div className="border-b border-brand-line bg-white p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sheetPicture(s)} alt={`${s.title} ${isSearch ? "word search" : "colouring sheet"}`} loading="lazy" className="aspect-[210/297] w-full object-contain" />
                      </div>
                      <div className="px-3 pt-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">
                          {isSearch ? `Word search${s.level ? ` · ${LEVEL_LABEL[s.level]}` : ""}` : "Colouring"}
                        </p>
                        <h3 className="mt-0.5 font-extrabold text-brand-charcoal group-hover:text-brand-sage">{s.title}</h3>
                        <p className="mt-1 text-sm font-bold text-brand-sage">🖨️ Open to print</p>
                      </div>
                    </a>
                    {isSearch && role && !isChild ? (
                      <a href={sheetAnswers(s)} target="_blank" rel="noopener" className="mx-3 mb-3 mt-1 inline-block text-sm font-bold text-brand-earth/70 hover:text-brand-sage hover:underline">
                        🔑 Answers
                      </a>
                    ) : (
                      <div className="pb-3" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section id="quizzes" className="mt-10 scroll-mt-24">
          <h2 className={h2}>Quizzes</h2>
          <p className="mt-1 text-sm text-brand-earth/80">
            {isChild ? "Try them on screen. They mark themselves." : "Your child can do these on screen, where they mark themselves, or you can print them with the answers on a separate page."}
          </p>
          <div className="mt-4 space-y-3">
            {pack.sheets.map((s) => (
              <div key={s.slug} className={card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold text-brand-charcoal">{s.title}</h3>
                    <p className="mt-1 leading-6 text-brand-earth">{s.intro}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenQuiz(openQuiz === s.slug ? null : s.slug)}
                    aria-expanded={openQuiz === s.slug}
                    className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark"
                  >
                    {openQuiz === s.slug ? "Close" : "Start"}
                  </button>
                </div>
                {openQuiz === s.slug && (
                  <div className="mt-5">
                    <TopicQuiz sheet={s} color={pack.color} seed={pack.slug} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="books" className="mt-10 scroll-mt-24">
          <h2 className={h2}>{isChild ? "Books to read" : "Books, websites and places to visit"}</h2>
          <Links title="Books" links={pack.books} />
          {!isChild && <Links title="Online" links={pack.online} />}
          {!isChild && <Links title="Places to visit" links={pack.visits} />}
          {!isChild && (
            <p className="mt-4 text-xs text-brand-earth/60">
              Check opening times and prices before you go, as some sites close in winter. Websites are run by others, and we aren&apos;t responsible for what&apos;s on them.
            </p>
          )}
        </section>

        {!isChild && (
          <section className="mt-10 rounded-3xl bg-brand-cream p-5 text-sm leading-6 text-brand-earth sm:p-6">
            <p className={small + " text-brand-softsage"}>Where this fits</p>
            <p className="mt-2">
              <strong className="text-brand-charcoal">England:</strong> {pack.curriculum.england}
            </p>
            <p className="mt-2">
              <strong className="text-brand-charcoal">Scotland:</strong> {pack.curriculum.scotland}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function Background({ pack }: { pack: TopicPack }) {
  return (
    <section id="start" className="mt-8 scroll-mt-24 rounded-3xl border border-brand-line bg-brand-wash p-5 sm:p-6">
      <p className={small + " text-brand-softsage"}>For the grown-up</p>
      <h2 className={h2}>Before you start</h2>
      <p className="mt-1 text-sm text-brand-earth/80">Everything you need to know to teach this, in about ten minutes of reading.</p>
      {pack.background.map((b) => (
        <div key={b.heading} className="mt-5">
          <h3 className="text-lg font-extrabold text-brand-charcoal">{b.heading}</h3>
          {b.text.map((t) => (
            <p key={t} className="mt-2 leading-7 text-brand-earth">
              {t}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}

function Lesson({ pack, lesson, n, open, onToggle }: { pack: TopicPack; lesson: TopicLesson; n: number; open: boolean; onToggle: () => void }) {
  const art = lessonArt(pack, n);
  return (
    <div id={lessonAnchor(n)} className="scroll-mt-24 overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 p-4 text-left hover:bg-brand-wash sm:p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl" style={{ background: `${pack.color}1A` }}>
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt="" className="h-full w-full object-cover" />
          ) : (
            <Emoji e={lesson.emoji} className="h-7 w-7 text-2xl" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className={small + " block"} style={{ color: pack.color }}>
            Lesson {n} · about {lesson.minutes} minutes
          </span>
          <span className="block text-lg font-extrabold text-brand-charcoal">{lesson.title}</span>
        </span>
        <span className="text-xl font-bold text-brand-earth/60" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t border-brand-line p-5 sm:p-6">
          {art && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt="" className="mb-5 max-h-72 w-full rounded-2xl object-cover" />
          )}
          <div className="rounded-2xl bg-brand-cream px-4 py-3">
            <p className={small + " text-brand-softsage"}>By the end, your child should</p>
            <p className="mt-0.5 font-bold text-brand-charcoal">{lesson.aim.charAt(0).toLowerCase() + lesson.aim.slice(1)}</p>
          </div>
          <h4 className="mt-5 font-extrabold text-brand-charcoal">You&apos;ll need</h4>
          <ul className={list}>
            {lesson.need.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h4 className="mt-5 font-extrabold text-brand-charcoal">Tell the story</h4>
          {lesson.say.map((x) => (
            <p key={x} className="mt-2 leading-7 text-brand-earth">
              {x}
            </p>
          ))}
          <h4 className="mt-5 font-extrabold text-brand-charcoal">Do it</h4>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-7 text-brand-earth">
            {lesson.doIt.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
          <h4 className="mt-5 font-extrabold text-brand-charcoal">Talk about it</h4>
          <ul className={list}>
            {lesson.ask.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {(lesson.younger || lesson.older) && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {lesson.younger && (
                <p className="rounded-2xl border border-brand-line p-4 text-sm leading-6 text-brand-earth">
                  <strong className="block text-brand-charcoal">Younger child</strong>
                  {lesson.younger}
                </p>
              )}
              {lesson.older && (
                <p className="rounded-2xl border border-brand-line p-4 text-sm leading-6 text-brand-earth">
                  <strong className="block text-brand-charcoal">Older or keen child</strong>
                  {lesson.older}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Links({ title, links }: { title: string; links: TopicLink[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-lg font-extrabold text-brand-charcoal">{title}</h3>
      <ul className="mt-2 divide-y divide-brand-line rounded-2xl border border-brand-line bg-white">
        {links.map((l) => (
          <li key={l.title} className="p-4">
            <p className="font-bold text-brand-charcoal">
              {l.url ? (
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-brand-sage hover:underline">
                  {l.title} ↗
                </a>
              ) : (
                l.title
              )}
              {l.by && <span className="font-normal text-brand-earth/70"> · {l.by}</span>}
            </p>
            <p className="text-sm leading-6 text-brand-earth">{l.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
