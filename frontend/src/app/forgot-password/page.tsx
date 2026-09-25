"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not send a reset email.");
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
          <h1 className="text-3xl font-extrabold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-white/80">
            Enter the email address on your parent account.
          </p>
        </div>

        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
              disabled={loading}
              className="w-full rounded-xl bg-[#3F5D46] py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
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
