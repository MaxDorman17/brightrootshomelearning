"use client";

import NewsletterTokenPage from "@/components/NewsletterTokenPage";
import { unsubscribeNewsletter } from "@/lib/api";

export default function UnsubscribeNewsletterPage() {
  return <NewsletterTokenPage title="Unsubscribe" action={unsubscribeNewsletter} />;
}
