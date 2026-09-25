"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createBillingCheckout, createBillingPortal, getMe, syncBillingSubscription } from "@/lib/api";

export default function BillingPage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState<"monthly" | "yearly" | "portal" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    syncBillingSubscription()
      .catch(() => null)
      .then(() => getMe())
      .then((res) => {
        if (res.data.role !== "parent") {
          router.replace("/child");
          return;
        }
        setAccount(res.data);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const trialText = useMemo(() => {
    if (!account?.trial_ends_at || account?.subscription_status !== "trialing") return null;
    const end = new Date(account.trial_ends_at);
    const remaining = Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
    return remaining === 1 ? "1 day left in your free trial" : remaining + " days left in your free trial";
  }, [account]);

  const checkout = async (plan: "monthly" | "yearly") => {
    setError("");
    setBusyPlan(plan);
    try {
      const res = await createBillingCheckout(plan);
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not open Stripe Checkout.");
      setBusyPlan(null);
    }
  };

  const portal = async () => {
    setError("");
    setBusyPlan("portal");
    try {
      const res = await createBillingPortal();
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not open billing settings.");
      setBusyPlan(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center"><p className="font-bold text-brand-earth/70">Loading billing...</p></div>;
  }

  const active = ["active", "grandfathered"].includes(account?.subscription_status);
  const trialSubscriptionAttached =
    account?.subscription_status === "trialing" && !!account?.billing_plan;
  const canceling = account?.subscription_status === "canceling";
  const membershipAttached = active || trialSubscriptionAttached || canceling;
  const cancelDate = account?.subscription_cancel_at
    ? new Date(account.subscription_cancel_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-terracotta">Membership</p>
          <h1 className="mt-2 text-3xl font-extrabold text-brand-charcoal">Bright Roots Family</h1>
          <p className="mt-2 text-brand-earth/70">
            One membership for your family, with parent tools and multiple child accounts included.
          </p>
        </div>

        {trialText && !canceling && (
          <div className="mb-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-5">
            <p className="font-extrabold text-brand-charcoal">{trialText}</p>
            <p className="mt-1 text-sm text-brand-earth/70">
              {trialSubscriptionAttached
                ? "Your payment method is saved and billing will begin after the trial."
                : "Choose a plan whenever you&apos;re ready."}
            </p>
          </div>
        )}

        {canceling && (
          <div className="mb-6 rounded-2xl border border-brand-terracotta/30 bg-brand-terracotta/10 p-5">
            <p className="font-extrabold text-brand-charcoal">Subscription cancelled</p>
            <p className="mt-1 text-sm text-brand-earth/70">
              You&apos;ll keep Bright Roots access until {cancelDate || "the end of your current period"}, and you won&apos;t be charged after that.
            </p>
          </div>
        )}

        {membershipAttached ? (
          <div className="brand-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-extrabold text-brand-charcoal">
                  {canceling
                    ? "Access continues until cancellation date"
                    : trialSubscriptionAttached
                    ? "Subscription ready after trial"
                    : "Membership active"}
                </p>
                <p className="mt-1 text-sm text-brand-earth/65">
                  {account.subscription_status === "grandfathered"
                    ? "Your existing Bright Roots account has continuing access."
                    : canceling
                    ? `Your ${account.billing_plan === "yearly" ? "annual" : "monthly"} membership is scheduled to end${cancelDate ? ` on ${cancelDate}` : ""}.`
                    : trialSubscriptionAttached
                    ? account.billing_plan === "yearly"
                      ? "Annual membership will begin automatically when your free trial ends."
                      : "Monthly membership will begin automatically when your free trial ends."
                    : account.billing_plan === "yearly"
                    ? "Annual membership"
                    : "Monthly membership"}
                </p>
              </div>
              {account.subscription_status !== "grandfathered" && (
                <button onClick={portal} disabled={busyPlan === "portal"} className="rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">
                  {busyPlan === "portal" ? "Opening..." : "Manage subscription"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="brand-card p-6">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-earth/55">Monthly</p>
              <div className="mt-3 text-4xl font-black text-brand-sage">£5.99<span className="text-base font-bold text-brand-earth/50">/month</span></div>
              <p className="mt-3 text-sm text-brand-earth/70">Flexible monthly membership. Cancel through Stripe anytime.</p>
              <button onClick={() => checkout("monthly")} disabled={busyPlan !== null} className="mt-6 w-full rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">
                {busyPlan === "monthly" ? "Opening Stripe..." : "Choose monthly"}
              </button>
            </div>

            <div className="brand-card p-6 ring-2 ring-brand-softsage/30">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-terracotta">Best value</p>
              <div className="mt-3 text-4xl font-black text-brand-sage">£59<span className="text-base font-bold text-brand-earth/50">/year</span></div>
              <p className="mt-3 text-sm text-brand-earth/70">Save £12.88 compared with paying monthly for a full year.</p>
              <button onClick={() => checkout("yearly")} disabled={busyPlan !== null} className="mt-6 w-full rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">
                {busyPlan === "yearly" ? "Opening Stripe..." : "Choose yearly"}
              </button>
            </div>
          </div>
        )}

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="mt-8 text-center">
          <Link href="/account" className="text-sm font-bold text-brand-sage hover:underline">Back to account settings</Link>
        </div>
      </main>
    </div>
  );
}
