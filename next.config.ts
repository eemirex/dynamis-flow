import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output:
    process.env.NETLIFY_STATIC_EXPORT === "true" ? "export" : undefined,
  trailingSlash: process.env.NETLIFY_STATIC_EXPORT === "true",
};

export default nextConfig;
