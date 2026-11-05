import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // 1. ตรวจสอบสิทธิ์สวมบทบาท (RBAC Simulation จาก Header)
    const userRole = request.headers.get('x-user-role');
    const allowedRoles = ['EXPORTER', 'MIDDLEMAN'];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'คุณไม่มีสิทธิ์อัปโหลดเอกสาร (สิทธิ์เฉพาะ Exporter และ Middleman เท่านั้น)' 
        },
        { status: 403 }
      );
    }

    // 2. ดึงข้อมูล FormData และไฟล์
    const formData = await request.formData();
    const file = formData.get('document');
    const isConfidential = formData.get('isConfidential') === 'true';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์แนบ' },
        { status: 400 }
      );
    }

    // 3. แปลงข้อมูลไฟล์เป็น Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. จัดเตรียมโฟลเดอร์ปลายทาง
    const targetDir = isConfidential
      ? path.join(process.cwd(), 'uploads/contracts')
      : path.join(process.cwd(), 'uploads/certificates');

    await mkdir(targetDir, { recursive: true });

    // 5. บันทึกไฟล์ลง Disk พร้อมตั้งชื่อกันซ้ำ
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(targetDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดเอกสารเรียบร้อยแล้ว',
      fileInfo: {
        filename: uniqueName,
        originalName: file.name,
        size: file.size,
        path: filePath,
        isConfidential,
        uploadedByRole: userRole,
      },
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: 500 }
    );
  }
}