"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { changePassword, getMe } from "@/lib/api";
import { clearAuth, setAuth } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
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
        setAuth(res.data.role, res.data.username);
      })
      .catch(() => {
        clearAuth();
        router.replace("/login");
      });
  }, [router]);

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
