"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/api";
import AuthShell, { AuthMessage, authButton, authInput, authLabel, GREEN } from "@/components/AuthShell";

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
    <AuthShell
      title="Choose a new password"
      subtitle="This link expires after 30 minutes and can only be used once."
      footer={
        <Link href="/login" className="font-bold underline underline-offset-2" style={{ color: GREEN }}>
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="new-password" className={authLabel}>New password</label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 8 characters"
            className={authInput}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className={authLabel}>Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Type it again"
            className={authInput}
          />
        </div>

        {message && <AuthMessage kind="success">{message}</AuthMessage>}
        {error && <AuthMessage kind="error">{error}</AuthMessage>}

        <button
          type="submit"
          disabled={loading || !token || !!message}
          className={authButton}
          style={{ background: GREEN }}
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
}
