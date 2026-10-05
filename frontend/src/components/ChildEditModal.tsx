"use client";

import { FormEvent, useEffect, useState } from "react";
import { checkChildLoginName, updateChild } from "@/lib/api";
import { Child } from "@/types";

const input =
  "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20";
const label = "block text-sm font-semibold text-[#2E342F] mb-1.5";

export type ActivityLevel = "little" | "young" | "teen" | "both";

const LEVELS: { id: ActivityLevel; title: string; text: string }[] = [
  { id: "little", title: "Little Roots", text: "Ages 3 to 4: story books you do together, with no login" },
  { id: "young", title: "Saplings", text: "Ages 5 to 10: cookbook, crafts, P.E., Outdoors and life skills, with their own login" },
  { id: "teen", title: "Teens", text: "Ages 11 to 16: the Teens menu with cooking, projects, P.E., outdoors, life skills and exams" },
  { id: "both", title: "Everything", text: "Show every age group" },
];

/** Which activity pages a child sees. A choice of pages, so nobody has to give a date of birth. */
export function ActivityLevelPicker({ value, onChange }: { value: ActivityLevel; onChange: (level: ActivityLevel) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {LEVELS.map((l) => (
        <button
          type="button"
          key={l.id}
          onClick={() => onChange(l.id)}
          aria-pressed={value === l.id}
          className={
            "rounded-xl border-2 p-3 text-left " +
            (value === l.id ? "border-brand-sage bg-brand-tint" : "border-brand-line bg-white hover:border-brand-softsage")
          }
        >
          <span className={"block text-sm font-extrabold " + (value === l.id ? "text-brand-sage" : "text-[#2E342F]")}>{l.title}</span>
          <span className="mt-0.5 block text-xs leading-snug text-[#6E5A46]">{l.text}</span>
        </button>
      ))}
    </div>
  );
}

/** Change a child's name, what they type to log in, and which activity pages they see. */
export default function ChildEditModal({ child, onClose, onSaved }: { child: Child; onClose: () => void; onSaved: (child: Child) => void }) {
  const [name, setName] = useState(child.username);
  const [loginName, setLoginName] = useState(child.login_name || "");
  const [level, setLevel] = useState<ActivityLevel>((child.activity_level as ActivityLevel) || "both");
  const [check, setCheck] = useState<{ login_name: string; available: boolean; suggestions: string[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loginChanged = loginName.trim().toLowerCase() !== (child.login_name || "").toLowerCase();

  // Check a new login name is free a moment after typing stops.
  useEffect(() => {
    if (!loginChanged || !loginName.trim()) {
      setCheck(null);
      return;
    }
    const timer = setTimeout(() => {
      checkChildLoginName(name.trim() || child.username, loginName)
        .then((res) => setCheck(res.data))
        .catch(() => {});
    }, 350);
    return () => clearTimeout(timer);
  }, [loginName, loginChanged, name, child.username]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter a name.");
    setSaving(true);
    setError("");
    try {
      const res = await updateChild(child.id, {
        username: name.trim(),
        ...(loginChanged && level !== "little" && loginName.trim() ? { login_name: loginName.trim() } : {}),
        activity_level: level,
      });
      onSaved(res.data);
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "That didn't save. Please try again.");
      setSaving(false);
    }
  };

  const checked = check && check.login_name.toLowerCase() === loginName.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E342F]/40 px-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D9D1C4] bg-brand-white shadow-xl"
      >
        <div className="border-b border-brand-line px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Child account</p>
          <h2 className="mt-1 text-xl font-bold text-[#2E342F]">Edit {child.username}</h2>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className={label} htmlFor="edit-child-name">Name</label>
            <input id="edit-child-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} className={input} />
          </div>

          {level !== "little" && (
          <div>
            <label className={label} htmlFor="edit-child-login">Login name</label>
            <input
              id="edit-child-login"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value.replace(/[^A-Za-z0-9._-]/g, ""))}
              maxLength={50}
              autoCapitalize="none"
              autoComplete="off"
              className={input}
            />
            {loginChanged && checked ? (
              check.available ? (
                <p className="mt-1.5 text-xs font-bold text-brand-sage">✓ {loginName} is free. They&apos;ll type this to log in from now on.</p>
              ) : (
                <div className="mt-1.5">
                  <p className="text-xs font-bold text-[#A64F42]">Someone else is already using that one. Try:</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {check.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setLoginName(s)}
                        className="rounded-full border-2 border-brand-line bg-white px-3 py-1 text-xs font-bold text-brand-sage hover:border-brand-softsage"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <p className="mt-1.5 text-xs text-[#8A7A69]">
                {child.activity_level === "little"
                  ? "Ready for their own login? Save, then use Reset password to give them a password."
                  : "What they type on the login page. Their password stays the same."}
              </p>
            )}
          </div>
          )}

          <div>
            <p className={label}>Which activities should they see?</p>
            <ActivityLevelPicker value={level} onChange={setLevel} />
            {level === "little" && child.activity_level !== "little" && (
              <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                Little Roots children don&apos;t log in, so {child.username}&apos;s login will stop working. Their planner, stars and reports all stay.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3">
              <p className="text-sm font-semibold text-[#A64F42]">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-bold text-[#6E5A46]">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
