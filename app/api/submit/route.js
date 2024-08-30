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
    from: '"CHECK IN ALAMODE" <checkin@locationalamode.com>',
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

    const htmlTemplate = `
  <!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're all set! - A La Mode Registration</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 30px; background-color: #BC0123;"></div>
    <img style="width: 80px; margin-top: 20px;" src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/alamodered.png" alt="a la mode">
    <h1 style="text-align: center; color: #000;">You're all set!</h1>
    <p>Thank you for registering for À La Mode! Your registration is currently being processed.</p>
    <p>If approved, you will receive a confirmation email shortly with all the details you need to join us.</p>
    <p>Feel free to reach out if you have any questions in the meantime.</p>
    <a href="#" style="display: block; width: 200px; margin: 20px auto; padding: 10px; background-color: #BC0123; color: #fff; text-align: center; text-decoration: none; border-radius: 5px;">View Event Website</a>
    <div style="background-color: #BC0123; color: #fff; width: 100%; position: absolute; bottom: 0; left: 0; display: flex; align-items: center; justify-content: space-evenly; margin-top: 40px;">
      <p>locationalamode.com</p>
      <p>@location.alamode</p>
    </div>
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