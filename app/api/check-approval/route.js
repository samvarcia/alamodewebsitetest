import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    let info = await transporter.sendMail({
      from: '"ALAMODETEST" <testalamodefly@gmail.com>',
      to: to,
      subject: subject,
      text: text,
    });
  
    console.log("Message sent: %s", info.messageId);
  }

export async function GET(request) {
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
      range: 'A2:I', // Adjust based on your sheet structure
    });

    const rows = response.data.values;

    if (rows.length) {
      for (const row of rows) {
        if (row[8] === 'Y') { // Assuming "Approved" is the 9th column (index 8)
          const email = row[3]; // Assuming email is the 4th column (index 3)
          const firstName = row[1]; // Assuming first name is the 2nd column (index 1)
          const party = row[0]; // Assuming party is the 1st column (index 0)

          // Send approval email
          await sendEmail(
            email,
            `${party} Party Submission is Approved!`,
            `Dear ${firstName},\n\nGreat news! Your submission for the ${party} Fashion Week Party has been approved. We look forward to seeing you at the event, QR.\n\nBest regards,\nYour Fashion Week Team`
          );

          // Update the "Approved" status to 'S' for "Sent"
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `J${rows.indexOf(row) + 2}`, // +2 because rows are 1-indexed and we start from A2
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['S']]
            }
          });
        }
      }
    }

    return NextResponse.json({ message: 'Approval check completed' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}