import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, taxId, newPassword } = await request.json();

    if (!email || !taxId || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // 1. ตรวจสอบว่ามีผู้ใช้งานที่มี Email และ Tax ID ตรงกันหรือไม่
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        taxId: taxId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้งานที่ตรงกับอีเมลและเลขผู้เสียภาษีนี้' },
        { status: 404 }
      );
    }

    // 2. เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. อัปเดตรหัสผ่านใหม่ลงใน PostgreSQL
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที',
    });
  } catch (error) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}