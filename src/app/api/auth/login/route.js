import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsers } from '@/lib/jsonAuth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = getUsers();

    // ค้นหาผู้ใช้ในไฟล์ JSON
    const user = users.find(u => u.email === cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' },
        { status: 401 }
      );
    }

    // ตรวจสอบความถูกต้องของรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // ตัด password ออกก่อนส่งกลับ Client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: userWithoutPassword
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}