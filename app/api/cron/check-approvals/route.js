import { NextResponse } from 'next/server';

export async function GET(request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/check-approval`, {
      method: 'GET',
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Check approval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}