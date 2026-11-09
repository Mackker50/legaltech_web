import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis;

const connectionString = process.env.DATABASE_URL;

// 1. สร้าง Connection Pool ผ่าน pg
const pool = new Pool({ connectionString });

// 2. สร้าง Driver Adapter สำหรับ Prisma
const adapter = new PrismaPg(pool);

// 3. Instantiate PrismaClient โดยส่ง adapter เข้าไป
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;