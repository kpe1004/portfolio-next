import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages: kpe1004.github.io/portfolio-next
  basePath: "/portfolio-next",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
