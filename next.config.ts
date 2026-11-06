import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the contact page was removed; every page ends with the contact block, the home page's is the fallback
  async redirects() { return [{ source: '/contact', destination: '/#talk-title', permanent: false }]; },
  // A second dev server in the same folder (preview on 3100) keeps its own build cache, so the two don't corrupt each other.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
