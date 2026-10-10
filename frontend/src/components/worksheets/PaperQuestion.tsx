import { shuffled, type Question } from "@/lib/worksheets";

/** A box to write an answer in, on paper. */
export const paperBox = "inline-block h-9 min-w-[3.5rem] rounded-md border-2 border-brand-charcoal/70 align-middle";
const box = paperBox;

/** On screen a child taps; on paper they circle, write or draw a line. */
export function paperWording(q: Question): string {
  if (q.type === "order") return q.q.replace(/\btap\b/g, "write").replace(/\bTap\b/g, "Write");
  if (q.type === "match") return `${q.q} Draw a line to join them.`;
  return q.q;
}

export function PaperAnswer({ q, seed }: { q: Question; seed: string }) {
  switch (q.type) {
    case "choice":
    case "pick":
      return (
        <p className="flex flex-wrap gap-x-8 gap-y-2 text-base">
          <span className="text-sm text-brand-earth">{q.type === "pick" ? "Circle every right one:" : "Circle one:"}</span>
          {q.options.map((option, i) => (
            <span key={i} className="font-bold">
              {typeof option === "string" ? option : `Picture ${i + 1}`}
            </span>
          ))}
        </p>
      );
    case "type":
      return (
        <p className="text-base font-bold">
          <span className={box} /> {q.after}
        </p>
      );
    case "gap": {
      const pieces = q.text.split("___");
      return (
        <div>
          <p className="text-lg font-bold leading-loose">
            {pieces.map((piece, i) => (
              <span key={i}>
                {piece}
                {i < pieces.length - 1 && <span className={`${box} mx-1`} />}
              </span>
            ))}
          </p>
          <p className="mt-1 text-sm text-brand-earth">
            Choose from: <span className="font-bold text-brand-charcoal">{q.bank.join("   ·   ")}</span>
          </p>
        </div>
      );
    }
    case "match": {
      const rights = shuffled(q.pairs.map(([, r]) => r), seed);
      return (
        <div className="grid max-w-md grid-cols-2 gap-x-24 gap-y-3 text-base font-bold">
          {q.pairs.map(([left], i) => (
            <div key={left} className="contents">
              <span className="flex items-center justify-between gap-2">
                {left} <span className="h-2.5 w-2.5 rounded-full bg-brand-charcoal" />
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-charcoal" /> {rights[i]}
              </span>
            </div>
          ))}
        </div>
      );
    }
    case "order":
      return (
        <div>
          <p className="text-base font-bold">{shuffled(q.items, seed).join("   ·   ")}</p>
          <ol className="mt-2 space-y-2">
            {q.items.map((_, i) => (
              <li key={i} className="flex items-end gap-2 text-sm font-bold">
                {i + 1}. <span className="inline-block w-72 border-b-2 border-brand-charcoal/60">&nbsp;</span>
              </li>
            ))}
          </ol>
        </div>
      );
  }
}
