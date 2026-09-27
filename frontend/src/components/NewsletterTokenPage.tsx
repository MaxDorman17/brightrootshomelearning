"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";

/** Shared body of the confirm and unsubscribe pages: reads #token=... and calls the API once. */
export default function NewsletterTokenPage({
  title,
  action,
}: {
  title: string;
  action: (token: string) => Promise<{ data: { message: string } }>;
}) {
  const [message, setMessage] = useState("Just a moment...");
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
    if (!token) {
      setMessage("This link is missing something. Please use the link from your email.");
      setOk(false);
      return;
    }
    action(token)
      .then((res) => {
        setMessage(res.data.message);
        setOk(true);
      })
      .catch((err) => {
        const detail = err.response?.data?.detail;
        setMessage(typeof detail === "string" ? detail : "Something went wrong. Please try the link again.");
        setOk(false);
      });
    // Only run once for the token in the link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PublicShell>
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl">{ok === null ? "⏳" : ok ? "🌱" : "⚠️"}</p>
        <h1 className="mt-4 text-3xl font-black text-brand-charcoal">{title}</h1>
        <p className="mt-3 text-lg text-[#6E5A46]">{message}</p>
        <Link href="/" className="mt-8 inline-block rounded-xl bg-brand-sage px-6 py-3 text-sm font-extrabold text-white">
          Back to Bright Roots
        </Link>
      </section>
    </PublicShell>
  );
}
