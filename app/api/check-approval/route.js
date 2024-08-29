import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'; // Direct import of PDF components

async function sendEmail(to, subject, htmlContent, qrCodeBuffer, pdfBuffer) {
  let transporter = nodemailer.createTransport({
    host: 'smtp0001.neo.space',
    port: 465,
    secure: true,
    auth: {
      user: "checkin@locationalamode.com",
      pass: '@lamodecheckin3005',
    },
  });

  let info = await transporter.sendMail({
    from: '"CHECK IN ALAMODE" <checkin@locationalamode.com>',
    to: to,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: 'qrcode.png',
        content: qrCodeBuffer,
        cid: 'qrcode@alamode.com'
      },
      {
        filename: 'invitation.pdf',
        content: pdfBuffer,
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
}

export async function GET(request) {
  try {
    console.log(request);
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
    const partyInfo = {
      'New York': {
        venue: 'SELINA CHELSEA',
        address: '518 W 27th St, New York NY 10001',
        date: 'TUESDAY, 10TH SEPTEMBER 2024',
        hours: '10:00PM - 04:00AM'
      },
      'Milan': {
        venue: 'REPUBBLICA',
        address: 'Piazza della Repubblica, 12, 20124 Milano MI, Italy',
        date: 'WEDNESDAY, 18TH SEPTEMBER 2024',
        hours: '12:00AM - 05:00AM'
      },
      'Paris': {
        venue: 'CHEZ MOUNE',
        address: '54 Rue Jean-Baptiste Pigalle, 75009 Paris, France',
        date: 'WEDNESDAY, 25TH SEPTEMBER 2024',
        hours: '12:00AM - 05:00AM'
      }
    };

    if (rows.length) {
      for (const row of rows) {
        if (row[8] === 'Y') {
          const email = row[3];
          const firstName = row[1];
          const lastName = row[2];
          const party = row[0];
          const plusOne = row[6] === 'Yes' ? row[7] : 'None';

          const partyDetails = partyInfo[party] || {
            venue: 'TBA',
            address: 'TBA',
            date: 'TBA',
            hours: 'TBA'
          };

          const attendeeId = uuidv4();

          const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeLink);

          const approvedRowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!D:J',
          });

          const approvedRows = approvedRowsResponse.data.values || [];
          const existingRow = approvedRows.find((r) => r[0] === email || r[9] === attendeeId);

          if (!existingRow) {
            const currentRowsResponse = await sheets.spreadsheets.values.get({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: 'APPROVED!A:A',
            });

            const nextRow = currentRowsResponse.data.values ? currentRowsResponse.data.values.length + 1 : 1;

            await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: `APPROVED!A${nextRow}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [[
                  row[0],
                  row[1],
                  row[2],
                  row[3],
                  row[4],
                  row[5],
                  row[6],
                  row[7],
                  row[8],
                  attendeeId,
                  'Not Checked In'
                ]]
              }
            });

            const pdfBuffer = await renderToBuffer(
              <Document>
                <Page>
                  <View>
                    <Text>{firstName} {lastName}</Text>
                    <Text>{party}</Text>
                    <Text>{partyDetails.venue}</Text>
                    <Text>{partyDetails.address}</Text>
                    <Text>{partyDetails.date}</Text>
                    <Text>{partyDetails.hours}</Text>
                    {plusOne !== 'None' && <Text>With: {plusOne}</Text>}
                    <Image src={qrCodeBuffer} />
                  </View>
                </Page>
              </Document>
            );

            await sendEmail(
              email,
              `${party} Party Invitation`,
              htmlContent,
              qrCodeBuffer,
              pdfBuffer
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
            console.log(`Skipping row for email ${email} or attendeeId ${attendeeId} as it already exists in the approved sheet.`);
          }
        }
      }
    }

    return NextResponse.json({ message: 'Approval check completed' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}
