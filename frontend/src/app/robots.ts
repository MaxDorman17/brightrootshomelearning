import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/signup", "/contact", "/privacy", "/terms"],
      disallow: ["/parent", "/child", "/account", "/billing", "/admin", "/onboarding"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
