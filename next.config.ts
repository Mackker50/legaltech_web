import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    // ปิดการรัน ESLint ตอน Build เพื่อป้องกัน Error เรื่อง Parser serialization
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;