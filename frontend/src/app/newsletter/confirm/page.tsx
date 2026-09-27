"use client";

import NewsletterTokenPage from "@/components/NewsletterTokenPage";
import { confirmNewsletter } from "@/lib/api";

export default function ConfirmNewsletterPage() {
  return <NewsletterTokenPage title="Newsletter sign-up" action={confirmNewsletter} />;
}
