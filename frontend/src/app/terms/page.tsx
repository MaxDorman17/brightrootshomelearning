import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for using Bright Roots, including membership, trials and cancelling.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "About these terms",
    body: (
      <p>
        These terms are an agreement between you and Bright Roots Home Learning (&quot;Bright Roots&quot;,
        &quot;we&quot;, &quot;us&quot;) for using the website and planner at brightrootshomelearning.co.uk. By creating
        an account you agree to them. Our <Link href="/privacy">privacy policy</Link> explains how we look after
        your family&apos;s information.
      </p>
    ),
  },
  {
    title: "Your account",
    body: (
      <ul>
        <li>You must be 18 or over to create a parent account.</li>
        <li>Please give an email address you can access, and keep your password private.</li>
        <li>
          You can add child accounts for children in your care. You are responsible for how those accounts
          are used and for the information you add to them.
        </li>
        <li>You&apos;re responsible for activity on your account, so let us know straight away if you think someone else has access.</li>
      </ul>
    ),
  },
  {
    title: "Free trial",
    body: (
      <p>
        New families get a 7-day free trial with full access. No card is needed to start. When the trial ends
        you&apos;ll need a membership to keep using Bright Roots, and your records stay safe in your account in the
        meantime.
      </p>
    ),
  },
  {
    title: "Membership and payment",
    body: (
      <>
        <p>
          A family membership costs £5.99 a month or £59 a year, including all child accounts. Prices include
          any VAT that applies. Payments are taken by Stripe, and your membership renews automatically at the
          end of each month or year until you cancel.
        </p>
        <p>
          If we ever change the price, we&apos;ll tell you by email at least 30 days before it affects your next
          payment, and you can cancel before then.
        </p>
      </>
    ),
  },
  {
    title: "Cancelling and refunds",
    body: (
      <>
        <p>
          You can cancel at any time from the <Link href="/billing">Billing page</Link>. You&apos;ll keep access until
          the end of the period you have already paid for, and you won&apos;t be charged again.
        </p>
        <p>
          As you can try Bright Roots free for 7 days first, we don&apos;t normally refund part-used months or
          years. If something has gone wrong, email {mail} and we&apos;ll do our best to help. This doesn&apos;t
          affect your legal rights.
        </p>
      </>
    ),
  },
  {
    title: "Your content",
    body: (
      <p>
        Everything you and your children add, such as plans, notes, photos and files, stays yours. You give us
        permission to store and display it only so we can provide Bright Roots to your family. You can download
        it or delete it at any time from the <Link href="/account">Account page</Link>.
      </p>
    ),
  },
  {
    title: "Using Bright Roots fairly",
    body: (
      <>
        <p>Please don&apos;t:</p>
        <ul>
          <li>upload anything unlawful, or anything you don&apos;t have the right to share;</li>
          <li>try to access another family&apos;s account or information;</li>
          <li>try to disrupt, overload or copy the service.</li>
        </ul>
        <p>We may suspend accounts that break these rules, and will tell you why.</p>
      </>
    ),
  },
  {
    title: "Your children's education",
    body: (
      <p>
        Bright Roots is a tool to help you organise home learning. You remain responsible for your
        children&apos;s education and for any arrangements with your local authority. The council report helps
        you present your records, but we can&apos;t guarantee how a local authority will respond to it.
      </p>
    ),
  },
  {
    title: "Other people's content",
    body: (
      <p>
        Bright Roots links to lessons from Oak National Academy and other websites. That content belongs to its
        owners and is covered by their own terms. We aren&apos;t responsible for it.
      </p>
    ),
  },
  {
    title: "Keeping Bright Roots running",
    body: (
      <p>
        We work hard to keep Bright Roots available and your data safe, but we can&apos;t promise it will always
        be free of interruptions or errors. We may improve or change features over time. If we ever need to
        close Bright Roots, we&apos;ll give you plenty of notice and a way to download your records.
      </p>
    ),
  },
  {
    title: "Our responsibility to you",
    body: (
      <p>
        We are responsible for loss you suffer that is a foreseeable result of us breaking these terms or not
        taking reasonable care. We aren&apos;t responsible for loss that wasn&apos;t foreseeable, or for business
        losses. Nothing in these terms limits our liability where it would be unlawful to do so, including for
        death or personal injury caused by our negligence, or for fraud.
      </p>
    ),
  },
  {
    title: "Closing your account",
    body: (
      <p>
        You can delete your account at any time from the <Link href="/account">Account page</Link>. This cancels
        your membership and permanently removes your family&apos;s information.
      </p>
    ),
  },
  {
    title: "Changes and the law",
    body: (
      <>
        <p>
          We may update these terms from time to time. If a change is important, we&apos;ll email members before it
          takes effect. These terms are governed by the law of England and Wales. If you live elsewhere in the
          UK, you can also bring a claim in your local courts.
        </p>
        <p>Questions about these terms? Email {mail}.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="The small print"
      title="Terms of service"
      intro={<p>We&apos;ve tried to keep these terms short and in plain English.</p>}
      sections={sections}
    />
  );
}
