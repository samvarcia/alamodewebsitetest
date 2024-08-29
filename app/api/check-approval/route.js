import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import html2pdf from 'html2pdf.js';

async function htmlToPdf(html) {
  const options = {
    margin: 10,
    filename: 'invitation.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return new Promise((resolve, reject) => {
    html2pdf().from(html).set(options).outputPdf().then((pdf) => {
      resolve(Buffer.from(pdf));
    }).catch((error) => {
      reject(error);
    });
  });
}

async function sendEmail(to, subject, htmlContent) {
  const pdfBuffer = await htmlToPdf(htmlContent);

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
    html: `
      <p>Please find your invitation attached as a PDF.</p>
      <p>If you have trouble opening the attachment, please ensure you have a PDF reader installed.</p>
    `,
    attachments: [
      {
        filename: 'invitation.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
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

          const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Location a la Mode ${party} Invitation</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Luxurious+Script&display=swap');
                    body {
                        font-family: "Jost", sans-serif;
                        color: #FAFBF5;
                        text-align: center;
                        background: radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 24.53%, #BC0123 83%), #000;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px 0;
                    }
                    .logo {
                        width: 80px;
                        margin-top: 20px;
                    }
                    .name {
                        font-size: 2.5rem;
                        font-family: "Luxurious Script", serif;
                        text-decoration: underline;
                        text-decoration-thickness: 2px;
                        text-underline-offset: 12px;
                        margin-bottom: 10px;
                    }
                    .qr-code {
                        width: 200px;
                        height: 200px;
                        margin: 40px 0px;
                    }
                    .bottomcontainer {
                        font-weight: 500;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img class="logo" src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" alt="a la mode">
                    <div class="upper-info" style="margin: 30px 0px;">
                        <p>SPRING/SUMMER 25</p>
                        <p style="font-size: 1.5rem;">${party.toUpperCase()}</p>
                    </div>
                    <p style="font-size: 0.8rem;">WOULD NOT BE THE SAME WITHOUT</p>
                    <p class="name">${firstName.toUpperCase()} ${lastName.toUpperCase()}</p>
                    ${plusOne !== 'None' ? `
                    <p style="font-size: 0.8rem;">ATTENDING WITH: <span style="font-size: 1rem;font-weight: 500;">${plusOne.toUpperCase()}</span></p>
                    ` : ''}
                    <img class="qr-code" src="${qrCodeLink}" alt="QR Code">
                    <p style="font-size: 0.8rem;">JOIN US AT</p>
                    <div class="bottomcontainer">
                        <p>${partyDetails.venue}</p>
                        <p>${partyDetails.address}</p>
                    </div>
                    <p style="font-size: 0.8rem;">ON</p>
                    <div class="bottomcontainer">
                    <p>${partyDetails.date}</p>
                    <p>${partyDetails.hours}</p>
                    </div>
                    <p style="margin: 40px 0px;font-size: 0.5rem;">Please Party Responsibly: Attendees assume full responsibility for their own actions</p>
                </div>
            </body>
            </html>
          `;

          await sendEmail(
            email,
            `${party} Party Invitation`,
            htmlContent
          );

          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `UNAPPROVED!J${rows.indexOf(row) + 2}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['S']]
            }
          });

          await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'APPROVED!A:K',
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
        }
      }
    }

    return NextResponse.json({ message: 'Approval check completed' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error checking approvals' }, { status: 500 });
  }
}