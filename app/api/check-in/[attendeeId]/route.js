import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request, { params }) {
  const { attendeeId } = params;
  console.log(`Checking in attendee with ID: ${attendeeId}`);

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
      range: 'APPROVED!A2:K',
    });

    const rows = response.data.values;
    console.log(`Retrieved ${rows.length} rows from APPROVED sheet`);

    const attendeeRow = rows.find(row => row[9] === attendeeId);
    
    if (attendeeRow) {
      console.log(`Found attendee: ${JSON.stringify(attendeeRow)}`);
      const rowIndex = rows.indexOf(attendeeRow) + 2;
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `APPROVED!K${rowIndex}`,
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
      console.log(`Attendee with ID ${attendeeId} not found in APPROVED sheet`);
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}