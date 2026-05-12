/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  compiler: {
    styledComponents: true,
  },
  // Transpile CJS-only packages used by the chatbot lib
  transpilePackages: ['random-id'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
}

module.exports = nextConfig
