import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { productCategory, destinationCountry, prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกคำถาม' },
        { status: 400 }
      );
    }

    const systemInstruction = `คุณคือผู้เชี่ยวชาญด้านกฎหมายการส่งออกสินค้าเกษตร (Agri-Export Legal & Trade Specialist)
    หน้าที่ของคุณคือให้คำแนะนำเรื่อง Incoterms 2020, เอกสารสัญญา, และข้อกำหนดการส่งออก ให้ถูกต้อง เข้าใจง่าย และตรงประเด็น`;

    const userContent = `สินค้า: ${productCategory || 'ไม่ระบุ'}
ประเทศปลายทาง: ${destinationCountry || 'ไม่ระบุ'}
คำถาม: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: {
        systemInstruction,
        temperature: 0.2, // ลดอคติ เพิ่มความแม่นยำทางกฎหมาย
      },
    });

    return NextResponse.json({
      success: true,
      advice: response.text,
    });
  } catch (error) {
    console.error('AI Consult Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการประมวลผล AI' },
      { status: 500 }
    );
  }
}