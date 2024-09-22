import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

const CHUNK_SIZE = 10; // Process 50 rows at a time

async function sendEmail(to, subject, pdfBuffer, htmlContent) {
  let transporter = nodemailer.createTransport({
    host: 'smtp0001.neo.space',
    port: 465,
    secure: true,
    auth: {
      user: "checkin@locationalamode.com",
      pass: '@lamodecheckin3005',
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"Location à la mode" <checkin@locationalamode.com>',
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: 'invitation.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        },
      ]
    });

    console.log("Message sent successfully: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

async function processInBatches(sheets, rows, batchSize = 10) {
  const results = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(row => processRow(sheets, row)));
    results.push(...batchResults);
    
    // Add a small delay between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results;
}

async function processRow(sheets, row) {
  const partyInfo = {
    'New York City': {
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
      date: 'TUESDAY, 24TH SEPTEMBER 2024',
      hours: '12:00AM - 05:00AM'
    }
  };
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
    const timestamp = new Date().toISOString();

    // Check if the email or name already exists in the approved sheet for this specific party
    const approvedRowsResponse = await getApprovedRowsResponse(sheets);
    const approvedRows = approvedRowsResponse.data.values || [];
    const existingRow = approvedRows.find((r) => 
      r[0] === party && (r[3] === email || (r[1] === firstName && r[2] === lastName))
    );

    if (!existingRow) {
      const currentRowsResponse = await getCurrentRowsResponse(sheets);
      const nextRow = currentRowsResponse.data.values ? currentRowsResponse.data.values.length + 1 : 1;

      
      // Add to approved sheet with timestamp
      await updateApprovedList(sheets, row, attendeeId, nextRow, timestamp);

      const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
      const qrCodeDataURL = await QrCodeUrl(qrCodeLink);

      const pdfBuffer = await getPdf(firstName, lastName, party, plusOne, partyDetails, qrCodeDataURL);

      const htmlTemplate = `   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
      <title>You're In! See You in ${party}</title>
      <!-- Made with Postcards by Designmodo https://designmodo.com/postcards -->
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
      .pc-w620-padding-5-0-15-0 {padding: 5px 0px 15px 0px !important;}
      .pc-w620-padding-25-35-0-35 {padding: 25px 35px 0px 35px !important;}
      .pc-w620-padding-15-35-0-35 {padding: 15px 35px 0px 35px !important;}
      
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
      .pc-w520-padding-5-0-15-0 {padding: 5px 0px 15px 0px !important;}
      .pc-w520-padding-25-30-0-30 {padding: 25px 30px 0px 30px !important;}
      .pc-w520-padding-15-30-0-30 {padding: 15px 30px 0px 30px !important;}
      }
      </style>
      <!--[if mso]>
          <style type="text/css">
              .pc-font-alt {
                  font-family: Arial, Helvetica, sans-serif !important;
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
                  <td style="padding: 0px 0px 0px 0px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr>
                    <td valign="top" class="pc-w520-padding-5-0-15-0 pc-w620-padding-5-0-15-0" style="padding: 0px 0px 0px 0px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td valign="top">
                        <img src="https://cloudfilesdm.com/postcards/image-1725839664567.png" class="" width="600" height="auto" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width:100%; height: auto; border: 0;" />
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
                    <td valign="top" class="pc-w520-padding-25-30-0-30 pc-w620-padding-25-35-0-35" style="padding: 25px 40px 0px 40px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                      <tr>
                        <td valign="top" align="left" style="padding: 0px 0px 20px 0px;">
                        <div class="pc-font-alt" style="line-height: 42px; letter-spacing: -0.2px; font-family: Trebuchet MS, Helvetica, sans-serif; font-size: 32px; font-weight: normal; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                          <div><span style="font-family: ''Trebuchet MS'', Arial, Helvetica, sans-serif;font-weight: 700;font-style: normal;color: #ffffff;">You're Confirmed!</span>
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
                    <td valign="top" class="pc-w520-padding-15-30-0-30 pc-w620-padding-15-35-0-35" style="padding: 0px 40px 30px 40px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                      <tr>
                        <td valign="top" align="left">
                        <div class="pc-font-alt" style="line-height: 24px; letter-spacing: -0.2px; font-family: Trebuchet MS, Helvetica, sans-serif; font-size: 18px; font-weight: normal; font-variant-ligatures: normal; color: #434343; text-align: left; text-align-last: left;">
                          <div><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);">Great news </span><span style="font-weight: normal;font-style: normal;color: rgb(255, 255, 255);">${firstName}</span><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);">! Your registration for </span><span style="font-weight: normal;font-style: normal;color: rgb(255, 255, 255);">${party}</span><span style="font-weight: normal;font-style: normal;color: rgb(86, 156, 214);"> </span><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);">à la mode was successful.</span>
                          </div>
                          <div><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);"> </span>
                          </div>
                          <div><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);">We are thrilled to have you with us. A pdf of your ticket has been attached to the email and you will need it to enter the venue.</span>
                          </div>
                          <div><span>﻿</span>
                          </div>
                          <div><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);">Let the countdown begin!</span>
                          </div>
                          <div><span>﻿</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span>﻿</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="font-size: 20px;font-weight: 700;font-style: normal;color: #BC0123;">à la mode Paris</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="font-size: 20px;font-weight: 700;font-style: normal;color: #BC0123;">Tuesday, September 24, 2024</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="font-size: 20px;font-weight: 700;font-style: normal;color: #BC0123;">12:00am - 5:00am</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="font-size: 20px;font-weight: 700;font-style: normal;color: #BC0123;"><br/></span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="text-decoration: underline;font-size: 20px;font-weight: 700;font-style: normal;color: #BC0123;">CHEZ MOUNE</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="text-decoration: underline;font-size: 20px;font-weight: 700;font-style: normal;color: #BC0123;">54 Rue Jean-Baptiste Pigalle, 75009 Paris, France</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span style="font-weight: 700;font-style: normal;color: #BC0123;">﻿</span>
                          </div>
                          <div style="text-align: center; text-align-last: center;"><span>﻿</span>
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
                  <td style="padding: 0px 0px 0px 0px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr>
                    <td valign="top" class="pc-w520-padding-5-0-15-0 pc-w620-padding-5-0-15-0" style="padding: 0px 0px 0px 0px; border-radius: 0px; background-color: #000000;" bgcolor="#000000">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td valign="top">
                        <img src="https://cloudfilesdm.com/postcards/image-172584408748.png" class="" width="600" height="auto" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width:100%; height: auto; border: 0;" />
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

      </html>`;

      try {
        await sendInvitateEmail(email, party, pdfBuffer, htmlTemplate);
        return { success: true, email, message: 'Invitation sent successfully' };
      } catch (error) {
        console.error(`Failed to send invitation to ${email}:`, error);
        return { success: false, email, message: 'Failed to send invitation' };
      }
    } else {
      return { success: false, email, message: 'Already exists in approved sheet' };
    }
  }
  return { success: false, email: row[3], message: 'Not approved' };
}

