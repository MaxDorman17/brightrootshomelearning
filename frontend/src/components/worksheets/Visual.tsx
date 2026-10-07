import type { Visual as VisualType } from "@/lib/worksheets";

const INK = "#2E342F";

/** Rounded, so the server and the browser always draw exactly the same picture. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** A maths drawing for a worksheet question. Drawn here rather than loaded, so it prints sharply. */
export default function Visual({ visual, color, className = "" }: { visual: VisualType; color: string; className?: string }) {
  const props = { className, role: "img" as const };
  switch (visual.kind) {
    case "tenframe": {
      const size = 44;
      return (
        <svg viewBox={`0 0 ${size * 5 + 4} ${size * 2 + 4}`} aria-label={`A ten frame with ${visual.filled} counters`} {...props}>
          {Array.from({ length: 10 }, (_, i) => {
            const x = 2 + (i % 5) * size;
            const y = 2 + Math.floor(i / 5) * size;
            return (
              <g key={i}>
                <rect x={x} y={y} width={size} height={size} fill="#fff" stroke={INK} strokeWidth={2} />
                {i < visual.filled && <circle cx={x + size / 2} cy={y + size / 2} r={size * 0.34} fill={color} />}
              </g>
            );
          })}
        </svg>
      );
    }
    case "dots": {
      const gap = 34;
      return (
        <svg
          viewBox={`0 0 ${visual.cols * gap} ${visual.rows * gap}`}
          aria-label={`${visual.rows} rows of ${visual.cols} dots`}
          {...props}
        >
          {Array.from({ length: visual.rows * visual.cols }, (_, i) => (
            <circle key={i} cx={(i % visual.cols) * gap + gap / 2} cy={Math.floor(i / visual.cols) * gap + gap / 2} r={11} fill={color} />
          ))}
        </svg>
      );
    }
    case "numberline": {
      const count = visual.to - visual.from;
      const step = 30;
      const left = 18;
      const width = count * step + left * 2;
      const x = (n: number) => left + (n - visual.from) * step;
      const lineY = 58;
      const jump = visual.jump;
      return (
        <svg
          viewBox={`0 0 ${width} 92`}
          aria-label={
            jump
              ? `A number line from ${visual.from} to ${visual.to}, with a jump starting at ${jump[0]}`
              : `A number line from ${visual.from} to ${visual.to}`
          }
          {...props}
        >
          <line x1={left - 8} y1={lineY} x2={width - left + 8} y2={lineY} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          {Array.from({ length: count + 1 }, (_, i) => {
            const n = visual.from + i;
            return (
              <g key={n}>
                <line x1={x(n)} y1={lineY - 7} x2={x(n)} y2={lineY + 7} stroke={INK} strokeWidth={2} />
                <text x={x(n)} y={lineY + 26} textAnchor="middle" fontSize={15} fontWeight={700} fill={INK}>
                  {n}
                </text>
              </g>
            );
          })}
          {jump && (
            <g>
              <path
                d={`M ${x(jump[0])} ${lineY - 10} Q ${(x(jump[0]) + x(jump[1])) / 2} ${-22} ${x(jump[1])} ${lineY - 10}`}
                fill="none"
                stroke={color}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <circle cx={x(jump[0])} cy={lineY} r={6} fill={color} />
              {/* The arrow head points down at where the jump lands; the number itself is left for the child. */}
              <path
                d={`M ${x(jump[1]) - 7} ${lineY - 19} L ${x(jump[1])} ${lineY - 8} L ${x(jump[1]) + 7} ${lineY - 19}`}
                fill="none"
                stroke={color}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>
      );
    }
    case "fraction": {
      const label = `A ${visual.shape === "bar" ? "bar" : "circle"} in ${visual.parts} equal parts with ${visual.shaded} coloured`;
      if (visual.shape === "bar") {
        const w = 240 / visual.parts;
        return (
          <svg viewBox="0 0 244 64" aria-label={label} {...props}>
            {Array.from({ length: visual.parts }, (_, i) => (
              <rect key={i} x={2 + i * w} y={2} width={w} height={60} fill={i < visual.shaded ? color : "#fff"} stroke={INK} strokeWidth={2.5} />
            ))}
          </svg>
        );
      }
      const r = 70;
      const c = 74;
      const point = (i: number) => {
        const angle = (i / visual.parts) * Math.PI * 2 - Math.PI / 2;
        return `${r2(c + r * Math.cos(angle))} ${r2(c + r * Math.sin(angle))}`;
      };
      return (
        <svg viewBox="0 0 148 148" aria-label={label} {...props}>
          {Array.from({ length: visual.parts }, (_, i) => (
            <path
              key={i}
              d={`M ${c} ${c} L ${point(i)} A ${r} ${r} 0 ${visual.parts === 1 ? 1 : 0} 1 ${point(i + 1)} Z`}
              fill={i < visual.shaded ? color : "#fff"}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          ))}
        </svg>
      );
    }
    case "clock": {
      const c = 100;
      const hand = (degrees: number, length: number) => {
        const angle = ((degrees - 90) * Math.PI) / 180;
        return { x2: r2(c + length * Math.cos(angle)), y2: r2(c + length * Math.sin(angle)) };
      };
      return (
        <svg viewBox="0 0 200 200" aria-label="A clock face" {...props}>
          <circle cx={c} cy={c} r={94} fill="#fff" stroke={INK} strokeWidth={5} />
          {Array.from({ length: 12 }, (_, i) => {
            const n = i + 1;
            const angle = ((n * 30 - 90) * Math.PI) / 180;
            return (
              <text
                key={n}
                x={r2(c + 74 * Math.cos(angle))}
                y={r2(c + 74 * Math.sin(angle) + 7)}
                textAnchor="middle"
                fontSize={20}
                fontWeight={800}
                fill={INK}
              >
                {n}
              </text>
            );
          })}
          <line x1={c} y1={c} {...hand(((visual.hour % 12) + visual.minute / 60) * 30, 42)} stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <line x1={c} y1={c} {...hand(visual.minute * 6, 62)} stroke={color} strokeWidth={5} strokeLinecap="round" />
          <circle cx={c} cy={c} r={6} fill={INK} />
        </svg>
      );
    }
    case "blocks": {
      const unit = 14;
      const stick = unit + 8;
      const width = Math.max(visual.tens * stick + (visual.ones ? Math.min(visual.ones, 5) * (unit + 6) + 14 : 0), unit);
      return (
        <svg
          viewBox={`0 0 ${width + 4} ${unit * 10 + 4}`}
          aria-label={`${visual.tens} sticks of ten and ${visual.ones} single cubes`}
          {...props}
        >
          {Array.from({ length: visual.tens }, (_, t) =>
            Array.from({ length: 10 }, (_, i) => (
              <rect key={`${t}-${i}`} x={2 + t * stick} y={2 + i * unit} width={unit} height={unit} fill={color} stroke={INK} strokeWidth={1.5} />
            ))
          )}
          {Array.from({ length: visual.ones }, (_, i) => (
            <rect
              key={`one-${i}`}
              x={2 + visual.tens * stick + 14 + (i % 5) * (unit + 6)}
              y={2 + unit * 10 - unit - Math.floor(i / 5) * (unit + 6)}
              width={unit}
              height={unit}
              fill="#fff"
              stroke={INK}
              strokeWidth={1.5}
            />
          ))}
        </svg>
      );
    }
  }
}
