// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable if you need to handle large files
    serverComponentsExternalPackages: ['sharp'],
  },
  webpack(config: { module: { rules: { test: RegExp; type: string; }[]; }; }) {
    // Support importing .webp files
    config.module.rules.push({
      test: /\.(webp)$/i,
      type: 'asset/resource',
    });
    
    return config;
  },
  // Increase the API route body size limit for larger images
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

module.exports = nextConfig;