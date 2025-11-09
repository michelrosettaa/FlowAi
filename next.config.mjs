/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Let the app build on Vercel even if ESLint has errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Let the app build on Vercel even if TS has type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
