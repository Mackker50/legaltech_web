import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { product, destination, incoterm } = await request.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `วิเคราะห์เอกสารส่งออก สินค้า: ${product}, ปลายทาง: ${destination}, Incoterm: ${incoterm}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            required_documents: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  doc_name: { type: 'STRING' },
                  responsible_party: { type: 'STRING' },
                  is_mandatory: { type: 'BOOLEAN' },
                  description: { type: 'STRING' },
                },
                required: ['doc_name', 'responsible_party', 'is_mandatory'],
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: JSON.parse(response.text) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}