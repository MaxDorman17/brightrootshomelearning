"use client";

import { useMemo, useState } from "react";
import MathText from "@/components/worksheets/MathText";
import Visual from "@/components/worksheets/Visual";
import { answerText, isRight, shuffled, type Option, type Question } from "@/lib/worksheets";

type Props = {
  q: Question;
  number: number;
  /** Something different for every question on every sheet, so each one shuffles its own way. */
  seed: string;
  color: string;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Marked: shows right or wrong and can no longer be changed. */
  marked: boolean;
};

const chip = "min-h-[44px] rounded-xl border-2 px-4 py-2 text-base font-bold transition-colors";
const idle = "border-brand-charcoal/25 bg-white text-brand-charcoal hover:border-brand-charcoal";
const picked = "border-brand-charcoal bg-brand-charcoal text-white";

/** One worksheet question a child answers by tapping or typing. No dragging, so it works on any tablet. */
export default function QuestionCard({ q, number, seed, color, value, onChange, marked }: Props) {
  const right = marked && isRight(q, value);
  return (
    <li
      className={`rounded-2xl border-2 bg-white p-4 sm:p-5 ${
        !marked ? "border-brand-line" : right ? "border-green-600 bg-green-50/60" : "border-amber-500 bg-amber-50/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
          style={{ background: color }}
          aria-hidden
        >
          {number}
        </span>
        <p className="min-w-0 flex-1 text-lg font-bold leading-snug text-brand-charcoal">
          <span className="sr-only">Question {number}. </span>
          <MathText text={q.q} />
        </p>
        {marked && (
          <span className={`shrink-0 text-sm font-extrabold ${right ? "text-green-700" : "text-amber-700"}`}>
            {right ? "✓ Right" : "Not yet"}
          </span>
        )}
      </div>

      {q.visual && (
        <div className="mt-3 flex justify-center rounded-xl bg-[#FAF6EC] p-3">
          <Visual
            visual={q.visual}
            color={color}
            className={q.visual.kind === "numberline" ? "w-full max-w-2xl" : q.visual.kind === "blocks" ? "h-36" : "h-32 max-w-full"}
          />
        </div>
      )}

      {q.image && (
        <div className="mt-3 flex justify-center rounded-xl bg-[#FAF6EC] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={q.image.url} alt={q.image.alt} loading="lazy" className="max-h-64 max-w-full rounded-lg object-contain" />
        </div>
      )}

      <div className="mt-4">
        {q.type === "choice" && <Choice q={q} value={value} onChange={onChange} marked={marked} />}
        {q.type === "pick" && <Pick q={q} value={value} onChange={onChange} marked={marked} />}
        {q.type === "type" && <Typed q={q} number={number} value={value} onChange={onChange} marked={marked} />}
        {q.type === "gap" && <Gap q={q} value={value} onChange={onChange} marked={marked} />}
        {q.type === "match" && <Match q={q} seed={seed} color={color} value={value} onChange={onChange} marked={marked} />}
        {q.type === "order" && <Order q={q} seed={seed} value={value} onChange={onChange} marked={marked} />}
      </div>

      {marked && (!right || q.why) && (
        <p className={`mt-3 text-sm font-semibold ${right ? "text-green-800" : "text-amber-900"}`}>
          {!right && (
            <>
              The answer is <MathText text={answerText(q)} />.{" "}
            </>
          )}
          {q.why}
        </p>
      )}
    </li>
  );
}

type Part<T extends Question["type"]> = {
  q: Extract<Question, { type: T }>;
  value: unknown;
  onChange: (value: unknown) => void;
  marked: boolean;
};

function Choice({ q, value, onChange, marked }: Part<"choice">) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose one answer">
      {q.options.map((option, i) => {
        const chosen = value === i;
        const style = !marked
          ? chosen
            ? picked
            : idle
          : i === q.answer
            ? "border-green-700 bg-green-100 text-green-900"
            : chosen
              ? "border-amber-600 bg-amber-100 text-amber-900"
              : "border-brand-charcoal/15 bg-white text-brand-charcoal/50";
        return (
          <button key={i} type="button" disabled={marked} aria-pressed={chosen} onClick={() => onChange(i)} className={`${chip} ${style}`}>
            <Shown option={option} />
          </button>
        );
      })}
    </div>
  );
}

/** An option's words, or its picture. */
function Shown({ option }: { option: Option }) {
  if (typeof option === "string") return <MathText text={option} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={option.image.url} alt={option.image.alt} loading="lazy" className="max-h-36 max-w-[14rem] rounded-md object-contain" />;
}

/** Like Choice, but with more than one right answer: tap each one. */
function Pick({ q, value, onChange, marked }: Part<"pick">) {
  const chosen: number[] = Array.isArray(value) ? (value as number[]) : [];
  const toggle = (i: number) => {
    const next = chosen.includes(i) ? chosen.filter((c) => c !== i) : [...chosen, i];
    onChange(next.length ? next : undefined);
  };
  return (
    <div>
      {!marked && <p className="mb-2 text-sm font-semibold text-brand-earth/80">Choose {q.answers.length}.</p>}
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Choose ${q.answers.length} answers`}>
        {q.options.map((option, i) => {
          const on = chosen.includes(i);
          const style = !marked
            ? on
              ? picked
              : idle
            : q.answers.includes(i)
              ? "border-green-700 bg-green-100 text-green-900"
              : on
                ? "border-amber-600 bg-amber-100 text-amber-900"
                : "border-brand-charcoal/15 bg-white text-brand-charcoal/50";
          return (
            <button key={i} type="button" disabled={marked} aria-pressed={on} onClick={() => toggle(i)} className={`${chip} ${style}`}>
              <Shown option={option} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Typed({ q, number, value, onChange, marked }: Part<"type"> & { number: number }) {
  const wanted = ([] as string[]).concat(q.answer)[0];
  const numeric = /^\d+$/.test(wanted);
  return (
    <label className="flex flex-wrap items-center gap-2 text-lg font-bold text-brand-charcoal">
      <span className="sr-only">Your answer to question {number}</span>
      <input
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value.slice(0, 30))}
        disabled={marked}
        inputMode={numeric ? "numeric" : "text"}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`h-12 rounded-xl border-2 border-brand-charcoal/30 bg-white px-3 text-center text-xl font-extrabold text-brand-charcoal focus:border-brand-charcoal focus:outline-none disabled:bg-white/70 ${
          numeric ? "w-24" : "w-48"
        }`}
      />
      {q.after && <span>{q.after}</span>}
    </label>
  );
}

function Gap({ q, value, onChange, marked }: Part<"gap">) {
  const filled: (string | null)[] = Array.isArray(value) ? (value as (string | null)[]) : q.answers.map(() => null);
  const pieces = q.text.split("___");
  // Each word in the bank can be used once.
  const used = [...filled];
  const free = q.bank.map((word) => {
    const at = used.indexOf(word);
    if (at === -1) return true;
    used[at] = null;
    return false;
  });
  const put = (word: string) => {
    const slot = filled.indexOf(null);
    if (slot === -1) return;
    onChange(filled.map((v, i) => (i === slot ? word : v)));
  };
  const clear = (slot: number) => {
    const next = filled.map((v, i) => (i === slot ? null : v));
    onChange(next.every((v) => v === null) ? undefined : next);
  };
  return (
    <div>
      <p className="text-xl font-bold leading-loose text-brand-charcoal">
        {pieces.map((piece, i) => (
          <span key={i}>
            {piece}
            {i < pieces.length - 1 && (
              <button
                type="button"
                disabled={marked || !filled[i]}
                onClick={() => clear(i)}
                aria-label={filled[i] ? `Gap ${i + 1}: ${filled[i]}. Tap to take it out.` : `Gap ${i + 1}, empty`}
                className={`mx-1 inline-flex h-11 min-w-[3.5rem] items-center justify-center rounded-lg border-2 px-2 align-middle font-extrabold ${
                  filled[i]
                    ? marked
                      ? filled[i] === q.answers[i]
                        ? "border-green-700 bg-green-100 text-green-900"
                        : "border-amber-600 bg-amber-100 text-amber-900"
                      : "border-brand-charcoal bg-white"
                    : "border-dashed border-brand-charcoal/40 bg-[#FAF6EC]"
                }`}
              >
                {filled[i] || ""}
              </button>
            )}
          </span>
        ))}
      </p>
      {!marked && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Words to choose from">
          {q.bank.map((word, i) => (
            <button
              key={i}
              type="button"
              disabled={!free[i] || filled.indexOf(null) === -1}
              onClick={() => put(word)}
              className={`${chip} ${idle} disabled:opacity-30`}
            >
              {word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Match({ q, seed, color, value, onChange, marked }: Part<"match"> & { seed: string; color: string }) {
  const made: Record<string, string> = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
  const [holding, setHolding] = useState<string | null>(null);
  const rights = useMemo(() => shuffled(q.pairs.map(([, r]) => r), seed), [q, seed]);
  const lefts = q.pairs.map(([l]) => l);
  const ownerOf = (r: string) => lefts.find((l) => made[l] === r);
  // Matched pairs share a letter, so it's clear what goes with what without colour alone.
  const letter = (l: string) => String.fromCharCode(65 + lefts.indexOf(l));
  const save = (next: Record<string, string>) => onChange(Object.keys(next).length ? next : undefined);

  const tapLeft = (l: string) => {
    if (made[l]) {
      const next = { ...made };
      delete next[l];
      save(next);
      setHolding(l);
    } else setHolding(holding === l ? null : l);
  };
  const tapRight = (r: string) => {
    const owner = ownerOf(r);
    if (owner) {
      const next = { ...made };
      delete next[owner];
      save(next);
      return;
    }
    if (!holding) return;
    save({ ...made, [holding]: r });
    setHolding(null);
  };
  const tag = (l: string) => (
    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: color }}>
      {letter(l)}
    </span>
  );
  const rightPair = (l: string) => q.pairs.find(([left]) => left === l)?.[1];

  return (
    <div>
      {!marked && (
        <p className="mb-2 text-sm font-semibold text-brand-earth/80">
          {holding ? "Now tap what goes with it on the right." : "Tap one on the left, then what goes with it on the right."}
        </p>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="space-y-2">
          {lefts.map((l) => (
            <button
              key={l}
              type="button"
              disabled={marked}
              aria-pressed={holding === l}
              onClick={() => tapLeft(l)}
              className={`${chip} flex w-full items-center text-left ${
                marked
                  ? made[l] === rightPair(l)
                    ? "border-green-700 bg-green-100 text-green-900"
                    : "border-amber-600 bg-amber-100 text-amber-900"
                  : holding === l
                    ? picked
                    : idle
              }`}
            >
              {made[l] && tag(l)}
              <MathText text={l} />
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map((r) => {
            const owner = ownerOf(r);
            return (
              <button
                key={r}
                type="button"
                disabled={marked || (!owner && !holding)}
                onClick={() => tapRight(r)}
                aria-label={owner ? `${r}, matched with ${owner}. Tap to undo.` : r}
                className={`${chip} flex w-full items-center text-left ${
                  marked ? "border-brand-charcoal/20 bg-white text-brand-charcoal" : `${idle} disabled:hover:border-brand-charcoal/25`
                }`}
              >
                {owner && tag(owner)}
                <MathText text={r} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Order({ q, seed, value, onChange, marked }: Part<"order"> & { seed: string }) {
  const chosen: string[] = Array.isArray(value) ? (value as string[]) : [];
  const pool = useMemo(() => shuffled(q.items, seed), [q, seed]);
  const save = (next: string[]) => onChange(next.length ? next : undefined);
  return (
    <div>
      <ol className="space-y-2" aria-label="Your order">
        {q.items.map((_, i) => {
          const item = chosen[i];
          return (
            <li key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-right text-sm font-extrabold text-brand-earth/70">{i + 1}.</span>
              {item ? (
                <button
                  type="button"
                  disabled={marked}
                  onClick={() => save(chosen.filter((c) => c !== item))}
                  aria-label={`${item}. Tap to take it out.`}
                  className={`${chip} flex-1 text-left ${
                    marked
                      ? item === q.items[i]
                        ? "border-green-700 bg-green-100 text-green-900"
                        : "border-amber-600 bg-amber-100 text-amber-900"
                      : "border-brand-charcoal bg-white text-brand-charcoal"
                  }`}
                >
                  <MathText text={item} />
                </button>
              ) : (
                <span className="min-h-[44px] flex-1 rounded-xl border-2 border-dashed border-brand-charcoal/30 bg-[#FAF6EC]" />
              )}
            </li>
          );
        })}
      </ol>
      {!marked && chosen.length < q.items.length && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Tap these in order">
          {pool
            .filter((item) => !chosen.includes(item))
            .map((item) => (
              <button key={item} type="button" onClick={() => save([...chosen, item])} className={`${chip} ${idle}`}>
                <MathText text={item} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
