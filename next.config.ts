import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // กำหนด Root ให้เจาะจงที่โฟลเดอร์โปรเจกต์นี้เพื่อแก้ปัญหาเตือนเรื่องหลาย lockfiles
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;