import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bright Roots Home Learning",
    template: "%s | Bright Roots",
  },
  description: "Bright Roots Home Learning Hub",
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
    <html lang="en" className={nunito.className}>
      <head>
        <meta name="theme-color" content="#2F5D3A" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen text-gray-900 antialiased">{children}</body>
    </html>
  );
}
