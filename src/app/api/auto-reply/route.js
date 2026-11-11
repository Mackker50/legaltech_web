import { NextResponse } from 'next/server';
import { getAutoResponse } from '@/lib/responder';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุข้อความที่ต้องการสอบถาม' },
        { status: 400 }
      );
    }

    // ประมวลผลคำตอบแบบ Rule-Based (ไม่ใช้ AI)
    const result = getAutoResponse(message);

    return NextResponse.json({
      success: true,
      data: {
        reply: result.message,
        ruleId: result.ruleId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในระบบตอบกลับ' },
      { status: 500 }
    );
  }
}