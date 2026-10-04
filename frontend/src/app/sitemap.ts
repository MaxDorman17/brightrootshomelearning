import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/about", 0.8],
    ["/signup", 0.8],
    ["/guides", 0.8],
    ["/guides/first-week", 0.8],
    ["/guides/oak-at-home", 0.8],
    ["/guides/keeping-records", 0.8],
    ["/guides/gcses-at-home", 0.8],
    ["/contact", 0.5],
    ["/privacy", 0.3],
    ["/terms", 0.3],
    ["/privacy/children", 0.3],
    ["/cookies", 0.3],
    ["/refunds", 0.3],
    ["/acceptable-use", 0.3],
    ["/safeguarding", 0.3],
    ["/complaints", 0.3],
  ];
  return pages.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
