import { NextResponse } from 'next/server';
import { readData } from '@/lib/flatfile';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const users = await readData('users.json');

    const user = users.find((u) => u.email === email?.trim().toLowerCase());
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผู้ใช้นี้ในระบบ' },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { success: true, message: 'เข้าสู่ระบบสำเร็จ', user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด: ' + error.message },
      { status: 500 }
    );
  }
}