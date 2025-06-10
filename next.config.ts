// import type { NextConfig } from "next";
import { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  // ✅ place eslint setting here at top level
  eslint: {
    ignoreDuringBuilds: true,
  },
  // other global settings if needed
};

// comment

export default withPWA({
  ...nextConfig,
  dest: "public", // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
});
