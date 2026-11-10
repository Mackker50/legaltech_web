import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, taxId, role } = body;

    // 1. ตรวจสอบข้อมูลบังคับ ต้องระบุครบถ้วน
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลบังคับ (ชื่อ, นามสกุล, อีเมล, รหัสผ่าน) ให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanTaxId = taxId && taxId.trim() !== '' ? taxId.trim() : null;
    const cleanPhone = phone && phone.trim() !== '' ? phone.trim() : null;

    // 2. ตรวจสอบผู้ใช้งานซ้ำใน PostgreSQL (Email หรือ Tax ID)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(cleanTaxId ? [{ taxId: cleanTaxId }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'อีเมลหรือเลขผู้เสียภาษีนี้ถูกใช้งานในระบบแล้ว' },
        { status: 400 }
      );
    }

    // 3. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกข้อมูลลงใน PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: cleanPhone,
        taxId: cleanTaxId,
        role: role || 'EXPORTER',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'ลงทะเบียนสำเร็จ',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ' + error.message },
      { status: 500 }
    );
  }
}