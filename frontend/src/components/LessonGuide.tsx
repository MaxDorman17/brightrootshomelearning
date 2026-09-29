"use client";

import { useEffect, useState } from "react";
import { downloadResource, getResources } from "@/lib/api";
import { Lesson } from "@/types";
import Emoji from "@/components/Emoji";

type ResourceItem = { id: number; title: string; kind: "link" | "file"; url: string | null; original_name: string | null };

/** For children: the lesson's goal, a tick-list of its steps and any attached resources. */
export default function LessonGuide({ entryId, lesson }: { entryId: number; lesson: Lesson }) {
  const storageKey = `lesson_steps_${entryId}`;
  const steps = lesson.steps ?? [];
  const [done, setDone] = useState<number[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch {
      setDone([]);
    }
  }, [storageKey]);

  useEffect(() => {
    const ids = lesson.resource_ids ?? [];
    if (ids.length === 0) return;
    getResources()
      .then((res) => setResources((res.data.items as (ResourceItem & { id: number })[]).filter((r) => ids.includes(r.id))))
      .catch(() => {});
  }, [lesson.resource_ids]);

  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((d) => d !== i) : [...done, i];
    setDone(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const open = async (r: ResourceItem) => {
    if (r.kind === "link" && r.url) {
      window.open(r.url, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      const res = await downloadResource(r.id);
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.original_name || r.title;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {}
  };

  if (!lesson.objectives && steps.length === 0 && resources.length === 0) return null;

  return (
    <div className="mb-4 space-y-3">
      {lesson.objectives && (
        <div className="rounded-xl border border-brand-mist bg-brand-wash px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-sage"><Emoji e="🎯" /> What we&apos;ll learn</p>
          <p className="mt-1 text-sm text-brand-charcoal">{lesson.objectives}</p>
          {lesson.duration_minutes ? <p className="mt-1 text-xs text-[#6E5A46]">About {lesson.duration_minutes} minutes</p> : null}
        </div>
      )}

      {steps.length > 0 && (
        <div className="rounded-xl border border-brand-line bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-sage">✅ Steps</p>
            <p className="text-xs font-bold text-[#6E5A46]">{done.filter((d) => d < steps.length).length}/{steps.length}</p>
          </div>
          <ul className="mt-2 space-y-1.5">
            {steps.map((step, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} className="mt-0.5 h-4 w-4 accent-brand-sage" />
                  <span className={done.includes(i) ? "text-[#8A7A69] line-through" : "text-brand-charcoal"}>{step}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resources.length > 0 && (
        <div className="rounded-xl border border-brand-line bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-sage">📎 For this lesson</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {resources.map((r) => (
              <button key={r.id} onClick={() => open(r)} className="rounded-lg border border-brand-mist bg-brand-wash px-3 py-1.5 text-sm font-semibold text-brand-deep hover:bg-brand-tint">
                {r.kind === "link" ? "🔗" : "📄"} {r.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
