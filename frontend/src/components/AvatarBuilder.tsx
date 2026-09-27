"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { AVATAR_BACKGROUNDS, AVATAR_EMOJIS, AVATAR_FRAMES, AvatarChoice, DEFAULT_AVATAR } from "@/lib/avatar";

type Props = {
  username: string;
  initial?: AvatarChoice | null;
  onSave: (choice: AvatarChoice) => Promise<void>;
  onCancel?: () => void;
};

export default function AvatarBuilder({ username, initial, onSave, onCancel }: Props) {
  const [choice, setChoice] = useState<AvatarChoice>(initial ?? DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await onSave(choice);
      setMessage("Saved!");
    } catch {
      setMessage("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center py-2">
        <Avatar username={username} avatar={choice} size="lg" />
      </div>

      <p className="mb-2 mt-4 text-sm font-bold text-brand-charcoal">Character</p>
      <div className="grid grid-cols-9 gap-1.5 sm:grid-cols-12">
        {AVATAR_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setChoice((prev) => ({ ...prev, emoji }))}
            aria-pressed={choice.emoji === emoji}
            className={
              "flex aspect-square items-center justify-center rounded-xl text-xl transition-transform hover:scale-110 " +
              (choice.emoji === emoji ? "bg-brand-tint ring-2 ring-brand-sage" : "bg-white")
            }
          >
            {emoji}
          </button>
        ))}
      </div>

      <p className="mb-2 mt-4 text-sm font-bold text-brand-charcoal">Background</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(AVATAR_BACKGROUNDS).map(([key, bg]) => (
          <button
            key={key}
            type="button"
            onClick={() => setChoice((prev) => ({ ...prev, bg: key }))}
            aria-label={bg.label}
            aria-pressed={choice.bg === key}
            className={`h-9 w-9 rounded-full ${bg.className} ${choice.bg === key ? "ring-2 ring-brand-sage ring-offset-2" : ""}`}
          />
        ))}
      </div>

      <p className="mb-2 mt-4 text-sm font-bold text-brand-charcoal">Frame</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(AVATAR_FRAMES).map(([key, frame]) => (
          <button
            key={key}
            type="button"
            onClick={() => setChoice((prev) => ({ ...prev, frame: key }))}
            aria-pressed={choice.frame === key}
            className={
              "rounded-xl border px-3 py-1.5 text-sm font-semibold " +
              (choice.frame === key ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-[#6E5A46]")
            }
          >
            {frame.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save avatar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-bold text-[#6E5A46]">
            Close
          </button>
        )}
        {message && <span className="text-sm font-semibold text-brand-sage">{message}</span>}
      </div>
    </div>
  );
}
