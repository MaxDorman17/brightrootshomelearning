import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ThemeSync from "@/components/ThemeSync";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { SITE_URL } from "@/lib/site";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const DESCRIPTION =
  "A calm home learning planner for UK families. Plan the week, give each child their own space to learn, and keep a record of progress, reading, spellings and results in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bright Roots Home Learning | Home education planner for families",
    template: "%s | Bright Roots",
  },
  description: DESCRIPTION,
  keywords: [
    "home education planner",
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
      { url: "/logo-new.png", type: "image/png" },
    ],
    shortcut: ["/logo-new.png"],
    apple: [
      { url: "/logo-new.png", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Bright Roots",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.className} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2F5D3A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen text-gray-900 antialiased">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
