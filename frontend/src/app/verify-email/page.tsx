"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { verifyEmail } from "@/lib/api";
import AuthShell, { authButton, EARTH, GREEN } from "@/components/AuthShell";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing or invalid.");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.detail ||
            "This verification link is invalid or has expired."
        );
      });
  }, []);

  return (
    <AuthShell
      title={status === "error" ? "Link not working" : status === "success" ? "You're all set" : "Checking your email"}>
      <div className="text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-extrabold ${
            status === "success"
              ? "bg-[#E3EFDD]"
              : status === "error"
              ? "bg-red-50 text-red-600"
              : "bg-[#F3EDE2]"
          }`}
          style={status === "success" ? { color: GREEN } : status === "checking" ? { color: EARTH } : undefined}
        >
          {status === "success" ? "✓" : status === "error" ? "!" : "…"}
        </div>

        <p className="mt-5 font-semibold text-[#2E342F]">{message}</p>

        {status === "success" && (
          <Link href="/" className={`mt-6 ${authButton}`} style={{ background: GREEN }}>
            Continue to Bright Roots →
          </Link>
        )}

        {status === "error" && (
          <Link href="/account" className="mt-6 inline-block text-sm font-bold hover:underline" style={{ color: GREEN }}>
            Return to account settings
          </Link>
        )}
      </div>
    </AuthShell>
  );
}
