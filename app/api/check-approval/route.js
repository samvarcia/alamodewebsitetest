import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

async function sendEmail(to, subject, htmlContent, qrCodeBuffer) {
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
        cid: 'qrcode@alamode.com' // this is the content id to be referenced in the HTML
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
}

export async function GET(request) {
  try {
    console.log(request)
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
        if (row[8] === 'Y') { // Assuming "Approved" is the 9th column (index 8)
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
          // Generate unique identifier
          const attendeeId = uuidv4();

          // Generate QR code
          const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
          const qrCodeBuffer = await QRCode.toBuffer(qrCodeLink);

          // Check if the email or attendeeId already exists in the approved sheet
          const approvedRowsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!D:J',
          });

          const approvedRows = approvedRowsResponse.data.values || [];
          const existingRow = approvedRows.find((r) => r[0] === email || r[9] === attendeeId);

          if (!existingRow) {
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

            // Generate HTML email content
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en" style="margin: 0;padding: 0;  font-family: "Jost", sans-serif;color: #FAFBF5;text-align: center;font-weight: normal;font-size: 16px;">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Location a la Mode ${party} Invitation</title>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');
                  @import url('https://fonts.googleapis.com/css2?family=Luxurious+Script&display=swap');
                  body{
                      font-family: "Jost", sans-serif;

                  }
                  .name{
                    font-size: 2.5rem;
                    font-family: "Luxurious Script", cursive;
                  }
                </style>
            </head>
            <body style="margin: 0;padding: 0;  font-family: "Jost", sans-serif; color: #FAFBF5;text-align: center;font-weight: normal;font-size: 16px;">
                <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;background: radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 24.53%, #BC0123 83%), #000;padding: 20px 0;color: white;text-align: center;">
                    <img class="logo" src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" alt="a la mode" style="width: 80px;margin-top: 20px;">
                    <div class="upper-info" style="margin: 30px 0px;">
                        <p style="color: white;margin: 0;">SPRING/SUMMER 25</p>
                        <p class="city" style="color: white;margin: 0;font-size: 1.5rem;">${party.toUpperCase()}</p>
                    </div>
                    <p class="would" style="color: white;margin: 30px 0px;font-size: 0.8rem;">WOULD NOT BE THE SAME WITHOUT</p>
                    <p class="name" style="  font-family: "Luxurious Script", cursive; color: white;margin: 0;text-decoration: underline;text-decoration-thickness: 2px;text-underline-offset: 12px;margin-bottom: 10px;font-size: 2.5rem;">${firstName.toUpperCase()} ${lastName.toUpperCase()}</p>
                    <p class="attending" style="color: white;margin: 0;font-size: 0.8rem;">ATTENDING WITH: <span style="font-size: 1rem;font-weight: 500;">${plusOne.toUpperCase()}</span></p>
                    <img class="qr-code" src="cid:qrcode@alamode.com" alt="QR Code" width="200" height="200" style="width: 200px;height: 200px;margin: 40px 0px;">
                    <p class="join" style="color: white;margin: 10px 0px;font-size: 0.8rem;margin-top: none;">JOIN US AT</p>
                    <div class="bottomcontainer" style="font-weight: 500;">
                        <p style="color: white;margin: 0;">${partyDetails.venue}</p>
                        <p style="color: white;margin: 0;">${partyDetails.address}</p>
                    </div>
                    <p class="on" style="color: white;margin: 10px 0px;font-size: 0.8rem;">ON</p>
                    <div class="bottomcontainer" style="font-weight: 500;">
                    <p style="color: white;margin: 0;">${partyDetails.date}</p>
                    <p style="color: white;margin: 0;">${partyDetails.hours}</p>
                    </div>
                    <p class="on" style="color: white;margin: 40px 0px;font-size: 0.5rem;">Please Party Responsibly: Attendees assume full responsibility for their own actions</p>
                </div>
            </body>
            </html>
            `;
          //   const htmlContent = `
          //  <!DOCTYPE html>
          //   <html lang="en">
          //   <head>
          //       <meta charset="UTF-8">
          //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
          //       <title>Location a la Mode ${party} Invitation</title>
          //       <style>
          //           body, html {
          //               margin: 0;
          //               padding: 0;
          //               font-family: Arial, sans-serif;
          //               color: white;
          //               text-align: center;
          //           }
          //           .container {
          //               width: 100%;
          //               max-width: 600px;
          //               margin: 0 auto;
          //               background: linear-gradient(to bottom, #000000, #8B0000);
          //               padding: 20px 0;
          //               color: white;
          //               text-align: center;
          //           }
          //           h1, h2, h3, p {
          //               margin: 10px 0;
          //               color: white;
          //           }
          //           .qr-code-wrapper {
          //               width: 220px;
          //               height: 220px;
          //               margin: 20px auto;
          //               background-color: white;
          //               border-radius: 15px;
          //               padding: 10px;
          //           }
          //           .qr-code {
          //               width: 200px;
          //               height: 200px;
          //               margin: 0 auto;
          //           }
          //           .logo {
          //               width: 150px;
          //               margin-top: 20px;
          //           }
          //           h1 {
          //               font-size: 55px;
          //           }
          //           h2 {
          //               font-size: 20px;
          //           }
          //       </style>
          //   </head>
          //   <body>
          //       <div class="container">
          //           <h2>SS 25</h2>
          //           <h2>Location a la Mode ${party.toUpperCase()}</h2>
          //           <h1>${firstName.toUpperCase()} ${lastName.toUpperCase()}</h1>
          //           <p>PLUS ONES: ${plusOne.toUpperCase()}</p>
          //           <p>{EVENT DATE - ADDRESS}</p>
          //           <table cellpadding="0" cellspacing="0" border="0" align="center">
          //               <tr>
          //                   <td style="background-color: white; border-radius: 15px; padding: 10px;">
          //                       <div class="qr-code-wrapper">
          //                           <img src="cid:qrcode@alamode.com" alt="QR Code" width="200" height="200" style="display: block;">
          //                       </div>
          //                   </td>
          //               </tr>
          //           </table>
          //           <img class="logo" src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" alt="a la mode">
          //       </div>
          //   </body>
          //   </html>
          //   `;

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