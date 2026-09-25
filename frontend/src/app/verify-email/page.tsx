"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { verifyEmail } from "@/lib/api";

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #2F5D3A 0%, #6EA76E 55%, #A8C67A 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-xl p-2">
            <Image
              src="/logo.png"
              alt="Bright Roots"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Email verification
          </h1>
        </div>

        <div className="rounded-3xl bg-white/95 p-8 text-center shadow-2xl">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-extrabold ${
              status === "success"
                ? "bg-green-100 text-green-700"
                : status === "error"
                ? "bg-red-100 text-red-600"
                : "bg-[#E8EDE4] text-[#3F5D46]"
            }`}
          >
            {status === "success" ? "✓" : status === "error" ? "!" : "…"}
          </div>

          <p className="mt-5 text-sm font-semibold text-gray-700">{message}</p>

          {status === "success" && (
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-[#3F5D46] px-5 py-3 text-sm font-extrabold text-white"
            >
              Continue to Bright Roots
            </Link>
          )}

          {status === "error" && (
            <Link
              href="/account"
              className="mt-6 inline-block text-sm font-bold text-[#3F5D46] hover:underline"
            >
              Return to account settings
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
