import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

function readUsers() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content || '[]');
    if (Array.isArray(parsed)) return parsed;
    if (parsed.users && Array.isArray(parsed.users)) return parsed.users;
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

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลใน data/users.json' }, { status: 404 });
    }

    if (body.action === 'logout') {
      users = users.map((u) => ({ ...u, isLoggedIn: false }));
      writeUsers(users);
      return NextResponse.json({ success: true, message: 'ออกจากระบบสำเร็จ' });
    }

    let userIndex = users.findIndex(
      (u) => (body.id && u.id === body.id) || 
             (body.originalEmail && u.email?.toLowerCase() === body.originalEmail?.toLowerCase()) || 
             (body.email && u.email?.toLowerCase() === body.email?.toLowerCase())
    );

    if (userIndex === -1) {
      userIndex = users.findIndex((u) => u.isLoggedIn);
      if (userIndex === -1) userIndex = 0;
    }

    // อัปเดตข้อมูลทุกฟิลด์รวมถึง Address
    users[userIndex] = {
      ...users[userIndex],
      name: body.name !== undefined ? body.name : users[userIndex].name,
      email: body.email !== undefined ? body.email : users[userIndex].email,
      phone: body.phone !== undefined ? body.phone : users[userIndex].phone,
      company: body.company !== undefined ? body.company : users[userIndex].company,
      taxId: body.taxId !== undefined ? body.taxId : users[userIndex].taxId,
      address: body.address !== undefined ? body.address : users[userIndex].address,
      role: body.role !== undefined ? body.role : users[userIndex].role,
      avatar: body.avatar !== undefined ? body.avatar : users[userIndex].avatar,
      isLoggedIn: body.isLoggedIn !== undefined ? body.isLoggedIn : users[userIndex].isLoggedIn ?? true
    };

    writeUsers(users);

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      user: users[userIndex]
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดทางเซิร์ฟเวอร์' }, { status: 500 });
  }
}