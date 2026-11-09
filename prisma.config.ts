import { defineConfig, prisma7Schema } from '@prisma/config';

export default defineConfig({
  // ดึงโครงสร้างไฟล์ schema.prisma เดิมของ Prisma 7
  schema: prisma7Schema('prisma/schema.prisma'),
  // กำหนดที่อยู่ Output Client ใหม่สำหรับ Prisma 8
  output: 'src/prisma',
});