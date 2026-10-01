"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { deleteAccount, exportAccount } from "@/lib/api";
import { clearAuth } from "@/lib/auth";

const inputClass =
  "w-full rounded-xl border-2 border-brand-softsage/30 bg-white px-4 py-2.5 outline-none transition-colors focus:border-brand-sage";

function errorText(err: unknown, fallback: string) {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}

/** Parent-only: download all the family's data, or delete the whole account. */
export default function YourDataCard({ canDelete = true }: { canDelete?: boolean }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const download = async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      const res = await exportAccount();
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bright-roots-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("We couldn't prepare your download. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const submitDelete = async (e: FormEvent) => {
    e.preventDefault();
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount(password, confirm);
      clearAuth();
      window.location.href = "/?deleted=1";
    } catch (err) {
      setDeleteError(errorText(err, "Something went wrong, so nothing has been deleted. Please try again."));
      setDeleting(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
      <h2 className="text-lg font-extrabold text-brand-charcoal">Your data</h2>
      <p className="mt-1 text-sm text-brand-earth/70">
        Download a copy of everything Bright Roots holds for your family, including photos and files. Read how
        we look after it in our{" "}
        <Link href="/privacy" className="font-semibold text-brand-sage underline">
          privacy policy
        </Link>
        .
      </p>
      <button
        onClick={download}
        disabled={downloading}
        className="mt-4 rounded-xl border-2 border-brand-sage bg-white px-5 py-2.5 text-sm font-extrabold text-brand-sage disabled:opacity-60"
      >
        {downloading ? "Preparing download..." : "Download my data"}
      </button>
      {downloadError && <p className="mt-2 text-sm font-semibold text-red-700">{downloadError}</p>}

      {canDelete && (
      <div className="mt-6 border-t border-brand-line pt-5">
        <h3 className="font-extrabold text-red-800">Delete account</h3>
        <p className="mt-1 text-sm text-brand-earth/70">
          This permanently deletes your account, all your children&apos;s accounts, and every plan, record, photo
          and file. Any membership is cancelled straight away. This can&apos;t be undone, so you may want to
          download your data first.
        </p>
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="mt-4 rounded-xl border-2 border-red-300 bg-white px-5 py-2.5 text-sm font-extrabold text-red-700 hover:bg-red-50"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={submitDelete} className="mt-4 space-y-3 rounded-xl border border-red-200 bg-red-50/60 p-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">Your password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">
                Type DELETE to confirm
              </label>
              <input
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoCapitalize="characters"
                className={inputClass}
              />
            </div>
            {deleteError && (
              <div className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700">
                {deleteError}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={deleting || confirm.trim().toUpperCase() !== "DELETE" || !password}
                className="rounded-xl bg-red-700 px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Permanently delete everything"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPassword("");
                  setConfirm("");
                  setDeleteError("");
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-brand-earth/80 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      )}
    </div>
  );
}
