import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const userRole = request.headers.get('x-user-role') || 'EXPORTER';
    const formData = await request.formData();
    const file = formData.get('document');
    const isConfidential = formData.get('isConfidential') === 'true';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'กรุณาแนบไฟล์เอกสาร' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const targetDir = isConfidential
      ? path.join(process.cwd(), 'uploads/contracts')
      : path.join(process.cwd(), 'uploads/certificates');

    await mkdir(targetDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(targetDir, safeName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดเอกสารเรียบร้อยแล้ว',
      fileInfo: { filename: safeName, originalName: file.name, size: file.size, isConfidential, uploadedByRole: userRole }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกไฟล์' }, { status: 500 });
  }
}