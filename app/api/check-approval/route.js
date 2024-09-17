import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

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

      const htmlTemplate = `...`; // Your existing HTML template

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
        acc.push(index + 2); // +2 because we start from A2 and sheets are 1-indexed
      }
      return acc;
    }, []);

    if (rowsToDelete.length > 0) {
      // Sort in descending order to avoid shifting issues when deleting
      rowsToDelete.sort((a, b) => b - a);

      const requests = rowsToDelete.map(rowIndex => ({
        deleteDimension: {
          range: {
            sheetId: 0, // Assuming UNAPPROVED is the first sheet. Adjust if necessary.
            dimension: 'ROWS',
            startIndex: rowIndex - 1,
            endIndex: rowIndex
          }
        }
      }));

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: { requests }
      });
    }
  } catch (error) {
    console.error('Error removing rows from UNAPPROVED:', error);
  }
}

async function getUnapproved(sheets){
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'UNAPPROVED!A2:J',
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
          timestamp  // Use the passed timestamp
        ]]
      }
    });
    console.log('updateApprovedList success ✅')
  } catch (error) {
    console.error('updateApprovedList failed ❌', error)
    throw error;  // Re-throw the error so it's not silently caught
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

    const response = await getUnapproved(sheets);
    const rows = response.data.values;

    if (rows && rows.length) {
      const results = await processInBatches(sheets, rows);
      
      // Collect emails of successfully processed rows
      const emailsToRemove = results
        .filter(result => result.success)
        .map(result => result.email);

      // Remove processed rows from UNAPPROVED sheet
      if (emailsToRemove.length > 0) {
        await removeFromUnapproved(sheets, emailsToRemove);
      }

      return NextResponse.json({ message: 'Approval process completed', results }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No rows to process' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error in approval process' }, { status: 500 });
  }
}