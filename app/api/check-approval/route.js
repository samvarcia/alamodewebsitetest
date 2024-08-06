import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

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
        cid: 'qrcode@alamode.com' // this is the content id to be referenced in the HTML
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
          const lastName = row[2];
          const party = row[0];
          const plusOne = row[6] === 'Yes' ? row[7] : 'None';

          // Generate unique identifier
          const attendeeId = uuidv4();

          // Generate QR code
          const qrCodeLink = `/checkin/${attendeeId}`;
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeLink);

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
                        background-color: white;
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
                        <!-- Replace with actual QR code image -->
                        <img src="cid:qrcode@alamode.com" alt="QR Code" width="200" height="200">
                    </div>
                    <img class="logo" src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" alt="a la mode">
                </div>
            </body>
            </html>
          `;

          // Send approval email with QR code
          await sendEmail(
            email,
            `${party} Party Invitation`,
            htmlContent,
            qrCodeBuffer
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