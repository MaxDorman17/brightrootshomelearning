"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  addMakeItem,
  deleteMakePhoto,
  getMakeItem,
  MakeItemBody,
  MakeKind,
  MakeMaterial,
  MakeStep,
  updateMakeItem,
  uploadMakePhoto,
} from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { errorText, forgetMakePhoto, KIND_INFO } from "./common";
import Emoji, { EmojiText } from "@/components/Emoji";

const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const label = "mb-1.5 block text-sm font-bold text-brand-charcoal";

/** Add or edit a family's own recipe or craft. */
export default function MakeEditor({ kind: initialKind, id, teen = false }: { kind?: MakeKind; id?: number; teen?: boolean }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(!id);
  const [kind, setKind] = useState<MakeKind>(initialKind || "recipe");
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [minutes, setMinutes] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  // Added from a Teens page: start at 11 so it shows there (it can be changed).
  const [ageFrom, setAgeFrom] = useState(teen ? "11" : initialKind === "little" ? "3" : "");
  const [serves, setServes] = useState("");
  const [materials, setMaterials] = useState<MakeMaterial[]>([{ name: "", qty: "" }]);
  const [steps, setSteps] = useState<MakeStep[]>([{ text: "", grown_up: false }]);
  const [tips, setTips] = useState("");
  // Little Roots only: one question or prompt per line
  const [talk, setTalk] = useState("");
  const [more, setMore] = useState("");
  const [easier, setEasier] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    if (!id) return;
    getMakeItem(id)
      .then((res) => {
        const d = res.data;
        if (!d.is_own) {
          router.replace(`/make/${id}`);
          return;
        }
        setKind(d.kind);
        setTitle(d.title);
        setEmoji(d.emoji || "");
        setSummary(d.summary || "");
        setCategory(d.category || "");
        setMinutes(d.minutes ? String(d.minutes) : "");
        setDifficulty(d.difficulty || "easy");
        setAgeFrom(d.age_from ? String(d.age_from) : "");
        setServes(d.serves || "");
        setMaterials(d.materials.length ? d.materials : [{ name: "", qty: "" }]);
        setSteps(d.steps.length ? d.steps : [{ text: "", grown_up: false }]);
        setTips(d.tips || "");
        setTalk((d.talk || []).join("\n"));
        setMore(d.more || "");
        setEasier(d.easier || "");
        setHasPhoto(d.has_photo);
        setLoaded(true);
      })
      .catch(() => router.replace("/make/cookbook"));
  }, [id, router]);

  const info = KIND_INFO[kind];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body: MakeItemBody = {
      kind,
      title,
      emoji: emoji || null,
      summary: summary || null,
      category: category || null,
      minutes: minutes ? Number(minutes) : null,
      difficulty,
      age_from: ageFrom ? Number(ageFrom) : null,
      serves: kind === "craft" || kind === "little" ? null : serves || null,
      materials: materials.filter((m) => m.name.trim()),
      steps: steps.filter((s) => s.text.trim()),
      tips: tips || null,
      talk: kind === "little" ? talk.split("\n").map((t) => t.trim()).filter(Boolean) : [],
      more: kind === "little" ? more || null : null,
      easier: kind === "little" ? easier || null : null,
    };
    try {
      const res = id ? await updateMakeItem(id, body) : await addMakeItem(body);
      const savedId = res.data.id as number;
      if (photo) {
        await uploadMakePhoto(savedId, photo);
        forgetMakePhoto(savedId);
      } else if (removePhoto && hasPhoto) {
        await deleteMakePhoto(savedId);
        forgetMakePhoto(savedId);
      }
      router.push(`/make/${savedId}`);
    } catch (err) {
      setError(errorText(err, "Could not save. Please check the details and try again."));
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="px-6 py-10 text-sm text-brand-earth/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <form onSubmit={submit} className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href={id ? `/make/${id}` : info.path} className="text-sm font-bold text-brand-sage hover:underline">
          ← Back
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">{info.name}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
          {id ? `Edit ${info.one}` : `Add your own ${info.one}`}
        </h1>

        <div className="brand-card mt-6 space-y-4 p-5">
          {!id && (
            <div className="flex flex-wrap gap-2">
              {(["recipe", "craft", "pe", "outdoor", "life", "little"] as MakeKind[]).map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => setKind(k)}
                  className={
                    "rounded-xl border-2 px-4 py-2 text-sm font-extrabold " +
                    (kind === k ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                  }
                >
                  <EmojiText text={{ recipe: "🍳 Recipe", craft: "🎨 Craft", pe: "🏃 P.E. activity", outdoor: "🌳 Outdoor activity", life: "🧺 Life skill", little: "🌱 Little Roots" }[k]} />
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
            <div>
              <label className={label}>Name</label>
              <input required maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder={kind === "recipe" ? "e.g. Nana's pancakes" : kind === "pe" ? "e.g. Beanbag relay" : kind === "outdoor" ? "e.g. Woodland bug hunt" : kind === "life" ? "e.g. Defrost the freezer" : kind === "little" ? "e.g. Puddle splash count" : "e.g. Egg box caterpillar"} />
            </div>
            <div>
              <label className={label}>Emoji</label>
              <input maxLength={4} value={emoji} onChange={(e) => setEmoji(e.target.value)} className={`${input} text-center text-xl`} placeholder={kind === "recipe" ? "🥞" : kind === "pe" ? "🏃" : kind === "outdoor" ? "🌳" : kind === "life" ? "🧺" : kind === "little" ? "🌱" : "🐛"} />
            </div>
          </div>
          <div>
            <label className={label}>Short description</label>
            <input maxLength={300} value={summary} onChange={(e) => setSummary(e.target.value)} className={input} placeholder="One line about what it is" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Category</label>
              <input maxLength={40} value={category} onChange={(e) => setCategory(e.target.value)} className={input} placeholder={kind === "recipe" ? "e.g. Baking" : kind === "pe" ? "On your own / Group games" : kind === "outdoor" ? "e.g. Little explorers (5+)" : kind === "life" ? "e.g. Around the home" : kind === "little" ? "e.g. Early maths" : "e.g. Paper"} />
            </div>
            <div>
              <label className={label}>How long (minutes)</label>
              <input type="number" min={1} max={999} value={minutes} onChange={(e) => setMinutes(e.target.value)} className={input} />
            </div>
            <div>
              <label className={label}>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={input}>
                <option value="easy">Easy</option>
                <option value="medium">A bit trickier</option>
                <option value="tricky">Tricky</option>
              </select>
            </div>
            <div>
              <label className={label}>Suitable from age</label>
              <input type="number" min={1} max={18} value={ageFrom} onChange={(e) => setAgeFrom(e.target.value)} className={input} />
            </div>
            {kind !== "craft" && kind !== "little" && (
              <div>
                <label className={label}>{kind === "pe" || kind === "outdoor" ? "How many children" : "Makes / serves"}</label>
                <input maxLength={40} value={serves} onChange={(e) => setServes(e.target.value)} className={input} placeholder={kind === "pe" || kind === "outdoor" ? "e.g. 1 child, or 4 or more" : "e.g. 12 pancakes"} />
              </div>
            )}
          </div>
          <div>
            <label className={label}>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-brand-tint file:px-4 file:py-2 file:font-bold file:text-brand-sage"
            />
            {hasPhoto && !photo && (
              <label className="mt-2 flex items-center gap-2 text-sm text-brand-earth">
                <input type="checkbox" checked={removePhoto} onChange={(e) => setRemovePhoto(e.target.checked)} className="accent-brand-sage" />
                Remove the current photo
              </label>
            )}
          </div>
        </div>

        <div className="brand-card mt-5 p-5">
          <h2 className="text-lg font-extrabold text-brand-charcoal">{info.materials}</h2>
          <div className="mt-3 space-y-2">
            {materials.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={m.qty}
                  onChange={(e) => setMaterials(materials.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)))}
                  className={`${input.replace("w-full ", "")} w-20 shrink-0 sm:w-28`}
                  placeholder="200 g"
                  aria-label="Amount"
                />
                <input
                  value={m.name}
                  onChange={(e) => setMaterials(materials.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  className={`${input} min-w-0`}
                  placeholder={kind === "recipe" ? "plain flour" : kind === "pe" ? "football" : kind === "outdoor" ? "magnifying glass" : kind === "life" ? "screwdriver" : kind === "little" ? "soft toys" : "paper plate"}
                  aria-label="Item"
                />
                <button type="button" onClick={() => setMaterials(materials.filter((_, j) => j !== i))} className="shrink-0 rounded-lg px-2 text-brand-earth/60 hover:bg-brand-cream" aria-label="Remove">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setMaterials([...materials, { name: "", qty: "" }])} className="mt-3 text-sm font-bold text-brand-sage hover:underline">
            + Add another
          </button>
        </div>

        <div className="brand-card mt-5 p-5">
          <h2 className="text-lg font-extrabold text-brand-charcoal">Steps</h2>
          <p className="mt-1 text-xs text-brand-earth/70">Tick &quot;Grown-up job&quot; for anything hot, sharp or tricky.</p>
          <div className="mt-3 space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-sage text-xs font-black text-white">{i + 1}</span>
                <div className="flex-1">
                  <textarea
                    value={s.text}
                    onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                    rows={2}
                    className={input}
                  />
                  <label className="mt-1 flex items-center gap-2 text-xs font-bold text-brand-earth">
                    <input
                      type="checkbox"
                      checked={s.grown_up}
                      onChange={(e) => setSteps(steps.map((x, j) => (j === i ? { ...x, grown_up: e.target.checked } : x)))}
                      className="accent-brand-sage"
                    />
                    <Emoji e="🧑" /> Grown-up job
                  </label>
                </div>
                <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="h-fit shrink-0 rounded-lg px-2 py-2 text-brand-earth/60 hover:bg-brand-cream" aria-label="Remove step">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSteps([...steps, { text: "", grown_up: false }])} className="mt-3 text-sm font-bold text-brand-sage hover:underline">
            + Add a step
          </button>
        </div>

        {kind === "little" && (
          <div className="brand-card mt-5 space-y-4 p-5">
            <div>
              <label className={label}>What to say or ask</label>
              <textarea value={talk} onChange={(e) => setTalk(e.target.value)} rows={3} className={input} placeholder={"One per line, e.g.\nHow many are there?\nWhat do you think will happen?"} />
            </div>
            <div>
              <label className={label}>If they&apos;re ready for more</label>
              <textarea value={more} onChange={(e) => setMore(e.target.value)} rows={2} maxLength={1000} className={input} placeholder="A harder version or a next step" />
            </div>
            <div>
              <label className={label}>If it&apos;s not a good day</label>
              <textarea value={easier} onChange={(e) => setEasier(e.target.value)} rows={2} maxLength={1000} className={input} placeholder="A simpler version for tired days" />
            </div>
          </div>
        )}

        <div className="brand-card mt-5 p-5">
          <label className={label}>{kind === "little" ? "Keep it safe (optional)" : "Tips (optional)"}</label>
          <textarea value={tips} onChange={(e) => setTips(e.target.value)} rows={2} maxLength={2000} className={input} placeholder={kind === "little" ? "Safety notes, e.g. choking risks or allergies" : "Swaps, safety notes or ideas to try next time"} />
        </div>

        {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
        <div className="mt-5 flex gap-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-extrabold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
          <Link href={id ? `/make/${id}` : info.path} className="rounded-xl px-4 py-3 text-sm font-bold text-brand-earth/80 hover:underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
