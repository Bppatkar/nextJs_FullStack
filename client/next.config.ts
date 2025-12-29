import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },

      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  /* config options here */
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
