import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Write build/dev artifacts to a non-hidden folder to mitigate Windows EPERM
  distDir: 'build',
};

export default nextConfig;
