/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'api.dicebear.com'],
  },
  // Proxy /api/* to the backend so phone access works:
  // phone hits http://<laptop-ip>:3000/api/... → Next.js dev server
  // → forwarded to http://localhost:4000/api/... (backend on same machine)
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
