import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, phone, taxId, role } = await request.json();

    // 1. ตรวจสอบข้อมูลซ้ำใน PostgreSQL
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { taxId }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'อีเมลหรือเลขประจำตัวผู้เสียภาษีนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // 2. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. บันทึกผู้ใช้ใหม่ลงฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        taxId,
        role: role || 'EXPORTER',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName },
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}