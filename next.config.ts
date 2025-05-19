import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["github.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
