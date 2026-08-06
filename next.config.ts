import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.texnohouse.com" },
      { protocol: "https", hostname: "texnohouse.com" },
    ],
  },
};

export default nextConfig;
