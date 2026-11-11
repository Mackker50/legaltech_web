import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

// Memory Cache สำหรับรันบน Vercel Serverless
let memoryUsers = [
  {
    id: 'user-001',
    name: 'ฐิติพงศ์ ลีลาจิรวัฒน์',
    email: 'thitipong@agrilegal.pro',
    phone: '081-234-5678',
    company: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
    taxId: '0105562089123',
    address: '88/12 หมู่ 2 ต.ท่าใหม่ อ.ท่าใหม่ จ.จันทบุรี 22120',
    role: 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
    isLoggedIn: true
  }
];

function readUsers() {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content || '[]');
      const users = Array.isArray(parsed) ? parsed : parsed.users || [];
      if (users.length > 0) return users;
    }
  } catch (err) {
    console.warn('Read filesystem warning (using memory cache):', err.message);
  }
  return memoryUsers;
}

function writeUsers(users) {
  memoryUsers = users; // บันทึกลง Memory เสมอ
  try {
    // พยายามเขียนไฟล์ (กรณีรันบน Localhost)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
    }
    return true;
  } catch (err) {
    // บน Vercel จะตกมาที่นี่ แต่เราถือว่าบันทึกลง memory สำเร็จแล้ว
    console.warn('Filesystem write bypassed on Vercel Read-Only environment');
    return true;
  }
}

export async function GET() {
  try {
    const users = readUsers();
    const currentUser = users.find((u) => u.isLoggedIn) || users[0] || null;
    return NextResponse.json({ success: true, users, currentUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'อ่านข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let users = readUsers();

    if (body.action === 'logout') {
      users = users.map((u) => ({ ...u, isLoggedIn: false }));
      writeUsers(users);
      return NextResponse.json({ success: true, message: 'ออกจากระบบสำเร็จ' });
    }

    // กรณีลงทะเบียนใหม่ (Register)
    if (body.action === 'register') {
      const existingUser = users.find((u) => u.email?.toLowerCase() === body.email?.toLowerCase());
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'อีเมลนี้ถูกลงทะเบียนแล้ว' }, { status: 400 });
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: body.name || body.fullName || '',
        email: body.email || '',
        phone: body.phone || '',
        company: body.company || '',
        taxId: body.taxId || '',
        address: body.address || '',
        role: body.role || 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
        avatar: body.avatar || '',
        isLoggedIn: true
      };

      users.push(newUser);
      writeUsers(users);

      return NextResponse.json({
        success: true,
        message: 'ลงทะเบียนสำเร็จ',
        user: newUser
      });
    }

    // กรณีอัปเดตข้อมูล Profile
    let userIndex = users.findIndex(
      (u) => (body.id && u.id === body.id) ||
             (body.originalEmail && u.email?.toLowerCase() === body.originalEmail?.toLowerCase()) ||
             (body.email && u.email?.toLowerCase() === body.email?.toLowerCase())
    );

    if (userIndex === -1) {
      userIndex = users.findIndex((u) => u.isLoggedIn);
      if (userIndex === -1) userIndex = 0;
    }

    users[userIndex] = {
      ...users[userIndex],
      name: body.name !== undefined ? body.name : users[userIndex]?.name,
      email: body.email !== undefined ? body.email : users[userIndex]?.email,
      phone: body.phone !== undefined ? body.phone : users[userIndex]?.phone,
      company: body.company !== undefined ? body.company : users[userIndex]?.company,
      taxId: body.taxId !== undefined ? body.taxId : users[userIndex]?.taxId,
      address: body.address !== undefined ? body.address : users[userIndex]?.address,
      role: body.role !== undefined ? body.role : users[userIndex]?.role,
      avatar: body.avatar !== undefined ? body.avatar : users[userIndex]?.avatar,
      isLoggedIn: body.isLoggedIn !== undefined ? body.isLoggedIn : users[userIndex]?.isLoggedIn ?? true
    };

    writeUsers(users);

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลสำเร็จ',
      user: users[userIndex]
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
}