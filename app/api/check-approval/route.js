import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

async function sendEmail(to, subject, htmlContent, qrCodeBuffer) {
  console.log(`Attempting to send email to: ${to}`);
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
      html: htmlContent,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeBuffer,
          cid: 'qrcode@alamode.com'
        }
      ]
    });

    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}. Error: ${error.message}`);
    throw error;
  }
}

export async function GET(request) {
  console.log('GET request received for approval check');
  try {
    console.log('Initializing Google auth');
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    console.log('Creating Google Sheets instance');
    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Fetching data from UNAPPROVED sheet');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log('No data found in UNAPPROVED sheet');
      return NextResponse.json({ message: 'No data found in UNAPPROVED sheet' }, { status: 200 });
    }

    console.log(`Found ${rows.length} rows in UNAPPROVED sheet`);

    let processedCount = 0;
    let approvedCount = 0;
    
    if (rows.length) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row[8] === 'Y' && row[9] !== 'S') {  // Check if approved but not sent
          approvedCount++;
          console.log(`Processing approved row: ${row[1]} ${row[2]}`);
          const email = row[3];
          const firstName = row[1];
          const lastName = row[2];
          const party = row[0];
          const plusOne = row[6] === 'Yes' ? row[7] : 'None';

          const attendeeId = uuidv4();
          console.log(`Generated attendee ID: ${attendeeId}`);

          console.log('Generating QR code');
          const qrCodeLink = `/checkin/${attendeeId}`;
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeLink);

          console.log('Fetching current row count from APPROVED sheet');
          const currentRowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!A:A',
          });

          const nextRow = currentRowsResponse.data.values ? currentRowsResponse.data.values.length + 1 : 1;
          console.log(`Next available row in APPROVED sheet: ${nextRow}`);

          console.log('Adding data to APPROVED sheet');
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `APPROVED!A${nextRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],
                attendeeId, 'Not Checked In'
              ]]
            }
          });

          const htmlContent = `
          <!DOCTYPE html>
            <html lang="en">
            <!-- ... (HTML content remains the same) ... -->
            </html>
          `;

          console.log(`Sending approval email to ${email}`);
          await sendEmail(
            email,
            `${party} Party Invitation`,
            htmlContent,
            qrCodeBuffer
          );

          console.log('Updating UNAPPROVED sheet status to Sent');
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `UNAPPROVED!J${i + 2}`,  // Use the current row index
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['S']]
            }
          });

          processedCount++;
        }
      }
    }

    if (rows.length) {
      for (const row of rows) {
        if (row[8] === 'Y') {
          approvedCount++;
          console.log(`Processing approved row: ${row[1]} ${row[2]}`);
          const email = row[3];
          const firstName = row[1];
          const lastName = row[2];
          const party = row[0];
          const plusOne = row[6] === 'Yes' ? row[7] : 'None';

          const attendeeId = uuidv4();
          console.log(`Generated attendee ID: ${attendeeId}`);

          console.log('Generating QR code');
          const qrCodeLink = `/checkin/${attendeeId}`;
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeLink);

          console.log('Fetching current row count from APPROVED sheet');
          const currentRowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!A:A',
          });

          const nextRow = currentRowsResponse.data.values ? currentRowsResponse.data.values.length + 1 : 1;
          console.log(`Next availagggle row in APPROVED sheet: ${nextRow}`);

          console.log('Adding data to APPROVED sheet');
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `APPROVED!A${nextRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],
                attendeeId, 'Not Checked In'
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

          console.log(`Sending approval email to ${email}`);
          await sendEmail(
            email,
            `${party} Party Invitation`,
            htmlContent,
            qrCodeBuffer
          );

          console.log('Updating UNAPPROVED sheet status to Sent');
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `UNAPPROVED!J${rows.indexOf(row) + 2}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['S']]
            }
          });

          processedCount++;
        }
      }
    }

    console.log(`Approval check completed. Processed ${processedCount} rows, ${approvedCount} approved.`);
    return NextResponse.json({ 
      message: 'Approval check completed',
      processed: processedCount,
      approved: approvedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error in approval check process:', error);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}