import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // allow placeholder images used as a fallback in the profile page
    domains: ["via.placeholder.com"],
  },
};

export default nextConfig;
