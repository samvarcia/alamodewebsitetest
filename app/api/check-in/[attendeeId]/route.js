import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request, { params }) {
  const { attendeeId } = params;

  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'APPROVED!A:K', // Adjusted to include all relevant columns
    });

    const rows = response.data.values;
    const attendeeRow = rows.find(row => row[9] === attendeeId); // attendeeId should be in the 10th column (index 9)

    if (attendeeRow) {
      // Update check-in status
      const rowIndex = rows.indexOf(attendeeRow) + 1; // +1 because rows are 1-indexed in Sheets
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `APPROVED!K${rowIndex}`, // K column for check-in status
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['Checked In']]
        }
      });

      return NextResponse.json({ 
        attendee: {
          name: `${attendeeRow[1]} ${attendeeRow[2]}`,
          email: attendeeRow[3],
          party: attendeeRow[0],
          plusOne: attendeeRow[6] === 'Yes' ? attendeeRow[7] : 'None'
        },
        checkInStatus: 'Checked In'
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}