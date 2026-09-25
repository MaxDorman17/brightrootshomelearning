"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";
import { clearAuth, setAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((res) => {
        if (cancelled) return;
        setAuth(res.data.role, res.data.username);
        if (res.data.role === "parent" && !res.data.email_verified_at) {
          router.replace("/account");
        } else {
          router.replace(res.data.role === "parent" ? "/parent/dashboard" : "/child");
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearAuth();
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading…</p>
    </div>
  );
}
