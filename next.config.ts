/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Let the build succeed even if ESLint finds problems
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Let the build succeed even if TS finds type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
