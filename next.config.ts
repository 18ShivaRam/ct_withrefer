import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  // Use a dedicated dev dist directory to avoid Windows EPERM issues,
  // and default to .next in production for Netlify compatibility.
  distDir: isDev ? '.next-dev' : '.next',
};

export default nextConfig;
