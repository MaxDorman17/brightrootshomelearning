/** @type {import('next').NextConfig} */

// Standard browser protections sent with every page.
const securityHeaders = [
  // Only ever load the site over HTTPS
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  // Don't let other sites show Bright Roots inside a frame
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
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
