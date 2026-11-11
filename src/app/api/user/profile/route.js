import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUsers } from '@/lib/jsonAuth';

const filePath = path.join(process.cwd(), 'data', 'users.json');

// GET: ดึงข้อมูลโปรไฟล์ตาม Email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'ไม่ระบุอีเมล' }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' }, { status: 404 });
    }

    const { password: _, ...userData } = user;
    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 });
  }
}

// PUT: อัปเดตข้อมูลโปรไฟล์ลงไฟล์ JSON
export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, fullName, birthDate, address, taxId, phone } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'ไม่ระบุอีเมล' }, { status: 400 });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email.toLowerCase().trim());

    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' }, { status: 404 });
    }

    // อัปเดตข้อมูลใหม่
    users[userIndex] = {
      ...users[userIndex],
      fullName: fullName || users[userIndex].fullName,
      name: fullName || users[userIndex].name,
      birthDate: birthDate || users[userIndex].birthDate,
      address: address || users[userIndex].address,
      taxId: taxId || users[userIndex].taxId,
      phone: phone || users[userIndex].phone,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');

    const { password: _, ...updatedUser } = users[userIndex];
    return NextResponse.json({ success: true, message: 'อัปเดตโปรไฟล์เรียบร้อย', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ไม่สามารถบันทึกข้อมูลได้' }, { status: 500 });
  }
}