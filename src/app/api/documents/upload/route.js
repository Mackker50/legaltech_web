import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: ดึงรายการเอกสาร Checklist ทั้งหมดตาม dealId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('dealId');

    if (!dealId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ dealId ใน query parameter' },
        { status: 400 }
      );
    }

    const documents = await prisma.document.findMany({
      where: { dealId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, documents }, { status: 200 });
  } catch (error) {
    console.error('Fetch Documents Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงรายการเอกสาร: ' + error.message },
      { status: 500 }
    );
  }
}

// 2. POST: เพิ่มเอกสารใหม่ใน Checklist ของ Deal
export async function POST(request) {
  try {
    const body = await request.json();
    const { dealId, docName, responsibleParty, isMandatory, description } = body;

    if (!dealId || !docName || !responsibleParty) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลบังคับ (dealId, docName, responsibleParty) ให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า Deal มีอยู่จริงหรือไม่
    const dealExists = await prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!dealExists) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสัญญา/ดีลที่ระบุ' },
        { status: 404 }
      );
    }

    const newDocument = await prisma.document.create({
      data: {
        dealId,
        docName: docName.trim(),
        responsibleParty: responsibleParty.trim(),
        isMandatory: isMandatory !== undefined ? Boolean(isMandatory) : true,
        description: description ? description.trim() : null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { success: true, message: 'เพิ่มเอกสารลงใน Checklist สำเร็จ', document: newDocument },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Document Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างรายการเอกสาร: ' + error.message },
      { status: 500 }
    );
  }
}

// 3. PATCH: อัปเดตสถานะเอกสาร หรือ URL ของไฟล์เอกสารที่อัปโหลด
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, fileUrl, description } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ id ของเอกสารที่ต้องการอัปเดต' },
        { status: 400 }
      );
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(
      { success: true, message: 'อัปเดตข้อมูลเอกสารสำเร็จ', document: updatedDocument },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Document Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตเอกสาร: ' + error.message },
      { status: 500 }
    );
  }
}