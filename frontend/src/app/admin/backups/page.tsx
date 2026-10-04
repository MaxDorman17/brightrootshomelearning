"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { BackupStatus, getBackupStatus, runBackupNow } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";

const when = (iso: string | null) => (iso ? format(parseISO(iso), "EEE d MMM yyyy, HH:mm") : "");

/** Owner only: shows that the nightly off-site backup is working, and runs one on demand. */
export default function BackupsPage() {
  const router = useRouter();
  const [data, setData] = useState<BackupStatus | null>(null);
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => getBackupStatus().then((res) => setData(res.data)).catch(() => setDenied(true)), []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  // Keep checking while a backup is running.
  const running = !!data?.runs.some((r) => r.status === "running");
  useEffect(() => {
    if (!running) return;
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, [running, load]);

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      await runBackupNow();
      await load();
    } catch (err: any) {
      setError(typeof err?.response?.data?.detail === "string" ? err.response.data.detail : "Could not start the backup.");
    } finally {
      setBusy(false);
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

  const lastOk = data?.last_ok;
  const stale = lastOk?.started_at ? Date.now() - parseISO(lastOk.started_at).getTime() > 36 * 3600 * 1000 : true;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHero art="account" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Owner</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Backups</h1>
          <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">
            Every night the database and all uploaded photos and files are copied to storage away from the server.
          </p>
        </PageHero>

        {data && !data.configured && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <p className="font-extrabold">Backups are not switched on yet.</p>
            <p className="mt-1">
              Add these five settings to the backend on the server, then redeploy it: <code>BACKUP_S3_ENDPOINT</code>, <code>BACKUP_S3_REGION</code>,{" "}
              <code>BACKUP_S3_BUCKET</code>, <code>BACKUP_S3_ACCESS_KEY</code> and <code>BACKUP_S3_SECRET_KEY</code>.
            </p>
          </div>
        )}

        {data?.configured && (
          <div className={"rounded-2xl border p-5 " + (stale ? "border-[#E9B8AE] bg-[#FBEFEB]" : "border-brand-mist bg-brand-wash")}>
            <p className={"text-lg font-extrabold " + (stale ? "text-[#A64F42]" : "text-brand-sage")}>
              {lastOk?.started_at
                ? stale
                  ? `The last good backup was ${formatDistanceToNow(parseISO(lastOk.started_at))} ago. That is too long.`
                  : `Backed up ${formatDistanceToNow(parseISO(lastOk.started_at))} ago.`
                : "No backup has finished yet."}
            </p>
            {lastOk?.detail && <p className="mt-1 text-sm text-brand-charcoal">{lastOk.detail}</p>}
            <p className="mt-2 text-xs text-[#6E5A46]">
              Stored in the bucket &ldquo;{data.bucket}&rdquo;. It runs every night after {data.hour}:00 and keeps {data.keep_days} days of database copies.
            </p>
            <button onClick={run} disabled={busy || running} className="mt-4 rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50">
              {running ? "Backing up..." : "Back up now"}
            </button>
            {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
          </div>
        )}

        {data && data.runs.length > 0 && (
          <section className="brand-card mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-brand-charcoal">Recent backups</h2>
            <div className="mt-2 divide-y divide-brand-line">
              {data.runs.map((r) => (
                <div key={r.id} className="py-2.5 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-brand-charcoal">
                      {when(r.started_at)} <span className="font-normal text-[#6E5A46]">· {r.kind === "nightly" ? "Nightly" : "Run by you"}</span>
                    </span>
                    <span
                      className={
                        "rounded-full px-2.5 py-0.5 text-xs font-bold " +
                        (r.status === "ok" ? "bg-brand-tint text-brand-sage" : r.status === "failed" ? "bg-[#FBEFEB] text-[#A64F42]" : "bg-[#F3EAD7] text-[#7A5B22]")
                      }
                    >
                      {r.status === "ok" ? "Worked" : r.status === "failed" ? "Failed" : "Running"}
                    </span>
                  </div>
                  {r.detail && <p className={"mt-0.5 break-words " + (r.status === "failed" ? "text-[#A64F42]" : "text-[#6E5A46]")}>{r.detail}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="brand-card mt-6 p-5 text-sm text-brand-charcoal sm:p-6">
          <h2 className="text-lg font-extrabold">Getting everything back</h2>
          <p className="mt-1 text-[#4A3B2C]">
            If the server is ever lost, the backup holds a copy of the database from each night and every uploaded file. The backend has a small tool,{" "}
            <code>restore_backup.py</code>, that downloads the lot into a folder ready to put on a new server. Ask Claude to walk you through it, and try it
            once before you need it.
          </p>
        </section>
      </div>
    </div>
  );
}
