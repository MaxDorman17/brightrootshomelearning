"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Emoji from "@/components/Emoji";
import { speak, shuffle } from "@/components/games/common";
import { LanguageLogEntry, logLanguage } from "@/lib/api";
import { PACK_LANGUAGES, PackLanguage, PackWord, packDone, packNote, spokenForm, Topic, TOPICS } from "@/lib/languagePacks";
import { Child } from "@/types";
import { errorText } from "@/components/make/common";

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-60";
const primary = `${btn} bg-brand-sage text-white hover:bg-brand-sagedark`;
const secondary = `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`;
const choice = "w-full rounded-xl border-2 px-4 py-3 text-left text-base font-bold transition-colors";

type Step = "learn" | "listen" | "quiz";
type Question = { answer: PackWord; options: PackWord[] };

function SpeakButton({ word, lang, big }: { word: string; lang: string; big?: boolean }) {
  return (
    <button
      onClick={() => speak(spokenForm(word), lang)}
      className={`shrink-0 rounded-full bg-brand-tint shadow-sm active:scale-95 ${big ? "px-8 py-6 text-4xl" : "px-3 py-2 text-lg"}`}
      aria-label={`Hear ${word}`}
    >
      🔊
    </button>
  );
}

function questions(words: PackWord[]): Question[] {
  return shuffle(words).map((answer) => ({
    answer,
    options: shuffle([answer, ...shuffle(words.filter((w) => w !== answer)).slice(0, 3)]),
  }));
}

/** Flashcards: the word, its meaning and a picture, with a speaker to hear it. */
function Learn({ words, lang, onNext }: { words: PackWord[]; lang: string; onNext: () => void }) {
  return (
    <div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {words.map(([english, word, picture]) => (
          <li key={word} className="flex items-center gap-3 rounded-xl border-2 border-brand-line bg-white p-3">
            <span className="w-9 text-center text-2xl">{picture ? <Emoji e={picture} /> : null}</span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold text-brand-charcoal">{word}</p>
              <p className="text-sm text-[#6E5A46]">{english}</p>
            </div>
            <SpeakButton word={word} lang={lang} />
          </li>
        ))}
      </ul>
      <div className="mt-5 text-right">
        <button onClick={onNext} className={primary}>Next: Listen →</button>
      </div>
    </div>
  );
}

