import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL, PRIVACY_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "The few essential cookies and browser settings Bright Roots uses. No tracking, no adverts.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "The short version",
    body: (
      <p>
        Bright Roots only uses what it needs to work: one cookie to keep you logged in, a security cookie from
        the service that protects our website, and a few small settings saved in your browser. We don&apos;t use
        analytics, advertising or tracking cookies of any kind, so we don&apos;t need to ask for your consent and
        there&apos;s nothing to switch off.
      </p>
    ),
  },
  {
    title: "What cookies are",
    body: (
      <p>
        Cookies are small files a website saves in your browser. &quot;Local storage&quot; is similar, and lets a
        website remember settings on your device. The law treats both the same way: websites can use them
        without asking when they are strictly necessary for something you&apos;ve asked for, like staying logged in.
      </p>
    ),
  },
  {
    title: "Cookies we use",
    body: (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>What it does</th>
            <th>How long</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>brightroots_session</td>
            <td>Keeps you logged in securely. It can&apos;t be read by scripts on the page.</td>
            <td>8 hours, or until you log out</td>
          </tr>
          <tr>
            <td>__cf_bm and similar</td>
            <td>Set by Cloudflare, which protects our website, to tell real visitors apart from harmful bots.</td>
            <td>Up to 30 minutes</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  {
    title: "Settings saved in your browser",
    body: (
      <>
        <p>These stay on your own device and are never used to track you:</p>
        <ul>
          <li>who is logged in (parent or child) and their name, so the right pages are shown;</li>
          <li>your family&apos;s colour theme;</li>
          <li>the study timer, if one is running;</li>
          <li>which lesson steps you&apos;ve ticked off, which badges you&apos;ve already seen, and which of today&apos;s notifications you&apos;ve opened;</li>
          <li>whether you&apos;ve hidden the getting-started card, the install-the-app card or the cookie notice;</li>
          <li>an unsent newsletter draft, for the site owner only.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Paying for a membership",
    body: (
      <p>
        When you pay, you go to Stripe&apos;s secure checkout page. Stripe sets its own cookies there to process
        your payment safely and prevent fraud. You can read about them in{" "}
        <a href="https://stripe.com/cookie-settings">Stripe&apos;s cookie policy</a>.
      </p>
    ),
  },
  {
    title: "Other websites",
    body: (
      <p>
        Lessons and resources link to other websites, such as Oak National Academy, BBC Bitesize and YouTube.
        Once you visit them, their own cookie policies apply.
      </p>
    ),
  },
  {
    title: "Controlling cookies",
    body: (
      <p>
        You can clear or block cookies in your browser settings. If you block the essential ones, you won&apos;t be
        able to log in. If we ever want to add a cookie that isn&apos;t essential, we&apos;ll update this page and ask
        for your permission first. Questions? Email {mail}, or see our <Link href="/privacy">privacy policy</Link>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Cookie policy"
      intro={<p>No tracking, no adverts. Just what&apos;s needed to keep you logged in and the site secure.</p>}
      sections={sections}
      updated={PRIVACY_UPDATED}
    />
  );
}
