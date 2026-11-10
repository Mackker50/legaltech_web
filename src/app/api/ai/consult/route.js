import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // ระบบจำลองคำแนะนำทางกฎหมาย (แบบไม่มี AI)
    return NextResponse.json({
      success: true,
      result: '📌 คำแนะนำเบื้องต้น: สำหรับการส่งออกสินค้าเกษตร แนะนำให้ตรวจสอบสัญญาซื้อขาย (Sales Contract) ข้อกำหนด Incoterms และใบรับรองสุขอนามัยพืช (Phytosanitary Certificate) ให้ครบถ้วนก่อนดำเนินการ'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}