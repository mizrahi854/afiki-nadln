import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the contact page was removed; every page ends with the contact block, the home page's is the fallback
  async redirects() { return [{ source: '/contact', destination: '/#talk-title', permanent: false }]; },
  // the demo tour for the client (not linked from the site): a static page in public/tour
  async rewrites() { return [{ source: '/tour', destination: '/tour/index.html' }]; },
  // A second dev server in the same folder (preview on 3100) keeps its own build cache, so the two don't corrupt each other.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
