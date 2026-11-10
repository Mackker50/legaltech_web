import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // หากต้องการระบุ Root สำหรับ Vercel/Turbopack ให้ตั้งค่าให้เท่ากัน:
  experimental: {
    outputFileTracingRoot: path.join(process.cwd()),
    turbopack: {
      root: path.join(process.cwd()),
    },
  },
};

export default nextConfig;