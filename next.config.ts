import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Leaner production server (fewer modules loaded, lower memory footprint) for
  // deploying on Render's 512MB free tier. Served via `node .next/standalone/server.js`.
  output: "standalone",
};

export default nextConfig;
