import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acceptable use policy",
  description: "The simple rules for using Bright Roots safely and fairly.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "Who this applies to",
    body: (
      <p>
        This policy applies to everyone who uses Bright Roots: parents, carers and children. It forms part of
        our <Link href="/terms">terms of service</Link>. Parents are responsible for making sure their children
        use Bright Roots in line with it, and we&apos;ve written a short version for children below.
      </p>
    ),
  },
  {
    title: "Please do",
    body: (
      <ul>
        <li>use Bright Roots to plan, record and enjoy your family&apos;s learning;</li>
        <li>keep your password and your children&apos;s passwords private;</li>
        <li>only add children you are the parent or carer of, or have permission to teach;</li>
        <li>tell us if you see anything that worries you, or think someone has got into your account.</li>
      </ul>
    ),
  },
  {
    title: "Please don't",
    body: (
      <ul>
        <li>upload anything illegal, harmful, hateful, violent, sexual or abusive;</li>
        <li>upload photos or files of other people&apos;s children without their parent&apos;s permission;</li>
        <li>upload things you don&apos;t have the right to share, such as paid-for worksheets or copied books;</li>
        <li>try to see or change another family&apos;s account or information;</li>
        <li>share your membership with other families;</li>
        <li>try to break, overload, scrape or copy Bright Roots, or get around its security;</li>
        <li>use Bright Roots to sell things or send spam.</li>
      </ul>
    ),
  },
  {
    title: "For children",
    body: (
      <ul>
        <li>Keep your password secret, except from your grown-up.</li>
        <li>Only add things you&apos;d be happy for your grown-up to see.</li>
        <li>Be kind in anything you write.</li>
        <li>If anything on a website you visit from Bright Roots upsets or worries you, stop and tell a grown-up.</li>
      </ul>
    ),
  },
  {
    title: "Links to other websites",
    body: (
      <p>
        Bright Roots links to trusted learning websites such as Oak National Academy and BBC Bitesize. Those sites
        have their own rules. We choose links carefully, but we&apos;d always suggest a grown-up is nearby when
        younger children are online.
      </p>
    ),
  },
  {
    title: "What happens if the rules are broken",
    body: (
      <>
        <p>
          If we find something that breaks this policy, we may remove it, and for serious or repeated problems we
          may suspend or close the account. We&apos;ll normally explain why and give you a chance to respond.
        </p>
        <p>
          If something suggests a child is at risk, we&apos;ll follow our{" "}
          <Link href="/safeguarding">safeguarding policy</Link>, which may mean telling the police or social work.
        </p>
      </>
    ),
  },
  {
    title: "Reporting a problem",
    body: <p>Please email {mail}. We read every message and will reply as soon as we can.</p>,
  },
];

export default function AcceptableUsePage() {
  return (
    <LegalPage
      eyebrow="The small print"
      title="Acceptable use policy"
      intro={<p>A few simple rules that keep Bright Roots safe and fair for every family.</p>}
      sections={sections}
    />
  );
}
