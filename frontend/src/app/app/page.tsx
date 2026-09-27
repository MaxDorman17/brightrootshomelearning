"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/api";
import { setAuth } from "@/lib/auth";

/** Where the installed app opens: straight to the right home screen, or the login page. */
export default function AppLauncher() {
  const router = useRouter();

  useEffect(() => {
    checkSession()
      .then((res) => {
        setAuth(res.data.role, res.data.username);
        router.replace(res.data.role === "child" ? "/child" : "/parent/dashboard");
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon-192.png" alt="Bright Roots" className="h-24 w-24 animate-pulse rounded-3xl" />
    </div>
  );
}
