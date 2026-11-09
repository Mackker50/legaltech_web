import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { firstName, lastName, taxId, phone, email, password, role } = await request.json();

    // 1. ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่
    if (!firstName || !lastName || !taxId || !phone || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง' },
        { status: 400 }
      );
    }

    // 2. ตรวจสอบว่าอีเมลหรือเลขผู้เสียภาษีซ้ำหรือไม่
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { taxId }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'อีเมลหรือเลขประจำตัวผู้เสียภาษีนี้ถูกใช้งานในระบบแล้ว' },
        { status: 400 }
      );
    }

    // 3. แฮชรหัสผ่านก่อนบันทึกลง Database
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกผู้ใช้งานใหม่ลงใน PostgreSQL ผ่าน Prisma
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        taxId,
        phone,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ลงทะเบียนเข้าใช้งานเรียบร้อยแล้ว',
      user: {
        id: newUser.id,
        fullName: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน: ' + error.message },
      { status: 500 }
    );
  }
}