"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  addChild,
  completeOnboarding,
  getChildren,
  getMe,
  getTimetable,
  requestEmailVerification,
  saveTimetable,
} from "@/lib/api";

type Child = { id: number; username: string; email: string };
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationSending, setVerificationSending] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [childUsername, setChildUsername] = useState("");
  const [childEmail, setChildEmail] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [childError, setChildError] = useState("");
  const [childSaving, setChildSaving] = useState(false);
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [timetableSaving, setTimetableSaving] = useState(false);
  const [finishError, setFinishError] = useState("");

  const progress = useMemo(() => String(step) + " of 3", [step]);

  const refreshAccount = async () => {
    const res = await getMe();
    if (res.data.role !== "parent") {
      router.replace("/child");
      return;
    }
    if (res.data.onboarding_completed_at) {
      router.replace("/parent/dashboard");
      return;
    }
    setEmail(res.data.email || "");
    setEmailVerified(!!res.data.email_verified_at);
  };

  useEffect(() => {
    Promise.all([getMe(), getChildren(), getTimetable()])
      .then(([meRes, childRes, timetableRes]) => {
        if (meRes.data.role !== "parent") {
          router.replace("/child");
          return;
        }
        if (meRes.data.onboarding_completed_at) {
          router.replace("/parent/dashboard");
          return;
        }
        setEmail(meRes.data.email || "");
        setEmailVerified(!!meRes.data.email_verified_at);
        setChildren(childRes.data || []);
        setTimetable(timetableRes.data.config || {});
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const sendVerification = async () => {
    setVerificationMessage("");
    setVerificationSending(true);
    try {
      const res = await requestEmailVerification();
      setVerificationMessage(res.data.message || "Verification email sent.");
    } catch (err: any) {
      setVerificationMessage(err.response?.data?.detail || "Could not send verification email.");
    } finally {
      setVerificationSending(false);
    }
  };

  const createChild = async (event: FormEvent) => {
    event.preventDefault();
    setChildError("");
    if (childPassword.length < 8) {
      setChildError("Password must be at least 8 characters.");
      return;
    }
    setChildSaving(true);
    try {
      const res = await addChild({
        username: childUsername.trim(),
        email: childEmail.trim(),
        password: childPassword,
      });
      setChildren((prev) => [...prev, res.data]);
      setChildUsername("");
      setChildEmail("");
      setChildPassword("");
      setStep(3);
    } catch (err: any) {
      setChildError(err.response?.data?.detail || "Could not add child.");
    } finally {
      setChildSaving(false);
    }
  };

  const finishSetup = async () => {
    setFinishError("");
    setTimetableSaving(true);
    try {
      await saveTimetable(timetable);
      await completeOnboarding();
      router.replace("/parent");
    } catch (err: any) {
      setFinishError(err.response?.data?.detail || "Could not finish setup.");
      setTimetableSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <p className="font-bold text-[#6E5A46]">Preparing your Bright Roots setup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F2E8] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Bright Roots" width={52} height={52} className="rounded-2xl" />
            <div>
              <p className="text-xl font-extrabold text-[#3F5D46]">Bright Roots</p>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E5A46]/60">First-time setup</p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-extrabold text-[#3F5D46]">Step {progress}</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={"h-2.5 w-16 rounded-full " + (item <= step ? "bg-[#3F5D46]" : "bg-[#D9D1C4]")}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E7DFD1] bg-[#FFFDF8] p-6 shadow-xl shadow-[#3F5D46]/5 sm:p-8">
          {step === 1 && (
            <section>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8FA382]">Welcome</p>
              <h1 className="mt-2 text-3xl font-black text-[#2E342F]">Let&apos;s get your family set up.</h1>
              <p className="mt-3 text-[#6E5A46]">
                We&apos;ll check your account, add your first child and set a simple weekly timetable. You can change everything later.
              </p>

              <div className="mt-7 rounded-2xl border border-[#E7DFD1] bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-[#2E342F]">Parent email</p>
                    <p className="mt-1 text-sm text-[#6E5A46]">{email}</p>
                  </div>
                  <span className={"w-fit rounded-full px-3 py-1 text-xs font-extrabold " + (emailVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                    {emailVerified ? "Verified" : "Verification needed"}
                  </span>
                </div>

                {!emailVerified && (
                  <div className="mt-4">
                    <p className="text-sm text-[#6E5A46]">
                      Verify this email before continuing. The link will arrive from Bright Roots.
                    </p>
                    {verificationMessage && (
                      <div className="mt-3 rounded-xl bg-[#F7F2E8] px-4 py-3 text-sm font-semibold text-[#6E5A46]">
                        {verificationMessage}
                      </div>
                    )}
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={sendVerification} disabled={verificationSending} className="rounded-xl bg-[#3F5D46] px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">
                        {verificationSending ? "Sending..." : "Send verification email"}
                      </button>
                      <button type="button" onClick={refreshAccount} className="rounded-xl border border-[#D9D1C4] bg-white px-5 py-3 text-sm font-extrabold text-[#3F5D46]">
                        I&apos;ve verified it, check again
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button type="button" disabled={!emailVerified} onClick={() => setStep(2)} className="mt-7 w-full rounded-xl bg-[#3F5D46] px-5 py-3.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">
                Continue
              </button>
            </section>
          )}

          {step === 2 && (
            <section>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8FA382]">Your family</p>
              <h1 className="mt-2 text-3xl font-black text-[#2E342F]">Add your first child.</h1>
              <p className="mt-3 text-[#6E5A46]">
                They&apos;ll use their own username and password to open their learning dashboard.
              </p>

              {children.length > 0 ? (
                <div className="mt-7">
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                    <p className="font-extrabold text-green-800">
                      {children.length === 1 ? "1 child already added" : String(children.length) + " children already added"}
                    </p>
                    <p className="mt-1 text-sm text-green-700">
                      {children.map((child) => child.username).join(", ")}
                    </p>
                  </div>
                  <button type="button" onClick={() => setStep(3)} className="mt-6 w-full rounded-xl bg-[#3F5D46] px-5 py-3.5 text-sm font-extrabold text-white">
                    Continue to timetable
                  </button>
                </div>
              ) : (
                <form onSubmit={createChild} className="mt-7 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">Child username</label>
                    <input required value={childUsername} onChange={(e) => setChildUsername(e.target.value)} placeholder="e.g. Sam" className="w-full rounded-xl border-2 border-[#E7DFD1] bg-white px-4 py-3 outline-none focus:border-[#8FA382]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">Child email</label>
                    <input type="email" required value={childEmail} onChange={(e) => setChildEmail(e.target.value)} placeholder="child@example.com" className="w-full rounded-xl border-2 border-[#E7DFD1] bg-white px-4 py-3 outline-none focus:border-[#8FA382]" />
                    <p className="mt-1 text-xs text-[#6E5A46]/70">Used for the child account record. Children still sign in with their username.</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">Child password</label>
                    <input type="password" required minLength={8} value={childPassword} onChange={(e) => setChildPassword(e.target.value)} className="w-full rounded-xl border-2 border-[#E7DFD1] bg-white px-4 py-3 outline-none focus:border-[#8FA382]" />
                  </div>
                  {childError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{childError}</div>}
                  <button type="submit" disabled={childSaving} className="w-full rounded-xl bg-[#3F5D46] px-5 py-3.5 text-sm font-extrabold text-white disabled:opacity-60">
                    {childSaving ? "Adding child..." : "Add child and continue"}
                  </button>
                </form>
              )}
            </section>
          )}

          {step === 3 && (
            <section>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8FA382]">Your week</p>
              <h1 className="mt-2 text-3xl font-black text-[#2E342F]">Start with a simple timetable.</h1>
              <p className="mt-3 text-[#6E5A46]">
                We&apos;ve filled in a sensible starting week. Save it now, then customise subjects and days from Timetable anytime.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {days.map((day) => (
                  <div key={day} className="rounded-2xl border border-[#E7DFD1] bg-white p-4">
                    <p className="font-extrabold text-[#2E342F]">{day}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(timetable[day] || []).map((subject) => (
                        <span key={subject} className="rounded-full bg-[#E8EDE4] px-3 py-1 text-xs font-bold text-[#3F5D46]">{subject}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {finishError && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{finishError}</div>}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-[#D9D1C4] bg-white px-5 py-3.5 text-sm font-extrabold text-[#3F5D46]">Back</button>
                <button type="button" onClick={finishSetup} disabled={timetableSaving || children.length === 0} className="flex-1 rounded-xl bg-[#3F5D46] px-5 py-3.5 text-sm font-extrabold text-white disabled:opacity-50">
                  {timetableSaving ? "Finishing setup..." : "Save timetable and open planner"}
                </button>
              </div>
            </section>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-[#6E5A46]/60">
          You can change children, passwords, subjects and timetable settings later.
        </p>
      </div>
    </div>
  );
}
