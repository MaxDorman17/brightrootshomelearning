import { hand } from "@/lib/fonts";

/** A hand-drawn style leafy sprig. */
export function Sprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 120" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path d="M30 118 C30 90 28 60 34 8" stroke="#5E7F57" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {[
        [30, 96, -1],
        [31, 80, 1],
        [31, 64, -1],
        [32, 48, 1],
        [33, 32, -1],
        [34, 18, 1],
      ].map(([x, y, side], i) => (
        <path
          key={i}
          d={`M${x} ${y} q ${side * 16} -4 ${side * 22} -18 q ${side * -16} 2 ${side * -22} 18z`}
          fill={i % 2 ? "#7C9B6E" : "#5E7F57"}
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

/** A small handwritten note with a heart, like the ones in the mock-up. */
export function HandNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`${hand.className} text-2xl leading-7 text-[#4F6B4A] ${className}`} aria-hidden>
      {children}
      <span className="block text-lg">♡</span>
    </p>
  );
}
