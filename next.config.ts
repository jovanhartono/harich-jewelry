import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  experimental: {
    ppr: true,
    staleTimes: {
      dynamic: 60 * 5,
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/loader.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
