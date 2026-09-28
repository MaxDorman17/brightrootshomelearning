"use client";

import { useState } from "react";
import { addResourceLink } from "@/lib/api";
import { STARTER_RESOURCES } from "@/lib/starterResources";

/** "Bright Roots picks": free learning websites every family can use. Parents can copy any into their own library. */
export default function StarterResources({ isParent, onAdded }: { isParent: boolean; onAdded?: () => void }) {
  const [subject, setSubject] = useState("");
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState("");

  const groups = STARTER_RESOURCES.map((g) => ({
    ...g,
    items: g.items.filter((i) => isParent || !i.forParents),
  })).filter((g) => g.items.length && (!subject || g.subject === subject));

  const add = async (folder: string, title: string, url: string, note: string) => {
    setBusy(url);
    try {
      await addResourceLink({ folder: folder === "All subjects" ? "General" : folder, title, url, note, visible_to_children: folder !== "For parents" });
      setAdded((prev) => new Set(prev).add(url));
      onAdded?.();
    } catch {
      // Leave the button as it was so they can try again.
    } finally {
      setBusy("");
    }
  };

  const chip = (active: boolean) =>
    "rounded-full border px-3 py-1.5 text-sm font-bold transition-colors " +
    (active ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-brand-earth hover:border-brand-softsage");

  return (
    <section className="mt-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Bright Roots picks</p>
      <h2 className="mt-1 text-2xl font-extrabold text-brand-charcoal">Free websites we recommend</h2>
      <p className="mt-1 max-w-2xl text-sm text-[#6E5A46]">
        Trusted, free learning sites for every subject.
        {isParent ? " Tap \"Add\" to save one to your own Resources so it shows in your folders." : " Ask your grown-up if you want to try one."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setSubject("")} className={chip(!subject)}>
          All
        </button>
        {STARTER_RESOURCES.filter((g) => isParent || g.subject !== "For parents").map((g) => (
          <button key={g.subject} onClick={() => setSubject(subject === g.subject ? "" : g.subject)} className={chip(subject === g.subject)}>
            {g.emoji} {g.subject}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <div key={g.subject}>
            <h3 className="text-lg font-extrabold text-brand-charcoal">
              {g.emoji} {g.subject}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {g.items.map((r) => (
                <div key={r.url} className="flex flex-col rounded-2xl border border-brand-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-extrabold text-brand-sage hover:underline">
                      {r.title} ↗
                    </a>
                    <span className="shrink-0 rounded-full bg-brand-cream px-2 py-0.5 text-xs font-bold text-brand-earth">Ages {r.ages}</span>
                  </div>
                  <p className="mt-1 flex-1 text-sm text-[#6E5A46]">{r.note}</p>
                  {isParent && (
                    <div className="mt-3">
                      {added.has(r.url) ? (
                        <span className="text-xs font-bold text-brand-sage">✓ Added to your Resources</span>
                      ) : (
                        <button
                          onClick={() => add(g.subject, r.title, r.url, r.note)}
                          disabled={busy === r.url}
                          className="rounded-lg border border-brand-line px-3 py-1 text-xs font-bold text-brand-earth hover:border-brand-softsage disabled:opacity-50"
                        >
                          {busy === r.url ? "Adding..." : `+ Add to "${g.subject === "All subjects" ? "General" : g.subject}"`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
