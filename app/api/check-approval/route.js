// app/api/check-approval/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from '../../utils/pdf-generator';
import { sendEmail } from '../../utils/email-service';
import { getUnapprovedAttendees, updateAttendeeStatus, moveToApprovedSheet, getRecentlyProcessed } from '../../utils/sheets-service';

// Force dynamic execution
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

const BATCH_SIZE = 1;
const MAX_EXECUTION_TIME = 9000;

const PARTY_INFO = {
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
  },
  'London': {
    venue: 'PRINTWORKS LONDON',
    address: 'Surrey Quays Rd, London SE16 7PJ, United Kingdom',
    date: 'THURSDAY, 13TH FEBRUARY 2025',
    hours: '10:00PM - 06:00AM'
  }
};

export async function GET(req) {
  // Log request details
  console.log('🔄 Check-approval request received:', {
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  try {
    const startTime = Date.now();
    
    console.log('📊 Fetching current state...');
    const [unapprovedAttendees, recentlyProcessed] = await Promise.all([
      getUnapprovedAttendees(),
      getRecentlyProcessed()
    ]);
    
    // Only get attendees that are approved ('Y') but not yet processed ('S')
    const approvedAttendees = unapprovedAttendees.filter(row => row[8] === 'Y' && row[9] !== 'S');
    const pendingCount = unapprovedAttendees.filter(row => row[8] === '').length;
    
    console.log(`✨ Found ${approvedAttendees.length} approved attendees to process`);
    
    if (approvedAttendees.length === 0) {
      return NextResponse.json({
        message: 'No new approvals to process',
        pending: pendingCount,
        recentlyProcessed: recentlyProcessed.map(row => ({
          name: `${row[1]} ${row[2]}`,
          party: row[0],
          timestamp: row[11] || 'Recently'
        }))
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      });
    }

    const processed = [];
    const errors = [];
    let processedCount = 0;

    // Process attendees one at a time with timeout check
    for (const attendee of approvedAttendees) {
      if (Date.now() - startTime > MAX_EXECUTION_TIME) {
        console.log('⚠️ Approaching timeout limit, stopping processing');
        break;
      }

      if (processedCount >= BATCH_SIZE) {
        console.log('✋ Batch size limit reached');
        break;
      }

      try {
        const [party, firstName, lastName, email, , , plusOneStatus, plusOneName] = attendee;
        console.log(`🎫 Processing: ${firstName} ${lastName} for ${party}`);

        const attendeeId = uuidv4();
        const qrCodeLink = `${process.env.BASE_URL}/checkin/${attendeeId}`;
        const timestamp = new Date().toISOString();
        
        const attendeeData = {
          firstName,
          lastName,
          party,
          plusOne: plusOneStatus === 'Yes' ? plusOneName : 'None',
          partyDetails: PARTY_INFO[party] || {
            venue: 'TBA',
            address: 'TBA',
            date: 'TBA',
            hours: 'TBA'
          }
        };

        console.log('📄 Generating PDF...');
        const pdfBuffer = await generatePDF(attendeeData, qrCodeLink);
        
        // const htmlTemplate = `
        //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        //     <h2>Welcome to the ${party} Party!</h2>
        //     <p>Dear ${firstName},</p>
        //     <p>Your attendance has been confirmed. Please find your invitation attached.</p>
        //     <h3>Event Details:</h3>
        //     <p><strong>Venue:</strong> ${attendeeData.partyDetails.venue}</p>
        //     <p><strong>Address:</strong> ${attendeeData.partyDetails.address}</p>
        //     <p><strong>Date:</strong> ${attendeeData.partyDetails.date}</p>
        //     <p><strong>Time:</strong> ${attendeeData.partyDetails.hours}</p>
        //     ${plusOneStatus === 'Yes' ? `<p><strong>Plus One:</strong> ${plusOneName}</p>` : ''}
        //     <p>Please keep this invitation safe and present it at the entrance.</p>
        //     <p>Looking forward to seeing you!</p>
        //   </div>
        // `;

        const htmlTemplate = `

        <!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Welcome to à la mode ${party}</title><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/><!--[if !mso]><!--><link rel="stylesheet" type="text/css" id="newGoogleFontsStatic" href="https://fonts.googleapis.com/css?family=Alegreya+Sans:400,400i,700,700i,900,900i|Work+Sans:400,400i,700,700i,900,900i|Merriweather:400,400i,700,700i,900,900i"/><!--<![endif]--><style> img{-ms-interpolation-mode:bicubic;} table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} .mceStandardButton, .mceStandardButton td, .mceStandardButton td a{mso-hide:all !important;} p, a, li, td, blockquote{mso-line-height-rule:exactly;} p, a, li, td, body, table, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;} @media only screen and (max-width: 480px){ body, table, td, p, a, li, blockquote{-webkit-text-size-adjust:none !important;} } .mcnPreviewText{display: none !important;} .bodyCell{margin:0 auto; padding:0; width:100%;} .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font{line-height:100%;} .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} a[x-apple-data-detectors]{color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} body{height:100%; margin:0; padding:0; width:100%; background: #ffffff;} p{margin:0; padding:0;} table{border-collapse:collapse;} td, p, a{word-break:break-word;} h1, h2, h3, h4, h5, h6{display:block; margin:0; padding:0;} img, a img{border:0; height:auto; outline:none; text-decoration:none;} a[href^="tel"], a[href^="sms"]{color:inherit; cursor:default; text-decoration:none;} li p {margin: 0 !important;} .ProseMirror a { pointer-events: none; } @media only screen and (max-width: 640px){ .mceClusterLayout td{padding: 4px !important;} } @media only screen and (max-width: 480px){ body{width:100% !important; min-width:100% !important; } body.mobile-native { -webkit-user-select: none; user-select: none; transition: transform 0.2s ease-in; transform-origin: top center; } body.mobile-native.selection-allowed a, body.mobile-native.selection-allowed .ProseMirror { user-select: auto; -webkit-user-select: auto; } colgroup{display: none;} img{height: auto !important;} .mceWidthContainer{max-width: 660px !important;} .mceColumn{display: block !important; width: 100% !important;} .mceColumn-forceSpan{display: table-cell !important; width: auto !important;} .mceColumn-forceSpan .mceButton a{min-width:0 !important;} .mceBlockContainer{padding-right:16px !important; padding-left:16px !important;} .mceTextBlockContainer{padding-right:16px !important; padding-left:16px !important;} .mceBlockContainerE2E{padding-right:0px; padding-left:0px;} .mceSpacing-24{padding-right:16px !important; padding-left:16px !important;} .mceImage, .mceLogo{width: 100% !important; height: auto !important;} .mceFooterSection .mceText, .mceFooterSection .mceText p{font-size: 16px !important; line-height: 140% !important;} } div[contenteditable="true"] {outline: 0;} .ProseMirror h1.empty-node:only-child::before, .ProseMirror h2.empty-node:only-child::before, .ProseMirror h3.empty-node:only-child::before, .ProseMirror h4.empty-node:only-child::before { content: 'Heading'; } .ProseMirror p.empty-node:only-child::before, .ProseMirror:empty::before { content: 'Start typing...'; } .mceImageBorder {display: inline-block;} .mceImageBorder img {border: 0 !important;}body, #bodyTable { background-color: rgb(1, 4, 76); }.mceText, .mcnTextContent, .mceLabel { font-family: "Work Sans", sans-serif; }.mceText, .mcnTextContent, .mceLabel { color: rgb(255, 255, 255); }.mceText h1 { margin-bottom: 0px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-12 .mceInput + .mceErrorMessage { margin-top: -6px; }.mceText h1 { margin-bottom: 0px; }.mceText p { margin-bottom: 0px; }.mceText label { margin-bottom: 0px; }.mceText input { margin-bottom: 0px; }.mceSpacing-24 .mceInput + .mceErrorMessage { margin-top: -12px; }.mceInput { background-color: transparent; border: 2px solid rgb(208, 208, 208); width: 60%; color: rgb(77, 77, 77); display: block; }.mceInput[type="radio"], .mceInput[type="checkbox"] { float: left; margin-right: 12px; display: inline; width: auto !important; }.mceLabel > .mceInput { margin-bottom: 0px; margin-top: 2px; }.mceLabel { display: block; }.mceText p, .mcnTextContent p { color: rgb(255, 255, 255); font-family: "Work Sans", sans-serif; font-size: 18px; font-weight: normal; line-height: 1.25; mso-line-height-alt: 125%; text-align: left; direction: ltr; }.mceText h1, .mcnTextContent h1 { color: rgb(255, 255, 255); font-family: Merriweather, Georgia, "Times New Roman", serif; font-size: 50px; font-weight: bold; line-height: 1.25; mso-line-height-alt: 125%; text-align: left; direction: ltr; }.mceText a, .mcnTextContent a { color: rgb(255, 255, 255); font-style: normal; font-weight: normal; text-decoration: underline; direction: ltr; }p.mcePastedContent, h1.mcePastedContent, h2.mcePastedContent, h3.mcePastedContent, h4.mcePastedContent { text-align: left; }.mceSectionBody .mceText h1, .mceSectionBody .mcnTextContent h1 { }.mceSectionBody .mceText p, .mceSectionBody .mcnTextContent p { }.mceSectionFooter .mceText p, .mceSectionFooter .mcnTextContent p { }.mceSectionFooter .mceText a, .mceSectionFooter .mcnTextContent a { font-style: normal; }@media only screen and (max-width: 480px) { .mceText p { margin: 0px; font-size: 16px !important; line-height: 1.5 !important; mso-line-height-alt: 150%; } }@media only screen and (max-width: 480px) { .mceText h1 { font-size: 32px !important; line-height: 1.25 !important; mso-line-height-alt: 125%; } }@media only screen and (max-width: 480px) { .mceBlockContainer { padding-left: 16px !important; padding-right: 16px !important; } }@media only screen and (max-width: 480px) { .mceDividerBlock { border-top-width: 2px !important; } }@media only screen and (max-width: 480px) { .mceDividerContainer { width: 100% !important; } }#dataBlockId-11 p, #dataBlockId-11 h1, #dataBlockId-11 h2, #dataBlockId-11 h3, #dataBlockId-11 h4, #dataBlockId-11 ul { text-align: center; }#dataBlockId-11 p, #dataBlockId-11 h1, #dataBlockId-11 h2, #dataBlockId-11 h3, #dataBlockId-11 h4, #dataBlockId-11 ul { text-align: center; }</style></head><body><!--*|IF:MC_PREVIEW_TEXT|*--><!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]--><!--*|END:IF|*--><div style="display: none; max-height: 0px; overflow: hidden;"> ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ ͏ ‌ ­ </div><!--MCE_TRACKING_PIXEL--><center><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(1, 4, 76);"><tbody><tr><td class="bodyCell" align="center" valign="top"><table id="root" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody data-block-id="3" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionHeader"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="2"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-6" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceGutterContainer" id="gutterContainerId-19"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate" role="presentation"><tbody><tr><td style="padding-top:8px;padding-bottom:8px;padding-right:0;padding-left:0" valign="top"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="19" id="section_db7e17b3d81a9084d2be2e9065f6f150" class="mceLayout"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-9" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" align="center"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="-5"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top" class="mceColumn" data-block-id="-10" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td valign="top"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="18"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="24" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="21" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" valign="top" class="mceBlockContainer" align="center"><span class="mceImageBorder" style="border:0;border-radius:0;vertical-align:top;margin:0"><img data-block-id="20" width="660" height="auto" style="width:660px;height:auto;max-width:660px !important;border-radius:0;display:block" alt="" src="https://mcusercontent.com/c00fbf886da3f8e9acde456ad/images/e68d085a-d752-711b-5270-7777eb7c44e0.png" role="presentation" class="imageDropZone mceImage"/></span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id="9" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionBody"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="8"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-7" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:50px;padding-right:50px;padding-top:25px;padding-bottom:25px" class="mceTextBlockContainer"><div data-block-id="4" class="mceText" id="dataBlockId-4" style="width:100%"><h1 style="letter-spacing: -2px;" class="last-child"><span style="font-size: 52px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Welcome to à la mode ${party}</span></span></h1></div></td></tr></tbody></table></td></tr><tr><td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:24px;padding-left:24px" valign="top" class="mceBlockContainer"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent;width:100%" role="presentation" class="mceDividerContainer" data-block-id="5"><tbody><tr><td style="min-width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#ffffff;line-height:0;font-size:0" valign="top" class="mceDividerBlock"> </td></tr></tbody></table></td></tr><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:50px;padding-right:50px;padding-top:50px;padding-bottom:50px" class="mceTextBlockContainer"><div data-block-id="6" class="mceText" id="dataBlockId-6" style="width:100%"><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Dear ${firstName},</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Your attendance has been confirmed. Please find your invitation attached.</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Event Details:</span></span></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px; text-align: center;"><strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Venue: </span></span></strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif"> ${attendeeData.partyDetails.venue}</span></span></p><p style="letter-spacing: -1px; text-align: center;"><strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Address</span></span></strong>: <span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">${attendeeData.partyDetails.address}</span></p><p style="letter-spacing: -1px; text-align: center;"><strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Date:</span></span></strong> <span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">${attendeeData.partyDetails.date}</span></p><p style="letter-spacing: -1px; text-align: center;"><strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Time: </span></span></strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">${attendeeData.partyDetails.hours}</span></span></p> ${plusOneStatus === 'Yes' ? `<p style="letter-spacing: -1px; text-align: center;"><strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Plus One: </span></span></strong><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">${plusOneName}</span></span></p>` : ''<p style="letter-spacing: -1px; text-align: center;"><br/></p><p style="letter-spacing: -1px;"><br/></p><p style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Please keep this invitation safe and present it at the entrance.</span></span></p><p><br/></p><p class="mcePastedContent"><br/></p><p class="mcePastedContent" style="letter-spacing: -1px;"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Looking forward to seeing you,</span></span></p><p style="letter-spacing: -1px;" class="last-child"><span style="font-size: 19px"><span style="font-family: 'Alegreya Sans', Georgia, 'Times New Roman', serif">Team à la mode.</span></span></p></div></td></tr></tbody></table></td></tr><tr><td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:24px;padding-left:24px" valign="top" class="mceBlockContainer"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent;width:100%" role="presentation" class="mceDividerContainer" data-block-id="7"><tbody><tr><td style="min-width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#ffffff;line-height:0;font-size:0" valign="top" class="mceDividerBlock"> </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody><tbody data-block-id="15" class="mceWrapper"><tr><td style="background-color:transparent" valign="top" align="center" class="mceSectionFooter"><!--[if (gte mso 9)|(IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="660" style="width:660px;"><tr><td><![endif]--><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation"><tbody><tr><td style="background-color:#01044c" valign="top" class="mceWrapperInner"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="14"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-8" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:8px;padding-bottom:8px;padding-right:8px;padding-left:8px" valign="top"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13" id="section_5d2c20b3de41db32261b41e08d677fe2" class="mceFooterSection"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top"><table border="0" cellpadding="0" cellspacing="12" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0" valign="top" class="mceColumn" data-block-id="-3" colspan="12" width="100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"><tbody><tr><td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top" align="center"><table width="100%" style="border:0;border-radius:0;border-collapse:separate"><tbody><tr><td style="padding-left:50px;padding-right:50px;padding-top:50px;padding-bottom:50px" class="mceTextBlockContainer"><div data-block-id="11" class="mceText" id="dataBlockId-11" style="display:inline-block;width:100%"><p style="line-height: 1.25; mso-line-height-alt: 125%;"><a href="*|ARCHIVE|*"><span style="font-size: 12px">View in browser</span></a></p><p style="line-height: 1.25; mso-line-height-alt: 125%;"><br/></p><p style="line-height: 1.25; mso-line-height-alt: 125%;"><em><span style="font-size: 12px">Copyright (C) *|CURRENT_YEAR|* *|LIST:COMPANY|*. All rights reserved.</span></em><span style="font-size: 12px"><br/>*|IFNOT:ARCHIVE_PAGE|**|LIST:DESCRIPTION|**|END:IF|*<br/><br/>Our mailing address is:<br/>*|IFNOT:ARCHIVE_PAGE|**|HTML:LIST_ADDRESS|**|END:IF|*<br/><br/>Want to change how you receive these emails?</span></p><p style="line-height: 1.25; mso-line-height-alt: 125%;" class="last-child"><span style="font-size: 12px">You can </span><a href="*|UPDATE_PROFILE|*"><span style="font-size: 12px">update your preferences</span></a><span style="font-size: 12px"> or </span><a href="*|UNSUB|*"><span style="font-size: 12px">unsubscribe</span></a></p></div></td></tr></tbody></table></td></tr><tr><td valign="top" class="mceLayoutContainer" align="center"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="-2"><tbody><tr class="mceRow"><td style="background-position:center;background-repeat:no-repeat;background-size:cover;padding-top:0px;padding-bottom:0px" valign="top"><table border="0" cellpadding="0" cellspacing="24" width="100%" role="presentation"><tbody></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></center><script type="text/javascript" src="/39tGSl/CD0Su/zxz4O/0C33/D5EYp6b0ND4p/DVFVDD0DAQ/Yn/IqdyIXHSo"></script></body></html>

        `

        console.log('📧 Sending email...');
        await sendEmail(email, `${party} Party Invitation`, pdfBuffer, htmlTemplate);
        
        console.log('📝 Updating sheets...');
        const rowIndex = unapprovedAttendees.indexOf(attendee) + 2;
        await updateAttendeeStatus(`UNAPPROVED!J${rowIndex}`, [['S']]);
        await moveToApprovedSheet([
          party, firstName, lastName, email, attendee[4], attendee[5], 
          plusOneStatus, plusOneName, 'Y', 'S', attendeeId, timestamp
        ]);
        
        processed.push(`${firstName} ${lastName} - ${party}`);
        processedCount++;
        console.log(`✅ Successfully processed ${firstName} ${lastName}`);

      } catch (error) {
        console.error('❌ Error processing attendee:', error);
        if (error.message.includes('Duplicate entry')) {
          const rowIndex = unapprovedAttendees.indexOf(attendee) + 2;
          await updateAttendeeStatus(`UNAPPROVED!J${rowIndex}`, [['S']]);
          errors.push(`${attendee[1]} ${attendee[2]} - Already approved for ${attendee[0]}`);
        } else {
          errors.push(`${attendee[1]} ${attendee[2]} - Processing failed: ${error.message}`);
        }
      }
    }

    console.log('🔄 Getting updated recently processed list...');
    const updatedRecentlyProcessed = await getRecentlyProcessed();

    const response = {
      message: processed.length > 0 
        ? 'Approval processing completed' 
        : 'Partial processing completed due to time constraints',
      processed: processed.length,
      pending: pendingCount,
      remainingToProcess: approvedAttendees.length - processed.length,
      duplicates: errors.length > 0 ? errors : undefined,
      timeElapsed: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      recentlyProcessed: updatedRecentlyProcessed.map(row => ({
        name: `${row[1]} ${row[2]}`,
        party: row[0],
        timestamp: row[11] || 'Recently'
      }))
    };

    console.log('✨ Processing complete:', response);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    });
  } catch (error) {
    console.error('❌ Fatal error:', error);
    return NextResponse.json({ 
      error: error.message,
      errorDetail: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    });
  }
}