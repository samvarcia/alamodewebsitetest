import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

async function sendEmail(to, subject, text, qrCodeDataUrl, qrCodeLink) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
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
    html: `
      <p>${text}</p>
      <p>You can use this link to check in: 
        <a href="${qrCodeLink}">${qrCodeLink}</a>
      </p>
    `,
    attachments: [
      {
        filename: 'ticket_qr.png',
        content: qrCodeDataUrl.split(';base64,').pop(),
        encoding: 'base64'
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
}

export async function GET(request) {
  console.log("Starting approval check process");

  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    console.log("Fetching UNAPPROVED sheet data");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });

    const rows = response.data.values;

    console.log(`Retrieved ${rows ? rows.length : 0} rows from UNAPPROVED sheet`);

    if (rows && rows.length) {
      for (const row of rows) {
        console.log(`Checking row: ${JSON.stringify(row)}`);

        if (row[8] === 'Y') { // Assuming "Approved" is the 9th column (index 8)
          console.log("Found an approved row");

          const email = row[3];
          const firstName = row[1];
          const party = row[0];

          const attendeeId = uuidv4();
          console.log(`Generated attendeeId: ${attendeeId}`);

          const qrCodeLink = `${process.env.BASE_URL}/check-in/${attendeeId}`;
          const qrCodeDataUrl = await QRCode.toDataURL(qrCodeLink);

          await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!A2:K',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
              values: [[...row, attendeeId, 'Not Checked In']]
            }
          });
          console.log(`Added attendee ${attendeeId} to APPROVED sheet`);

          await sendEmail(
            email,
            `${party} Party Submission is Approved!`,
            `Dear ${firstName},\n\nGreat news! Your submission for the ${party} Fashion Week Party has been approved. Please find your ticket QR code attached.\n\nBest regards,\nYour Fashion Week Team`,
            qrCodeDataUrl,
            qrCodeLink
          );

          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `UNAPPROVED!J${rows.indexOf(row) + 2}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['S']]
            }
          });
        } else {
          console.log(`Row not approved. Approval status: ${row[8]}`);

        }
      }
    } else {
      console.log("No rows found in UNAPPROVED sheet");
    }

    return NextResponse.json({ message: 'Approval check completed' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}