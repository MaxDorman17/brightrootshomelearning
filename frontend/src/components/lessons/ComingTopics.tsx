import type { PlannedTopic } from "@/lib/curriculum-plan";
import type { Term } from "@/lib/terms";

/** The curriculum topics for a term that aren't written yet, as a light list. `showSubject` adds each topic's subject. */
export default function ComingTopics({ topics, term, isNow, showSubject = false }: { topics: PlannedTopic[]; term: Term; isNow: boolean; showSubject?: boolean }) {
  if (topics.length === 0) return null;
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-line p-4">
      <p className="text-sm font-extrabold text-brand-charcoal">
        {isNow ? "Still being written for this term" : `Coming in ${term.startMonth}`}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {topics.map((t) => (
          <li key={`${t.subject}:${t.title}`} className="rounded-full bg-brand-cream px-3 py-1 text-sm text-brand-earth">
            {showSubject && <span className="font-bold">{t.subject}: </span>}
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
