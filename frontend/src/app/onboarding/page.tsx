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
import {
  DEFAULT_SELECTED_SUBJECTS,
  SUBJECT_OPTIONS,
  WEEK_DAYS as days,
  buildTimetable,
  subjectsInTimetable,
} from "@/lib/subjects";

type Child = { id: number; username: string; email: string | null };
const TOTAL_STEPS = 4;

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
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(DEFAULT_SELECTED_SUBJECTS);
  const [customSubject, setCustomSubject] = useState("");
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [timetableSaving, setTimetableSaving] = useState(false);
  const [finishError, setFinishError] = useState("");

  const progress = useMemo(() => String(step) + " of " + String(TOTAL_STEPS), [step]);
  const subjectChoices = useMemo(
    () => [...SUBJECT_OPTIONS, ...selectedSubjects.filter((subject) => !SUBJECT_OPTIONS.includes(subject))],
    [selectedSubjects]
  );

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
        // Only reuse a timetable this parent has actually saved, not the server default.
        if (timetableRes.data.updated_at) {
          const saved = subjectsInTimetable(timetableRes.data.config || {});
          if (saved.length > 0) setSelectedSubjects(saved);
        }
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
        email: childEmail.trim() || undefined,
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

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((item) => item !== subject) : [...prev, subject]
    );
  };

  const addCustomSubject = () => {
    const subject = customSubject.trim();
    if (!subject) return;
    const existing = subjectChoices.find((item) => item.toLowerCase() === subject.toLowerCase());
    const name = existing ?? subject;
    setSelectedSubjects((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setCustomSubject("");
  };

  const continueToWeek = () => {
    setTimetable(buildTimetable(selectedSubjects));
    setStep(4);
  };

  const removeFromDay = (day: string, subject: string) => {
    setTimetable((prev) => ({ ...prev, [day]: (prev[day] || []).filter((item) => item !== subject) }));
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
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((item) => (
              <div
                key={item}
                className={"h-2.5 w-12 rounded-full sm:w-16 " + (item <= step ? "bg-[#3F5D46]" : "bg-[#D9D1C4]")}
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
                We&apos;ll check your account, add your first child, choose your subjects and build a simple weekly timetable. You can change everything later.
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
                    Continue to subjects
                  </button>
                </div>
              ) : (
                <form onSubmit={createChild} className="mt-7 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">Child username</label>
                    <input required value={childUsername} onChange={(e) => setChildUsername(e.target.value)} placeholder="e.g. Sam" className="w-full rounded-xl border-2 border-[#E7DFD1] bg-white px-4 py-3 outline-none focus:border-[#8FA382]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">Child email <span className="font-normal text-[#6E5A46]/70">(optional)</span></label>
                    <input type="email" value={childEmail} onChange={(e) => setChildEmail(e.target.value)} placeholder="child@example.com" className="w-full rounded-xl border-2 border-[#E7DFD1] bg-white px-4 py-3 outline-none focus:border-[#8FA382]" />
                    <p className="mt-1 text-xs text-[#6E5A46]/70">Leave blank if your child doesn&apos;t have an email. Children sign in with their username.</p>
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
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8FA382]">Your subjects</p>
              <h1 className="mt-2 text-3xl font-black text-[#2E342F]">What will you teach?</h1>
              <p className="mt-3 text-[#6E5A46]">
                Tick the subjects you want in your planner. We&apos;ll build your week from them.
              </p>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {subjectChoices.map((subject) => {
                  const checked = selectedSubjects.includes(subject);
                  return (
                    <label
                      key={subject}
                      className={
                        "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-colors " +
                        (checked ? "border-[#8FA382] bg-[#EAF0E7] text-[#2E342F]" : "border-[#E7DFD1] bg-white text-[#6E5A46]")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSubject(subject)}
                        className="h-4 w-4 accent-[#3F5D46]"
                      />
                      {subject}
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSubject();
                    }
                  }}
                  maxLength={60}
                  placeholder="Add your own subject, e.g. Forest School"
                  className="min-w-0 flex-1 rounded-xl border-2 border-[#E7DFD1] bg-white px-4 py-3 text-sm outline-none focus:border-[#8FA382]"
                />
                <button type="button" onClick={addCustomSubject} className="rounded-xl border border-[#D9D1C4] bg-white px-5 py-3 text-sm font-extrabold text-[#3F5D46]">
                  Add
                </button>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-[#D9D1C4] bg-white px-5 py-3.5 text-sm font-extrabold text-[#3F5D46]">Back</button>
                <button type="button" onClick={continueToWeek} disabled={selectedSubjects.length === 0} className="flex-1 rounded-xl bg-[#3F5D46] px-5 py-3.5 text-sm font-extrabold text-white disabled:opacity-50">
                  {selectedSubjects.length === 0 ? "Choose at least one subject" : "Build my week"}
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8FA382]">Your week</p>
              <h1 className="mt-2 text-3xl font-black text-[#2E342F]">Here&apos;s your starting timetable.</h1>
              <p className="mt-3 text-[#6E5A46]">
                Built from your subjects. Tap a subject to remove it from that day, or change anything later from Timetable.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {days.map((day) => (
                  <div key={day} className="rounded-2xl border border-[#E7DFD1] bg-white p-4">
                    <p className="font-extrabold text-[#2E342F]">{day}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(timetable[day] || []).map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => removeFromDay(day, subject)}
                          aria-label={"Remove " + subject + " from " + day}
                          className="rounded-full bg-[#E8EDE4] px-3 py-1 text-xs font-bold text-[#3F5D46] hover:bg-[#F3E1DA] hover:text-[#A64F42]"
                        >
                          {subject} <span aria-hidden="true">×</span>
                        </button>
                      ))}
                      {(timetable[day] || []).length === 0 && (
                        <span className="text-xs text-[#8A7A69]">Free day</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {finishError && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{finishError}</div>}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(3)} className="rounded-xl border border-[#D9D1C4] bg-white px-5 py-3.5 text-sm font-extrabold text-[#3F5D46]">Back</button>
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
