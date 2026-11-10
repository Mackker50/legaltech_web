import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // ระบบจำลองเช็กลิสต์เอกสาร (แบบไม่มี AI)
    return NextResponse.json({
      success: true,
      checklist: [
        '1. ตรวจสอบและลงนามในสัญญาซื้อขาย (Sales Contract)',
        '2. ตรวจสอบพิกัดอัตราศุลกากร (HS Code)',
        '3. ขอใบรับรองสุขอนามัยพืช (Phytosanitary Certificate - DOA)',
        '4. จัดเตรียมเอกสารใบกำกับสินค้า (Commercial Invoice & Packing List)',
        '5. ตรวจสอบมาตรการภาษีและโควตาของประเทศปลายทาง'
      ]
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}