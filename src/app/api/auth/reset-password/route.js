import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/flatfile';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    const users = await readData('users.json');
    const userIndex = users.findIndex((u) => u.email === email.toLowerCase().trim());

    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: 'ไม่พบผู้ใช้งานนี้ในระบบ' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    users[userIndex].updatedAt = new Date().toISOString();

    await writeData('users.json', users);

    return NextResponse.json({ success: true, message: 'รีเซ็ตรหัสผ่านสำเร็จ' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}