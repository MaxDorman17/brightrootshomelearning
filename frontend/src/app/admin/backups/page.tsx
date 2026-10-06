"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { BackupStatus, Leftovers, getBackupStatus, getLeftovers, removeLeftovers, runBackupNow, sendTestErrorReport } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";

const when = (iso: string | null) => (iso ? format(parseISO(iso), "EEE d MMM yyyy, HH:mm") : "");

/** Owner only: shows that the nightly off-site backup is working, and runs one on demand. */
export default function BackupsPage() {
  const router = useRouter();
  const [data, setData] = useState<BackupStatus | null>(null);
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tested, setTested] = useState("");
  const [leftovers, setLeftovers] = useState<Leftovers | null>(null);
  const [cleared, setCleared] = useState("");
  const [clearing, setClearing] = useState(false);

  const load = useCallback(() => getBackupStatus().then((res) => setData(res.data)).catch(() => setDenied(true)), []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load();
    getLeftovers().then((res) => setLeftovers(res.data)).catch(() => {});
  }, [load, router]);

  const clearLeftovers = async () => {
    if (!leftovers || leftovers.total === 0) return;
    if (!confirm(`Delete ${leftovers.total} left-over records${leftovers.files ? ` and ${leftovers.files} files` : ""} for good? Nothing belonging to a family who still has an account is touched. Run a backup first if you haven't today.`)) return;
    setClearing(true);
    try {
      const res = await removeLeftovers();
      setCleared(`Deleted ${res.data.total} left-over records${res.data.files ? ` and ${res.data.files} files` : ""}.`);
      setLeftovers((await getLeftovers()).data);
    } finally {
      setClearing(false);
    }
  };

  // Keep checking while a backup is running.
  const running = !!data?.runs.some((r) => r.status === "running");
  useEffect(() => {
    if (!running) return;
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, [running, load]);

  // Breaks the server and this page on purpose, once each, so both kinds of report can be checked.
  const testReports = async () => {
    setTested("Sending...");
    await sendTestErrorReport().catch(() => {});
    setTimeout(() => {
      throw new Error("Test error report from the website, sent on purpose by the site owner");
    }, 0);
    setTested("Sent. Two test reports should appear in GlitchTip within a minute: one in backend, one in website.");
  };

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

        {leftovers && (
          <section className="brand-card mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-brand-charcoal">Left-over data</h2>
            <p className="mt-1 text-sm text-[#6E5A46]">
              Until October 2026, removing a child left their lessons, scores and stars behind in the database. This finds what is still pointing at someone who no longer has an account.
            </p>
            {leftovers.total === 0 ? (
              <p className="mt-3 text-sm font-bold text-brand-sage">{cleared || "Nothing left over."} All clear.</p>
            ) : (
              <>
                <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm text-brand-charcoal sm:grid-cols-2">
                  {Object.entries(leftovers.tables).map(([name, count]) => (
                    <li key={name} className="flex justify-between gap-3 border-b border-brand-line py-1">
                      <span>{name.replace(/_/g, " ")}</span>
                      <span className="font-bold">{count}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-[#6E5A46]">
                  {leftovers.total} records{leftovers.files ? ` and ${leftovers.files} uploaded files` : ""} in all. Run a backup first, then delete them.
                </p>
                <button onClick={clearLeftovers} disabled={clearing} className="mt-3 rounded-xl border border-[#D8D1C4] bg-brand-white px-4 py-2 text-sm font-bold text-[#A64F42] hover:border-brand-softsage disabled:opacity-50">
                  {clearing ? "Deleting..." : "Delete left-over data"}
                </button>
              </>
            )}
          </section>
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

        <section className="brand-card mt-6 p-5 text-sm text-brand-charcoal sm:p-6">
          <h2 className="text-lg font-extrabold">Error reports</h2>
          <p className="mt-1 text-[#4A3B2C]">
            When a page breaks or the server hits an unexpected error, a short report goes to GlitchTip. This button causes one harmless error of each
            kind, so you can check the reports are arriving.
          </p>
          <button onClick={testReports} className="mt-3 rounded-full border border-brand-line px-5 py-2.5 text-sm font-bold text-brand-sage hover:bg-white">
            Send test error reports
          </button>
          {tested && <p className="mt-3 font-semibold text-brand-sage">{tested}</p>}
        </section>
      </div>
    </div>
  );
}
