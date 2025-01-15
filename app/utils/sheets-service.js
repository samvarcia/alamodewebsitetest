import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

export async function getUnapprovedAttendees() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error getting unapproved attendees:', error);
    throw error;
  }
}

export async function checkForDuplicate(party, email) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'APPROVED!A:D',
    });
    
    const approvedAttendees = response.data.values || [];
    return approvedAttendees.some(row => 
      row[0]?.toLowerCase() === party.toLowerCase() && 
      row[3]?.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    throw error;
  }
}

export async function updateAttendeeStatus(range, values) {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
  } catch (error) {
    console.error('Error updating attendee status:', error);
    throw error;
  }
}

export async function moveToApprovedSheet(attendeeData) {
  try {
    // Check for duplicate before moving
    const isDuplicate = await checkForDuplicate(attendeeData[0], attendeeData[3]);
    if (isDuplicate) {
      throw new Error('Duplicate entry: Attendee already approved for this party');
    }

    // Get the next empty row in the APPROVED sheet
    const approvedResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'APPROVED!A:A',
    });
    const nextRow = (approvedResponse.data.values?.length || 0) + 1;

    // Move the attendee data to the APPROVED sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `APPROVED!A${nextRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [attendeeData]
      }
    });
  } catch (error) {
    console.error('Error moving attendee to approved sheet:', error);
    throw error;
  }
}

export async function getRecentlyProcessed() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'APPROVED!A:L',
    });
    
    const values = response.data.values || [];
    
    // Sort by timestamp (column L) if available, otherwise use row order
    const sortedValues = values
      .filter(row => row.length >= 3) // Ensure we have at least name columns
      .sort((a, b) => {
        const timeA = a[11] ? new Date(a[11]).getTime() : 0;
        const timeB = b[11] ? new Date(b[11]).getTime() : 0;
        return timeB - timeA; // Sort in descending order (most recent first)
      });

    // Return only the last 5 entries
    return sortedValues.slice(0, 5);
  } catch (error) {
    console.error('Error getting recently processed attendees:', error);
    throw error;
  }
}