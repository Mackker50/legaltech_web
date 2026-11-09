import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { product, destination, incoterm } = await request.json();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // 👈 เปลี่ยนเป็นโมเดลมาตรฐานฟรีที่เสถียรที่สุด
      messages: [
        {
          role: 'system',
          content: `คุณคือ AI สกัดรายการเอกสารส่งออก ให้ตอบกลับเป็น JSON Format เท่านั้นตามโครงสร้างนี้:
{
  "required_documents": [
    {
      "doc_name": "ชื่อเอกสาร",
      "responsible_party": "ผู้รับผิดชอบ (เช่น Exporter, Forwarder)",
      "is_mandatory": true/false,
      "description": "คำอธิบายสั้นๆ"
    }
  ]
}`,
        },
        {
          role: 'user',
          content: `วิเคราะห์รายการเอกสารส่งออกสำหรับ สินค้า: ${product}, ปลายทาง: ${destination}, Incoterms: ${incoterm}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Groq Checklist API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}