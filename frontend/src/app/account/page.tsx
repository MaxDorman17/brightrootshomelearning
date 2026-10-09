"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ThemePicker from "@/components/ThemePicker";
import Avatar from "@/components/Avatar";
import AvatarBuilder from "@/components/AvatarBuilder";
import { AvatarChoice, DEFAULT_PARENT_AVATAR, PARENT_AVATAR_PICTURES } from "@/lib/avatar";
import ChildColours from "@/components/ChildColours";
import YourDataCard from "@/components/YourDataCard";
import ReadingComfort from "@/components/ReadingComfort";
import FamilyAdultsCard from "@/components/FamilyAdults";
import AppCard from "@/components/AppCard";
import CalendarSyncCard from "@/components/CalendarSyncCard";
import {
  changePassword,
  checkSession,
  getMe,
  getMyNewsletter,
  getTimetable,
  requestEmailVerification,
  setMyNewsletter,
  saveAvatar,
  saveChildColours,
  saveFamilyTheme,
} from "@/lib/api";
import { subjectsInTimetable } from "@/lib/subjects";
import { clearAuth, setAuth } from "@/lib/auth";
import { DEFAULT_THEME, FamilyTheme, applyTheme, isFamilyTheme } from "@/lib/theme";

export default function AccountPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationSending, setVerificationSending] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<FamilyTheme>(DEFAULT_THEME);
  const [themeSaving, setThemeSaving] = useState(false);
  const [themeMessage, setThemeMessage] = useState("");
  const [me, setMe] = useState<{
    id: number;
    avatar: AvatarChoice | null;
    has_photo: boolean;
    child_theme: string | null;
    subject_colors: Record<string, string> | null;
    is_owner?: boolean;
    login_name?: string | null;
  } | null>(null);
  // False for a second grown-up: billing, email and deleting the account belong to the main account holder.
  const isOwner = me?.is_owner !== false;
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState<boolean | null>(null);

  useEffect(() => {
    getMe()
      .then((res) => {
        setUsername(res.data.username);
        setRole(res.data.role);
        setEmail(res.data.email || "");
        setEmailVerified(!!res.data.email_verified_at);
        setAuth(res.data.role, res.data.username);
        if (isFamilyTheme(res.data.family_theme)) setTheme(res.data.family_theme);
        setMe(res.data);
        if (res.data.role === "parent" && res.data.is_owner !== false) {
          getMyNewsletter()
            .then((n) => setNewsletter(n.data.subscribed))
            .catch(() => {});
        }
        if (res.data.role === "child") {
          getTimetable()
            .then((t) => setSubjects(subjectsInTimetable(t.data.config || {})))
            .catch(() => {});
        }
      })
      .catch(() => {
        clearAuth();
        router.replace("/login");
      });
  }, [router]);

  const handleThemeChange = async (next: FamilyTheme) => {
    const previous = theme;
    setTheme(next);
    applyTheme(next);
    setThemeMessage("");
    setThemeSaving(true);
    try {
      await saveFamilyTheme(next);
      setThemeMessage("Saved. Your children will see these colours too.");
    } catch (err: any) {
      setTheme(previous);
      applyTheme(previous);
      setThemeMessage(err.response?.data?.detail || "Could not save theme.");
    } finally {
      setThemeSaving(false);
    }
  };

  const handleSendVerification = async () => {
    setVerificationMessage("");
    setVerificationError("");
    setVerificationSending(true);

    try {
      const res = await requestEmailVerification();
      setVerificationMessage(res.data.message || "Verification email sent.");
    } catch (err: any) {
      setVerificationError(err.response?.data?.detail || "Could not send verification email.");
    } finally {
      setVerificationSending(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const shortest = role === "child" ? 4 : 8;
    if (newPassword.length < shortest) {
      setError(`Your new password must be at least ${shortest} characters.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setMessage(res.data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-3xl border border-brand-softsage/20 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <PageHero art="account" tint={3}>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-earth/60">
              {role === "child" ? "Make it yours" : "Account"}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
              {role === "child" ? "My look" : "Account settings"}
            </h1>
            <p className="mt-2 text-sm text-brand-earth/70">
              Signed in as <span className="font-bold">{username || "..."}</span>
              {me?.login_name && me.login_name !== username ? <> · you log in with <span className="font-bold">{me.login_name}</span></> : null}
              {role ? ` · ${role}` : ""}.
            </p>
            </PageHero>
          </div>

          {role === "parent" && isOwner && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-brand-charcoal">
                    Email verification
                  </h2>
                  <p className="mt-1 text-sm text-brand-earth/70">
                    {email || "Your parent account email"}
                  </p>
                </div>

                <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-extrabold ${
                  emailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {emailVerified ? "Verified" : "Not verified"}
                </span>
              </div>

              {!emailVerified && (
                <div className="mt-4">
                  <p className="text-sm text-brand-earth/70">
                    Verify your email before using parent-only areas of Bright Roots.
                  </p>

                  {verificationMessage && (
                    <div className="mt-3 rounded-xl border border-brand-softsage/30 bg-brand-softsage/10 px-4 py-3 text-sm font-semibold text-brand-sage">
                      {verificationMessage}
                    </div>
                  )}

                  {verificationError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      {verificationError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={verificationSending}
                    className="mt-4 rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white transition-opacity disabled:opacity-60"
                  >
                    {verificationSending ? "Sending..." : "Send verification email"}
                  </button>
                </div>
              )}
            </div>
          )}

          {role === "parent" && me && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="text-lg font-extrabold text-brand-charcoal">My avatar</h2>
              <p className="mt-1 text-sm text-brand-earth/70">Shown next to your name at the top of every page.</p>
              <div className="mt-3">
                <AvatarBuilder
                  username={username}
                  initial={me.avatar}
                  pictures={PARENT_AVATAR_PICTURES}
                  fallback={DEFAULT_PARENT_AVATAR}
                  onSave={async (choice) => {
                    await saveAvatar(choice);
                    setMe({ ...me, avatar: choice });
                    window.dispatchEvent(new Event("avatar-changed"));
                  }}
                />
              </div>
            </div>
          )}

          {role === "parent" && <FamilyAdultsCard />}

          {role === "child" && me && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="text-lg font-extrabold text-brand-charcoal">My avatar</h2>
              {me.has_photo ? (
                <div className="mt-3 flex items-center gap-4">
                  <Avatar username={username} avatar={me.avatar} hasPhoto childId={me.id} size="lg" />
                  <p className="text-sm text-brand-earth/70">Your grown-up has added a photo for you.</p>
                </div>
              ) : (
                <div className="mt-3">
                  <AvatarBuilder
                    username={username}
                    initial={me.avatar}
                    onSave={async (choice) => {
                      await saveAvatar(choice);
                      setMe({ ...me, avatar: choice });
                      window.dispatchEvent(new Event("avatar-changed"));
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {me && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Easier to read and calmer</h2>
              <p className="mb-3 mt-1 text-sm text-[#6E5A46]">
                {role === "child" ? "Make the words bigger or clearer, or turn on Calm mode." : "Make the words bigger or clearer, or turn on Calm mode, on your own screens. To set this for a child, open their profile under Family, then Children."}
              </p>
              <ReadingComfort />
            </div>
          )}

          {role === "child" && me && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="mb-3 text-lg font-extrabold text-brand-charcoal">My colours</h2>
              <ChildColours
                subjects={subjects}
                initialTheme={me.child_theme}
                initialColours={me.subject_colors || {}}
                onSave={async (childTheme, colours) => {
                  await saveChildColours(childTheme, colours);
                  // Re-read the theme so "Family colours" switches straight back to the family's.
                  const fresh = await checkSession();
                  applyTheme(fresh.data.family_theme);
                }}
              />
            </div>
          )}

          {role === "parent" && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Family colours</h2>
              <p className="mt-1 mb-4 text-sm text-brand-earth/70">
                Choose the colour theme for Bright Roots. It applies to you and your children.
              </p>
              <ThemePicker value={theme} onChange={handleThemeChange} disabled={themeSaving} />
              {themeMessage && <p className="mt-3 text-sm font-semibold text-brand-earth">{themeMessage}</p>}
            </div>
          )}

          {role === "parent" && <CalendarSyncCard />}

          {role === "parent" && newsletter !== null && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Newsletter</h2>
              <label className="mt-2 flex items-start gap-2 text-sm text-brand-earth/80">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={async (e) => {
                    const next = e.target.checked;
                    setNewsletter(next);
                    try {
                      await setMyNewsletter(next);
                    } catch {
                      setNewsletter(!next);
                    }
                  }}
                  className="mt-0.5 accent-brand-sage"
                />
                Send me the Bright Roots newsletter with home learning tips and news.
              </label>
            </div>
          )}

          {role === "parent" && isOwner && (
            <div className="mb-5 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
              <h2 className="text-lg font-extrabold text-brand-charcoal">Membership & billing</h2>
              <p className="mt-1 text-sm text-brand-earth/70">
                View your trial, choose monthly or annual membership, or manage an existing subscription.
              </p>
              <Link
                href="/billing"
                className="mt-4 inline-block rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white"
              >
                Open billing
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5">
            <h2 className="text-lg font-extrabold text-brand-charcoal">
              Change password
            </h2>
            <p className="mt-1 text-sm text-brand-earth/70">
              Changing your password signs out older sessions on other devices while keeping this device signed in.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">
                  Current password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-brand-softsage/30 bg-white px-4 py-2.5 outline-none transition-colors focus:border-brand-sage"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">
                  New password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={role === "child" ? 4 : 8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-brand-softsage/30 bg-white px-4 py-2.5 outline-none transition-colors focus:border-brand-sage"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">
                  Confirm new password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={role === "child" ? 4 : 8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-brand-softsage/30 bg-white px-4 py-2.5 outline-none transition-colors focus:border-brand-sage"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-brand-softsage/30 bg-brand-softsage/10 px-4 py-3 text-sm font-semibold text-brand-sage">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white transition-opacity disabled:opacity-60"
              >
                {saving ? "Changing password..." : "Change password"}
              </button>
            </form>
          </div>

          {role === "child" && (
            <Link
              href="/child/privacy"
              className="mt-5 flex items-center gap-4 rounded-2xl border border-brand-softsage/20 bg-brand-cream/60 p-5 hover:bg-brand-tint"
            >
              <span className="text-3xl" aria-hidden>🔒</span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-extrabold text-brand-charcoal">My privacy</span>
                <span className="block text-sm text-brand-earth/70">What Bright Roots knows about you, and how we keep it safe.</span>
              </span>
              <span className="text-brand-sage">→</span>
            </Link>
          )}

          {(role === "parent" || role === "child") && (
            <div className="mt-5">
              <AppCard role={role} />
            </div>
          )}

          {role === "parent" && <YourDataCard canDelete={isOwner} />}
        </div>
      </main>
    </div>
  );
}
