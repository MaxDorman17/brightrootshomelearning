"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/api";

export default function BillingSuccessPage() {
  const [status, setStatus] = useState("Confirming your membership...");

  useEffect(() => {
    let attempts = 0;
    const check = () => {
      attempts += 1;
      getMe()
        .then((res) => {
          if (res.data.subscription_status === "active") {
            setStatus("Your Bright Roots membership is active.");
            return;
          }
          if (res.data.subscription_status === "trialing" && res.data.billing_plan) {
            setStatus("Your payment method is saved. Your membership will begin automatically when your free trial ends.");
            return;
          }
          if (attempts < 8) {
            setTimeout(check, 1000);
          } else {
            setStatus("Payment was received. Your membership may take a few seconds to update.");
          }
        })
        .catch(() => {
          setStatus("Payment was received. Sign in again if your membership does not update shortly.");
        });
    };
    check();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#E7DFD1] bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl font-black text-green-700">✓</div>
        <h1 className="mt-5 text-3xl font-black text-[#2E342F]">Payment successful</h1>
        <p className="mt-3 text-[#6E5A46]">{status}</p>
        <Link href="/parent/dashboard" className="mt-7 inline-block rounded-xl bg-[#3F5D46] px-6 py-3 text-sm font-extrabold text-white">
          Open Bright Roots
        </Link>
      </div>
    </div>
  );
}
