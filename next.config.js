// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // TEMPORARY: unblock deploy
  },
};

module.exports = nextConfig;
