import path from "path";

import type { NextConfig } from "next";

const securityHeaders = [
  // 2 years, subdomains included — browsers ignore HSTS over plain http.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Pin the workspace root to THIS project. A stray package.json/package-lock.json
  // in C:\Users\kumar\Downloads was making Next treat all of Downloads (642 items)
  // as the root and file-trace/watch that whole tree on every compile.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  // NOTE: do NOT add a blanket rewrite of /api/:path* to the FastAPI backend.
  // Backend calls must go through the BFF route handlers in
  // src/app/api/{portal,admin}/[...path]/route.ts, which turn the httpOnly
  // wb_session cookie into an Authorization header. A rewrite outranks those
  // dynamic catch-all handlers and ships requests to the backend with no
  // credentials, breaking every authenticated call with a 401.
};

export default nextConfig;
