import type { NextConfig } from "next";

// GitHub Actions에서만 basePath 적용 (GitHub Pages용)
// Vercel 배포 시에는 basePath 없음
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? "/portfolio-next" : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
