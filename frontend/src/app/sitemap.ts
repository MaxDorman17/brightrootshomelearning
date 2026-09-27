import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/about", 0.8],
    ["/signup", 0.8],
    ["/contact", 0.5],
    ["/privacy", 0.3],
    ["/terms", 0.3],
  ];
  return pages.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
