import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

async function sendEmail(to, subject, htmlContent, qrCodeBuffer) {
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
    html: htmlContent,
    attachments: [
      {
        filename: 'qrcode.png',
        content: qrCodeBuffer,
        cid: 'qrcode@alamode.com'
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
}

async function generateWhiteQRCode(data) {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Generate QR code
  await QRCode.toCanvas(canvas, data, {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: {
      dark: '#FFFFFF',
      light: '#00000000'  // Transparent background
    }
  });

  // Convert canvas to buffer
  return canvas.toBuffer('image/png');
}

export async function GET(request) {
  console.log('Starting GET function');
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    console.log('Google auth created');

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Sheets object created');

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });
    console.log('Fetched UNAPPROVED sheet data');

    const rows = response.data.values;

    const approvedRows = [];
    const updateRequests = [];

    if (rows && rows.length) {
      await Promise.all(rows.map(async (row, index) => {
        if (row && row.length >= 9 && row[8] === 'Y') {
          const email = row[3];
          const firstName = row[1];
          const lastName = row[2];
          const party = row[0];
          const plusOne = row[6] === 'Yes' ? row[7] : 'None';

          const attendeeId = uuidv4();

          const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
          const qrCodeBuffer = await generateWhiteQRCode(qrCodeLink);

          approvedRows.push([
            row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], attendeeId, 'Not Checked In'
          ]);

          updateRequests.push({
            range: `UNAPPROVED!J${index + 2}`,
            values: [['S']]
          });

          const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Location a la Mode ${party} Invitation</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        color: white;
                        text-align: center;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background: linear-gradient(to bottom, #000000, #8B0000);
                        padding: 20px 0;
                        color: white;
                        text-align: center;
                    }
                    h1, h2, h3, p {
                        margin: 10px 0;
                        color: white;
                    }
                    .qr-code {
                        width: 200px;
                        height: 200px;
                        margin: 20px auto;
                    }
                    .logo {
                        width: 150px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>SS 25</h1>
                    <h2>Location a la Mode - ${party.toUpperCase()}</h2>
                    <h2>${firstName.toUpperCase()} ${lastName.toUpperCase()}</h2>
                    <p>PLUS ONES: ${plusOne.toUpperCase()}</p>
                    <p>{EVENT DATE - ADDRESS}</p>
                    <div class="qr-code">
                        <img src="cid:qrcode@alamode.com" alt="QR Code" width="200" height="200">
                    </div>
                    <img class="logo" src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" alt="a la mode">
                </div>
            </body>
            </html>
          `;

          await sendEmail(
            email,
            `${party} Party Invitation`,
            htmlContent,
            qrCodeBuffer
          );
        }
      }));
    }

    // Batch update APPROVED sheet
    if (approvedRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'APPROVED!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: approvedRows }
      });
      console.log('Updated APPROVED sheet');
    }

    // Batch update UNAPPROVED sheet
    if (updateRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: updateRequests
        }
      });
      console.log('Updated UNAPPROVED sheet');
    }

    return NextResponse.json({ message: 'Approval check completed', processed: approvedRows.length }, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}