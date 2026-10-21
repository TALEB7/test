/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@communium/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      // Local NestJS uploads — dev & LAN access
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.7',
        port: '4000',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    // On Vercel, NEXT_PUBLIC_API_URL is the relative "/api" and the top-level
    // vercel.json rewrites route it to the backend service; proxying here would loop.
    if (!/^https?:\/\//.test(apiUrl)) return { fallback: [] };
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
