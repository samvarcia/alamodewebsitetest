import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch( `${process.env.BASE_URL}/api/check-approval`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}