"use client";

import { ChangeEvent, useRef, useState } from "react";
import Avatar, { forgetPhoto } from "@/components/Avatar";
import AvatarBuilder from "@/components/AvatarBuilder";
import { deleteChildPhoto, saveAvatar, saveChildColours, uploadChildPhoto } from "@/lib/api";
import { Child } from "@/types";
import ReadingComfort from "@/components/ReadingComfort";

type Props = {
  child: Child;
  onClose: () => void;
  onChanged: (child: Child) => void;
};

/** Parent view of one child's avatar, photo and colour settings. */
export default function ChildProfileModal({ child, onClose, onChanged }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const choosePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setMessage("Photos must be 5 MB or smaller.");
    setBusy(true);
    setMessage("");
    try {
      await uploadChildPhoto(child.id, file);
      forgetPhoto(child.id);
      setPhotoVersion((v) => v + 1);
      onChanged({ ...child, has_photo: true });
      setMessage("Photo added.");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setMessage(typeof detail === "string" ? detail : "Could not upload that photo.");
    } finally {
      setBusy(false);
    }
  };

  const removePhoto = async () => {
    if (!confirm(`Remove ${child.username}'s photo?`)) return;
    setBusy(true);
    try {
      await deleteChildPhoto(child.id);
      forgetPhoto(child.id);
      onChanged({ ...child, has_photo: false });
      setMessage("Photo removed. Their avatar shows instead.");
    } finally {
      setBusy(false);
    }
  };

  const resetColours = async () => {
    if (!confirm(`Reset ${child.username}'s colours back to the family theme?`)) return;
    await saveChildColours(null, {}, child.id);
    setMessage("Colours reset to the family theme.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-brand-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <Avatar
            username={child.username}
            avatar={child.avatar}
            hasPhoto={child.has_photo}
            childId={child.id}
            size="lg"
            photoVersion={photoVersion}
          />
          <div>
            <h2 className="text-xl font-bold text-brand-charcoal">{child.username}</h2>
            <p className="text-sm text-[#6E5A46]">Avatar, photo and colours</p>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-extrabold text-brand-charcoal">Photo</h3>
          <p className="mt-1 text-xs text-[#6E5A46]">
            Only you can add a photo. It shows instead of their avatar, and only your family can see it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={choosePhoto} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {child.has_photo ? "Change photo" : "Upload photo"}
            </button>
            {child.has_photo && (
              <button onClick={removePhoto} disabled={busy} className="rounded-xl border border-brand-line bg-white px-4 py-2 text-sm font-bold text-[#A64F42]">
                Remove photo
              </button>
            )}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-extrabold text-brand-charcoal">Easier to read</h3>
          <p className="mb-3 mt-1 text-xs text-[#6E5A46]">
            Bigger text or an easy-read font on {child.username}&apos;s pages. They can change it themselves under My Look.
          </p>
          <ReadingComfort childId={child.id} childName={child.username} />
        </section>

        <section className="mt-6">
          <h3 className="mb-2 text-sm font-extrabold text-brand-charcoal">Avatar</h3>
          <p className="mb-3 text-xs text-[#6E5A46]">{child.username} can change this themselves from their Account page.</p>
          <AvatarBuilder
            username={child.username}
            initial={child.avatar}
            onSave={async (choice) => {
              await saveAvatar(choice, child.id);
              onChanged({ ...child, avatar: choice });
            }}
          />
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-extrabold text-brand-charcoal">Colours</h3>
          <p className="mt-1 text-xs text-[#6E5A46]">{child.username} can pick their own theme and subject colours from their Account page.</p>
          <button onClick={resetColours} className="mt-2 rounded-xl border border-brand-line bg-white px-4 py-2 text-sm font-bold text-[#6E5A46]">
            Reset to family colours
          </button>
        </section>

        {message && <p className="mt-4 text-sm font-semibold text-brand-sage">{message}</p>}

        <button onClick={onClose} className="mt-6 w-full rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">
          Done
        </button>
      </div>
    </div>
  );
}
