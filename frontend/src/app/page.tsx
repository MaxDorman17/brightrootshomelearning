"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole, isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const role = getRole();
    router.replace(role === "parent" ? "/parent/dashboard" : "/child");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading…</p>
    </div>
  );
}