/** One round of questions. Listen: hear the word, pick its meaning. Quiz: see the English, pick the word. */
function Round({
  words,
  lang,
  mode,
  onFinish,
}: {
  words: PackWord[];
  lang: string;
  mode: "listen" | "quiz";
  onFinish: (score: number, total: number) => void;
}) {
  const [list] = useState(() => questions(words));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<PackWord | null>(null);
  const [score, setScore] = useState(0);
  const q = list[index];

  useEffect(() => {
    if (mode === "listen" && q) {
      const t = setTimeout(() => speak(spokenForm(q.answer[1]), lang), 300);
      return () => clearTimeout(t);
    }
  }, [mode, q, lang]);

  if (!q) return null;
  const pick = (option: PackWord) => {
    if (picked) return;
    setPicked(option);
    if (option === q.answer) setScore((s) => s + 1);
    if (mode === "quiz") speak(spokenForm(q.answer[1]), lang);
  };
  const next = () => {
    if (index + 1 >= list.length) {
      onFinish(score, list.length);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  };

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-softsage">
        {index + 1} of {list.length} · {score} right
      </p>
      <div className="mb-5 flex flex-col items-center text-center">
        {mode === "listen" ? (
          <>
            <SpeakButton word={q.answer[1]} lang={lang} big />
            <p className="mt-3 text-sm text-[#6E5A46]">Listen, then pick what it means.</p>
          </>
        ) : (
          <>
            {q.answer[2] && <p className="text-5xl"><Emoji e={q.answer[2]} /></p>}
            <p className="mt-2 text-2xl font-extrabold text-brand-charcoal">{q.answer[0]}</p>
            <p className="mt-1 text-sm text-[#6E5A46]">Which word means this?</p>
          </>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((option) => {
          const right = option === q.answer;
          const colour = !picked
            ? "border-brand-line bg-white text-brand-charcoal hover:border-brand-softsage"
            : right
              ? "border-brand-sage bg-brand-tint text-brand-sage"
              : option === picked
                ? "border-[#A64F42] bg-red-50 text-[#A64F42]"
                : "border-brand-line bg-white text-brand-charcoal opacity-60";
          return (
            <button key={option[1]} onClick={() => pick(option)} className={`${choice} ${colour}`}>
              {mode === "listen" ? option[0] : option[1]}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className={`text-sm font-bold ${picked === q.answer ? "text-brand-sage" : "text-[#A64F42]"}`}>
            {picked === q.answer ? "Well done!" : `It's “${q.answer[1]}” (${q.answer[0]}).`}
          </p>
          <button onClick={next} className={primary}>{index + 1 >= list.length ? "Finish" : "Next →"}</button>
        </div>
      )}
    </div>
  );
}

/** A finished quiz goes in the practice diary, so it counts for streaks, badges and reports. */
function Finished({
  language,
  topic,
  score,
  total,
  isParent,
  kids,
  who,
  log,
  onLogged,
  onAgain,
  onBack,
}: {
  language: PackLanguage;
  topic: Topic;
  score: number;
  total: number;
  isParent: boolean;
  kids: Child[];
  who: number | "";
  log: LanguageLogEntry[];
  onLogged: () => void;
  onAgain: () => void;
  onBack: () => void;
}) {
  const [chosen, setChosen] = useState<number[]>(() => (who ? [who] : kids.length === 1 ? [kids[0].id] : []));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  const save = async (childIds: number[]) => {
    setSaving(true);
    setError("");
    try {
      // Logging the same language twice in a day updates that day's entry, so keep what's already there.
      const owners = isParent ? childIds : [null];
      for (const id of owners) {
        const existing = log.find((e) => e.language === language.name && e.done_on === today && (id === null || e.child_id === id));
        const earlier = (existing?.note || "").split("; ").filter((part) => part && !packDone(part, topic));
        await logLanguage({
          language: language.name,
          done_on: today,
          note: [...earlier, packNote(topic, score, total)].join("; "),
          child_ids: id === null ? [] : [id],
        });
      }
      setSaved(true);
      onLogged();
    } catch (err) {
      setError(errorText(err, "Couldn't save that. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  // Children's practice is saved straight away; a grown-up picks who did it if it isn't clear.
  const [auto] = useState(() => !isParent || chosen.length > 0);
  useEffect(() => {
    if (auto && !saved && !saving && !error) save(isParent ? chosen : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center">
      <p className="text-5xl"><Emoji e={score === total ? "🏆" : score >= total / 2 ? "🌟" : "💪"} /></p>
      <h3 className="mt-3 text-2xl font-extrabold text-brand-charcoal">{score} out of {total}</h3>
      <p className="mt-1 text-sm text-[#6E5A46]">
        {score === total ? "Perfect! Every word right." : score >= total / 2 ? "Great work! Have another go to get them all." : "Good try! Look at the words again, then have another go."}
      </p>

      {isParent && !saved && !auto && (
        <div className="mx-auto mt-5 max-w-sm rounded-xl bg-brand-cream p-4 text-left">
          <p className="mb-2 text-sm font-bold text-brand-charcoal">Who did this? It goes in their practice diary.</p>
          <div className="flex flex-wrap gap-2">
            {kids.map((k) => {
              const on = chosen.includes(k.id);
              return (
                <button
                  key={k.id}
                  onClick={() => setChosen(on ? chosen.filter((c) => c !== k.id) : [...chosen, k.id])}
                  className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold ${on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth"}`}
                >
                  {k.username}
                </button>
              );
            })}
          </div>
          <button onClick={() => save(chosen)} disabled={!chosen.length || saving} className={`${primary} mt-3 w-full`}>
            {saving ? "Saving…" : "Add to the diary"}
          </button>
        </div>
      )}
      {saved && <p className="mt-4 text-sm font-bold text-brand-sage">Added to the practice diary <Emoji e="✅" /></p>}
      {saving && auto && <p className="mt-4 text-sm text-[#6E5A46]">Saving…</p>}
      {error && <p className="mt-4 text-sm font-bold text-[#A64F42]">{error}</p>}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={onAgain} className={secondary}>Try again</button>
        <button onClick={onBack} className={primary}>Pick another topic</button>
      </div>
    </div>
  );
}

export default function StarterPacks({
  log,
  isParent,
  kids,
  who,
  onLogged,
}: {
  log: LanguageLogEntry[];
  isParent: boolean;
  kids: Child[];
  who: number | "";
  onLogged: () => void;
}) {
  const [language, setLanguage] = useState<PackLanguage | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [step, setStep] = useState<Step>("learn");
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [round, setRound] = useState(0);

  const done = useMemo(() => {
    const out = new Set<string>();
    if (!language) return out;
    for (const e of log) {
      if (e.language !== language.name) continue;
      for (const t of TOPICS) if (packDone(e.note, t)) out.add(t.id);
    }
    return out;
  }, [log, language]);

  const openTopic = (t: Topic) => {
    setTopic(t);
    setStep("learn");
    setResult(null);
  };
  const words = language && topic ? language.packs[topic.id] : [];

  return (
    <div className="brand-card mb-6 p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Learn</p>
          <h2 className="mt-1 text-xl font-bold text-[#2E342F]">
            Starter packs
            {language && <> · {language.name}</>}
            {topic && <> · {topic.title}</>}
          </h2>
        </div>
        {language && (
          <button
            onClick={() => (topic ? setTopic(null) : setLanguage(null))}
            className="text-sm font-bold text-brand-sage hover:underline"
          >
            ← {topic ? "All topics" : "All languages"}
          </button>
        )}
      </div>

      {!language && (
        <>
          <p className="mb-4 text-sm text-[#6E5A46]">First words in a new language, spoken by a native voice. Pick a language to start.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PACK_LANGUAGES.map((l) => (
              <button key={l.name} onClick={() => setLanguage(l)} className="flex items-center gap-3 rounded-xl border-2 border-brand-line bg-white p-4 text-left hover:border-brand-softsage">
                <span className="text-3xl"><Emoji e={l.flag} /></span>
                <span className="text-base font-extrabold text-brand-charcoal">{l.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {language && !topic && (
        <>
          <p className="mb-4 text-sm text-[#6E5A46]">
            {done.size} of {TOPICS.length} topics done. Each one is Learn, Listen, then a short quiz.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => openTopic(t)}
                className={`relative rounded-xl border-2 p-4 text-left hover:border-brand-softsage ${done.has(t.id) ? "border-brand-sage bg-brand-tint" : "border-brand-line bg-white"}`}
              >
                {done.has(t.id) && <span className="absolute right-3 top-3 text-sm"><Emoji e="✅" /></span>}
                <span className="text-3xl"><Emoji e={t.picture} /></span>
                <span className="mt-2 block text-sm font-extrabold text-brand-charcoal">{t.title}</span>
                <span className="text-xs text-[#6E5A46]">{language.packs[t.id].length} words</span>
              </button>
            ))}
          </div>
        </>
      )}

      {language && topic && (
        <>
          <div className="mb-5 flex gap-2">
            {(["learn", "listen", "quiz"] as Step[]).map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  setStep(s);
                  setResult(null);
                  setRound((r) => r + 1);
                }}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold ${step === s ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth"}`}
              >
                {i + 1}. {s === "learn" ? "Learn" : s === "listen" ? "Listen" : "Quiz"}
              </button>
            ))}
          </div>
          {step === "learn" && <Learn words={words} lang={language.code} onNext={() => setStep("listen")} />}
          {step === "listen" && (
            <Round
              key={`listen-${round}`}
              words={words}
              lang={language.code}
              mode="listen"
              onFinish={() => {
                setRound((r) => r + 1);
                setStep("quiz");
              }}
            />
          )}
          {step === "quiz" && !result && (
            <Round key={`quiz-${round}`} words={words} lang={language.code} mode="quiz" onFinish={(score, total) => setResult({ score, total })} />
          )}
          {step === "quiz" && result && (
            <Finished
              key={`done-${round}`}
              language={language}
              topic={topic}
              score={result.score}
              total={result.total}
              isParent={isParent}
              kids={kids}
              who={who}
              log={log}
              onLogged={onLogged}
              onAgain={() => {
                setResult(null);
                setRound((r) => r + 1);
              }}
              onBack={() => setTopic(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
