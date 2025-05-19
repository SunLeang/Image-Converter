/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // For handling large files with sharp
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },

  // Configure webpack for WebP imports
  webpack(config) {
    config.module.rules.push({
      test: /\.(webp)$/i,
      type: "asset/resource",
    });
    return config;
  },

  // Image configuration for Next.js Image component
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    // Special handling for data URLs
    unoptimized: true,
  },
};

module.exports = nextConfig;
