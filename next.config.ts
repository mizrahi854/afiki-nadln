import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A second dev server in the same folder (preview on 3100) keeps its own build cache, so the two don't corrupt each other.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
