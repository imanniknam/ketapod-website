import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Covers, avatars and partner logos arrive from the API/CDN hosts.
    remotePatterns: [
      { protocol: "https", hostname: "api.ketapod.ir" },
      { protocol: "https", hostname: "cdn.ketapod.ir" },
      { protocol: "https", hostname: "**.ketapod.ir" },
    ],
  },
};

export default nextConfig;
