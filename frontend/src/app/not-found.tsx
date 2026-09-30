import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";
import { serif } from "@/lib/fonts";

/** Shown for any address that doesn't exist, instead of Next.js's plain page. */
export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/sprout.png" alt="" className="h-28 w-auto" />
        <h1 className={`${serif.className} mt-6 text-4xl font-semibold text-[#24452C]`}>We can&apos;t find that page</h1>
        <p className="mt-3 text-lg leading-8 text-[#6E5A46]">
          The link may be old, or there might be a typo in the address. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-[#2F5D3A] px-6 py-3 text-sm font-bold text-white hover:opacity-95">
            Go to the home page
          </Link>
          <Link href="/login" className="rounded-full border border-[#E4DCCD] px-6 py-3 text-sm font-bold text-[#2F5D3A] hover:bg-white">
            Log in
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
