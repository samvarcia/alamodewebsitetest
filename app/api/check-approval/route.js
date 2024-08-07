import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

async function sendEmail(to, subject, text, qrCodeDataUrl, qrCodeLink) {
  console.log(`${new Date().toISOString()} - Sending email to ${to}`);
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
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

    console.log(`${new Date().toISOString()} - Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error sending email:`, error);
  }
}

export async function GET(request) {
  console.log(`${new Date().toISOString()} - Starting approval check process`);

  try {
    console.log("Environment variables:");
    console.log("GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID);
    console.log("BASE_URL:", process.env.BASE_URL);
    console.log("GOOGLE_PRIVATE_KEY length:", process.env.GOOGLE_PRIVATE_KEY.length);

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    console.log(`${new Date().toISOString()} - Auth created`);

    const sheets = google.sheets({ version: 'v4', auth });
    console.log(`${new Date().toISOString()} - Sheets object created`);

    console.log("Fetching UNAPPROVED sheet data");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });

    const rows = response.data.values;
    console.log(`${new Date().toISOString()} - Retrieved ${rows ? rows.length : 0} rows from UNAPPROVED sheet`);
    console.log("First few rows:", rows ? rows.slice(0, 3) : 'No rows');

    let rowsProcessed = 0;
    let rowsApproved = 0;
    let rowsMovedToApproved = 0;

    if (rows && rows.length) {
      for (const row of rows) {
        console.log(`${new Date().toISOString()} - Processing row:`, JSON.stringify(row));
        console.log(`Approval status: ${row[8]}`);

        if (row[8] === 'Y') {
          console.log(`${new Date().toISOString()} - Found an approved row`);

          const email = row[3];
          const firstName = row[1];
          const party = row[0];

          const attendeeId = uuidv4();
          console.log(`Generated attendeeId: ${attendeeId}`);

          const qrCodeLink = `${process.env.BASE_URL}/check-in/${attendeeId}`;
          const qrCodeDataUrl = await QRCode.toDataURL(qrCodeLink);

          try {
            console.log(`${new Date().toISOString()} - Appending to APPROVED sheet`);
            const appendResult = await sheets.spreadsheets.values.append({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: 'APPROVED!A2:K',
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: {
                values: [[...row, attendeeId, 'Not Checked In']]
              }
            });
            console.log("Append result:", appendResult.data);
            rowsMovedToApproved++;
          } catch (error) {
            console.error(`${new Date().toISOString()} - Error appending to APPROVED:`, error);
          }

          await sendEmail(
            email,
            `${party} Party Submission is Approved!`,
            `Dear ${firstName},\n\nGreat news! Your submission for the ${party} Fashion Week Party has been approved. Please find your ticket QR code attached.\n\nBest regards,\nYour Fashion Week Team`,
            qrCodeDataUrl,
            qrCodeLink
          );

          try {
            console.log(`${new Date().toISOString()} - Updating UNAPPROVED sheet`);
            const updateResult = await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: `UNAPPROVED!J${rows.indexOf(row) + 2}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [['S']]
              }
            });
            console.log("Update result:", updateResult.data);
          } catch (error) {
            console.error(`${new Date().toISOString()} - Error updating UNAPPROVED:`, error);
          }

          rowsApproved++;
        }
        rowsProcessed++;
      }
    } else {
      console.log(`${new Date().toISOString()} - No rows found in UNAPPROVED sheet`);
    }

    console.log(`${new Date().toISOString()} - Approval check completed`);
    console.log(`Rows processed: ${rowsProcessed}`);
    console.log(`Rows approved: ${rowsApproved}`);
    console.log(`Rows moved to APPROVED: ${rowsMovedToApproved}`);

    return NextResponse.json({ 
      message: 'Approval check completed',
      rowsProcessed,
      rowsApproved,
      rowsMovedToApproved
    }, { status: 200 });
  } catch (error) {
    console.error(`${new Date().toISOString()} - Error:`, error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message || 'Error checking approvals', details: error.stack }, { status: 500 });
  }
}

// export async function GET(request) {
//   console.log(`${new Date().toISOString()} - /api/check-approval simple testtt`);
//   return NextResponse.json({ message: 'Test successful' });
// }