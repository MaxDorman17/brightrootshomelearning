"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { addAdult, FamilyAdult, getAdults, removeAdult, resetAdultPassword, setAdultRelationship } from "@/lib/api";
import { DEFAULT_PARENT_AVATAR } from "@/lib/avatar";

// What a grown-up is to the children. Anything else can be typed in.
export const RELATIONSHIPS = ["Mum", "Dad", "Guardian", "Step-mum", "Step-dad", "Grandparent", "Carer", "Tutor"];

const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const label = "mb-1.5 block text-sm font-bold text-brand-charcoal";

function detail(err: unknown, fallback: string) {
  const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (typeof d === "string") return d;
  // Validation errors come back as a list of messages
  if (Array.isArray(d) && d[0]?.msg) return String(d[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function RelationshipPicker({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  const custom = value !== "" && !RELATIONSHIPS.includes(value);
  const [other, setOther] = useState(custom);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        id={id}
        value={other ? "__other" : value}
        onChange={(e) => {
          if (e.target.value === "__other") {
            setOther(true);
            onChange("");
          } else {
            setOther(false);
            onChange(e.target.value);
          }
        }}
        className={`${input} w-auto`}
      >
        <option value="">Not set</option>
        {RELATIONSHIPS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
        <option value="__other">Something else…</option>
      </select>
      {other && (
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Auntie, Nana"
          maxLength={30}
          className={`${input} w-44`}
        />
      )}
    </div>
  );
}

function AdultRow({ adult, canManage, onChanged }: { adult: FamilyAdult; canManage: boolean; onChanged: () => void }) {
  const [relationship, setRelationship] = useState(adult.relationship || "");
  const [saved, setSaved] = useState("");
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const canEdit = canManage || adult.is_you;

  const save = async (value: string) => {
    setRelationship(value);
    setSaved("");
    try {
      await setAdultRelationship(adult.id, value);
      setSaved("Saved");
      window.dispatchEvent(new Event("avatar-changed"));
    } catch (err) {
      setError(detail(err, "That didn't save."));
    }
  };

  const reset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await resetAdultPassword(adult.id, newPassword);
      setResetting(false);
      setNewPassword("");
      setSaved("Password changed");
    } catch (err) {
      setError(detail(err, "That didn't work."));
    }
  };

  const remove = async () => {
    if (!confirm(`Remove ${adult.username}? They won't be able to log in any more. Everything they added to the family stays.`)) return;
    try {
      await removeAdult(adult.id);
      onChanged();
    } catch (err) {
      setError(detail(err, "That didn't work."));
    }
  };

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Avatar username={adult.username} avatar={adult.avatar ?? DEFAULT_PARENT_AVATAR} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-brand-charcoal">
            {adult.username}
            {adult.is_you && <span className="ml-2 text-xs font-bold text-brand-earth/60">(you)</span>}
          </p>
          <p className="text-xs font-semibold text-brand-earth/70">{adult.is_owner ? "Main account holder" : "Has their own login"}</p>
        </div>
        {canEdit ? (
          <RelationshipPicker id={`rel-${adult.id}`} value={relationship} onChange={save} />
        ) : (
          <span className="text-sm font-bold text-brand-earth">{adult.relationship || ""}</span>
        )}
      </div>
      {canManage && !adult.is_owner && (
        <div className="mt-2 flex flex-wrap gap-4 pl-[3.75rem] text-xs font-bold">
          <button onClick={() => setResetting((v) => !v)} className="text-brand-sage hover:underline">
            {resetting ? "Cancel" : "Reset password"}
          </button>
          <button onClick={remove} className="text-[#A64F42] hover:underline">
            Remove
          </button>
        </div>
      )}
      {resetting && (
        <form onSubmit={reset} className="mt-3 flex flex-wrap items-center gap-2 pl-[3.75rem]">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (8 or more characters)"
            minLength={8}
            required
            autoComplete="new-password"
            className={`${input} w-72 max-w-full`}
          />
          <button type="submit" className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white">
            Save
          </button>
        </form>
      )}
      {saved && <p className="mt-1 pl-[3.75rem] text-xs font-bold text-brand-sage">{saved}</p>}
      {error && <p className="mt-1 pl-[3.75rem] text-xs font-bold text-[#A64F42]">{error}</p>}
    </li>
  );
}

/** Account page: who the grown-ups are (Mum, Dad, Guardian...) and adding another parent with their own login. */
export default function FamilyAdultsCard() {
  const [adults, setAdults] = useState<FamilyAdult[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [maxExtra, setMaxExtra] = useState(3);
  const [adding, setAdding] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [relationship, setRelationship] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    getAdults()
      .then((res) => {
        setAdults(res.data.adults);
        setCanManage(res.data.can_manage);
        setMaxExtra(res.data.max_extra);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addAdult({ username: username.trim(), password, relationship: relationship || undefined });
      setAdding(false);
      setUsername("");
      setPassword("");
      setRelationship("");
      load();
    } catch (err) {
      setError(detail(err, "That didn't work. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (adults.length === 0) return null;
  const extra = adults.filter((a) => !a.is_owner).length;

  return (
    <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
      <h2 className="text-lg font-extrabold text-brand-charcoal">Grown-ups on this account</h2>
      <p className="mt-1 text-sm text-brand-earth/70">
        Both parents, a guardian or a grandparent can each have their own login for the same family. Say who each person is
        to the children, and it shows on notes you leave them.
      </p>
      <ul className="mt-2 divide-y divide-brand-line">
        {adults.map((a) => (
          <AdultRow key={`${a.id}-${a.relationship ?? ""}`} adult={a} canManage={canManage} onChanged={load} />
        ))}
      </ul>

      {canManage && !adding && extra < maxExtra && (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 rounded-xl border-2 border-brand-sage bg-white px-5 py-2.5 text-sm font-extrabold text-brand-sage"
        >
          + Add another grown-up
        </button>
      )}
      {!canManage && (
        <p className="mt-2 text-xs text-brand-earth/70">Only the main account holder can add or remove grown-ups, manage billing or delete the account.</p>
      )}

      {adding && (
        <form onSubmit={submit} className="mt-3 space-y-4 rounded-xl border border-brand-line bg-white p-4">
          <p className="text-sm text-brand-earth/80">
            They&apos;ll log in on the normal login page with this username and password, and see everything you do.
            They can change their password after logging in.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="adult-username">Their username</label>
              <input id="adult-username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} maxLength={50} autoComplete="off" className={input} />
            </div>
            <div>
              <label className={label} htmlFor="adult-password">A password for them</label>
              <input id="adult-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="8 or more characters" className={input} />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="rel-new">Who are they to the children?</label>
            <RelationshipPicker id="rel-new" value={relationship} onChange={setRelationship} />
          </div>
          {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60">
              {saving ? "Adding…" : "Add grown-up"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-xl border-2 border-brand-line bg-white px-5 py-2.5 text-sm font-extrabold text-brand-sage">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
