import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { product, destination, incoterm } = await request.json();

    const promptText = `วิเคราะห์รายการเอกสารทางกฎหมายและใบรับรองที่จำเป็นสำหรับการส่งออก:
- สินค้า: ${product}
- ประเทศปลายทาง: ${destination}
- เงื่อนไข Incoterms: ${incoterm}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
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
                  responsible_party: { type: 'STRING', description: 'Exporter, Middleman, or Freight Forwarder' },
                  is_mandatory: { type: 'BOOLEAN' },
                  description: { type: 'STRING' },
                },
                required: ['doc_name', 'responsible_party', 'is_mandatory'],
              },
            },
            legal_warnings: {
              type: 'ARRAY',
              items: { type: 'STRING' },
            },
          },
        },
      },
    });

    const checklistData = JSON.parse(response.text);

    return NextResponse.json({
      success: true,
      data: checklistData,
    });
  } catch (error) {
    console.error('Checklist Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}