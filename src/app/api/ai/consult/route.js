import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { productCategory, destinationCountry, incoterm, prompt } = await request.json();
    if (!prompt) return NextResponse.json({ success: false, error: 'กรุณากรอกคำถาม' }, { status: 400 });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `สินค้า: ${productCategory}, ปลายทาง: ${destinationCountry}, Incoterm: ${incoterm}, คำถาม: ${prompt}`,
      config: {
        systemInstruction: 'คุณคือผู้เชี่ยวชาญด้านกฎหมายส่งออกสินค้าเกษตร อธิบาย Incoterms และข้อตกลงการค้าด้วยภาษาที่เข้าใจง่าย',
        temperature: 0.2,
      },
    });

    return NextResponse.json({ success: true, advice: response.text });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}