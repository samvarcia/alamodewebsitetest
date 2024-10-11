//ap/api/submit/route.js

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
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><!-- -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no" />
 <meta name="format-detection" content="date=no" />
 <meta name="format-detection" content="address=no" />
 <meta name="format-detection" content="email=no" />
 <meta name="x-apple-disable-message-reformatting" />
 <link href="https://fonts.googleapis.com/css?family=Fira+Sans:ital,wght@0,400;1,400;0,500" rel="stylesheet" />
 <title>${body.parties} Submission Received</title>
 <!-- Made with Postcards by Designmodo https://designmodo.com/postcards -->
 <!--[if !mso]><!-- -->
 <style>
 </style>
 <!--<![endif]-->
 <style>
 html,
         body {
             margin: 0 !important;
             padding: 0 !important;
             min-height: 100% !important;
             width: 100% !important;
             -webkit-font-smoothing: antialiased;
         }
 
         * {
             -ms-text-size-adjust: 100%;
         }
 
         #outlook a {
             padding: 0;
         }
 
         .ReadMsgBody,
         .ExternalClass {
             width: 100%;
         }
 
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass td,
         .ExternalClass div,
         .ExternalClass span,
         .ExternalClass font {
             line-height: 100%;
         }
 
         table,
         td,
         th {
             mso-table-lspace: 0 !important;
             mso-table-rspace: 0 !important;
             border-collapse: collapse;
         }
 
         u + .body table, u + .body td, u + .body th {
             will-change: transform;
         }
 
         body, td, th, p, div, li, a, span {
             -webkit-text-size-adjust: 100%;
             -ms-text-size-adjust: 100%;
             mso-line-height-rule: exactly;
         }
 
         img {
             border: 0;
             outline: 0;
             line-height: 100%;
             text-decoration: none;
             -ms-interpolation-mode: bicubic;
         }
 
         a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: none !important;
         }
 
         .pc-gmail-fix {
             display: none;
             display: none !important;
         }
 
         .body .pc-project-body {
             background-color: transparent !important;
         }
 
         @media (min-width: 621px) {
             .pc-lg-hide {
                 display: none;
             } 
 
             .pc-lg-bg-img-hide {
                 background-image: none !important;
             }
         }
 </style>
 <style>
 @media (max-width: 620px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container {width: 100% !important;}
 .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-radius-none {border-radius: 0px !important;}
 .pc-w620-padding-0-0-0-0 {padding: 0px 0px 0px 0px !important;}
 table.pc-w620-spacing-0-0-0-0 {margin: 0px 0px 0px 0px !important;}
 td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin: 0 !important;padding: 0px 0px 0px 0px !important;}
 .pc-w620-padding-25-35-0-35 {padding: 25px 35px 0px 35px !important;}
 .pc-w620-padding-15-35-0-35 {padding: 15px 35px 0px 35px !important;}
 .pc-w620-padding-15-30-30-30 {padding: 15px 30px 30px 30px !important;}
 .pc-w620-padding-5-0-5-0 {padding: 5px 0px 5px 0px !important;}
 
 .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
 
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
 
 .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 }
 @media (max-width: 520px) {
 .pc-w520-padding-25-30-0-30 {padding: 25px 30px 0px 30px !important;}
 .pc-w520-padding-15-30-0-30 {padding: 15px 30px 0px 30px !important;}
 }
 </style>
 <!--[if !mso]><!-- -->
 <style>
 @media all { @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnZKveSBf8.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnZKveSBf6.woff2') format('woff2'); } }
 </style>
 <!--<![endif]-->
 <!--[if mso]>
    <style type="text/css">
        .pc-font-alt {
            font-family:Trebuchet MS, Helvetica, sans-serif !important;
        }
    </style>
    <![endif]-->
 <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>

<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; line-height: 1.5; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #080808;" bgcolor="#080808">
 <table class="pc-project-body" style="table-layout: fixed; min-width: 600px; background-color: #080808;" bgcolor="#080808" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr>
   <td align="center" valign="top">
    <table class="pc-project-container" align="center" width="600" style="width: 600px; max-width: 600px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Image -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-radius-none pc-w620-padding-0-0-0-0" style="padding: 0px 0px 0px 0px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td valign="top">
                   <img src="https://cloudfilesdm.com/postcards/image-1725255432506.png" class="pc-w620-radius-none" width="600" height="auto" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width:100%; height: auto; border: 0;" />
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Image -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Title -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-25-30-0-30 pc-w620-padding-25-35-0-35" style="padding: 46px 40px 0px 40px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="line-height: 48px; letter-spacing: -0.2px; font-family: Trebuchet MS, Helvetica, sans-serif; font-size: 41px; font-weight: normal; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                    <div><span style="font-weight: 700;font-style: normal;color: rgb(255, 255, 255);">Your Registration Is Being Processed!</span>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Title -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Subtitle -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-15-30-0-30 pc-w620-padding-15-35-0-35" style="padding: 47px 40px 0px 40px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="line-height: 24px; letter-spacing: -0.2px; font-family: Trebuchet MS, Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 500; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                    <div><span style="font-weight: 400;font-style: normal;color: #ffffff;">Dear ${body.firstName},</span>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Subtitle -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Subtitle -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-15-30-0-30 pc-w620-padding-15-35-0-35" style="padding: 15px 40px 0px 40px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="line-height: 24px; letter-spacing: -0.2px; font-family: Trebuchet MS, Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 500; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                    <div><span style="font-weight: 400;font-style: normal;color: #ffffff;">Thank you for registering for </span><span style="font-weight: 400;font-style: italic;color: #ffffff;">${body.parties} </span><span style="font-weight: 400;font-style: normal;color: #ffffff;">à la mode S/S25. </span>
                    </div>
                    <div><span>&#xFEFF;</span>
                    </div>
                    <div><span style="font-weight: 400;font-style: normal;color: #ffffff;">We have received your submission and it is currently under review. We will notify you once it has been approved. Once approved you will receive a confirmation email with a date, time and location.</span>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Subtitle -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Subtitle -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-15-30-30-30" style="padding: 15px 40px 66px 40px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="line-height: 24px; letter-spacing: -0.2px; font-family: Trebuchet MS, Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 500; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                    <div><span style="font-weight: 400;font-style: normal;color: #ffffff;">Talk soon,</span>
                    </div>
                    <div><span>&#xFEFF;</span>
                    </div>
                    <div><span style="font-weight: 400;font-style: normal;color: #ffffff;">Team à la mode</span>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Subtitle -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Image -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-5-0-5-0" style="padding: 5px 0px 15px 0px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td valign="top">
                   <img src="https://cloudfilesdm.com/postcards/image-1725255468813.png" class="" width="600" height="auto" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width:100%; height: auto; border: 0;" />
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Image -->
         </td>
        </tr>
       </table>
      </td>
     </tr>
    </table>
   </td>
  </tr>
 </table>
 <!-- Fix for Gmail on iOS -->
 <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
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