async function removeFromUnapproved(sheets, emailsToRemove) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
    });

    const rows = response.data.values;
    const rowsToDelete = rows.reduce((acc, row, index) => {
      if (emailsToRemove.includes(row[3])) {
        acc.push(index + 2);
      }
      return acc;
    }, []);

    if (rowsToDelete.length > 0) {
      rowsToDelete.sort((a, b) => b - a);

      const requests = [{
        deleteDimension: {
          range: {
            sheetId: 0,
            dimension: 'ROWS',
            startIndex: rowsToDelete[rowsToDelete.length - 1] - 1,
            endIndex: rowsToDelete[0]
          }
        }
      }];

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: { requests }
      });
    }
  } catch (error) {
    console.error('Error removing rows from UNAPPROVED:', error);
  }
}

async function getUnapproved(sheets, startRow, endRow){
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `UNAPPROVED!A${startRow}:J${endRow}`,
    });
    console.log('get unapproved success ✅')
    return response;
  } catch (error) {
    console.log('get unapproved failed ❌', error)
  }
}

async function getApprovedRowsResponse(sheets){
  try {
    const approvedRowsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'APPROVED!A:J',
    });
    console.log('get approvedRowsResponse success ✅')
    return approvedRowsResponse;
  } catch (error) {
    console.log('get approvedRowsResponse failed ❌', error)
  }
}

async function getCurrentRowsResponse(sheets){
  try {
    const currentRowsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'APPROVED!A:A',
    });
    console.log('get currentRowsResponse success ✅')
    return currentRowsResponse;
  } catch (error) {
    console.log('get currentRowsResponse failed ❌', error)
  }
}

