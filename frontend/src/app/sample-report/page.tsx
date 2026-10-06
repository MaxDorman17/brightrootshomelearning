import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";

export const metadata: Metadata = {
  title: "Sample council report",
  description:
    "See an example of the home education report Bright Roots builds from your records: subjects covered, results, reading, examples of work and more, ready to share with your council.",
};

// An invented family, so visitors can see what the report looks like before signing up.
const SUBJECTS = [
  { subject: "Maths", scheme: "White Rose Maths", lessons: 22, examples: "Place value to 1,000; Adding and subtracting hundreds; Telling the time to five minutes" },
  { subject: "English", scheme: "Twinkl", lessons: 19, examples: "Writing a persuasive letter; Speech marks; Poems about autumn" },
  { subject: "Science", scheme: "Oak National Academy", lessons: 9, examples: "Parts of a plant; What plants need to grow; Pond dipping at the park" },
  { subject: "History", scheme: "", lessons: 6, examples: "The Romans in Britain; A visit to the Roman fort; Making a mosaic" },
  { subject: "Cooking", scheme: "", lessons: 5, examples: "Weighing and measuring; Vegetable soup from scratch; Flapjacks" },
  { subject: "PE", scheme: "", lessons: 10, examples: "Swimming lessons; Couch to 5K, week 3; Balance and climbing at the park" },
];

const RESULTS = [
  ["18 Sep", "Maths", "Place value to 1,000", "9/10 (90%)"],
  ["2 Oct", "English", "Speech marks", "7/10 (70%)"],
  ["9 Oct", "Maths", "End of block check", "17/20 (85%)"],
  ["16 Oct", "Science", "Parts of a plant: exit quiz", "5/6 (83%)"],
];

const WORK = [
  ["24 Sep", "English", "Writing a persuasive letter", "Wrote to the council asking for a zebra crossing by the park. Posted it."],
  ["7 Oct", "History", "A visit to the Roman fort", "Sketched the bath house and worked out how the under-floor heating worked."],
  ["15 Oct", "Science", "Pond dipping at the park", "Found a newt, three water boatmen and a dragonfly nymph. Drew and labelled them."],
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 border-b-2 border-brand-sage pb-1 text-lg font-extrabold text-brand-charcoal">{title}</h2>
      {children}
    </section>
  );
}

export default function SampleReportPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">See what you get</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">A sample council report</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6E5A46]">
          If your council asks how home education is going, this is what Bright Roots puts together from the things you
          have already recorded. You choose the child, the dates and which sections to include, then print it or save it
          as a PDF.
        </p>
        <p className="mt-4 inline-block rounded-full bg-[#F8F0DA] px-4 py-1.5 text-sm font-bold text-[#8A6A22]">
          This is an example. The family and everything in it are made up.
        </p>

        <article className="mt-8 rounded-2xl border border-brand-line bg-white p-6 text-sm leading-6 text-[#2E342F] shadow-sm sm:p-10">
          <header className="border-b border-brand-line pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Elective home education report</p>
            <p className="mt-1 text-2xl font-black">Sam (example child)</p>
            <p className="mt-1 text-[#6E5A46]">1 September to 24 October</p>
            <p className="mt-1 text-xs text-[#6E5A46]">Prepared by an example parent using Bright Roots Home Learning</p>
          </header>

          <Section title="Our approach to home education">
            <p>
              We follow a gentle routine: maths and English most mornings, using White Rose Maths and Twinkl, then
              projects, reading and time outdoors in the afternoons. Sam learns best in short sessions with plenty of
              movement, so we keep lessons to about twenty minutes and follow his interests where we can. This term
              that has meant a lot of Romans.
            </p>
          </Section>

          <Section title="Summary">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["34", "Days of recorded learning"],
                ["71", "Lessons completed"],
                ["6", "Subjects covered"],
                ["8", "Extra learning activities"],
              ].map(([n, label]) => (
                <div key={label} className="rounded-xl bg-brand-cream p-4">
                  <p className="text-2xl font-black text-brand-sage">{n}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6E5A46]">{label}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Subjects covered">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="text-xs text-[#6E5A46]">
                    <th className="w-40 py-1.5 pr-3 font-bold">Subject</th>
                    <th className="w-20 py-1.5 pr-3 font-bold">Lessons</th>
                    <th className="py-1.5 font-bold">Examples of topics studied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line">
                  {SUBJECTS.map((s) => (
                    <tr key={s.subject} className="align-top">
                      <td className="py-2 pr-3 font-bold">
                        {s.subject}
                        {s.scheme && <span className="block text-xs font-normal text-[#6E5A46]">{s.scheme}</span>}
                      </td>
                      <td className="py-2 pr-3">{s.lessons}</td>
                      <td className="py-2">{s.examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Results and assessment">
            <ul className="list-disc space-y-1 pl-5">
              <li>Spelling: 7 weekly tests, average 84%</li>
            </ul>
            <div className="overflow-x-auto">
              <table className="mt-4 w-full min-w-[480px] text-left">
                <thead>
                  <tr className="text-xs text-[#6E5A46]">
                    <th className="py-1.5 pr-3 font-bold">Date</th>
                    <th className="py-1.5 pr-3 font-bold">Subject</th>
                    <th className="py-1.5 pr-3 font-bold">Assessment</th>
                    <th className="py-1.5 font-bold">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line">
                  {RESULTS.map((r) => (
                    <tr key={r[0] + r[2]}>
                      {r.map((cell, i) => (
                        <td key={i} className="py-2 pr-3">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Reading">
            <p>
              <strong>Finished:</strong> The Iron Man; Fantastic Mr Fox; Romans on the Rampage.
            </p>
            <p className="mt-1">
              <strong>Reading now:</strong> The Owl Who Was Afraid of the Dark.
            </p>
          </Section>

          <Section title="Examples of work">
            <ul className="space-y-3">
              {WORK.map(([when, subject, title, note]) => (
                <li key={title}>
                  <p className="font-bold">
                    {title} <span className="font-normal text-[#6E5A46]">· {subject} · {when}</span>
                  </p>
                  <p className="text-[#4A3B2C]">{note}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Physical activity, outdoor learning and clubs">
            <p>Swimming club every Tuesday (7 sessions). Outdoor learning 9 times, including den building and a bug hotel. About 14 hours of activity recorded.</p>
          </Section>

          <Section title="Trips and visits">
            <p>Roman fort and museum (7 October). Library, fortnightly. Farm park with the local home education group (22 September).</p>
          </Section>

          <Section title="Journal highlights">
            <p className="italic text-[#4A3B2C]">
              &quot;Sam asked to carry on with fractions after we had finished, because he wanted to work out how to share the
              flapjacks fairly. First time he has asked for more maths.&quot;
            </p>
          </Section>
        </article>

        <div className="mt-10 rounded-3xl bg-[#2F5D3A] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-black sm:text-3xl">Your own report builds as you go</h2>
          <p className="mt-3 max-w-xl leading-7 text-white/85">
            Tick off lessons, or just jot down what you did each day. Bright Roots keeps the record, so the report is
            ready whenever you need it.
          </p>
          <Link href="/signup" className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#2F5D3A] hover:opacity-95">
            Try it free for 14 days →
          </Link>
          <p className="mt-3 text-sm text-white/70">No card needed. £5.99 a month afterwards for the whole family.</p>
        </div>
      </div>
    </PublicShell>
  );
}
