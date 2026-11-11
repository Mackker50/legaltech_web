import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'info.json');

function getInfoData() {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Error reading info.json:', err);
  }
  return {};
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').toLowerCase().trim();
  const country = (searchParams.get('country') || '').toUpperCase().trim();
  const commodity = (searchParams.get('commodity') || '').toLowerCase().trim();

  const data = getInfoData();

  // ดึงข้อมูลทั้งหมด
  if (!query && !country && !commodity) {
    return NextResponse.json({ success: true, data });
  }

  // ระบบค้นหาและวิเคราะห์ข้อกำหนดอัตโนมัติ
  let matchedProtocols = [];
  let matchedCommodities = [];
  let matchedLaws = [];

  // กรองตามประเทศ
  if (country && data.countryProtocols?.[country]) {
    matchedProtocols.push({
      code: country,
      ...data.countryProtocols[country]
    });
  }

  // กรองตามสินค้า
  if (commodity && data.commodities?.[commodity]) {
    matchedCommodities.push({
      key: commodity,
      ...data.commodities[commodity]
    });
  }

  // กรองข้อความค้นหาทั่วไป (General Keyword Search)
  if (query) {
    // ค้นหากฎหมาย
    if (Array.isArray(data.generalExportLaws)) {
      matchedLaws = data.generalExportLaws.filter(law =>
        law.title?.toLowerCase().includes(query) ||
        law.requirement?.toLowerCase().includes(query) ||
        law.authority?.toLowerCase().includes(query)
      );
    }

    // ค้นหาในพิธีสารแต่ละประเทศ
    if (data.countryProtocols) {
      Object.entries(data.countryProtocols).forEach(([code, p]) => {
        if (
          p.countryName?.toLowerCase().includes(query) ||
          p.regulator?.toLowerCase().includes(query) ||
          p.prohibitions?.toLowerCase().includes(query) ||
          p.tariffBenefits?.toLowerCase().includes(query)
        ) {
          if (!matchedProtocols.some(m => m.code === code)) {
            matchedProtocols.push({ code, ...p });
          }
        }
      });
    }

    // ค้นหาในสินค้า
    if (data.commodities) {
      Object.entries(data.commodities).forEach(([k, c]) => {
        if (
          c.name?.toLowerCase().includes(query) ||
          c.botanicalName?.toLowerCase().includes(query) ||
          c.hsCode?.includes(query) ||
          c.keyRisks?.toLowerCase().includes(query)
        ) {
          if (!matchedCommodities.some(m => m.key === k)) {
            matchedCommodities.push({ key: k, ...c });
          }
        }
      });
    }
  }

  return NextResponse.json({
    success: true,
    result: {
      matchedLaws,
      matchedProtocols,
      matchedCommodities,
      incoterms: data.incotermsGuide || {}
    }
  });
}