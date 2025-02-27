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
<!--[if !mso]><!--><link rel="stylesheet" type="text/css" id="newGoogleFontsStatic" href="https://fonts.googleapis.com/css?family=Della+Respira:400,400i,700,700i,900,900i|Alegreya+Sans:400,400i,700,700i,900,900i|Work+Sans:400,400i,700,700i,900,900i|Merriweather:400,400i,700,700i,900,900i"/><!--<![endif]--><style>          img{-ms-interpolation-mode:bicubic;} 
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
body, #bodyTable { background-color: rgb(1, 4, 76); }.mceText, .mcnTextContent, .mceLabel { font-family: "Work Sans", sans-serif; }.mceText, .mcnTextContent, .mceLabel { color: rgb(255, 255, 255); }.mceText h1 { margin-bottom: 0px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-12 .mceInput + .mceErrorMessage { margin-top: -6px; }.mceText h1 { margin-bottom: 0px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-24 .mceInput + .mceErrorMessage { margin-top: -12px; }.mceInput { background-color: transparent; border: 2px solid rgb(208, 208, 208); width: 60%; color: rgb(77, 77, 77); display: block; }.mceInput[type="radio"], .mceInput[type="checkbox"] { float: left; margin-right: 12px; display: inline; width: auto !important; }.mceLabel > .mceInput { margin-bottom: 0px; margin-top: 2px; }.mceLabel { display: block; }.mceText p, .mcnTextContent p { color: rgb(255, 255, 255); font-family: "Work Sans", sans-serif; font-size: 18px; font-weight: normal; line-height: 1.25; mso-line-height-alt: 125%; text-align: left; direction: ltr; }.mceText h1, .mcnTextContent h1 { color: rgb(255, 255, 255); font-family: "Work Sans", sans-serif; font-size: 50px; font-weight: bold; line-height: 1.25; mso-line-height-alt: 125%; text-align: left; direction: ltr; }.mceText a, .mcnTextContent a { color: rgb(255, 255, 255); font-style: normal; font-weight: normal; text-decoration: underline; direction: ltr; }.mceSectionBody .mceText h1, .mceSectionBody .mcnTextContent h1 { }.mceSectionBody .mceText p, .mceSectionBody .mcnTextContent p { }.mceSectionFooter .mceText p, .mceSectionFooter .mcnTextContent p { }.mceSectionFooter .mceText a, .mceSectionFooter .mcnTextContent a { font-style: normal; }
@media only screen and (max-width: 480px) {
            .mceText p { margin: 0px; font-size: 16px !important; line-height: 1.5 !important; mso-line-height-alt: 150%; }
          }
@media only screen and (max-width: 480px) {
            .mceText h1 { font-size: 32px !important; line-height: 1.25 !important; mso-line-height-alt: 125%; }
          }
@media only screen and (max-width: 480px) {
            .mceBlockContainer { padding-left: 16px !important; padding-right: 16px !important; }
          }
@media only screen and (max-width: 480px) {
            .mceDividerBlock { border-top-width: 2px !important; }
          }
@media only screen and (max-width: 480px) {
            .mceDividerContainer { width: 100% !important; }
          }
#dataBlockId-11 p, #dataBlockId-11 h1, #dataBlockId-11 h2, #dataBlockId-11 h3, #dataBlockId-11 h4, #dataBlockId-11 ul { text-align: center; }#dataBlockId-11 p, #dataBlockId-11 h1, #dataBlockId-11 h2, #dataBlockId-11 h3, #dataBlockId-11 h4, #dataBlockId-11 ul { text-align: center; }</style></head>
<body>
<!--*|IF:MC_PREVIEW_TEXT|*-->
<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">You're all set!</span><!--<![endif]-->
<!--*|END:IF|*-->
<div style="display: none; max-height: 0px; overflow: hidden;"> ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ ͏ ‌     ­ </div><!--MCE_TRACKING_PIXEL-->
<center>
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(1, 4, 76);">
<tbody><tr>
<td class="bodyCell" align="center" valign="top">
<table id="root" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody data-block-id="3" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionHeader"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="2"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-6" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceGutterContainer" id="gutterContainerId-19"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate" role="presentation"><tbody><tr><td style="padding-top:8px;padding-bottom:8px;padding-right:0;padding-left:0" valign="top"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="19" id="section_fbd2e63cabc8b497c66644bcf10a46d2" class="mceLayout"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-9" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" align="center"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="-5"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-10" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="18"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="24" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="21" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" valign="top" class="mceBlockContainer" align="center"><span class="mceImageBorder" style="border:0;border-radius:0;vertical-align:top;margin:0"><img data-block-id="20" width="660" height="auto" style="width:660px;height:auto;max-width:660px !important;border-radius:0;display:block" alt="" src="https://mcusercontent.com/c00fbf886da3f8e9acde456ad/images/e68d085a-d752-711b-5270-7777eb7c44e0.png" role="presentation" class="imageDropZone mceImage"/></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id="9" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionBody"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="8"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-7" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:50px;padding-right:50px;padding-top:25px;padding-bottom:25px" class="mceTextBlockContainer"><div data-block-id="4" class="mceText" id="dataBlockId-4" style="width:100%"><h1 class="last-child"><span style="font-size: 52px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif"><span style="font-weight:normal;">You're all set!</span></span></span></h1></div></td></tr></tbody></table></td></tr><tr><td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:24px;padding-left:24px" valign="top" class="mceBlockContainer"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent;width:100%" role="presentation" class="mceDividerContainer" data-block-id="5"><tbody><tr><td style="min-width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#ffffff;line-height:0;font-size:0" valign="top" class="mceDividerBlock"> </td></tr></tbody></table></td></tr><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:50px;padding-right:50px;padding-top:50px;padding-bottom:50px" class="mceTextBlockContainer"><div data-block-id="6" class="mceText" id="dataBlockId-6" style="width:100%"><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Dear ${body.firstName},</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Thank you for registering for ${body.parties} à la mode FW25.</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">We have received your submission and it is currently under review. We will notify you once your submission has been approved. Once approved you will receive a confirmation email with dates, time and location.</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Talk Soon,</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;" class="last-child"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Team à la mode.</span></span></p></div></td></tr></tbody></table></td></tr><tr><td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:24px;padding-left:24px" valign="top" class="mceBlockContainer"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent;width:100%" role="presentation" class="mceDividerContainer" data-block-id="7"><tbody><tr><td style="min-width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#ffffff;line-height:0;font-size:0" valign="top" class="mceDividerBlock"> </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table>
</td>
</tr>
</tbody></table>
</center>
</body></html>`

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