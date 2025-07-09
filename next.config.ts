import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/meetings',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
