import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { firstName, lastName, taxId, email, password, role } = await request.json();

    if (!firstName || !lastName || !taxId || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง' },
        { status: 400 }
      );
    }

    // ในระบบจริงจุดนี้จะคิวรีลง DB (Prisma / PostgreSQL)
    const newUser = {
      id: Date.now(),
      fullName: `${firstName} ${lastName}`,
      taxId,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'ลงทะเบียนเข้าใช้งานเรียบร้อยแล้ว',
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}