import { PublicShell } from "@/components/PublicSite";
import { LEGAL_UPDATED } from "@/lib/site";

export type LegalSection = { title: string; body: React.ReactNode };

/** Shared layout for the privacy policy and terms: a heading, a contents list and numbered sections. */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm font-semibold text-[#6E5A46]/70">Last updated {LEGAL_UPDATED}</p>
        <div className="mt-6 space-y-3 leading-7 text-[#6E5A46]">{intro}</div>

        <nav className="mt-8 rounded-2xl border border-brand-line bg-brand-cream p-5">
          <p className="text-sm font-extrabold">Contents</p>
          <ol className="mt-2 grid gap-1 text-sm text-brand-sage sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#s${i + 1}`} className="hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`} className="scroll-mt-20">
              <h2 className="text-2xl font-black">
                {i + 1}. {s.title}
              </h2>
              <div className="legal-body mt-3 space-y-3 leading-7 text-[#6E5A46]">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
