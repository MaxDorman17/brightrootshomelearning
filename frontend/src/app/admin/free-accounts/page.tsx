"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { FreeFamily, getFreeFamilies, giveFreeAccount, takeAwayFreeAccount } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";

const detail = (err: any, fallback: string) => (typeof err?.response?.data?.detail === "string" ? err.response.data.detail : fallback);

/** Owner only: give a family free membership (no payment, ever), or take it away. */
export default function FreeAccountsPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<FreeFamily[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const load = useCallback(() => getFreeFamilies().then((res) => setFamilies(res.data)).catch(() => setDenied(true)), []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  const give = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setDone("");
    try {
      const res = await giveFreeAccount(email);
      setDone(`${res.data.name} now has a free account.`);
      setEmail("");
      await load();
    } catch (err) {
      setError(detail(err, "Could not give a free account."));
    } finally {
      setBusy(false);
    }
  };

  const takeAway = async (family: FreeFamily) => {
    if (!confirm(`Take away ${family.name}'s free account? They'll be asked to choose a membership next time they log in.`)) return;
    setError("");
    setDone("");
    try {
      await takeAwayFreeAccount(family.id);
      setDone(`${family.name} no longer has a free account.`);
      await load();
    } catch (err) {
      setError(detail(err, "Could not take the free account away."));
    }
  };

  if (denied) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-[#6E5A46]">This page is only for the owner of Bright Roots.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHero art="account" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Owner</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Free accounts</h1>
          <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">
            A family with a free account can use everything and is never asked to pay. They sign up as normal first, then you add them here.
          </p>
        </PageHero>

        <section className="brand-card p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-brand-charcoal">Give a family a free account</h2>
          <form onSubmit={give} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="The email they signed up with"
              className="min-w-0 flex-1 rounded-xl border border-brand-line bg-white px-4 py-2.5 text-sm"
            />
            <button type="submit" disabled={busy} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50">
              {busy ? "Adding..." : "Make it free"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
          {done && <p className="mt-3 text-sm font-semibold text-brand-sage">{done}</p>}
        </section>

        <section className="brand-card mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-brand-charcoal">Families with a free account</h2>
          {families === null ? (
            <p className="mt-2 text-sm text-[#6E5A46]">Loading...</p>
          ) : families.length === 0 ? (
            <p className="mt-2 text-sm text-[#6E5A46]">None yet.</p>
          ) : (
            <div className="mt-2 divide-y divide-brand-line">
              {families.map((f) => (
                <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-bold text-brand-charcoal">{f.name}</p>
                    <p className="break-all text-[#6E5A46]">
                      {f.email}
                      {f.created_at && ` · joined ${format(parseISO(f.created_at), "d MMM yyyy")}`}
                    </p>
                  </div>
                  <button onClick={() => takeAway(f)} className="rounded-full border border-brand-line px-4 py-1.5 text-xs font-bold text-[#A64F42] hover:bg-white">
                    Take away
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
