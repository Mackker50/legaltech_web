import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { productCategory, destinationCountry, incoterm, prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกคำถาม' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // 👈 เปลี่ยนเป็นโมเดลมาตรฐานฟรีที่เสถียรที่สุด
      messages: [
        {
          role: 'system',
          content: 'คุณคือผู้เชี่ยวชาญด้านกฎหมายส่งออกสินค้าเกษตรและ Incoterms 2020 อธิบายด้วยภาษาไทยที่เข้าใจง่าย รัดกุม ชัดเจน',
        },
        {
          role: 'user',
          content: `สินค้าเกษตร: ${productCategory}\nประเทศปลายทาง: ${destinationCountry}\nเงื่อนไข Incoterms: ${incoterm}\nคำถามข้อสงสัย: ${prompt}`,
        },
      ],
      temperature: 0.2,
    });

    return NextResponse.json({
      success: true,
      advice: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Groq Consult API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}