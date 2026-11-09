import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. อนุญาตการเข้าถึงจาก IP ภายนอก/วง LAN
  allowedDevOrigins: ['192.168.1.2', 'localhost:3000'],

  // 2. ตั้งค่า Turbopack Root ให้ครอบคลุม Root Directory ของโปรเจกต์
  turbopack: {
    root: path.resolve(__dirname, '../..'), // ชี้ไปยัง Parent Directory ชนิดที่ Git/package-lock ครอบคลุม
  },
};

export default nextConfig;