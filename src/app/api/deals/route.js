import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/flatfile';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const deals = await readData('deals.json');
  return NextResponse.json({ success: true, deals }, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const deals = await readData('deals.json');

    const newDeal = {
      id: uuidv4(),
      ...body,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };

    deals.push(newDeal);
    await writeData('deals.json', deals);

    return NextResponse.json({ success: true, deal: newDeal }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}