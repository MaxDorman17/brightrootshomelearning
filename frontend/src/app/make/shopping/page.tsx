"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { addShopping, clearShopping, deleteShopping, getShopping, updateShopping } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";

type Line = { id: number; name: string; qty: string | null; sources: string | null; done: boolean };

export default function ShoppingListPage() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[] | null>(null);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    getShopping()
      .then((res) => setLines(res.data))
      .catch(() => setLines([]));
  }, [router]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await addShopping(name, qty);
    setLines(res.data);
    setName("");
    setQty("");
  };

  const toggle = async (line: Line) => {
    setLines((prev) => (prev || []).map((l) => (l.id === line.id ? { ...l, done: !l.done } : l)));
    await updateShopping(line.id, { done: !line.done }).catch(() => {});
  };

  const remove = async (line: Line) => {
    setLines((prev) => (prev || []).filter((l) => l.id !== line.id));
    await deleteShopping(line.id).catch(() => {});
  };

  const todo = (lines || []).filter((l) => !l.done);
  const done = (lines || []).filter((l) => l.done);

  const share = async () => {
    const text = "Shopping list\n" + todo.map((l) => `• ${l.qty ? `${l.qty} ` : ""}${l.name}`).join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Shopping list", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const row = (l: Line) => (
    <li key={l.id} className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-3 py-2.5">
      <input type="checkbox" checked={l.done} onChange={() => toggle(l)} className="h-5 w-5 shrink-0 accent-brand-sage" aria-label={`Got ${l.name}`} />
      <div className="min-w-0 flex-1">
        <p className={l.done ? "text-brand-earth/50 line-through" : "font-semibold text-brand-charcoal"}>
          {l.qty && <span className="font-extrabold">{l.qty} </span>}
          {l.name}
        </p>
        {l.sources && <p className="truncate text-xs text-brand-earth/60">For {l.sources}</p>}
      </div>
      <button onClick={() => remove(l)} className="shrink-0 rounded-lg px-2 py-1 text-brand-earth/50 hover:bg-brand-cream print:hidden" aria-label={`Remove ${l.name}`}>
        ✕
      </button>
    </li>
  );

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <Navbar />
      </div>
      <PrintableList lines={todo} />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 print:hidden">
        <div className="print:hidden">
          <Link href="/make/cookbook" className="text-sm font-bold text-brand-sage hover:underline">
            ← Cookbook
          </Link>
        </div>
        <PageHero art="shopping" tint={1}>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage print:hidden">Make together</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">🛒 Shopping list</h1>
        <p className="mt-2 text-sm text-brand-earth/70 print:hidden">
          Add ingredients and materials from any recipe or craft, or type your own. Tick things off as you shop.
        </p>
        </PageHero>

        <form onSubmit={add} className="mt-5 flex gap-2 print:hidden">
          <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Amount" className="w-24 shrink-0 rounded-xl border-2 border-brand-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-softsage" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add something, e.g. milk" className="min-w-0 flex-1 rounded-xl border-2 border-brand-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-softsage" />
          <button type="submit" className="shrink-0 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white">
            Add
          </button>
        </form>

        {lines === null ? (
          <p className="mt-8 text-sm text-brand-earth/70">Loading...</p>
        ) : lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-brand-line p-8 text-center text-sm text-brand-earth/70">
            Your list is empty. Open a{" "}
            <Link href="/make/cookbook" className="font-bold text-brand-sage underline">
              recipe
            </Link>{" "}
            or{" "}
            <Link href="/make/crafts" className="font-bold text-brand-sage underline">
              craft
            </Link>{" "}
            and tap &quot;Add to shopping list&quot;.
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2 print:hidden">
              <button onClick={share} disabled={!todo.length} className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage disabled:opacity-50">
                {copied ? "Copied!" : "📤 Share or copy"}
              </button>
              <button onClick={() => window.print()} className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-sagedark">
                🖨️ Print list
              </button>
            </div>
            <ul className="mt-4 space-y-2">{todo.map(row)}</ul>
            {done.length > 0 && (
              <div className="mt-6 print:hidden">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-brand-earth/70">Got it ({done.length})</p>
                  <button
                    onClick={async () => {
                      const res = await clearShopping(true);
                      setLines(res.data);
                    }}
                    className="text-sm font-bold text-brand-sage hover:underline"
                  >
                    Clear ticked items
                  </button>
                </div>
                <ul className="mt-2 space-y-2">{done.map(row)}</ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** A plain black-and-white list, only shown when printing: tick boxes, amounts and what each item is for. */
function PrintableList({ lines }: { lines: Line[] }) {
  return (
    <div className="hidden bg-white p-8 text-black print:block">
      <div className="flex items-end justify-between border-b-2 border-black pb-2">
        <h1 className="text-3xl font-extrabold">Shopping list</h1>
        <p className="text-sm" suppressHydrationWarning>
          Bright Roots · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>
      {lines.length === 0 ? (
        <p className="mt-6">Nothing on the list.</p>
      ) : (
        <ul className="mt-4 columns-2 gap-10">
          {lines.map((l) => (
            <li key={l.id} className="flex break-inside-avoid items-start gap-3 border-b border-gray-300 py-2">
              <span className="mt-0.5 inline-block h-4 w-4 shrink-0 border-2 border-black" />
              <span className="min-w-0">
                <span className="font-semibold">
                  {l.qty && <b>{l.qty} </b>}
                  {l.name}
                </span>
                {l.sources && <span className="block text-xs text-gray-600">For {l.sources}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
