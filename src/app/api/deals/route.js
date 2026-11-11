import { NextResponse } from 'next/server';

// เก็บในหน่วยความจำชั่วคราว
let dealsStore = [
  {
    dealId: 'EXP-2026-CN01',
    productName: 'ทุเรียนหมอนทองสดเกรดส่งออก',
    destination: 'จีน (Shanghai Port)',
    buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
    companyName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
    quantity: '25,000 กก. (ตู้ Reefer 40ft)',
    price: '4,500,000 บาท',
    incoterm: 'CIF',
    currentStep: 2,
    status: 'IN_PROGRESS',
    date: '2026-11-10'
  }
];

export async function GET() {
  return NextResponse.json({ success: true, deals: dealsStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    dealsStore = [body, ...dealsStore];
    return NextResponse.json({ success: true, deal: body });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}