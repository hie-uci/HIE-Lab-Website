import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // 静态导出，用于 GitHub Pages
  images: {
    unoptimized: true,  // GitHub Pages 不支持图片优化
  },
};

export default nextConfig;
