import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: ดึงรายการดีลสัญญาส่งออกทั้งหมด
export async function GET(request) {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        documents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, deals }, { status: 200 });
  } catch (error) {
    console.error('Fetch Deals Error:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถดึงข้อมูลดีลได้: ' + error.message },
      { status: 500 }
    );
  }
}

// 2. POST: สร้างดีลสัญญาส่งออกใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      productCategory,
      quantityKg,
      totalValueUSD,
      destinationCountry,
      incoterm,
      creatorId,
    } = body;

    // ตรวจสอบข้อมูลบังคับ
    if (!title || !productCategory || !quantityKg || !totalValueUSD || !destinationCountry || !creatorId) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลสัญญาส่งออกให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // บันทึกดีลลงใน PostgreSQL
    const newDeal = await prisma.deal.create({
      data: {
        title: title.trim(),
        productCategory: productCategory.trim(),
        quantityKg: parseFloat(quantityKg),
        totalValueUSD: parseFloat(totalValueUSD),
        destinationCountry: destinationCountry.trim(),
        incoterm: incoterm || 'FOB',
        creatorId: creatorId,
        status: 'DRAFT',
      },
    });

    return NextResponse.json(
      { success: true, message: 'สร้างดีลสัญญาส่งออกเรียบร้อยแล้ว', deal: newDeal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Deal Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างดีล: ' + error.message },
      { status: 500 }
    );
  }
}