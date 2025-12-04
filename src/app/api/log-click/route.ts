import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract fields
    const { productId, vendor, uuid } = body;

    console.log('CLICK LOG:', { productId, vendor, uuid });

    // OPTIONAL: Save to MongoDB / external API
    // await db.clicks.insertOne({ productId, vendor, uuid, date: new Date() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Log-click error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
