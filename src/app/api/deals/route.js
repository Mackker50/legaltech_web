import { NextResponse } from 'next/server';
import { getDeals, saveOrUpdateDeal } from '@/lib/jsonDeals';

export async function GET() {
  try {
    const deals = getDeals();
    return NextResponse.json({ success: true, deals });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const dealData = {
      dealId: body.dealId || 'EXP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100),
      productName: body.productName,
      destination: body.destination,
      buyer: body.buyer || '-',
      quantity: body.quantity || '-',
      incoterm: body.incoterm || 'FOB',
      incotermCode: body.incotermCode || 'FOB',
      deliveryTarget: body.deliveryTarget || '-',
      price: body.price || '0 บาท',
      companyName: body.companyName,
      currentStep: body.currentStep || 1,
      documents: body.documents || [],
      auditTimeline: body.auditTimeline || [],
      shippingTimeline: body.shippingTimeline || []
    };

    saveOrUpdateDeal(dealData);
    const updatedDeals = getDeals();
    return NextResponse.json({ success: true, deal: dealData, deals: updatedDeals });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดทางเซิร์ฟเวอร์' }, { status: 500 });
  }
}