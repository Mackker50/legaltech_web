import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Named Export สำหรับรองรับคำขอประเภท POST
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. ตรวจสอบข้อมูลที่ส่งเข้ามา
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // 2. ค้นหาผู้ใช้งานในฐานข้อมูล PostgreSQL ผ่าน Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // 3. เปรียบเทียบ Hash รหัสผ่านด้วย bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // 4. ส่งผลลัพธ์ข้อมูลผู้ใช้งานกลับไป (ยกเว้นรหัสผ่าน)
    return NextResponse.json(
      {
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role,
          taxId: user.taxId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message },
      { status: 500 }
    );
  }
}