import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use a dedicated dev dist directory to avoid locked 'build' folder on Windows
  distDir: '.next-dev',
};

export default nextConfig;
