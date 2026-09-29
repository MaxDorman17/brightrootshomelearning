import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Complaints policy",
  description: "How to make a complaint about Bright Roots and what we'll do about it.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "Tell us",
    body: (
      <>
        <p>
          If you&apos;re unhappy with anything about Bright Roots, please email {mail} with &quot;Complaint&quot; in
          the subject line. It helps if you include:
        </p>
        <ul>
          <li>the email address on your account;</li>
          <li>what went wrong, and when;</li>
          <li>what you would like us to do to put it right.</li>
        </ul>
      </>
    ),
  },
  {
    title: "What we'll do",
    body: (
      <ul>
        <li>We&apos;ll confirm we&apos;ve received your complaint within 3 working days.</li>
        <li>We&apos;ll look into it properly and send you a full reply within 14 days.</li>
        <li>If we need longer, we&apos;ll tell you why and when to expect an answer.</li>
        <li>If we got something wrong, we&apos;ll say so, put it right, and explain what we&apos;re changing so it doesn&apos;t happen again.</li>
      </ul>
    ),
  },
  {
    title: "If you're still unhappy",
    body: (
      <>
        <p>Reply to our answer and ask for your complaint to be looked at again. We&apos;ll review it afresh and send a final reply within 14 days.</p>
        <p>If you&apos;re still not satisfied after that, you can get free, independent advice:</p>
        <ul>
          <li>
            In Scotland, from Advice Direct Scotland at <a href="https://www.consumeradvice.scot">consumeradvice.scot</a>{" "}
            or 0808 164 6000.
          </li>
          <li>
            In England and Wales, from the Citizens Advice consumer service at{" "}
            <a href="https://www.citizensadvice.org.uk/consumer/">citizensadvice.org.uk</a>.
          </li>
          <li>
            In Northern Ireland, from Consumerline at <a href="https://www.nidirect.gov.uk/consumerline">nidirect.gov.uk/consumerline</a>.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Complaints about your information",
    body: (
      <p>
        If your complaint is about how we handle your family&apos;s personal information, you can also contact
        the Information Commissioner&apos;s Office at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk</a>.
        Our <Link href="/privacy">privacy policy</Link> explains your rights.
      </p>
    ),
  },
  {
    title: "Worried about a child?",
    body: (
      <p>
        If your concern is about a child&apos;s safety, please don&apos;t wait for a complaints process. See our{" "}
        <Link href="/safeguarding">safeguarding policy</Link>, and if a child is in immediate danger, call 999.
      </p>
    ),
  },
];

export default function ComplaintsPage() {
  return (
    <LegalPage
      eyebrow="Help"
      title="Complaints policy"
      intro={<p>We&apos;re a small family business and we want to hear when we&apos;ve got something wrong.</p>}
      sections={sections}
    />
  );
}
