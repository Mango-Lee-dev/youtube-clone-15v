import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [["next-swc-darwin-x64", {}]],
  },
};

export default nextConfig;
