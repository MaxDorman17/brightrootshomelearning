"use client";

import { useEffect } from "react";
import Link from "next/link";
import { serif } from "@/lib/fonts";
import { SUPPORT_EMAIL } from "@/lib/site";

/** Shown if a page crashes, so families see a calm Bright Roots message instead of a blank screen. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF6EC] px-4">
      <div className="max-w-md text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/sprout.png" alt="" className="mx-auto h-24 w-auto" />
        <h1 className={`${serif.className} mt-6 text-3xl font-semibold text-[#24452C]`}>Something went wrong</h1>
        <p className="mt-3 leading-7 text-[#6E5A46]">
          Sorry, this page didn&apos;t load properly. Nothing you&apos;ve saved has been lost. Please try again, and if it keeps
          happening, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="rounded-full bg-[#2F5D3A] px-6 py-3 text-sm font-bold text-white hover:opacity-95">
            Try again
          </button>
          <Link href="/" className="rounded-full border border-[#E4DCCD] px-6 py-3 text-sm font-bold text-[#2F5D3A] hover:bg-white">
            Go to the home page
          </Link>
        </div>
      </div>
    </div>
  );
}
