import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ThemeSync from "@/components/ThemeSync";
import ServiceWorker from "@/components/ServiceWorker";
import CookieNotice from "@/components/CookieNotice";
import VisitorStats from "@/components/VisitorStats";
import ErrorReports from "@/components/ErrorReports";
import ProblemNotice from "@/components/ProblemNotice";
import AccessHelper from "@/components/AccessHelper";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { DISPLAY_BOOT_SCRIPT } from "@/lib/display";
import { easyRead } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const DESCRIPTION =
  "A calm home education planner for UK families. Plan the week or simply log what you did, give each child their own space to learn, and keep a record of progress, reading, spellings and results in one place.";

// Public pages (home, guides, policies) are built once and refreshed every hour, so they load fast.
// The private parts of the site are drawn fresh for each visit instead: each has its own layout.tsx
// saying so, because built-once pages kept the build day's date and the planner showed the wrong "today".
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Each page names its own address as the real one, so copies with tracking codes on the end don't count separately.
  alternates: { canonical: "./" },
  title: {
    default: "Bright Roots Home Learning | Home education planner for families",
    template: "%s | Bright Roots",
  },
  description: DESCRIPTION,
  keywords: [
    "home education planner",
    "homeschooling planner",
    "home learning planner for families",
    "home education record keeping",
    "UK home education",
    "homeschool progress tracking",
    "homeschool planner UK",
    "home learning",
    "elective home education",
    "homeschool record keeping",
    "Oak National Academy",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Bright Roots Home Learning",
    title: "Bright Roots Home Learning",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bright Roots Home Learning",
    description: DESCRIPTION,
  },
  applicationName: "Bright Roots",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/icons/icon-192.png"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Bright Roots",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${nunito.className} ${easyRead.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3F5D46" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: DISPLAY_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen text-gray-900 antialiased">
        <ThemeSync />
        <ServiceWorker />
        <CookieNotice />
        <VisitorStats />
        <ErrorReports />
        <ProblemNotice />
        <AccessHelper />
        {children}
      </body>
    </html>
  );
}
