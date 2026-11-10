import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/flatfile';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, taxId, role } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลบังคับให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = await readData('users.json');

    // ตรวจสอบอีเมลซ้ำ
    const existingUser = users.find((u) => u.email === cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone?.trim() || null,
      taxId: taxId?.trim() || null,
      role: role || 'EXPORTER',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeData('users.json', users);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { success: true, message: 'ลงทะเบียนสำเร็จ', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด: ' + error.message },
      { status: 500 }
    );
  }
}