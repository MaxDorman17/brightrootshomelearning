"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";
import AuthShell, { AuthMessage, authButton, authInput, authLabel, GREEN } from "@/components/AuthShell";

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
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email address on your parent account."
      footer={
        <Link href="/login" className="font-bold underline underline-offset-2" style={{ color: GREEN }}>
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={authLabel}>Email address</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={authInput}
          />
        </div>

        {message && <AuthMessage kind="success">{message}</AuthMessage>}
        {error && <AuthMessage kind="error">{error}</AuthMessage>}

        <button type="submit" disabled={loading} className={authButton} style={{ background: GREEN }}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
