import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
} as any;

export default nextConfig;
