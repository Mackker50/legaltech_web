import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsers, saveUser } from '@/lib/jsonAuth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      birthDate, 
      address, 
      taxId, 
      phone, 
      email, 
      password, 
      confirmPassword,
      role 
    } = body;

    // ตรวจสอบการกรอกข้อมูลที่จำเป็น
    if (!fullName || !birthDate || !address || !taxId || !phone || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = getUsers();

    // ตรวจสอบอีเมลซ้ำในไฟล์ JSON
    const existingUser = users.find(u => u.email === cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' },
        { status: 400 }
      );
    }

    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // โครงสร้าง User Object สมบูรณ์
    const newUser = {
      id: 'USER-' + Date.now(),
      fullName: fullName.trim(),
      name: fullName.trim(), // สำหรับแสดงผลบน Navbar
      birthDate,
      address: address.trim(),
      taxId: taxId.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'EXPORTER',
      createdAt: new Date().toISOString()
    };

    // เขียนข้อมูลลงไฟล์ data/users.json
    const isSaved = saveUser(newUser);

    if (!isSaved) {
      return NextResponse.json(
        { success: false, message: 'ไม่สามารถบันทึกข้อมูลลงไฟล์ JSON ได้' },
        { status: 500 }
      );
    }

    // ตัดรหัสผ่านก่อนส่งข้อมูลกลับ Client
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'สร้างบัญชีผู้ใช้สำเร็จ',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}