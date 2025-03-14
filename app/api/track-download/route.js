import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req) {
  try {
    const { imageNumber } = await req.json();

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    // First, check if the sheet exists and has the correct structure
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'FW25IMAGES!A:B',
    });

    const rows = response.data.values || [];

    // If sheet is empty or needs initialization
    if (rows.length === 0) {
      // Initialize the sheet with headers and image numbers
      const initialData = [
        ['IMAGE NUMBER', 'DOWNLOADS'],
        ...Array.from({ length: 32 }, (_, i) => [`IMAGE ${i + 1}`, '0'])
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'FW25IMAGES!A1:B33',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: initialData,
        },
      });
    }

    // Update download count for specific image
    const rowIndex = imageNumber + 1; // +1 for header row
    const currentValue = rows[rowIndex] ? parseInt(rows[rowIndex][1]) || 0 : 0;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `FW25IMAGES!B${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[currentValue + 1]],
      },
    });

    return NextResponse.json({ message: 'Download tracked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json({ error: 'Error tracking download' }, { status: 500 });
  }
}