import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL, TRADER_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safeguarding policy",
  description: "How Bright Roots keeps children safe, and what to do if you're worried about a child.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "If a child is in danger now",
    body: (
      <ul>
        <li>
          <strong>Call 999</strong> if a child is in immediate danger.
        </li>
        <li>
          For other worries about a child in Scotland, contact the social work department of the local council
          where the child lives, or Police Scotland on 101.
        </li>
        <li>
          Elsewhere in the UK, contact the local council&apos;s children&apos;s services or the NSPCC helpline on
          0808 800 5000.
        </li>
        <li>
          To report online sexual abuse or grooming, use the CEOP safety centre at{" "}
          <a href="https://www.ceop.police.uk/Safety-Centre/">ceop.police.uk</a>.
        </li>
        <li>
          Children can talk to Childline any time, free, on 0800 1111 or at{" "}
          <a href="https://www.childline.org.uk">childline.org.uk</a>.
        </li>
      </ul>
    ),
  },
  {
    title: "Our commitment",
    body: (
      <p>
        Bright Roots is used by children aged 3 to 16. Their safety and wellbeing come first in every decision we
        make. We follow the Scottish Government&apos;s National Guidance for Child Protection in Scotland and
        GIRFEC (Getting It Right For Every Child), and the ICO&apos;s Children&apos;s Code.
      </p>
    ),
  },
  {
    title: "How Bright Roots is designed to keep children safe",
    body: (
      <ul>
        <li>Every child account is created and managed by their parent or carer.</li>
        <li>Children can only see their own learning and what their family shares with them.</li>
        <li>There is no chat, messaging, public profile or way for children to contact anyone outside their family.</li>
        <li>Photos and files are private to the family that uploaded them.</li>
        <li>Children don&apos;t need an email address, and we never show adverts.</li>
        <li>Links to other websites go to trusted, well-known learning sites that we have checked.</li>
      </ul>
    ),
  },
  {
    title: "Who is responsible",
    body: (
      <p>
        {TRADER_NAME ? <>{TRADER_NAME} is</> : <>The owner of Bright Roots is</>} our Designated Safeguarding Lead
        and makes sure this policy is followed. You can reach them at {mail}. Anyone who works on Bright Roots in
        future will be given this policy and suitable safeguarding training, and will have the right background
        checks, such as PVG scheme membership, before being given any access to family information.
      </p>
    ),
  },
  {
    title: "What we do if we're worried about a child",
    body: (
      <>
        <p>
          We respect families&apos; privacy and don&apos;t read your content. But we may see something that worries us,
          for example in a message to our support email or while fixing a problem you&apos;ve asked us to look at.
        </p>
        <p>If that happens, we will:</p>
        <ol>
          <li>call 999 straight away if a child is in immediate danger;</li>
          <li>write down what we saw, when, and what we did, and keep that record securely;</li>
          <li>pass our concern to the right people, such as the local council&apos;s social work department or Police Scotland;</li>
          <li>report any child sexual abuse images to the police or the Internet Watch Foundation, and never copy or share them;</li>
          <li>suspend the account involved where that would help keep a child safe.</li>
        </ol>
        <p>
          Sharing information to protect a child is allowed under data protection law. We won&apos;t always be able to
          tell the family first if that could put a child at greater risk.
        </p>
      </>
    ),
  },
  {
    title: "If you're worried about something on Bright Roots",
    body: (
      <p>
        Email {mail} with &quot;Safeguarding&quot; in the subject line and we&apos;ll deal with it as a priority. Please
        also contact the services listed at the top of this page if a child may be at risk.
      </p>
    ),
  },
  {
    title: "Reviewing this policy",
    body: (
      <p>
        We review this policy at least once a year, and whenever we add a feature that changes how children use
        Bright Roots. See also our <Link href="/acceptable-use">acceptable use policy</Link> and our{" "}
        <Link href="/privacy/children">privacy notice for children</Link>.
      </p>
    ),
  },
];

export default function SafeguardingPage() {
  return (
    <LegalPage
      eyebrow="Keeping children safe"
      title="Safeguarding policy"
      intro={<p>How we keep children safe on Bright Roots, and what to do if you&apos;re worried about a child.</p>}
      sections={sections}
    />
  );
}
