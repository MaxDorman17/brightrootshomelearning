import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The private parts of the site, for families who are logged in. A search engine would only find an empty shell.
const PRIVATE = [
  "/account",
  "/achievements",
  "/admin",
  "/app",
  "/billing",
  "/child",
  "/clubs",
  "/coding",
  "/languages",
  "/learning-aids",
  "/make",
  "/membership-required",
  "/moments",
  "/onboarding",
  "/parent",
  "/polish",
  "/reading-log",
  "/spellings",
  "/store",
  "/teens",
  "/units",
  "/newsletter",
  "/reset-password",
  "/verify-email",
  "/forgot-password",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
