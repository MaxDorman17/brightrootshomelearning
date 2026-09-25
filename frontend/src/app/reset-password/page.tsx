"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setToken(params.get("token") || "");
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This reset link is missing or invalid.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.data.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #2F5D3A 0%, #6EA76E 55%, #A8C67A 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-xl p-2">
            <Image src="/logo.png" alt="Bright Roots" width={64} height={64} className="rounded-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Choose a new password</h1>
          <p className="mt-2 text-sm text-white/80">
            This reset link expires after 30 minutes and can only be used once.
          </p>
        </div>

        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                New password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 font-medium outline-none transition-colors focus:border-[#6EA76E]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Confirm new password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 font-medium outline-none transition-colors focus:border-[#6EA76E]"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token || !!message}
              className="w-full rounded-xl bg-[#3F5D46] py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-5 block text-center text-sm font-bold text-[#3F5D46] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