async function updateApprovedList(sheets, row, attendeeId, nextRow, timestamp) {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `APPROVED!A${nextRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          ...row,
          attendeeId,
          'Not Checked In',
          timestamp
        ]]
      }
    });
    console.log('updateApprovedList success ✅')
  } catch (error) {
    console.error('updateApprovedList failed ❌', error)
    throw error;
  }
}

async function QrCodeUrl(qrCodeLink){
  try {
    const qr = await QRCode.toDataURL(qrCodeLink)
    console.log('get QrCodeUrl success ✅')
    return qr;
  } catch (error) {
    console.log('get QrCodeUrl failed ❌' , error)
  }
}

async function getPdf(firstName, lastName, party, plusOne, partyDetails, qrCodeDataURL){
  try {
    Font.register({
      family: 'Futura',
      src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/futuraregular.ttf',
    });
    
    Font.register({
      family: 'Sloop Script',
      src: 'https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/font/SloopScriptTwoBETAMedium.ttf',
    });
    
    // Create styles
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      },
      backgroundImage: {
        position: 'absolute',
        minWidth: '100%',
        minHeight: '100%',
        display: 'block',
        height: '100vh',
        width: '100vw',
      },
      content: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
      },
      logo: {
        width: 60,
        marginTop: 30,
        marginBottom: 20,
      },
      text: {
        fontFamily: 'Futura',
        color: '#FFFFFF',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 5,
      },
      nameContainer: {
        alignItems: 'center',
        marginTop: 20,
      },
      name: {
        fontFamily: 'Sloop Script',
        fontSize: 66,
        color: '#FFFFFF',
        borderBottom: '1px solid white',
      },
      nameLine: {
        width: '80%',
        height: 2,
        backgroundColor: '#FFFFFF',
      },
      qrCode: {
        width: 170,
        height: 170,
        marginVertical: 20,
        marginBottom: 30,
        marginTop: 30,
      },
      dateTimeText: {
        fontFamily: 'Futura',
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 0,
        lineHeight: 1.2,
      },
      centerText: {
        textAlign: 'center',
        display: "flex",
        flexDirection: "column",
        alignItems: 'center',
      },
    });
    
    // Create PDF Document component
    const MyDocument = ({ firstName, lastName, party, plusOne, partyDetails, qrCodeDataURL }) => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
          <Image
            style={styles.backgroundImage}
            src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/gradient-background.png"
          />
            <Image style={styles.logo} src="https://raw.githubusercontent.com/samvarcia/alamodewebsitetest/master/public/logoalamode.png" />
            <View style={[styles.centerText, { marginTop: 15 }]}>
              <Text style={[styles.dateTimeText, { fontSize: 14 }]}>SPRING/SUMMER 25</Text>
              <Text style={[styles.dateTimeText, { fontSize: 26, marginBottom: 30 }]}>{party.toUpperCase()}</Text>
            </View>
            <Text style={[styles.text, { fontSize: 10 }]}>WOULD NOT BE THE SAME WITHOUT</Text>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{firstName} {lastName}</Text>
            </View>
              <View style={styles.nameLine}></View>
            {plusOne !== 'None' && (
              <Text style={[styles.text, {fontSize: 16, marginTop: 10 }]}>ATTENDING WITH: {plusOne.toUpperCase()}</Text>
            )}
            <Image style={styles.qrCode} src={qrCodeDataURL} />
            <Text style={styles.text}>JOIN US AT</Text>
            <View style={styles.centerText}>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.venue}</Text>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.address}</Text>
            </View>
            <Text style={[styles.text, { marginTop: 10 }]}>ON</Text>
            <View style={styles.centerText}>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.date}</Text>
              <Text style={[styles.dateTimeText, { fontSize: 16 }]}>{partyDetails.hours}</Text>
            </View>
            <Text style={[styles.text, { fontSize: 8, marginTop: 130 }]}>Please Party Responsibly: Attendees assume full responsibility for their own actions.</Text>
          </View>
        </Page>
      </Document>
    );

    const pdfFile = await pdf(
      <MyDocument
        firstName={firstName}
        lastName={lastName}
        party={party}
        plusOne={plusOne}
        partyDetails={partyDetails}
        qrCodeDataURL={qrCodeDataURL}
      />
    ).toBuffer();
    console.log('get getPdf success ✅')
    return pdfFile;
  } catch (error) {
    console.log('get getPdf failed ❌' , error)
  }
}


async function sendInvitateEmail(email, party, pdfBuffer, htmlTemplate) {
  try {
    await sendEmail(
      email,
      `${party} Party Invitation`,
      pdfBuffer,
      htmlTemplate
    );
    console.log('send Invitation success ✅')

  } catch (error) {
    console.log('send Invitation failed ❌')
  }
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

    // Get the total number of rows
    const countResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:A',
    });

    const totalRows = countResponse.data.values ? countResponse.data.values.length : 0;
    const totalChunks = Math.ceil(totalRows / CHUNK_SIZE);

    let allResults = [];
    let emailsToRemove = [];

    for (let chunk = 0; chunk < totalChunks; chunk++) {
      const startRow = chunk * CHUNK_SIZE + 2; // +2 because we start from A2
      const endRow = Math.min((chunk + 1) * CHUNK_SIZE + 1, totalRows + 1);

      const response = await getUnapproved(sheets, startRow, endRow);
      const rows = response.data.values;

      if (rows && rows.length) {
        const results = await processInBatches(sheets, rows);
        allResults.push(...results);
        
        const chunkEmailsToRemove = results
          .filter(result => result.success)
          .map(result => result.email);
        emailsToRemove.push(...chunkEmailsToRemove);
      }
    }

    // Remove processed rows from UNAPPROVED sheet
    if (emailsToRemove.length > 0) {
      await removeFromUnapproved(sheets, emailsToRemove);
    }

    return NextResponse.json({ message: 'Approval process completed', results: allResults }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error in approval process' }, { status: 500 });
  }
}