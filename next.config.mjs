/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig = {
  async redirects() {
    return [
      { source: "/pricing", destination: "/calculator", permanent: true },
      { source: "/contact", destination: "/strategy-call", permanent: true },
      { source: "/services", destination: "/what-we-build", permanent: true },
      { source: "/book", destination: "/strategy-call", permanent: true },
      { source: "/work", destination: "/case-studies", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
