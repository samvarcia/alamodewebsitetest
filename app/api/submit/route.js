import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

async function sendEmail(to, subject, htmlContent) {
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
    from: '"Location à la mode" <checkin@locationalamode.com>',
    to: to,
    subject: subject,
    html: htmlContent,
  });

  console.log("Message sent: %s", info.messageId);
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received data:", body);

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const range = 'UNAPPROVED!A2:J';
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          body.parties.join(', '),
          body.firstName,
          body.lastName,
          body.email,
          body.modelsLink,
          body.instagramLink,
          body.plusOne ? 'Yes' : 'No',
          body.plusOneName,
          'P', // Set initial approval status to "P" for Pending
        ]],
      },
    });

    console.log("Google Sheets API response:", response.data);

    // const htmlTemplate = `
    //     <!DOCTYPE html>
    //     <html lang="en" style="margin: 0; padding: 0;">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>You're all set! - A La Mode Registration</title>
    //     </head>
    //     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #ffffff;">
    //         <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; height: 100%;">
    //             <tr>
    //                 <td style="background-color: #BC0123; height: 30px;">&nbsp;</td>
    //             </tr>
    //             <tr>
    //                 <td style="padding: 20px;">
    //                     <img src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/alamodered.png" alt="a la mode" style="width: 80px; margin-bottom: 20px; display: block;">
    //                     <h1 style="text-align: center; color: #000; font-size: 24px; margin-top: 0; margin-bottom: 20px;">You're all set!</h1>
    //                     <p style="margin-bottom: 10px;">Thank you for registering for À La Mode ${body.parties}! Your registration is currently being processed.</p>
    //                     <p style="margin-bottom: 10px;">If approved, you will receive a confirmation email shortly with all the details you need to join us.</p>
    //                     <p style="margin-bottom: 20px;">Feel free to reach out if you have any questions in the meantime.</p>
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td style="height: 100%;"></td>
    //             </tr>
    //             <tr>
    //                 <td style="background-color: #BC0123; padding: 10px 0; text-align: center;">
    //                     <table cellpadding="0" cellspacing="0" border="0" width="100%">
    //                         <tr>
    //                             <td width="50%" style="text-align: right; padding-right: 10px;">
    //                                 <span style="color: #ffffff; text-decoration: none;">locationalamode.com</span>
    //                             </td>
    //                             <td width="50%" style="text-align: left; padding-left: 10px;">
    //                                 <span style="color: #ffffff; text-decoration: none;">@location.alamode</span>
    //                             </td>
    //                         </tr>
    //                     </table>
    //                 </td>
    //             </tr>
    //         </table>
    //     </body>
    //     </html>
    // `;
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en" style="margin: 0; padding: 0; background-color: #000;">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>You’re In! See You in ${body.parties}</title>
        </head>
        <body style="font-family: Trebuchet MS; sans-serif; line-height: 1.6; color: #fff; margin: 0; padding: 0; ">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; height: 100%; background-color: #000; color: #fff;">
              
                <img src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/YYYYY-08.png" alt="a la mode" style="width: 600px; margin-bottom: 20px; display: block;">
                <tr>
                    <td style="padding: 10px;">
                        <h1 style="font-family: Helvetica;  color: #fff; font-size: 24px; margin-top: 0; m;">Dear ${body.firstName},</h1>
                        <p style="margin-bottom: 10px; width: 100%;">Thank you for registering for ${body.parties} à la mode S/S25. We have received your request and it is currently under review. We will notify you once your submission has been approved. Once approved you will receive a confirmation email with dates, time and location.</p>
                        <p style="margin-bottom: 10px;">Talk soon,</p>
                        <p style="margin-bottom: 10px;">Team à la mode</p>
                    </td>
                </tr>
            
               
                   <tr>
                    <img src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/YYYYY-09.png" alt="a la mode" style="width: 600px;position: absolute;  bottom: 0;">
                  </tr>

            </table>
        </body>
        </html>
    `;

    await sendEmail(
      body.email,
      `${body.parties} Party Submission Received`,
      htmlTemplate
    );

    return NextResponse.json({ message: 'Data submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error submitting data' }, { status: 500 });
  }
}