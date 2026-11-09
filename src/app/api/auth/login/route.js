import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // จำลองการตรวจสอบสิทธิ์เข้าใช้งาน
    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token: 'mock-jwt-token-xyz',
      user: {
        email,
        role: 'EXPORTER', // คืนค่า Role ผู้ใช้
        fullName: 'ฐิติพงศ์ ลีลาจิรวัฒน์',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}