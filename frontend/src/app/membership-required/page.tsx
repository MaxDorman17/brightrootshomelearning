"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, logout } from "@/lib/api";
import { clearAuth } from "@/lib/auth";

export default function MembershipRequiredPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        setRole(res.data.role);
        setUsername(res.data.username || "");
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const signOut = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center">
        <p className="font-bold text-[#6E5A46]">Checking membership...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F2E8] px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="Bright Roots"
            width={72}
            height={72}
            className="mx-auto rounded-2xl"
          />
          <h1 className="mt-4 text-3xl font-black text-[#2E342F]">
            Bright Roots membership
          </h1>
        </div>

        <div className="rounded-3xl border border-[#E7DFD1] bg-white p-7 shadow-xl shadow-[#3F5D46]/5">
          {role === "parent" ? (
            <>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#D87C4A]">
                Membership needed
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#2E342F]">
                Your Bright Roots access needs renewing.
              </h2>
              <p className="mt-3 leading-7 text-[#6E5A46]">
                Your trial or previous membership has ended. Your family data is still here and you can
                sign in, manage your account and restart membership at any time.
              </p>

              <Link
                href="/billing"
                className="mt-7 block rounded-xl bg-[#3F5D46] px-5 py-3.5 text-center text-sm font-extrabold text-white"
              >
                View membership options
              </Link>

              <Link
                href="/account"
                className="mt-3 block rounded-xl border border-[#D9D1C4] bg-white px-5 py-3.5 text-center text-sm font-extrabold text-[#3F5D46]"
              >
                Account settings
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#D87C4A]">
                Family membership needed
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#2E342F]">
                Ask your parent to check Bright Roots membership.
              </h2>
              <p className="mt-3 leading-7 text-[#6E5A46]">
                Hi {username || "there"}. Your learning is still saved, but your family membership
                needs attention before the learning areas can be opened again.
              </p>
            </>
          )}

          <button
            type="button"
            onClick={signOut}
            className="mt-6 w-full text-sm font-bold text-[#6E5A46] hover:underline"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
