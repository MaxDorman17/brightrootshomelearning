/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

if (production && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "\n*** NEXT_PUBLIC_API_URL is not set. The site will be built to talk to http://localhost:8000, " +
      "so on a live server it would load but show no data. Set it before building. ***\n"
  );
}

// What a page is allowed to load. Scripts may only come from the site itself and our own visitor
// counter, so a script slipped in from anywhere else will not run. (Next.js needs its own small
// inline scripts, and its dev mode needs eval.)
const contentSecurityPolicy = [
  `script-src 'self' 'unsafe-inline' https://stats.brightrootshomelearning.co.uk${production ? "" : " 'unsafe-eval'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Standard browser protections sent with every page.
const securityHeaders = [
  // Only ever load the site over HTTPS
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  // Don't let other sites show Bright Roots inside a frame
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Don't guess file types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Share only the site name, not the full page address, when following links elsewhere
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on the site needs the camera, microphone or location
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
