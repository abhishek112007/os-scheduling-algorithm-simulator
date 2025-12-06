/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keeping middleware active requires disabling static export
  images: {
    unoptimized: true,
  },
  // Production optimizations for Electron
  productionBrowserSourceMaps: false,
  compress: true,
  swcMinify: true,
  // Reduce build time
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
  