import path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to THIS project. A stray package.json/package-lock.json
  // in C:\Users\kumar\Downloads was making Next treat all of Downloads (642 items)
  // as the root and file-trace/watch that whole tree on every compile.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
