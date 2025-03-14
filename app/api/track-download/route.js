import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req) {
  try {
    const { imageUrl, filename } = await req.json();

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Check if the image URL already exists in the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'FW25IMAGES!A:C',
    });

    const rows = response.data.values || [];
    const existingRowIndex = rows.findIndex(row => row[0] === imageUrl);

    if (existingRowIndex === -1) {
      // If image doesn't exist, add new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'FW25IMAGES!A:C',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[imageUrl, filename, 1]],
        },
      });
    } else {
      // If image exists, increment download count
      const currentCount = parseInt(rows[existingRowIndex][2]) || 0;
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `FW25IMAGES!C${existingRowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[currentCount + 1]],
        },
      });
    }

    return NextResponse.json({ message: 'Download tracked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json({ error: 'Error tracking download' }, { status: 500 });
  }
}