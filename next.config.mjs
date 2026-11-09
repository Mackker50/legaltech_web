/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.2', 'localhost:3000'],
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;