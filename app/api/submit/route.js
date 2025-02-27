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

    const htmlTemplate = `
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
<!--[if gte mso 15]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<meta charset="UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${body.parties}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
<!--[if !mso]><!--><link rel="stylesheet" type="text/css" id="newGoogleFontsStatic" href="https://fonts.googleapis.com/css?family=Catamaran:400,400i,700,700i,900,900i|Work+Sans:400,400i,700,700i,900,900i|Merriweather:400,400i,700,700i,900,900i"/><!--<![endif]--><style>          img{-ms-interpolation-mode:bicubic;} 
          table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} 
          .mceStandardButton, .mceStandardButton td, .mceStandardButton td a{mso-hide:all !important;} 
          p, a, li, td, blockquote{mso-line-height-rule:exactly;} 
          p, a, li, td, body, table, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;} 
          @media only screen and (max-width: 480px){
            body, table, td, p, a, li, blockquote{-webkit-text-size-adjust:none !important;} 
          }
          .mcnPreviewText{display: none !important;} 
          .bodyCell{margin:0 auto; padding:0; width:100%;}
          .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font{line-height:100%;} 
          .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} 
          a[x-apple-data-detectors]{color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} 
            body{height:100%; margin:0; padding:0; width:100%; background: #ffffff;}
            p{margin:0; padding:0;} 
            table{border-collapse:collapse;} 
            td, p, a{word-break:break-word;} 
            h1, h2, h3, h4, h5, h6{display:block; margin:0; padding:0;} 
            img, a img{border:0; height:auto; outline:none; text-decoration:none;} 
            a[href^="tel"], a[href^="sms"]{color:inherit; cursor:default; text-decoration:none;} 
            li p {margin: 0 !important;}
            .ProseMirror a {
                pointer-events: none;
            }
            @media only screen and (max-width: 640px){
                .mceClusterLayout td{padding: 4px !important;} 
            }
            @media only screen and (max-width: 480px){
                body{width:100% !important; min-width:100% !important; } 
                body.mobile-native {
                    -webkit-user-select: none; user-select: none; transition: transform 0.2s ease-in; transform-origin: top center;
                }
                body.mobile-native.selection-allowed a, body.mobile-native.selection-allowed .ProseMirror {
                    user-select: auto;
                    -webkit-user-select: auto;
                }
                colgroup{display: none;}
                img{height: auto !important;}
                .mceWidthContainer{max-width: 660px !important;}
                .mceColumn{display: block !important; width: 100% !important;}
                .mceColumn-forceSpan{display: table-cell !important; width: auto !important;}
                .mceColumn-forceSpan .mceButton a{min-width:0 !important;}
                .mceBlockContainer{padding-right:16px !important; padding-left:16px !important;} 
                .mceTextBlockContainer{padding-right:16px !important; padding-left:16px !important;} 
                .mceBlockContainerE2E{padding-right:0px; padding-left:0px;} 
                .mceSpacing-24{padding-right:16px !important; padding-left:16px !important;}
                .mceImage, .mceLogo{width: 100% !important; height: auto !important;} 
                .mceFooterSection .mceText, .mceFooterSection .mceText p{font-size: 16px !important; line-height: 140% !important;}
            }
            div[contenteditable="true"] {outline: 0;}
            .ProseMirror h1.empty-node:only-child::before,
            .ProseMirror h2.empty-node:only-child::before,
            .ProseMirror h3.empty-node:only-child::before,
            .ProseMirror h4.empty-node:only-child::before {
                content: 'Heading';
            }
            .ProseMirror p.empty-node:only-child::before, .ProseMirror:empty::before {
                content: 'Start typing...';
            }
            .mceImageBorder {display: inline-block;}
            .mceImageBorder img {border: 0 !important;}
body, #bodyTable { background-color: rgb(238, 238, 238); }.mceText, .mcnTextContent, .mceLabel { font-family: "Work Sans", sans-serif; }.mceText, .mcnTextContent, .mceLabel { color: rgb(1, 4, 76); }.mceText h1 { margin-bottom: 0px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-12 .mceInput + .mceErrorMessage { margin-top: -6px; }.mceText h1 { margin-bottom: 0px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-24 .mceInput + .mceErrorMessage { margin-top: -12px; }.mceInput { background-color: transparent; border: 2px solid rgb(208, 208, 208); width: 60%; color: rgb(77, 77, 77); display: block; }.mceInput[type="radio"], .mceInput[type="checkbox"] { float: left; margin-right: 12px; display: inline; width: auto !important; }.mceLabel > .mceInput { margin-bottom: 0px; margin-top: 2px; }.mceLabel { display: block; }.mceText p, .mcnTextContent p { color: rgb(1, 4, 76); font-family: "Work Sans", sans-serif; font-size: 18px; font-weight: normal; line-height: 1.25; mso-line-height-alt: 125%; text-align: left; direction: ltr; }.mceText h1, .mcnTextContent h1 { color: rgb(1, 4, 76); font-family: Merriweather, Georgia, "Times New Roman", serif; font-size: 50px; font-weight: bold; line-height: 1.25; mso-line-height-alt: 125%; text-align: left; direction: ltr; }.mceText a, .mcnTextContent a { color: rgb(255, 255, 255); font-style: normal; font-weight: normal; text-decoration: underline; direction: ltr; }p.mcePastedContent, h1.mcePastedContent, h2.mcePastedContent, h3.mcePastedContent, h4.mcePastedContent { text-align: left; }.mceSectionBody .mceText h1, .mceSectionBody .mcnTextContent h1 { }.mceSectionBody .mceText p, .mceSectionBody .mcnTextContent p { }.mceSectionFooter .mceText p, .mceSectionFooter .mcnTextContent p { }.mceSectionFooter .mceText a, .mceSectionFooter .mcnTextContent a { font-style: normal; }
@media only screen and (max-width: 480px) {
            .mceText p { margin: 0px; font-size: 16px !important; line-height: 1.5 !important; mso-line-height-alt: 150%; }
          }
@media only screen and (max-width: 480px) {
            .mceText h1 { font-size: 32px !important; line-height: 1.25 !important; mso-line-height-alt: 125%; }
          }
@media only screen and (max-width: 480px) {
            .bodyCell { padding-left: 16px !important; padding-right: 16px !important; }
          }
#dataBlockId-11 p, #dataBlockId-11 h1, #dataBlockId-11 h2, #dataBlockId-11 h3, #dataBlockId-11 h4, #dataBlockId-11 ul { text-align: center; }#dataBlockId-11 p, #dataBlockId-11 h1, #dataBlockId-11 h2, #dataBlockId-11 h3, #dataBlockId-11 h4, #dataBlockId-11 ul { text-align: center; }</style></head>
<body>
<!--*|IF:MC_PREVIEW_TEXT|*-->
<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->
<!--*|END:IF|*-->
<div style="display: none; max-height: 0px; overflow: hidden;"> ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ </div><!--MCE_TRACKING_PIXEL-->
<center>
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(238, 238, 238);">
<tbody><tr>
<td class="bodyCell" align="center" valign="top">
<table id="root" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody data-block-id="3" class="mceWrapper"><tr><td style="background-color:transparent;padding-top:12px" valign="top" align="center" class="mceSectionHeader"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="2"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-9" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top" class="mceImageBlockContainer" align="center" id="blockContainerId-17"><span class="mceImageBorder" style="border:0;border-radius:0;vertical-align:top;margin:0"><img data-block-id="17" width="660" height="auto" style="width:660px;height:auto;max-width:660px !important;border-radius:0;display:block" alt="" src="https://mcusercontent.com/c00fbf886da3f8e9acde456ad/images/b55dbbb5-acc8-6f4f-6578-57bd3db4f662.png" role="presentation" class="imageDropZone mceImage"/></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id="9" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionBody"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="8"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-10" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="background-color:transparent" valign="top" id="blockContainerId-30"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="30"><tbody><tr><td valign="top" class="mceSpacerBlock" height="57"></td></tr></tbody></table></td></tr><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top" id="blockContainerId-28"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:48px;padding-right:48px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer"><div data-block-id="28" class="mceText" id="dataBlockId-28" style="width:100%"><h1 style="letter-spacing: -2px;" class="last-child"><span style="color:#ffffff;"><span style="font-size: 44px"><span style="font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif">You’re all set!</span></span></span></h1></div></td></tr></tbody></table></td></tr><tr><td valign="top" class="mceGutterContainer" id="gutterContainerId-20"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate" role="presentation"><tbody><tr><td style="padding-top:8px;padding-bottom:8px;padding-right:0;padding-left:0" valign="top" class="mceLayoutContainer" id="blockContainerId-20"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="20" id="section_d1ffaf64fe9b84c15c5f5e4ebff49dff" class="mceLayout"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-12" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" align="center" id="blockContainerId--5"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="-5"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-13" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" id="blockContainerId-19"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="19"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="24" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="18" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:25px;padding-bottom:25px;padding-right:25px;padding-left:25px" valign="top" class="mceGutterContainer" id="gutterContainerId-37"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top" id="blockContainerId-37"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer"><div data-block-id="37" class="mceText" id="dataBlockId-37" style="width:100%"><p><span style="color:#ffffff;">Dear ${body.firstName},</span></p><p><br/></p><p style="text-align: left;"><span style="color:rgb(255, 255, 255);">Thank you for registering for Paris à la mode FW25.</span></p><p style="text-align: left;"><br/></p><p style="text-align: left;"><span style="color:rgb(255, 255, 255);">We have received your submission and it is currently under review. We will notify you once your submission has been approved. Once approved you will receive a confirmation email with dates, time and location.</span></p><p style="text-align: left;"><br/></p><p style="text-align: left;"><span style="color:rgb(255, 255, 255);">Talk Soon,</span></p><p><br/></p><p class="mcePastedContent last-child"><strong><span style="color:rgb(255, 255, 255);">-Team à la mode</span></strong></p></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" valign="top" class="mceImageBlockContainer" align="center" id="blockContainerId-36"><span class="mceImageBorder" style="border:0;border-radius:0;vertical-align:top;margin:0"><img data-block-id="36" width="191.39999999999998" height="auto" style="width:191.39999999999998px;height:auto;max-width:191.39999999999998px !important;border-radius:0;display:block" alt="" src="https://mcusercontent.com/c00fbf886da3f8e9acde456ad/images/281a350d-a6dc-db31-0f30-531b912a5a5c.png" role="presentation" class="imageDropZone mceImage"/></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id="15" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionFooter"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="14"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-11" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="background-color:transparent;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" valign="top" class="mceLayoutContainer" id="blockContainerId-32"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="32"><tbody><tr class="mceRow"><td style="background-color:transparent;background-position:center;background-repeat:no-repeat;background-size:cover;padding-top:0px;padding-bottom:0px" valign="top"><table border="0" cellpadding="0" cellspacing="24" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-8" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceSocialFollowBlockContainer" id="blockContainerId--7"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mceSocialFollowBlock" data-block-id="-7"><tbody><tr><td valign="middle" align="center"><!--[if mso]><table align="left" border="0" cellspacing= "0" cellpadding="0"><tr><![endif]--><!--[if mso]><td align="center" valign="top"><![endif]--><table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;float:left" role="presentation"><tbody><tr><td style="padding-top:3px;padding-bottom:3px;padding-left:12px;padding-right:12px" valign="top" class="mceSocialFollowIcon" align="center" width="32"><a href="https://locationalamode.com" target="_blank" rel="noreferrer"><img class="mceSocialFollowImage" width="32" height="32" alt="Website icon" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/website-filled-light-40.png"/></a></td></tr></tbody></table><!--[if mso]></td><![endif]--><!--[if mso]><td align="center" valign="top"><![endif]--><table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;float:left" role="presentation"><tbody><tr><td style="padding-top:3px;padding-bottom:3px;padding-left:12px;padding-right:12px" valign="top" class="mceSocialFollowIcon" align="center" width="32"><a href="https://www.instagram.com/location.alamode/" target="_blank" rel="noreferrer"><img class="mceSocialFollowImage" width="32" height="32" alt="Instagram icon" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/instagram-filled-light-40.png"/></a></td></tr></tbody></table><!--[if mso]></td><![endif]--><!--[if mso]><td align="center" valign="top"><![endif]--><table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;float:left" role="presentation"><tbody><tr><td style="padding-top:3px;padding-bottom:3px;padding-left:12px;padding-right:12px" valign="top" class="mceSocialFollowIcon" align="center" width="32"><a href="https://www.tiktok.com/@locationalamode" target="_blank" rel="noreferrer"><img class="mceSocialFollowImage" width="32" height="32" alt="TikTok icon" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/tiktok-filled-light-40.png"/></a></td></tr></tbody></table><!--[if mso]></td><![endif]--><!--[if mso]></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="padding-top:8px;padding-bottom:8px;padding-right:8px;padding-left:8px" valign="top" class="mceLayoutContainer" id="blockContainerId-13"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13" id="section_8208b8b3ceb25eb1e5ebe32bfffc16e1" class="mceFooterSection"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="12" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-3" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top" align="center" id="blockContainerId-11"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:15px;padding-right:15px;padding-top:15px;padding-bottom:15px" class="mceTextBlockContainer"><div data-block-id="11" class="mceText" id="dataBlockId-11" style="display:inline-block;width:100%"><p style="line-height: 1.25; mso-line-height-alt: 125%;"><em><span style="color:#ffffff;"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif">Copyright (C) 2025 à la mode. All Rights Reserved.</span></span></span></em><span style="color:#ffffff;"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif"><br/></span></span></span><a href="http://www.locationalamode.com" target="_blank"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif">www.locationalamode.com</span></span></a></p><p style="line-height: 1.25; mso-line-height-alt: 125%;" class="last-child"><span style="color:#ffffff;"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif">You can </span></span></span><a href="*|UPDATE_PROFILE|*" style="color: #ffffff;"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif">update your preferences</span></span></a><span style="color:#ffffff;"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif"> or </span></span></span><a href="*|UNSUB|*" style="color: #ffffff;"><span style="font-size: 10px"><span style="font-family: 'Catamaran', sans-serif">unsubscribe</span></span></a></p></div></td></tr></tbody></table></td></tr><tr><td valign="top" class="mceLayoutContainer" align="center" id="blockContainerId--2"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="-2"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover;padding-top:0px;padding-bottom:0px" valign="top"><table border="0" cellpadding="0" cellspacing="24" width="100%" role="presentation"><tbody></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table>
</td>
</tr>
</tbody></table>
</center>
<script type="text/javascript"  src="/5bWli_/lU/DA/3pc7/ml_-TJG-Jp/uYwuJDhDbcrSGuD3/OxtkPw/c2/1YBB5LfEo"></script></body></html>`

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