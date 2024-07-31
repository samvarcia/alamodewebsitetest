import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/api/check-approval');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}