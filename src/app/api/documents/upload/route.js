import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/flatfile';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { dealId, docName, responsibleParty, fileUrl, description } = body;

    if (!dealId || !docName) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const documents = await readData('documents.json');
    const newDoc = {
      id: uuidv4(),
      dealId,
      docName: docName.trim(),
      responsibleParty: responsibleParty || 'Exporter',
      fileUrl: fileUrl || null,
      description: description || null,
      status: 'UPLOADED',
      createdAt: new Date().toISOString(),
    };

    documents.push(newDoc);
    await writeData('documents.json', documents);

    return NextResponse.json({ success: true, document: newDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}