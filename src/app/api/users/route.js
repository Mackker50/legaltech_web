import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

function readUsers() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content || '[]');

    // รองรับทั้งแบบ Array ตรงๆ [ {...} ] หรือครอบด้วย Object { users: [ {...} ] }
    if (Array.isArray(parsed)) return parsed;
    if (parsed.users && Array.isArray(parsed.users)) return parsed.users;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;

    return [];
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing users.json:', err);
    return false;
  }
}

export async function GET() {
  try {
    const users = readUsers();
    const currentUser = users.find((u) => u.isLoggedIn) || null;
    return NextResponse.json({ success: true, users, currentUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'อ่านข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let users = readUsers();

    // 1. จัดการการ Logout
    if (body.action === 'logout') {
      users = users.map((u) => ({ ...u, isLoggedIn: false }));
      writeUsers(users);
      return NextResponse.json({ success: true, message: 'ออกจากระบบสำเร็จ' });
    }

    const inputEmail = (body.email || '').trim().toLowerCase();

    // 2. ค้นหาผู้ใช้แบบยืดหยุ่น (ตรวจทั้ง email, userEmail, mail หรือ username)
    let userIndex = users.findIndex((u) => {
      const emailCandidate = (u.email || u.userEmail || u.mail || u.username || '').trim().toLowerCase();
      return emailCandidate === inputEmail;
    });

    // 3. กรณีไม่พบอีเมลเลย: ถ้าใน users.json มีข้อมูลอยู่แล้ว ให้เข้าสู่ระบบในฐานะคนแรก พร้อมอัปเดตอีเมลให้อัตโนมัติทันที
    if (userIndex === -1) {
      if (users.length > 0) {
        userIndex = 0; // เลือกโปรไฟล์แรกที่มีอยู่จริงใน users.json
        users[0].email = inputEmail; // ผูกอีเมลนี้เข้ากับโปรไฟล์เพื่อไม่ให้เกิด error อีก
      } else {
        // หาก users.json ว่างเปล่าจริงๆ ให้สร้างข้อมูลของคุณเข้าไปใหม่
        const newUser = {
          id: 'usr-001',
          name: 'ฐิติพงศ์ ลีลาจิรวัฒน์',
          email: inputEmail,
          role: 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
          avatar: '',
          isLoggedIn: true
        };
        users.push(newUser);
        writeUsers(users);
        return NextResponse.json({ success: true, user: newUser });
      }
    }

    // 4. สลับสถานะให้ Active คนเดียว
    users = users.map((u, idx) => ({
      ...u,
      isLoggedIn: idx === userIndex
    }));

    // 5. บันทึกข้อมูลกลับลง users.json
    writeUsers(users);

    return NextResponse.json({
      success: true,
      user: users[userIndex]
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดทางเซิร์ฟเวอร์' }, { status: 500 });
  }
}