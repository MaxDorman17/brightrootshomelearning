"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerParent } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerParent(email.trim(), username.trim(), password);
      setMessage(
        res.data.message ||
          "Account created. Check your email to verify your account."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #2F5D3A 0%, #6EA76E 55%, #A8C67A 100%)",
      }}
    >
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 p-2 shadow-xl backdrop-blur-sm">
            <Image
              src="/logo.png"
              alt="Bright Roots"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-white">Start your free trial</h1>
          <p className="mt-2 text-sm font-semibold text-white/80">
            7 days free, then £5.99/month or £59/year.
          </p>
        </div>

        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl">
          {message ? (
            <div>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm font-semibold text-green-800">
                {message}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Once your email is verified, sign in and Bright Roots will guide you through adding your first child and timetable.
              </p>
              <Link
                href="/login"
                className="mt-6 block rounded-xl bg-[#3F5D46] px-5 py-3 text-center text-sm font-extrabold text-white"
              >
                Go to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Parent email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Username
                </label>
                <input
                  required
                  minLength={2}
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#3F5D46] py-3 text-sm font-extrabold text-white disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Start 7-day free trial"}
              </button>

              <p className="text-center text-xs text-gray-500">
                No card is taken at this step.
              </p>
            </form>
          )}

          <div className="mt-6 border-t border-gray-200 pt-5 text-center text-sm text-gray-600">
            Already a member?{" "}
            <Link href="/login" className="font-extrabold text-[#3F5D46] hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
