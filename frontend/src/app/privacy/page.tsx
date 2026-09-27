import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Bright Roots collects, uses and protects your family's information.",
};

const mail = <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

const sections = [
  {
    title: "Who we are",
    body: (
      <p>
        Bright Roots Home Learning (&quot;Bright Roots&quot;, &quot;we&quot;, &quot;us&quot;) runs the website and
        home learning planner at brightrootshomelearning.co.uk. We are the data controller for the personal
        information described in this policy. You can contact us about anything in it at {mail}.
      </p>
    ),
  },
  {
    title: "The information we hold",
    body: (
      <>
        <p>We only collect what we need to run Bright Roots for your family:</p>
        <ul>
          <li>
            <strong>Your parent account:</strong> your email address, username and password. Passwords are stored
            in a scrambled (hashed) form, so we can never see them.
          </li>
          <li>
            <strong>Your children&apos;s accounts:</strong> the name or username you choose for each child, an
            optional email address, and the avatar, photo and colours you or they pick.
          </li>
          <li>
            <strong>Learning records:</strong> your timetable, plans and lessons, completed work, notes and
            feedback, reading, spellings, test and quiz results, game scores, study time, stars, rewards,
            reminders, journal entries and anything you write for reports.
          </li>
          <li>
            <strong>Photos and files you upload:</strong> moments and photos, worksheets and resources.
          </li>
          <li>
            <strong>Membership details:</strong> your plan, trial dates and subscription status. Card payments
            are handled by Stripe, and we never see or store your card details.
          </li>
          <li>
            <strong>Newsletter:</strong> if you sign up, your email address and when you confirmed.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How we use it",
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>provide the planner, child accounts, progress records and reports you ask for;</li>
          <li>send account emails, such as verifying your email address and resetting your password;</li>
          <li>send reminders and summary emails you have switched on;</li>
          <li>manage your trial and membership;</li>
          <li>send the newsletter, only if you have asked for it;</li>
          <li>keep Bright Roots secure and working properly.</li>
        </ul>
        <p>
          We do not sell your information, we do not show adverts, and we do not use your family&apos;s data to
          market to your children.
        </p>
      </>
    ),
  },
  {
    title: "Our legal reasons",
    body: (
      <ul>
        <li>
          <strong>Contract:</strong> most of the information is needed to provide the service you signed up for.
        </li>
        <li>
          <strong>Consent:</strong> for the newsletter and optional emails. You can withdraw it at any time.
        </li>
        <li>
          <strong>Legitimate interests:</strong> to keep accounts secure and prevent misuse.
        </li>
        <li>
          <strong>Legal obligation:</strong> to keep payment records where the law requires it.
        </li>
      </ul>
    ),
  },
  {
    title: "Children's information",
    body: (
      <>
        <p>
          Child accounts are created and managed by a parent or guardian, who decides what goes into them.
          Children don&apos;t need an email address, and they can only see their own learning and what their
          parent shares with them.
        </p>
        <p>
          We treat children&apos;s information with extra care. It is only used to run Bright Roots for your family
          and is never used for advertising or profiling.
        </p>
      </>
    ),
  },
  {
    title: "Who we share it with",
    body: (
      <>
        <p>We only share information with trusted services that help us run Bright Roots:</p>
        <ul>
          <li>
            <strong>Stripe</strong>, to take membership payments.
          </li>
          <li>
            <strong>Resend</strong>, to send account emails, reminders and the newsletter.
          </li>
          <li>
            <strong>Our hosting provider</strong>, which stores the website and its data on secure servers.
          </li>
        </ul>
        <p>
          When you add an Oak National Academy results link, Bright Roots fetches the quiz scores from Oak.
          We don&apos;t send Oak any information about your family.
        </p>
        <p>
          We will only share information in any other way if the law requires it, for example if we receive a
          valid request from the police or a court.
        </p>
      </>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        Bright Roots uses one essential cookie to keep you logged in, plus your browser&apos;s local storage to
        remember small settings such as your colour theme. We don&apos;t use advertising or tracking cookies,
        so there is nothing to opt out of.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        We keep your family&apos;s information for as long as your account is open, so your records are there when
        you need them. If you delete your account, everything is removed straight away, including uploaded
        photos and files. Copies in our backups are overwritten within a short time. We keep basic payment
        records for as long as the law requires.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>see the information we hold about you and your children;</li>
          <li>correct anything that is wrong;</li>
          <li>have your information deleted;</li>
          <li>take a copy of your information with you;</li>
          <li>object to or restrict how we use it, and withdraw consent at any time.</li>
        </ul>
        <p>
          You can download everything, or delete your whole account, yourself from the{" "}
          <Link href="/account">Account page</Link>. For anything else, email {mail}.
        </p>
        <p>
          If you&apos;re unhappy with how we have handled your information, you can complain to the Information
          Commissioner&apos;s Office at <a href="https://ico.org.uk">ico.org.uk</a>. We&apos;d appreciate the
          chance to put things right first.
        </p>
      </>
    ),
  },
  {
    title: "Keeping it safe",
    body: (
      <p>
        Bright Roots is only available over a secure (HTTPS) connection. Passwords are hashed, each family
        can only see its own information, and uploaded files are only available to the family that added
        them.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        If we make important changes, we&apos;ll update the date at the top of this page and let members know by
        email.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      intro={
        <p>
          Bright Roots holds information about your family and your children&apos;s learning, and we take that
          seriously. This page explains, in plain English, what we collect, why, and the choices you have.
        </p>
      }
      sections={sections}
    />
  );
}
