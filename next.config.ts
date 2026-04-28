import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/HIE-Lab-Website",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
