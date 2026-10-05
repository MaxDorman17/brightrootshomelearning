"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getChildren, addChild, removeChild, resetChildPassword, checkChildLoginName } from "@/lib/api";
import { Child } from "@/types";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Avatar from "@/components/Avatar";
import ChildProfileModal from "@/components/ChildProfileModal";
import ChildEditModal, { ActivityLevel, ActivityLevelPicker } from "@/components/ChildEditModal";
import { format, parseISO } from "date-fns";

export default function ChildrenPage() {
  const router = useRouter();

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // What the child types to log in. Suggested from their name until the parent types their own.
  const [loginName, setLoginName] = useState("");
  const [loginTouched, setLoginTouched] = useState(false);
  const [loginCheck, setLoginCheck] = useState<{ login_name: string; available: boolean; suggestions: string[] } | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [resetChild, setResetChild] = useState<Child | null>(null);
  const [profileChild, setProfileChild] = useState<Child | null>(null);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [level, setLevel] = useState<ActivityLevel>("both");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }

    getChildren()
      .then(res => setChildren(res.data))
      .finally(() => setLoading(false));
  }, [router]);

  // Check the login name is free (and suggest some) a moment after the parent stops typing.
  useEffect(() => {
    if (!showModal || !username.trim() || level === "little") {
      setLoginCheck(null);
      if (!loginTouched) setLoginName("");
      return;
    }
    const timer = setTimeout(() => {
      checkChildLoginName(username.trim(), loginTouched ? loginName : "")
        .then((res) => {
          if (loginTouched) {
            setLoginCheck(res.data);
          } else {
            const pick = res.data.suggestions[0] || "";
            setLoginName(pick);
            setLoginCheck({ login_name: pick, available: !!pick, suggestions: res.data.suggestions });
          }
        })
        .catch(() => {});
    }, 350);
    return () => clearTimeout(timer);
  }, [showModal, username, loginName, loginTouched, level]);

  const little = level === "little";

  const handleAdd = async () => {
    if (!username.trim() || (!little && !password.trim())) return;

    setSaving(true);
    setError("");

    try {
      const res = await addChild(
        little
          ? { username: username.trim(), activity_level: level }
          : {
              username: username.trim(),
              login_name: loginName.trim() || undefined,
              email: email.trim() || undefined,
              password: password.trim(),
              activity_level: level,
            }
      );

      setChildren(prev => [...prev, res.data]);
      window.dispatchEvent(new Event("activity-levels-changed"));

      setUsername("");
      setEmail("");
      setPassword("");
      setLoginName("");
      setLoginTouched(false);
      setLevel("both");
      setShowModal(false);
    } catch (err: unknown) {
      const detail = (
        err as { response?: { data?: { detail?: string } } }
      )?.response?.data?.detail;

      setError(detail || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: number, name: string) => {
    if (!confirm(`Remove ${name}'s account? This will delete all their data.`)) {
      return;
    }

    await removeChild(id);
    setChildren(prev => prev.filter(child => child.id !== id));
    window.dispatchEvent(new Event("activity-levels-changed"));
  };

  const closeModal = () => {
    setShowModal(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setLoginName("");
    setLoginTouched(false);
    setLevel("both");
    setError("");
  };

  const closeResetModal = () => {
    setResetChild(null);
    setResetPassword("");
    setResetConfirm("");
    setResetError("");
    setResetMessage("");
  };

  const handleResetPassword = async () => {
    if (!resetChild) return;

    setResetError("");
    setResetMessage("");

    if (resetPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }

    if (resetPassword !== resetConfirm) {
      setResetError("The passwords do not match.");
      return;
    }

    setResetSaving(true);

    try {
      const res = await resetChildPassword(resetChild.id, resetPassword);
      setResetMessage(res.data.message || "Password reset successfully.");
      setResetPassword("");
      setResetConfirm("");
    } catch (err: unknown) {
      const detail = (
        err as { response?: { data?: { detail?: string } } }
      )?.response?.data?.detail;
      setResetError(detail || "Could not reset password.");
    } finally {
      setResetSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <PageHero art="children" tint={1}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage mb-2">
                Family Accounts
              </p>

              <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
                Children
              </h1>

              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Manage the child accounts connected to your Bright Roots family.
              </p>
              </PageHero>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Add Child
            </button>
          </div>
        </section>

        <section className="brand-card overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-brand-line flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
                Linked Accounts
              </p>
              <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                Your Children
              </h2>
            </div>

            {!loading && (
              <div className="rounded-full bg-brand-cream px-3 py-1.5 text-xs font-bold text-[#6E5A46]">
                {children.length} {children.length === 1 ? "child" : "children"}
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-brand-softsage">
              Loading...
            </div>
          ) : children.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-cream flex items-center justify-center text-brand-sage text-xl font-bold">
                BR
              </div>

              <h3 className="text-lg font-bold text-[#2E342F] mt-4">
                No child accounts yet
              </h3>

              <p className="text-sm text-[#6E5A46] mt-2 max-w-md mx-auto">
                Add a child account so they can sign in and see the lessons assigned to them.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark transition-colors"
              >
                Add your first child
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EEE6D9]">
              {children.map(child => (
                <div
                  key={child.id}
                  className="px-5 sm:px-6 py-5 flex items-center gap-4 hover:bg-brand-white transition-colors"
                >
                  <Avatar username={child.username} avatar={child.avatar} hasPhoto={child.has_photo} childId={child.id} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-bold text-[#2E342F]">
                        {child.username}
                      </p>

                      <span className="text-[10px] font-bold uppercase tracking-wide text-brand-softsage bg-brand-cream rounded-full px-2 py-1">
                        Child account
                      </span>
                    </div>

                    {child.activity_level === "little" && (
                      <p className="text-sm text-[#6E5A46] mt-1 truncate">
                        Little Roots · no login, you do it together
                      </p>
                    )}

                    {child.login_name && (
                      <p className="text-sm text-[#6E5A46] mt-1 truncate">
                        Logs in as <span className="font-bold text-[#2E342F]">{child.login_name}</span>
                        {child.activity_level && child.activity_level !== "both"
                          ? ` · sees ${child.activity_level === "teen" ? "teen" : "younger"} activities`
                          : ""}
                      </p>
                    )}

                    {child.email && (
                      <p className="text-sm text-[#6E5A46] mt-1 truncate">
                        {child.email}
                      </p>
                    )}

                    <p className="text-xs text-brand-softsage mt-1">
                      Added {format(parseISO(child.created_at), "d MMMM yyyy")}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => setEditChild(child)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-sage hover:bg-brand-tint transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setProfileChild(child)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-sage hover:bg-brand-tint transition-colors"
                    >
                      Avatar &amp; photo
                    </button>

                    {child.activity_level !== "little" && (
                    <button
                      onClick={() => {
                        setResetChild(child);
                        setResetError("");
                        setResetMessage("");
                      }}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-sage hover:bg-brand-tint transition-colors"
                    >
                      Reset password
                    </button>
                    )}

                    <button
                      onClick={() => handleRemove(child.id, child.username)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-[#B45F50] hover:bg-[#FBEFEB] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-brand-line bg-brand-cream p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
            How it works
          </p>

          <p className="text-sm text-[#6E5A46] mt-2 leading-relaxed">
            Each child gets their own login. Lessons can be assigned to a specific child in the Planner, or left unassigned so they are available to everyone.
          </p>
        </section>
      </main>

      {editChild && (
        <ChildEditModal
          child={editChild}
          onClose={() => setEditChild(null)}
          onSaved={(updated) => {
            setChildren((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
            setEditChild(null);
            // The menu shows or hides the Teens and younger pages to suit the children.
            window.dispatchEvent(new Event("activity-levels-changed"));
          }}
        />
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 px-4 flex items-center justify-center"
          onClick={event => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-brand-white border border-brand-line shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-brand-line">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
                New Account
              </p>

              <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                Add a Child
              </h2>

              <p className="text-sm text-[#6E5A46] mt-1">
                {little ? "Little ones do everything with you, so they don't need a login." : "Create their Bright Roots login details."}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Name
                  </label>

                  <input
                    autoFocus
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder="e.g. Oscar"
                    maxLength={50}
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20"
                  />
                </div>

                <div>
                  <p className="block text-sm font-semibold text-[#2E342F] mb-1.5">Which activities should they see?</p>
                  <ActivityLevelPicker value={level} onChange={setLevel} />
                  {little && (
                    <p className="mt-2 text-xs text-[#8A7A69]">
                      No login name or password needed. You&apos;ll do Little Roots together from your own account, and they still get their own planner, stars and reports.
                    </p>
                  )}
                </div>

                {!little && (<>
                <div>
                  <label htmlFor="child-login" className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Login name
                  </label>

                  <input
                    id="child-login"
                    value={loginName}
                    onChange={event => {
                      setLoginTouched(true);
                      setLoginName(event.target.value.replace(/[^A-Za-z0-9._-]/g, ""));
                    }}
                    placeholder="What they type to log in"
                    maxLength={50}
                    autoCapitalize="none"
                    autoComplete="off"
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20"
                  />

                  {loginName && loginCheck && loginCheck.login_name.toLowerCase() === loginName.toLowerCase() ? (
                    loginCheck.available ? (
                      <p className="mt-1.5 text-xs font-bold text-brand-sage">✓ {loginName} is free. This is what they&apos;ll type to log in.</p>
                    ) : (
                      <div className="mt-1.5">
                        <p className="text-xs font-bold text-[#A64F42]">Another family is already using that one. Try:</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {loginCheck.suggestions.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { setLoginTouched(true); setLoginName(s); }}
                              className="rounded-full border-2 border-brand-line bg-white px-3 py-1 text-xs font-bold text-brand-sage hover:border-brand-softsage"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="mt-1.5 text-xs text-[#8A7A69]">
                      Their name can be the same as other children&apos;s. The login name has to be one nobody else on Bright Roots has.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Email <span className="font-normal text-[#8A7A69]">(optional)</span>
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="oscar@example.com"
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Choose a password they can remember"
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20"
                  />
                </div>

                </>)}

                {error && (
                  <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3">
                    <p className="text-sm font-semibold text-[#A64F42]">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="sm:flex-1 px-4 py-2.5 rounded-xl border border-[#D9D1C4] bg-white text-[#6E5A46] text-sm font-semibold hover:bg-brand-cream transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAdd}
                  disabled={
                    saving ||
                    !username.trim() ||
                    (!little && !password.trim())
                  }
                  className="sm:flex-1 px-4 py-2.5 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {profileChild && (
        <ChildProfileModal
          child={profileChild}
          onClose={() => setProfileChild(null)}
          onChanged={(updated) => {
            setProfileChild(updated);
            setChildren(prev => prev.map(c => (c.id === updated.id ? updated : c)));
          }}
        />
      )}

      {resetChild && (
        <div
          className="fixed inset-0 z-50 bg-black/40 px-4 flex items-center justify-center"
          onClick={event => {
            if (event.target === event.currentTarget) closeResetModal();
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-brand-white border border-brand-line shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-brand-line">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
                Account Recovery
              </p>

              <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                Reset {resetChild.username}&apos;s password
              </h2>

              <p className="text-sm text-[#6E5A46] mt-1">
                Existing sessions on their other devices will be signed out.
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    New password
                  </label>

                  <input
                    type="password"
                    autoComplete="new-password"
                    value={resetPassword}
                    onChange={event => setResetPassword(event.target.value)}
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Confirm new password
                  </label>

                  <input
                    type="password"
                    autoComplete="new-password"
                    value={resetConfirm}
                    onChange={event => setResetConfirm(event.target.value)}
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-brand-softsage focus:ring-2 focus:ring-brand-softsage/20"
                  />
                </div>

                {resetError && (
                  <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3">
                    <p className="text-sm font-semibold text-[#A64F42]">
                      {resetError}
                    </p>
                  </div>
                )}

                {resetMessage && (
                  <div className="rounded-xl border border-brand-mist bg-brand-tint px-4 py-3">
                    <p className="text-sm font-semibold text-brand-sage">
                      {resetMessage}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <button
                  onClick={closeResetModal}
                  className="sm:flex-1 px-4 py-2.5 rounded-xl border border-[#D9D1C4] bg-white text-[#6E5A46] text-sm font-semibold hover:bg-brand-cream transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={handleResetPassword}
                  disabled={resetSaving || !resetPassword || !resetConfirm}
                  className="sm:flex-1 px-4 py-2.5 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetSaving ? "Resetting..." : "Reset password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}