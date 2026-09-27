"use client";

import { FormEvent, useEffect, useState } from "react";
import { GameHeader, GameProps, GameResult, shuffle } from "./common";

function scramble(word: string) {
  if (word.length < 2) return word;
  let out = word;
  for (let i = 0; i < 10 && out === word; i++) out = shuffle(word.split("")).join("");
  return out;
}

/** Unscramble this week's spelling words. Each hint reveals one more letter. */
export default function WordScramble({ words, onExit }: GameProps) {
  const [round, setRound] = useState(0);
  const [list, setList] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [totalHints, setTotalHints] = useState(0);
  const [solved, setSolved] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setList(shuffle(words).slice(0, 8));
    setIndex(0);
    setSolved(0);
    setTotalHints(0);
    setFinished(false);
  }, [round, words]);

  const word = list[index];
  useEffect(() => {
    if (word) {
      setScrambled(scramble(word.toLowerCase()));
      setAnswer("");
      setHints(0);
      setWrong(false);
    }
  }, [word]);

  const next = (gotIt: boolean) => {
    if (gotIt) setSolved((s) => s + 1);
    if (index + 1 >= list.length) setFinished(true);
    else setIndex((i) => i + 1);
  };

  const check = (e: FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === word.toLowerCase()) next(true);
    else setWrong(true);
  };

  const hint = () => {
    if (hints >= word.length - 1) return;
    setHints((h) => h + 1);
    setTotalHints((h) => h + 1);
    setAnswer(word.slice(0, hints + 1).toLowerCase());
  };

  const score = Math.max(0, solved * 10 - totalHints * 2);

  if (finished) {
    return (
      <GameResult
        game="word_scramble"
        score={score}
        detail={`${solved}/${list.length} solved`}
        onAgain={() => setRound((r) => r + 1)}
        onExit={onExit}
        summary={<p><b>{solved}</b> of {list.length} words unscrambled, with {totalHints} hint{totalHints === 1 ? "" : "s"}.</p>}
      />
    );
  }

  if (!word) return null;

  return (
    <div>
      <GameHeader title="🔤 Word Scramble" onExit={onExit} right={<span className="text-sm font-bold text-[#6E5A46]">{index + 1}/{list.length}</span>} />
      <div className="py-4 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          {scrambled.split("").map((letter, i) => (
            <span key={i} className="flex h-12 w-11 items-center justify-center rounded-xl bg-brand-tint text-2xl font-black uppercase text-brand-sage shadow-sm">
              {letter}
            </span>
          ))}
        </div>
        <form onSubmit={check} className="mx-auto mt-6 flex max-w-sm gap-2">
          <input
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setWrong(false);
            }}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            className="min-w-0 flex-1 rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-center text-xl font-bold outline-none focus:border-brand-softsage"
            aria-label="Your answer"
          />
          <button type="submit" className="rounded-xl bg-brand-sage px-5 py-3 font-bold text-white">Check</button>
        </form>
        {wrong && <p className="mt-3 font-bold text-[#A64F42]">Not yet, try again!</p>}
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <button onClick={hint} className="font-bold text-brand-sage hover:underline">💡 Hint</button>
          <button onClick={() => next(false)} className="font-bold text-[#6E5A46] hover:underline">Skip</button>
        </div>
      </div>
    </div>
  );
}
