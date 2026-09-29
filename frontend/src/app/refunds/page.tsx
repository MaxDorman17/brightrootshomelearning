import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import TraderDetails from "@/components/TraderDetails";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscriptions, cancelling and refunds",
  description: "How Bright Roots memberships renew, how to cancel, and when you can get a refund.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "Who we are",
    body: <TraderDetails />,
  },
  {
    title: "The free trial",
    body: (
      <ul>
        <li>Every new family gets 7 days of full access for free.</li>
        <li>We don&apos;t ask for a card to start the trial, so you will never be charged by surprise when it ends.</li>
        <li>When the trial ends, Bright Roots asks you to choose a membership. Your records stay in your account while you decide.</li>
      </ul>
    ),
  },
  {
    title: "Memberships and renewals",
    body: (
      <>
        <ul>
          <li>A family membership is £5.99 a month or £59 a year, covering every child in your family.</li>
          <li>Prices include any VAT that applies.</li>
          <li>
            Your membership renews automatically at the end of each month or year, using the card you gave
            Stripe, until you cancel.
          </li>
          <li>Your receipts are emailed to you by Stripe, and you can see your plan and next payment date on the <Link href="/billing">Billing page</Link>.</li>
          <li>For yearly memberships, we&apos;ll email you a reminder before it renews.</li>
          <li>If the price ever changes, we&apos;ll tell you by email at least 30 days before it affects your next payment.</li>
        </ul>
      </>
    ),
  },
  {
    title: "How to cancel",
    body: (
      <>
        <p>
          You can cancel at any time, in a couple of clicks, from the <Link href="/billing">Billing page</Link>.
          You can also email {mail} and we&apos;ll cancel it for you.
        </p>
        <p>
          When you cancel, you won&apos;t be charged again and you keep access until the end of the month or year
          you&apos;ve already paid for. Your records stay in your account, so you can come back later or download
          them from the <Link href="/account">Account page</Link>.
        </p>
      </>
    ),
  },
  {
    title: "Your 14-day right to cancel",
    body: (
      <>
        <p>
          UK law gives you 14 days to change your mind after you first buy a membership. If you cancel within
          14 days of your first payment, email {mail} and we&apos;ll refund that payment in full.
        </p>
        <p>
          If you take out a yearly membership, the same 14 days apply after each yearly renewal, so if a renewal
          catches you out, tell us within 14 days and we&apos;ll refund it.
        </p>
        <p>Refunds go back to the card you paid with, normally within 14 days of your request.</p>
      </>
    ),
  },
  {
    title: "Other refunds",
    body: (
      <>
        <p>
          Outside those 14 days, we don&apos;t normally refund the unused part of a month or year, because you can
          cancel at any time and try Bright Roots free first. But if something has gone wrong, such as being
          charged twice or Bright Roots not working for a long time, email {mail} and we&apos;ll put it right.
        </p>
        <p>None of this affects your legal rights as a consumer.</p>
      </>
    ),
  },
  {
    title: "If a payment fails",
    body: (
      <p>
        Stripe will try your card again over the following days and email you so you can update it. If the
        payment still can&apos;t be taken, your membership will end, but your records stay in your account.
      </p>
    ),
  },
  {
    title: "Deleting your account",
    body: (
      <p>
        Deleting your account from the <Link href="/account">Account page</Link> also cancels your membership
        straight away. If you&apos;re within a 14-day cancellation period, email us first and we&apos;ll refund you.
      </p>
    ),
  },
];

export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Memberships"
      title="Subscriptions, cancelling and refunds"
      intro={<p>Everything you need to know about paying for Bright Roots, and how to stop.</p>}
      sections={sections}
    />
  );
}
