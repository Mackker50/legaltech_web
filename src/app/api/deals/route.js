import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'deals.json');

function readDeals() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(filePath)) {
      const defaultDeals = [
        {
          dealId: 'EXP-2026-001',
          productName: 'ทุเรียนหมอนทองสด',
          destination: 'จีน (Shanghai Port)',
          buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
          companyName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
          quantity: '25,000 กิโลกรัม (1 ตู้ Reefer 40ft)',
          price: '4,500,000 บาท',
          incoterm: 'CIF - Cost, Insurance and Freight',
          incotermCode: 'CIF',
          deliveryTarget: '2026-11-25',
          currentStep: 1,
          status: 'COMPLETED',
          docTitle: 'สัญญาซื้อขายส่งออก (Sales Contract)',
          docType: 'CONTRACT',
          date: '2026-11-10',
          documents: [
            { id: 'doc-1', name: 'หนังสือสัญญาซื้อขายส่งออก (Export Sales Contract)', code: 'CONTRACT', required: true, uploaded: true, fileName: 'EXP-2026-001_Sales_Contract.pdf' },
            { id: 'doc-2', name: 'ใบกำกับสินค้าส่งออก (Commercial Invoice)', code: 'INVOICE', required: true, uploaded: true, fileName: 'EXP-2026-001_Invoice.pdf' },
            { id: 'doc-3', name: 'ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)', code: 'PHYTO', required: true, uploaded: false, fileName: '' }
          ]
        }
      ];
      fs.writeFileSync(filePath, JSON.stringify(defaultDeals, null, 2), 'utf8');
      return defaultDeals;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading deals.json:', err);
    return [];
  }
}

function writeDeals(deals) {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(deals, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing deals.json:', err);
    return false;
  }
}

export async function GET() {
  const deals = readDeals();
  return NextResponse.json({ success: true, deals });
}

export async function POST(request) {
  try {
    const body = await request.json();
    let deals = readDeals();

    const index = deals.findIndex((d) => d.dealId === body.dealId);
    if (index !== -1) {
      deals[index] = { ...deals[index], ...body };
    } else {
      deals.unshift(body);
    }

    writeDeals(deals);
    return NextResponse.json({ success: true, deal: body });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกดีล' }, { status: 500 });
  }
}