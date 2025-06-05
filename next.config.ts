import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "rwzhjmolzuih5lwk.public.blob.vercel-storage.com",
      "placehold.co",
      "img.freepik.com",
    ],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.public.blob.vercel-storage.com",
    },
    {
      protocol: "https",
      hostname: "placehold.co",
    },
  ],
};

export default nextConfig;
