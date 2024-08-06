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
      <p>For testing purposes, you can also click this link to simulate scanning the QR code: 
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
      range: 'UNAPPROVED!A2:J',
    });

    const rows = response.data.values;

    if (rows.length) {
      for (const row of rows) {
        if (row[8] === 'Y') { // Assuming "Approved" is the 9th column (index 8)
          const email = row[3];
          const firstName = row[1];
          const party = row[0];

          // Generate unique identifier
          const attendeeId = uuidv4();

          // Generate QR code
          const qrCodeLink = `/checkin/${attendeeId}`;
          const qrCodeDataUrl = await QRCode.toDataURL(qrCodeLink);

          // Get the current number of rows in the APPROVED sheet
          const currentRowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!A:A',
          });

          const nextRow = currentRowsResponse.data.values ? currentRowsResponse.data.values.length + 1 : 1;

          // Add to approved sheet
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `APPROVED!A${nextRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                row[0],  // Party
                row[1],  // First Name
                row[2],  // Last Name
                row[3],  // Email
                row[4],  // Models Link
                row[5],  // Instagram Link
                row[6],  // Plus One (Yes/No)
                row[7],  // Plus One Name
                row[8],  // Approval Status
                attendeeId,  // Unique Attendee ID
                'Not Checked In'  // Initial Check-In Status
              ]]
            }
          });

          // Send approval email with QR code
          await sendEmail(
            email,
            `${party} Party Submission is Approved!`,
            `Dear ${firstName},\n\nGreat news! Your submission for the ${party} Fashion Week Party has been approved. Please find your ticket QR code attached.\n\nBest regards,\nYour Fashion Week Team`,
            qrCodeDataUrl,
            qrCodeLink
          );

          // Update the "Approved" status to 'S' for "Sent" in the UNAPPROVED sheet
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `UNAPPROVED!J${rows.indexOf(row) + 2}`,
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