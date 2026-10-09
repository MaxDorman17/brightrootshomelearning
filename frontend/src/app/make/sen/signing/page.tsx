"use client";

import { SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import { BSL_RESOURCES, FIRST_SIGNS, MAKATON_RESOURCES, signLink, type Resource } from "@/lib/sen";

/**
 * Signing: what BSL and Makaton are, a first-signs list that opens each word on SignBSL, and trusted
 * places to learn. We link out rather than show signs ourselves: Makaton's signs and symbols are
 * The Makaton Charity's copyright, and BSL videos belong to whoever filmed them.
 */
export default function SigningPage() {
  const role = useSenRole();

  const links = (list: Resource[]) => (
    <ul className="mt-3 space-y-2">
      {list.map((r) => (
        <li key={r.url}>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-brand-line bg-white px-4 py-3 hover:shadow-md">
            <span className="font-extrabold text-brand-sage">{r.name} ↗</span>
            <span className="mt-0.5 block text-sm text-brand-earth/70">{r.what}</span>
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <SenFrame>
      <SenPage
        title="Signing"
        intro={
          role === "child"
            ? "Learn to say things with your hands! Pick a word and ask a grown-up to show you how to sign it."
            : "Signing helps children who are deaf, non-speaking or still finding their words, and it's fun for the whole family. Pick a word, watch a real signer, and practise it together this week."
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="brand-card p-5">
            <h2 className="text-lg font-extrabold text-brand-charcoal">British Sign Language (BSL)</h2>
            <p className="mt-1 text-sm text-brand-earth/80">
              The language of the Deaf community in the UK, with its own grammar. It uses a two-handed fingerspelling alphabet.
            </p>
          </div>
          <div className="brand-card p-5">
            <h2 className="text-lg font-extrabold text-brand-charcoal">Makaton</h2>
            <p className="mt-1 text-sm text-brand-earth/80">
              Signs and symbols used alongside speech to support communication. Many signs come from BSL. You&apos;ll know it from Mr Tumble.
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-xl font-extrabold text-brand-charcoal">First signs to learn</h2>
        <p className="mt-1 text-sm text-brand-earth/70">
          {role === "child"
            ? "Pick a word you'd like to learn."
            : "Tap a word to watch it signed in BSL on SignBSL. Try one new word a week and use it every day."}
        </p>
        <div className="mt-3 space-y-4">
          {FIRST_SIGNS.map((g) => (
            <div key={g.group}>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">{g.group}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {g.words.map((w) =>
                  role === "child" ? (
                    <span key={w} className="rounded-xl bg-brand-cream px-3 py-1.5 text-sm font-extrabold text-brand-earth">
                      {w}
                    </span>
                  ) : (
                    <a
                      key={w}
                      href={signLink(w)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-brand-cream px-3 py-1.5 text-sm font-extrabold text-brand-earth hover:bg-brand-tint"
                    >
                      {w}
                    </a>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Children don't get links off the site; the grown-up opens them. */}
        {role !== "child" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-extrabold text-brand-charcoal">Learn BSL</h2>
              {links(BSL_RESOURCES)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-brand-charcoal">Learn Makaton</h2>
              {links(MAKATON_RESOURCES)}
            </div>
          </div>
        )}

        {role !== "child" && (
          <p className="mt-8 max-w-2xl text-xs text-brand-earth/60">
            These links go to other websites, which have their own rules about using their videos and pictures. Bright Roots isn't connected to or endorsed by
            any of them. Signs can vary by region, so if your child already signs with a nursery, school or therapist, follow the signs they use.
          </p>
        )}
      </SenPage>
    </SenFrame>
  );
}
