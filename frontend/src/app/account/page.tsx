"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { changePassword, getMe, requestEmailVerification } from "@/lib/api";
import { clearAuth, setAuth } from "@/lib/auth";

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

  useEffect(() => {
    getMe()
      .then((res) => {
        setUsername(res.data.username);
        setRole(res.data.role);
        setEmail(res.data.email || "");
        setEmailVerified(!!res.data.email_verified_at);
        setAuth(res.data.role, res.data.username);
      })
      .catch(() => {
        clearAuth();
        router.replace("/login");
      });
  }, [router]);

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

    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
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
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-earth/60">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-brand-charcoal">
              Security settings
            </h1>
            <p className="mt-2 text-sm text-brand-earth/70">
              Signed in as <span className="font-bold">{username || "..."}</span>
              {role ? ` · ${role}` : ""}.
            </p>
          </div>

          {role === "parent" && (
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

          {role === "parent" && (
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
                  minLength={8}
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
                  minLength={8}
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
        </div>
      </main>
    </div>
  );
}
