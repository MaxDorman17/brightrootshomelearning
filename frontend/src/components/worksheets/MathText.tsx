import { Fragment, type ReactNode } from "react";

/**
 * Text that may hold maths written the way Oak writes it, between $$ marks: $$3\over4$$, $$\frac{67}{10^5}$$.
 * The everyday pieces (fractions, powers, times, divide, roots) are drawn properly; anything rarer is
 * shown as tidy plain text rather than as code.
 */
export default function MathText({ text }: { text: string }) {
  const parts = text.split("$$");
  if (parts.length < 3) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 0 ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <span key={i} className="whitespace-nowrap font-[inherit]">
            {maths(part.trim())}
          </span>
        )
      )}
    </>
  );
}

const SYMBOLS: Record<string, string> = {
  times: "×", div: "÷", cdot: "·", pm: "±", leq: "≤", le: "≤", geq: "≥", ge: "≥", neq: "≠", ne: "≠", approx: "≈",
  pi: "π", theta: "θ", alpha: "α", beta: "β", degree: "°", circ: "°", pounds: "£", percent: "%", infty: "∞",
  square: "□", Box: "□", rightarrow: "→", to: "→", quad: " ", qquad: " ", ldots: "…", dots: "…", angle: "∠", triangle: "△", equiv: "≡",
};

/** Reads one {group} or one character starting at `at`. Returns what was inside and where it ended. */
function group(src: string, at: number): [string, number] {
  while (src[at] === " ") at++;
  if (src[at] !== "{") {
    if (src[at] === "\\") {
      const name = /^\\[a-zA-Z]+/.exec(src.slice(at));
      if (name) return [name[0], at + name[0].length];
    }
    return [src[at] ?? "", at + 1];
  }
  let depth = 0;
  for (let i = at; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return [src.slice(at + 1, i), i + 1];
  }
  return [src.slice(at + 1), src.length];
}

function fraction(top: ReactNode, bottom: ReactNode, key: number) {
  return (
    <span key={key} className="mx-0.5 inline-flex flex-col items-center align-middle text-[0.85em] leading-tight">
      <span className="border-b-2 border-current px-1">{top}</span>
      <span className="px-1">{bottom}</span>
    </span>
  );
}

/** Where a top-level \over sits, if there is one: "a \over b" is the whole thing as a fraction. */
function overAt(src: string): number {
  let depth = 0;
  for (let i = 0; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") depth--;
    else if (depth === 0 && src.startsWith("\\over", i) && !/[a-zA-Z]/.test(src[i + 5] ?? "")) return i;
  }
  return -1;
}

function maths(src: string): ReactNode {
  const over = overAt(src);
  if (over !== -1) return fraction(maths(src.slice(0, over).trim()), maths(src.slice(over + 5).trim()), 0);

  const out: ReactNode[] = [];
  let plain = "";
  const flush = () => {
    if (plain) out.push(<Fragment key={out.length}>{plain}</Fragment>);
    plain = "";
  };
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      const name = /^\\([a-zA-Z]+)/.exec(src.slice(i));
      if (!name) {
        // An escaped sign such as \% or \£, or a thin space such as "\,"
        plain += /[,;: !]/.test(src[i + 1] ?? "") ? " " : src[i + 1] ?? "";
        i += 2;
        continue;
      }
      i += name[0].length;
      const word = name[1];
      if (word === "frac" || word === "dfrac" || word === "tfrac") {
        const [top, afterTop] = group(src, i);
        const [bottom, afterBottom] = group(src, afterTop);
        flush();
        out.push(fraction(maths(top), maths(bottom), out.length));
        i = afterBottom;
      } else if (word === "sqrt") {
        const [inside, after] = group(src, i);
        flush();
        out.push(
          <span key={out.length}>
            √<span className="border-t-2 border-current">{maths(inside)}</span>
          </span>
        );
        i = after;
      } else if (word === "text" || word === "textbf" || word === "mathrm" || word === "mathbf") {
        const [inside, after] = group(src, i);
        plain += inside;
        i = after;
      } else if (word === "left" || word === "right") {
        // Sizing hints only: the bracket that follows is kept.
      } else {
        plain += SYMBOLS[word] ?? word;
      }
    } else if (ch === "^" || ch === "_") {
      const [inside, after] = group(src, i + 1);
      flush();
      out.push(ch === "^" ? <sup key={out.length}>{maths(inside)}</sup> : <sub key={out.length}>{maths(inside)}</sub>);
      i = after;
    } else if (ch === "{" || ch === "}") {
      i++;
    } else {
      plain += ch;
      i++;
    }
  }
  flush();
  return out;
}
